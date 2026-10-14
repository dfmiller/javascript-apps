
window.oncontextmenu = function() { return false }

var rnd = function (n) {
	return Math.floor(Math.random()*n)
}

var Element = function(s) {
	return document.createElement(s)
}

//localStorage.clear()


var Game = {

	colors: ['pink', 'red', 'Orange', 'gold', 'DarkKhaki', 'lime', 'cyan', 'DodgerBlue', 'Magenta'],

	gameBoard: $('.game-board'),

	round: localStorage.getItem('round')*1 || 0,

	rounds: JSON.parse(localStorage.getItem('rounds')||'[]'),

	width: window.innerWidth,
	height: window.innerHeight,

	once: function() {
		this.offset = 25
		this.dragLetter = null
		this.lastTouch
		this.found = null
		this.letterHeight = 50

		//integrity checks
		var characters = []
		var last =''
		phrases.forEach(phrase => {
			if (phrase.replace(/[^a-z]/g, '') == last.replace(/[^a-z]/g, '')) {
				alert('duplicate: ' + last)
			}
			last = phrase

			if (!/^[a-z,.-:;' ?!]+|[a-z .!?]+$/.test(phrase)) {
				alert('invalid characters ' + phrase)
			}

			phrase.split('').forEach(letter => {
				if (letter.charCodeAt(0) > 126) {
					alert(phrase)
				}
			})
		})

		//console.log(characters)



		$('.selectLevel').append(
			Array(Math.floor(phrases.length)).fill().map((v, i) =>
				$('<li/>').addClass(Game.rounds[i] ? 'complete':'').text(i+1).click(function () {
					Game.round = $(this).text()*1 -1
					$('.selectLevel li.active').removeClass('active')
					$($('.selectLevel li').get(Game.round)).addClass('active')[0].scrollIntoView({block: 'center'})
					localStorage.setItem('round', Game.round)
					Game.gameBoard.empty()
					$('.menuDialog').removeAttr('open')
					setTimeout(Game.run, 1000)
				})
			)
		)

		$($('.selectLevel li').get(Game.round)).addClass('active')[0].scrollIntoView({block: 'center'})

		$('.hintButton').bind('click', function() {
			var count = Math.max(1, Math.floor($('.drop-target').length / 12))
			for(var i=0;i<count;i++) {
				var x = $('.drop-target:not(.correct):not(.hinted)')
				var r = rnd(x.length)
				$(x[r]).addClass('hinted')
			}
		})

		$('.menuButton').bind('click', function() {
			$('.menuDialog').attr('open', 'open')
		})

		$('.menuDialog button').bind('click', function() {
			$('.menuDialog').removeAttr('open')
		})

		$('dialog button').bind('click', function() {
			$(this).closest('dialog').removeAttr('open')
		})

		$('.nextRound').bind('click', function() {
			$('.nextRound').hide()
			Game.gameBoard.empty()
			$('.instructions').hide()
			setTimeout(	Game.run, 1000)
		})


		setTimeout(function () {

	 		Game.gameBoard.bind('mousedown', function() {
	 			Game.isDown = true
				Game.dragLetter = null
			})


			Game.gameBoard.bind('touchmove mousemove', function(event) {
				event = event.originalEvent || event

				//console.log(event.type)

				if (event.type == 'mousemove' && !Game.isDown) {
					return
				}

				var touch = event.targetTouches ? event.targetTouches[0] : event

				if (Game.dragLetter) {
					var size = Game.letterHeight/2
					var tx = touch.pageX - size
					if (tx < Game.left) tx = Game.left
					if (tx > Game.right-size*1.5) tx = Game.right-size*1.5
					var ty = touch.pageY - size
					if (ty < Game.top) ty = Game.top
					if (ty > Game.bottom-size*2) ty = Game.bottom-size*2
					$(Game.dragLetter).css({
						position: 'fixed',
						left: tx,
						top: ty
					})


					var Z = document.querySelectorAll('.drop-target:not(.correct)')
					Game.found = Array.from(Z).find(function (z) {
						var rect = z.getBoundingClientRect()
						var y = Math.abs(rect.top+rect.height/2 - touch.clientY)
						var x = Math.abs(rect.left+rect.width/2 - touch.clientX)
						return (x < Game.letterHeight/3 && y < Game.letterHeight/3 && z.dataLetter == Game.dragLetter.dataLetter)
					})
					event.preventDefault()
				}
			})

			Game.gameBoard.bind('touchend mouseup', function(event) {
				Game.isDown = false
				if (Game.found && Game.dragLetter) {
					try {
						Game.found.classList.add('correct')
						$(Game.dragLetter).hide()
						Game.dragLetter = null
						Game.found = null

						var c = $('.drop-target:not(.correct)')

						if (c.length == 0) {
							Game.rounds[Game.round] = 1
							localStorage.setItem('rounds', JSON.stringify(Game.rounds))
							Game.round = (++Game.round % phrases.length)
							localStorage.setItem('round', Game.round)

								$('.selectLevel li.active').removeClass('active').addClass('complete')
								$($('.selectLevel li').get(Game. round)).addClass('active')[0].scrollIntoView({block: 'center'})


							$('.draggable').hide()
							$('.nextRound').show()
							$('.game-board .filler').hide()

						}

					} catch(e) { alert (e) }
				}
			})

		} ,1)

	},


	addLetter: function(letter) {
		var span2 = Element('span')
		span2.innerHTML = letter
		span2.classList.add('draggable')
		span2.style.color = Game.colors[rnd(Game.colors.length)]

		span2.dataLetter = letter

		span2.style.transform = 'rotate(' + (rnd(30)-15) + 'deg)'

		$(span2).bind('touchstart mousedown', function(event) {
			event.stopPropagation()
			Game.dragLetter = event.currentTarget
			Game.isDown = true
		})

		return span2
	},


	run: function() {

        var images = ['beach.jpg', 'bears.jpg', 'colorado.jpg', 'cubs.jpg', 'desert.jpg', 'field.jpg', 'fish.jpg', 'flowers.jpg', 'palm_trees.jpg', 'poppies.jpg', 'red_rocks.jpg', 'river.jpg', 'snowy.jpg', 'trees.jpg', 'tulips.jpg', 'waterfall.jpg']

        var colors = ['Silver', 'Gray', 'Black', 'Red', 'Maroon', 'Yellow', 'Olive', 'Lime', 'Green', 'Aqua', 'Teal', 'Blue', 'Navy', 'Fuchsia', 'Purple']

        //$('.pastels').css({ background: 'linear-gradient(' + rnd(360) + 'deg, ' + colors[rnd(colors.length)] + ', ' + colors[rnd(colors.length)] + ')' })
        $('.pastels').css({ backgroundImage: 'url(./backgrounds/' + images[rnd(images.length)] + ')' })

		Game.gameBoard.empty()
		$('.nextRound').hide()

		$('.level').html('Round '+(Game.round+1))

		var phrase = phrases[Game.round % phrases.length]

		var temp = phrase.split('|')
		phrase = '"' + temp[0]+'"'
		author = temp[1]

		phrase.split(' ').forEach(function(word) {

			var div = $('<div/>')
			div.addClass('word-wrapper')

			Game.gameBoard.append(div)
			word.toUpperCase().split('').forEach(function(letter) {
				var span = Element('span')
				span.innerHTML = letter
				span.dataLetter = letter
				div.append(span)

				if (letter.match(/[^A-Z]/)) {

					span.classList.add('correct')

				} else {

					span.classList.add('drop-target')
					span.appendChild(Game.addLetter(letter))

				}

			})

		})

		$('span:contains(")').first().html('&ldquo;')
		$('span:contains(")').last().html('&rdquo;')


		Game.gameBoard.append(
			$('<div/>').addClass('word-wrapper width-full author').text(author),
			$('<div/>').addClass('word-wrapper width-full filler')
		)

		Game.adjustFont()
	},


	adjustFont: function () {
		console.log('adjust')

		var position = $('.game_wrapper').position()
		Game.left = position.left
		Game.right = Game.left + $('.game_wrapper').width()
		Game.top = position.top + $('.app_bar').height()
		Game.bottom = position.top + $('.game_wrapper').height()

		$('.draggable').css({ top: 50, left: 50 })
		var minFontSize = 1.125
		var maxFontSize = 5
		var fontSize = minFontSize

		for (var i = 0; i < 12; i++) {
			fontSize = (minFontSize + maxFontSize) / 2
			Game.gameBoard.css({ fontSize: fontSize + 'rem' })

			if (
				Game.gameBoard[0].scrollHeight > Game.gameBoard.height()
				|| Game.gameBoard[0].scrollWidth > Game.gameBoard.width()
			) {
				maxFontSize = fontSize
			} else {
				minFontSize = fontSize
			}
		}
		Game.gameBoard.css({ fontSize: minFontSize + 'rem' })


		Game.letterHeight = $('.draggable').height()

		var max = $('.filler').position().top
		var wrapperHeight = $('.game_wrapper').height()
		max = Math.min(max, wrapperHeight - Game.letterHeight * 4)
		var y = Math.max(0, wrapperHeight - max - Game.letterHeight * 1.5)
		var x = Game.gameBoard.width() - Game.letterHeight

		$('.draggable').each(function() {
			var z = $(this).text().charCodeAt(0)-65
			x = Math.floor( ((Game.gameBoard.width() - Game.letterHeight*.5)/26) * z)
			//alert((x/26))
			$(this).css({
				left: x,
				top: rnd(y) + max
			})
		})
	},


	reset: function() {
		//localStorage.clear()
		Game.level = 0
		Game.round = 0
		Game.run()
	}


}


Game.once()
Game.run()


window.onresize = Game.adjustFont

/*



*/
