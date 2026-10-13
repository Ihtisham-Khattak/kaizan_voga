import type { Equipment, Goal } from '@/store/types';

import { exerciseById } from './exercises';
import type { CoverTint, Level, Routine, RoutinePhase, RoutineStep, StyleId } from './types';

/**
 * Routines follow the 10-minute template:
 *   settle (30–60 s) → warm-up (1–2 min) → main (5–6 min, 3–5 poses) → cool-down (1–2 min) → close (30–60 s)
 * Shorter and longer routines scale the same shape.
 */

type Pair = [exerciseId: string, durationSec: number];
const S = (phase: RoutinePhase, ...pairs: Pair[]): RoutineStep[] =>
  pairs.map(([exerciseId, durationSec]) => ({ exerciseId, durationSec, phase }));

function routine(
  id: string,
  kind: Routine['kind'],
  title: string,
  subtitle: string,
  description: string,
  goals: Goal[],
  level: Level,
  style: StyleId,
  cover: CoverTint,
  steps: RoutineStep[],
  premium = false
): Routine {
  const exs = steps.map((s) => exerciseById[s.exerciseId]);
  const equipment = [...new Set(exs.flatMap((e) => e.tags.equipment))] as Equipment[];
  return {
    id,
    kind,
    title,
    subtitle,
    description,
    goals,
    level,
    style,
    steps,
    totalSec: steps.reduce((n, s) => n + s.durationSec, 0),
    equipment,
    chairFriendly: exs.every((e) => e.tags.accessibility.includes('chair-friendly')),
    premium,
    cover,
  };
}

export const routines: Routine[] = [
  // ───────────── 5-minute (×3) ─────────────
  routine(
    'r-01',
    'routine',
    '5-Minute Starter',
    'Your very first session',
    'A gentle introduction: settle your breath, loosen your neck and shoulders, and finish with a calm pause. No experience needed.',
    ['gentle', 'stress'],
    'beginner',
    'gentle',
    'sage',
    [
      ...S('settle', ['ex-41', 40]),
      ...S('warm-up', ['ex-27', 40]),
      ...S('main', ['ex-46', 50], ['ex-10', 60], ['ex-07', 60]),
      ...S('cool-down', ['ex-26', 30]),
      ...S('close', ['ex-43', 20]),
    ]
  ),
  routine(
    'r-02',
    'routine',
    'Desk Neck Reset',
    'A chair-friendly break',
    'Ease the tension that builds up at a desk with slow neck, shoulder and spine movements — all from your chair.',
    ['back-neck', 'focus'],
    'beginner',
    'chair',
    'sand',
    [
      ...S('settle', ['ex-46', 30]),
      ...S('warm-up', ['ex-27', 40], ['ex-26', 40]),
      ...S('main', ['ex-47', 50], ['ex-49', 50], ['ex-50', 50]),
      ...S('close', ['ex-43', 40]),
    ]
  ),
  routine(
    'r-03',
    'routine',
    'Morning Wake-Up',
    'Five easy minutes to start the day',
    'A soft, standing start: stretch tall, sway side to side and roll the stiffness out.',
    ['focus', 'gentle'],
    'beginner',
    'gentle',
    'coral',
    [
      ...S('settle', ['ex-01', 40]),
      ...S('warm-up', ['ex-27', 30]),
      ...S('main', ['ex-02', 60], ['ex-03', 70], ['ex-29', 70]),
      ...S('close', ['ex-01', 30]),
    ]
  ),

  // ───────────── 10-minute (×4) ─────────────
  routine(
    'r-04',
    'routine',
    'Morning Flow',
    '10 minutes to ease into your day',
    'Warm up gently, move through a few standing and seated poses and finish with a calm breath.',
    ['focus', 'flexibility', 'gentle'],
    'beginner',
    'hatha',
    'coral',
    [
      ...S('settle', ['ex-01', 45]),
      ...S('warm-up', ['ex-27', 45], ['ex-26', 45]),
      ...S('main', ['ex-02', 80], ['ex-03', 80], ['ex-17', 90], ['ex-16', 80]),
      ...S('cool-down', ['ex-09', 90]),
      ...S('close', ['ex-43', 45]),
    ]
  ),
  routine(
    'r-05',
    'routine',
    'Easy Back Stretch',
    'Slow stretches for a stiff back',
    'Gentle movements that may help you feel looser through your back and hips. Move slowly and stay within comfort.',
    ['back-neck', 'flexibility'],
    'beginner',
    'gentle',
    'mint',
    [
      ...S('settle', ['ex-41', 45]),
      ...S('warm-up', ['ex-17', 45], ['ex-29', 45]),
      ...S('main', ['ex-18', 80], ['ex-19', 80], ['ex-20', 90], ['ex-16', 80]),
      ...S('cool-down', ['ex-25', 90]),
      ...S('close', ['ex-34', 45]),
    ]
  ),
  routine(
    'r-06',
    'routine',
    'Midday Calm Break',
    'Step away, breathe, reset',
    'A short chair-friendly pause in the middle of a busy day to ease your shoulders and slow your breathing.',
    ['stress', 'focus'],
    'beginner',
    'breathing-mindfulness',
    'lavender',
    [
      ...S('settle', ['ex-41', 45]),
      ...S('warm-up', ['ex-27', 45], ['ex-26', 45]),
      ...S('main', ['ex-36', 90], ['ex-48', 80], ['ex-49', 80], ['ex-44', 80]),
      ...S('cool-down', ['ex-43', 90]),
      ...S('close', ['ex-41', 45]),
    ]
  ),
  routine(
    'r-07',
    'routine',
    'Balance & Focus',
    'Steady feet, quiet mind',
    'Supported balance poses and slow breathing to help you feel grounded. Keep a wall or chair close.',
    ['balance', 'focus'],
    'beginner',
    'mobility-balance',
    'sage',
    [
      ...S('settle', ['ex-01', 45]),
      ...S('warm-up', ['ex-05', 45], ['ex-30', 45]),
      ...S('main', ['ex-15', 80], ['ex-12', 80], ['ex-11', 90], ['ex-13', 80]),
      ...S('cool-down', ['ex-03', 90]),
      ...S('close', ['ex-42', 45]),
    ]
  ),

  // ───────────── 15–20 minute (×3) ─────────────
  routine(
    'r-08',
    'routine',
    'Gentle Full-Body',
    '15 minutes, head to toe',
    'A balanced practice that moves through standing, seated and floor poses at an unhurried pace.',
    ['flexibility', 'gentle', 'stress'],
    'beginner',
    'hatha',
    'sage',
    [
      ...S('settle', ['ex-41', 60]),
      ...S('warm-up', ['ex-27', 45], ['ex-26', 45], ['ex-29', 60]),
      ...S('main', ['ex-01', 60], ['ex-02', 90], ['ex-03', 90], ['ex-17', 90], ['ex-18', 90], ['ex-20', 100]),
      ...S('cool-down', ['ex-16', 80], ['ex-09', 80]),
      ...S('close', ['ex-34', 90]),
    ]
  ),
  routine(
    'r-09',
    'routine',
    'Stress Soother',
    'Slow movement and long exhales',
    'Restorative poses paired with longer-exhale breathing to help you feel unwound.',
    ['stress', 'sleep'],
    'beginner',
    'restorative',
    'lavender',
    [
      ...S('settle', ['ex-43', 60]),
      ...S('warm-up', ['ex-17', 60], ['ex-37', 90]),
      ...S('main', ['ex-16', 100], ['ex-25', 90], ['ex-19', 90], ['ex-20', 100]),
      ...S('cool-down', ['ex-33', 100], ['ex-32', 100]),
      ...S('close', ['ex-34', 120]),
    ]
  ),
  routine(
    'r-10',
    'routine',
    'Slow Flow & Stretch',
    '20 minutes of unhurried movement',
    'A longer, flowing practice that links gentle poses with your breath. Pause whenever you like.',
    ['flexibility', 'balance', 'focus'],
    'intermediate',
    'vinyasa',
    'coral',
    [
      ...S('settle', ['ex-41', 60]),
      ...S('warm-up', ['ex-27', 60], ['ex-29', 60], ['ex-38', 90]),
      ...S(
        'main',
        ['ex-04', 100],
        ['ex-02', 90],
        ['ex-11', 100],
        ['ex-17', 90],
        ['ex-22', 80],
        ['ex-18', 90],
        ['ex-20', 100]
      ),
      ...S('cool-down', ['ex-16', 90], ['ex-09', 90]),
      ...S('close', ['ex-34', 90]),
    ],
    true
  ),

  // ───────────── Sleep (×2) ─────────────
  routine(
    'r-11',
    'sleep',
    'Evening Wind-Down',
    'Ease into the night',
    'Slow stretches, long exhales and a still finish to help you shift out of your busy day.',
    ['sleep', 'stress'],
    'beginner',
    'restorative',
    'lavender',
    [
      ...S('settle', ['ex-43', 60]),
      ...S('warm-up', ['ex-19', 60]),
      ...S('main', ['ex-40', 180], ['ex-20', 100], ['ex-31', 120]),
      ...S('cool-down', ['ex-32', 100]),
      ...S('close', ['ex-34', 100]),
    ]
  ),
  routine(
    'r-12',
    'sleep',
    'Yoga Nidra Settle',
    'A guided body scan lying down',
    'A long, quiet body scan with a settling breath. Stay as still or as relaxed as feels natural.',
    ['sleep', 'stress'],
    'beginner',
    'restorative',
    'lavender',
    [
      ...S('settle', ['ex-41', 60]),
      ...S('warm-up', ['ex-19', 60]),
      ...S('main', ['ex-35', 480]),
      ...S('cool-down', ['ex-24', 120]),
      ...S('close', ['ex-34', 180]),
    ],
    true
  ),

  // ───────────── Quick relief (×5, 1–5 min) ─────────────
  routine(
    'qr-01',
    'quick-relief',
    'Calm my anxiety',
    '3 minutes · slow breathing',
    'A short, soothing breathing and shoulder-release sequence you can do anywhere. It may help you slow down.',
    ['stress'],
    'beginner',
    'breathing-mindfulness',
    'sage',
    [...S('settle', ['ex-41', 45]), ...S('main', ['ex-43', 75], ['ex-27', 30]), ...S('close', ['ex-46', 30])]
  ),
  routine(
    'qr-02',
    'quick-relief',
    'Desk neck reset',
    '3 minutes · from your chair',
    'Quick neck and shoulder movements to break up long hours sitting.',
    ['back-neck'],
    'beginner',
    'chair',
    'sand',
    [
      ...S('settle', ['ex-46', 25]),
      ...S('main', ['ex-26', 50], ['ex-27', 35], ['ex-50', 50]),
      ...S('close', ['ex-43', 20]),
    ]
  ),
  routine(
    'qr-03',
    'quick-relief',
    "Can't sleep",
    '5 minutes · lying down',
    'Slow breathing and a gentle knees-to-chest rock for nights when your mind is busy.',
    ['sleep'],
    'beginner',
    'restorative',
    'lavender',
    [...S('settle', ['ex-43', 90]), ...S('main', ['ex-19', 60], ['ex-20', 70]), ...S('close', ['ex-35', 80])]
  ),
  routine(
    'qr-04',
    'quick-relief',
    'Energy boost',
    '2 minutes · wake up',
    'A bright, easy mini-flow to shake off sluggishness without rushing.',
    ['focus'],
    'beginner',
    'gentle',
    'coral',
    [...S('settle', ['ex-01', 20]), ...S('main', ['ex-02', 40], ['ex-05', 30]), ...S('close', ['ex-44', 30])]
  ),
  routine(
    'qr-05',
    'quick-relief',
    'Before an exam',
    '3 minutes · steady and clear',
    'Steady breathing and a seated reset to help you feel more settled.',
    ['focus', 'stress'],
    'beginner',
    'breathing-mindfulness',
    'mint',
    [
      ...S('settle', ['ex-46', 25]),
      ...S('main', ['ex-42', 70], ['ex-27', 30], ['ex-44', 35]),
      ...S('close', ['ex-41', 20]),
    ]
  ),
];

export const routineById: Record<string, Routine> = Object.fromEntries(routines.map((r) => [r.id, r]));
