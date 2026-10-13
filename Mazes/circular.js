
CanvasRenderingContext2D.prototype.section = function(centerX, centerY, innerRadius, outerRadius, startAngle, endAngle, fills) {
	var th1 = startAngle*Math.PI/180
	var th2 = endAngle*Math.PI/180
	var startOfOuterArcX = outerRadius*Math.cos(th2) + centerX
	var startOfOuterArcY = outerRadius*Math.sin(th2) + centerY
	var endOfOuterArcX = outerRadius*Math.cos(th1) + centerX
	var endOfOuterArcY = outerRadius*Math.sin(th1) + centerY

	var startOfInnerArcX = innerRadius*Math.cos(th2) + centerX
	var startOfInnerArcY = innerRadius*Math.sin(th2) + centerY
	var endOfInnerArcX = innerRadius*Math.cos(th1) + centerX
	var endOfInnerArcY = innerRadius*Math.sin(th1) + centerY

 this.lineWidth = 3

	this.beginPath()
	this.strokeStyle = (fills & 1 ? 'red' : 'transparent')
	this.arc(centerX, centerY, innerRadius, th1, th2, false)
	this.stroke()

	this.beginPath()
	this.strokeStyle = (fills & 2 ? 'orange' : 'transparent')
	this.moveTo(endOfOuterArcX, endOfOuterArcY)
	this.lineTo(endOfInnerArcX, endOfInnerArcY)
	this.stroke()

	this.beginPath()
	this.strokeStyle = (fills & 4 ? 'green' : 'transparent')
	this.arc(centerX, centerY, outerRadius, th2, th1, true)
	this.stroke()

	this.beginPath()
	this.strokeStyle = (fills & 8 ? 'blue' : 'transparent')
	this.moveTo(startOfOuterArcX, startOfOuterArcY)
	this.lineTo(startOfInnerArcX, startOfInnerArcY)
	this.stroke()
}



function circular(ctx, gameWidth, gameHeight, size) {

try {

	var blocks = size
	var blocksX = blocks*2+1
	var blocksY = 41 //Math.floor((gameHeight/(gameWidth / blocksX))/2)*2+1

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

	ctx.fillStyle = 'tan'
	ctx.strokeStyle = 'gray'
	ctx.lineWidth = 1

 var g = []

	grid.forEach((row, j) => {

  if (j%2) {
   g[Math.floor(j/2)] = []
  }

		row.forEach((cell, i) => {

			if (cell != 2) {
				//	ctx.fillRect(i*blockSizeX-1, j*blockSizeY-1, blockSizeX+1, blockSizeY+1)
			}


			if (!(i+j)) {
     ctx.fillStyle = 'red'
					ctx.fillRect(i*blockSizeX-1, j*blockSizeY-1, blockSizeX+1, blockSizeY+1)
ctx.fillStyle = 'tan'
			}


   if (j%2 && i%2) {
   // alert(i+' & '+j)
    g[Math.floor(j/2)][Math.floor(i/2)] = (grid[j-1][i] != 2 ? 2 : 0) + (grid[j+1][i] != 2 ? 0 : 0) + (grid[j][i-1] != 2 ? 1 : 0) + (grid[j][i+1] != 2 ? 4 : 0)
// 
   }

		})
	})

 




	var ds = 360 / g.length
	var w = gameWidth / (g[0].length*2+2)

	g.forEach(function(row, j) {
		console.log(row, j, ds, w)
	 row.forEach(function(cell, i) {


  if (!(i+j) || true)
	 	ctx.section(gameWidth/2, gameWidth/2, w*(1+i), w*(2+i), ds*j, (j+1)*ds, cell)

  })

	})


} catch(e) { alert(e) }



	return {
		x: gameWidth/2,// Math.floor((px+.5) * blockSizeX),
		y: Math.floor((py+.5) * blockSizeY ),
		z: blockSizeX,
		hole: {
			x: Math.floor((end.x+.5) * blockSizeX),
			y: Math.floor((end.y+.5) * blockSizeY),
			z: blockSizeX
		}
	}

}
