
rnd = function(n) {
	return Math.floor(Math.random()*n)
}



var Game = {
	use_sounds: 0,
    started: false,
}

Game.audio = {
	audio_fail: './sounds/zapsplat_cartoon_blink_flirt_marimba_001_18050.mp3',
	audio_okay: './sounds/little_robot_sound_factory_Jingle_Win_Synth_03.mp3',
	audio_level_complete: './sounds/zapsplat_multimedia_game_retro_musical_success_003_21514.mp3',
	audio_card_flip: './sounds/zapsplat_leisure_playing_card_single_turn_over_on_table_003_20475.mp3',
}

Game.sound = function(sound) {
	if (Game.use_sounds) {
		console.log(sound, Game[sound])
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


var backs = ['wood', 'picnic', 'rainbow', 'cubes', 'blueprint', 'carbon', 'upholstery'];
var currentBack = 0;

$('.tb').click(function() {
	$(document.body).prop('class', backs[++currentBack % backs.length]);
});

var colors = ['red', 'green', 'darkorange', 'blue', 'gold', 'purple']

var width = Math.min(window.innerWidth, window.innerHeight);

var dialog = $('dialog.gameSettings');

for(var i=0;i<6;i++) {
	$('#selectPlayers').append(
		$('<s/>').css({ background: colors[i]})
		.addClass(i==0 ? 'icon-user' : (i==1 ? 'icon-laptop' : 'icon-block'))
		.text(i==0 ? 'Human' : (i==1 ? 'A.I.' : 'none'))
	);
}

var player_types = ['user', 'laptop', 'server', 'block']
var player_names = {'icon-user': 'Human', 'icon-laptop': 'A.I.', 'icon-server': 'A.I.2', 'icon-block': 'none'}

$('dialog.gameSettings s').click(function(e) {
	e.stopPropagation();
	var className = '';
	for(var i=0;i<player_types.length;i++) {
		if ($(this).hasClass('icon-'+player_types[i])) {
			$(this).removeClass('icon-'+player_types[i]);
			className = 'icon-'+player_types[(++i)%player_types.length]
			$(this).addClass(className).text(player_names[className])
			var players = [];
			$('dialog.gameSettings s').each(function() {
				players.push($(this).attr('class'));
			})
			Trunk.save('players', players)
			break;
		}
	}
})

$('#boardSize').change(function(e) {
	Trunk.save('boardSize', $(this).val() || 4);
})

$('#iconSet').change(function(e) {
	Trunk.save('iconSet', $(this).val());
})


$('#use_sounds').change(function(e) {
    Game.use_sounds = ($(this).prop('checked') ? 1 : 0)
	Trunk.save('use_sounds', $(this).prop('checked') ? 1 : 0);
})


$('dialog.gameSettings').click(function(e) {
	e.stopPropagation();
});

for(var i=4;i<=10;i++) {
	$('#boardSize').append($('<option \>').val(i).text(i+' x '+i))
}


var iconSets = { camping: camping, christmas: christmas, construction: construction, food: food, medical: medical, misc: misc, sports: sports, transportation : transportation, around: house, halloween: halloween }

try {
var all = Object.keys(iconSets).reduce(function (sets, set) {
 return sets.concat(iconSets[set].icons.map(function (icon){
 return iconSets[set].folder + '/'+ icon
}))
}, [])

/*
iconSets.all = {
	name: 'All',
	folder: './',
	icon: 'icons8-camping-tent.png',
	icons: all
}
*/

} catch (e) { alert (e) }
 Object.keys(iconSets).sort().forEach(function(iconSet) {
$('#iconSet').append($('<option/>').text(iconSets[iconSet].name).val(iconSet))
})

$('#iconSet').change(function() {
 $('.sample-icon').attr('src', iconSets[$('#iconSet').val()].folder +'/' + iconSets[$('#iconSet').val()].icon)
})




$('dialog.gameSettings button').click(function(e) {
	e.stopPropagation();
	if ($('#selectPlayers s:not(.icon-block)').length > 0) {
		$('dialog.gameSettings').hide();
		Game.started = true
		start();
	}
})

$('dialog.gameSettings b').click(function(e) {
	e.stopPropagation();
	$('dialog.gameSettings').hide();
})

init = function() {
	var players = Trunk.load('players', []);
	$('dialog.gameSettings s').each(function(index) {
		$(this).attr('class', players[index]).text(player_names[players[index]]);
	})
	$('#boardSize').val(Trunk.load('boardSize', 4));
	$('#iconSet').val(Trunk.load('iconSet', 'around'));
    $('#iconSet').trigger('change')
    $('#use_sounds').prop('checked', Trunk.load('use_sounds', 0));
}

$('#players').click(function() {
	dialog.show();
})

var playerWrapper = $('#players');
var players = [];
var currentPlayer = 0;
var lastPlayer = 0;
var lastBot = -1
var playerCount = 0;
var rounds = 0;

var idleTimeout = false;

function alert(msg, player) {
	$('#alerts a').text(msg);
	if (typeof player != 'undefined') {
		if (typeof player != 'object') {
			player = [player];
		}
		player.forEach(function(p) {
			$('#alerts a').prepend($('<span>Player ' + (p+1) + ',</span>').css({background: players[p].back }))
		})
	}
	$('#alerts').addClass('active');
}


function start() {

	$('dialog.gameSettings b').show();

	lastBot = -1

	width = Math.min(window.innerWidth, window.innerHeight);

	players = [];
	playerCount = $('#selectPlayers s:not(.icon-block)').length;
	currentPlayer = ((rounds++) % playerCount);

	for(var i=0;i<playerCount;i++) {
		var type = $('#selectPlayers s:not(.icon-block)').eq(i).prop('class');
		players.push({
			turns: 0, cards: 0, type: type
		})
	}

	playerWrapper.empty();

	for(var i=0;i<playerCount;i++) {

		var back = $('#selectPlayers s:not(.icon-block)').eq(i).css('background');

		players[i].back = back;

		var type = players[i].type;

		var player = $('<u />').css({background:back}).addClass('players-'+playerCount).html('<span>0 / 0</span><small>(0%)</small>').addClass(type)
		if (currentPlayer == i) {
			player.addClass('active')
		}
		playerWrapper.append(player)
	}

	var boardSize = $('#boardSize').val() || 4
	Game.use_sounds = $('#use_sounds').prop('checked') ? 1 : 0

	var iconWidth = ((width-10)/boardSize)-4;

	var first = null;
	var second = null;

	var iconCount = Math.floor((boardSize * boardSize) / 2)

	var iconsToUse = [];

//alert(iconSets[$('#iconSet').val()])

	var iconSet = iconSets[$('#iconSet').val()]// misc


	var iconsCopy = JSON.parse(JSON.stringify(iconSet.icons));


	iconsCopy = iconsCopy.sort(function() { return rnd(3)-1 })

	iconsToUse = iconsCopy.slice(0, iconCount ).concat(iconsCopy.slice(0, iconCount )).sort(function() { return rnd(3)-1 })


	var folder = iconSet.folder

	var board = $('#board').empty().css({fontSize:iconWidth*.6})

	for(var i=0;i<boardSize;i++){
		var row = $('<div></div>');
		for(var j=0;j<boardSize;j++){
			if (iconsToUse.length > 0) {
				var r = rnd(iconsToUse.length);
				var icon = iconsToUse.splice(r, 1)[0];
				var key = icon.replace(/[^a-z]/g,'_')
				var card=$('<i></i>').data('icon', key).data('pos', i+','+j).addClass('icon-'+key+' card back').css({width:iconWidth}).append('<img src="'+folder+'/'+icon+'"/>')
			} else {
				var card=$('<i></i>').addClass('picked').css({width:iconWidth});
			}
			row.append(card);
		}
		board.append(row);
	}


	$('i').bind('mousedown click', function(e) {
		e.stopPropagation();

        Game.sound('audio_card_flip')

		if (players[currentPlayer].type == 'icon-user') {
			$('#alerts').removeClass('active');
			if (idleTimeout) {
				clearTimeout(idleTimeout);
				idleTimeout = false;
			}
		}

		if ((first && second) || $(this).hasClass('picked') || (first && first.data('pos') == $(this).data('pos'))) {
			return;
		}

		$(this).addClass('seen seen-12');

		if (!first) {
			first = $(this)

			if (players[currentPlayer].type == 'icon-user') {
				idleTimeout = setTimeout(function() {
					alert('try to pick the card that matches that one.', currentPlayer);
					idleTimeout = false;
				}, 2000);
			} else {
				lastBot = currentPlayer;
			}

		} else {
			second = $(this)

			var allCards = $('i.card');

			allCards.filter('.seen-0').removeClass('seen seen-0');
			for(var i=0;i<12;i++) {
				allCards.filter('.seen-'+(i+1)).removeClass('seen-'+(i+1)).addClass('seen-'+i);
			}

			if (first.data('icon') != second.data('icon')) {
				setTimeout(function() {
					alert(_('no match'));
                    Game.sound('audio_fail')
				}, 500);
			}

			setTimeout(function() {
				playerWrapper.find('u').removeClass('active');
				players[currentPlayer].turns++;
				updateScore();

				lastPlayer = currentPlayer;

				if (first.data('icon') == second.data('icon')) {

					if (players[currentPlayer].type == 'icon-user') {
						alert('you got a match.', currentPlayer)
                        Game.sound('audio_okay')
					}

					first.removeClass('card').addClass('picked');
					second.removeClass('card').addClass('picked');
					players[currentPlayer].cards++;
					updateScore();

					if (--iconCount <= 0) {

						var puzzlesCompleted = (Trunk.load('puzzlesCompleted', 0))
						Trunk.save('puzzlesCompleted', ++puzzlesCompleted)

						if (puzzlesCompleted === 5) {
							setTimeout(function() {
								$('.askRate').attr('open', true).show()
							}, 500)
						}

						playerWrapper.find('u').addClass('active');
						dialog.show();
						$('#alerts').removeClass('active');

						var winners = []
						players.forEach(function(player, index) {
							players[index].ratio = (players[index].cards / players[index].turns);
							if (winners.length == 0 || (players[index].ratio == players[winners[0]].ratio)) {
								winners.unshift(index)
							} else if (winners.length > 0 && (players[index].ratio > players[winners[0]].ratio)) {
								winners = [index];
							}
						})

                        Game.sound('audio_level_complete')

						if (winners.length == 1) {
							alert('Is the winner', winners)
						} else {
							alert('Are the winners', winners)
						}
					}

				} else {
					first.addClass('back');
					second.addClass('back');
					currentPlayer = (++currentPlayer) % playerCount;
				}

				first = second = null;
				playerWrapper.find('u:nth-child('+(currentPlayer+1)+')').addClass('active');

				if (players[currentPlayer].type != 'icon-user' && iconCount > 0) {
					autoPlay();
				} else if (iconCount > 0) {
					if (lastPlayer != currentPlayer) {
						idleTimeout = setTimeout(function() {
							alert('it is your turn.', currentPlayer)
							idleTimeout = setTimeout(function() {
								alert('select a card.', currentPlayer)
								idleTimeout = false;
							}, 5000);
						}, 500);
					} else if (playerCount > 1){
						idleTimeout = setTimeout(function() {
							alert('you can go again, since the cards matched.', currentPlayer)
							idleTimeout = false;
						}, 1000);
					} else {
						idleTimeout = setTimeout(function() {
							alert('go again.', currentPlayer)
							idleTimeout = false;
						}, 100);
					}
				}

			}, 1000)
		}

		$(this).removeClass('back')
	})

	if (players[currentPlayer].type != 'icon-user' && iconCount > 0) {
		autoPlay();
	} else {
		idleTimeout = setTimeout(function() {
			alert('select a card.', currentPlayer)
			idleTimeout = false;
		}, 1000);
	}



}

function autoPlay() {
	$('#board').css({pointerEvents:'none'});

	var allCards = $('i.card');

	if (allCards.length > 1) {

		if (lastPlayer != currentPlayer) {
			alert(_('My turn'));
		}

		if (players[currentPlayer].type == 'icon-laptop') {
			var seen = allCards.filter(function() {
				return $(this).is('.seen-9,.seen-10,.seen-11,.seen-12')
			});
		} else {
			var seen = allCards.filter(function() {
				return $(this).is('.seen')
			});
		}

		var firstCard = false;

		for(var i=0;i<seen.length;i++) {
			if (!firstCard) {
				for(var j=0;j<seen.length;j++) {
					if (seen.eq(i).data('icon') == seen.eq(j).data('icon') && seen.eq(i).data('pos') != seen.eq(j).data('pos')) {
						firstCard = seen.eq(i)
						break;
					}
				}
			}
		}

		var unseen = [];

		if (!firstCard) {
			if (players[currentPlayer].type == 'icon-laptop') {
				unseen = allCards.filter(':not(.seen-9,.seen-10,.seen-11,.seen-12)');
			} else {
				unseen = allCards.filter(':not(.seen)');
			}

			if (unseen.length>0) {
				var firstCard = unseen.eq(rnd(unseen.length));
			} else {
				var firstCard = allCards.eq(rnd(allCards.length));
			}
		}

		var pair = seen.filter('.icon-'+firstCard.data('icon'));

		setTimeout(function() {
			firstCard.trigger('click');
			setTimeout(function() {
				if (pair.length > 0 || allCards.length < 3) {
					alert(_('known'))
				} else {
					alert(_('searching'))
				}
			}, 200);
		}, 500)

		var delay = 1000 + rnd(500);

		do {
			if (pair.length>0) {
				delay = 1000;
				var secondCard = pair.eq(rnd(pair.length));
			} else if (unseen.length > 0) {
				var secondCard = unseen.eq(rnd(unseen.length));
			} else {
				var secondCard = allCards.eq(rnd(allCards.length));
			}
		} while (secondCard.data('pos') == firstCard.data('pos'));

		setTimeout(function() {
			secondCard.trigger('click');
			setTimeout(function() {
				if (firstCard.data('icon') == secondCard.data('icon')) {
					if (pair.length == 0 && allCards.length > 2) {
						alert(_('match'))
                    }
                    Game.sound('audio_okay')
				}
				$('#board').css({pointerEvents:''});
			}, 500)
		}, delay)
	}
}


function updateScore() {
	playerWrapper.find('u:nth-child('+(currentPlayer+1)+') span').text(players[currentPlayer].cards + ' / ' + players[currentPlayer].turns);
	playerWrapper.find('u:nth-child('+(currentPlayer+1)+') small').text('(' + (players[currentPlayer].cards / players[currentPlayer].turns*100).toFixed(1)*1+'%)')
}

function _(str) {
	var p = phrases[str];
	return (p && p.length) ? p[rnd(p.length)] : str;
}


var phrases = {
	'match': ['I got a match!', 'Alright!', 'YES!', 'Found one!', "That what I\'m talking about!", 'Oh Yeah!', 'Okay!', 'Cool!', 'Woot!', 'Excellent!', 'Fantastic!', 'Magnificent!', 'Marvelous!', 'Terrific!', 'Divine!', 'Dyn-o-mite!', 'Groovy!', 'Super!'],
	'searching': ['Hmmm...', 'Let me see...', 'Which one?  Which one?', 'Eeny, meeny, miny, moe...', 'Where could that be?', 'Think, think, think'],
	'known': ['I know that one!', 'A-ha!', 'Easy!', 'I got this!', 'Booyah!', 'Sweet!'],
	'My turn': ['My turn', 'Now me', "I\'m up", 'My go', "It\'s my turn", "Me next"],
	'no match': ["That\'s not a match", 'No match there', "Those don\'t match"]
}


/* added feb 20, 2018 */
try {
	document.querySelector('.askRate button').onclick = function() {
		document.querySelector('.askRate').removeAttribute('open')
		document.querySelector('.askRate').style.display = 'none'
	}
} catch(e) {}
