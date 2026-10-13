

function oneMaze(ctx, gameWidth, gameHeight) {

	var blocks = 12
	var blocksX = blocks*2+1
	var blocksY = Math.floor((gameHeight/(gameWidth / blocksX))/2)*2+1

	//basic grid

	var grid = []
	;[...Array(blocksY).keys()].forEach((row,j) => {
		grid[row] = grid[row] || []
		;[...Array(blocksX).keys()].forEach((cell, i) => {

			var fill = 0
			if (i == 0 || i == blocksX-1) {
				fill = 1
			} else if (j == 0 || j == blocksY-1) {
				fill = 1
			} else if (i%2 == 0 && j%2 == 0) {
				switch(rnd(4)) {
					case 0:
						grid[row-1][cell] = 1
						fill = 1
					break
					case 1:
						grid[row][cell-1] = 1
						fill = 8
					break
					case 2:
						grid[row+1] = grid[row+1] || []
						grid[row+1][cell] = 1
						fill = 4
					break
					case 3:
						grid[row][cell+1] = 1
						fill = 2
					break
				}
				fill = 1
			}

			grid[row][cell] = grid[row][cell] || fill

		})
	})


	//pick random spot to start
	let px = 0
	let py = 0

	while(grid[py][px]) {
		px = rnd(blocksX)
		py = rnd(blocksY)
	}

	var stack = [{ x: px, y: py, z: 1 }]
	var end = stack[0]
	var fin = end
	while (stack.length) {
		var s = stack.pop()

		if (!grid[s.y][s.x]) {

			if (s.z > fin.z) {
				end = fin
				fin = s
			}

			grid[s.y][s.x] = 2
		} else if (
			(grid[s.y+1][s.x] == 1 ? 1 : 0)
			+ (grid[s.y-1][s.x] == 1 ? 1 : 0)
			+ (grid[s.y][s.x+1] == 1 ? 1 : 0)
			+ (grid[s.y][s.x-1] == 1 ? 1 : 0) == 2
		) {


			grid[s.y][s.x] = 1
		}

		if (!grid[s.y+1][s.x]) {
			stack.push({ x: s.x, y: s.y+1, z: s.z+1 })
		}
		if (!grid[s.y-1][s.x]) {
			stack.push({ x: s.x, y: s.y-1, z: s.z+1 })
		}
		if (!grid[s.y][s.x+1]) {
			stack.push({ x: s.x+1, y: s.y, z: s.z+1 })
		}
		if (!grid[s.y][s.x-1]) {
			stack.push({ x: s.x-1, y: s.y, z: s.z+1 })
		}
	}

	if (grid[fin.y][fin.x] == 2) {
		end = fin
	}

	//alert (JSON.stringify(stack))

	//draw the maze
	var blockSizeX = gameWidth / blocksX
	var blockSizeY = gameHeight / blocksY

	ctx.fillStyle = 'tan'
	ctx.lineWidth = 1

	grid.forEach((row, j) => {
		row.forEach((cell, i) => {

			if (cell != 2) {
				ctx.fillRect(i*blockSizeX-1, j*blockSizeY-1, blockSizeX+1, blockSizeY+1)
			}

		})
	})

	ctx.fillStyle = 'black';
	ctx.beginPath();
	ctx.arc((end.x+.5)*blockSizeX, (end.y+.5)*blockSizeY, blockSizeX/2, 0, 2 * Math.PI)
	ctx.fill();

	// ctx.fillStyle = 'gray';
	// ctx.beginPath();
	// ctx.arc((end.x+.7)*blockSizeX, (end.y+.7)*blockSizeY, blockSizeX*.3, 0, 2 * Math.PI)
	// ctx.fill();


	return {
		x: Math.floor((px+.5) * blockSizeX),
		y: Math.floor((py+.5) * blockSizeY ),
		end: end
	}

}
