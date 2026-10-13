

function builder2(gameWidth, gameHeight, size) {
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
       return x>=0 && x < blocksX && y>=0 && y < blocksY && grid[y][x] != 2
     }

	//basic grid

	var grid = []
	;[...Array(blocksY).keys()].forEach((row,j) => {
		grid[row] = grid[row] || []
		;[...Array(blocksX).keys()].forEach((cell, i) => {

			var fill = (i == 0 || i == blocksX-1 || j == 0 || j == blocksY-1 || (i%2 == 0 && j%2 == 0)) 
				? 1 : 0
			

			grid[row][cell] = grid[row][cell] || fill

		})
	})

	//pick random spot to start
	let px = 0
	let py = 0

	while(grid[py][px]) {
		py = rnd(blocksY/2-1)*2+1
		px = rnd(blocksX/2-1)*2+1
	}


	let	end = {
  x:px,
  y:py
 }
	


//*

  var dirs = [
   { dx: 0, dy: 1 },
   { dx: 0, dy: -1 },
   { dx: 1, dy: 0 },
   { dx: -1, dy: 0 }
  ]

  var stack =[]
stack.push({ x: px, y: py })

  //for(var i = 0;i< 1255; i++) {
  while(stack.length) {
   if (grid[py][px] != 2) {
    stack.push({ x: px, y: py })
    grid[py][px] = 2
   }
  
  var d = rnd(dirs.length)
  var dir = dirs[d]
  var counter = 0
  while(counter < 4) {
  if (valid(py+dir.dy*2, px+dir.dx*2)) {
   grid[py+dir.dy][px+dir.dx] = 2
  // grid[py+dir.dy*2][px+dir.dx*2] = 2

   py += dir.dy*2
   px += dir.dx*2
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
 }



}

/* */


  grid[py][px] = 2

    return {
        grid: grid,
        px: px,
        py: py,
        end: end
    }

}
