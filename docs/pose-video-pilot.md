# Pose video pilot (card AN-02): shot list and prompts

Three poses, chosen to show the easy end and the risky end before we commit to the other ~38. Style rules are in `docs/animated-characters-plan.md`. **Every clip must be reviewed by a qualified yoga teacher before it is used.**

## Common settings

- Square 1:1, 4 to 6 seconds, seamless loop (first and last frame are the same image), 720 px, no audio.
- Warm neutral room, soft daylight, one person, full body in frame, feet visible, same render style as the supplied portraits (soft 3D animation look).
- Slow, breath-paced movement: about 4 s in, 4 to 6 s out. No bouncing, no sudden stops.
- Negative prompt for every clip: *extra limbs, distorted hands, warped feet, text, watermark, fast motion, jump cuts, camera shake, different person, different outfit.*

## 1. Mountain Pose (easy, standing) with Hamid

- **Start and end frame:** `assets/pose-video-sources/hamid-standing-reference.jpg` (standing, relaxed). If the pose is not upright enough, generate a front-facing start frame first with the character reference.
- **Prompt:** "The same man stands tall in Mountain Pose, feet hip-width apart, arms resting by his sides. He slowly breathes in, shoulders softening down and back, chest gently lifting, then breathes out and settles. Calm face, eyes soft. Locked-off camera, full body in frame, warm room with plants, soft daylight. Slow, minimal movement; ends in the exact starting position."

## 2. Seated Forward Fold (easy, seated floor) with Hina

- **Start and end frame:** generate a still of Hina seated on a mat with legs extended and spine tall (the supplied Hina image is cross-legged on the floor, so use it as the character reference, not the start frame).
- **Prompt:** "The same woman sits on a yoga mat, legs extended in front of her, spine tall, hands resting on her thighs. As she breathes out she hinges slowly forward from the hips with a long back and soft knees, hands sliding down her legs only as far as comfortable; as she breathes in she lifts back to sitting tall. Calm face. Locked-off side-front camera, full body in frame, soft daylight. Slow and gentle; ends in the starting position."

## 3. Legs Up the Wall (floor, restful) with Sarah

- **Start and end frame:** generate a still of Sarah lying on her back with her hips near a wall and legs resting up the wall, arms relaxed at her sides.
- **Prompt:** "The same woman lies on her back on a mat with her legs resting up a plain wall, arms relaxed at her sides, eyes softly closed. Her belly and chest rise slowly with each breath and fall again. Almost still, very calm. Locked-off camera showing the whole body and the wall, soft daylight. Barely any movement; ends in the starting position."

## Review checklist (teacher)

1. Does the pose match the written steps for that pose in the app?
2. Any unsafe or impossible joint angles (neck, knees, lower back)?
3. Hands, feet and face stay natural and consistent through the loop?
4. Does the loop restart without a visible jump?
5. Is the pace calm and breath-like?

Approve, or regenerate. Record the reviewer's name and date in the pose's `review` field when approved.

## After the pilot

Judge quality and cost per clip, then decide: all standing and seated poses (AN-04), a Rive fallback for balance and floor poses (AN-06), or stills only for the hard ones.
