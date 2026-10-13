

function arcade(ctx, gameWidth, gameHeight, size, offset) {
	
	gameWidth -= offset*2
	gameHeight -= offset*2
	
	var tweak = 0

    var maze = builder2(gameWidth, gameHeight, size)

	var blocks = size
	var blocksX = blocks*2+1
	var blocksY = Math.floor((gameHeight/(gameWidth / blocksX))/2)*2+1

	//draw the maze
	var blockSizeX = gameWidth / blocksX
	var blockSizeY = gameHeight / blocksY

    var colors = ['lightgreen', 'tan', 'lightblue', 'salmon', 'DARKORANGE', 'gold','DARKKHAKI','MEDIUMORCHID']


	ctx.fillStyle = ctx.strokeStyle = colors [rnd(colors.length)]

 	//ctx.fillStyle = ctx.strokeStyle = 'rgb('+(rnd(128)+64)+','+(rnd(128)+64)+','+(rnd(128)+64)+')'
ctx.fillStyle = ctx.strokeStyle = 'black'
 //	ctx.fillRect(0,0,1000,1000)
	ctx.fillStyle = ctx.strokeStyle = 'dodgerblue'


	ctx.lineWidth = 100/size
	ctx.lineCap ='round'

	maze.grid.forEach((row, j) => {
		row.forEach((cell, i) => {

			if (cell != 2) {
			//		ctx.fillRect(i*blockSizeX-1, j*blockSizeY-1, blockSizeX+1, blockSizeY+1)

				var full = 0

				if (j!=0 && maze.grid[j-1][i] !=2) {
					full++
					//ctx.strokeStyle = 'red'
					//down?
					ctx.beginPath()
					ctx.moveTo((i+.5)*blockSizeX + offset, j*blockSizeY + offset - tweak)
					ctx.lineTo((i+.5)*blockSizeX + offset, (j+.5)*blockSizeY + offset + tweak)
					ctx.stroke()
					
				}
				if (j<blocksY-1 && maze.grid[j+1][i] !=2) {
					full++
					ctx.beginPath()
					ctx.moveTo((i+.5)*blockSizeX + offset, (j+1)*blockSizeY + offset - tweak)
					ctx.lineTo((i+.5)*blockSizeX + offset, (j+.5)*blockSizeY + offset + tweak)
					ctx.stroke()
				}
				if (i!=0 && maze.grid[j][i-1] !=2) {
					
					ctx.beginPath()
					ctx.moveTo(i*blockSizeX + offset - tweak, (j+.5)*blockSizeY + offset)
					ctx.lineTo((i+.5)*blockSizeX + offset + tweak, (j+.5)*blockSizeY + offset)
					ctx.stroke()
				}
				if (i<blocksX-1 && maze.grid[j][i+1] !=2) {
					
					ctx.beginPath()
					ctx.moveTo((i+1)*blockSizeX + offset - tweak, (j+.5)*blockSizeY + offset)
					ctx.lineTo((i+.5)*blockSizeX + offset + tweak, (j+.5)*blockSizeY + offset)
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
				x: Math.floor((maze.end.x+1) * blockSizeX + offset),
				y: Math.floor((maze.end.y+1) * blockSizeY + offset),
				z: blockSizeX
			},
			background: 'black'
		}

}
