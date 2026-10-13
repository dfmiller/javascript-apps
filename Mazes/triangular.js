

function triangular(ctx, gameWidth, gameHeight, size, offset) {
	size/=2

	var maze = triangles(gameWidth, gameHeight, size, offset)
	
	gameWidth -= offset*2
	gameHeight -= offset*2

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
			//if (cell !== 2) {
			//	ctx.fillStyle = ['white','aqua','black','blue','fuchsia','gray','green','lime','maroon','navy','olive','purple','red','silver','teal','yellow'][cell]



				ctx.fillRect(i*blockSizeX-0 + offset, j*blockSizeY-0 + offset, blockSizeX+1, blockSizeY+1)

    if (cell & 1) {
				  ctx.clearRect((i+.2)*blockSizeX + offset, j*blockSizeY-.5 + offset, blockSizeX*.6+1, blockSizeY*.8+1)
    }

    if (cell & 2) {
				  ctx.clearRect((i+.2)*blockSizeX + offset, (j+.2)*blockSizeY + offset, blockSizeX+1, blockSizeY*.6+1)
    }

    if (cell & 4) {
				  ctx.clearRect((i+.2)*blockSizeX + offset, (j+.2)*blockSizeY + offset, blockSizeX*.6+1, blockSizeY+1)
    }

    if (cell & 8) {
				  ctx.clearRect(i*blockSizeX-.5 + offset, (j+.2)*blockSizeY + offset, blockSizeX*.8+1, blockSizeY*.6+1)
    }
    
   // ctx.fillStyle ='black'
  
    ctx.font="22px Georgia"
   // ctx.fillText(cell, (i+.2)*blockSizeX, (j+.8)*blockSizeY)
  //  ctx.fillStyle ='purple'

		//	}
		})
	})


	return {
		x: Math.floor((px+.5) * blockSizeX + offset),
		y: Math.floor((py+.5) * blockSizeY + offset),
		z: blockSizeX/2,
		hole: {
			x: Math.floor((end.x+1) * blockSizeX + offset),
			y: Math.floor((end.y+1) * blockSizeY + offset),
			z: blockSizeX/2
		}
	}

}