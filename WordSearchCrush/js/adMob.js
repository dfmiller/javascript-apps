	//word search crush
	window.admob_settings = {
		banner: 'ca-app-pub-3673671167947167/6200175257',
		interstitial: 'ca-app-pub-3673671167947167/1630374858',
		videos: 'ca-app-pub-3673671167947167/4005096606',
		reward: 'ca-app-pub-3673671167947167/7437284582'
	}

	var testDevices = ['65509ff80e757788']

	function initAdMob() {
		if (window.admob) {
			//prompt('', device.uuid)

			if (window.admob_settings.banner) {
				admob.banner.config({
					id: window.admob_settings.banner,
					bannerAtTop: true,
					overlap: false,
					isTesting: testDevices.indexOf(device.uuid) !== -1, // receiving test ad
					forFamily: false,
					size: 'SMART_BANNER'
				})
				admob.banner.prepare()
			}

			if (window.admob_settings.interstitial) {
				var id = (window.admob_settings.videos && window.localStorage.getItem('use_sounds') == 'on') ? window.admob_settings.videos : window.admob_settings.interstitial

				admob.interstitial.config({
					id: id,
					autoShow: false,
					isTesting: testDevices.indexOf(device.uuid) !== -1, // receiving test ad
					forFamily: false,
				})

				admob.interstitial.prepare()
				document.addEventListener('admob.interstitial.events.CLOSE', function() {
					var id = (window.admob_settings.videos && window.localStorage.getItem('use_sounds') == 'on') ? window.admob_settings.videos : window.admob_settings.interstitial
					if (admob.interstitial._config.id != id) {
						admob.interstitial.config({
							id: id,
							autoShow: false,
							isTesting: testDevices.indexOf(device.uuid) !== -1, // receiving test ad
							forFamily: false,
						})
					}
					admob.interstitial.prepare() //get the next one ready only after the current one is closed
				})
			}

			if (window.admob_settings.reward) {
				admob.rewardvideo.config({
					id: window.admob_settings.reward,
					autoShow: false,
					isTesting: testDevices.indexOf(device.uuid) !== -1, // receiving test ad
					forFamily: false,
				})
				admob.rewardvideo.prepare()
				document.addEventListener('admob.rewardvideo.events.CLOSE', function() {
					admob.rewardvideo.prepare() //get the next one ready only after the current one is closed
				})
				document.addEventListener('admob.rewardvideo.events.REWARD', function() {
					giveReward()
				})
			}

			console.log('admob plugin ready')
		} else {
			console.log('admob plugin NOT ready')
		}
	}

	//display the banner
	function showBannerFunc(){
		admob.banner.show()
		console.log('showBannerView')
	}

	//display the interstitial
	function showInterstitialFunc(videos) {
		try {
			console.log('showInterstitialAd')
			admob.interstitial.show()
		} catch(e) {}
	}

	//display the reward video
	function showRewardFunc() {
		try {
			console.log('showRewardAd')
			givingReward = true
			admob.rewardvideo.show()
		} catch(e) {}
	}


    if (new Date().getDay() || typeof sundayOff == 'undefined') { //skip if Sunday
	    document.addEventListener('deviceready', function() {
		    document.body.ononline = function(event) {
			    initAdMob()
			    showBannerFunc()
		    }
		    initAdMob()
		    showBannerFunc()
	    }, false)
    }


