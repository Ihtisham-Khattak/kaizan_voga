// Content models. Everything in src/data is replaceable by a backend later – screens only talk to src/data/repo.ts.

import type { BreathPhase } from '@/lib/breath';
import type { Equipment, Goal } from '@/store/types';

export type Level = 'beginner' | 'intermediate';

export type ExerciseCategory =
  | 'standing'
  | 'seated'
  | 'balance'
  | 'floor'
  | 'prone'
  | 'mobility'
  | 'restorative'
  | 'flows'
  | 'breathing'
  | 'chair';

/** none = symmetrical; both = do each side (shown as Left / Right in the player). */
export type Side = 'none' | 'both';

export type Position = 'seated' | 'standing' | 'floor' | 'prone' | 'supine' | 'kneeling';
export type Intensity = 'gentle' | 'light' | 'moderate';
export type AccessibilityTag =
  'chair-friendly' | 'low-wrist-load' | 'low-knee-load' | 'no-floor-transition' | 'balance-support';

export interface Modification {
  kind: 'chair' | 'wall' | 'props' | 'easier';
  title: string;
  text: string;
}

export interface Exercise {
  id: string;
  name: string;
  /** Traditional (Sanskrit) name where one is well established; null otherwise. */
  altName: string | null;
  category: ExerciseCategory;
  level: Level;
  durationSec: number;
  /** Breaths to hold / repeat, when counting breaths makes sense. */
  reps: number | null;
  side: Side;
  steps: string[];
  breathingCues: string[];
  setup: string;
  safeExit: string;
  commonMistakes: string[];
  modifications: Modification[];
  props: string[];
  cautions: string[];
  tags: {
    goal: Goal[];
    intensity: Intensity;
    position: Position;
    accessibility: AccessibilityTag[];
    equipment: Equipment[];
  };
  media: { type: 'placeholder' | 'image' | 'video'; uri: string | null; rights: string };
  review: { name: string; role: string; date: string };
  version: number;
}

export type RoutinePhase = 'settle' | 'warm-up' | 'main' | 'cool-down' | 'close';
export type CoverTint = 'sage' | 'mint' | 'sand' | 'coral' | 'lavender';
export type StyleId =
  'hatha' | 'gentle' | 'chair' | 'restorative' | 'vinyasa' | 'mobility-balance' | 'breathing-mindfulness';

export interface RoutineStep {
  exerciseId: string;
  durationSec: number;
  phase: RoutinePhase;
}

export interface Routine {
  id: string;
  kind: 'routine' | 'sleep' | 'quick-relief';
  title: string;
  subtitle: string;
  description: string;
  goals: Goal[];
  level: Level;
  style: StyleId;
  steps: RoutineStep[];
  totalSec: number;
  equipment: Equipment[];
  chairFriendly: boolean;
  premium: boolean;
  cover: CoverTint;
}

export interface BreathingSession {
  id: string;
  kind: 'breath' | 'body-scan';
  title: string;
  description: string;
  /** Soft "may help" wording only – no claims. */
  why: string;
  pattern: BreathPhase[];
  defaultMinutes: number;
  cover: CoverTint;
  /** Body-scan regions in order (body-scan only). */
  regions?: string[];
}

export interface ProgramDay {
  day: number;
  kind: 'session' | 'rest';
  title: string;
  routineId?: string;
}

export interface Program {
  id: string;
  title: string;
  description: string;
  weeks: number;
  days: ProgramDay[];
  level: Level;
  goals: Goal[];
  premium: boolean;
  cover: CoverTint;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  /** How it unlocks, in plain words. */
  criteria: string;
  icon: string;
  kaiMessage: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  days: number;
  cover: CoverTint;
}

export interface YogaStyle {
  id: StyleId;
  name: string;
  /** Plain-language explainer. */
  explainer: string;
  suits: string;
}

export interface Helpline {
  id: string;
  country: string;
  name: string;
  number: string;
  hours: string;
  /** Placeholder entries must be replaced with verified local data before release. */
  placeholder: boolean;
}
