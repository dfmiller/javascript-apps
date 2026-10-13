
var seed = 1
function psuedo() {
	seed = (seed > 1) ? seed / 1000 : (Math.sin(seed) * 10000) % 1
	return seed
}

rnd = function(n) {
	return n ? Math.floor(psuedo()*n) : psuedo()
}

var mazes = [
	'blocky',
	//'style1',
	'arcade',
	'streets',
	'triangular', 
	//'mazeThree',
	'diagonal', 
	// 'circular'
]

function updateNextMazeType() {
	var nextMaze = mazes[(Game.index + 1) % mazes.length]
	$('.mazes').empty().append($('<h1/>').text(nextMaze))
}

var pressedKeys = new Set()
var keyDirections = {
	arrowup: 'up',
	w: 'up',
	arrowdown: 'down',
	s: 'down',
	arrowleft: 'left',
	a: 'left',
	arrowright: 'right',
	d: 'right'
}

function updateKeyboardDirection() {
	Game.dx = Number(pressedKeys.has('d') || pressedKeys.has('arrowright'))
		- Number(pressedKeys.has('a') || pressedKeys.has('arrowleft'))
	Game.dy = Number(pressedKeys.has('s') || pressedKeys.has('arrowdown'))
		- Number(pressedKeys.has('w') || pressedKeys.has('arrowup'))
}

var dragPointerId = null

function updatePointerDirection(event) {
	var canvas = Game.canvas.get(0)
	var bounds = canvas.getBoundingClientRect()
	var x = Math.max(0, Math.min(Game.width - 1, (event.clientX - bounds.left) * Game.width / bounds.width))
	var y = Math.max(0, Math.min(Game.height - 1, (event.clientY - bounds.top) * Game.height / bounds.height))

	Game.dx = Math.sign(x - Game.x)
	Game.dy = Math.sign(y - Game.y)
}

window.addEventListener('keydown', function(event) {
	var key = event.key.toLowerCase()
	if (!keyDirections[key]) {
		return
	}
	if (event.target.closest && event.target.closest('input, textarea, select, [contenteditable="true"]')) {
		return
	}

	event.preventDefault()
	if ($('.done_dialog').is(':visible')) {
		return
	}

	pressedKeys.add(key)
	updateKeyboardDirection()
})

window.addEventListener('keyup', function(event) {
	var key = event.key.toLowerCase()
	if (pressedKeys.delete(key)) {
		event.preventDefault()
		updateKeyboardDirection()
	}
})

window.addEventListener('blur', function() {
	pressedKeys.clear()
	updateKeyboardDirection()
})

$('[name="levelUp"]').click(e => {
	Game.size +=2
	seed = 1
	$('.done_dialog').removeAttr('open').hide()
	Game.play()
})

$('[name="levelDown"]').click(e => {
	Game.size -=2
	seed = 1
	$('.done_dialog').removeAttr('open').hide()
	Game.play()
})


$('.gamePlay').click(e => {
	seed++;
	Game.index = (++Game.index % mazes.length)
	$('.done_dialog').removeAttr('open').hide()
	Game.play()
})




$('.menu').click(e => {
	updateNextMazeType()
	$('.done_dialog').attr('open', true).show()
})


$('[name=closeDialog]').click(e => {
	$('.done_dialog').removeAttr('open').hide()
})


var Game = {

	maze: 0,
	size: 10,
	round: 0,
	index: 0,

	once: function () {

		this.canvas = $('canvas')
		this.width = this.canvas.width()
		this.height = this.canvas.height()
		this.canvas.get(0).width = this.width
		this.canvas.get(0).height = this.height
		this.ctx = this.canvas.get(0).getContext('2d')
		this.canvas.get(1).width = this.width
		this.canvas.get(1).height = this.height
		this.fctx = this.canvas.get(1).getContext('2d')

		var canvas = this.canvas.get(0)
		canvas.addEventListener('pointerdown', function(event) {
			if (event.button !== 0) {
				return
			}

			event.preventDefault()
			dragPointerId = event.pointerId
			canvas.setPointerCapture(event.pointerId)
			$('.app').addClass('is-dragging')
			updatePointerDirection(event)
		})

		canvas.addEventListener('pointermove', function(event) {
			if (event.pointerId === dragPointerId) {
				updatePointerDirection(event)
			}
		})

		function endPointerDrag(event) {
			if (event.pointerId !== dragPointerId) {
				return
			}

			dragPointerId = null
			$('.app').removeClass('is-dragging')
			updateKeyboardDirection()
		}

		canvas.addEventListener('pointerup', endPointerDrag)
		canvas.addEventListener('pointercancel', endPointerDrag)
		canvas.addEventListener('lostpointercapture', endPointerDrag)

		window.addEventListener('blur', function() {
			dragPointerId = null
			$('.app').removeClass('is-dragging')
		})

		setInterval(function () {

			var x = Game.x + Game.dx *1
			var y = Game.y + Game.dy *1

			if (x < 1 && Game.dx ==-1) {
				x = canvas.width-1
			} else if (x > canvas.width+1 && Game.dx == 1) {
				x = 0
			}

			if (y < 1 && Game.dy ==-1) {
				y = canvas.height-1
			} else if (y > canvas.height+1 && Game.dy == 1) {
				y = 0
			}

			for (var i=0;i<6;i++) {
				switch (i) {
					case 1:
						x = Game.x
					break
					case 2:
						x = Game.x + Game.dx
						y = Game.y
					break
					case 3:
						x = Game.x - Game.dx
						y = Game.y + Game.dy
					break
					case 4:
						x = Game.x + Game.dx
						y = Game.y - Game.dy
					break
					case 5:
						x = Game.x - Game.dx
						y = Game.y - Game.dy
					break
				}

				var pixel = Game.ctx.getImageData(Math.floor(x), Math.floor(y), 1, 1).data

				if (pixel[3] == 0) {
					i=9
					Game.x = x
					Game.y = y

					$('.dot').css({left: Game.x, top: Game. y})

					if (Math.abs(Game.end.x - Game.x) <= Game.end.z*1 && Math.abs(Game.end.y - Game.y) <= Game.end.z*1) {
						
						$('body').addClass('isdone');

						updateNextMazeType()
						$('.done_dialog').attr('open', true).show()
					}
					else {
						//if (Math.abs(Game.end.x - Game.x) <= Game.end.z*1 && Math.abs(Game.end.y - Game.y) <= Game.end.z*1) {
							
					//if (Game.dx == 0)
	//Game.dx = Math.sign(Game.end.x - Game.x)*.5
					//if (Game.dy == 0)
	//Game.dy = Math.sign(Game.end.y - Game.y)*.5
							
						//}
				
						
						
						
						$('body'). removeClass('isdone');
					}

				}

			}

		}, 1)

	},


	play () {

		$('.color').html(Game.size)

		this.ctx.clearRect(0, 0, this.width, this.height)
		this.fctx.clearRect(0, 0, this.width, this.height)
		//this.ctx.strokeStyle = 'black'
		//this.ctx.strokeRect(0, 0, this.width-1, this.height-1)

		this.x = this.width/2
		this.y = this.height/2
		this.dx = 0
		this.dy = 0

		var maze = mazes[this.index]
		$('.maze').text(maze)
		
		var offset = 20
		
		var results = window[maze](Game.ctx, Game.width, Game.height, Game.size, offset)

	//	Game.size +=2

		if (results.x) {
			this.x = results.x
			this.y = results.y
			this.dx = 0
			this.dy = 0

			$('.dot').css({
				left: results.x,
				top: results.y,
				width: results.z*1.5,
				height: results.z*1.5,
				margin: -results.z*.75,
			})
			
			$('.start').css({
				left: results.x,
				top: results.y + results.z,
				width: results.z,
				height: results.z,
				margin: -results.z/2,
				fontSize: results.z
			})
		}


		if (results.hole) {
			Game.end = results.hole
			$('.end').css({
				width: Game.end.z,
				height: Game.end.z,
				left: Game.end.x,
				top: Game.end.y,
				margin: -Game.end.z,
				fontSize: results.z
			})
			Game.end.x -= Game.end.z/2
			Game.end.y -= Game.end.z/2
		} else {
			$('.end').css({ left: -10, top: -10 })
		}
		
		$('.app').css({background: results.background || 'white'})

	}

}

Game.once()
Game.play()

var resizeTimeout
$(window).on('resize', function() {
	clearTimeout(resizeTimeout)
	resizeTimeout = setTimeout(function() {
		var width = Math.round(Game.canvas.width())
		var height = Math.round(Game.canvas.height())
		if (width === Game.width && height === Game.height) {
			return
		}

		Game.width = width
		Game.height = height
		Game.canvas.each(function() {
			this.width = width
			this.height = height
		})
		Game.ctx = Game.canvas.get(0).getContext('2d')
		Game.fctx = Game.canvas.get(1).getContext('2d')
		pressedKeys.clear()
		updateKeyboardDirection()
		Game.play()
	}, 100)
})
