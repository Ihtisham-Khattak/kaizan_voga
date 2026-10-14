# Kaizen Yoga — Delivery plan

Board: Todoist project **Kaizen Yoga App Build**. Columns: Backlog → In Progress → In Review → Done, plus **Phase 2 – Functionality**.

## Phase 1 — Wrap up the UI (TODAY, 2026-10-14)

Goal: every screen exists, is reachable, works with the mock data, in light + dark, with the glass/character polish.
Definition of done per card: builds (`tsc`, `eslint`, Android bundle) · screenshot-checked in light + dark · EN strings (+UR draft) · a11y labels · card moved to **In Review** with a note.

| Block | Cards | What the user gets |
|---|---|---|
| 1 | P-07 P-08 P-09 P-10 P-11 | Finish personalization: voice/music, age gate, safety, reminders pre-prompt, plan reveal |
| 2 | A-07 A-08 A-01 A-02 A-03 A-04 A-05 A-06 | Account gate, sign up, sign in, forgot/verify/reset password, guest mode (mock) |
| 3 | T-01 H-01 X-01 X-02 X-03 | Practice sheet, Home, Explore, Search/filters, collections |
| 4 | X-04 X-05 X-06 | Pose detail, routine detail, program detail + custom routine |
| 5 | SE-01 SE-02 SE-03 SE-04 B-01 B-02 | Session setup, active player, discomfort/pause, completion, breathing hub + player |
| 6 | PR-01 … PR-06 | Progress: journey, calendar, mood insights, reflection, achievements, history |
| 7 | PF-01 … PF-10 | Profile + all settings, support resources, replay intro |
| 8 | M-01 … M-05 | Premium/paywall, checkout (mock), manage plan, gating, hardship |
| 9 | ST-01 ST-02 ST-03 QA-01 QA-02 QA-03 | Skeletons, empty/error/offline states, QA pass, flow test, tone audit |

Cut-lines if time runs short (in order): PR-06 history detail, PF-06 health/devices, X-03 collections, M-05 hardship. Nothing on the critical path (story → onboarding → account → first session → completion → Home) is cut.

## Phase 2 — Functionality (from 2026-10-15)

All mock layers are already isolated (`src/data/repo.ts`, `src/store/*`, auth/subscription stores) so each item below replaces a mock, not a screen.

| Day | Cards | Outcome |
|---|---|---|
| Day 2 (10-15) | FN-01 backend foundation · FN-02 real auth · FN-03 content API · FN-04 user data sync | Real accounts and data |
| Day 3 (10-16) | FN-05 session engine hardening · FN-09 progress/achievements/plan engine | Sessions and progress behave for real |
| Day 4 (10-17) | FN-06 audio · FN-07 reminders · FN-08 subscriptions | Voice/music, notifications, payments |
| After | FN-10 offline · FN-11 health sync · FN-12 privacy/compliance · FN-13 localization · FN-14 test automation · FN-15 release · FN-16 character animation · FN-17 cast to TV | Hardening + launch |

### Decisions / inputs needed from the product owner before Day 2
1. Backend provider: **Supabase** (recommended: Postgres + Auth + Storage, row-level security) or Firebase.
2. Apple Developer + Google Play accounts (needed for Sign in with Apple, IAP, push, TestFlight).
3. RevenueCat account (or direct StoreKit/Play Billing).
4. Voice guidance: recorded voice packs (female/male) or text-to-speech for v1.
5. Real helpline numbers per country, final Terms/Privacy text, reviewer names for poses.
6. Character art: continue with the in-house semi-realistic set, or provide layered/Rive assets (see card C-09).

## Working agreement
- A card moves to **In Progress** when I start it and **In Review** when it is built and verified; **Done** only after the product owner signs off.
- Each batch ends with a short summary: what was built, what was verified, what is still a placeholder.
