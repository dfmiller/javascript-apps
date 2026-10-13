
//"use strict"

var englishWords = allWords.concat(ukWords);

var Game = {
	wordLength: 3//8
	,columnCount: 7//9
	,rowCount: 8
	,columns: []
	,colors: ['aqua', 'black', 'blue', 'fuchsia', 'gray', 'green', 'lime', 'maroon', 'navy', 'olive', 'purple', 'red', 'silver', 'teal', 'white', 'yellow', 'orange', 'brown']
	,score: 0
	,clump: 0
	,hint: ''
	,words: []
	,wordHints: []
	,vowels: 'aeiou'
	,letters: 'aeiouybcdfghjklmnpqrstvwxz'
	,common: 'etaoinsrhldcumfpgwybvkxjqz'

	,backs: 'silver,gray,black,navy,blue,cyan,teal,green,lime,yellow,olive,gold,orange,red,maroon,purple,fuchsia'.split(',')

	,helps: {
		bolts: 0,
		blanks: 0,
		swaps: 0
	}

	,level: 0
	,highest_level: 0
	,goal: {}
	,secret_word: ''

	,selected: ''
	,touching: false
	,lastElement: null
	,using_help: false

	,use_sounds: false

	,howtos: [
		'Swipe over letters to make a word',
		'Letters can be in any direction as long as they are next to each other',
		'A word to find may appear at the top of the screen, but you can use any valid word.',
		'Words that require punctuation are not valid',
		'Words must have at least 2 letters but each additional letter doubles your points!',
		'Each level will have a different goal. Meet the goal to continue to the next level',
		//squares, vowels
		'Finding a Palindrome (a word that is spelled the same forward and backwards) gives you a blank',
		'You can use a blank in place of any letter in a word. For multiple blanks in a word, it must be the same letter.',
		'Finding a half-Palindrome (a word that spells another word backwards) gives you a swap',
		'A swap will let you switch the places of two letters to help make words',
		'There is a secret word on each level. Finding the secret word gives you a lightning bolt',
		'You can use a lightning bolt to remove all letters of the same color',
		'HINT: Words can use letters of any color, but letters of the same color often make a word',
	]

	,hintTimeout: false

	,ignoreDecoded: JSON.parse(window.atob(ignoreEncoded))

}


Game.showHint = function(delay) {
	Game.hintTimeout = setTimeout(function() {
		Game.hintTimeout = false
        $('.glowing-letter').removeClass('glowing-letter')
		$('.word.bad, .word.good').text('')
		Game.hint = Game.wordHints[Game.rnd(Math.min(5, Game.wordHints.length))]
		var letter = 0
		var firstLetters = $('.blok:contains("'+Game.hint[letter]+'")')
		var positions = []
		if (firstLetters.length > 0) {
			var columns = $('.flex-column-reverse')
			firstLetters.each(function() {
				$this = $(this)
				$this.addClass('taken')
				var b = $this.parent().find('.blok').index($this)
				var a = $this.parent().parent().find('div').index($this.parent())
				if (a <=6 && b <= 6) {
					positions.push([b, a, this])
				}
			})
            var FL = null
			while(++letter <= Game.hint.length && positions.length > 0) {
                var nextPositions = []
				positions.forEach(function(pos) {
					for(var i=-1;i<=1;i++) {
						for(var j=-1;j<=1;j++) {
							var a = pos[1] + i
							var b = pos[0] + j
                            var c = FL = pos[2]
							if (a >= 0 && b >= 0 && (i != 0 || j != 0) && a <= 6 && b <= 6) {
								var testBlok = columns.eq(a).children().eq(b)
								if (testBlok.text() == Game.hint[letter] && !testBlok.hasClass('taken')) {
									//console.log('pos', Game.hint[letter], a, b)//, columns.eq(a).children().eq(b))
									testBlok.addClass('taken')
									if (Game.rnd() >= .5) {
										nextPositions.unshift([b, a, c])
									} else {
										nextPositions.push([b, a, c])
									}
								}
							}
						}
					}
				})
				positions = nextPositions
			}
			if (letter == Game.hint.length+1) {
				$('.word.bad, .word.good, .word.hint').text(Game.hint).addClass('hint').removeClass('good bad')
                $(FL).addClass('glowing-letter')
			} else {
				Game.showHint(1000)
			}
			$('.taken').removeClass('taken')
		}

	}, delay || 500)
}


Game.calcFontSize = function() {

	try {
		var ideal = (((window.innerWidth / window.innerHeight) < .75) ? (window.innerWidth*.06) : (window.innerWidth*.05))
		var fontSize = 50
		$('html, body').css({fontSize:fontSize})
		while(fontSize > 14 && $('#font-test').width() > ideal)  {
			fontSize -= .25
			$('html, body').css({fontSize:fontSize})
		}
		$('#font-test').text('').remove()
	} catch(e) {}
}


initPlugins = function() {

	try {
		//initAdMob()
		//showBannerFunc()

		document.addEventListener('onDismissInterstitialAd', function() {
			Game.new_game()
		})

	} catch(e) {}
}


Game.init = function() {

	Game.audio = {
		audio_select_letter: './sounds/dustyroom_cartoon_bubble_pop.mp3',
		audio_init: './sounds/zapsplat_leisure_jigsaw_pieces_handful_large_drop_into_card_box_002_33361.mp3',
		audio_word_fail: './sounds/zapsplat_cartoon_blink_flirt_marimba_001_18050.mp3',
		audio_word_okay: './sounds/little_robot_sound_factory_Jingle_Win_Synth_03.mp3',
		audio_word_half_palidrome: './sounds/zapsplat_cartoon_ascend_tone_mallet_fast_positive_12647.mp3',
		audio_word_palidrome: './sounds/little_robot_sound_factory_Jingle_Win_Synth_00.mp3',
		audio_secret_word: './sounds/zapsplat_cartoon_ascend_x4_short_004_12652.mp3',
		audio_level_failed: './sounds/zapsplat_cartoon_descend_fast_marimba_18054.mp3',
		audio_level_complete: './sounds/zapsplat_multimedia_game_retro_musical_success_003_21514.mp3',
		audio_help_bolt: './sounds/zapsplat_nature_thunder_crack_designed_003_31230.mp3',
		audio_help_blank: './sounds/zapsplat_multimedia_game_zap_laser_004_24949.mp3',
		audio_help_swap: './sounds/zapsplat_foley_rope_or_cable_whip_swish_through_air_short_spin_001_11946.mp3'
	}

	Game.sound = function(sound) {
		if (Game.use_sounds) {
			if (Game.last_sound) {
				Game[Game.last_sound].pause()
				Game[Game.last_sound].currentTime = 0
			}
			Game.last_sound = sound
			Game[sound].play()
		}
	}

	for(audio in Game.audio) {
		Game[audio] = new Audio(Game.audio[audio])
		Game[audio].load()
	}

	if (!Trunk.load('use_sounds', null)) {
        Trunk.save('use_sounds', 'on')
		//$('.mute').click()
	} else if (Trunk.load('use_sounds', null) == 'on') {
		$('.mute').addClass('fa-volume-up').removeClass('fa-volume-off')
		Game.use_sounds = true
	} else {
		$('.mute').addClass('fa-volume-off').removeClass('fa-volume-up')
		Game.use_sounds = false
	}

	Game.highest_level = Trunk.load('highest_level', 0)
	Game.level = Trunk.load('level', 0)
	$('.level').text(Game.level + 1)

	Game.score = Trunk.load('score', 0)
	$('.score').text(Game.score)

	Game.helps = {
		bolts: Trunk.load('bolts', 0),
		blanks: Trunk.load('blanks', 0),
		swaps: Trunk.load('swaps', 0)
	}

	$('.bolts').attr('data-count', Game.helps.bolts).addClass(Game.helps.bolts ? 'active' : '')
	$('.blanks').attr('data-count', Game.helps.blanks).addClass(Game.helps.blanks ? 'active' : '')
	$('.swaps').attr('data-count', Game.helps.swaps).addClass(Game.helps.swaps ? 'active' : '')

	if (Game.level == 0) {
		Game.showHowTo(0)
	}

	Game.new_game()

	$('body').contextmenu(function(e) {
		e.preventDefault()
		return false
	})

}


Game.rnd = function(n) { return typeof n !== 'undefined' ? Math.floor(Math.random()*n) : Math.random() }


Game.showHowTo = function(howtoIndex) {
	if (howtoIndex < Game.howtos.length) {
		var buttons = {}
		if (howtoIndex < (Game.howtos.length-1)) {
			buttons.next = function() {
				Game.showHowTo(++howtoIndex)
			}
		} else {
			buttons.done = function() {
				Game.showHowTo(++howtoIndex)
			}
		}
		buttons.back = (howtoIndex > 0 ? function() { Game.showHowTo(--howtoIndex) } : null)
		buttons.skip = function() {}

		Dialogs.modal($('<div />').append(
			$('<div />').append(
				$('<img />').attr('src', './help/' + howtoIndex + '.gif').bind('error', function() {
					$(this).remove()
				})
			),
			$('<p />').text(Game.howtos[howtoIndex])
		), buttons, 'How to Play')
	}
}


Game.is_full = function() {
	for(var i=0;i<Game.columns.length;i++) {
		if ($($('.game-board div')[i]).find('span').length < Game.rowCount) {
			return false
		}
	}
	return true
}


Game.new_game = function() {
	Game.columns = []
	Game.wordHints = []
	Game.secret_word = ''

	Game.clump = Math.floor(Game.level / 5)

	Game.wordLength = Math.floor(Game.level / 4 + 5.5)

	$('.level').text(Game.level*1 + 1)
	$('.word').text(' ')
	$('.game-board').empty().addClass('flex-box')

	for(var i=0;i<Game.columnCount;i++) {
		var col = $('<div class="flex-box flex-column-reverse"/>').append('<s class="filler"/>')
		$('.game-board').append(col)
		Game.columns.push([])
	}

	var Goal = {
		words: 10 //(Game.clump + 1) * 2 + 8
	}

	Game.add_words(0)

	var bands = []
	bands.push(Game.rnd(96) + 0)
	bands.push(Game.rnd(98 - bands[0]) + bands[0])
	bands.push(Game.rnd(100 - bands[1]) + bands[1])

	if (Game.level >= Game.backs.length) {
		var gradient = 'radial-gradient(circle at '+Game.rnd(100)+'% '+Game.rnd(100)+'%'
	} else {
		var gradient = 'linear-gradient('+(Game.rnd(90)-45)+'deg'
	}

	$('.shell').css({background: gradient + ', rgba(0,0,0,.5) '+bands[0]+'%, rgba(0,0,0,.25) '+bands[0]+'%, rgba(0,0,0,.25) '+bands[1]+'%, rgba(0,0,0,.125) '+bands[1]+'%, rgba(0,0,0,.125) '+bands[2]+'%, rgba(0,0,0,0) '+bands[2]+'%), radial-gradient(at '+Game.rnd(100)+'% '+Game.rnd(100)+'%, ' + Game.backs[Game.level % Game.backs.length] + ', ' + Game.backs[(Game.level+1) % Game.backs.length] + ')'})


	switch(Game.level % 5) {
		case 0: //words - squares
			Goal.squares = Math.floor((Game.clump*.5 + 0) * Goal.words)
			if (Goal.squares == 0) {
				$('.goal').html('Find <span class="words">'+Goal.words+'</span> <em class="plural">Words</em>')
			} else {
				var bloks = $('.blok')
				for(var i = 0; i < Goal.squares; i++) {
					var column = $('.game-board div').eq(Game.rnd(Game.columnCount))
					column.find('.blok').eq(Game.rnd(Game.columnCount)).addClass('req')
				}
				Goal.squares = $('.req').length
				$('.goal').html('Use <span class="squares">'+Goal.squares+'</span> <span>Squares</span> in <span class="words">'+Goal.words+'</span> <em class="plural">Words</em> <i class="ratio"><span><u>'+(Goal.squares/Goal.words).toFixed(1)+'</u><em>word</em></span></i>')
			}
		break;

		case 1: //letters
			//Goal.letters = Math.floor((Game.clump*.5 + 3) * Goal.words)  // 3, 3.5,
			Goal.letters = Math.floor(Math.sqrt((Game.clump*.5 + 3) * Goal.words * 30))  // 3, 3.5,
			$('.goal').html('Use <span class="letters">'+Goal.letters+'</span> <span>Letters</span> in <span class="words">'+Goal.words+'</span> <em class="plural">Words</em> <i class="ratio"><span><u>'+(Goal.letters/Goal.words).toFixed(1)+'</u><em>word</em></span></i>')
		break;

		case 2: //vowels
			Goal.vowels = Math.min(30, Math.floor((Game.clump*.08 + 1.1) * Goal.words))
			$('.goal').html('Use <span class="vowels">'+Goal.vowels+'</span> <span>Vowels</span> in <span class="words">'+Goal.words+'</span> <em class="plural">Words</em> <i class="ratio"><span><u>'+(Goal.vowels/Goal.words).toFixed(1)+'</u><em>word</em></span></i>')
		break;

		case 3: //points
			//Goal.points = Math.floor(Math.pow(2, Game.clump) * 4 / 7 * Goal.words)
			Goal.points = Math.floor(4 * Goal.words + 16 * Game.clump)
			$('.goal').html('Earn <span class="points">'+Goal.points+'</span> <span>Points</span> from <span class="words">'+Goal.words+'</span> <em class="plural">Words</em> <i class="ratio"><span><u>'+(Goal.points/Goal.words).toFixed(1)+'</u><em>word</em></span></i>')
		break;

		case 4: //common
			Goal.commons = 10
			Goal.letter = Game.common[Game.clump % Game.common.length]
			$('.goal').html('Use the letter <span>"'+(Goal.letter.toUpperCase())+'"</span> <span class="commons">'+Goal.commons+'</span> times in <span class="words">'+Goal.words+'</span> <em class="plural">Words</em> <i class="ratio"><span><u>'+(Goal.commons/Goal.words).toFixed(1)+'</u><em>word</em></span></i>')
		break;
	}

	Game.goal = Goal

	setTimeout(function() {
		Game.sound('audio_init')

		$('.filler').animate({height:0,border:0}, 800, function() {
			$('.filler').remove()
		})

		$('.word').addClass('good')
		if (!Game.level) {
			Game.showHint()
		} else {
			$('.word.bad, .word.good').text('tap for hint').addClass('hint').removeClass('good bad')
		}

	}, 500)
}


Game.add_words = function(z) {

	var addedWords = (z * 7)

	while(!Game.is_full()) {

		var word = allWords[Game.rnd(allWords.length)]

		var goalLetter = Game.common[Game.clump % Game.common.length]

		if (word.length <= Game.wordLength && word.length > 2
			&& ((Game.level % 5) != 4 || word.indexOf(goalLetter) != -1)
			&& (Game.level < 50 || (Game.level % 5) != 2 || word.match(/[aeiouy]/g).length > 1)
			&& (Game.level < 100 || (Game.level % 5) != 2 || word.match(/[aeiouy]/g).length > 2)
			&& !(Game.ignoreDecoded.some(function(bit) { return (word.indexOf(bit) != -1) }))
		) {

			if (addedWords > 6 && Game.secret_word == '') {
				Game.secret_word = word
				//console.log('secret_word', Game.secret_word)
			}

			//console.log('word', word)

			Game.wordHints.push(word)

			if (Game.rnd()>.5) {
				word = word.split('').reverse().join('')
			}

			var color = Game.colors[Game.rnd(Game.colors.length)]
				 ,offset = Game.rnd(Game.columnCount)
				 ,dir = Game.rnd(2) ? 1 : -1
				 ,stack = 0
				 ,isReq = false

			Game.words[word.length] ? Game.words[word.length]++ : Game.words[word.length] = 1

			addedWords++

			for(var i=0;i<word.length;i++) {
				var j = (offset)
				if (stack==0 && Game.rnd()>.75 && offset !=0 && offset != Game.columnCount-1) {
					stack=1
				} else {
					offset += dir
					stack=0
				}
				if (offset >= Game.columnCount) {
					offset = Game.columnCount-1
					dir = -1
				}
				if (offset < 0) {
					offset = 0
					dir = 1
				}
				Game.columns[j].push({
					letter: word[i],
					color: color,
					req: (Game.columns[j].length < Game.columnCount && Game.rnd()<.2)
				})

				var column = $('.game-board div')[j]

				$(column).append(
					$('<span class="blok"/>')
						.text(word[i])
						.addClass(color)
				)

			}

		}
	}
}

$('.mute').click(function() {
    Dialogs.modal($('<div />').text('Sound Setting').append(
        $('<div class="text-small" />').append('Sound effects obtained from <a href="https://www.zapsplat.com" target="_blank">https://www.zapsplat.com</a>')
        ), {
		'Turn Sounds On' : function(form) {
            Game.use_sounds = true
			Trunk.save('use_sounds', 'on')
            $('.mute').addClass('fa-volume-up').removeClass('fa-volume-off')
		},
		'Turn Sounds Off' : function(form) {
            Game.use_sounds = false
			Trunk.save('use_sounds', 'off')
            $('.mute').addClass('fa-volume-off').removeClass('fa-volume-up')
		},
	})
})


$('.bolts').click(function() {
	if (Game.using_help) {
		Game.using_help = false
		$('body').removeClass('faded')
	} else if (Game.helps.bolts > 0) {
		Game.using_help = 'bolt'
		$('body').addClass('faded')
		$('.helps-title span').text('Select Color to Remove')
	} else if (showRewardFunc) {
		$('.rewardPrompt').attr('open', true)
	}
})

$('.swaps').click(function() {
	if (Game.using_help) {
		Game.using_help = false
		$('body').removeClass('faded')
	} else if (Game.helps.swaps > 0) {
		Game.using_help = 'swap'
		$('body').addClass('faded')
		$('.helps-title span').text('Select Letters to Swap')
	} else if (showRewardFunc) {
		$('.rewardPrompt').attr('open', true)
	}
})

$('.blanks').click(function() {
	if (Game.using_help) {
		Game.using_help = false
		$('body').removeClass('faded')
	} else if (Game.helps.blanks > 0) {
		Game.using_help = 'blank'
		$('body').addClass('faded')
		$('.helps-title span').text('Select Letter to Change to Blank')
	} else if (showRewardFunc) {
        $('.rewardPrompt').attr('open', true)
    }
})

$('.helps-cancel').click(function() {
	Game.using_help = false
	$('body').removeClass('faded')
})

$('.word-wrapper').click(function() {
	$('.word.hint').text('')
	Game.showHint()
})

$('.closeDialog').click(function() {
	$(this).closest('dialog').removeAttr('open')
})

$('.viewAd').click(function() {
	showRewardFunc()
	//setTimeout(giveReward, 2000)
	$(this).closest('dialog').removeAttr('open')
})

giveReward = function() {
	let help_reward = $('[name="help_reward"]:checked').get(0)
	switch (help_reward.value) {
		case 'bombs':
			Game.helps.bombs += 1
		break
		case 'bolts':
			Game.helps.bolts += 2
		break
		case 'blanks':
			Game.helps.blanks += 4
		break
		case 'swaps':
			Game.helps.swaps += 6
		break
	}
	$('.' + help_reward.value).attr('data-count', Game.helps[help_reward.value]).addClass('active')
	Trunk.save(help_reward.value, Game.helps[help_reward.value])
}


$('.menu').click(function() {
	Dialogs.modal($('<div />').append(
		$('<div />').append(
			$('<a class="menu-item" />').html('<i class="fa fa-question-circle"></i> How to Play').click(function() {
				$('.dialog-wrapper').remove()
				Game.showHowTo(0)
			})
		),
		$('<div />').append(
			$('<a class="menu-item" />').html('<i class="fa fa-tasks"></i> Select Level').click(function() {
				$('.dialog-wrapper').remove()
				var levels = $('<select name="level" />')
				for(var i=0;i<=Game.highest_level;i++) {
					levels.append(
						$('<option value="'+i+'">Level '+(i+1)+'</option>').attr('selected', (i == Game.level ? 'selected' : false))
					)
				}
				Dialogs.modal('Go to Level:'+$('<div/>').append(levels).html(), {
					'OK' : function(form) {
						if (form.level) {
							Game.level = form.level
							Trunk.save('level', Game.level)
							Game.new_game()
						}
					},
					cancel: function() {}
				})
			})
		),
		$('<div />').append(
			$('<a class="menu-item" href="mailto:digitalfunmedia@gmail.com?subject=Word Search Crush" />').html('<i class="fa fa-comment"></i> Feedback')
		),
		$('<div />').append(
			$('<a class="menu-item" href="https://play.google.com/store/apps/details?id=com.digitalfunmedia.wordsearchcrush" target="_blank" />').html('<i class="fa fa-star"></i> Rate')
		)
	), {
		close: function() {}
	})
})



$('body').on('animationend webkitAnimationEnd', '.spark', function(e) {
	$(this).removeClass('spark')
})

$('body').on('animationend webkitAnimationEnd', '.fade', function(e) {
	$(this).remove()
})

$('.game-board').on({
	'mousedown touchstart' : function(e) {

		if (Game.hintTimeout) {
			clearTimeout(Game.hintTimeout)
			Game.hintTimeout = false
		}

		if (Game.using_help && Game.using_help != 'swap') {
			switch (Game.using_help) {
				case 'bolt':
					var className = '.'+$(e.target).attr('class').replace(' req', '').replace(/ /g, '.')
					$(className).animate({height:0,border:0}, 500, function() {
						$(className).remove()
						Game.add_words(1)
					})
					Game.using_help = 'wait-for-it'
					Game.helps.bolts--
					Game.sound('audio_help_bolt')
					Trunk.save('bolts', Game.helps.bolts)
					if (Game.helps.bolts <= 0) {
						$('.bolts').removeClass('active')
					}
					Game.goal.squares = $('.req:not(.selected)').length
					$('.squares').text(Game.goal.squares)
					$('.ratio u').text((Game.goal.squares/Game.goal.words).toFixed(1))
				break;

				case 'blank':
					$(e.target).fadeOut(0).addClass('blank').text('?').fadeIn('slow')
					Game.using_help = 'wait-for-it'
					Game.helps.blanks--
					Game.sound('audio_help_blank')
					Trunk.save('blanks', Game.helps.blanks)
					if (Game.helps.blanks <= 0) {
						$('.blanks').removeClass('active')
					}
				break;
			}
			$('body').removeClass('faded')
			setTimeout(function() {
				Game.using_help = ''
			}, 1000)
			$('.bolts').attr('data-count', Game.helps.bolts)
			$('.blanks').attr('data-count', Game.helps.blanks)
			return
		}

		$('.selected').removeClass('selected')

		Game.touching = true
		$(e.target).addClass('selected')
		Game.selected = $(e.target).text()
		Game.lastElement = e.target
		if (!Game.using_help) {
			Game.sound('audio_select_letter', true)

			$('.word').removeClass('good bad hint')
			if (Game.hint.indexOf(Game.selected) == 0) {
				$('.word').html(Game.selected + '<b class="hint">'+Game.hint.slice(Game.selected.length)+'</b>')
			} else {
				$('.word').text(Game.selected + '...')
			}
		}
	},

	'touchmove mousemove': function(e) {
		if (Game.touching) {
			if (e.originalEvent) { e = e.originalEvent }
			if (e.touches) { e = e.touches[0] }
			var x = e.clientX
			var y = e.clientY
			var thisElement = document.elementFromPoint(x, y);

			if (thisElement != Game.lastElement && $(thisElement).hasClass('blok') && !$(thisElement).hasClass('selected')) {
				var lastPos = [
					$(Game.lastElement).parent().find('.blok').index(Game.lastElement),
					$(Game.lastElement).parent().parent().find('div').index($(Game.lastElement).parent())
				]
				var thisPos = [
					$(thisElement).parent().find('.blok').index(thisElement),
					$(thisElement).parent().parent().find('div').index($(thisElement).parent())
				]

				if (Math.abs(lastPos[0] - thisPos[0]) < 2 && Math.abs(lastPos[1] - thisPos[1]) < 2) {

					if (Game.using_help == 'swap') {

						var thisClone = $(thisElement).clone()
						var lastClone = $(Game.lastElement).clone()

						$(thisElement).fadeOut('slow', function() {
							$(this).replaceWith(lastClone)
						})

						$(Game.lastElement).fadeOut('slow', function() {
							$(this).replaceWith(thisClone)
						})

						Game.helps.swaps--
						Game.sound('audio_help_swap')
						Trunk.save('swaps', Game.helps.swaps)
						if (Game.helps.swaps <= 0) {
							$('.swaps').removeClass('active')
						}
						$('body').removeClass('faded')
						$('.swaps').attr('data-count', Game.helps.swaps)
						Game.touching = false
						Game.selected = ''
						Game.lastElement = thisElement = null
						setTimeout(function() {
							Game.using_help = ''
							$('.selected').removeClass('selected')
						}, 1000)
						return
					}

					Game.lastElement = thisElement
					Game.selected += $(thisElement).text()

					if (Game.selected.length > 1 && !Game.using_help) {
						$('.selected').removeAttr('data-points')
						$(thisElement).addClass('selected').attr('data-points', Math.pow(2, Game.selected.length-1))
						Game.sound('audio_select_letter', true)
					}

					if (Game.hint.indexOf(Game.selected) == 0) {
						$('.word').html(Game.selected + '<b class="hint">'+Game.hint.slice(Game.selected.length)+'</b>')
					} else {
						$('.word').text(Game.selected + '...')
					}
				}
			}
		}
	},

	'touchend mouseup': function() {
		Game.touching = false

		$('.word').text(Game.selected)

		if (Game.selected.indexOf('?')!=-1) {
			for(var i=0;i<26;i++) {
				var word = Game.selected.replace(/\?/g, Game.letters[i])
				if (englishWords.indexOf(word)!=-1) {
					Game.selected = word;
					$('.word').text(word)
					break
				}
			}
		}

		$('.glowing-letter').removeClass('glowing-letter')

		if (Game.selected.length > 1 && englishWords.indexOf(Game.selected) !== -1 && !Game.using_help) {

			var pos = Game.wordHints.indexOf(Game.selected)
			if (pos > -1) {
				Game.wordHints.splice(pos, 1)
				//console.log(Game.wordHints)
			}

			Game.sound('audio_word_okay', true)

			Game.goal.words--

			var points = Math.pow(2, Game.selected.length-1)

			if (Game.goal.letters) {
				Game.goal.letters -= Game.selected.length
				if (Game.goal.letters < 1) {
					$('.goal').html('Find <span class="words">'+Game.goal.words+'</span> <em class="plural">Words</em>')
				} else {
					$('.letters').text(Game.goal.letters)
					$('.ratio u').text((Game.goal.letters/Game.goal.words).toFixed(1))
				}
			}

			if (Game.goal.vowels) {
				var vowelCount = 0
				Game.selected.split('').forEach(function(letter, index) {
					if (Game.vowels.indexOf(letter) !== -1) {
						vowelCount++
					} else if (letter == 'y') {
						 if (index == 0) {
							if (Game.vowels.indexOf(Game.selected[1]) === -1) {
								vowelCount++
							}
						} else if (index == Game.selected.length - 1) {
							if (Game.vowels.indexOf(Game.selected[Game.selected.length - 2]) === -1) {
								vowelCount++
							}
						} else if (Game.vowels.indexOf(Game.selected[index-1]) === -1 && Game.vowels.indexOf(Game.selected[index+1]) === -1) {
							vowelCount++
						}
					}
				})
				Game.goal.vowels -= vowelCount
				if (Game.goal.vowels < 1) {
					$('.goal').html('Find <span class="words">'+Game.goal.words+'</span> <em class="plural">Words</em>')
				} else {
					$('.vowels').text(Game.goal.vowels)
					$('.ratio u').text((Game.goal.vowels/Game.goal.words).toFixed(1))
				}
			}

			if (Game.goal.points) {
				Game.goal.points -= points
				if (Game.goal.points < 1) {
					$('.goal').html('Find <span class="words">'+Game.goal.words+'</span> <em class="plural">Words</em>')
				} else {
					$('.points').text(Game.goal.points)
					$('.ratio u').text((Game.goal.points/Game.goal.words).toFixed(1))
				}
			}

			if (Game.goal.squares) {
				Game.goal.squares = $('.req:not(.selected)').length
				if (Game.goal.squares < 1) {
					$('.goal').html('Find <span class="words">'+Game.goal.words+'</span> <em class="plural">Words</em>')
				} else {
					$('.squares').text(Game.goal.squares)
					$('.ratio u').text((Game.goal.squares/Game.goal.words).toFixed(1))
				}
			}

			if (Game.goal.commons) {
				Game.goal.commons -= (Game.selected.match(new RegExp(Game.goal.letter, 'g')) || []).length
				if (Game.goal.commons < 1) {
					$('.goal').html('Find <span class="words">'+Game.goal.words+'</span> <em class="plural">Words</em>')
				} else {
					$('.commons').text(Game.goal.commons)
					$('.ratio u').text((Game.goal.commons/Game.goal.words).toFixed(1))
				}
			}

			if (Game.goal.words == 1) {
				$('.plural').html('Last Word!').addClass('spark')
			}

			Game.score += points
			Trunk.save('score', Game.score)
			$('.score').text(Game.score).addClass('spark')
			$('.words').text(Game.goal.words)
			$('.word').addClass('good').html('<a href="http://www.dictionary.com/browse/'+Game.selected+'" target="wordDefinition">'+Game.selected+'</a>')

			var reversed = Game.selected.split('').reverse().join('')

			var messages = []

			if (Game.selected == reversed) {
				Game.helps.blanks++
				Trunk.save('blanks', Game.helps.blanks)
				$('.blanks').addClass('active').addClass('spark')
				messages.push('Palindrome')
				Game.sound('audio_word_palidrome')
			} else if (englishWords.indexOf(reversed) !== -1) {
				Game.helps.swaps++
				Trunk.save('swaps', Game.helps.swaps)
				$('.swaps').addClass('active').addClass('spark')
				messages.push('Half-Palindrome')
				Game.sound('audio_word_half_palidrome')
			}

			if (Game.selected == Game.secret_word) {
				Game.helps.bolts++
				Trunk.save('bolts', Game.helps.bolts)
				$('.bolts').addClass('active').addClass('spark')
				Game.secret_word = ''
				messages.push('Secret Word Found!')
				Game.sound('audio_secret_word')
			}

			$('.bolts').attr('data-count', Game.helps.bolts)
			$('.blanks').attr('data-count', Game.helps.blanks)
			$('.swaps').attr('data-count', Game.helps.swaps)

			if (Game.goal.words < 1) {
				//done
				if (
					Game.goal.letters > 0
					|| Game.goal.vowels > 0
					|| Game.goal.points > 0
					|| Game.goal.squares > 0
					|| Game.goal.commons > 0
				) {
					messages.push('Failed!')
					Game.sound('audio_level_failed')
					Dialogs.modal(messages.join('<br/>'), {
						'Try Again': function() {
                            try {
    							showInterstitialFunc(Game.use_sounds)
                            } catch(e) {}
							if (!window.plugins || !window.plugins.AdMob.interstitialPresented) {
								Game.new_game()
							}

						}
					})

				} else {
					Game.sound('audio_level_complete')

					var puzzlesCompleted = (localStorage.getItem('puzzlesCompleted') || 0)
					localStorage.setItem('puzzlesCompleted', ++puzzlesCompleted)

					if (puzzlesCompleted === 5) {
						setTimeout(function() {
							$('.askRate').attr('open', true).show()
						}, 500)
					}

					$('.goal').html('<span>&nbsp;</span>')
					var done = false
					messages.push('Level Complete!')
					Dialogs.modal(messages.join('<br/>'), {
						'Next Level': function() {
							Game.level++
							Trunk.save('level', Game.level)
							Game.highest_level = Math.max(Game.highest_level, Game.level)
							Trunk.save('highest_level', Game.highest_level)
							$('.level').text(Game.level + 1).addClass('spark')

                            try {
    							showInterstitialFunc(Game.use_sounds)
                            } catch(e) {}

							if (!window.plugins || !window.plugins.AdMob.interstitialPresented) {
								Game.new_game()
							}

						}
					}).addClass('cool')
					$('.blok').fadeOut(2000, function() {
						if (!done) {
							done = true
						}
					})
				}
			} else {

				if (messages.length > 0) {
					Dialogs.modal(messages.join('<br/>')).addClass('fade cool')
					setTimeout(function() {
						$('.fade').remove()
					}, 2000)
				}

				$('.selected').animate({height:0,border:0}, 500, function() {
					$('.selected').remove()
					Game.add_words(1)
				})
			}

		} else {
			if (!Game.using_help) {
				Game.sound('audio_word_fail', true)
				$('.word').addClass('bad')
			} else {
				$('.word').text('')
			}
			$('.selected').removeClass('selected')
		}

		if (Game.goal.words >= 1) {
			if (!Game.level) {
				Game.showHint(2000)
			} else {
				setTimeout(function() {
					$('.word.bad, .word.good').text('tap for hint').addClass('hint').removeClass('good bad')
				}, 2000)
			}
		}
		Game.selected = '';
	}
}, '.blok')


try {
	document.querySelector('.askRate button').onclick = function() {
		document.querySelector('.askRate').removeAttribute('open')
	}
} catch(e) {}


//Game.init()


var app = {

	timeout: false,

	initialize: function() {
		document.addEventListener('deviceready', this.onDeviceReady, false);
		this.timeout = setTimeout(function () {
			Game.calcFontSize()
			initPlugins()
			Game.init()
		}, 1000);
	},

	onDeviceReady: function() {
		app.receivedEvent('deviceready');
	},

	receivedEvent: function(id) {
		clearTimeout(this.timeout)
		try {
			Game.calcFontSize()
			initPlugins()
			Game.init()
		} catch(e) {
			alert(e)
		}
	}
}

app.initialize();
