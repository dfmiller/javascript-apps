
var rnd=function(n) {
	return (typeof n == 'undefined' ? Math.random() : Math.floor(Math.random()*n))
}

var Colors = {

	red: '#FF0000', //'#FE2712',
	vermillion: '#FD5308',
	orange: '#FB9902',
	amber: '#FFD700', //'#FABC02',
	yellow: '#FFFF00', // '#FEFE33',
	chartreuse: '#D0EA2B',
	green: '#66B032',
	teal: '#0AA7A6', //'#0392CE',
	blue: '#0000FF', //'#0247FE',
	violet: '#3D01A4',
	purple: '#8601AF',
	magenta: '#A7194B',
	black: '#000000',
	white: '#FFFFFF',

	mix: {
		1: {},
		2: {},
		3: {},
		4: {},
	},

	level: 1,
	sublevel: 0,
	answers: $('#answers'),
	answered: [],
	score: 0,
	color: '',

	init: function(colorModel) {
		$('nav').hide()
		
		if (this.colorModel == colorModel) {
			return
		}

		this.colorModel = colorModel

		$('.help > div').hide()

		$('#name').text(colorModel.toUpperCase())

		

		this.level = (colorModel == 'cmyk' ? 0 : 1)
		this.sublevel = 0
		this.answered = []
		this.score = 0
		this.color = ''
		this.mix = {
			1: {},
			2: {},
			3: {},
			4: {},
		},

		this.mix[1][this.green] = [this.yellow, this.blue]
		this.mix[1][this.orange] = [this.yellow, this.red]
		this.mix[1][this.purple] = [this.red, this.blue]

		this.mix[2][this.chartreuse] = [this.yellow, this.green]
		this.mix[2][this.teal] = [this.blue, this.green]
		this.mix[2][this.amber] = [this.yellow, this.orange]
		this.mix[2][this.vermillion] = [this.red, this.orange]
		this.mix[2][this.magenta] = [this.red, this.purple]
		this.mix[2][this.violet] = [this.blue, this.purple]

		for(var i in this.mix[1]) {
			var mixed = this._mixing(i)
			this.mix[3][mixed[0]] = [i, this.black]
			this.mix[3][mixed[1]] = [i, this.white]
		}

		if (colorModel == 'ryb') {
			this.mix[1]['#888'] = [this.white, this.black]
		} else if (colorModel == 'cmyk') {
			this.mix[0] = {}
			this.mix[0][this.red] = {}
			this.mix[0][this.blue] = {}
		}

		for(var i in this.mix[2]) {
			var mixed = this._mixing(i)
			this.mix[4][mixed[0]] = [i, this.black]
			this.mix[4][mixed[1]] = [i, this.white]
		}

		this.mix[5] = $.extend({}, this.mix[1], this.mix[2], this.mix[3], this.mix[4])

		if (colorModel == 'ryb' || colorModel == 'cmyk') {
			$('#colors').show()
			$('#code').hide()
		} else {
			$('#colors').hide()
			$('#code').show()
		}

		if (colorModel == 'cmyk' || colorModel == 'rgb') {
			var that = this
			Object.keys(this.mix).forEach(function(index) {
				var mx = that.mix[index]
				Object.keys(mx).forEach(function(color) {
					if (colorModel == 'cmyk') {
						var parts = that._cmyk(color)
						mx[color] = []
						if (parts.c > 0) {
							mx[color].push('rgba(000,255,255,'+parts.c+')')
						}
						if (parts.m > 0) {
							mx[color].push('rgba(255,000,255,'+parts.m+')')
						}
						if (parts.y > 0) {
							mx[color].push('rgba(255,255,000,'+parts.y+')')
						}
						if (parts.k > 0) {
							mx[color].push('rgba(000,000,000,'+parts.k+')')
						}	
					} else {
						var parts = that._rgb(color)
						mx[color] = []
						if (parts.r > 0) {
							mx[color].push('rgba(255,0,0,'+parts.r+')')
						}
						if (parts.g > 0) {
							mx[color].push('rgba(0,255,0,'+parts.g+')')
						}
						if (parts.b > 0) {
							mx[color].push('rgba(0,0,255,'+parts.b+')')
						}
					}
				})
			})
		}

		Colors.play()
	},


	play: function() {
		var that = this
		var keys = Object.keys(this.mix[this.level])
		var i=0
		do {
			this.color = keys[rnd(keys.length)]
		} while(this.answered.indexOf(this.color) != -1 && (++i) < 1000)

		var mix = this.mix[this.level][this.color]
		var mixers = $('#mixers')

		mixers.empty()
		mix.forEach(function(c) {
			mixers.append($('<span class="swatch"/>').css({background:c}))
		})

		$('#code strong').text(this.color)

		this.answers.empty().append($('<button class="swatch correct"></button>').css({background:this.color}).on('click', function() {
			that.answered.push(that.color)
			$('.correct').addClass('fill-screen')
			$('span:not(.correct)').fadeOut()
			$('.score').text(++that.score)
			$('#right').css({ background: that.color })
			$('#right').fadeIn('slow')
		}))

		for(var i in this.mix[this.level]) {
			if (i != this.color) {
				var b = $('<button class="swatch"></button>').css({background:i}).on('click', function() {
					$('.correct').addClass('fill-screen')
					$('span:not(.correct)').fadeOut()
					$('#wrong').css({ background: that.color })
					$('#wrong').fadeIn('slow')
				})

				if (rnd()>.5) {
					that.answers.append(b)
				} else {
					that.answers.prepend(b)
				}
			}
		}

	},

	_mixing: function(color) {
		var r = parseInt(color.slice(1,3), 16)
		var g = parseInt(color.slice(3,5), 16)
		var b = parseInt(color.slice(5,7), 16)

		var j = '#'
			+ ('0' + Math.floor(r/2).toString(16)).slice(-2)
			+ ('0' + Math.floor(g/2).toString(16)).slice(-2)
			+ ('0' + Math.floor(b/2).toString(16)).slice(-2)

		var k = '#'
			+ ('0' + Math.min(Math.floor((r+255)/2), 255).toString(16)).slice(-2)
			+ ('0' + Math.min(Math.floor((g+255)/2), 255).toString(16)).slice(-2)
			+ ('0' + Math.min(Math.floor((b+255)/2), 255).toString(16)).slice(-2)

		return [j, k]
	},

	_rgb: function(rgb) {
		if (rgb.slice(0,1) == '#') {
			rgb = rgb.slice(1)
		}
		if (rgb.length == 6) {
			var r = parseInt(rgb.slice(0, 2), 16)
			var g = parseInt(rgb.slice(2, 4), 16)
			var b = parseInt(rgb.slice(4, 6), 16)
		} else {
			var r = parseInt(rgb.slice(0, 1)+rgb.slice(0, 1), 16)
			var g = parseInt(rgb.slice(1, 2)+rgb.slice(1, 2), 16)
			var b = parseInt(rgb.slice(2, 3)+rgb.slice(2, 3), 16)
		}
		rgb = {
			r:Math.abs(r/255).toFixed(2),
			g:Math.abs(g/255).toFixed(2),
			b:Math.abs(b/255).toFixed(2),
		}
		return rgb
	},

	_cmyk: function(rgb) {
		if (typeof rgb == 'string') {
			if (rgb.slice(0,1) == '#') {
				rgb = rgb.slice(1)
			}
			if (rgb.length == 6) {
				var r = parseInt(rgb.slice(0, 2), 16)
				var g = parseInt(rgb.slice(2, 4), 16)
				var b = parseInt(rgb.slice(4, 6), 16)
			} else {
				var r = parseInt(rgb.slice(0, 1)+rgb.slice(0, 1), 16)
				var g = parseInt(rgb.slice(1, 2)+rgb.slice(1, 2), 16)
				var b = parseInt(rgb.slice(2, 3)+rgb.slice(2, 3), 16)
			}
			rgb = {
				r:r,
				g:g,
				b:b
			}
		}

		var r = rgb.r/255
		var g = rgb.g/255
		var b = rgb.b/255
		var x = Math.max(r,g,b)

		if (x==0) {
			var k=1, c=0, m=0, y=0
		} else {
			var k = 1-x
			var c = ((x-r)/x)
			var m = ((x-g)/x)
			var y = ((x-b)/x)
		}

		return {
			c:Math.abs(c).toFixed(2),
			m:Math.abs(m).toFixed(2),
			y:Math.abs(y).toFixed(2),
			k:Math.abs(k).toFixed(2)
		}
	},



}


$('.menu').click(function() {
	$('#wrong').hide()
	$('nav').show()
})

Colors.init('ryb')

$('#ryb').click(function() {
	Colors.init('ryb')
})

$('#cmyk').click(function() {
	Colors.init('cmyk')
})

$('#rgb').click(function() {
	Colors.init('rgb')
})


$('#help').click(function() {
	$('.help .'+ Colors.colorModel).show()
})

$('.help div').click(function() {
	$('.help > div').hide()
})


$('#right button').click(function() {
	$('#right').fadeOut('slow')
	if (++Colors.sublevel >= Object.keys(Colors.mix[Colors.level]).length) {
		Colors.sublevel=0
		if (++Colors.level >= 5) {
			Colors.level = 5
			Colors.answered = []
		}
		$('.level').text(Colors.level)
	}
	Colors.play()
})

$('#wrong button').click(function() {
	$('#wrong').fadeOut('slow')
	//Colors.score = 0
	//Colors.sublevel = 0
	//Colors.level = 1
	//$('.level').text(1)
	//Colors.answered = []
	//$('.score').text(0)
	Colors.play()
})


try {
	if (window.plugins && window.plugins.insomnia) {
		window.plugins.insomnia.keepAwake()
	}
} catch(e) {
	alert(e)
}
