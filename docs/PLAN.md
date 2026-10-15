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

## Backlog completion plan (2026-10-15) — the last 11 UI cards

Order is by dependency, not by number. Each card goes In Progress → In Review with the same verification as before (tsc, eslint, i18n key check, Android export, web light/Night/Urdu/130% screenshots). Done only after sign-off.

| Step | Cards | Why this order | Output |
|---|---|---|---|
| A | **M-04** gating foundation | Everything else in Premium calls it | `useEntitlement(feature)`, `PremiumBadge`, `LockedSheet`, trial banner; never-locked rule (safety info, breathing basics, SOS quick-relief, starter session) |
| B | **M-01** paywall | Entry point for A | `premium/index`: Free vs Premium table, plan cards, trial toggle, footer links |
| C | **M-02** mock checkout | Needs B | Checkout sheet, loading, success (Kai + confetti), failure, cancelled; updates the subscription store |
| D | **M-03** manage subscription | Needs C's states | `settings/subscription`: free / trial / active / cancelled / expired, switch plan, gentle cancel |
| E | **M-05** hardship request | Small, linked from B | `premium/help-affording`: form + thank-you |
| F | **ST-03** offline / error / coming-soon | Other states reuse it | Offline banner (expo-network), full-screen + inline error, reusable Coming-soon |
| G | **ST-02** empty states | Uses F's components | Kai empty states for the 8 listed cases |
| H | **ST-01** skeletons | Last visual layer | Skeleton variants per screen + Reduce Motion static tint + dev toggle |
| I | **QA-03** content & tone audit | Scriptable, fast | Banned-claim scan over EN copy, fixes, report |
| J | **QA-02** flow acceptance | Needs everything built | Automated puppeteer walk of the funnel + dead-end crawler |
| K | **QA-01** QA pass | Final | Widths, Night, RTL, 130%, Reduce Motion run; `docs/known-limitations.md` |

Risks: native-only checks (TalkBack/VoiceOver, 60 fps on low-end Android, real RTL flip, iOS Reduce Transparency) can't be done from this machine; they go into `known-limitations.md` as "needs a device" rather than being claimed as passed. The Urdu copy still needs a native-speaker review (QA-03).

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
