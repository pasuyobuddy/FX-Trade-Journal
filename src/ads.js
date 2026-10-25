// Ads for the Android app. Does nothing in a normal browser.
(function () {
  var C = window.Capacitor;
  if (!C || !C.isNativePlatform || !C.isNativePlatform()) return;
  var cfg = window.ADS_CONFIG || {};
  var AdMob = C.registerPlugin('AdMob');
  var lastInterstitial = 0, canAds = false;

  function bannerSpace(px) {
    document.body.style.paddingBottom = px ? px + 'px' : '';
  }

  async function start() {
    try {
      await AdMob.initialize({ initializeForTesting: !!cfg.testing });
      // Google's consent form (required for users in the EU/UK)
      var info = await AdMob.requestConsentInfo();
      if (info.isConsentFormAvailable && info.status === 'REQUIRED') {
        info = await AdMob.showConsentForm();
      }
      canAds = info.canRequestAds !== false;
      if (!canAds) return;
      AdMob.addListener('bannerAdSizeChanged', function (s) { bannerSpace((s && s.height) || 60); });
      await AdMob.showBanner({
        adId: cfg.bannerId, adSize: 'ADAPTIVE_BANNER', position: 'BOTTOM_CENTER',
        margin: 0, isTesting: !!cfg.testing
      });
      bannerSpace(60);
      prepare();
    } catch (e) { console.warn('Ads unavailable', e); }
  }

  function prepare() {
    AdMob.prepareInterstitial({ adId: cfg.interstitialId, isTesting: !!cfg.testing })
      .catch(function () {});
  }

  // Full-screen ad after an import or sync, not more often than configured
  window.addEventListener('journal:loaded', function () {
    if (!canAds) return;
    var gap = (cfg.interstitialEveryMinutes || 3) * 60000;
    if (Date.now() - lastInterstitial < gap) return;
    lastInterstitial = Date.now();
    setTimeout(function () {
      AdMob.showInterstitial().then(prepare).catch(prepare);
    }, 1200);
  });

  // Let people change their ad consent later (Play / EU requirement)
  window.openAdPrivacy = function () { AdMob.showPrivacyOptionsForm().catch(function () {}); };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
