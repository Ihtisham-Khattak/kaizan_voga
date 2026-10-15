# Content & tone audit (QA-03)

Run it any time: `npm run audit:copy` (exits non-zero on any finding).

## What is scanned
Every English UI string (`src/i18n/en.ts`) plus all content data: exercises, routines, programs, breathing sessions, achievements, challenges and yoga styles.

## Rules checked
| Rule | Looks for |
|---|---|
| weight-loss | weight loss, calories, "toned", fat-burn |
| cure-treat | cure, treat/treatment, therapy, diagnose, heal, "clinically proven" (disclaimers like "not medical advice" are allowed) |
| injury-recovery | rehab, "fix your back/neck/posture" |
| absolute-claim | guarantee, "will cure/fix", "proven to", "get rid of stress" |
| guilt | "you missed", "streak broken", "falling behind", "you failed", "lazy", "you must" |
| forceful | hold your breath, breath of fire, push through pain, "no pain no gain" |
| extreme-pose | headstand, handstand, wheel, full splits, shoulder stand … |

## Requirements verified
- About screen says the characters are illustrated and not real people; the story labels Zara's story "Illustrated story".
- Safety info says it is not medical advice.
- Rest days are framed positively ("Rest is part of practice too.").
- Every pose has a safe-exit line and a reviewer entry.

## Result (2026-10-15)
- Wording issues: **0** after one fix (the story testimonial said a routine "helps me fall asleep sooner"; it now says it "makes my evenings feel calmer", EN + UR).
- A second manual pass over softer verbs (relieve, reduce, improve, boost, strengthen, prevent) found only goal names ("Better sleep"), quick-relief titles ("Energy boost") and movement instructions ("lower your arm"): no outcome claims.

## Still open before release (not failures, but real)
1. **Urdu translations** are a draft and need a native-speaker review.
2. **Pose reviewer** is a placeholder (`REVIEW` in `src/data/exercises.ts`): needs a real certified teacher and date.
3. **Helpline numbers** are placeholders per country.
4. **Legal text** (Terms, Privacy) is placeholder copy.
5. The audit is keyword-based. It cannot judge tone on its own, so new copy should still get a human read.
