# Release checklist (card FN-15)

Where the project stands: a UI prototype that builds a **debug-signed** Android APK for testing (`npm run apk`). It cannot be uploaded to Google Play or the App Store yet. This is what has to happen, in order.

## 0. Rules already in place

- **Version numbers:** bump `version` (minor) and `android.versionCode` (+1) in `app.json` before every build, then `npm run apk` (names the file `KaizenYoga-<version>.apk`). Never reuse a number.
- **Checks before any build:** `npm run typecheck`, `npm run lint`, `npm test`, `npm run validate:data`, `npm run audit:copy`, `npm run audit:i18n`.
- **Secrets:** never in the app or git. `.env*.local`, `*.jks`, `*.p8`, `*.p12`, `*.key` and `*.mobileprovision` are git-ignored.

## 1. Accounts (you)

| What | Needed for |
|---|---|
| Google Play Console developer account | Android release |
| Apple Developer Program | iOS release, Sign in with Apple |
| Expo account (optional) | EAS cloud builds; local builds work without it |

## 2. Signing

- **Android:** create a release keystore (`keytool -genkeypair -v -storetype PKCS12 -keystore kaizen-release.jks -alias kaizen -keyalg RSA -keysize 2048 -validity 10000`), keep it **outside the repo** and back it up (losing it means you cannot update the app). Use Play App Signing so Google holds the final key. Today's builds use the debug key and must never be uploaded.
- **iOS:** let EAS manage certificates, or create them in the Apple developer portal.

## 3. Build

- Local test APK: `npm run apk`.
- Store build (when accounts exist): `eas build --platform android --profile production` (an `.aab`) and the iOS equivalent. `eas.json` has `development`, `preview` (APK) and `production` profiles.
- Check the built file: package name `com.kaizenyoga.app`, the version, and that it is not debug-signed.

## 4. Store listing

- App name, short and full description (calm, plain, **no medical claims**), category Health & Fitness.
- Screenshots (phone), the icon from `assets/brand`, a feature graphic.
- **Privacy policy URL** and **Terms URL**: placeholders in the app today; real, hosted pages are required (card FN-12).
- **Google Play Data safety form** and **Apple privacy labels:** today the app stores everything on the device and collects nothing; update when the backend, analytics or crash reporting are added.
- Age rating: designed for adults (18+).
- Health content disclaimer is shown in the app (safety screen, Settings).

## 5. Before the first public build

- Real helpline numbers per country, final Terms and Privacy text (placeholders now).
- A qualified teacher's review of every pose and the Prenatal wording (PS-09). **Blocks release.**
- Native Urdu review of all copy.
- Real voice guidance decision (FN-19) and real sound (the loops are placeholders).
- Replace the Expo template `LICENSE` text with your own.
- A device pass: TalkBack, low-end Android performance, notification permission and scheduled reminders, launcher icon and splash.

## 6. Updates after launch

`runtimeVersion` follows the app version, so over-the-air JavaScript updates (EAS Update, when set up) only reach builds with a matching version.
