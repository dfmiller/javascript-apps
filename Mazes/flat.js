

function blocky(ctx, gameWidth, gameHeight, size, offset) {
	
	gameWidth -= offset*2
	gameHeight -= offset*2

	var maze = builder(gameWidth, gameHeight, size)

	var blocks = size
	var blocksX = blocks*2+1
	var blocksY = Math.floor((gameHeight/(gameWidth / blocksX))/2)*2+1

	//basic grid

	grid = maze.grid
	end = maze.end
	px = maze.px
	py = maze.py

	//draw the maze
	var blockSizeX = gameWidth / blocksX
	var blockSizeY = gameHeight / blocksY

	ctx.fillStyle = ctx.strokeStyle = 'rgb('+(rnd(128)+64)+','+(rnd(128)+64)+','+(rnd(128)+64)+')'

	ctx.lineWidth = 50/size

	grid.forEach((row, j) => {

		row.forEach((cell, i) => {
			if (cell !== 2) {
				//ctx.fillStyle = ['white','aqua','black','blue','fuchsia','gray','green','lime','maroon','navy','olive','purple','red','silver','teal','yellow'][cell]

				ctx.fillRect(i*blockSizeX-1+offset, j*blockSizeY-1+offset, blockSizeX+1, blockSizeY+1)
			}
		})
	})

	return {
		x: Math.floor((px+.5) * blockSizeX + offset),
		y: Math.floor((py+.5) * blockSizeY + offset),
		z: blockSizeX,
		hole: {
			x: Math.floor((end.x+1) * blockSizeX + offset),
			y: Math.floor((end.y+1) * blockSizeY + offset),
			z: blockSizeX
		}
	}

}
