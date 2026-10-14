import { getExercise, type Routine, type RoutinePhase } from '@/data/repo';
import type { VoicePreference, Ambience } from '@/store/types';

export interface SessionConfig {
  routineId: string;
  /** Total duration multiplier (chosen duration / designed duration). */
  scale: number;
  pace: 'slow' | 'normal';
  voice: VoicePreference;
  music: boolean;
  ambience: Ambience;
  focus: string[];
  chairMode: boolean;
}

export interface PlayerStep {
  exerciseId: string;
  durationSec: number;
  side?: 'left' | 'right';
  phase: RoutinePhase;
}

const MIN_STEP = 15;

/**
 * Expands a routine into the steps the player runs: scales durations (chosen length + slow pace) and splits
 * two-sided poses into Left then Right (each side gets half the time).
 */
export function buildPlan(routine: Routine, cfg: Pick<SessionConfig, 'scale' | 'pace'>): PlayerStep[] {
  const factor = cfg.scale * (cfg.pace === 'slow' ? 1.25 : 1);
  const out: PlayerStep[] = [];
  for (const s of routine.steps) {
    const e = getExercise(s.exerciseId);
    const total = Math.max(MIN_STEP, Math.round((s.durationSec * factor) / 5) * 5);
    if (e?.side === 'both') {
      const half = Math.max(MIN_STEP, Math.round(total / 2 / 5) * 5);
      out.push({ exerciseId: s.exerciseId, durationSec: half, side: 'left', phase: s.phase });
      out.push({ exerciseId: s.exerciseId, durationSec: half, side: 'right', phase: s.phase });
    } else {
      out.push({ exerciseId: s.exerciseId, durationSec: total, phase: s.phase });
    }
  }
  return out;
}

export const planTotalSec = (plan: PlayerStep[]) => plan.reduce((n, s) => n + s.durationSec, 0);
