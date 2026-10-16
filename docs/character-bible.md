# Kaizen Yoga — Character Bible: Hina, Arif, Hamid, Sarah

> Naming note: Arif was originally called Arfa and was written as a woman; the portrait supplied for this slot is a man, so the display name and the Urdu copy now follow him. The internal id in code is still `arfa`. Section 4's visual description (teal cardigan, braid) is the old illustrated version.
>
> Naming note: Sarah was originally called Sierra. Only the display name changed; the internal id in code is still `sierra` (so saved avatar choices keep working).

Status: **implemented (first pass)** on the in-house vector art, using the defaults listed in section 12. Sections 1–11 are the original proposal.
Written for: the product owner and the design team.

## 0. How to read this document

- **Verified** = I checked it in the current app code.
- **Proposed** = my design suggestion. Needs your approval before any build.
- The brief I received ends mid-sentence in section 10 ("Illustrative examples of how yoga…"). Section 10 below covers the placements I could identify; tell me if the cut-off part asked for anything else.

---

## 1. What exists today (verified)

### The cast
| Character | Role now | Signature | Used in |
|---|---|---|---|
| Zara | main narrator, "was anxious and rushed" | teal top, bun, leaf earring | story scenes 3, Zara's Story, reflection before/now card |
| Ali | friend, desk work, stiff back | mustard hoodie, round glasses | story scenes 1–2, goal card (back/neck) |
| **Hina** | friend, poor sleep | lavender scarf | story scenes 1–2, goal card (sleep) |
| Omar | friend, student stress | coral tee, headphones | story scenes 1–2, goal card (focus) |
| Kai | the Kaizen guide / mascot | sage lotus-leaf sprite | 28 files: Home, empty states, completion, success, errors |

**Important:** a character called **Hina already exists** (the friend with poor sleep). The new Hina in this brief is a different person (busy schedule, tension from sitting). Zara, Ali and Omar do not appear in the new brief.

### How characters are built
- One component, `Character` (`src/characters/character.tsx`), props: `name`, `pose`, `mood`, `size`, `flip`, `crop` (full / bust), `animated`.
- All humans share **one body drawing**. Each person is a style config (`src/characters/art/styles.ts`): skin, hair, top, sleeve length, pants, shoes, hair-front shape, clothing details, one accessory.
- **Poses (4):** stand, sit, wave, yoga (this is a tree pose only).
- **Moods (5):** stressed, tired, neutral, calm, happy. Same face system for everyone (two eyes, small mouth, blush; mood changes brows and mouth).
- Style: flat vector, semi-realistic proportions. Fixed palette in `src/theme/illustration.ts`, identical in Light and Night.
- Scene props: a bench, thought icons, light rays, falling leaves. There are **no** desk, kitchen, bedroom or office environments, and **no** floor poses (child's pose, cat-cow, forward fold).

### Where characters show up in the product
Story (7 scenes), goals picker (each goal card has a character avatar), Profile (avatar picker + header), Progress → Monthly reflection (before/now split card), Home and every empty state (Kai).

### Content the characters can honestly point to (verified)
- 12 routines (5–20 min, incl. sleep), 5 quick-relief sessions (calm anxiety, desk neck reset, can't sleep, energy boost, before an exam), 6 breathing practices, 2 programs (30-Day Beginner Journey, Desk Body Reset 14 days, premium), about 50 poses with steps, breathing cues, modifications and a safe-exit line.
- Chair mode, reminders with quiet hours, mood check-in before/after sessions, calendar with rest days, achievements and gentle challenges, custom routines, offline downloads (premium), English + Urdu.
- Rules the stories must respect: no medical or outcome claims, no guilt about missed days, rest days framed as practice, characters labelled as illustrated (checked by `npm run audit:copy`).

### A limit you should know about
The brief asks for realistic people, "not generic fitness ads". The current art system draws **flat vector figures**. It can be made warmer and more individual, but it cannot reach photographic realism. Real realism needs commissioned illustration or generated reference images (section 11).

---

## 2. Design principles for all four

1. **Four different lives, not four faces.** Different age, work, home, reason for starting, pace of progress.
2. **Ordinary, not aspirational.** Everyday clothes, lived-in rooms, tired faces on a Tuesday.
3. **Small steps.** Every story starts with 3–5 minutes, not a transformation.
4. **No miracle.** Progress is "I notice…" and "some days still…". Never "cured", "fixed", "gone".
5. **Honest about being illustrated.** Stories are labelled "Illustrated story".
6. **Identity stays fixed.** Face, hair, proportions and one signature colour never change between scenes. Only clothes and mood change, and only with a reason (everyday vs yoga outfit).

---

## 3. Hina

**One line:** Always on, always a little behind, trying to find ten minutes that are hers.

| | |
|---|---|
| Age | early 30s |
| Life | Operations coordinator at a busy office; commutes; shares a flat with a flatmate |
| Personality | Organised, dry sense of humour, keeps lists, says "I'll do it later" about herself |
| Challenge | Packed days, no regular exercise, tight neck and shoulders by mid-afternoon, low energy after 3 pm |
| Goal | Feel more energetic and more connected to her body, with a routine she can actually keep |
| Signature | Lavender (kept from the current Hina: dupatta/scarf), shoulder-length dark hair tied back with a clip |

**Look (proposed):** medium build, natural slightly forward-rounded posture at a desk, rounded shoulders when tired; soft expressive brows; no makeup polish. Everyday: lavender dupatta over a plain kurta or shirt, trousers, flat shoes, lanyard. Yoga: loose comfy tee and leggings, hair clipped up, bare feet, usually on a spare corner of her living room.
**Body language:** checks her phone while eating, rolls her neck, sighs when she sits down.
**Environments:** office desk with two screens and a cold tea, commute bench, a flat living room with a laundry rack.

### Story
- **A. Everyday reality.** Alarm, rushed breakfast, commute, meetings. By 3 pm her neck is tight and she is reaching for a third chai.
- **B. The moment.** After a long review day she can't turn her head to check her bag and laughs, then stops laughing.
- **C. Discovering the app.** A colleague sends her the 3-minute **Desk neck reset** quick-relief session.
- **D. First experience.** She does it at her desk, unsure whether she is doing it right. The steps and the "stop if you feel sharp pain" line reassure her. She finishes and feels a little silly and a little better.
- **E. Gradual improvement.** She tries the **5-Minute Starter**, then sets a reminder for 4 pm (reminders with quiet hours). Some weeks she only does it twice. The calendar shows rest days as rest, not failure.
- **F. New routine.** A 5-minute break most workdays, **Morning Wake-Up** on slower mornings. She notices she hunches less often. Evenings are still messy.
- **G. Message to you.** "I didn't find an hour. I found five minutes, and then I kept finding them. Start with whatever fits today."

**Matches existing features:** Desk neck reset (qr-02), 5-Minute Starter (r-01), Morning Wake-Up (r-03), reminders, calendar. Optional: Desk Body Reset program (premium).

---

## 4. Arif

**One line:** Curious and a bit shy; afraid of looking clumsy, so she never started.

| | |
|---|---|
| Age | mid 20s |
| Life | Final-year design student who also takes freelance jobs; lives with family; studies late |
| Personality | Thoughtful, self-conscious, perfectionist, laughs at herself once she relaxes |
| Challenge | Intimidated by unfamiliar poses and Sanskrit names; stiff hips and hamstrings from long study sessions; keeps unrealistic expectations ("I should already be flexible") |
| Goal | Beginner-friendly start; build flexibility gradually; gain confidence |
| Signature | Teal (inherits Zara's slot): teal cardigan or scarf, long wavy hair in a loose braid, small stud earrings |

**Look (proposed):** slim, slightly hunched over her laptop; wide eyes when concentrating, hand over mouth when unsure. Everyday: teal cardigan over a plain top, jeans, sneakers, tote bag with sketchbook. Yoga: oversized tee, soft joggers, wool socks.
**Environments:** her desk with drawing tablet and sticky notes; a cramped bedroom floor; the university library.

### Story
- **A. Everyday reality.** Lectures, deadlines, late-night work, snacks at the desk, a stiff lower back when she stands up.
- **B. The moment.** She tries to touch her toes at a family gathering as a joke, can't, and feels oddly embarrassed.
- **C. Discovering the app.** She searches for something gentle and sees the pose pages with **steps, breathing cues, modifications** and "common mistakes".
- **D. First experience.** She opens **Easy Back Stretch** with the volume low, rewinds a step, and chooses the **easier version** (modifications). Nobody is watching. She stops when it feels like too much.
- **E. Gradual improvement.** Week by week, she moves from the easier version to the standard one in a few poses and stays on the easier version in others. She logs her mood before and after.
- **F. New routine.** 10 minutes after studying on most days. She reaches further than before, not far, and doesn't mind.
- **G. Message to you.** "I thought you had to be able to do it before you start. You start so that you can do it. Pick the easy version. It counts."

**Matches existing features:** pose detail (steps, breathing, modifications, safe exit), Easy Back Stretch (r-05), Gentle Full-Body (r-08), beginner level filter, mood before/after, achievements ("First step").

---

## 5. Hamid

**One line:** Ten-hour days at a desk; believes yoga is "for flexible people".

| | |
|---|---|
| Age | late 30s to mid 40s |
| Life | Accounts manager; father of two; commute plus long hours; occasional cricket on weekends |
| Personality | Warm, practical, sceptical, jokes when nervous, hates feeling like a beginner |
| Challenge | Stiff neck and lower back, little movement during the day, no obvious time, worried he will look foolish |
| Goal | Short movement breaks, a habit he can sustain, learning yoga without feeling overwhelmed |
| Signature | Mustard (inherits Ali's slot): mustard sweater or kurta; round glasses; short dark hair, light stubble |

**Look (proposed):** sturdy, average fitness, natural belly, shoulders forward at the keyboard. Not an athlete and not shown as one. Everyday: collared shirt with sleeves rolled, mustard sweater, trousers, loafers, lanyard. Yoga: plain grey tee and loose track pants, chair nearby.
**Environments:** office desk with paperwork, a car, the family living room, a small balcony.

### Story
- **A. Everyday reality.** Early start, spreadsheets, lunch at the desk, kids' homework in the evening.
- **B. The moment.** His daughter asks him to play on the floor and he struggles to get up without a hand on the sofa.
- **C. Discovering the app.** He sees **Chair mode** and the **14-day Desk Body Reset**, built for desk breaks.
- **D. First experience.** He does **Desk neck reset** in his chair with the door shut. The cues are plain, and the pose has a safe-exit line, so he stops worrying.
- **E. Gradual improvement.** Two breaks a day at first, then three. He drops the afternoon break on busy days and picks it up the next.
- **F. New routine.** A 5-minute break at 11 and 3, one longer session on Sunday. He notices he gets up from the chair more easily. He still has stiff days.
- **G. Message to you.** "You don't have to be able to touch your toes. You have to be willing to sit up straight for five minutes. I started with a chair."

**Matches existing features:** Chair mode (preferences + setup), Desk neck reset (qr-02), Desk Body Reset (p-desk, premium), Easy Back Stretch (r-05), reminders, calendar.

---

## 6. Sarah

**One line:** Her days belong to everyone else; she wants one calm pocket that is hers.

| | |
|---|---|
| Age | early to mid 30s |
| Life | Works in a role with variable hours (hybrid or shifts); lives away from her family; keeps a small apartment |
| Personality | Caring, easy-going, over-extends herself, says yes too quickly |
| Challenge | Evenings blur into screens, trouble winding down, feels she never has time for herself |
| Goal | Create a small, dependable evening ritual; learn simple breathing and gentle movement; feel more balanced |
| Signature | Coral (inherits Omar's slot): coral top or scarf, curly or wavy hair worn loose or in a clip |

**Background note:** I have **not** assumed Sarah's ethnicity, nationality or exact job. These stay a design decision for you: pick a skin tone and hair type that sit in the warm palette and make her distinct from the other three.
**Look (proposed):** relaxed shoulders but tired eyes, often with a mug. Everyday: coral cardigan or knit, comfortable trousers, lanyard or work bag. Yoga: soft long-sleeved top, leggings, socks, blanket nearby.
**Environments:** small apartment with a sofa and a lamp, kitchen counter, a bedroom with a phone on the bedside table.

### Story
- **A. Everyday reality.** Long shifts or long calls, takeaway dinners, scrolling on the sofa until late.
- **B. The moment.** She realises she hasn't done anything just for herself in weeks, and that she can't remember the last time she felt quiet.
- **C. Discovering the app.** She finds the **Evening Wind-Down** routine and **Calm breath** in the Breathing section.
- **D. First experience.** She tries **Calm breath** (3 min) on the sofa with the lights low. Her mind wanders. That's allowed.
- **E. Gradual improvement.** She adds **Evening Wind-Down**, then the mood check-in before and after. Some nights she skips it and the app says rest counts.
- **F. New routine.** Three or four evenings a week: phone away, tea, 10 minutes. She feels a bit calmer going to bed. Hard days still happen.
- **G. Message to you.** "I stopped trying to fix my whole life. I made one small corner of the evening mine. You can too, and it's okay if you miss a night."

**Matches existing features:** Evening Wind-Down (r-11), Calm breath and body scan (breathing), Can't-sleep quick relief (qr-03), mood check-in, reminders with quiet hours, calendar rest days. Optional: Yoga Nidra Settle (premium).

---

## 7. Visual specification (proposed)

| | Hina | Arif | Hamid | Sarah |
|---|---|---|---|---|
| Age feel | early 30s | mid 20s | 40ish | early to mid 30s |
| Build / posture | medium, desk-forward | slim, slightly hunched | sturdy, forward shoulders | average, relaxed but tired |
| Hair | dark, tied back with clip | long wavy, loose braid | short, light stubble | wavy or curly, loose |
| Face notes | defined brows, tired eyes | wide eyes, soft features | warm lines, round glasses | soft features, mug-in-hand mood |
| Signature colour | lavender | teal | mustard | coral |
| Everyday | dupatta + kurta | cardigan + jeans | sweater/shirt sleeves rolled | knit + trousers |
| Yoga | tee + leggings, hair up | oversized tee, joggers, socks | grey tee, track pants | long-sleeve, leggings, socks |
| Body language | rolls neck, checks phone | hand over mouth, rewinds | jokes, hand on lower back | holds mug, exhales slowly |
| Before the journey | stressed / tired | tired / neutral | tired | tired |
| After a few weeks | calm | calm / happy | calm | calm / happy |

Rules: same face, hair and proportions in every scene; mood changes eyebrows and mouth only; outfit changes (everyday ↔ yoga) are the only wardrobe change, and always for a reason shown in the scene.

---

## 8. Where they appear in the real app (proposed placements)

| Screen (verified to exist) | What changes |
|---|---|
| Story scenes 1–2 ("Sound familiar?", "You're not alone") | Replace the three friends with Hina, Hamid and Sarah on the bench, each with a one-line worry. Arif joins in scene 3. |
| Story scene 3 (the narrator) | Arif is the first-person "I felt that too" voice, since she is the one afraid to start. |
| Story: Zara's Story, 30-day path | Becomes "Four ways in": one short before/after card per person (same Before / With Kaizen layout), swipeable. |
| Goals picker | Map goals to the person who shares them: neck/back and desk work → Hamid; stress, low energy and not enough time → Hina; flexibility and beginner worries → Arif; sleep, balance and "time for me" → Sarah. |
| Plan reveal | Show "People with goals like yours started with…" and one routine. |
| Profile avatar picker | Offer the four characters (plus Kai) as the user's companion. |
| Monthly reflection before/now card | Use the chosen companion (currently always Zara). |
| Routine and program detail | A small "Hina's pick / Hamid's pick" chip with a one-line reason. |
| Home | Optional: "Today with Hina": one short story card that links to the matching routine. |
| Empty states | Keep Kai for neutral states. Use a character only where the situation fits (e.g. history empty → Arif's first-step line). |
| Achievements and challenges | Kai stays the celebrator. Characters appear in the detail sheet quote ("Hina on 'Week one'"). |
| Reminders and notification previews | Short in-voice lines ("Hamid's 3 o'clock stretch"), optional. |

---

## 9. What it takes to build (proposed phases)

**Phase A: Cast and art (largest)**
- New or revised style configs for Hina, Arif, Hamid, Sarah (hair shapes, outfits, accessories). Hina gets a new look. Arif/Hamid/Sarah are new faces, not recolours.
- New **outfit** option (`everyday` / `yoga`) on `Character`.
- New **poses**: chair twist, seated neck roll, child's pose, cat-cow, forward fold, wide-leg stretch. Needed to show their routines honestly.
- New **environments** as SVG props: desk, sofa + lamp, bedroom, living-room corner, bench stays.
- Update the character sheet (dev page) and the unit checks that keep them identical everywhere.

**Phase B: Story and onboarding**
- Rewrite story scenes 1–5 around the four people, with English + Urdu copy, passing the content audit (no medical claims, "Illustrated story" label).
- Goal-to-character mapping, plan reveal line, avatar picker.

**Phase C: In-app touches**
- Companion chip on routines and programs, reflection card, optional Home story card, reminder copy.

**Phase D: Review**
- Content audit, light/Night/Urdu/130% screenshot pass, device test.

Rough effort for the in-house vector route: Phase A is the bulk, then B and C. Realistic photo-style art is a different project (below).

---

## 10. Realistic images: the honest options

1. **In-house vector (current system, improved).** Fast, consistent, animated, works in Light/Night and Urdu. Looks illustrated, not photographic.
2. **Commissioned or generated reference sheets, then redrawn.** Make one character reference sheet per person (front, side, three-quarter, everyday and yoga outfits, 5 expressions) with an illustrator or an image-generation tool, then match it in code or use the images directly. This is the only route to "realistic". It needs an image tool and a human to approve consistency; I cannot generate images here.
3. **Hybrid.** Vector characters in-app, realistic key art for onboarding and marketing only.

If you pick option 2, use these reference-sheet briefs so all four stay consistent. Use the same style line for every one: *"realistic editorial illustration, natural proportions, soft daylight, lived-in room, no beauty filter, no stock-photo gloss, calm green and cream palette."*

- **Hina:** early 30s, dark shoulder-length hair tied with a clip, lavender dupatta, tired attentive eyes, desk with cold tea; yoga outfit: loose tee and leggings, living-room corner.
- **Arif:** mid 20s, long wavy hair in a loose braid, teal cardigan, wide thoughtful eyes, hand near mouth; yoga outfit: oversized tee, joggers, wool socks, bedroom floor.
- **Hamid:** about 40, short hair, light stubble, round glasses, mustard sweater over collared shirt, sturdy build, natural belly, hand on lower back; yoga outfit: grey tee and track pants, using a chair.
- **Sarah:** early 30s, wavy or curly hair worn loose, coral knit, soft tired smile, mug in hand; yoga outfit: soft long-sleeve and leggings, sofa and lamp. *(Skin tone and heritage: your decision.)*

---

## 11. Decisions I need from you

1. **The cast.** Replace Zara, Ali and Omar with Arif, Hamid and Sarah, and redefine Hina? Or keep some of the current cast alongside?
2. **Kai.** Keep him as the guide who celebrates and appears in empty states? (I assume yes.)
3. **Sarah's background:** skin tone, hair, and any cultural context you want.
4. **Art route:** option 1, 2 or 3 above. This sets how real the people look and how long the build takes.
5. **Scope of the first build:** Phase A+B only (story and onboarding), or A+B+C?
6. **Urdu:** do you want the stories written natively in Urdu first, or English first and then translated and reviewed?

---

## 12. What was built (first pass)

Defaults used because the open questions in section 11 were not answered: Arif, Hamid and Sarah replace Zara, Ali and Omar; Hina is redefined; Kai stays as the guide; art stays in-house vector; scope = cast, story and in-app touches.

**Characters (`src/characters`)**
- Four new styles in `art/styles.ts`: Hina (ponytail with clip, lilac dupatta, office lanyard), Arif (long braid, teal cardigan, studs), Hamid (round glasses, grey temples, stubble, mustard sweater over a collar, sturdier build), Sarah (loose curls, coral knit cardigan, hoops). Each has a `yoga` outfit. Same face, hair and skin in both outfits.
- `Character` takes `outfit="everyday" | "yoga"`. Two new poses: `reach` (arms overhead) and `sideReach`.
- `settings.tsx`: three lived-in rooms (office desk, sofa and lamp, bedroom floor with rug).
- New thought bubble for Hina (calendar and clock). Sarah uses the moon bubble, Hamid the laptop and clock.
- Skin tones and Sarah's hair are placeholders pending your decision (section 11, item 3).

**Story**
- Scenes 1–3 use Hamid, Hina and Sarah on the bench, then Arif arrives.
- "Zara's Story" became **Four ways in**: pick a person, see their before and after in their own room, what they started with, and their message.
- Goals scene shows all four people cheering.

**In the app**
- Goal cards: stress → Hina, neck/back → Hamid, sleep → Sarah, focus → Arif.
- Profile companion picker offers the four; saved companions migrate (Zara→Arif, Ali→Hamid, Omar→Sarah).
- Monthly reflection before/now card shows the user's chosen companion.
- "Hina's pick" card with a one-line reason on 12 routines and programs.
- Plan reveal: "Someone with a goal like yours started with…".

**Not built yet:** the Home "Today with…" story card, person-specific reminder lines, in-person quotes on achievement sheets, floor poses (child's pose, cat-cow), and realistic or photographic art.
