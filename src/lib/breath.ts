/** Signature breathing motif timings – inhale 4 s, hold, exhale 6 s. Pure (no RN imports) so data scripts can use it. */
export const BREATH = { inhaleMs: 4000, holdMs: 1000, exhaleMs: 6000 } as const;

export type BreathKind = 'inhale' | 'hold' | 'exhale' | 'rest';
export interface BreathPhase {
  kind: BreathKind;
  ms: number;
}

/** Signature motif: expands 4 s, holds briefly, contracts 6 s. */
export const CALM_BREATH: BreathPhase[] = [
  { kind: 'inhale', ms: BREATH.inhaleMs },
  { kind: 'hold', ms: BREATH.holdMs },
  { kind: 'exhale', ms: BREATH.exhaleMs },
];

/** Beginner-gentle box breathing (3-3-3-3, shorter than the classic 4-4-4-4). Nothing forceful. */
export const BOX_BREATH: BreathPhase[] = [
  { kind: 'inhale', ms: 3000 },
  { kind: 'hold', ms: 3000 },
  { kind: 'exhale', ms: 3000 },
  { kind: 'rest', ms: 3000 },
];

/** Longer exhale than inhale – 4 in, 6 out. */
export const LONG_EXHALE: BreathPhase[] = [
  { kind: 'inhale', ms: 4000 },
  { kind: 'exhale', ms: 6000 },
];

export const cycleMs = (phases: BreathPhase[]) => phases.reduce((n, p) => n + p.ms, 0);
