# Static UI brief: screen map and decisions

Brief (2026-10-16): build the 14 static screens of a premium, calm yoga app, with reusable components and realistic mock content. This file records how that brief maps onto the existing Kaizen Yoga app. Cards: UI-01 to UI-14 on the board.

## Decisions (made by default on 2026-10-16, change them here if you disagree)

| Question | Decision |
|---|---|
| Palette: the brief says warm cream/sage/earth; `docs/UI_Build.md` says white, aurora, green tokens | **`UI_Build.md` wins.** The brief's sage is the `mint` and `leaf` tokens. There is no second palette: the story and plan reveal were migrated onto the tokens (`src/theme/story.ts` is now a thin adapter). |
| Pictures (poses, programs, categories) | **Illustrated fallback:** every style and program has its own icon motif on a tinted cover (`src/components/cover-motifs.ts`). Real pictures drop in later through the cover and `media` fields. |
| Prenatal Yoga | **Included**, seated and supported only, with a careful note on its page ("check with your doctor or midwife"). Needs a professional review before release. |
| "Static" | The existing working prototype stays. Only missing screens, components and content were added; no backend or new business logic. |

## The 14 screens

| # | Screen | Route | Status |
|---|---|---|---|
| 1 | Welcome | `(story)/story` scene 1 | Existing; moved onto tokens |
| 2 | Home | `(tabs)/home` | Existing; **added** style shortcuts and popular programs |
| 3 | Yoga styles (categories) | `library/styles` | **New:** Hatha, Vinyasa, Yin, Restorative, Power, Gentle, Chair, Prenatal (+ Mobility & Balance, Breathing & Mindfulness) |
| 4 | Exercise library | `(tabs)/explore`, `search`, `library/category/[id]` | Existing |
| 5 | Exercise detail | `pose/[id]` | Existing; new pose **Downward-Facing Dog (Gentle)** added |
| 6 | Programs | `library/programs` | **New:** goal filter chips, featured card, all programs |
| 7 | Program detail | `program/[id]` | Existing; works for the 6 new programs |
| 8 | Workout session | `session/setup`, `session/player`, `session/complete` | Existing |
| 9 | Progress | `(tabs)/progress` | Existing; **added** stat cards, day streak and weekly activity chart |
| 10 | Profile | `(tabs)/profile` | Existing; **added** Favorites row |
| 11 | Goals & preferences | `settings/goals`, `settings/preferences` | Existing |
| 12 | Favorites | `favorites` | **New:** poses / routines tabs and a Kai empty state |
| 13 | Settings | `settings/*` | Existing |
| 14 | Subscription | `premium`, `settings/subscription` | Existing (prototype, no real purchase) |

Preview any of them on its own from the dev-only **Screen showcase** (`/dev/screens`, also linked from Profile in development builds). It can also add a week of sample progress.

## New reusable components

`CategoryCard`, `DifficultyBadge`, `DurationLabel`, `ProgressCard`, `WeekChart` (progress feature), plus cover motifs. Already present: pose card (`ExerciseCard`), `ProgramCard`, `RoutineCard`, `SectionHeader`, `Chip`, `Button`, `EmptyState`, `TabBar`, `CharacterAvatar`.

## Mock content added

- Styles: Yin, Power, Prenatal (10 in total).
- Programs: Yoga for Beginners, Morning Energy, Deep Relaxation, Full-Body Flexibility, Better Sleep, Core Strength (8 in total, with the 30-day journey and Desk Reset).
- Routines: Gentle Core Basics, Steady Strength, Yin Release, Prenatal Gentle Stretch.
- Pose: Downward-Facing Dog (Gentle), with wall and chair versions.

The other nine poses named in the brief already existed. Four have gentler names on purpose: Gentle Warrior II, Gentle Bridge, Gentle Cobra and Tree Pose (Supported).

## Still to do before release

- Real pictures for poses, programs and styles.
- A qualified reviewer for the pose and Prenatal content (currently a placeholder reviewer).
- Urdu translations still need a native speaker's review.

## Pose library growth (2026-10-17, cards PS-02 to PS-08)

22 new poses were added (51 to **73**), written with steps, breathing cues, setup, safe exit, easier versions and careful cautions:
hips and hamstrings (Low Lunge, Supine Figure-Four, Happy Baby, Seated Butterfly, Garland Squat, Reclining Hamstring Stretch, Half Forward Fold), core and back (Bird-Dog, Knee Plank, Modified Side Plank, Gentle Locust), standing foundations (Warrior I, Chair Pose, Triangle, Goddess), chest and shoulders (Thread the Needle, Cow-Face Arms, Wall Chest Stretch), calm and chair hips (Supported Twist, Supported Fish, Seated Figure-Four) and a Gentle Sun Salutation.
Also added: 6 routines (Hip Release, Back Strength Basics, Standing Strong, Shoulders & Upper Back Relief, Twist Open & Rest, Gentle Sun Salutation), gentle alternate-nostril breathing, and the programs now use them. Opening and closing poses vary so routines feel less repeated.

**Not done yet:** PS-01 (merging repeated poses) waits for approval of the keep/remove list. All 73 poses still need a qualified teacher's review (PS-09).

## Merged poses (2026-10-18, card PS-01)

73 poses became **66**. Seven poses that repeated the same movement were merged into the clearer one; routines were updated and the old ids still resolve (saved favourites and custom routines keep working):
Seated Cat-Cow into Chair Cat-Cow, Chair Twist into Seated Gentle Twist, Sphinx into Gentle Cobra, Crocodile Rest and Body Scan Rest into Relaxation Pose, Supported Child's Pose into Child's Pose, Chair Neck & Shoulder Release into Gentle Neck Rolls.
Kept on purpose: the dedicated chair poses (Chair Mountain, Chair Forward Fold), because they serve people who cannot get down to the floor, and the breathing practices, which still appear in routines. The Gentle Neck Rolls and Seated Gentle Twist poses gained the "no floor transition" tag so chair-friendly filters still find them.
