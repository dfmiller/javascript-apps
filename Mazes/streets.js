
function streets(ctx, gameWidth, gameHeight, size, offset) {
	
	gameWidth -= offset*2
	gameHeight -= offset*2

	var maze = builder(gameWidth, gameHeight, size)

	var blocks = size
	var blocksX = blocks*2+1
	var blocksY = Math.floor((gameHeight/(gameWidth / blocksX))/2)*2+1

	grid = maze.grid
	end = maze.end
	px = maze.px
	py = maze.py

	//draw the maze
	var blockSizeX = gameWidth / blocksX
	var blockSizeY = gameHeight / blocksY

	var loading = 0

	var trees = ['tree1', 'tree2', 'tree3',  'tree4'].map(src => {
		loading++
		var tree = new Image()
		tree.onload = loaded
		tree.src = './'+src+'.png'
		return tree
	})

	var buildings = ['house1', 'house2', 'house3', 'house4', 'house5', 'house6', 'house7', 'house8', 'house9'].map(src => {
		loading++
		var building = new Image()
		building.onload = loaded
		building.src = './'+src+'.png'
		return building
	})

	function loaded() {
		if (!--loading) {
			//alert('loaded')

			ctx.fillStyle = 'tan'
			ctx.strokeStyle = 'blue'
			ctx.lineWidth = 50/size
			//ctx.filter="grayscale(90%)"
				Game.fctx.filter = "sepia(90%)"

			maze.grid.forEach((row, j) => {
				row.forEach((cell, i) => {

					ctx.fillStyle = ctx.strokeStyle = Game.fctx.fillStyle = '#dca'

					if (cell != 2) {
						ctx.fillStyle = 'tan'
						ctx.fillRect(i*blockSizeX-1 + offset, j*blockSizeY-1 + offset, blockSizeX+1, blockSizeY+1)

						ctx.fillStyle = ctx.strokeStyle
						ctx.fillRect(i*blockSizeX-1 + offset, j*blockSizeY-1 + offset, blockSizeX/2, blockSizeY/2)

						var full = 0

						if (j!=0 && grid[j-1][i] !=2) {
							full++
						}
						
						if (j<blocksY-1 && grid[j+1][i] !=2) {
							full++
							
							ctx.fillRect(i*blockSizeX-1 + offset, j*blockSizeY-1 + offset, .5*blockSizeX, blockSizeY+1)
							
						}
						
						if (i!=0 && grid[j][i-1] !=2) {
							full++
						}
						
						if (i<blocksX-1 && grid[j][i+1] !=2) {
							full++
							ctx.fillRect(i*blockSizeX-1 + offset, j*blockSizeY-1 + offset, blockSizeX+1, .5*blockSizeY)
							
						}

						if (full >= 4) {

							ctx.fillRect((i-.35)*blockSizeX + offset, (j-.35)*blockSizeY + offset, blockSizeX*1.7, blockSizeY*1.7)


							var tree = trees[rnd(trees.length)]

								//Game.fctx.filter = "grayscale(90%)"

							Game.fctx.drawImage(tree, (i-.5)*blockSizeX + offset, (j-.5)*blockSizeY + offset, blockSizeX*2, blockSizeY*2)

						}


					} else if (
						i%2 && j%2 &&
						(end.x != i || end.y != j) &&
						(px != i || py != j) &&
						(((grid[j][i+1] !=2) ? 1 : 0)
						+ ((grid[j][i-1] !=2) ? 1 : 0)
						+ ((grid[j+1][i] !=2) ? 1 : 0)
						+ ((grid[j-1][i] !=2) ? 1 : 0)) == 3) {

							ctx.fillRect((i-.6)*blockSizeX + offset, (j-.6)*blockSizeY + offset, blockSizeX*1.7, blockSizeY*1.7)

							var building = buildings[rnd(buildings.length)]
							//Game.fctx.filter = "grayscale(90%)"
							
							Game.fctx.save()
						//	Game.fctx.scale(-1, 1)
						
							Game.fctx.drawImage(building, (i-.35)*blockSizeX + offset, (j-.35)*blockSizeY + offset, blockSizeX*1.7, blockSizeY*1.7)
							Game.fctx.restore()

						}

					})
				})

			}
		}//



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