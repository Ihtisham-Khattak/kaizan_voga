# Known limitations (card QA-01)

Status on 2026-10-18. This is a UI prototype on local mock data; the items below are what is *not* done or *not verified yet*.

## Not built (mock or placeholder)

| Area | State | Card |
|---|---|---|
| Accounts | Sign up, sign in, password recovery and guest mode work locally only; no server | FN-02 |
| Content | 66 poses, 27 routines, 8 programs bundled in the app; no content API | FN-03 |
| Data sync | Everything stays on the device; no backup or sync between devices | FN-04 |
| Payments | Mock paywall and checkout; no real purchase; placeholder prices | FN-08 |
| Reminders | Settings exist; no real scheduled notifications | FN-07 |
| Voice guidance | The phone's text-to-speech reads each pose; no recorded voice packs | FN-06 |
| Sound | Rain, forest, piano, music and chime are synthesised placeholders | FN-06 |
| Downloads | UI only; no offline files | FN-10 |
| Health sync, cast to TV | UI toggles only | FN-11, FN-17 |

## Content that needs a person

- **Pose review:** every pose shows a placeholder reviewer. A qualified teacher must approve steps, cautions and modifications (PS-09). **Blocks release.**
- **Prenatal Yoga:** needs a professional's review of the wording.
- **Helplines, Terms and Privacy:** placeholders until real, verified text exists for each country.
- **Urdu:** a draft; needs a native speaker's review. Layout flips correctly, but wording and the Nastaliq line spacing should be checked.
- **Pictures:** poses, programs and styles use illustrated icons; real pictures are pending (UI-10). Pose videos are planned (AN cards).

## Not verified on a device

- Launcher icon, adaptive icon and splash screen from the new logo (generated and checked as images only).
- The new **sound in sessions** (ambience, music, voice, chime) and the **male / female voice difference**: checked in the browser, depends on the voices installed on the phone.
- **Pose video player** (`expo-video`): verified in the browser with a test clip; the native module needs a build to test on the phone.
- TalkBack and VoiceOver walkthroughs, real iOS Reduce Transparency, 60 fps on a low-end Android, cold-start time and memory over a 20-minute session (PERF-04).
- The real RTL flip on a device (the browser preview uses a forced direction).

## Known technical gaps

- **Android blur:** frosted glass falls back to solid fills on Android (needs `BlurTargetView`).
- **Storage:** user data is saved as one JSON blob per store in AsyncStorage and session history grows without limit (PERF-02, PERF-03).
- **Dependencies:** a few Expo packages are a patch release behind (`npx expo install --check`).
- **Push:** no `google-services.json` yet.
- **Licence:** the root `LICENSE` is still the Expo template's text.
- **Web preview** is a development convenience: no haptics, speech voices come from the browser, and blur and fonts can differ from the phone.

## Checks that pass today

`tsc`, `eslint`, `npm run validate:data`, `npm run audit:copy` (0 wording issues), English / Urdu key parity, and no raw hex colours outside `src/theme`.
