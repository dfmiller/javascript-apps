
if (localStorage.getItem('myphotos')) {
	localStorage.setItem('my_photos', localStorage.getItem('myphotos'))
	localStorage.removeItem('myphotos')
}


const PhotoPuzzle = {

	use_sounds: localStorage.getItem('use_sounds') != 0,
	audio: {
		audio_select: './select.mp3',
		audio_complete: './complete.mp3',
		audio_score_1: './score_1.mp3',
		audio_score2: './score2.mp3',
		audio_score8: './score8.mp3',
	},
	sound: function(sound) {
		if (PhotoPuzzle.use_sounds) {
			console.log(sound, PhotoPuzzle[sound])
			if (PhotoPuzzle.last_sound) {
				PhotoPuzzle[PhotoPuzzle.last_sound].pause()
				PhotoPuzzle[PhotoPuzzle.last_sound].currentTime = 0
			}
			PhotoPuzzle.last_sound = sound
			PhotoPuzzle[sound].play()
		}
	},

	awsPath: 'https://photo-puzzles.s3-us-west-1.amazonaws.com/',

	/* from local storage */
	games_completed: 0,

	folders: {
		architecture: architecture,
		animals: animals,
		nature: nature,
		spring: spring,
		summer: summer,
		autumn: autumn,
		winter: winter,
		misc: misc,
		my_photos: JSON.parse(localStorage.getItem('my_photos') || '[]')
	},

	srcIndexes: JSON.parse(localStorage.getItem('srcIndexes') || '{}'),

	folder: localStorage.getItem('photoPuzzles.folder'),

	gridSizes: [3,4,5,6,7,8,9],
	gridSize: localStorage.getItem('gridSize') || 5,

	score: localStorage.getItem('score') || 0,
	high_score: localStorage.getItem('highScore') || 0,

	level: (localStorage.getItem('level') || 1) * 1,

	init: function() {

		for(audio in PhotoPuzzle.audio) {
			PhotoPuzzle[audio] = new Audio(PhotoPuzzle.audio[audio])
			PhotoPuzzle[audio].load()
		}
		$('.playSounds').attr('checked', PhotoPuzzle.use_sounds).click(function() {
			PhotoPuzzle.use_sounds = $('.playSounds').is(":checked") ? 1 : 0
			localStorage.setItem('use_sounds', PhotoPuzzle.use_sounds ? 1 : 0)
		})

		if (Object.keys(PhotoPuzzle.folders).indexOf(PhotoPuzzle.folder) == -1) {
			PhotoPuzzle.folder = null;
		}

		PhotoPuzzle.folder = PhotoPuzzle.folder || Object.keys(PhotoPuzzle.folders)[0]

		$('.pickLevel').val(PhotoPuzzle.level)

		switch(PhotoPuzzle.level) {
			case 2:
				$('.gameBoard').addClass('step-0')
			break

			case 1: default:
				$('.gameBoard').addClass('step-1')
			break
		}
		$('#high_score').text(this.high_score)
		$('#score').text(this.score)
		this.initTabs()
		this.initSizes()
		this.initSources()

		var selected = this.srcIndexes[this.folder]+1

		$('.thumbs span:nth-child('+selected+')').addClass('selected')

		this.bindElements()

		if (localStorage.getItem('squares')) {
			$('.settingsDialog form').submit()
		} else if (!localStorage.getItem('hide-help')) {
            setTimeout(function() { $('.helpDialog').attr('open', true) }, 1)
            $('.settingsDialog form').submit()
            localStorage.setItem('hide-help', true)
        } else {
			setTimeout(function() { $('.settingsDialog').attr('open', true) }, 1)
		}
	},


	initTabs: function() {
		$('.tabs').empty()
		Object.keys(this.folders).forEach(function(folder) {
			$('.tabs').append(
				$('<li class="tab-'+folder+' '+(folder === PhotoPuzzle.folder ? 'selected' : '')+'">'+folder.replace('_', ' ')+'</li>').click(function() {
					var tab = this
					return (function() {
						$('.tabs li').removeClass('selected')
						$(tab).addClass('selected')
                        setTimeout(function() {
                            tab.scrollIntoView({behavior: 'smooth', block: 'center', inline: 'center'})
                        }, 100)
						PhotoPuzzle.folder = folder
						PhotoPuzzle.initSources()
					})()
				})
			)
			$('.thumbs').append(
				$('<div />').addClass('folder-' + folder).hide()
			)
			PhotoPuzzle.srcIndexes[folder] = PhotoPuzzle.srcIndexes[folder] || 0
		})
		//$('.tabs').append('<li>+</li>')
	},


	initSizes: function() {
		this.gridSizes.forEach(function(gridSize) {
			$('.gridSizes').append(
				$('<option value="'+gridSize+'"/>').text(gridSize+'x'+gridSize + ['(easiest)','','(default)','','','','(hardest)'][gridSize-3])
			).val(PhotoPuzzle.gridSize)
		})
	},


	initSources: function() {
		$('.tabs li').removeClass('selected')
		$('.tab-'+PhotoPuzzle.folder).addClass('selected')[0].scrollIntoView()
		$('.thumbs > div').hide()
		$('.thumbs .folder-'+PhotoPuzzle.folder).show()
		if ($('.thumbs .folder-'+PhotoPuzzle.folder).is(':empty')) {
			this.folders[this.folder].forEach(function(src) {
				PhotoPuzzle.createSource(src, false, PhotoPuzzle.folder)
			})
		}
	},


	createSource: function(src, select, folder) {
		console.log('createSource', src)

		if (select) {
			var my_photos = JSON.parse(localStorage.getItem('my_photos') || '[]')
			my_photos.push(src)
			localStorage.setItem('my_photos', JSON.stringify(my_photos))
		}

		if (folder !== PhotoPuzzle.folder) {
			PhotoPuzzle.folder = folder
			PhotoPuzzle.initSources()
		}

		//add span
		var source = $('<span/>').append(
			$('<img/>').attr('src', src.replace('aws/', PhotoPuzzle.awsPath)).contextmenu(function() {
				event.preventDefault()
				return (function() {
					if (PhotoPuzzle.folder == 'my_photos') {
						if (confirm('Remove this Photo?')) {
							PhotoPuzzle.folders[PhotoPuzzle.folder] = PhotoPuzzle.folders[PhotoPuzzle.folder].filter(function(s) {
								return s !== src
							})
							source.empty().remove()
							var my_photos = JSON.parse(localStorage.getItem('my_photos') || '[]')
							my_photos.splice(my_photos.indexOf(src), 1)
							localStorage.setItem('my_photos', JSON.stringify(my_photos))
						}
					}
				})()
			})
		).addClass(select ? 'selected' : '').click(function() {
			$('.thumbs span').removeClass('selected')
			$(this).addClass('selected')
			return (function() {
				PhotoPuzzle.srcIndexes[PhotoPuzzle.folder] = PhotoPuzzle.folders[PhotoPuzzle.folder].indexOf(src) || 0
				//$('.settingsDialog form').submit()
			})()
		})
		$('.thumbs .folder-'+PhotoPuzzle.folder).append(source)

		var img = new Image
		$(img).on('load', function() {
			// if (this.width > 1024 || this.height > 1024 || this.width < 768 || this.height < 768) {
				// try {
				// 	var boardWidth = window.innerWidth
				// 	var index = PhotoPuzzle.folders[PhotoPuzzle.folder].indexOf(src)
				// 	var oc = document.createElement('canvas')
				// 	oc.width = boardWidth
				// 	oc.height = boardWidth
				// 	var octx = oc.getContext('2d');
				// 	var imageRatio = img.width / img.height
				// 	var _width = boardWidth
				// 	var _height = boardWidth
				// 	if (imageRatio < 1) {
				// 		_height = _width / imageRatio
				// 	} else {
				// 		_width = _height * imageRatio
				// 	}
				// 	octx.drawImage(img, (boardWidth - _width) * .5, (boardWidth - _height) * .5, _width, _height)
				// 	src = oc.toDataURL('image/jpeg', .5)
				// 	PhotoPuzzle.folders[PhotoPuzzle.folder][index] = src
				// } catch(e) { console.log(e) }
			// }
			if (select) {
				PhotoPuzzle.folders[PhotoPuzzle.folder].push(src)
				PhotoPuzzle.srcIndexes[PhotoPuzzle.folder] = PhotoPuzzle.folders[PhotoPuzzle.folder].indexOf(src) || 0
				$('.thumbs span').removeClass('selected')
				source.addClass('selected')
				source[0].scrollIntoView()
				localStorage.setItem('srcIndexes', JSON.stringify(PhotoPuzzle.srcIndexes))
			}
		}).on('error', function() {
			//source.remove()
			$(source).find('img')[0].src = './broken.jpg'
		})
		img.src = src.replace('aws/', PhotoPuzzle.awsPath)
	},


	bindElements: function() {

		$('.closeDialog').click(function() {
			$('dialog').removeAttr('open')
		})

		$('.newGame').click(function() {
			$('dialog button[type="reset"]').removeAttr('disabled')
			$('.settingsDialog').attr('open', true)
		})

		$('.playButton').click(function() {
			try {
				showInterstitialFunc()
			} catch(e) {
				//alert(e)
			}
			PhotoPuzzle.level = $('.pickLevel').val() * 1
			localStorage.setItem('level', PhotoPuzzle.level)
			localStorage.setItem('squares', '[]')
			localStorage.setItem('score', 0)
            localStorage.setItem('photoPuzzles.folder', PhotoPuzzle.folder)
            localStorage.setItem('srcIndexes', JSON.stringify(PhotoPuzzle.srcIndexes))
			$('#score').text(0)
		})

		$('.settingsDialog form').submit(function(event) {
			event.preventDefault()

			$('dialog button[type="reset"]').removeAttr('disabled')

			$('.settingsDialog').removeAttr('open')
			$('.game-board').removeClass('puzzle-complete new-high')

			var gridSize = PhotoPuzzle.gridSize = $('[name=gridSize]').val()
			localStorage.setItem('gridSize', gridSize)
			var squareSize = Math.floor(768/PhotoPuzzle.gridSize);
			var fixed = 0
			var plays = 0
			var score = (localStorage.getItem('score') || 0)*1

			$('#fixed').text(fixed + ' / ' + (PhotoPuzzle.gridSize*PhotoPuzzle.gridSize))

			/* randomize squares */
			var squares = JSON.parse(localStorage.getItem('squares') || '[]')

			if (!squares.length) {

				squares = [];
				switch(PhotoPuzzle.level) {
					case 2: //case '2': //rotated
						for(i=0;i<(PhotoPuzzle.gridSize*PhotoPuzzle.gridSize); i++) squares[i] = Math.floor(Math.random()*4+1)
					break

					default: //retrofit
					case 1: //shuffled
						for(i=0;i<(PhotoPuzzle.gridSize*PhotoPuzzle.gridSize); i++) squares[i] = i;
						squares.sort(function() { return Math.floor(Math.random()*3-1); });
						var same = [], q = -1; for(var i=0;i<squares.length;i++) if (squares[i] == i) same.push(i);
						for(var i=0;i<same.length;i++) {
							if (q ==-1) {
								q = same[i];
							} else {
								squares[q] = same[i];
								squares[same[i]] = q;
								q = -1;
							}
						} //for
						if (q != -1) {
							for(i=0;i<same.length;i++) {
								if (squares[i] != q) {
									squares[i] = [squares[q], squares[q] = squares[i]][0];
									break;
								}
							}
						} //if
					break
				}

				localStorage.setItem('squares', JSON.stringify(squares))

			} //if

			var src = PhotoPuzzle.folders[PhotoPuzzle.folder][PhotoPuzzle.srcIndexes[PhotoPuzzle.folder] || 0]
			var encoded = (encodeURI(src) || '').replace(/\(/g, '%28').replace(/\)/g, '%29').replace('aws/', PhotoPuzzle.awsPath)

			var image = new Image()
			image.onerror = function() {
				alert('error loading image '+ src)
				//TODO: remove image from list
				//picture = '';
				//beginGame();
			}
			image.onload = function() {
				//var offsetx = Math.floor(Math.random()*(this.width - 768))
				//var offsety = Math.floor(Math.random()*(this.height - 768))

				// if (this.width > 1024 || this.height > 1024 || this.width < 768 || this.height < 768) {
				// 	try {
				// 		var boardWidth = 768
				// 		var index = PhotoPuzzle.folders[PhotoPuzzle.folder].indexOf(src)
				// 		var oc = document.createElement('canvas')
				// 		oc.width = boardWidth
				// 		oc.height = boardWidth
				// 		var octx = oc.getContext('2d');
				// 		var imageRatio = img.width / img.height
				// 		var _width = boardWidth
				// 		var _height = boardWidth
				// 		if (imageRatio < 1) {
				// 			_height = _width / imageRatio
				// 		} else {
				// 			_width = _height * imageRatio
				// 		}
				// 		octx.drawImage(img, (boardWidth - _width) * .5, (boardWidth - _height) * .5, _width, _height)
				// 		src = oc.toDataURL('image/jpeg', .5)
				// 		image.src = src
				// 	} catch(e) { console.log(e) }
				// }

				var offsetx = Math.floor((this.width - 768)/2)
				var offsety = Math.floor((this.height - 768)/2)

				console.log(offsetx, offsety)

				$('#img').css({
					backgroundImage: "url("+encoded+")",
					backgroundPosition: -offsetx + 'px ' + -offsety + 'px'
				});

				$('#zoom_img').css({
					backgroundImage: "url("+encoded+")",
					backgroundPosition: -offsetx + 'px ' + -offsety + 'px'
				});

				/* build puzzle */
				$('#squares').empty();
				for(var i=0;i<squares.length;i++) {
					var classes = 'square broken'
					var l = Math.floor(i%gridSize) * squareSize
					var t = Math.floor(i/gridSize) * squareSize

					switch(PhotoPuzzle.level) {
						case 2: //case '2':
							var x = -(i%PhotoPuzzle.gridSize)*squareSize - offsetx;
							var y = -Math.floor(i/PhotoPuzzle.gridSize)*squareSize - offsety;
							if (0 == squares[i] % 4) {
								fixed++;
								score++;
							} else {
								score += (4 - (squares[i] % 4)) + 1;
							}
							classes += ' rotated-'+squares[i];
							var squareId = i;
						break

						case 1: default:
							var x = -(squares[i]%gridSize)*squareSize - offsetx
							var y = -Math.floor(squares[i]/gridSize)*squareSize - offsety
							if (i === squares[i]) {
								fixed++;
								classes = 'square'
							}
							var squareId = squares[i]
						break
					}
					$('#squares').append(
						$('<span class="'+classes+'" data-position_id="'+i+'" data-square_id="'+squareId+'"></span>').css(
							{ left:l,top:t,backgroundPosition:x+'px '+y+'px'}
						)
					)
				}

				var firstSquare = -1, secondSquare = -1;

				$('#fixed').text(fixed + ' / ' + (gridSize*gridSize));

				$('.square').width(squareSize)
				.height(squareSize)
				.css({backgroundImage: "url("+encoded+")"})
				.filter('.broken')
				.mousedown(function() {

					if ($('.gameBoard').hasClass('step-1')) {
						$('.gameBoard').removeClass('step-1')
						$('.gameBoard').addClass('step-2')
					} else if ($('.gameBoard').hasClass('step-2')) {
						$('.gameBoard').removeClass('step-2')
					} else if ($('.gameBoard').hasClass('step-0')) {
						$('.gameBoard').removeClass('step-0')
					}

					var squareId = $(this).data('square_id');
					var currentSquare = $('[data-square_id='+squareId+']');

					switch(PhotoPuzzle.level) {
						case 2: //case '2':
							var oldRotation = squares[squareId];

							if (oldRotation == 0) {
								return;
							}

							var newRotation = ((oldRotation + 1) % 8);
							squares[squareId] = newRotation;
							currentSquare.removeClass('rotated-'+oldRotation).addClass('rotated-'+newRotation);
							score--;
                            PhotoPuzzle.sound('audio_score_1');
							if ((newRotation % 4) == 0) {
								fixed++;
                                PhotoPuzzle.sound('audio_score8');
							} else if ((newRotation % 4) == 1) {
								fixed--;
                                PhotoPuzzle.sound('audio_select')
							}
						break

						case 1: default:

							$(this).addClass('selected');

                            PhotoPuzzle.sound('audio_select')

							if (firstSquare == -1) {
								firstSquare = squareId;
								return;
							} else if (firstSquare == squareId) {
								$(this).removeClass('selected');
								firstSquare = -1;
								return;
							} else {

								var fS = $('[data-square_id='+firstSquare+']');
								pos1 = {
									left:fS.css('left'),
									top:fS.css('top')
								};
								pos2 = {
									left:$(this).css('left'),
									top:$(this).css('top')
								};

								pid1 = fS.data('position_id');
								pid2 = currentSquare.data('position_id');

								fS.data('position_id', pid2);
								currentSquare.data('position_id', pid1);

								squares[pid1] = squareId;
								squares[pid2] = firstSquare;

								$(this).animate({left:pos1.left,top:pos1.top}, 400, function() {
									$(this).removeClass('selected');
								});
								fS.animate({left:pos2.left,top:pos2.top}, 400, function() {
									$(this).removeClass('selected');
								});

								var number_fixed = 0;

								if (squareId == squares[squareId]) {
									currentSquare.removeClass('broken').unbind('mousedown');
									fixed++;
									number_fixed++;
								}
								if (firstSquare == squares[firstSquare]) {
									fS.removeClass('broken').unbind('mousedown');
									fixed++;
									number_fixed++;
								}

								switch(number_fixed) {
									case 0: score-=1; PhotoPuzzle.sound('audio_score_1'); break;
									case 1: score+=2; PhotoPuzzle.sound('audio_score2'); break;
									case 2: score+=8; PhotoPuzzle.sound('audio_score8'); break;
								}

								firstSquare = -1;

							break

						}

					}

					localStorage.setItem('score', score)

					$('#score').text(score);
					$('#fixed').text(fixed + ' / ' + (gridSize*gridSize));

					plays++;

					localStorage.setItem('squares', JSON.stringify(squares))

					$('#plays').text(plays);

					//Trunk.save('squares', squares);
					//Trunk.save('score', score);

					if (fixed === gridSize*gridSize) {

                        PhotoPuzzle.sound('audio_complete')

						localStorage.removeItem('squares')
						localStorage.setItem('score', 0)

						$('.game-board').addClass(PhotoPuzzle.high_score < score ? 'new-high' : 'puzzle-complete')

						$('.square').removeClass('rotated-4 broken')

						$('[name=new_image]').prop('checked', true)

						PhotoPuzzle.high_score = Math.max(PhotoPuzzle.high_score, score)
						$('#high_score').text(PhotoPuzzle.high_score)
						localStorage.setItem('highScore', PhotoPuzzle.high_score)

						PhotoPuzzle.games_completed++;
						$('#games_completed').text(PhotoPuzzle.games_completed)
						localStorage.setItem('gamesCompleted', PhotoPuzzle.games_completed)
						//Trunk.remove('squares');

						PhotoPuzzle.srcIndexes[PhotoPuzzle.folder] = (++PhotoPuzzle.srcIndexes[PhotoPuzzle.folder] % PhotoPuzzle.folders[PhotoPuzzle.folder].length)

						localStorage.setItem('srcIndexes', JSON.stringify(PhotoPuzzle.srcIndexes))

						$('.thumbs span').removeClass('selected')
						$('.thumbs span:nth-child('+(PhotoPuzzle.srcIndexes[PhotoPuzzle.folder]+1)+')').addClass('selected')[0].scrollIntoView()

						var puzzlesCompleted = (localStorage.getItem('puzzlesCompleted') || 0)
						localStorage.setItem('puzzlesCompleted', ++puzzlesCompleted)

						if (puzzlesCompleted === 5) {
							setTimeout(function() {
								$('.askRate').attr('open', true).show()
							}, 500)
						}

						var delay = 2000;

						setTimeout(function() {
							$('.settingsDialog').attr('open', true)
						}, delay);
					}

				})

			}
			image.src = encoded
			/* */
		})

		$('.settingsDialog  button[type="reset"]').click(function(event) {
			event.preventDefault()
			$('.settingsDialog').removeAttr('open')
		})

		$('.snapPhoto').click(function() {
			PhotoPuzzle.getPhoto(1)
		})

		$('.pickPhoto').click(function() {
			PhotoPuzzle.getPhoto(0)
		})

		$('.preview').click(function() {
			$(this).removeClass('tap')
			$('#zoom').fadeIn()
		})

		$('#zoom').click(function() {
			$('#zoom').fadeOut()
		})

		$(window).resize(function() {
			var ratio = (Math.max(10, (screen.width > screen.height) ? Math.min(window.innerWidth/4, window.innerHeight/3) : Math.min(window.innerHeight/4, window.innerWidth/3)))/256
			$('#squares').css({ webkitTransform:'scale('+ratio+')' })

			var w = $(document.body).outerWidth()
			var h = $(document.body).outerHeight()
			var w2 = Math.floor(w/2)
			var h2 = Math.floor(h/2)
			var wh = (w-h)

			if (Math.abs(wh) < 100) {
				if (w < h) {
					w -= 100;
					w2 = Math.floor(w/2),
					wh = (w-h)
				} else {
					h -= (100-Math.abs(wh));
					h2 = Math.floor(h/2),
					wh = (w-h)
				}
			}

			var m = Math.min(w2, -wh);
			//$('#img_wrapper').css({ left:(w2-m)/2, top:(-wh-m)/2 });
			$('#img_wrapper').css({ left:0, top:(-wh-m)/4 });
			$('#zoom_wrapper').css({ left:0, top:(-wh)/2 });

			var r2 = (Math.min($('#preview').width(), $('#preview').height())-8)/768;
			$('#img_wrapper').css({ transform:'scale('+r2+')' });

			//var r3 = (Math.min($('#preview').width(), $('#preview').height())-8)/768;
			$('#zoom_wrapper').css({ transform:'scale('+ratio+')' });

		}).trigger('resize')

	},


	getPhoto: function(sourceType) {
		// 0: library, 1: camera
		navigator.camera && navigator.camera.getPicture && navigator.camera.getPicture(
			function(imageData) {
				let src = "data:image/jpeg;base64," + imageData;
				$('.settingsDialog').attr('open', true);
				PhotoPuzzle.createSource(src, true, 'my_photos');
			},
			function(error) {
				alert(error);
			},
			{
				//destinationType: Camera.DestinationType.FILE_URI,
				quality: 25,
				destinationType: Camera.DestinationType.DATA_URL,
				sourceType: sourceType,
				targetWidth: 1024,
				targetHeight: 1024
			}
		);
	}


}

$('.askRate .skip').click(function() {
	$('.askRate').attr('open', false).hide()
})


PhotoPuzzle.init()
