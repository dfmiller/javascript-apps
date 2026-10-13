/*
	synonyms: amazing|incredible,
	oct
	ascii art
	foreign words
*/


books.push({
	name: 'Challenge',
	size: 12,
	words: 'Challenge',
	randomize: true,
	css: {
		backgroundColor: 'black',
		backgroundImage: 'linear-gradient(335deg, #b00 23px, transparent 23px), linear-gradient(155deg, #d00 23px, transparent 23px), linear-gradient(335deg, #b00 23px, transparent 23px), linear-gradient(155deg, #d00 23px, transparent 23px)',
		backgroundSize: '58px 58px',
		backgroundPosition: '0px 2px, 4px 35px, 29px 31px, 34px 6px',
		color: 'white'
	}
})


words.Challenge = [

	{
		'Back-Words': 'back-words'
	},

	{
		'Hidden Vowels': 'hide-vowels'
	},

	{
		'Clipped Words': ["ad | advertisement", "alum | alumni", "amp | ampere", "auto | automobile", "bike | bicycle", "biz | business", "bra | brassiere", "bro | brother", "burger | hamburger", "cafe | cafeteria", "caps | capitals", "champ | champion", "chem | chemistry", "co-op | cooperative", "coed | coeducational student", "con | convict", "condo | condominium", "coon | raccoon", "copter | helicopter", "cuke | cucumber", "deli | delicatessen", "demo | demonstration", "disco | discotheque", "doc | doctor", "dorm | dormitory", "exam | examination", "fan | fanatic", "fax | facsimile", "flu | influenza", "fridge | refrigerator", "gas | gasoline", "gator | alligator", "grad | graduate", "gym | gymnasium", "hippo | hippopotamus", "hood | neighborhood", "id | identity", "info | information", "intro | introduction", "lab | laboratory", "limo | limousine", "lube | lubricate", "lunch | luncheon", "mart | market", "math | mathematics", "max | maximum", "mayo | mayonnaise", "memo | memorandum", "mic | microphone", "min | minimum", "miss | mistress", "mod | modern", "mum | chrysanthemum", "pants | pantaloons", "path | pathway", "pen | penitentiary", "perk | percolate", "perm | permanent", "phone | telephone", "photo | photograph", "plane | airplane", "pop | popular", "pro | professional", "prof | professor", "prom | promenade", "pub | public house", "quake | earthquake", "ref | referee", "rehab | rehabilitate", "rep | reputation", "rev | revolution", "rhino | rhinoceros", "sax | saxophone", "sitcom | situation comedy", "specs | specifications", "specs | spectacles", "stats | statistics", "stereo | stereophonic", "sub | submarine", "tails | coattails", "taxi | taxicab", "teen | teenager", "temp | temporary", "tie | necktie", "trig | trigonometry", "tux | tuxedo", "typo | typographical error", "ump | umpire", "vet | veteran", "vet | veterinarian", "zoo | zoological garden"]
	},

	{
		'Numbers': {
			glyphs: '0123456789',
			min: 6,
			max: 8
		}
	},

	{
		'L33t': 'leet'
	},

	{
		'Hexadecimal': {
			glyphs: '0123456789ABCDEF',
			min: 6,
			max: 8
		}
	},

/*
{
		'Symbols': {
     glyphs: '$@&?%#=*!/+©®~',
     min: 6,
     max: 8
   }
},
*/


	{
		'Dingbats': {
			glyphs: [
				'\u27A4',
				'\u273F',
				'\u2730',
				'\u27BF',
				'\u2728',
				'\u270B',
				'\u2707',
				'\u274C',
				'\u2712',
				'\u2766'
			].join(''),
			min: 5,
			max: 5
		}
	},

	//{ Arithmetic: 'math' },

	//{ Jumbled: 'jumbled' },

	{
		'L33t2': 'leet2'
	},


	{
		'Sounds like...': [

			"ail | ale", "air | heir", "aisle | isle", "all | awl", "allowed | aloud", "altar | alter", "arc | ark", "ate | eight", "aural | oral", "away | aweigh", "oar | ore", "aye | eye", "addition | edition", "aid | aide", "alter | altar", "ant | aunt", "ascent | assent",

			"bail | bale", "bald | bawled", "ball | bawl", "band | banned", "bard | barred", "bare | bear", "baron | barren", "base | bass", "bazaar | bizarre", "beach | beech", "beat | beet", "beau | bow", "beer | bier", "bell | belle", "berry | bury", "berth | birth", "bight | bite", "billed | build", "blew | blue", "boar | bore", "board | bored", "boarder | border", "bold | bowled", "boos | booze", "born | borne", "boy | buoy", "brae | bray", "braid | brayed", "braise | brays", "brake | break", "bread | bred", "brews | bruise", "bridal | bridle", "but | butt", "buy | bye", "buyer | byre", "borough | burrow",

			"call | caul", "cast | caste", "caster | castor", "core | corps", "cede | seed", "cell | sell", "cereal | serial", "cheap | cheep",
			"chord | cord",
			"climb | clime",
			"coarse | course",
			"coo | coup",
			"crews | cruise",
			"cue | queue",
			"canvas | canvass", "capital | capitol", "carrot | karat", "ceiling | sealing", "cellar | seller", "cent | scent | sent", "cents | sense", "cereal | serial", "clothes | close", "colonel | kernel", "compliment | complement", "council | counsel", "course | coarse", "creek | creak", "currant | current",

			"days | daze", "dear | deer", "discreet | discrete", "doe | dough", "dual | duel", "descent | dissent", "desert | dessert", "deviser | divisor", "dew | due", "die | dye",

			"earn | urn", "ewe | you", "eye | aye",

			"faint | feint", "feat | feet", "flea | flee", "flour | flower", "for | four", "fur | fir", "fair | fare", "faun | fawn", "faze | phase", "few | phew", "fie | phi", "find | fined", "fir | fur", "flair | flare", "flex | flecks", "flew | flu | flue", "foaled | fold", "for | fore | four", "forth | fourth", "foul | fowl", "friar | fryer",

			"gorilla | guerrilla", "grown | groan",

			"gait | gate", "gamble | gambol", "gays | gaze", "gild | guild", "gilt | guilt", "giro | gyro", "gneiss | nice", "grate | great", "greave | grieve", "grays | graze", "grisly | grizzly", "guessed | guest",


			"hanger | hangar", "hare | hair", "heard | herd", "heel | heal", "here | hear", "hole | whole", "horse | hoarse", "hail | hale", "hall | haul", "hart | heart", "hoar | whore", "hay | hey", "hew | hue", "higher | hire", "him | hymn", "hoard | horde", "holey | holy | wholly",

			"idle | idol", "incite | insight",
			"jeans | genes", "jewel | joule",
			"knead | need", "knight | night",

			"knave | nave", "knew | new", "knit | nit", "knob | nob", "knock | nock", "knot | not", "know | no", "knows | nose",

			"leased | least", "lessen | lesson", "loan | lone", "loot | lute",
			"maid | made", "male | mail", "mall | maul", "mane | main", "manor | manner", "mantle | mantel", "medal | metal", "meet | meat", "miner | minor", "moose | mousse", "morning | mourning", "muscle | mussel",
			"naval | navel",
			"one | won", "our | hour",
			"pair | pare | pear", "pale | pail", "palette | pallet | palate", "patience | patients", "pause | paws", "peak | peek", "pedal | peddle", "piece | peace", "presence | presents", "principle | principal", "profit | prophet",
			"rain | reign | rein", "rays | raise", "right | write", "road | rode",
			"sail | sale", "scene | seen", "seam | seem", "see | sea", "sensor | censor", "sheer | shear", "site | sight | cite", "slay | sleigh", "so | sew", "sole | soul", "stair | stare", "steal | steel", "sun | son", "sweet | suite", "symbol | cymbal",
			"tail | tale", "their | there", "threw | through", "throne | thrown", "too | two", "toe | tow",
			"vane | vain | vein", "vile | vial",
			"wail | whale", "waist | waste", "wait | weight", "wave | waive", "wear | where | ware", "weather | whether", "week | weak", "which | witch", "whine | wine", "wrote | rote",

			"yore | your","yoke | yolk"

/*



laager | lager
lac | lack
lade | laid
lain | lane
lam | lamb
laps | lapse
larva | lava
lase | laze
law | lore
lay | ley
lea | lee
leach | leech
lead | led
leak | leek
lean | lien
lessen | lesson
levee | levy
liar | lyre
licence | license
licker | liquor
lie | lye
lieu | loo
links | lynx
lo | low
load | lode
loan | lone
locks | lox
loop | loupe
loot | lute
made | maid
mail | male
main | mane
maize | maze
mall | maul
manna | manner
mantel | mantle
mare | mayor
mark | marque
marshal | martial
marten | martin
mask | masque
maw | more
me | mi
mean | mien
meat | meet | mete
medal | meddle
metal | mettle
meter | metre
might | mite
miner | minor | mynah
mind | mined
missed | mist
moat | mote
mode | mowed
moor | more
moose | mousse
morning | mourning
muscle | mussel
naval | navel
nay | neigh
nigh | nye
none | nun
od | odd
ode | owed
oh | owe
one | won
packed | pact
packs | pax
pail | pale
pain | pane
pair | pare | pear
palate | palette | pallet
pascal | paschal
paten | patten | pattern
pause | paws | pores | pours
pawn | porn
pea | pee
peace | piece
peak | peek | peke | pique
peal | peel
pearl | purl
pedal | peddle
peer | pier
pi | pie
pica | pika
place | plaice
plain | plane
pleas | please
plum | plumb
pole | poll
poof | pouffe
practice | practise
praise | prays | preys
principal | principle
profit | prophet
quarts | quartz
quean | queen
rain | reign | rein
raise | rays | raze
rap | wrap
raw | roar
read | reed
read | red
real | reel
reek | wreak
rest | wrest
retch | wretch
review | revue
rheum | room
right | rite | wright | write
ring | wring
road | rode
roe | row
role | roll
roo | roux | rue
rood | rude
root | route
rose | rows
rota | rotor
rote | wrote
rough | ruff
rouse | rows
rung | wrung
rye | wry
saver | savour
spade | spayed
sale | sail
sane | seine
satire | satyr
sauce | source
saw | soar | sore
scene | seen
scull | skull
sea | see
seam | seem
sear | seer | sere
seas | sees | seize
sew | so | sow
shake | sheikh
shear | sheer
shoe | shoo
sic | sick
side | sighed
sign | sine
sink | synch
slay | sleigh
sloe | slow
sole | soul
some | sum
son | sun
sort | sought
spa | spar
staid | stayed
stair | stare
stake | steak
stalk | stork
stationary | stationery
steal | steel
stile | style
storey | story
straight | strait
sweet | suite
swat | swot
tacks | tax
tale | tail
talk | torque
tare | tear
taught | taut | tort
te | tea | tee
team | teem
tear | tier
teas | tease
terce | terse
tern | turn
there | their | they're
threw | through
throes | throws
throne | thrown
thyme | time
tic | tick
tide | tied
tire | tyre
to | too | two
toad | toed | towed
told | tolled
tole | toll
ton | tun
tor | tore
tough | tuff
troop | troupe
tuba | tuber
vain | vane | vein
vale | veil
vial | vile
wail | wale | whale
wain | wane
waist | waste
wait | weight
waive | wave
wall | waul
war | wore
ware | wear | where
warn | worn
wart | wort
watt | what
wax | whacks
way | weigh | whey
we | wee | whee
weak | week
we'd | weed
weal | we'll | wheel
wean | ween
weather | whether
weaver | weever
weir | we're
were | whirr
wet | whet
wheald | wheeled
which | witch
whig | wig
while | wile
whine | wine
whirl | whorl
whirled | world
whit | wit
white | wight
who's | whose
woe | whoa
wood | would
*/


		]
	},


	{
		'Zeros and Ones': {
			glyphs: '01',
			min: 6,
			max: 8
		}
	},


	{
		'Hidden List': 'hide-list'
	},

]
