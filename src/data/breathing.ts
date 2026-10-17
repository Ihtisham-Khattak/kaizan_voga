import { BOX_BREATH, CALM_BREATH, LONG_EXHALE } from '@/lib/breath';

import type { BreathingSession } from './types';

/** Breathing & relaxation – all beginner-gentle, nothing forceful. "May help" wording only. */
export const breathingSessions: BreathingSession[] = [
  {
    id: 'calm-breath',
    kind: 'breath',
    title: 'Calm breath',
    description: 'Breathe in for 4, hold lightly, breathe out for 6.',
    why: 'Slow, even breathing may help you feel more relaxed.',
    pattern: CALM_BREATH,
    defaultMinutes: 3,
    cover: 'sage',
  },
  {
    id: 'box-breathing',
    kind: 'breath',
    title: 'Gentle box breathing',
    description: 'Equal counts of 3 for in, pause, out, pause.',
    why: 'A steady rhythm can give your mind something simple to follow.',
    pattern: BOX_BREATH,
    defaultMinutes: 3,
    cover: 'mint',
  },
  {
    id: 'longer-exhale',
    kind: 'breath',
    title: 'Longer exhale',
    description: 'In for 4, out for 6 — a soft, unhurried release.',
    why: 'A slightly longer exhale may help you settle.',
    pattern: LONG_EXHALE,
    defaultMinutes: 5,
    cover: 'lavender',
  },
  {
    id: 'body-scan',
    kind: 'body-scan',
    title: 'Body scan',
    description: 'Slowly notice each part of your body and let it soften.',
    why: 'Paying gentle attention to your body may help you unwind.',
    pattern: CALM_BREATH,
    defaultMinutes: 8,
    cover: 'lavender',
    regions: ['Feet', 'Legs', 'Hips', 'Belly', 'Chest', 'Hands and arms', 'Shoulders', 'Neck', 'Face'],
  },
  {
    id: 'alternate-nostril',
    kind: 'breath',
    title: 'Gentle alternate-nostril breathing',
    description:
      'Breathe in through one nostril and out through the other, slowly and without holding your breath.',
    why: 'A quiet, even rhythm may help you feel calm and focused.',
    pattern: [
      { kind: 'inhale', ms: 4000 },
      { kind: 'exhale', ms: 4000 },
    ],
    defaultMinutes: 3,
    cover: 'mint',
  },
  {
    id: 'three-part-breath',
    kind: 'breath',
    title: 'Three-part breath',
    description: 'Belly, ribs, chest — then back down, smooth and slow.',
    why: 'Fuller, easy breathing can feel grounding.',
    pattern: [
      { kind: 'inhale', ms: 5000 },
      { kind: 'exhale', ms: 5000 },
    ],
    defaultMinutes: 4,
    cover: 'sand',
  },
  {
    id: 'humming-breath',
    kind: 'breath',
    title: 'Humming breath',
    description: 'Breathe in, then hum softly as you breathe out.',
    why: 'The gentle vibration of humming may feel soothing.',
    pattern: [
      { kind: 'inhale', ms: 4000 },
      { kind: 'exhale', ms: 6000 },
    ],
    defaultMinutes: 3,
    cover: 'coral',
  },
];

export const breathingById = Object.fromEntries(breathingSessions.map((b) => [b.id, b]));
