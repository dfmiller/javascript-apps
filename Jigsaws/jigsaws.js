
var imgPath = './photos/';

const INNY = 1;
const OUTTY = 0;
const FLAT = 2;

var allImages = [
	{
		'name': 'pictures',
		'images': [
			'IMG_20190525_064600.jpg',
			'IMG_20190619_195550.jpg',
			'IMG_20190622_134308.jpg',
			'IMG_20190622_135531.jpg',
			'IMG_20190805_201725.jpg',
			'IMG_20190814_141302.jpg',
			'IMG_20190814_142144.jpg',
			'IMG_20190814_193339.jpg',
			'IMG_20190815_152650.jpg',
			'IMG_20190824_105324.jpg',
			'IMG_20190824_112800.jpg',
			'IMG_20190824_112836.jpg',
			'IMG_20190824_113604.jpg',
			'IMG_20190914_101426.jpg',
			'IMG_20190927_190301.jpg',
			'IMG_20190928_110047.jpg',
			'IMG_20191116_104750.jpg',
			'IMG_20200206_122406.jpg',
			'IMG_20200327_193030.jpg',
			'IMG_20200327_193059.jpg',
			'IMG_20200408_122754.jpg',
			'cat.jpg',
			'tranquil.jpg',
			'yellowstone.jpg',
		],
		'dir': ''
	},

	{
		'name': 'pictures',
		'images': [
			'20916762523_df2ab4ea14_k.jpg',
			'21300472078_8695453607_k.jpg',
			'21325477025_f422396340_k.jpg',
			'21349909570_c91e7ec9ec_k.jpg',
			'21349965990_f6a6329960_k.jpg',
			'21464147656_f386cacb86_k.jpg',
			'21479707222_28fa1e1632_k.jpg',
			'21537912355_9d139dd6af_k.jpg',
			'21559100471_0a5c5bb130_k.jpg',
			'21620527739_282926df8a_k.jpg',
			'21941093686_4da7d48b6b_k.jpg',
			'22224680063_e60c8221dc_k.jpg',
			'22249190376_fd8cc0a8f3_k.jpg',
			'22422727706_fec2db4cf4_k.jpg',
			'22520836873_fba8276a77_k.jpg',
			'22674030070_3a129131fb_k.jpg',
			'23004873166_f799d9bbe2_k.jpg',
			'25108918390_1644e45a45_k.jpg',
			'26460634531_ada9f4e6db_k.jpg',
			'26913364543_9dfd9d6b5d_k.jpg',
		],
		'dir': '2/'
	},

];

allImages.forEach(function(group) {
	group.images.forEach(function(img) {
        addPhoto(imgPath + group.dir + img)
	})
})

function addPhoto(path, before) {
	var img = document.createElement('IMG')
	img.setAttribute('src', path)
	img.addEventListener('click', function(e) {
		document.querySelectorAll('.selected').forEach(function(selected) {
			selected.removeAttribute('class')
		})
		this.setAttribute('class', 'selected')
	})

	var span = document.createElement('SPAN')
	span.appendChild(img)
	if (before) {
		document.querySelector('#imageGrid').insertBefore(span, document.querySelector('.selected').parentElement)
		document.querySelectorAll('.selected').forEach(function(selected) {
			selected.removeAttribute('class')
		})
		img.setAttribute('class', 'selected')
	} else {
		document.querySelector('#imageGrid').appendChild(span)
	}

	if (path.split('/').pop() == (localStorage.getItem('jigsawSrc') || '').split('/').pop()) {
		img.classList.add('selected')
	}
}


(function( window, undefined ) {
	var js = {
		canvas: 0,
		ctx: 0,
		canvasW: 0,
		canvasH: 0,
		canvasTopLeft: 0,
		canvasTopRight: 0,
		canvasBottomLeft: 0,
		canvasBottomRight: 0,
		savedCanvasW: 0,
		savedCanvasH: 0,
		idealW: 1, //gets set later based on image size
		idealH: 1,
		canvasmode: 1,
		pieceCount: 2,
		pieceCountX: 3, //number of pieces across
		pieceCountY: 2, //number of pieces down
		puzzle: 0,
		pieces: [],
		solvedPieces: [],
		clickedPiece: -1,
		drawn: false,
		debug: 0,
        aside: 64,

		general: {
			init: function() {
                js.aside = document.querySelector('body > header').clientHeight
				js.canvas = document.querySelector('#canvas');
				js.ctx = js.canvas.getContext('2d');
                js.ctx.font = js.ctx.font.replace(/\d+px/, (parseInt(js.ctx.font.match(/\d+px/)) * 4) + 'px')
                js.outlines = document.createElement('CANVAS');
                js.outlines.classList.add('outlines')
                js.canvas.parentNode.insertBefore(js.outlines, js.canvas)
				js.backgroundCtx = js.outlines.getContext('2d');
				js.general.initPuzzle();
				this.setupEvents();
				setInterval(js.general.drawPieces, 10);
			},

			rnd: function(n) {
				return n ? Math.floor(Math.random()*n) : Math.random()
			},

			initPuzzle: function() {
				for(var i = 1; i<10; i++) {
					var option = document.createElement('OPTION')
					option.setAttribute('value', i)
					option.text = (i+1) * Math.ceil((i+1)*1.33)
					document.querySelector('#pieces').appendChild(option)
				}

                js.showOutlines = localStorage.getItem('showOutlines') != 0
                document.querySelector('.showOutlines').checked = js.showOutlines

				js.general.initImage()
			},


			initImage: function() {
				var puzzle = document.querySelector('.selected')
				if (puzzle == null) {
					puzzle = document.querySelector('#imageGrid img')
					puzzle.classList.add('selected')
				}

				localStorage.setItem('jigsawSrc', puzzle.src)

				var puzzleSrc = puzzle.src

        		if (puzzle.naturalWidth > puzzle.naturalHeight) {
					var width = puzzle.naturalWidth
					var height = puzzle.naturalHeight
					var temp = document.createElement('CANVAS')
					temp.width = temp.height = height
					var ctx = temp.getContext('2d')
					ctx.save()
					ctx.drawImage(puzzle, -(puzzle.naturalWidth - temp.height) / 2, 0)
					ctx.restore()
					js.idealW = width
					js.idealH = height

                    try {
    		        	puzzleSrc = temp.toDataURL()
                    } catch(e) {
                        console.error(e)
                    }
				}

				js.puzzle = new Image()
				js.puzzle.src = puzzleSrc

				js.puzzle.onload = function() {
					js.idealW = js.puzzle.naturalWidth;
					js.idealH = js.puzzle.naturalHeight;

					document.querySelector('.previewButton img').setAttribute('src', puzzleSrc);
					js.general.initCanvasSize();
					js.savedCanvasW = js.canvasW;
					js.savedCanvasH = js.canvasH;
					js.pieceCount = parseInt(localStorage.getItem('pieceCount') || 4)

					js.pieceCountX = Math.ceil((js.pieceCount+1) * (js.idealW > js.idealH ? 1.33 : 1));
					js.pieceCountY = Math.ceil((js.pieceCount+1) * (js.idealW <= js.idealH ? 1.33 : 1));

					document.querySelector('#pieces').selectedIndex = js.pieceCount-1
					js.general.createPieces();
					js.puzzle.setAttribute('class', 'selected')

	                js.general.drawBackground()

					document.querySelector('#body').className = ''
					document.querySelector('#options').className = 'optionswrapper'

					js.drawn = false
				}
                js.puzzle.onerror = function() {
                    puzzle.parentNode.removeChild(puzzle)
                    js.general.initImage()
        		}

			},

			//initialize the size of the canvas based on the ideal aspect ratio and the size of the parent element
			initCanvasSize: function() {
				var parentEl = document.querySelector('.canvasWrapper')
				var targetW = parentEl.offsetWidth
				var targetH = parentEl.offsetHeight

				var sizes = js.general.calculateAspectRatio(js.idealW, js.idealH, targetW, targetH)

				js.outlines.width = js.canvas.width = js.canvasW = sizes[0]
				js.canvasH = sizes[1]
                js.aside = document.querySelector('.canvasWrapper').clientHeight - js.canvasH
				js.outlines.height = js.canvas.height = sizes[1] + js.aside
			},

			//given a width and height representing an aspect ratio, and the size of the containing thing, return the largest w and h matching that aspect ratio
			calculateAspectRatio: function(idealW, idealH, parentw, parenth) {
				var aspect = Math.floor((parenth / idealH) * idealW);
				var cwidth = Math.min(idealW, parentw);
				var cheight = Math.min(idealH, parenth);
				var w = Math.min(parentw, aspect);
				var h = (w / idealW) * idealH;
				return([w,h]);
			},

			//returns the percentage amount that object is of wrapper
			calculatePercentage: function(object, wrapper) {
				return((100 / wrapper) * object);
			},

			clearCanvas: function(_canvas, _ctx) {
                _ctx.clearRect(0, 0, _canvas.width, _canvas.height)
                _ctx.fillStyle = 'silver'
			},

			resizeCanvas: function() {
				js.general.initCanvasSize();
				var diffx = (js.canvasW / js.savedCanvasW) * 100;
				var diffy = (js.canvasH / js.savedCanvasH) * 100;
				for(var p = 0; p < js.pieces.length; p++) {
					js.pieces[p].x = (js.pieces[p].x / 100) * diffx;
					js.pieces[p].y = (js.pieces[p].y / 100) * diffy;
					js.pieces[p].w = (js.pieces[p].w / 100) * diffx;
					js.pieces[p].h = (js.pieces[p].h / 100) * diffy;
					js.pieces[p].solvedX = (js.pieces[p].solvedX / 100) * diffx;
					js.pieces[p].solvedY = (js.pieces[p].solvedY / 100) * diffy;
				}
				for(p = 0; p < js.solvedPieces.length; p++) {
					js.solvedPieces[p].x = (js.solvedPieces[p].x / 100) * diffx;
					js.solvedPieces[p].y = (js.solvedPieces[p].y / 100) * diffy;
					js.solvedPieces[p].w = (js.solvedPieces[p].w / 100) * diffx;
					js.solvedPieces[p].h = (js.solvedPieces[p].h / 100) * diffy;
					js.solvedPieces[p].solvedX = (js.solvedPieces[p].solvedX / 100) * diffx;
					js.solvedPieces[p].solvedY = (js.solvedPieces[p].solvedY / 100) * diffy;
				}
				js.savedCanvasW = js.canvasW;
				js.savedCanvasH = js.canvasH;
                js.drawn = false;
                js.general.drawBackground()
			},

			randomNumber: function(min, max) {
				return((Math.random() * (max - min) + min));
			},

			//click events
			setupEvents: function() {
				var ondown = ((document.ontouchstart!==null) ? 'mousedown' : 'touchstart');
				js.canvas.addEventListener(ondown, function(e) {
					var clicked = js.general.clickDown(e);
					js.general.clickPiece(clicked[0],clicked[1]);
				},false);

				var onup = ((document.ontouchstart!==null) ? 'mouseup' : 'touchend');
				js.canvas.addEventListener(onup, function(e) {
					js.general.releasePiece();
				},false);

				var onmove = ((document.ontouchstart!==null) ? 'mousemove' : 'touchmove');
				js.canvas.addEventListener(onmove, function(e) {
					if (js.clickedPiece !== -1) {
						js.general.movePiece(e);
					}
				}, false)

                js.canvas.addEventListener('contextmenu', function(e) {
                    js.general.movePieces(e.offsetY > js.canvasH)
				}, false)

				document.querySelector('#updatePuzzle').addEventListener(ondown, function(e) {
					js.general.updateSettings();
				}, false)

				document.querySelector('#closeDialog').addEventListener(ondown, function(e) {
					document.querySelector('#options').className = 'optionswrapper'
				}, false)

				document.querySelector('.optionsTrigger').addEventListener(ondown, function(e) {
					document.querySelector('#options').className = 'optionswrapper shown';
					document.querySelector('.selected').scrollIntoView({behavior: 'auto', inline: 'center'})
				}, false)
/*
				document.querySelector('#fileupload').addEventListener('click', function(e) {
					e.target.value = ''
				})

				document.querySelector('#fileupload').addEventListener('change', function(e) {
					Array.from(e.target.files).forEach(function(file) {
						if (typeof file !== 'undefined') {
							var reader = new FileReader();
							reader.onload = function() {
								addPhoto(reader.result, null, true)
							}
							reader.readAsDataURL(file)
						}
					})
				})
*/

				document.querySelector('.nextButton').addEventListener('click', function(e) {
					js.general.updateSettings();
				})

				document.querySelector('.previewButton').addEventListener('click', function(e) {
					this.classList.toggle('active')
				});

			},

			//find where on the canvas the mouse/touch is
			clickDown: function(e) {
				var rect = js.canvas.getBoundingClientRect();
				var x = e.clientX - rect.left;
				var y = e.clientY - rect.top;
				if (typeof e.changedTouches !== 'undefined') {
					x = e.changedTouches[0].pageX - rect.left;
					y = e.changedTouches[0].pageY - rect.top;
				}
				return([x,y]);
			},

			//identify which piece has been clicked on
			clickPiece: function(x,y) {
				for(var i = js.pieces.length - 1; i >= 0; i--) {
					if (js.general.checkCollision(js.pieces[i],x,y)) {
						js.clickedPiece = i;
						js.general.hideAllPieces();
						js.pieces[i].visible = 1;
						js.pieces[i].offsetx = x - js.pieces[i].x;
						js.pieces[i].offsety = y - js.pieces[i].y;
						break;
					}
				}
				if (js.clickedPiece != -1) {
					document.querySelector('body').classList.add('clickedPiece')
				}
			},

			//let go of the current piece
			releasePiece: function() {
				if (js.clickedPiece !== -1) {
					for(var p = 0; p < js.pieces.length; p++) {
						js.pieces[p].visible = 1;
					}
					js.pieces[js.clickedPiece].offsetx = 0;
					js.pieces[js.clickedPiece].offsety = 0;
					var solved = js.general.checkSolved(js.pieces[js.clickedPiece]);

					if (!solved) {
						//move selected piece to the end of the array - makes last touched piece always be on top
						var tmp = js.pieces[js.clickedPiece];
						js.pieces.splice(js.clickedPiece,1);
						js.pieces.push(tmp);
					}

					js.clickedPiece = -1;
					document.querySelector('body').classList.remove('clickedPiece')
					js.drawn = false;

					if (js.pieces.length === 0) {
						document.querySelector('#body').className = 'solved';
						var next = document.querySelector('.selected').parentElement.nextSibling
						if (next == null) {
							next = document.querySelector('#imageGrid').firstChild
						}

						document.querySelectorAll('.selected').forEach(function(selected) {
							selected.removeAttribute('class')
						})
						next.firstChild.setAttribute('class', 'selected')

						document.querySelector('.nextButton').style.display = 'flex'
						document.querySelector('.previewButton').style.display = 'none'
					}

                    js.general.storePieces()

				}
			},


            storePieces() {
                var pieces = js.pieces.map(function(piece) {
                    return {
                        rowX: piece.rowX,
                        rowY: piece.rowY,
                        x: piece.x,
                        y: piece.y,
                    }
                })
                localStorage.setItem('jigsawPuzzle', JSON.stringify(pieces))
            },

			//once selected, move a piece with the mouse
			movePiece: function(e) {
				var movement = js.general.clickDown(e);
				var thisPiece = js.pieces[js.clickedPiece];
				var posx = movement[0] - thisPiece.offsetx;
				var posy = movement[1] - thisPiece.offsety;
				// limit the movement to within the canvas frame
				var x = Math.min(Math.max(0, posx), js.canvasW - thisPiece.w);
				var y = Math.min(Math.max(0, posy), js.canvasH + js.aside - thisPiece.h);
				thisPiece.x = x;
				thisPiece.y = y;
			},

			//once finished moving a piece, check to see if it is in place
			checkSolved: function(thisPiece) {
				var solved = 0;
				var newx = thisPiece.x;
				var newy = thisPiece.y;
				var sx = thisPiece.solvedX;
				var sy = thisPiece.solvedY;

				var tolerance = 20;

				//if the piece is solved
				if (Math.abs(newx - sx) <= tolerance && Math.abs(newy - sy) <= tolerance) {
					solved = 1;
					thisPiece.x = sx;
					thisPiece.y = sy;
					thisPiece.solved = 1;

					var tmp = thisPiece;
					//remove the piece from the array of pieces and add to the solved array
					//means we can always draw the solved pieces first, beneath the unsolved
					js.pieces.splice(js.clickedPiece,1);
					js.solvedPieces.push(tmp);
				}
				return solved;
			},

			checkCollision: function(piece,x,y) {
				if (!piece.solved) {
					//rule out any possible collisions, remembering that all y numbers are inverted on canvas
					//y is below piece bottom edge
					if (y > piece.y + piece.h) {
						return(0);
					}
					//y is above top edge
					if (y < piece.y) {
						return(0);
					}
					//x is beyond right edge
					if (x > piece.x + piece.w) {
						return(0);
					}
					//x is less than left edge
					if (x < piece.x) {
						return(0);
					}
					return(1); //collision
				} else {
					return(0);
				}
			},

			//update the puzzle based on entered values when 'update' is clicked
			updateSettings: function() {
				document.querySelector('.nextButton').style.display = 'none'
				document.querySelector('.previewButton').style.display = 'flex'
				js.pieceCount = Math.max(document.querySelector('#pieces').value * 1, 1)
				localStorage.setItem('pieceCount', js.pieceCount)
                js.showOutlines = document.querySelector('.showOutlines').checked
                localStorage.setItem('showOutlines', js.showOutlines ? 1 : 0)
				js.general.initImage()
                localStorage.removeItem('jigsawPuzzle')
			},

			hideAllPieces: function() {
				for(var p = 0; p < js.pieces.length; p++) {
					js.pieces[p].visible = 0;
				}
			},

            movePieces: function(below) {
				var w = js.canvasW / js.pieceCountX;
                var h = js.canvasH / js.pieceCountY;
				var rangeMinX = (js.canvasW / 100) * 1;
				var rangeMaxX = ((js.canvasW - w) / 100) * 99;
				var rangeMinY = (js.canvasH / 100) * 1;
				var rangeMaxY = ((js.canvasH - h) / 100) * 99;
                js.pieces.forEach(function(piece) {
                    piece.x = js.general.randomNumber(rangeMinX, rangeMaxX)
	    			piece.y = (
                        below
                        ? js.canvasH + js.general.randomNumber(0, js.aside - h)
                        : js.general.randomNumber(rangeMinY, rangeMaxY) 
                    )
                })
                js.drawn = false
                js.general.storePieces()
            },

			//create all the pieces of the puzzle
			createPieces: function() {
				js.pieces = [];
				js.solvedPieces = [];
				var w = js.canvasW / js.pieceCountX;
				var h = js.canvasH / js.pieceCountY;

				//try to distribute the pieces within the middle of the puzzle, so we can work on the edges first
				var rangeMinX = (js.canvasW / 100) * 1;
				var rangeMaxX = ((js.canvasW - w) / 100) * 99;
				var rangeMinY = (js.canvasH / 100) * 1;
				var rangeMaxY = ((js.canvasH - h) / 100) * 99;

				for(var y = 0; y < js.pieceCountY; y++) {
					for(var x = 0; x < js.pieceCountX; x++) {
						var pieceX = js.general.randomNumber(rangeMinX, rangeMaxX);
						var pieceY = js.general.randomNumber(rangeMinY, rangeMaxY)
                        //var pieceY = js.canvasH + js.aside - h
						if (js.debug) { //if in debug mode, start the puzzle completed
							pieceX = w * x;
							pieceY = h * y;
						}
						var solvedX = w * x;
						var solvedY = h * y;
						var spriteX = 0;
						var spriteY = 0;

						var newPiece = {
							x: pieceX,
							y: pieceY,
							w: w,
							h: h,
							solvedX: solvedX,
							solvedY: solvedY,
							spritex: spriteX,
							spritey: spriteY,
							visible: 1,
							solved: 0,
							offsetx: -1,
							offsety: -1,
							rowX: x,
							rowY: y,
							corners: {
								topLeft: (
									x == 0
									? 0
									: js.pieces[js.pieces.length-1].corners.topRight
								),
								topRight: (
									x == js.pieceCountX-1
									? 0
									: (
										y == 0
										? js.general.rnd(w/5) - w/10
										: js.pieces[js.pieces.length - js.pieceCountX].corners.bottomRight
									)
								),
								bottomLeft: (
									x == 0
									? 0
									: js.pieces[js.pieces.length-1].corners.bottomRight
								),
								bottomRight: (
									x == js.pieceCountX-1
									? 0
									: js.general.rnd(w/5) - w/10
								),

								leftTop: (
									y == 0
									? 0
									: js.pieces[js.pieces.length - js.pieceCountX].corners.leftBottom
								),
								rightTop: (
									y == 0
									? 0
									: js.pieces[js.pieces.length - js.pieceCountX].corners.rightBottom
								),
								leftBottom: (
									y == js.pieceCountY-1
									? 0
									: (
										x == 0
										? js.general.rnd(w/5) - w/10
										: js.pieces[js.pieces.length-1].corners.rightBottom
									)
								),
								rightBottom: (
									y == js.pieceCountY-1
									? 0
									: js.general.rnd(w/5) - w/10
								),


							},
							sides: {
								top: (
									y == 0
									? FLAT
									: (
										js.pieces[js.pieces.length - js.pieceCountX].sides.bottom == INNY
										? OUTTY
										: INNY
									)
								),
								bottom: (
									y == js.pieceCountY-1
									? FLAT
									: (
										js.general.rnd() > .5
										? OUTTY
										: INNY
									)
								),
								left: (
									x == 0
									? FLAT
									: (
										js.pieces[js.pieces.length-1].sides.right == INNY
										? OUTTY
										: INNY
									)
								),
								right: (
									x == js.pieceCountX-1
									? FLAT
									: (
										js.general.rnd() > .5
										? OUTTY
										: INNY
									)
								),
							}
						}

						js.pieces.push(newPiece);
					}
				}

				js.pieces.sort(function(a, b) {
					return .5 - Math.random();
				})


                var z = localStorage.getItem('jigsawPuzzle')
                if (z) {
                    z = JSON.parse(z)
                    if (z.length) {
                        js.pieces.forEach(function(piece, index) {
                            var found = z.find(function(saved) {
                                return piece.rowX == saved.rowX && piece.rowY == saved.rowY
                            })

                            if (found) {
                                piece.x = found.x
                                piece.y = found.y
                            } else {
                                piece.x = piece.solvedX
                                piece.y = piece.solvedY
                                piece.solved = 1
            					js.solvedPieces.push(piece)
                            }
                        })

					    js.pieces = js.pieces.filter(function(piece) {
						    return piece.solved == 0
					    })
                    }
                }

                js.general.storePieces()

			},

            drawBackground: function() {
                js.general.clearCanvas(js.outlines, js.backgroundCtx)
                if (js.showOutlines) {
    				js.pieces.forEach(function(piece) {
	    				js.general.drawPiece(piece, true);
	    			})
                }
            },

			drawPieces: function() {
				if (js.clickedPiece != -1 || !js.drawn) {
					js.general.clearCanvas(js.canvas, js.ctx)
                    js.ctx.fillStyle = (js.pieces.length === 0 ? 'black' : 'white')
                    js.ctx.fillRect(0, js.canvas.height - js.aside, js.canvas.width, js.canvas.height)
                    js.ctx.textAlign = 'center'
                    js.ctx.fillStyle = 'black'
                    js.ctx.fillText('PRESS AND HOLD HERE TO CLEAR BOARD', js.canvasW/2, js.canvasH + js.aside/2)
					for(var p = 0; p < js.solvedPieces.length; p++) {
						js.general.drawPiece(js.solvedPieces[p]);
					}
					for(var q = 0; q < js.pieces.length; q++) {
						js.general.drawPiece(js.pieces[q]);
					}
					js.drawn = true
				}
			},

			//edge is either 0,1,2,3 - corresponding to top, right, bottom, left, arcCounterClockwise decides if tab or blank, ie. in or out
			drawTabOrBlank: function(piece, edge, arcCounterClockwise, doBackground) {
				if (arcCounterClockwise == FLAT) {
					return;
				}
				var arcRadius = Math.min(piece.h / 5, piece.w / 5);
				var arcX = 0;
				var arcY = 0;
				var arcStartAngle = 0;
				var arcEndAngle = 0;

                var pieceX = (doBackground ? piece.solvedX : piece.x)
                var pieceY = (doBackground ? piece.solvedY : piece.y)

				switch(edge) {
					case 0:
						arcX = pieceX + (piece.w / 2);
						arcY = pieceY;
						arcStartAngle = 1 * Math.PI;
						arcEndAngle = 0 * Math.PI;
					break;
					case 1:
						arcX = pieceX + piece.w;
						arcY = pieceY + (piece.h / 2);
						arcStartAngle = 1.5 * Math.PI;
						arcEndAngle = 0.5 * Math.PI;
					break;
					case 2:
						arcX = pieceX + (piece.w / 2);
						arcY = pieceY + piece.h;
						arcStartAngle = 0 * Math.PI;
						arcEndAngle = 1 * Math.PI;
					break;
					case 3:
						arcX = pieceX;
						arcY = pieceY + (piece.h / 2);
						arcStartAngle = 0.5 * Math.PI;
						arcEndAngle = 1.5 * Math.PI;
					break;
				}
                (doBackground ? js.backgroundCtx : js.ctx).arc(arcX, arcY, arcRadius, arcStartAngle + (arcCounterClockwise ? 1 : -1)*.5, arcEndAngle- (arcCounterClockwise ? 1 : -1)*.5, arcCounterClockwise);
			},

			drawPiece: function(piece, doBackground) {
                var pieceX = (doBackground ? piece.solvedX : piece.x)
                var pieceY = (doBackground ? piece.solvedY : piece.y)
                var ctx = (doBackground ? js.backgroundCtx : js.ctx)

				ctx.save();

				// if (js.puzzle.naturalWidth > js.puzzle.naturalHeight) {
				// 	ctx.translate(250, 175);
				// 	ctx.rotate(90*Math.PI/180)
				// }

				if (piece.solved) {
					js.ctx.lineWidth = 0;
					js.ctx.strokeStyle = 'rgba(0,0,0,0)';
					if (js.clickedPiece == -1 && js.pieces.length) {
						js.ctx.globalAlpha = 0.5;
					} else {
						js.ctx.globalAlpha = 1;
					}
				} else {
					js.ctx.lineWidth = 8;
					js.ctx.strokeStyle = 'rgba(0,0,0,0.5)';
					if (!piece.visible) {
						js.ctx.globalAlpha = 0.25;
					}
				}

				ctx.beginPath();
				ctx.moveTo(pieceX + piece.corners.topLeft, pieceY + piece.corners.leftTop); //top left corner

				js.general.drawTabOrBlank(piece,0,piece.sides.top, doBackground);

				ctx.lineTo(pieceX + piece.w + piece.corners.topRight, pieceY + piece.corners.rightTop); //top right corner

				//deal with right edge
				js.general.drawTabOrBlank(piece,1,piece.sides.right, doBackground);

				ctx.lineTo(pieceX + piece.w + piece.corners.bottomRight, pieceY + piece.h + piece.corners.rightBottom); //bottom right corner

				//deal with bottom edge
				js.general.drawTabOrBlank(piece,2,piece.sides.bottom, doBackground);

				ctx.lineTo(pieceX + piece.corners.bottomLeft, pieceY + piece.h + piece.corners.leftBottom); //bottom left corner

				//deal with left edge
				js.general.drawTabOrBlank(piece,3,piece.sides.left, doBackground);

				//ctx.lineTo(pieceX, pieceY); //top left corner - back to origin
				ctx.closePath(); //back to origin

				ctx.clip();
                if (!doBackground) {
    				ctx.drawImage(js.puzzle, 0 - piece.solvedX + pieceX, 0 - piece.solvedY + pieceY, js.canvasW, js.canvasH);
                }

				if (doBackground) {
					ctx.lineWidth = 2
					ctx.strokeStyle = '#000';
					ctx.stroke();
				} else if (!piece.solved) {
					ctx.lineWidth = 6
					ctx.strokeStyle = 'white';
					ctx.stroke();

					ctx.lineWidth = 4
					ctx.strokeStyle = '#888';
					ctx.stroke();

					ctx.lineWidth = 2
					ctx.strokeStyle = 'black';
					ctx.stroke();
				}

				ctx.restore();
			}
		},


        getPhoto: function(sourceType) {
		// 0: library, 1: camera
		    navigator.camera && navigator.camera.getPicture && navigator.camera.getPicture(
			    function(src) {
                    addPhoto(src, null, true)
				    //alert(src)
				    //$('.settingsDialog').attr('open', true)
				    //PhotoPuzzle.createSource(src, true, 'my_photos')
			    },
			    function(error) {
				    alert(error);
			    },
			    {
				    sourceType: sourceType,
				    targetWidth: 768,
				    targetHeight: 1024,
                    correctOrientation: true,
			    }
		    )
	    }


	};
	window.js = js;
})(window);

window.onload = function() {
	js.general.init();

	var resize;
	window.addEventListener('resize', function(event) {
		clearTimeout(resize);
		resize = setTimeout(js.general.resizeCanvas, 200);
	});
};
