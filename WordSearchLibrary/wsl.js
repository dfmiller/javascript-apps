

/* colors */

var colors = [
	['#000000', '#4C4C4C', '#990000', '#994C00', '#999900', '#009900', '#004C4C', '#009999', '#004C99', '#4C0099', '#990099'],
	['#FFFFFF', '#CCCCCC', '#FF9999', '#FFCC99', '#FFFF99', '#99FF99', '#99CCCC', '#99FFFF', '#99CCFF', '#CC99FF', '#FF99FF']
]

var defaultBackground = '#FFFFFF'
var backgroundColor = JSON.parse(localStorage.getItem('backgroundColor') || JSON.stringify(defaultBackground))

$('#board-wrapper, .colorPickerButton').click(function() {
	$('dialog').hide()
	$('.colorPickerDialog').attr('open', true).show()
})

$('.closeButton').click(function() {
	$(this).closest('dialog').removeAttr('open').hide()
})


$('.colorPickerDialog main').empty().append(
	colors.map(function(row, shade) {
		return $('<div/>').append(
			row.map(function(color) {
				return $('<s/>').css({ background: color }).click(function() {
					var textColor = ['white', 'black'][shade]
                    $('main.game').css({ background: color, color: textColor })
					localStorage.setItem('backgroundColor', JSON.stringify(color))
				})
			})
		)
	})
)

/* */



    var backgrounds = {
        none: '',
        nature: [
            'https://thumbs2.imgbox.com/a0/a3/K1XbRXpC_b.jpg',
            'https://thumbs2.imgbox.com/75/11/NVyuLS79_b.jpg',
            'https://thumbs2.imgbox.com/2b/72/GHEhzoRw_b.jpg',
            'https://thumbs2.imgbox.com/88/9c/bYXjJZ1G_b.jpg',
            'https://thumbs2.imgbox.com/97/c0/jvHIL9Og_b.jpg'
        ]
    }

    window.oncontextmenu = function() { return false }

	Math.seed = 1
	Math.reseed = function(seed) {
		Math.seed = (!seed ? .1 : seed)
	}
	Math.pseudo = function() {
		Math.seed = Math.abs(Math.sin(Math.seed) * 10000) % 1
		return Math.seed
	}

	rnd = function(n) { return typeof n !== 'undefined' ? Math.floor(Math.pseudo()*n) : Math.pseudo() }

	var leet = { a: 4, e: 3, i: 1, o: '0' }
	var leet2 = { a: '@', b: 8, c: '(', e: 3, g: 6, i: 1, k: '<', l: '|', o: '0', p: 9, s: 5, t: '+' }

	function cfix(str) {
		return str.replace(/[^a-z0-9_]/gi, function(L) {
			return String.fromCharCode((L.charCodeAt(0) % 26) + 65)
		})
	}

	$('dialog').hide()

    if (!localStorage.getItem('use_sounds')) {
        localStorage.setItem('use_sounds', 'on')
    }

    $('.soundSetting').click(function() {
        Game.use_sounds = !Game.use_sounds
        localStorage.setItem('use_sounds', (Game.use_sounds ? 'on' : 'off'))
        $('.soundSetting span').text(Game.use_sounds ? 'SOUNDS ON' : 'SOUNDS OFF')
        initInterstitial()
    })

	var Game = {

        use_sounds: localStorage.getItem('use_sounds') == 'on',
        audio: {
        	audio_word_fail: './sounds/zapsplat_cartoon_blink_flirt_marimba_001_18050.mp3',
        	audio_word_okay: './sounds/little_robot_sound_factory_Jingle_Win_Synth_03.mp3',
        	audio_level_complete: './sounds/zapsplat_multimedia_game_retro_musical_success_003_21514.mp3',
        	audio_sharpie: './sounds/zapsplat_office_marker_pen_draw_line_on_tissue_paper_002_34327.mp3',
        },

        sound: function(sound) {
            if (Game.use_sounds) {
    		    console.log(sound, Game[sound])
    	    	if (Game.last_sound) {
	        		Game[Game.last_sound].pause()
	        		Game[Game.last_sound].currentTime = 0
	        	}
	        	Game.last_sound = sound
	        	Game[sound].play()
	        }
        },

		size: 8, //12, //16
		board: [],
		wordsFound: 0,
		found: [],
		book: 0,
		page: 0,

		hiliters: ['pink','green','yellow','blue','orange','purple'],
		lastHiliter: 0,

		init: function() {

            for(audio in Game.audio) {
            	Game[audio] = new Audio(Game.audio[audio])
            	Game[audio].load()
            }

            $('.soundSetting span').text(Game.use_sounds ? 'SOUNDS ON' : 'SOUNDS OFF')

			var sizes = {8: 'Easy', 10: 'Small', 12: 'Medium', 16: 'Large', 24: 'Small Tablet', 32: 'Tablet'}

			$('dialog').hide()

			//retrofit done
			var removes = []
			for(var value in localStorage) {
				if (value.slice(0, 5) === 'done.') {
					var values = value.split('.')
					removes.push(value)
					if (values.slice(-1) in sizes) {
						values.splice(1, 0, values.slice(-1)[0])
						values.splice(-1, 1)
						values[0] = 'progress'
						localStorage.setItem(values.join('.'), true)
					}
				}
			}

			removes.forEach(function(remove) {
				localStorage.removeItem(remove)
			})

			if (localStorage.getItem('size') && !localStorage.getItem('currentSize')) {
				localStorage.setItem('currentSize', localStorage.getItem('size'))
				localStorage.removeItem('size')
				localStorage.removeItem('currentPage')
				localStorage.removeItem('currentFound')
				//$('.clearNotice').attr('open', true).show()
			}

			me = this

			//$('section').click(function() {
			//	$('section').hide()
			//})

			if (localStorage.getItem('hide help')) {
				$('.hideHelp input').removeAttr('checked')
			} else {
				$('.hideHelp input').attr('checked', true)
			}

			$('.hideHelp input').click(function() {
				if (localStorage.getItem('hide help')) {
					localStorage.removeItem('hide help')
				} else {
					localStorage.setItem('hide help', true)
				}
			})

			$('.helpIcon').click(function() {
				$('.howToDialog').attr('open', 'open').show()
			})

			$('.toSettings').click(function() {
				$('.settingsDialog').attr('open', 'open').show()
			})            

            $('.coloringRadio').click(function(event) {
                $('.game').removeClass('black white').addClass(event.currentTarget.value)                
            })

            $('.backgroundRadio').click(function(event) {
                $('.game').removeClass('none image').addClass(event.currentTarget.value)                
            })

			$('.clear-progress').on('click', '.clearProgress', function() {
				$('.clearConfirm').attr('open', true).show()
			})

			$('.clearBookProgress').click(function() {
				var currentBook = localStorage.getItem('currentBook')
				var resets = []
				for(var value in localStorage) {
					if (value.slice(0, 10 + Game.size.toString().length + currentBook.length) === 'progress.' + Game.size + '.' + currentBook) {
						resets.push(value)
					}
				}
				if (resets.length) {
					resets.forEach(function(reset) {
						localStorage.removeItem(reset)
					})
					buildPages()
				}
				Game.found = []
				localStorage.removeItem('currentFound')
				localStorage.removeItem('currentPage')
				$('dialog').removeAttr('open').hide()
			})

			$('.clearAllProgress').click(function() {
				var resets = []
				for(var value in localStorage) {
					if (value.slice(0, 9) === 'progress.') {
						resets.push(value)
					}
				}
				if (resets.length) {
					resets.forEach(function(reset) {
						localStorage.removeItem(reset)
					})
					buildPages()
				}
				Game.found = []
				$('.clearNotice').removeAttr('open').hide()
			})

			$('.skip').click(function() {
				$('dialog').removeAttr('open').hide()
			})

			$('.sizes').show()
			$('.books').hide()
			$('.pages').hide()

			function setSize(size) {
				if (!sizes[size]) {
					size = 8
				}
				Game.size = size
				$('.size').text(size + 'x' + size)
				$('.sizes').hide()
				$('.books').show()
				localStorage.setItem('currentSize', size)
				if (words.Deluxe) {
					Math.reseed(size/100)
					words.Deluxe.sort(function(a, b) {
						return Object.keys(a)[0].localeCompare(Object.keys(b)[0])
					})
					words.Deluxe.sort(function() {
						return rnd(3)-1
					})
					var third = Math.floor(words.Deluxe.length / 3)
					words.Themed0 = words.Deluxe.slice(0, third-1)
					words.Themed1 = words.Deluxe.slice(third, (third*2)-1)
					words.Themed2 = words.Deluxe.slice(third*2, (third*3)-1)
				}
				$('.board').removeClass('size8 size10 size12 size16 size24 size32').addClass('size' + size)
				buildBooks()
			}

			var gameSize = localStorage.getItem('currentSize')

			if (gameSize) {
				setSize(gameSize)
			} else {
				$('.sizes li').remove()
				$('.sizes').show()
			}

			Object.keys(sizes).forEach(function(size) {
 				$('.sizes ul').append($('<li class="button"/>').append($('<span/>').text(size+'x'+size).css({fontSize: 100/size + 'vw'}), $('<small/>').text(sizes[size])).click(
				(function () {
						return function () {
							setSize(size)
						}
					})()
				))

				$('.loading').hide()
			})

			$('.size').click(function() {
				Game.found = []
				localStorage.removeItem('currentFound')
				$('.sizes').show()
				$('.books').hide()
			})

			function buildBooks() {
				$('.books li').remove()

				books.forEach(function(book, index) {
					book.volume = localStorage.getItem('volume.'+Game.size+'.'+book.name) || 1
					$('.books ul').append(
						$('<li/>').css(book.css || {}).append(
							$('<small/>').text(book.name),
							$('<strong/>').text('Word Searches'),
							$('<em/>').text('Vol '+book.volume)
						).click(function() {
							Game.book = book
							buildPages(index)
							localStorage.setItem('currentBook', book.name)
						})
					)
				})

				var currentBook = localStorage.getItem('currentBook')
				if (currentBook) {
					books.forEach(function(book, index) {
						if (book.name === currentBook) {
							Game.book = book
							buildPages(index)
						}
					})
				}
			}


			function buildPages(index) {

				Game.completedCount = 0
				for(var value in localStorage) {
					if (value.slice(0, 10 + Game.size.toString().length + Game.book.name.length) === 'progress.' + Game.size + '.' + Game.book.name) {
						Game.completedCount++
					}
				}

				masterList = words[Game.book.words]

				if (Game.completedCount === masterList.length) {
					$('.nextVolumeDialog').attr('open', true).show()
				}

				Game.gray = Game.book.gray
				Game.calcFontSizes()
				$('.books').hide()

				if (Game.book.randomize || Game.book.volume != 1) {
					Math.reseed((~~Game.book.volume || 1) + Game.size/100)
					masterList.sort(function(a, b) {
						return Object.keys(a)[0].localeCompare(Object.keys(b)[0])
					})
					masterList.sort(function() {
						return rnd(3)-1
					})
				}

	  			$('.pages header div').text($('.pages header div').text() + ' ' + masterList.length)

				$('.pages ul').empty()

				var hasProgress = false

				masterList.forEach(function(list, i) {
					for(var title in list) { break }
					var progress = localStorage.getItem('progress.' + Game.size + '.' + Game.book.name + '.' + title)
					if (progress) {
						hasProgress = true
					}
					if (Game.book.words === 'Challenge') {
	  					var book = words.Themed2[i]
						for(var subtitle in book) { break }
	 					if (typeof book[subtitle] === 'string') {
							title += ': ' + subtitle
						}
					}

					$('.pages ul').append(
						$('<li/>')
							.addClass(progress ? 'page done' : 'page locked')
							.click((function(gameNumber) {
								return function() {
									if (!localStorage.getItem('currentPage') || localStorage.getItem('currentPage') !== title) {
										Game.found = []
										localStorage.removeItem('currentFound')
									}
									localStorage.setItem('currentPage', title)
									Game.begin(gameNumber)
								}
							})(i))
							.append(
								$('<span/>').text(title)
							)
						)
				})

				$('.clear-progress').html(hasProgress ? '<a class="clearProgress">clear progress</a>' : '(select puzzle)')

				$('.pages header div').text((Game.book.name || 'Word Search') + ' (' + Game.size + 'x' + Game.size + ')')

				$('.pages').show()

				var currentPage = localStorage.getItem('currentPage')
				masterList.forEach(function(page, gameNumber) {
					for(var title in page) { break }
					if (title === currentPage) {
						Game.begin(gameNumber)
					}
				})
			}

            $('.toSizes').click(function() {
                $('.toBooks').trigger('click')
                $('.size').trigger('click')
            })

			$('.toBooks').click(function() {
                $('.toContents').trigger('click')
				localStorage.removeItem('currentBook')
				$('.books').show()
				$('.pages').hide()
			})

			$('.toContents').on('click', function() {
	            if (Game.words && Object.keys(Game.words).length === 0) {
					try {
						showInterstitialFunc()
					} catch(e) {}
	            }
				localStorage.removeItem('currentPage')
				buildPages()
				$('nav').show()
				$('.pages').show()
				$('.game').hide()
				$('.menuDialog').hide()
			})

			$('.closeButton').click(function() {
				$('.menuDialog').hide()
			})

			$('.restartButton').click(function(event) {
				if (Object.keys(Game.words).length === 0) {
					try {
						showInterstitialFunc()
					} catch(e) {}
				}
				Game.found = []
				localStorage.removeItem('currentFound')
				Game.begin(Game.page)
				$('.menuDialog').hide()
			})

			$('.nextButton').click(function(event) {
				if (Game.page < masterList.length-1) {
					if (Object.keys(Game.words).length === 0) {
						try {
							showInterstitialFunc()
						} catch(e) {}
					}
					Game.found = []
					localStorage.removeItem('currentFound')
					for(var title in masterList[Game.page+1]) { break }
					localStorage.setItem('currentPage', title)
					Game.begin(Game.page+1)
					$('.menuDialog').hide()
				}
			})

			$('.menuIcon').on('click', function() {
				$('.menuDialog').attr('open', true).show().find('header').text('Menu')
			})

			$('.nextVolume').click(function() {
				$('.nextVolumeDialog').removeAttr('open').hide()
				//remove all done
				for(var value in localStorage) {
					if (value.slice(0, 10 + Game.size.toString().length + Game.book.name.length) === 'progress.' + Game.size + '.' + Game.book.name) {
						localStorage.removeItem(value)
					}
				}
				Game.completedCount = 0
				Game.book.volume++
				localStorage.setItem('volume.'+Game.size+'.'+Game.book.name, Game.book.volume)
				buildBooks()
			})

			me.calcFontSizes()

			$(window).resize(function() {
				Game.calcFontSizes()
			})

		},

	begin: function(gameNumber) {

		$('nav').hide()

		$('body').append('<div class="loader"></div>')

		$('.nextButton').attr('disabled', (gameNumber >= masterList.length-1))

		Math.reseed(gameNumber + (~~Game.book.volume || 1) + Game.size/100)

		Game.page = (gameNumber)

		Game.wordsFound = 0
		Game.found = []

		$('.books').hide()
		$('.pages').hide()
		$('.game').css({ display: 'flex' })

        if (!localStorage.getItem('hide help')) {
            $('.howToDialog').attr('open', 'open').show()
        }

		setTimeout(function() {
			Game.build()
			Game.fill()
			setTimeout(function() {
				Game.found = JSON.parse(localStorage.getItem('currentFound') || '[]')
				Game.found.forEach(function(found) {
					if ($('._word-'+cfix(found.key)).length) {
						delete Game.words[found.key]
						Game.wordsFound++
						$('._word-'+cfix(found.key)).addClass('found')

                        var i = found.start.x
                        var j = found.start.y
                        for(var k=0;k<found.key.length;k++) {
                            $('.board div:eq('+j+') span:eq('+i+')').addClass('show')
                            i += Math.sign(found.end.x - found.start.x)
                            j += Math.sign(found.end.y - found.start.y)
                        }

						var startElement = $('.board div:nth-child('+(found.start.y+1)+') span:nth-child('+(found.start.x+1)+')')
						var endElement = $('.board div:nth-child('+(found.end.y+1)+') span:nth-child('+(found.end.x+1)+')')
						createSelect(startElement, endElement)
						Game.lastHiliter = ++Game.lastHiliter % Game.hiliters.length
					}
				})
				$('.words-found').text(Game.wordsFound)
			}, 100)
			$('.loader').remove()
		},100)

	},

	calcFontSizes: function() {

		$('#fontSize').css({ fontSize: 10 })

		// $('#boardFontSize').css({
		// 	minWidth: 100/Game.size+'vmin',
		// 	minHeight: 100/Game.size+'vmin',
		// 	fontSize: 10
		// })

		setTimeout(function() {

			var calcElement = $('#fontSize')
			var width = calcElement.width()
			var height = calcElement.height()
			var fontSize = 10

			for(var i=fontSize;i<90;i++) {
				calcElement.css({ fontSize: i })
				if (width < calcElement.width() || height < calcElement.height()) {
					fontSize = (i-1)
					i=99
					break
				}
			}

			$('html, body').css({ fontSize: fontSize })

			// var calcElement = $('#boardFontSize')
			// var width = calcElement.width()
			// var height = calcElement.height()
			//
			// Game.boardFontSize = 10
			//
			// for(var i=Game.boardFontSize;i<90;i++) {
			// 	calcElement.css({ fontSize: i })
			// 	if (width < calcElement.width() || height < calcElement.height()) {
			// 		Game.boardFontSize = (i-2)
			// 		i=99
			// 		break
			// 	}
			// }
			//
			// $('.board').css({ fontSize: Game.boardFontSize })

		}, 500)

	},


	build: function() {

		var me = this

		this.board = []

		for(var j=0;j<this.size;j++) {
			this.board[j] = []
			for(var i=0;i<this.size;i++) {
				this.board[j][i] = ''
			}
		}

		this.words = {}

		var letterCount = 0
		this.lettersUsed = {}

		var challenge = Game.book.challenge || false

		for(var title in masterList[Game.page]) {
			var wordList = masterList[Game.page][title]
		}
		Game.pageTitle = title

		if (typeof wordList === 'string' && wordList === 'random') {
			wordList = allWords
		} else if (typeof wordList === 'string') {
			challenge = wordList
			for(var subtitle in words.Themed2[Game.page]) { break }
			title += ': ' + subtitle
			wordList = words.Themed2[Game.page][subtitle]
		} else if (wordList.constructor !== Array) {
			challenge = 'glyphs'
		}

		$('.game').toggleClass('hide-vowels', challenge == 'hide-vowels')
		$('.game').toggleClass('hide-list', challenge == 'hide-list')
		$('.game').toggleClass('back-words', challenge == 'back-words')

		$('.title').text(title)

		for(var j=0;j<90000;j++) {

			if (challenge === 'numbers') {
				var wrd = word = rnd(1000000).toString()
			} else if (challenge === 'math') {
				var operator = rnd(4)
				var first = rnd(100)
				var second = rnd(100)
				switch(operator) {
					case 0:
						var word = first + '+' + second + '=' + (first+second)
					break
					case 1:
						var word = first + '-' + second + '=' + (first-second)
					break
					case 2:
						var word = first + 'x' + second + '=' + (first*second)
					break
					case 3:
						var word = (first*second) + '/' + first + '=' + second
					break
				}
			  	var wrd = word

			} else if (challenge === 'glyphs') {
				var word = ''
				for(k = 0; k < wordList.min; k++) {
					word += wordList.glyphs[rnd(wordList.glyphs.length)]
				}
				var wrd = word
			} else {
				var word = wordList[rnd(wordList.length-1)] || ''
				var wrd = word.toLowerCase().replace(/[^a-z0-9|\x7F-\xFF]/gi, '')
			}

			if (challenge === 'leet') {
				wrd = wrd.replace(/[aeio]/g, function(w) {
					return leet[w] || w
				})
			} else if (challenge === 'leet2') {
				wrd = wrd.replace(/./g, function(w) {
					return leet2[w] || w
				})
			} else if (challenge === 'jumbled') {
				var temp = word
				while (word === temp && word.length > 3) {
					word = word[0] +  word.slice(1, -1).split('').sort(function(){ return 0.5-Math.random()}).join('') + word.slice(-1)
				}
			}

			if (word.indexOf('|') != -1) {
				wrd = word.split(' | ')[1]
				word = word.split(' | ')[0]
			}

			//console.log('word', word)

			if (Object.keys(this.words).indexOf(wrd) == -1 && wrd.length > 3 && wrd.length < this.size) {

				var x, y, dx, dy
				do {
					dx = rnd(3) - 1
					dy = rnd(3) - 1
				} while(dx == 0 && dy == 0)

				if (dx == 1) {
					x = rnd(this.size - wrd.length)
				} else if (dx == -1) {
					x = rnd(this.size - wrd.length) + wrd.length
				} else {
					x = rnd(this.size)
				}

				if (dy == 1) {
					y = rnd(this.size - wrd.length)
				} else if (dy == -1) {
					y = rnd(this.size - wrd.length) + wrd.length
				} else {
					y = rnd(this.size)
				}

				var check = true
				var cx = x
				var cy = y
				var sx = x
				var sy = y

				wrd.split('').forEach(function(letter, k) {
					if (
						(cx >= 0 && cy >= 0 && cy < me.size && cx < me.size)
						&& (me.board[cy][cx] == letter || me.board[cy][cx] == '')
					) {
						cx += dx
						cy += dy
					} else {
						check = false
					}
				})

				if (check == true) {
					wrd.split('').forEach(function(letter, k) {
						if (me.board[y][x] == '') {
							letterCount++
						}
						me.board[y][x] = letter
						x += dx
						y += dy
						me.lettersUsed[letter] = me.lettersUsed[letter] ? ++me.lettersUsed[letter] : 1
					})

					me.words[wrd] = {
						word: word,
						start: {
							x: sx,
							y: sy
						},
						key: wrd,
						end: {
							x: sx + dx*(wrd.length-1),
							y: sy + dy*(wrd.length-1)
						}
					}
				}
			}
		}

	},

	fill: function() {

		var me = this

		$('.board').empty()
		this.board.forEach(function(row, j) {
			var div = $('<div/>')
			$('.board').append(div)
			row.forEach(function(letter, i) {
				if (letter == '') {
					if (Game.gray) {
						letter = '-'
					} else {
						letter = Object.keys(me.lettersUsed)[rnd(Object.keys(me.lettersUsed).length)]
					}
					me.board[j][i] = letter
				}
				div.append(
					$('<span/>').text(letter).addClass('letter').prop('data-i', i).prop('data-j', j).addClass(letter == '-' ? 'gray' : '').addClass('aeiou'.split('').indexOf(letter) != -1 ? 'vowel' : '')
				)
			})
		})

		//$('.board').append($('<span/>'))

		$('.word-list').empty().scrollTop(0)

		Object.keys(this.words).sort().forEach(function(word) {
			$('.word-list').append(
				$('<li>'+me.words[word].word.replace(' ', '&thinsp;')+'</li>').addClass('_word-'+cfix(word)).click(function() {
					return (function(w) {
						if (w) {
							var y = $('.board div').get(w.start.y)
							var x = $(y).find('.letter').get(w.start.x)
							$(x).addClass('hilite')
							setTimeout(function() {
								$('.hilite').removeClass('hilite')
							}, 1000)
						}
					})(me.words[word])
				})
			)
		})

		$('.words-found').text(0)
		$('.total-words').text(Object.keys(this.words).length)

		// $('.board div').css({ height: (100 / Game.size) + 'vmin' })
		// $('.board div span').css({ width: (100 / Game.size) + 'vmin', height: (100 / Game.size) + 'vmin' })

		$('.letter')
		.bind('touchstart mousedown', function(event) {
            Game.isMouseDown = true
			event = event.originalEvent || event
			touch = event.touches ? event.touches[0] : event
			var elementMouseIsOver = document.elementFromPoint(touch.clientX, touch.clientY)
			if (elementMouseIsOver) {
				startElement = $(elementMouseIsOver)
				//console.log('elementMouseIsOver', elementMouseIsOver)
				createSelect(startElement)
				select.i = select.di = $(elementMouseIsOver).prop('data-i')
				select.j = select.dj = $(elementMouseIsOver).prop('data-j')
				select.clientX = touch.clientX
				select.clientY = touch.clientY
                Game.sound('audio_sharpie')
			}
		})
		.bind('touchmove mousemove', function(event) {
			if (select.found || !Game.isMouseDown) {
				return
			}
			event = event.originalEvent || event
			touch = event.touches ? event.touches[0] : event

			var elementMouseIsOver = document.elementFromPoint(touch.clientX, touch.clientY)
			if (elementMouseIsOver) {
				var position = $(elementMouseIsOver).position()
				var x = (position.left + $(elementMouseIsOver).width() / 2 - select.left)
				var y = (position.top + $(elementMouseIsOver).height() / 2 - select.top)

				if (x != 0 && y != 0 && Math.abs(x) != Math.abs(y)) {
					if (Math.abs(x) > Math.abs(y)) {
						y = x * Math.round(y/x)
					} else {
						x = y * Math.round(x/y)
					}
					var board = $('.board').position()
					var cx = x + select.left + board.left
					var cy = y + select.top + board.top
					elementMouseIsOver = document.elementFromPoint(cx, cy)
				}

				select.width = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)) + $(elementMouseIsOver).width()/2
				select.rotation = Math.atan2(y, x) * (180 / Math.PI)

				select.di = $(elementMouseIsOver).prop('data-i')
				select.dj = $(elementMouseIsOver).prop('data-j')

				select.element.css({
					width: select.width,
					transform: 'rotate('+select.rotation+'deg)'
				})
			}
			var loopCount = 0
				,word = []
				,i = select.i
				,j = select.j
			word.push(Game.board[select.j][select.i])
			while((i != select.di || j != select.dj) && (loopCount++ <= Game.size)) {
				i -= Math.sign(i - select.di)
				j -= Math.sign(j - select.dj)
				if (Game.board[j]) {
					word.push(Game.board[j][i])
				}
			}

			if (
				(Object.keys(Game.words).indexOf(word.join('')) !== -1)
				|| (Object.keys(Game.words).indexOf(word.reverse().join('')) !== -1)
			) {
                var i = select.i
                var j = select.j
                for(var k=0;k<word.join('').length;k++) {
                    $('.board div:eq('+j+') span:eq('+i+')').addClass('show')
                    i += Math.sign(select.di - select.i)
                    j += Math.sign(select.dj - select.j)
                }

				$('._word-'+cfix(word.join(''))).addClass('found pulse')
				select.element.addClass('flash')
				select.found = true
				Game.found.push(Game.words[word.join('')])
				delete Game.words[word.join('')]
				++Game.wordsFound

				localStorage.setItem('currentFound', JSON.stringify(Game.found))

                Game.sound('audio_word_okay')

				try {
					$('.word-list li:not(.found)')[0].scrollIntoViewIfNeeded()
				} catch(e) {}
			}

			if (Object.keys(Game.words).length == 0) {

				localStorage.setItem('progress.' + Game.size + '.' + Game.book.name + '.' + Game.pageTitle, true)

				Game.completedCount = (Game.completedCount || 0) + 1

				if (Game.completedCount === masterList.length) {
					$('.nextVolumeDialog').attr('open', true).show()
				}

				var puzzlesCompleted = (localStorage.getItem('puzzlesCompleted') || 0)
				localStorage.setItem('puzzlesCompleted', ++puzzlesCompleted)

				if (puzzlesCompleted === 5) {
					setTimeout(function() {
						$('.askRate').attr('open', true).show()
					}, 500)
				}

                Game.sound('audio_level_complete')

				setTimeout(function() {
					$('.menuDialog').attr('open', true).show().find('header').text(Game.book.name + ' ' + Game.size + 'x' + Game.size + ' ' + Game.pageTitle + ' Complete!')
				}, 1000)
			}

			$('.words-found').text(Game.wordsFound)
		})
		.bind('touchend mouseup', function() {
            Game.isMouseDown = false
			if (!select.found) {
				select.element.remove()
                Game.sound('audio_word_fail')
			} else {
				Game.lastHiliter = ++Game.lastHiliter % Game.hiliters.length
			}
			select = {}
		})

	}

}

	var select = {}

	var createSelect = function(startElement, endElement) {
		var position = startElement.position()
		var x = (position.left + startElement.width() / 2)
		var y = (position.top + startElement.height() / 2)
		select.element = $('<span></span>').addClass('select')
		$('.board').append(select.element)
		select.element.css({
			left: x,
			top: y,
			borderRadius: (100 / Game.size),
			transformOrigin: (100 / Game.size),
			padding: (100 / Game.size) + 'px ' + (100 / Game.size) + 'px',
			margin: -(150 / Game.size) + 'px ' + -(100 / Game.size) + 'px',
		})
		select.element.addClass(Game.hiliters[Game.lastHiliter]+'-hiliter')
		select.left = x
		select.top = y

		if (endElement) {
			var position = endElement.position()
			var x = (position.left + endElement.width() / 2 - select.left)
			var y = (position.top + endElement.height() / 2 - select.top)
			select.width = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)) + endElement.width()/2
			select.rotation = Math.atan2(y, x) * (180 / Math.PI)
			select.element.css({
				width: select.width,
				transform: 'rotate('+select.rotation+'deg)'
			})
		}
	}


	$('body').on('webkitTransitionEnd, transitionEnd', function() {
		$(this).removeClass('pulse, flash')
	})

	Game.init()

	document.addEventListener('deviceready', function() {
		try {
			initAdMob()
			showBannerFunc()
		} catch(e) { console.log(e) }
	}, false)
