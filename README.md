# FX Trade Journal

Forex trading journal for Android. Import MT5 history reports or sync through MetaApi, and get win rate, profit factor, drawdown, streaks and per-pair stats. Shows Google AdMob ads.

- `src/journal.html` is the whole app (dashboard, MT5 report parser, MetaApi sync).
- `src/ads.js` and `src/ads-config.js` add the AdMob banner, interstitial and EU consent form in the Android app.
- `android/` is the Capacitor Android project.
- `docs/` is the web version, served by GitHub Pages, along with `privacy.html`.
- `store/` holds the Play Store listing text, privacy policy and 512px icon.

## Builds

Every push to `main` builds the app on GitHub (Actions tab → "Build Android app"). Each run gives you:
- **test-apk**: install it on your phone to try the app (it shows Google test ads).
- **play-store-bundle**: the `.aab` file you upload to Play Console. It is only signed after you add the secrets below.

To build locally instead: install Android Studio, then `npm ci && npm run sync && npx cap open android`.

## Going live

1. **AdMob** (admob.google.com): add an Android app, then create a *Banner* and an *Interstitial* ad unit.
   - Put the two ad unit ids in `src/ads-config.js` and set `testing: false`.
   - Add the AdMob **app id** (`ca-app-pub-…~…`) as the GitHub secret `ADMOB_APP_ID`.
   - In AdMob → Privacy & messaging, create a GDPR message, so the consent form shows in the EU/UK.
2. **Upload key.** Create it once and keep a backup, because you can't update the app without it:
   ```
   keytool -genkeypair -v -keystore upload.jks -alias upload -keyalg RSA -keysize 2048 -validity 10000
   base64 -w0 upload.jks   # copy the output
   ```
   Add these GitHub secrets: `ANDROID_KEYSTORE_BASE64` (the base64 text), `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS` (`upload`) and `ANDROID_KEY_PASSWORD`.
3. **App id.** `com.toni.fxjournal` is in `capacitor.config.json` and `android/app/build.gradle`. Change it now if you want a different one. It can't change after the first upload.
4. **Play Console** (play.google.com/console, $25 one-time):
   - Create the app, fill in the listing from `store/listing.md`, and use `https://<you>.github.io/forex-journal/privacy.html` as the privacy policy (put your support email in it first).
   - Answer the Data safety and Ads questions as described in `store/listing.md`.
   - New personal developer accounts must first run a **closed test with at least 12 testers for 14 days** before they can publish to everyone. Upload the `.aab` to the closed testing track first.
5. Upload the `.aab` from the latest Actions run. Each run raises the version code automatically.

The app name and icon must not use "MT5", "MetaTrader" or the MetaQuotes logo.
