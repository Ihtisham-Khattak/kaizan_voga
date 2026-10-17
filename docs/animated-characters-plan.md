# Animated characters: approach and style guide (card AN-01)

Goal: show people how to do each pose with the app's own characters (Hina, Hamid, Arif, Sarah), in the same rendered look as the portraits.

## Decision (recommended, needs product-owner sign-off)

| Option | Verdict |
|---|---|
| **Short looping videos of the characters** (made with an image-to-video tool, played with `expo-video`) | **Use first.** Same look as the portraits, fastest to ship, no new rendering code. Risk: anatomy errors, so every clip is reviewed by a qualified teacher (card PS-09 / AN-02). |
| **Rive** (2D skeleton animation) | **Fallback** for poses AI video cannot do safely (balance and floor work). One rig, every pose is data. Needs an animator. Spike AN-06. |
| **three.js / real 3D** | **Only if** a rotating camera is wanted. Needs a rigged 3D model and an animation for every pose; heavy on low-end phones. Not planned. |
| **GSAP** | **No.** Built for the web DOM; the app already has Reanimated and Moti. |

## Scope

66 poses. Videos add value for about 41 of them; skip the 5 breathing practices (the animated breathing circle covers them) and the very small mobility circles can be short loops. Difficulty for AI video: standing and seated poses (about 29) are the best case, balance (5) is the hardest, floor work (about 17) is in between.

## Style guide for every clip

- **Length and loop:** 4 to 6 seconds, seamless. Use the same image as the first and last frame so the loop does not jump.
- **Frame:** square 1:1 (the app crops to square or 4:5); the whole body in frame, feet visible, a little space above the head.
- **Look:** the supplied render style, warm neutral room, soft daylight, one person, no text, no music. The background matches the portraits.
- **Pace:** slow, breath-paced. Move in on the inhale and out on the exhale (about 4 s in, 4 to 6 s out). No bouncing, no sudden stops.
- **File:** H.264 MP4, no audio track, about 720 px square, 1 to 3 MB. Name `<poseId>-<person>.mp4`, plus a `-poster.jpg` still of the first frame.
- **Who demonstrates what:** Hina and Sarah for floor, restorative and flexibility poses, Hamid for standing and desk poses, Arif for flows and balance. One person per pose, consistent across the app.
- **Safety first:** the pose must match the written steps, with an easy version shown when the pose has a prop or wall option. A clip that looks risky is regenerated, not shipped.
- **Review:** a qualified teacher approves every clip and the name goes in the pose's `review` field.

## In the app (card AN-03)

- Pose detail and the session player show the clip with the still as the poster.
- Autoplay, muted, loop; pauses when the screen is not visible; tap to pause or play.
- **Reduce Motion** or a load error: show the still image only.
- A text alternative (the pose name and its first step) is always available for screen readers.
- Clips are lazy-loaded and size-budgeted (see PERF-09 and FN-10 for CDN and offline).

## Pilot (card AN-02)

Three poses: Mountain Pose (easy), Seated Forward Fold (easy), Legs Up the Wall (floor). Requires the Higgsfield connection (`claude mcp add --transport http higgsfield https://mcp.higgsfield.ai/mcp`, then sign in through `/mcp`) and credits. Judge quality and teacher approval before the full batches (AN-04, AN-05).
