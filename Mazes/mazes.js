
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

$('.mazes').empty();
mazes.forEach(function(maze) {
	$('.mazes').append($('<h1/>').text(maze));
});

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

		this.canvas.bind('touchmove', function (event) {
			event = event.originalEvent
			event = event.touches[0]
			Game.dx = Math.sign(event.pageX - Game.x)
			Game.dy = Math.sign(event.pageY - Game.y)
		})

		this.canvas.bind('touchend', function (event) {
			Game.dx = 0
			Game.dy = 0
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
