// Jumbled: a drag-and-drop word game.
//
// Each round shows a quote with its letters scattered along the bottom of the
// board. Drag every letter onto its matching slot to finish the round.
//
// Expects jQuery and a global `phrases` array of "quote text|Author" strings.

const MIN_FONT_REM = 1.125
const MAX_FONT_REM = 5
const FONT_FIT_STEPS = 12 // binary-search iterations when fitting the quote to the board
const ALPHABET_SIZE = 26
const ROUND_START_DELAY_MS = 1000

const randomInt = (max) => Math.floor(Math.random() * max)
const clamp = (value, min, max) => Math.min(Math.max(value, min), max)
const lettersOnly = (text) => text.replace(/[^a-z]/g, '')

// Disable the right-click menu so it can't interrupt dragging.
window.oncontextmenu = () => false

// `var` keeps Game on `window` for any other script or inline handler that uses it.
var Game = {

	// Colors for the draggable letters.
	colors: ['pink', 'red', 'Orange', 'gold', 'DarkKhaki', 'lime', 'cyan', 'DodgerBlue', 'Magenta'],

	// Files in ./backgrounds/ used at random for each round.
	backgroundImages: [
		'beach.jpg', 'bears.jpg', 'colorado.jpg', 'cubs.jpg', 'desert.jpg', 'field.jpg',
		'fish.jpg', 'flowers.jpg', 'palm_trees.jpg', 'poppies.jpg', 'red_rocks.jpg',
		'river.jpg', 'snowy.jpg', 'trees.jpg', 'tulips.jpg', 'waterfall.jpg',
	],

	gameBoard: $('.game-board'),

	// Index of the current phrase, persisted so players resume where they left off.
	round: Number(localStorage.getItem('round')) || 0,

	// completedRounds[i] is 1 once round i has been solved. Persisted in localStorage.
	completedRounds: JSON.parse(localStorage.getItem('rounds') || '[]'),

	// Drag state.
	isDown: false,
	dragLetter: null, // the draggable letter element currently being moved
	found: null, // the drop target the dragged letter is hovering over, if any

	// Height of one letter in pixels, measured after the font is fitted.
	letterHeight: 50,

	// Area within which letters may be dragged.
	bounds: { left: 0, right: 0, top: 0, bottom: 0 },


	/** One-time setup: validate data, build the level menu and wire up events. */
	init() {
		Game.validatePhrases()
		Game.buildLevelMenu()
		Game.setActiveLevel()
		Game.bindControls()
		Game.bindDragging()
	},


	/** Development-time sanity checks on the phrase data. Problems are shown in an alert. */
	validatePhrases() {
		let previous = ''

		phrases.forEach(phrase => {
			if (lettersOnly(phrase) === lettersOnly(previous)) {
				alert('duplicate: ' + previous)
			}
			previous = phrase

			// NOTE: because of the `|`, this only requires the phrase to START with
			// or END with allowed characters, so it is much more lenient than it looks.
			if (!/^[a-z,.-:;' ?!]+|[a-z .!?]+$/.test(phrase)) {
				alert('invalid characters ' + phrase)
			}

			// Anything beyond plain ASCII is unexpected.
			if (/[^\x00-\x7E]/.test(phrase)) {
				alert(phrase)
			}
		})
	},


	/** Fills the level menu with one numbered entry per phrase. */
	buildLevelMenu() {
		const items = phrases.map((_, index) =>
			$('<li/>')
				.addClass(Game.completedRounds[index] ? 'complete' : '')
				.text(index + 1)
				.click(() => Game.selectRound(index))
		)
		$('.selectLevel').append(items)
	},


	/** Jumps to the given round from the level menu. */
	selectRound(index) {
		Game.round = index
		localStorage.setItem('round', Game.round)
		Game.setActiveLevel()
		Game.gameBoard.empty()
		$('.menuDialog').removeAttr('open')
		setTimeout(Game.run, ROUND_START_DELAY_MS)
	},


	/** Highlights the current round in the level menu and scrolls it into view. */
	setActiveLevel() {
		$('.selectLevel li.active').removeClass('active')
		$('.selectLevel li').eq(Game.round).addClass('active')[0].scrollIntoView({ block: 'center' })
	},


	/** Wires up the hint, menu and next-round buttons. */
	bindControls() {
		$('.hintButton').on('click', Game.showHints)

		$('.menuButton').on('click', () => {
			$('.menuDialog').attr('open', 'open')
		})

		// Any button inside a dialog closes that dialog.
		$('dialog button, .menuDialog button').on('click', function () {
			$(this).closest('dialog, .menuDialog').removeAttr('open')
		})

		$('.nextRound').on('click', () => {
			$('.nextRound').hide()
			Game.gameBoard.empty()
			$('.instructions').hide()
			setTimeout(Game.run, ROUND_START_DELAY_MS)
		})
	},


	/** Highlights a few unsolved slots (roughly one per 12 letters, at least one). */
	showHints() {
		const hintCount = Math.max(1, Math.floor($('.drop-target').length / 12))

		for (let i = 0; i < hintCount; i++) {
			const candidates = $('.drop-target:not(.correct):not(.hinted)')
			$(candidates[randomInt(candidates.length)]).addClass('hinted')
		}
	},


	/** Wires up mouse and touch dragging on the board. */
	bindDragging() {
		// A press on the board itself (not on a letter) drops any previous selection.
		Game.gameBoard.on('mousedown', () => {
			Game.isDown = true
			Game.dragLetter = null
		})
		Game.gameBoard.on('touchmove mousemove', Game.onDragMove)
		Game.gameBoard.on('touchend mouseup', Game.onDragEnd)
	},


	onDragMove(event) {
		const nativeEvent = event.originalEvent || event

		const isMouseHover = nativeEvent.type === 'mousemove' && !Game.isDown
		if (isMouseHover || !Game.dragLetter) return

		const pointer = nativeEvent.targetTouches ? nativeEvent.targetTouches[0] : nativeEvent

		Game.moveDraggedLetter(pointer)
		Game.found = Game.findDropTarget(pointer)

		// Stop the page from scrolling while a letter is being dragged.
		nativeEvent.preventDefault()
	},


	/** Moves the dragged letter under the pointer, keeping it inside the play area. */
	moveDraggedLetter(pointer) {
		const half = Game.letterHeight / 2
		const { left, right, top, bottom } = Game.bounds

		$(Game.dragLetter).css({
			position: 'fixed',
			left: clamp(pointer.pageX - half, left, right - half * 1.5),
			top: clamp(pointer.pageY - half, top, bottom - half * 2),
		})
	},


	/** Returns the unsolved slot under the pointer that matches the dragged letter, if any. */
	findDropTarget(pointer) {
		const reach = Game.letterHeight / 3
		const openSlots = document.querySelectorAll('.drop-target:not(.correct)')

		return Array.from(openSlots).find(slot => {
			const rect = slot.getBoundingClientRect()
			const dx = Math.abs(rect.left + rect.width / 2 - pointer.clientX)
			const dy = Math.abs(rect.top + rect.height / 2 - pointer.clientY)

			return dx < reach && dy < reach && slot.dataLetter === Game.dragLetter.dataLetter
		})
	},


	/** On release, locks the letter into its slot if it was dropped on the right one. */
	onDragEnd() {
		Game.isDown = false

		if (!Game.found || !Game.dragLetter) return

		Game.found.classList.add('correct')
		$(Game.dragLetter).hide()
		Game.dragLetter = null
		Game.found = null

		if ($('.drop-target:not(.correct)').length === 0) {
			Game.completeRound()
		}
	},


	/** Records the finished round, advances to the next one and shows the "next" button. */
	completeRound() {
		Game.completedRounds[Game.round] = 1
		localStorage.setItem('rounds', JSON.stringify(Game.completedRounds))
		$('.selectLevel li.active').addClass('complete')

		Game.round = (Game.round + 1) % phrases.length
		localStorage.setItem('round', Game.round)
		Game.setActiveLevel()

		$('.draggable').hide()
		$('.nextRound').show()
		$('.game-board .filler').hide()
	},


	/** Creates a scattered, randomly colored and tilted draggable letter. */
	createLetter(letter) {
		const element = document.createElement('span')
		element.textContent = letter
		element.classList.add('draggable')
		element.style.color = Game.colors[randomInt(Game.colors.length)]
		element.style.transform = `rotate(${randomInt(30) - 15}deg)`
		element.dataLetter = letter

		$(element).on('touchstart mousedown', event => {
			// Keep the board's own mousedown handler from clearing this selection.
			event.stopPropagation()
			Game.dragLetter = event.currentTarget
			Game.isDown = true
		})

		return element
	},


	/** Starts the current round: picks a background, builds the board and lays it out. */
	run() {
		const image = Game.backgroundImages[randomInt(Game.backgroundImages.length)]
		$('.pastels').css({ backgroundImage: `url(./backgrounds/${image})` })

		Game.gameBoard.empty()
		$('.nextRound').hide()
		$('.level').text('Round ' + (Game.round + 1))

		const [quote, author] = phrases[Game.round % phrases.length].split('|')
		Game.buildBoard(quote, author)
		Game.layoutBoard()
	},


	/**
	 * Builds one slot per character of the quote, grouped by word.
	 * Letters get a drop target with a draggable letter inside; punctuation is shown as already solved.
	 */
	buildBoard(quote, author) {
		const displayText = '\u201C' + quote + '\u201D' // wrapped in curly quotes

		displayText.split(' ').forEach(word => {
			const wordWrapper = $('<div/>').addClass('word-wrapper')
			Game.gameBoard.append(wordWrapper)

			word.toUpperCase().split('').forEach(letter => {
				const slot = document.createElement('span')
				slot.textContent = letter
				slot.dataLetter = letter
				wordWrapper.append(slot)

				if (/[^A-Z]/.test(letter)) {
					slot.classList.add('correct')
				} else {
					slot.classList.add('drop-target')
					slot.appendChild(Game.createLetter(letter))
				}
			})
		})

		Game.gameBoard.append(
			$('<div/>').addClass('word-wrapper width-full author').text(author || ''),
			// Empty row that marks where the board's content ends and the loose letters begin.
			$('<div/>').addClass('word-wrapper width-full filler')
		)
	},


	/** Sizes the quote to fit the board and scatters the loose letters. Also runs on window resize. */
	layoutBoard() {
		Game.updateDragBounds()

		// Reset letters to a known position before measuring the board.
		$('.draggable').css({ top: 50, left: 50 })

		Game.fitFontToBoard()
		Game.scatterLetters()
	},


	updateDragBounds() {
		const wrapper = $('.game_wrapper')
		const position = wrapper.position()

		Game.bounds = {
			left: position.left,
			right: position.left + wrapper.width(),
			top: position.top + $('.app_bar').height(),
			bottom: position.top + wrapper.height(),
		}
	},


	/** Finds the largest font size at which the quote still fits, then measures a letter. */
	fitFontToBoard() {
		const board = Game.gameBoard
		let smallest = MIN_FONT_REM // largest size known to fit
		let largest = MAX_FONT_REM // smallest size known to overflow

		for (let step = 0; step < FONT_FIT_STEPS; step++) {
			const size = (smallest + largest) / 2
			board.css({ fontSize: size + 'rem' })

			const overflows = board[0].scrollHeight > board.height() || board[0].scrollWidth > board.width()
			if (overflows) {
				largest = size
			} else {
				smallest = size
			}
		}

		board.css({ fontSize: smallest + 'rem' })
		Game.letterHeight = $('.draggable').height()
	},


	/**
	 * Spreads the loose letters in the area below the quote.
	 * Each letter's horizontal position follows its place in the alphabet; the vertical position is random.
	 */
	scatterLetters() {
		const wrapperHeight = $('.game_wrapper').height()
		const boardWidth = Game.gameBoard.width()
		const letterHeight = Game.letterHeight

		const areaTop = Math.min($('.filler').position().top, wrapperHeight - letterHeight * 4)
		const areaHeight = Math.max(0, wrapperHeight - areaTop - letterHeight * 1.5)
		const columnWidth = (boardWidth - letterHeight * 0.5) / ALPHABET_SIZE

		$('.draggable').each(function () {
			const alphabetIndex = this.dataLetter.charCodeAt(0) - 'A'.charCodeAt(0)

			$(this).css({
				left: Math.floor(columnWidth * alphabetIndex),
				top: randomInt(areaHeight) + areaTop,
			})
		})
	},


	/** Restarts from the first round. (Does not clear saved progress.) */
	reset() {
		Game.round = 0
		Game.run()
	},
}


Game.init()
Game.run()

window.onresize = Game.layoutBoard