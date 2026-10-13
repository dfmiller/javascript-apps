

function mazeThree(ctx, gameWidth, gameHeight, size) {


    var maze = builder3(gameWidth, gameHeight, size)


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

			if (cell != 2) {
					ctx.fillRect(i*blockSizeX-1, j*blockSizeY-1, blockSizeX+1, blockSizeY+1)

				var full = 0

				if (j!=0 && grid[j-1][i] !=2) {
					full++
					//ctx.strokeStyle = 'red'
					ctx.beginPath()
					ctx.moveTo((i+.5)*blockSizeX, j*blockSizeY)
					ctx.lineTo((i+.5)*blockSizeX, (j+.5)*blockSizeY)
					ctx.stroke()
					
				}
				if (j<blocksY-1 && grid[j+1][i] !=2) {
					full++
					ctx.beginPath()
					ctx.moveTo((i+.5)*blockSizeX, (j+1)*blockSizeY)
					ctx.lineTo((i+.5)*blockSizeX, (j+.5)*blockSizeY)
					ctx.stroke()
				}
				if (i!=0 && grid[j][i-1] !=2) {
					
					ctx.beginPath()
					ctx.moveTo(i*blockSizeX, (j+.5)*blockSizeY)
					ctx.lineTo((i+.5)*blockSizeX, (j+.5)*blockSizeY)
					ctx.stroke()
				}
				if (i<blocksX-1 && grid[j][i+1] !=2) {
					ctx.beginPath()
					ctx.moveTo((i+1)*blockSizeX, (j+.5)*blockSizeY)
					ctx.lineTo((i+.5)*blockSizeX, (j+.5)*blockSizeY)
					ctx.stroke()
				}

		


			} else if (
				i%2 && j%2 &&
				(end.x != i || end.y != j) &&
				(px != i || py != j) &&
				(((grid[j][i+1] !=2) ? 1 : 0)
				+ ((grid[j][i-1] !=2) ? 1 : 0)
				+ ((grid[j+1][i] !=2) ? 1 : 0)
				+ ((grid[j-1][i] !=2) ? 1 : 0)) == 3) {

					

				}

			})
		})






		return {
			x: Math.floor((px+.5) * blockSizeX),
			y: Math.floor((py+.5) * blockSizeY),
			z: blockSizeX,
			hole: {
				x: Math.floor((end.x+.5) * blockSizeX),
				y: Math.floor((end.y+.5) * blockSizeY),
				z: blockSizeX
			}
		}

	}
