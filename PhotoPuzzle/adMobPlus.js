
//Photo Puzzle

//cordova plugins remove cordova-plugin-admob-free
//cordova plugin add admob-plus-cordova --variable APP_ID_ANDROID=ca-app-pub-3673671167947167~5355137142
//cordova plugin add cordova-plugin-androidx
//cordova plugin add cordova-plugin-androidx-adapter

var testDevices = ['706b6c3a2c75ea59']

window.admob_settings = {
	banner: 'ca-app-pub-3673671167947167/4773092334',
	interstitial: 'ca-app-pub-3673671167947167/1135856388',
	videos: 'ca-app-pub-3673671167947167/3934924709',
}

//*****************************

var banner
var interstitial

window.admob_tests = {
    banner: 'ca-app-pub-3940256099942544/6300978111',
    interstitial: 'ca-app-pub-3940256099942544/1033173712',
    videos: 'ca-app-pub-3940256099942544/8691691433',
    reward: 'ca-app-pub-3940256099942544/5224354917',
    rewarded_interstitial: 'ca-app-pub-3940256099942544/5354046379',
}

document.addEventListener('deviceready', async () => {
    //alert(device.uuid)

    if (new Date().getDay() || !window.admob_settings.sundayOff) { //skip if Sunday

        if (testDevices.includes(device.uuid)) {
            window.admob_settings = window.admob_tests; //COMMENT OUT FOR PRODUCTION
        }

        await admob.start();

        banner = new admob.BannerAd({
            adUnitId: window.admob_settings.banner,
            position: 'top',
            npa: '1',
        });

        await banner.show();

        interstitial = new admob.InterstitialAd({
            adUnitId: (
                (window.admob_settings.videos && window.localStorage.getItem('use_sounds') != 0)
                ? window.admob_settings.videos
                : window.admob_settings.interstitial
            ),
            npa: '1',
        });

        await interstitial.load();

        if (window.admob_settings.reward) {
            rewarded = new admob.RewardedAd({
                adUnitId: window.admob_settings.reward
            });

            await rewarded.load();
        }
    }

}, false)


document.addEventListener('admob.interstitial.dismiss', async () => {
  await interstitial.load()
})

document.addEventListener('admob.rewarded.dismiss', async () => {
  await rewarded.load()
})

document.addEventListener('admob.rewarded.reward', async () => {
    try {
        giveReward()
    } catch(e) {}
})

function initAdMob() {}
function showBannerFunc() {}
function showInterstitialFunc(use_sounds) {
    try {
        interstitial.show()
    } catch(e) {}
}

function showRewardFunc() {
    try {
        rewarded.show()
    } catch(e) {}
}
