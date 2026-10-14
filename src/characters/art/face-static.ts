import type { Mood } from '@/store/types';

import { MOOD_PARAMS } from '../engine/mood-params';
import type { Prim } from './types';
import { art } from '@/theme/illustration';

/**
 * Static (non-animated) face in the 0–100 face box – the reference the animated <Face> follows,
 * and what dev tooling renders. `boost` thickens strokes/eyes for smaller heads.
 */
export function faceStatic(
  mood: Mood,
  opts: { boost?: number; ink?: string; blush?: string; nose?: string } = {}
): Prim[] {
  const { boost = 1, ink = art.ink, blush = art.coral, nose } = opts;
  const p = MOOD_PARAMS[mood];
  const base = 33 + p.lift;
  const outer = base + p.tilt * 3;
  const inner = base - p.tilt * 3;
  const eyeR = 4.4 * (0.55 + 0.45 * p.eye) * (1 + (boost - 1) * 0.6);
  const w = 14 + Math.max(0, p.mouth) * 4;
  const out: Prim[] = [
    { k: 'circle', cx: 21, cy: 61, r: 6.5, fill: blush, op: 0.3 },
    { k: 'circle', cx: 79, cy: 61, r: 6.5, fill: blush, op: 0.3 },
    {
      k: 'path',
      d: `M24 ${outer} Q33 ${(outer + inner) / 2 - p.arch} 42 ${inner}`,
      stroke: ink,
      sw: 2.6 * boost,
      cap: 'round',
      fill: 'none',
    },
    {
      k: 'path',
      d: `M76 ${outer} Q67 ${(outer + inner) / 2 - p.arch} 58 ${inner}`,
      stroke: ink,
      sw: 2.6 * boost,
      cap: 'round',
      fill: 'none',
    },
    { k: 'circle', cx: 34, cy: 48, r: eyeR, fill: ink },
    { k: 'circle', cx: 66, cy: 48, r: eyeR, fill: ink },
    {
      k: 'circle',
      cx: 34 + eyeR * 0.35,
      cy: 48 - eyeR * 0.35,
      r: Math.max(0.8, eyeR * 0.28),
      fill: art.white,
      op: 0.9,
    },
    {
      k: 'circle',
      cx: 66 + eyeR * 0.35,
      cy: 48 - eyeR * 0.35,
      r: Math.max(0.8, eyeR * 0.28),
      fill: art.white,
      op: 0.9,
    },
    {
      k: 'path',
      d: `M${50 - w} 67 Q50 ${67 + p.mouth * 13} ${50 + w} 67`,
      stroke: ink,
      sw: 2.8 * boost,
      cap: 'round',
      fill: 'none',
    },
  ];
  if (nose)
    out.push({
      k: 'path',
      d: 'M49 52 Q47.5 58 51.5 58.5',
      stroke: nose,
      sw: 1.8 * boost,
      cap: 'round',
      fill: 'none',
      op: 0.8,
    });
  return out;
}
