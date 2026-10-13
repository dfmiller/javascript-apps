

function style1(ctx, gameWidth, gameHeight, size, offset) {

	gameWidth -= offset*2
	gameHeight -= offset*2

    var maze = builder(gameWidth, gameHeight, size)

	var blocks = size
	var blocksX = blocks*2+1
	var blocksY = Math.floor((gameHeight/(gameWidth / blocksX))/2)*2+1

	//draw the maze
	var blockSizeX = gameWidth / blocksX
	var blockSizeY = gameHeight / blocksY


 	ctx.fillStyle = ctx.strokeStyle = 'rgb('+(rnd(128)+64)+','+(rnd(128)+64)+','+(rnd(128)+64)+')'

	ctx.lineWidth = 50/size
	

	maze.grid.forEach((row, j) => {
		row.forEach((cell, i) => {

			if (cell != 2) {
			//		ctx.fillRect(i*blockSizeX-1, j*blockSizeY-1, blockSizeX+1, blockSizeY+1)

				var full = 0

				if (j!=0 && maze.grid[j-1][i] !=2) {
					full++
					//ctx.strokeStyle = 'red'
					ctx.beginPath()
					ctx.moveTo((i+.5)*blockSizeX + offset, j*blockSizeY + offset)
					ctx.lineTo((i+.5)*blockSizeX + offset, (j+.5)*blockSizeY + offset)
					ctx.stroke()
					
				}
				if (j<blocksY-1 && maze.grid[j+1][i] !=2) {
					full++
					ctx.beginPath()
					ctx.moveTo((i+.5)*blockSizeX + offset, (j+1)*blockSizeY + offset)
					ctx.lineTo((i+.5)*blockSizeX + offset, (j+.5)*blockSizeY + offset)
					ctx.stroke()
				}
				if (i!=0 && maze.grid[j][i-1] !=2) {
					
					ctx.beginPath()
					ctx.moveTo(i*blockSizeX + offset, (j+.5)*blockSizeY + offset)
					ctx.lineTo((i+.5)*blockSizeX + offset, (j+.5)*blockSizeY + offset)
					ctx.stroke()
				}
				if (i<blocksX-1 && maze.grid[j][i+1] !=2) {
					ctx.beginPath()
					ctx.moveTo((i+1)*blockSizeX + offset, (j+.5)*blockSizeY + offset)
					ctx.lineTo((i+.5)*blockSizeX + offset, (j+.5)*blockSizeY + offset)
					ctx.stroke()
				}

		


			} else if (
				i%2 && j%2 &&
				(maze.end.x != i || maze.end.y != j) &&
				(maze.px != i || maze.py != j) &&
				(((maze.grid[j][i+1] !=2) ? 1 : 0)
				+ ((maze.grid[j][i-1] !=2) ? 1 : 0)
				+ ((maze.grid[j+1][i] !=2) ? 1 : 0)
				+ ((maze.grid[j-1][i] !=2) ? 1 : 0)) == 3) {

					

				}

			})
		})




		return {
			x: Math.floor((maze.px+.5) * blockSizeX + offset),
			y: Math.floor((maze.py+.5) * blockSizeY + offset),
			z: blockSizeX,
			hole: {
				x: Math.floor((maze.end.x+.5) * blockSizeX + offset),
				y: Math.floor((maze.end.y+.5) * blockSizeY + offset),
				z: blockSizeX
			},
			
		}

}
