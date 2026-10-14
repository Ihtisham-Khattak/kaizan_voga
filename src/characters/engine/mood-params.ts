import type { Mood } from '@/store/types';

/** Pure data (no React) so tooling can use it too. */
export interface FaceParams {
  /** Mouth curve: -1 frown … 0 flat … +1 broad smile */
  mouth: number;
  /** Brow tilt: +1 worried (inner ends raised) … -1 relaxed arch (outer ends raised) */
  tilt: number;
  /** Brow height: + lowers, − raises */
  lift: number;
  /** Eye openness 0.2 … 1 */
  eye: number;
  /** Brow arch */
  arch: number;
}

export const MOOD_PARAMS: Record<Mood, FaceParams> = {
  stressed: { mouth: -0.55, tilt: 1, lift: -1, eye: 1, arch: 0 },
  tired: { mouth: -0.15, tilt: 0.35, lift: 3, eye: 0.55, arch: 0 },
  neutral: { mouth: 0, tilt: 0, lift: 0, eye: 1, arch: 1 },
  calm: { mouth: 0.55, tilt: -0.1, lift: 1, eye: 0.78, arch: 2.6 },
  happy: { mouth: 0.95, tilt: -0.35, lift: -3, eye: 1, arch: 2.5 },
};
