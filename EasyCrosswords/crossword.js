
$('.title').click(function() {
	//$('.letter:empty, .letter.wrong').removeClass('.wrong').text('x')
})



//localStorage.removeItem('crossword')
//localStorage.removeItem('crosswordLevel')


//crossword, crosswordSet, crosswordThemed, crosswordRandom, crosswordThemes, crosswordRandoms

var search = 'http://www.oneacross.com/cgi-bin/search_banner.cgi?c0=x&p0='

var showErrors = localStorage.getItem('showErrors') != 'no'
var markVowels = localStorage.getItem('markVowels') || 'no'



$('.tabs label').click(function() {
	$('.tabs label.active, .tabs ~ div.active').removeClass('active')
	$(this).addClass('active')
	$('.tabs ~ div.' + $(this).text().toLowerCase()).addClass('active')
})

$('.showErrors').click(function() {
	$('body').toggleClass('show-errors', $('.showErrors').is(':checked'))
	localStorage.setItem('showErrors', $('.showErrors').is(':checked') ? 'yes' : 'no')
	showErrors = $('.showErrors').is(':checked')
})

$('.markVowels').click(function() {
	$('body').toggleClass('mark-vowels')
	localStorage.setItem('markVowels', $('.markVowels').is(':checked') ? 'yes' : 'no')
})

$('body').toggleClass('show-errors', showErrors)
$('body').toggleClass('mark-vowels', markVowels === 'yes')

if (showErrors) {
	$('.showErrors').attr('checked', true)
} else {
	$('.showErrors').removeAttr('checked')
}

if (markVowels === 'yes') {
	$('.markVowels').attr('checked', true)
} else {
	$('.markVowels').removeAttr('checked')
}

$('.startButton').click(function (){

	$('.nextCover').hide()

	$('.loading').show()
	$('.shell').empty()

	setTimeout(function() {
		Game.create()
		Game.build()
		$('.loading').hide()
	}, 500)
})


$('.gameSize').change(function() {
	Game.size = $('.gameSize').val()
	localStorage.setItem('crosswordSize', Game.size)
	$('.levels span.active').click()
})

$('dialog').hide()

Math.seed = 1;
Math.psuedo = function() {
	Math.seed = (Math.seed > 1) ? Math.seed / 1000 : (Math.sin(Math.seed) * 10000) % 1
	return Math.seed
}

var rnd = function(num) { return (typeof num == 'undefined' ? Math.psuedo() : Math.floor(Math.psuedo()*num)) }


$('.hints, #clue').click(function() {
	$('.showVowels').prop('disabled', !$('.word.vowel:empty, .word.vowel.wrong').length)
	$('.hintsDialog').attr('open', true).show()
})


$('.hintsDialog .showNext').click(function () {
	$('.letter.active').removeClass('active')
	var w = $('.word.wrong, .word:empty').first().addClass('active')
	var x = w.data('x')
	var y = w.data('y')
	$('[data-letter="'+Game.grid[y][x].letter+'"]').trigger('touchstart')
})


$('.hintsDialog .showVowels').click(function () {

	var ret = $('.word:not(.vowel):empty').get(0)

	$('.word.vowel').each(function() {

		$('.letter.active').removeClass('active')
		var w = $(this).addClass('active')
		var x = w.data('x')
		var y = w.data('y')
		$('[data-letter="'+Game.grid[y][x].letter+'"]').trigger('touchstart')

	})

	if (ret) {
		Game.selectLetter(ret)
	}

})


$('.hintsDialog .searchWeb').click(function () {
	var z = []
	$('.word').each(function() {
		z.push($(this).text() || '?')
	})
	window.open(search.replace('x', $('#clue').text()) + z.join('').toUpperCase())
})

$('.hintsDialog button').click(function () {
	$('.hintsDialog').removeAttr('open').hide()
})


$('.lastWord').click(function () {
	Game.sound('audio_swoosh')
	do {
		Game.wordIndex = (Game.wordIndex + Game.wordList.length-1) % Game.wordList.length
		var word = Game.wordList[Game.wordIndex]
		Game.dir = word.dir
		while(
			$('.letter:empty').length != 0
			&& $('#b-' + word.y + '-'+ word.x).length
			&& !$('#b-' + word.y + '-'+ word.x).is(':empty')
			&& (
				showErrors
				? !$('#b-' + word.y + '-'+ word.x).hasClass('wrong')
				: true
			)
		) {
			if (word.dir == 0) {
				word.x++
			} else {
				word.y++
			}
		}
	} while($('#b-' + word.y + '-'+ word.x).length == 0 || $('#b-' + word.y + '-'+ word.x).hasClass('empty'))
	$('#b-' + word.y + '-'+ word.x).click()
})

$('.nextWord').click(function () {
	Game.sound('audio_swoosh')
    goToNext()
})

function goToNext() {
	do {
		Game.wordIndex = (++Game.wordIndex % Game.wordList.length)
		var word = Game.wordList[Game.wordIndex]
		Game.dir = word.dir

		while(
			$('.letter:empty').length != 0
			&& $('#b-' + word.y + '-'+ word.x).length
			&& !$('#b-' + word.y + '-'+ word.x).is(':empty')
			&& (
				showErrors
				? !$('#b-' + word.y + '-'+ word.x).hasClass('wrong')
				: true
			)
		) {
			if (word.dir == 0) {
				word.x++
			} else {
				word.y++
			}
		}

	} while($('#b-' + word.y + '-'+ word.x).length == 0 || $('#b-' + word.y + '-'+ word.x).hasClass('empty'))

	$('#b-' + word.y + '-'+ word.x).click()
}


$('.changeLevel').click(function() {
	Game.setLevel(Game.newLevel)
	$('.loading').show()
	$('.shell').empty()
	setTimeout(function() {
		Game.create()
		Game.build()
		$('.loading').hide()
	}, 500)
	$('dialog').hide()
})


/* colors */

var colors = [
	['#000000', '#4C4C4C', '#990000', '#994C00', '#999900', '#009900', '#004C4C', '#009999', '#004C99', '#4C0099', '#990099'],
	['#FFFFFF', '#CCCCCC', '#FF9999', '#FFCC99', '#FFFF99', '#99FF99', '#99CCCC', '#99FFFF', '#99CCFF', '#CC99FF', '#FF99FF']
]

var defaultColorTheme = {
	background: '#000000',
	empty: '#000000',
	clue: '#4C4C4C',
	keyboard: '#FFFFFF',
}

var colorTheme = JSON.parse(localStorage.getItem('crosswordColorTheme') || JSON.stringify(defaultColorTheme))

Object.keys(colorTheme).forEach(function(colorKey) {
	setColor(colorKey, colorTheme[colorKey], colors[0].indexOf(colorTheme[colorKey]) != -1 ? 'white' : 'black')
	$('.' + colorKey + 'Color').click(function() {
		Game.colorKey = colorKey
		$('.colorPickerDialog').attr('open', true).show()
	})
	$('.' + colorKey + 'Color s').css({ backgroundColor: colorTheme[colorKey] })
})

$('#xboard-wrapper, .selectColorsButton').click(function() {
	$('dialog').hide()
	$('.selectColorsDialog').attr('open', true).show()
})

$('.resetColors').click(function(event) {
	colorTheme = Object.assign({}, defaultColorTheme)
	localStorage.setItem('crosswordColorTheme', JSON.stringify(colorTheme))
	Object.keys(colorTheme).forEach(function(colorKey) {
		setColor(colorKey, colorTheme[colorKey], colors[0].indexOf(colorTheme[colorKey]) != -1 ? 'white' : 'black')
		$('.' + colorKey + 'Color s').css({ backgroundColor: colorTheme[colorKey] })
	})
})

function setColor(colorKey, color, textColor) {
	switch(colorKey) {
		case 'background':
			$('html, body').css({ background: color, color: textColor })
		break

		case 'empty':
			var sheet = document.createElement('style')
			sheet.innerHTML = '.empty { background-color: ' + color + ';}';
			document.body.appendChild(sheet);
		break

		case 'clue':
			$('.clue-wrapper').css({ background: color, color: textColor })
		break

		case 'keyboard':
			$('nav').css({ background: color, color: textColor })
		break
	}
}

$('.colorPickerDialog main').empty().append(
	colors.map(function(row, shade) {
		return $('<div/>').append(
			row.map(function(color) {
				return $('<s/>').css({ background: color }).click(function() {
					var textColor = ['white', 'black'][shade]

					setColor(Game.colorKey, color, textColor)

					$('.' + Game.colorKey + 'Color s').css({ background: color })
					$('.colorPickerDialog').removeAttr('open').hide()

					colorTheme[Game.colorKey] = color
					localStorage.setItem('crosswordColorTheme', JSON.stringify(colorTheme))
				})
			})
		)
	})
)

/* */


function resetHintTimer() {
	$('.clue-wrapper').removeClass('tap-for-hint')
	clearTimeout(Game.hintTimeout)
	Game.hintTimeout = setTimeout(function () {
		$('.clue-wrapper').addClass('tap-for-hint')
	}, 30000)
}


var Game = {
	sizes: [18,17,16,15,14,13,12,11,10],
	size: localStorage.getItem('crosswordSize') || 15,
	dims: 15,
	wordList: [],
	wordIndex: 0,
	letterCount: 0,
	level: 1,
	puzzle: null,
	wordCount: 0,

	use_sounds: localStorage.getItem('use_sounds') != 0,
	audio: {
		audio_word_delete: './sounds/clunk.mp3',
		audio_word_fail: './sounds/jammed.mp3',
		audio_word_okay: './sounds/click.mp3',
		audio_swoosh: './sounds/swoosh.mp3',
		audio_level_complete: './sounds/zapsplat_multimedia_game_retro_musical_success_003_21514.mp3',
	},
	sound: function(sound) {
		if (Game.use_sounds) {
			console.log(sound, Game[sound])
			if (Game.last_sound) {
				Game[Game.last_sound].pause()
				Game[Game.last_sound].currentTime = 0
			}
			Game.last_sound = sound
			Game[sound].play()
		}
	},

	handleKey: function() {
		$(this).addClass('key-highlight')
		setTimeout(function() {
			$('.key-highlight').removeClass('key-highlight')
		}, 250)

		var letter = $(this).text()
		var active = $('.letter.active')
		var x = parseInt(active.attr('data-x'))
		var y = parseInt(active.attr('data-y'))

		if (letter === '<') {
			if (!active.hasClass('wrong') || active.text() === '') {
				if (Game.dir === 1) {
					x -= 1
					var prev = active.prev()
				} else {
					y -= 1
				}
				var prev = $('#b-'+x+'-'+y)
				if (prev.hasClass('letter')) {
					//	active.removeClass('active')
					active = prev//.addClass('active')


				} else {
					var wrong = $('.wrong')
					if (wrong.length) {
						active = wrong.last()
					}
				}

				Game.selectLetter(active)

			}
		}

		switch(letter) {
			case '<':
			if (active.hasClass('wrong')) {
				active.text('')
				if (Game.grid[y] && Game.grid[y][x]) {
					Game.grid[y][x].text = ''
				}
				localStorage.setItem('crossword', JSON.stringify(Game.grid))
			}
			Game.sound('audio_word_delete')
			return false
			case '*':
			case '=':
			return false
		}

		active.toggleClass('wrong', Game.grid[y][x].letter !== letter)

		if (Game.grid[y][x].letter == letter) {
			resetHintTimer()
		}

		if (Game.grid[y][x].letter == letter || !showErrors) {
			Game.sound('audio_word_okay')
		} else {
			Game.sound('audio_word_fail')
		}

		active.text(letter)

		Game.grid[y][x].text = letter

		localStorage.setItem('crossword', JSON.stringify(Game.grid))

		if (Game.dir == 1) {
			var next = active.next()
			while(next.hasClass('letter') && (next.text() !== '' && !next.hasClass('wrong'))) {
				next = next.next()
			}
		} else {
			var next = $('#b-'+x+'-'+(++y))
			while(next.hasClass('letter') && (next.text() !== '' && !next.hasClass('wrong'))) {
				next = $('#b-'+x+'-'+(++y))
			}
		}

		if (next.hasClass('letter')) {
			active.removeClass('active')
			next.addClass('active')
		} else {
            goToNext()
			//next = $('.letter:empty:first')
			//if (next.length) {
			//	active.removeClass('active')
			//	next.addClass('active')
			//	.trigger('click')
			//}
		}

		if ($('.letter:empty').length == 0) {
			$('body').addClass('has-wrong')
		}

		if ($('.letter:empty, .letter.wrong').length == 0) {

			Game.sound('audio_level_complete')

			$('body').removeClass('has-wrong')

			if (Game.set == 'Themed') {
				Game.progress.Themed[Game.theme] = (Game.progress.Themed[Game.theme] ? Game.progress.Themed[Game.theme]+1 : 1)
				localStorage.setItem('crosswordThemes', JSON.stringify(Game.progress.Themed))
				//find next themed or jump to next random
				if (++Game.level > Object.keys(themes).length && Game.set == 'Themed') {
					Game.level = 1
				}
			} else {
				Game.progress.Randoms[Game.level] = (Game.progress.Randoms[Game.level] ? Game.progress.Randoms[Game.level]+1 : 1)
				localStorage.setItem('crosswordRandoms', JSON.stringify(Game.progress.Randoms))
				Game.level++
			}

			Game.setLevel(Game.level)

			localStorage.removeItem('crossword')

			setTimeout(function() {
				$('.doneDialog').attr('open', true).show()
				$('.nextCover').show()
			}, 500)
		}

		return false
	},



	init: function() {

		for(audio in Game.audio) {
			Game[audio] = new Audio(Game.audio[audio])
			Game[audio].load()
		}

		$('.gameSize').val(Game.size)
		$('.playSounds').attr('checked', Game.use_sounds).click(function() {
			Game.use_sounds = $('.playSounds').is(":checked") ? 1 : 0
			localStorage.setItem('use_sounds', Game.use_sounds ? 1 : 0)
		})

		Game.progress = {
			Themed: JSON.parse(localStorage.getItem('crosswordThemes') || '{}'),
			Randoms: JSON.parse(localStorage.getItem('crosswordRandoms') || '{}'),
		}

		Game.set = localStorage.getItem('crosswordSet') || 'Themed'

		if (Object.keys(themes).length == 0) {
			Game.set = 'Random'
			$('.tabs, .themed.levels').hide()
		}

		if (localStorage.getItem('crosswordLevel')) {
			if ($('html').hasClass('christmas_crossword')) {
				Game.set = 'Random'
				localStorage.setItem('crosswordSet', 'Random')
				localStorage.setItem('crosswordRandom', localStorage.getItem('crosswordLevel'))
			} else {
				Game.set = 'Themed'
				localStorage.setItem('crosswordSet', 'Themed')
				localStorage.setItem('crosswordThemed', Object.keys(themes)[localStorage.getItem('crosswordLevel')-1])
			}
			localStorage.removeItem('crosswordLevel')
		}

		Game.wordList = JSON.parse(localStorage.getItem('crosswordWordList') || '[]')

		if (Game.wordList.length > 0) {
			$('.clue-wrapper strong').show();
		}

		$('.tabs label:contains('+Game.set+')').click()

		//Math.seed = Math.ceil(Game.level / 10)

		//Game.puzzle = themes[Object.keys(themes)[Game.level-1]]

		//$('.title').text(Object.keys(themes)[Game.level-1])

		if (Game.set == 'Themed') {
			Game.level = Math.max(1, Object.keys(themes).indexOf(localStorage.getItem('crosswordThemed')) + 1)
			Game.title = Object.keys(themes)[Game.level-1]
			Game.puzzle = themes[Object.keys(themes)[Game.level-1]]
		} else {
			Game.level = (localStorage.getItem('crosswordRandom') || 1)*1
			Game.title = 'Crossword #' + Game.level
			Game.puzzle = Object.assign({}, allWords)
		}

		Game.setLevel(Game.level)

		Math.seed = Math.ceil(Game.level / 10)

		$('.title').text(Game.title)


		var keys = [
			'qwertyuiop',
			'asdfghjkl',
			'zxcvbnm<'
		]

		//build keyboard
		keys.forEach(function(ks) {
			var row = $('<div/>')
			ks.split('').forEach(function(k) {
				row.append($('<u/>').text(k).attr('data-letter', k).bind('touchstart mousedown', Game.handleKey))
			})
			$('nav').append(row)
		})

		$('body').bind('keydown', function(event) {
			if (false && $('nav').is(':visible')) {
				$('nav u').css({ height: 0, color: 'transparent'})
				$('nav u.backspace').css({ visibility: 'hidden'})
				window.onresize()
			}
			switch(event.keyCode) {
				case 8:
				$('[data-letter="<"]').trigger('touchstart')
				break

				case 38:
				console.log('up')
				//$('.letter.active')
				break
				case 40:
				console.log('down')
				break
				case 37:
				console.log('left')
				break
				case 39:
				console.log('right')
				break

				default:
				if (event.keyCode >= 65 && event.keyCode <= 90) {
					$('[data-letter="' + event.key + '"]').trigger('touchstart')
				}
				break
			}
		})

		$('nav div:last-child u:last-child').addClass('backspace')//.html('&#9003;')

		$('nav div:last-child').prepend('<i><span  class="menuButton">&#9776;</span></i>')

		$('nav div:last-child').append('<i><span  class="helpButton">?</span></i>')

		$('.helpButton').click(function() {
			$('.helpDialog').attr('open', true).show()
		})

		$('.menuButton').click(function() {
			$('.menuDialog').attr('open', true).show()
			setTimeout(function() {
				$('.levels span.active')[0] && $('.levels span.active')[0].scrollIntoView()
			})
		})


		$('dialog footer button, .doneDialog').click(function() {
			$(this).closest('dialog').removeAttr('open').hide()
		})

		var grid = localStorage.getItem('crossword')

		if (grid) {
			$('.shell').empty()
			Game.grid = JSON.parse(grid)
			Game.dims = Game.grid.length
			Game.build()
			$('.loading').hide()
		} else {
			Game.dims = Game.size
			$('.loading').show()
			$('.shell').empty()
			setTimeout(function() {
				Game.create()
				Game.build()
				$('.loading').hide()
			}, 500)

			$('.helpDialog').attr('open', 'open').show()
		}

	},


	setLevel: function(level) {
		Game.level = parseInt(level)
		Game.set = $('.tabs label.active').text()
		localStorage.setItem('crosswordSet', Game.set)
		//localStorage.setItem('crosswordLevel', Game.level)

		if (Game.set == 'Themed') {
			Game.theme = Object.keys(themes)[level-1]
			localStorage.setItem('crosswordThemed', Game.theme)
		} else {
			Game.random = level
			localStorage.setItem('crosswordRandom', Game.random)
		}

		$('.levels').empty()

		Object.keys(themes).forEach(function(key, i) {
			$('.themed').attr('tabIndex', -1).append(
				$('<span/>').text(key).addClass('level'+(i+1)).attr('data-progress', (Game.progress.Themed[key] || '')).data('level', i+1).click(function() {
					Game.newLevel = $(this).data('level')
					$('.changeLevelDialog').attr('open', true).show()
				})
			)
		})

		$('.themed span').click(function () {
			Game.newLevel = $(this).data('level')
			$('.changeLevelDialog').attr('open', true).show()
		})

		$('.themed span').removeClass('active')
		if (Game.set == 'Themed') {
			$('.themed .level'+Game.level).addClass('active')
		}

		for(var i = 0; i<100; i++) {
			$('.random').attr('tabIndex', -1).append(
				$('<span/>').text(i+1).addClass('level'+(i+1)).attr('data-progress', (Game.progress.Randoms[i+1] || '')).data('level', i+1).click(function() {
					Game.newLevel = $(this).data('level')
					$('.changeLevelDialog').attr('open', true).show()
				})
			)
		}

		$('.random span').click(function () {
			Game.newLevel = $(this).data('level')
			$('.changeLevelDialog').attr('open', true).show()
		})

		$('.random span').removeClass('active')
		if (Game.set == 'Random') {
			$('.random .level'+Game.level).addClass('active')
		}
	},


	selectLetter: function(box) {
		$('.letter.active').removeClass('active')
		$(box).addClass('active')
		resetHintTimer()

		var x = $(box).data('x')
		var y = $(box).data('y')

		if (!Game.grid[y][x].words[Game.dir]) {
			Game.dir = (++Game.dir%2)
		}

		var key = Game.grid[y][x].words[Game.dir].key.toLowerCase()

		var wordObj = Game.grid[y][x].words[Game.dir]

		Game.wordList.forEach(function(pos, index) {
			if (pos.x === wordObj.pos.w && pos.y === wordObj.pos.h && pos.dir === Game.dir) {
				Game.wordIndex = index
			}
		})

		Game.clueText = Game.puzzle[key]
		|| (allWords[Object.keys(allWords).find(function(k) { return k.toLowerCase() === key })] || [])
		|| ('unscramble: '+key.toUpperCase().split('').sort().join(''))

		if (Array.isArray(Game.clueText)) {
			Game.clueText = Game.clueText[0] || ('unscramble: '+key.toUpperCase().split('').sort().join(''))
		}

		if (Array.isArray(Game.clueText) && !Game.clueText.length) {
			Game.clueText = (Game.grid[y][x].words[Game.dir].key.toUpperCase().split('').sort().join(''))
		}

		var clueText = Game.clueText.replace(/[\u2018\u2019\u201A\u201B\u2032\u2035]/gi, "'")
		.replace(/\u20AC/gi, "").replace(/\u2122/gi, "'")
		.replace(/[^\x00-\x7F]/gi, ' ')

		var count = Game.grid[y][x].words[Game.dir].count

		if (count>1) {
			clueText += ' (' + count + ')'
		}

		$('#clue').text(clueText[0].toUpperCase() + clueText.slice(1))

		var wordNum = $(box).attr('data-word-'+Game.dir)

		$('.word').removeClass('word')

		$('[data-word-'+Game.dir+'='+wordNum+']').addClass('word')

	},


	build: function() {

		resetHintTimer()

		Game.dir = 0

		$('.shell').empty()

		var number = 0

		//place squares
		Game.grid.forEach(function(row, y) {
			var rowElement = $('<div class="row"/>')

			row.forEach(function(letter, x) {

				rowElement.append(
					$('<b/>')
					.addClass(letter.letter === '.' ? 'empty' : 'letter')
					.attr('id', 'b-'+x+'-'+y)
					.attr('data-letter', letter.letter)
					.attr('data-x', x)
					.attr('data-y', y)
					.attr('data-word-0', (Game.grid[y][x].words[0] || {}).wordNum)
					.attr('data-word-1', (Game.grid[y][x].words[1] || {}).wordNum)
					.attr('data-number', Game.grid[y][x].number ? ++number : null)
					.text(Game.grid[y][x].text || '')
					.addClass(Game.grid[y][x].text && Game.grid[y][x].text !== Game.grid[y][x].letter ? 'wrong':'')
					.addClass('aeiou'. indexOf(Game.grid[y][x].letter) !== -1 ? 'vowel':'')
					.click(function(event) {

						if ($(this).hasClass('empty')) {
							return
						}

						event.stopPropagation()

						if ($(this).hasClass('active')) {
							Game.dir = (++Game.dir%2)
						} else {
							$('.letter.active').removeClass('active')
							$(this).addClass('active')
						}

						Game.selectLetter(this)

						var pos = Game.grid[$(this).data('y')][$(this).data('x')].words[Game.dir].pos

						var firstLetter = $('#b-'+pos.h+'-'+pos.w)

						if (firstLetter.attr('data-number')) {
							$('#clue').attr('data-number', firstLetter.attr('data-number') + (Game.dir ? ' across' : ' down'))
						}

					}))
				})

				$('.shell').append(rowElement)

			})

			$('.letter:not(.empty):empty').first().trigger('click')


		},


		prep: function () {

			$('.shell').empty()

			Game.grid = []

			Game.dims = Game.size

			//blank fill
			for(var j=0;j<this.dims;j++) {
				Game.grid[j] = []
				for(var i=0;i<this.dims;i++) {
					Game.grid[j][i] = {
						letter: '.',
						words: []
					}
				}
			}
		},


		placeWord: function(word, w, h, dir, must_overlap) {
			var keys = Game.keys
			var index = -1
			var key = word.toLowerCase().replace(/[^A-Z]/gi, '')

			if (w === -1) {
				w = Game.dims - key.length
			}
			if (h === -1) {
				h = Game.dims - key.length
			}

			var letters = key.split('')
			var good = true
			var x,y
			var cross = Game.cross
			var overlaps = false

			letters.forEach(function(letter, i) {

				if (dir === 0) {
					x = w+i, y = h
				} else {
					x = w, y = h+i
				}

				if (x >= Game.dims || y >= Game.dims || x < 0 || y < 0) {
					//console.log('missing '+x +', '+ y + ' ' + word + ' ' + i)
					good = false
					return
				} else if (Game.grid[x][y].letter !== '.' && Game.grid[x][y].letter !== letter) {
					//console.log('bad letter: ' + letter)
					good = false
					return
				} else if (good && Game.grid[x][y].letter === '.') {
					if (dir === 0) {
						if (
							(y > 0 && Game.grid[x][y-1].letter !== '.')
							|| (y < Game.dims-1 && Game.grid[x][y+1].letter !== '.')
						) {
							good = false
							return
						}
					} else {
						if (
							(x > 0 && Game.grid[x-1][y].letter !== '.')
							|| (x < Game.dims-1 && Game.grid[x+1][y].letter !== '.')
						) {
							good = false
							return
						}
					}
				}

				if (good && Game.grid[x][y].letter !=='.') {
					overlaps=true
				}

			})

			if (good && (must_overlap && overlaps || !must_overlap)) {

				if (dir === 0) {
					if (
						(w > 0 && Game.grid[w-1][y].letter !== '.')
						|| (x < Game.dims-1 && Game.grid[x+1][y].letter !== '.')
					) {
						good = false
					}
				} else {
					if (
						(h > 0 && Game.grid[x][h-1].letter !== '.')
						|| (y < Game.dims-1 && Game.grid[x][y+1].letter !== '.')
					) {
						good = false
					}
				}

				if (good) {

					Game.wordCount++

					Game.wordList.push({
						x: w,
						y: h,
						dir: dir
					})

					keys.splice(index, 1)

					letters.forEach(function(letter, i) {

						if (dir === 0) {
							x = w+i, y = h
						} else {
							x = w, y = h+i
						}

						cross[letter] = cross[letter] || []
						cross[letter].push({x:x,y:y,z:(dir+1)%2})

						if (i == 0) {
							Game.grid[x][y].number = true
						}

						Game.grid[x][y].letter = letter
						Game.grid[x][y].words[dir] = {
							count: word.trim().split(/[ -]/).length,
							word: key,
							pos: {
								w: w,
								h: h
							},
							key: word,
							wordNum: (Game.wordCount)
						}
					})

					//console.log(word)
					return true //it fits!
				}
			}

			return false

		},


		create: function() {
			$('.nextCover').hide()
			var indexStart = 0
			var index = indexStart

			Game.prep()
			Game.wordCount = 0
			Game.wordList = []
			var cross = Game.cross = {}

			Math.seed = Game.level / 1000

			if (Game.set == 'Themed') {
				Game.title = Object.keys(themes)[Game.level-1]
				Game.puzzle = themes[Object.keys(themes)[Game.level-1]]
				Math.seed += (Game.progress.Themed[Game.title] || 0) / 500
			} else {
				Game.title = 'Crossword #' + Game.level
				Game.puzzle = Object.assign({}, allWords)
			}

            //var z = Object.keys(Game.puzzle)
            //z.sort(function(a, b) { return b.length - a.length })
            //console.log(z)

			$('.title').text(Game.title)

			var keys = Game.keys = Object.keys(Game.puzzle)
			.filter(function(key) { return (Game.set == 'Themed' ? themes[Game.title] : allWords)[key] && key.replace(/[^a-z]/gi, '').length <= Game.dims })
			.sort(function(a, b) { return (b.replace(/[^a-z]/gi, '').length - a.replace(/[^a-z]/gi, '').length) || rnd(3)-1 }) // sort longest to shortest

			//* /put longest word in middle across
			var word = keys[Game.set == 'Themed' ? 0 : Game.level]

			console.log(keys)

			var len = word.replace(/[^a-z]/gi, '').length
			var x = Math.floor((Game.dims - len) / 2)
			var y = rnd(Game.dims)
			var dir = 1 //across

			if (Game.placeWord(word, y, x, dir, false)) {
				//console.log('placed', word)
				keys.splice(keys.indexOf(word), 1)
			}

			while (keys[0].replace(/[^a-z]/gi, '').length >= Math.min(len, 10)) {
				//console.log('removed:', keys[0])
				keys.splice(0, 1)
			}
			/* */


			[0,1,2].sort(function() { return rnd(2) }).forEach(function(slot) {
				word = keys[0]
				len = keys[0].replace(/[^a-z]/gi, '').length
				x = Game.dims - len
				y =  slot*5 + rnd(3)
				dir = 1 //across

				keys.splice(keys.indexOf(word), 1)

				if (Game.placeWord(word, y, x, dir, false)) {
					//console.log('placed')
				}

				//alert(word + ' '+x+','+y)

			})

			keys = keys.filter(function(key) { return key.replace(/[^a-z]/gi, '').length < 8 })
			keys.sort(function () { return rnd(3)-1 })

			for(var m=0;m<200;m++) {

				index = indexStart

				for(var k=0;k<Object.keys(cross).length*5;k++) {

					word = keys[++index % keys.length]

					var letters = word.toLowerCase().replace(/[^A-Z]/gi, '').split('')

					//find matching letter
					var done = false
					letters.forEach(function(letter, i) {
						if (!done && cross[letter] && cross[letter].length > 0) {
							var pos = cross[letter].pop()
							dir = pos.z
							w = pos.x - (dir==0 ? i : 0)
							h = pos.y - (dir==1 ? i : 0)

							if (Game.placeWord(word, w, h, dir, true)) {
								done = true
							} else {
								cross[letter].unshift(pos)
							}
						}
					})

					if (done) {
						keys.splice(keys.indexOf(word), 1)
					}

				}//for

			}//for


			for(var k=0;k<2;k++) {
				for(var j=0;j<Game.dims;j++) {
					for(var i=0;i<Game.dims;i++) {
						for(var dir=0;dir<2;dir++) {
							keys.some(function(key) {
								if (key.length > 2 && Game.placeWord(key, i, j, dir, true)) {
									keys.splice(keys.indexOf(key), 1)
									return true
								}
								return false
							})
						}
					}
				}
			}

			Game.wordList.sort(function(a, b) {
				return (a.dir - b.dir) || (a.x - b.x) || (a.y - b.y)
			})

			$('.clue-wrapper strong').show();

			console.log(Game.wordCount, Game.title)
			localStorage.setItem('crossword', JSON.stringify(Game.grid))
			localStorage.setItem('crosswordWordList', JSON.stringify(Game.wordList))

			setTimeout(function() {
				window.onresize()
			}, 100)


		}//create

	}//init

	setTimeout(function() {
		Game.init()
		window.onresize()
		setTimeout(function() {
			window.onresize()
		}, 1000)
	}, 0)

	window.onresize = function () {
		var boardWrapper = $('#board-wrapper')
		var gameBoard = $('#game-board')
		var size = Math.floor(window.innerWidth/Game.dims) + 1
		var minSize = 10
		do {
			size--
			gameBoard.css({fontSize: size+'px'})
		} while (size > minSize
			&& (
				gameBoard[0].scrollWidth > gameBoard[0].clientWidth+4
				|| gameBoard[0].scrollHeight > gameBoard[0].clientHeight+4
				|| boardWrapper[0].scrollWidth > boardWrapper[0].clientWidth+4
				|| boardWrapper[0].scrollHeight > boardWrapper[0].clientHeight+4
			)
		)
	}

	/*
	var size = Math.floor(window.innerWidth/Game.dims) + 1
	var minSize = Math.floor((window.innerHeight - document.querySelector('aside').clientHeight)/Game.dims*.3)
	var gameBoard = document.getElementById('game-board')
	do {
	size--
	$('section').css({fontSize: size+'px'})
} while (size > minSize
&& (
/*
document.getElementById('game-board').clientWidth > document.getElementById('board-wrapper').clientWidth
|| document.getElementById('game-board').clientWidth > window.innerWidth
|| document.getElementById('game-board').clientHeight > document.getElementById('board-wrapper').clientHeight

gameBoard.clientHeight > document.getElementById('board-wrapper').clientHeight
|| gameBoard.scrollWidth > gameBoard.clientWidth
|| gameBoard.scrollHeight > gameBoard.clientHeight
)
)
}
*/

setTimeout(window.onresize, 1000)

$('.lightrope').empty()
for(var i=-52;i<=window.innerWidth;i+=52) {
	$('.lightrope').append('<li/>')
}

$('.snow-wrapper').empty()
for(var i=0;i<100;i++) {
	$('.snow-wrapper').append($('<s class="snow"/>').css({ top: rnd(window.innerHeight*2) - window.innerHeight, left: rnd(window.innerWidth)}))
}
