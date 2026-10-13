

function triangles(gameWidth, gameHeight, size, offset) {

	gameWidth -= offset*2
	gameHeight -= offset*2

	var blocks = size
	var blocksX = blocks*2+1
	var blocksY = Math.floor((gameHeight/(gameWidth / blocksX))/2)*2+1

	function modY(y) {
		return (y % blocksY + blocksY) % blocksY
	}

	function modX(x) {
		return (x % blocksX + blocksX) % blocksX
	}

	function valid(y, x) {
		return x>=0 && x<blocksX && y>=0 && y<blocksY && grid[y][x] == 0
	}

	//basic grid

	var grid = []
	;[...Array(blocksY).keys()].forEach((row,j) => {
		grid[row] = grid[row] || []
		;[...Array(blocksX).keys()].forEach((cell, i) => {
			grid[row][cell] = 0//rnd(16)
		})
	})
	
	//prime the pump
	let temp = rnd(99)

	//pick random spot to start
	let px = rnd(blocksX)
	let py = rnd(blocksY)
	let pz = 0
	

	let	end = {
		x:px,
		y:py
	}
	
	let max = {
		x:px,
		y:py,
		z:0
	}

	///*

	var dirs = [
		{ dx: 0, dy: -1 },
		{ dx: 1, dy: 0 },
		{ dx: 0, dy: 1 },
		{ dx: -1, dy: 0 }
	]

	var stack = []
	stack.push({ y: py, x: px, z: 0 })

	//for(var i = 0;i< 9255; i++) {
	while(stack.length) {

		var d = rnd(dirs.length)
		var dir = dirs[d]
		var counter = 0
		while(counter < 4) {
			if (valid(py+dir.dy, px+dir.dx)) {
				switch(d) {
					case 0:
						grid[py][px] |= 1
						grid[py+dir.dy][px+dir.dx] |= 4
					break
					case 1:
						grid[py][px] |= 2
						grid[py+dir.dy][px+dir.dx] |= 8
					break
					case 2:
						grid[py][px] |= 4
						grid[py+dir.dy][px+dir.dx] |= 1
					break
					case 3:
						grid[py][px] |= 8
						grid[py+dir.dy][px+dir.dx] |= 2
					break
				}

				py += dir.dy
				px += dir.dx
				pz++
				
			 stack.push({ y: py, x: px, z: pz })

				counter = 5

			} else {
				d = (++d % 4)
				dir = dirs[d]
				counter++
			}
		}

		if (counter == 4 && stack.length) {
			var player = stack.shift()
			py = player.y
			px = player.x
			pz = player.z
		}
		
		if (pz > max.z) {
			max = {
				x: px,
				y: py,
				z: pz
			}
		}
		
		
	}


	/* */


	return {
		grid: grid,
		px: max.x,
		py: max.y,
		end: end
	}

}