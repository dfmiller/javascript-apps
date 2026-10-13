

function builder(gameWidth, gameHeight, size) {
	var blocks = size
	var blocksX = blocks*2+1
	var blocksY = Math.floor((gameHeight/(gameWidth / blocksX))/2)*2+1

    function modY(y) {
        return (y % blocksY + blocksY) % blocksY
    }

    function modX(x) {
        return (x % blocksX + blocksX) % blocksX
    }

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
			} else
            
            if (i%2 == 0 && j%2 == 0) {
				switch(rnd(4)) {
					case 0:
						grid[modY(row-1)][cell] = 1
						fill = 1
					break
					case 1:
						grid[row][modX(cell-1)] = 1
						fill = 8
					break
					case 2:
						grid[modY(row+1)] = grid[modY(row+1)] || []
						grid[modY(row+1)][cell] = 1
						fill = 4
					break
					case 3:
						grid[row][modX(cell+1)] = 1
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
			(grid[modY(s.y+1)][s.x] == 1 ? 1 : 0)
			+ (grid[modY(s.y-1)][s.x] == 1 ? 1 : 0)
			+ (grid[s.y][modX(s.x+1)] == 1 ? 1 : 0)
			+ (grid[s.y][modX(s.x-1)] == 1 ? 1 : 0) == 2
		) {
			grid[s.y][s.x] = 1
		}

		if (!grid[modY(s.y+1)][s.x]) {
			stack.push({ x: s.x, y: modY(s.y+1), z: s.z+1 })
		}
		if (!grid[modY(s.y-1)][s.x]) {
			stack.push({ x: s.x, y: modY(s.y-1), z: s.z+1 })
		}
		if (!grid[s.y][modX(s.x+1)]) {
			stack.push({ x: modX(s.x+1), y: s.y, z: s.z+1 })
		}
		if (!grid[s.y][modX(s.x-1)]) {
			stack.push({ x: modX(s.x-1), y: s.y, z: s.z+1 })
		}
	}

	if (grid[fin.y][fin.x] == 2) {
		end = fin
	}

    return {
        grid: grid,
        px: px,
        py: py,
        end: end
    }

}
