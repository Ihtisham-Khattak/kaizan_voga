# Kaizen Yoga — UI/UX Build Prompt

> Copy everything below the line into your AI coding agent. It builds the **UI only** (screens, navigation, animations, local mock data). Making it fully functional (backend, auth, payments, real notifications) is a later phase.

---

## ROLE & GOAL

You are a senior mobile product designer and front-end engineer. Build a **stunning, calm, beginner-friendly UI prototype** for a yoga & wellness mobile app called **Kaizen Yoga**.

"Kaizen" means *continuous small improvement* — the whole product is built around the idea that **small, gentle daily steps** lead to calmer days. Every screen, word and animation should feel warm, unhurried, safe and encouraging — never pushy, guilt-based or "hardcore fitness".

**Scope of this phase:** high-fidelity, clickable UI with real navigation, smooth animations and local sample data. No real backend, auth, payments, AI posture detection or analytics yet. Keep content data separate from screen layouts so a backend can be plugged in later.

## TECH STACK

- **React Native + Expo (latest SDK) + TypeScript**, Expo Router for navigation.
- **React Native Reanimated** + **Moti** for animations, **react-native-svg** for characters/illustrations, **Lottie** optional for the mascot.
- State: **Zustand**, persisted with AsyncStorage (onboarding done, preferences, favorites, history, mood logs).
- Local mock data in `/src/data/*.ts` (exercises, routines, programs, achievements, characters, onboarding story).
- Folder structure: `/app` (routes), `/src/components`, `/src/theme`, `/src/data`, `/src/store`, `/src/characters`, `/src/hooks`.
- Must run on iOS and Android phones (375–430 px width), respect safe areas, support light **and** dark mode, and support **English + Urdu (RTL)** via an i18n layer (strings in `/src/i18n/en.ts` and `/src/i18n/ur.ts`; fill Urdu with placeholders if needed but the layout must flip correctly).

## DESIGN SYSTEM

**Mood:** white space you can breathe in, green that feels like being outside, and frosted glass floating over soft colour. Organic shapes, rounded corners, gentle motion. Use the installed glassmorphism library for all glass surfaces.

**Colors** — put these in `/src/theme/colors.ts` as tokens with Light and Night values; never hard-code hex in components.
| Token | Light | Night | Use |
|---|---|---|---|
| `bg` | #FFFFFF | #0B1712 | Main background |
| `bgMist` | #F2F8F4 | #0F1F18 | Alternate sections, list rows, Reduce-Transparency fallback |
| `auroraMint` | #CDEED9 | #14382A | Blurred blob behind glass |
| `auroraSky` | #D3ECF6 | #12303D | Second blurred blob behind glass |
| `glass` | rgba(255,255,255,0.62) | rgba(22,40,31,0.60) | Standard glass card fill |
| `glassStrong` | rgba(255,255,255,0.84) | rgba(18,34,27,0.82) | Glass behind long text, forms, tab bar, sheets |
| `glassBorder` | rgba(255,255,255,0.85) | rgba(255,255,255,0.12) | 1px edge on every glass panel |
| `forest` | #0F3D2E | #E8F2EC | Headings, logo |
| `ink` | #14261D | #E8F2EC | Body text |
| `muted` | #5A6B62 | #9DB0A5 | Secondary text |
| `primary` | #1B7A4B | #4FD18B | Buttons, selected tab, links |
| `onPrimary` | #FFFFFF | #0B1712 | Text on primary |
| `leaf` | #2FA866 | #4FD18B | Icons, progress rings, breathing circle (not body text in light) |
| `mint` | #E6F4EA | #173426 | Chips, selected states (text on it: forest) |
| `sky` / `skySoft` | #2E6F8E / #DCEEF5 | #7CC4DE / #15303B | Breathing, anxiety relief, inhale cue |
| `lavender` / `lavenderSoft` | #6A55C2 / #ECE8FA | #B9AEF0 / #231F38 | Sleep, wind-down, evening Home tint |
| `sunrise` / `sunriseSoft` / `sunriseInk` | #F2A65A / #FDEBD9 / #8A4B12 | #F5B678 / #33251A / #F5B678 | Achievements and celebration only |
| `hairline` | #E1EBE5 | #22342B | Dividers, input borders |
| `danger` | #C2453D | #F08A80 | Safety messages only, never for missed days |

All text pairs pass WCAG AA, including text on glass.

**Glassmorphism rules:**
- Every glass screen has 2–3 large soft blobs of `auroraMint` and `auroraSky` (blur ~60, drifting slowly) on `bg`; evening screens swap one blob for `lavenderSoft`. Glass on plain white just looks grey.
- Glass panel: fill `glass`, backdrop blur 16 (never above 20), 1px `glassBorder`, soft shadow (0 8 32, forest at 10% opacity), radius 28 for hero cards / 20 for standard cards.
- Use `glassStrong` for text-heavy panels, the tab bar and bottom sheets. Never put glass on glass; inner chips and rows use `mint` or `skySoft`.
- When the OS "Reduce Transparency" setting is on, render glass as solid `bgMist` and hide the blobs. When "Reduce Motion" is on, blobs stop moving.
- No glass on safety notices or anything in `danger`.

**Typography** (Google Fonts, load with `expo-font`): **Fraunces** for display moments only (28px+), **Plus Jakarta Sans** for all interface text, **Noto Nastaliq Urdu** for Urdu. Use pt on iOS and sp on Android with these numbers:
| Style | Font | Size / line height | Weight | Use |
|---|---|---|---|---|
| display | Fraunces | 34 / 40 | 600 | Onboarding titles, plan reveal, session complete |
| title1 | Fraunces | 28 / 34 | 600 | Home greeting, screen titles |
| timer | Fraunces | 64 / 68 | 500 | Countdown, breathing counter (tabular numbers) |
| title2 | Jakarta | 22 / 28 | 700 | Section headers |
| title3 | Jakarta | 20 / 26 | 600 | Card titles, pose names |
| bodyLarge | Jakarta | 17 / 26 | 400 | Default reading text, speech bubbles |
| body | Jakarta | 16 / 24 | 400 | Descriptions, settings rows (smallest paragraph size) |
| callout | Jakarta | 15 / 22 | 500 | Meta lines, chips |
| button | Jakarta | 17 / 22 | 600 | All buttons |
| footnote | Jakarta | 13 / 18 | 500 | Trust badges, tab labels |
| overline | Jakarta | 12 / 16, +0.8 letter-spacing, uppercase | 700 | Small section labels (smallest size in the app) |
| urduTitle / urduBody | Noto Nastaliq Urdu | 24 / 48 and 18 / 38 | 600 / 400 | Urdu text (Nastaliq needs ~2× line height) |
Support Dynamic Type / font scaling up to 130% without clipping.

**Shape & spacing:** spacing 4 / 8 / 12 / 16 / 24 / 32 / 48, 16 px side gutters, radii 12 (inputs) / 20 (cards) / 28 (hero glass, sheets, tab bar) / 999 (buttons, chips). Primary and centre Practice buttons get a soft green glow shadow.

**Motion:** slow and breathing — 300–600 ms ease-in-out, springs with low stiffness. A recurring **"breathing circle"** motif (expands 4 s, holds, contracts 6 s). Respect the OS "Reduce Motion" setting (fall back to fades).

**Accessibility:** WCAG AA contrast, minimum touch target 44×44, every icon button has an accessibility label, captions/text alternatives for any audio, never rely on color alone.

**Icons:** use **Phosphor Icons** (`phosphor-react-native`, MIT licence) in the "Regular" weight for UI icons, and "Duotone" for feature cards, recoloured with theme tokens (`primary` / `leaf` strokes, `mint` duotone fill, `sunrise` for highlights). Do not use any third-party or client-owned icon assets. For brand moments (tab bar Practice button, quick-relief tiles, achievement badges, goal cards) create an **original Kaizen icon set** as SVG components in `/src/icons`: 24×24 grid, 1.75 px rounded strokes, rounded caps and joins, a small leaf accent borrowed from Kai where it fits, and the same corner radius across every icon.

**Reusable components to build first:** Button (primary/secondary/ghost), Chip, Card, ExerciseCard, RoutineCard, ProgramCard, ProgressRing, BreathingCircle, SpeechBubble, CharacterAvatar, MoodPicker (5 faces), BottomSheet, Toast, EmptyState, SafetyNotice, SectionHeader, TabBar.

## CHARACTER BIBLE (CRITICAL — KEEP CHARACTERS IDENTICAL EVERYWHERE)

All characters share **one simple art style** and must look exactly the same on every screen they appear on. Build each as a **single reusable SVG component** with a few pose/expression props (`pose: 'stand' | 'sit' | 'wave' | 'yoga'`, `mood: 'stressed' | 'tired' | 'neutral' | 'calm' | 'happy'`). Never redraw a character per screen — always reuse the component.

**Shared style rules:**
- Flat vector, no outlines (or one consistent 2 px outline), soft rounded shapes.
- Same proportions for all humans: large round head (~1/3 of body height), simple pill-shaped body, short rounded limbs.
- Same face system for everyone: two dot eyes, small curved-line mouth, tiny blush circles. Expression changes only by eyebrows + mouth curve.
- Same skin-tone family palette (warm, varied but harmonious), no realistic detail, no fingers detail, no complex hair strands.
- Each character is identified by **one signature color + one accessory**, which never changes.

| Character | Role in story | Signature look | Issue |
|---|---|---|---|
| **Zara** | The main user / narrator — already uses Kaizen | Teal top, high bun hairstyle, small leaf earring | *Was* anxious, overthinking, always rushed |
| **Ali** | Friend 1 | Mustard hoodie, round glasses | Long desk hours, stiff neck & back, low energy |
| **Hina** | Friend 2 | Lavender scarf / dupatta | Poor sleep, racing thoughts at night |
| **Omar** | Friend 3 | Coral t-shirt, headphones around neck | Student stress, exam anxiety, can't focus |
| **Kai** | The Kaizen guide (mascot / "agent") | Small round sage-green lotus-leaf sprite with a soft glow, two dot eyes, floats gently | Narrates the 30-day journey, appears across the app for encouragement |

Kai is the app mascot and appears later on Home, session completion, achievements and empty states — always the same component.

## PART 1 — FIRST-LAUNCH STORY ONBOARDING (THE SIGNATURE EXPERIENCE)

Shown **only on first launch** (persist `hasSeenStory`). A **Skip** button is visible on every story scene (top-right) and jumps straight to the personalization questions. Progress dots at the bottom. Each scene animates in (characters slide/fade, speech bubbles pop in one after another with ~600 ms stagger). Swipe or tap "Next" to advance. Soft ambient background color shifts per scene (grey-ish and muted when struggling → warm and bright when calm).

**Scene 0 — Splash / Welcome**
App logo, Kai floats in and waves. Breathing circle pulses behind Kai.
Headline: "Small steps. Calmer days." Sub: "Welcome to Kaizen Yoga." Button: "Begin".

**Scene 1 — "Sound familiar?"** (muted, slightly desaturated palette)
Ali, Hina and Omar sit on a park bench / café table, each with a slightly stressed expression and a small icon above them (Ali: laptop + clock, Hina: moon + swirling lines, Omar: books + lightning).
Speech bubbles appear one by one:
- Ali: "Eight hours at the desk… my neck and back feel so stiff."
- Hina: "I lie in bed for hours. My mind just won't switch off."
- Omar: "Exams again. My chest feels tight and I can't focus."

**Scene 2 — "You're not alone"**
The three look at each other, expressions soften slightly.
- Hina: "Wait… you feel that too?"
- Ali: "I thought it was just me."
- Caption under scene: "Stress, stiffness and restless nights are more common than you think."

**Scene 3 — Zara arrives**
Zara walks in calm and smiling (mood: calm). Gentle warm light enters the scene.
- Zara: "I felt exactly like that a few months ago."
- Zara: "Then I started Kaizen Yoga — just 10 minutes a day. Small steps, no pressure."
- Omar: "Only 10 minutes?"
- Zara: "Breathing, gentle stretches, a wind-down at night. Let me show you."

**Scene 4 — Kai's 30-day journey** (Kai becomes the guide)
Kai floats to center; the three friends watch. An animated vertical timeline / path with 4 milestones lights up one by one; the friends' expressions improve step by step as each milestone lights.
- Week 1 — "Learn to breathe & move" · 5–10 minute beginner sessions
- Week 2 — "Find your rhythm" · gentle routines + reminders that fit your day
- Week 3 — "Notice the shift" · many people feel looser and calmer, with a wind-down routine for sleep
- Week 4 — "A habit that's yours" · a routine you can keep, at your own pace
Kai: "After one month of small steps, this is how many people describe it: lighter, calmer, more in control."
Small footnote: "Everyone's experience is different. Kaizen Yoga supports wellbeing; it isn't medical treatment."

**Scene 5 — Zara's story ("Before / Now")**
Split card with two Zara illustrations (same component, different mood): left `stressed`, right `calm`.
Title: "Zara's story"
- **Before:** "Racing thoughts, tight shoulders, skipping breakfast to rush to work, scrolling till 2 am."
- **Now:** "10 minutes of morning flow, a breathing break at lunch, and a wind-down routine that helps me fall asleep sooner. I feel more like myself."
Zara: "It didn't change overnight. It changed one small step at a time — that's Kaizen."
Label in small text: "Illustrated story."
Button: "Start my journey".

**Scene 6 — "What brings you here?"** (transition into personalization)
Ali, Hina, Omar and Zara stand together, happy. Selectable cards (multi-select), each with a tiny icon of the matching character:
Stress & anxious feelings · Stiff back/neck from sitting · Better sleep · Focus & energy · Flexibility · Balance · Just gentle movement.

**Then the personalization questions** (one per screen, large tap targets, Kai gives a short friendly reaction after each answer, progress bar at top, Back + Skip allowed):
1. Experience: Beginner / Some experience / Experienced
2. Time per day: 5 / 10 / 15 / 20 min
3. Preferred time: Morning / Afternoon / Evening / Varies — and practice days (weekday chips)
4. Movement preference: Seated / Standing / Floor / Low-impact / Mixed
5. Equipment: Mat / Chair / Blocks / Strap / Cushion / None
6. Accessibility & optional limitations (optional, skippable): balance concerns, knee/wrist sensitivity, prefer chair-based, avoid floor transitions — with a line explaining *why* we ask and that it stays on the device.
7. Voice & music preference: female/male voice, music on/off, ambience (rain, forest, soft piano)
8. **Age confirmation:** "Kaizen Yoga is designed for adults 18+." (Confirm button; otherwise a polite info screen.)
9. **Safety notice screen:** short, friendly card: stop if you feel sharp pain, dizziness, or unwell; if pregnant, recovering from surgery or managing a health condition, check with a healthcare professional first; this app isn't a substitute for medical care. Checkbox "I understand" + Continue.
10. **Reminder permission pre-prompt:** illustration of Kai with a soft bell; "Want a gentle nudge at your chosen time?" → "Yes, remind me" / "Not now". Mention quiet hours can be set.
11. **Plan reveal:** animated loader with breathing circle ("Building your plan…"), then a summary card: "Your 30-day Kaizen journey" with goal chips, daily time, first session preview. Button: "Start my first session" (goes to a 5-minute starter session) or "Explore first" (goes to Home).

## PART 2 — MAIN APP SCREENS

**Bottom tab bar (5):** Home · Explore · Practice (center, elevated breathing-circle button) · Progress · Profile.

1. **Home (Today)**
   - Greeting by time of day + Kai small avatar + today's date.
   - **Mood check-in** chip row ("How are you feeling?" 5 faces) — optional, one tap.
   - **Today's session** hero card (from the 30-day journey): illustration, title, duration, level, "Start" button, "Day 5 of 30".
   - **Quick relief** horizontal row (1–5 min SOS sessions): "Calm my anxiety", "Desk neck reset", "Can't sleep", "Energy boost", "Before an exam".
   - Continue where you left off, Recommended for you, Favorites row.
   - Weekly gentle progress strip (dots for days practiced; rest days shown as a calm moon icon, never as a failure).
2. **Explore / Library**
   - Search bar with recent searches; filter chips: Category, Level, Duration, Goal, Body position, Equipment, Chair-friendly.
   - Sections: Programs (multi-week), Routines by goal, Styles (Hatha, Gentle, Chair, Restorative, Vinyasa, Mobility/Balance, Breathing/Mindfulness — each with a plain-language explainer), Pose library (categories from the guide: Standing, Seated, Balance, Floor, Prone, Mobility, Restorative, Flows, Breathing, Chair), Sleep & wind-down (Yoga Nidra, body scan).
3. **Pose detail**
   - Large illustration/video placeholder, name + alternate (Sanskrit) name, category, level, duration, side.
   - Tabs or sections: Steps (numbered), Breathing cues, Setup & safe exit, Common mistakes, Modifications (chair/wall/props variations with toggles), Cautions (soft warning style), Props needed.
   - Tags, "Reviewed by [Reviewer name, role] · [date]" trust badge, Favorite, Add to custom routine.
4. **Routine / Program detail** — cover, description, goal, total time, level, ordered list of poses with thumbnails and durations, equipment needed, "Download for offline" button, Start.
5. **Session setup sheet** (before starting) — choose duration, voice, music/ambience, pace (slow/normal), "Focus boost" (back, hips, shoulders, posture, balance, relaxation), chair mode toggle.
6. **Active session player** (most important screen — immersive, minimal)
   - Full-screen pose visual, pose name, big countdown ring, "next up" preview, side indicator (Left/Right).
   - Breathing cue text that pulses with the breathing circle ("Inhale… exhale…").
   - Controls: Pause/Resume, Skip, Previous, Modify (opens easier variation), volume/music, and **Exit** always reachable.
   - **"Feeling discomfort?"** button → bottom sheet: "Switch to an easier version", "Skip this pose", "End session"; reminder to stop if sharp pain or dizziness.
   - Pause screen: resume, restart pose, end session, settings.
   - Cast-to-TV icon (UI only).
7. **Session complete** — Kai + celebration animation (soft confetti of leaves), time practiced, poses done, "How do you feel now?" mood picker (shows before → after if checked in), optional note/journal, achievement unlocked card if any, "Done" / "Share" (UI only).
8. **Breathing & Relax** (from center tab option) — standalone breathing exercises (Calm breath, Box breathing, Longer exhale, Body scan — all beginner-gentle, nothing forceful) with the animated breathing circle, custom timer, ambience sounds.
9. **Progress**
   - 30-day journey path (same visual as onboarding Scene 4, with completed days filled).
   - Calendar (practiced days, rest days as moons — no "streak broken" shame), total minutes, sessions, favorite style.
   - **Mood insights**: simple chart of before/after mood over time ("You often feel calmer after evening sessions").
   - **Monthly reflection** card: short self-check (stress, sleep, energy, stiffness on 1–5 sliders), with Zara-style "Your before / now" summary at day 30.
   - Achievements grid (illustrated badges with Kai), gentle challenges ("7-day morning stretch", "Wind-down week").
   - History list.
10. **Profile & Settings**
    - Avatar, name, goals (editable), plan summary.
    - Preferences: reminders (days, time, quiet hours), voice, music, language (English/Urdu), theme (light/dark/system), units, accessibility (reduce motion, larger text, captions).
    - Downloads (offline sessions manager), Health app sync (Apple Health / Health Connect — UI toggle only), Connected devices placeholder.
    - Privacy (what we store and why, export/delete my data), Safety information, Help & FAQ, Contact support, About, Terms.
    - **Support resources** screen: "If you're struggling or in crisis, please reach out to a mental health professional or local emergency services." with a placeholder list for local helplines (editable data).
11. **Premium (mock)** — calm comparison of Free vs Premium, monthly/yearly plan cards clearly labeled "Prototype — no real purchase", restore purchases, "Need help affording Premium?" link (financial-hardship request, UI only). Essential safety info always stays free.
12. **States** — every screen needs loading skeletons, empty states (Kai illustration + friendly copy), offline banner, and error state.

## SAMPLE DATA TO CREATE

- **50 exercise entries** following this shape: `id, name, altName, category, level, durationSec, reps, side, steps[], breathingCues[], setup, safeExit, commonMistakes[], modifications[], props[], cautions[], tags{goal,intensity,position,accessibility,equipment}, media{type,uri,rights}, review{name,role,date}, version`.
- **12 routines** (3× 5-min, 4× 10-min, 3× 15–20-min, 2× sleep) using the 10-minute template: settle (30–60 s) → warm-up (1–2 min) → main (5–6 min, 3–5 poses) → cool-down (1–2 min) → close (30–60 s).
- **6 breathing/relaxation sessions**, **5 quick-relief sessions**, **2 programs** ("30-Day Kaizen Beginner Journey", "Desk Body Reset — 14 days"), **12 achievements**, **3 gentle challenges**.
- User state: preferences, session records, mood logs, favorites, downloads, reminder settings.
- Use neutral placeholder illustrations for poses (simple shapes or a single consistent figure style) and mark media as placeholder.

## COPY & TONE RULES

- Warm, short, second person ("you"), encouraging, never guilt-based. Missing a day = "Rest is part of practice too."
- Never promise weight loss, cures, treatment, injury recovery or specific medical outcomes. Use "many people feel…", "may help you relax".
- Don't diagnose. Don't recommend extreme poses or forceful breathing to beginners.
- Characters' stories are clearly illustrative, not real customer reviews.

## BUILD ORDER (deliver in this order and show each step working)

1. Theme tokens, fonts, i18n + RTL, reusable components, character SVG components (Zara, Ali, Hina, Omar, Kai with pose/mood props) — render a **character sheet screen** first so consistency can be reviewed.
2. Story onboarding (Scenes 0–6) + personalization flow + plan reveal.
3. Home, Explore, Pose detail, Routine detail.
4. Session setup, Active player, Session complete.
5. Breathing & Relax, Progress (journey, calendar, mood insights, achievements).
6. Profile, Settings, Support resources, Premium mock, all empty/error/offline states.
7. QA pass: small and large phones, dark mode, Urdu RTL, Reduce Motion, larger text, accessibility labels; fix visual bugs; list known limitations.

## ACCEPTANCE CRITERIA

- First launch shows the story; relaunch goes straight to Home (add a "Replay intro" option in Settings).
- The same character looks identical in onboarding, Home, completion, Progress and empty states.
- A user can go from story → personalization → plan → first session → completion → Home without dead ends.
- Every tab and every button leads somewhere (real screen or clearly labeled "coming soon" state).
- Pause, skip, modify and exit are always available during a session.
- Looks polished in both light and dark mode, LTR and RTL.
