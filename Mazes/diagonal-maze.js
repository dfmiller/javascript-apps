
function diagonal(ctx, gameWidth, gameHeight) {

var blocksX = 10
var blocksY = Math.floor(gameHeight/(gameWidth / blocksX))

var grid = []
;[...Array(blocksY).keys()].forEach((row,j) => {
	grid[row] = []
	;[...Array(blocksX).keys()].forEach((cell, i) => {
		var fill = rnd()>.5 ? 1 : -1
  //fill = Math.floor(Math.random()*3)-1

  if (j == 0) {
    if ((i % 2) == 0) {
     fill = -1
    } else {
     fill = 1
    }
   } else if (i == 0) {
    if ((j % 2) == 0) {
     fill = -1
    } else {
     fill = 1
    }
   } else if (j == blocksY-1) {
    if ((i % 2) == 0) {
     fill = 1
    } else {
     fill = -1
    }
   } else if (i == blocksX-1) {
    if ((j % 2) == 0) {
     fill = 1
    } else {
     fill = -1
    }
   }


   grid[row][cell] = fill

	})
})

console.log(grid)

var blockSizeX = gameWidth / blocksX
var blockSizeY = gameHeight / blocksY

ctx.strokeStyle = 'tan';
ctx.lineWidth = 1

grid.forEach((row, j) => {
	row.forEach((cell, i) => {

		if (
				cell == -1
				&& i < blocksX-1
				&& j < blocksY-1
				&& grid[j][i+1] == 1
				&& grid[j+1][i] == 1
				&& grid[j+1][i+1] == -1
			) {

    var r = rnd(15)+1

					if (r&1) cell = 0
					if (r&2) grid[j][i+1] = 0
					if (r&4) grid[j+1][i] = 0
					if (r&8) grid[j+1][i+1] = 0
			}



	
			for(var z=0;z<5;z++) {
        	ctx.strokeStyle = z ? 'tan' : 'black'
        	ctx.beginPath();
          	if (cell == 1) {
              ctx.moveTo(0+(i*blockSizeX), 0+(j*blockSizeY)-z);
              ctx.lineTo(blockSizeX+(i*blockSizeX), blockSizeY+(j*blockSizeY)-z);
          	} else if (cell == -1) {
              ctx.moveTo(0+(i*blockSizeX), blockSizeY+(j*blockSizeY)-z);
              ctx.lineTo(blockSizeX+(i*blockSizeX), 0+(j*blockSizeY)-z);
						}
					ctx.stroke();
      }
		
	})
})

}


/*
for(var j=0;j<50;j++) {
	for(var i=0;i<25;i++) {
		var r = Math.random()>.5 ? 1 : -1
		for(var z=0;z<5;z++) {
        	ctx.strokeStyle = z ? 'tan' : 'black'
        	ctx.beginPath();
          	if (r == 1) {
              ctx.moveTo(0+(i*blockSizeX), 0+(j*blockSizeY)-z);
              ctx.lineTo(blockSizeX+(i*blockSizeX), blockSizeY+(j*blockSizeY)-z);
          	} else {
              ctx.moveTo(0+(i*blockSizeX), blockSizeY+(j*blockSizeY)-z);
              ctx.lineTo(blockSizeX+(i*blockSizeX), 0+(j*blockSizeY)-z);
			}
			ctx.stroke();
        }
    }
}

*/

