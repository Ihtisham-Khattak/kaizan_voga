import { getExercise, listRoutines, type Exercise, type Routine } from '@/data/repo';
import type { Equipment, Experience, Goal, Limitation, Movement, PreferredTime } from '@/store/types';

/**
 * The recommendation engine (card FN-09). Pure functions: given what the person told us at onboarding, it decides
 * which routines are safe and sensible for them and ranks the rest. Hard rules (chair only, avoid the floor, no
 * equipment you do not have) remove routines; everything else only adds or removes points. Each result carries the
 * reasons, so the app can say *why* something is suggested.
 */
export interface Profile {
  goals: Goal[];
  experience: Experience | null;
  minutesPerDay: number;
  preferredTime: PreferredTime | null;
  movement: Movement | null;
  equipment: Equipment[];
  limitations: Limitation[];
  chairMode: boolean;
}

export interface Recent {
  /** Routine ids practised in the last few days (most recent first). */
  routineIds: string[];
}

export interface Scored {
  routine: Routine;
  score: number;
  reasons: string[];
}

const FLOOR_POSITIONS = new Set(['floor', 'prone', 'supine', 'kneeling']);

const poses = (r: Routine): Exercise[] => r.steps.map((s) => getExercise(s.exerciseId)).filter(Boolean);

/** Why a routine can NOT be offered to this person (null = fine). Hard rules only. */
export function blockedReason(r: Routine, p: Profile): string | null {
  const ex = poses(r);
  const chairOnly = p.chairMode || p.limitations.includes('chair-only');
  if (chairOnly && !r.chairFriendly) return 'chair-only';
  if (p.limitations.includes('avoid-floor') && ex.some((e) => FLOOR_POSITIONS.has(e.tags.position)))
    return 'avoid-floor';
  if (
    p.limitations.includes('knee') &&
    ex.some((e) => e.tags.position === 'kneeling' && !e.tags.accessibility.includes('low-knee-load'))
  )
    return 'knee';
  if (
    p.limitations.includes('wrist') &&
    ex.some(
      (e) =>
        (e.tags.position === 'prone' || e.category === 'prone') &&
        !e.tags.accessibility.includes('low-wrist-load')
    )
  )
    return 'wrist';
  // equipment: "none" means no props at all; otherwise every prop the routine uses must be owned (a chair is never required of a mat-only person)
  const owned = new Set(p.equipment.filter((e) => e !== 'none'));
  const noProps = p.equipment.includes('none');
  const needs = r.equipment.filter((e) => e !== 'none');
  if (noProps && needs.length) return 'equipment';
  if (p.equipment.length && needs.some((e) => !owned.has(e))) return 'equipment';
  if (p.experience === 'beginner' && r.level === 'intermediate') return 'level';
  return null;
}

/** Points for how well a routine fits the person (higher is better) plus the reasons. */
export function scoreRoutine(r: Routine, p: Profile, recent: Recent = { routineIds: [] }): Scored {
  let score = 0;
  const reasons: string[] = [];
  const goalHits = r.goals.filter((g) => p.goals.includes(g));
  if (goalHits.length) {
    score += goalHits.length * 4;
    reasons.push('goal');
  }
  // length: closest to the minutes they chose
  const minutes = r.totalSec / 60;
  const gap = Math.abs(minutes - p.minutesPerDay);
  score += Math.max(-4, 3 - gap * 0.6);
  if (gap <= 2) reasons.push('time');
  // level
  if (p.experience === 'experienced' && r.level === 'intermediate') {
    score += 2;
    reasons.push('level');
  }
  if (p.experience === 'beginner' && r.level === 'beginner') score += 1;
  // movement preference
  const ex = poses(r);
  const share = (pred: (e: Exercise) => boolean) => (ex.length ? ex.filter(pred).length / ex.length : 0);
  if (p.movement === 'seated') score += share((e) => e.tags.position === 'seated') * 4;
  if (p.movement === 'standing') score += share((e) => e.tags.position === 'standing') * 4;
  if (p.movement === 'floor') score += share((e) => FLOOR_POSITIONS.has(e.tags.position)) * 4;
  if (p.movement === 'low-impact') score += share((e) => e.tags.intensity === 'gentle') * 3;
  if (p.movement && p.movement !== 'mixed' && share(() => true) > 0) reasons.push('movement');
  // time of day
  if (
    p.preferredTime === 'evening' &&
    (r.style === 'restorative' || r.style === 'yin' || r.kind === 'sleep')
  ) {
    score += 3;
    reasons.push('evening');
  }
  if (
    p.preferredTime === 'morning' &&
    ['hatha', 'vinyasa', 'gentle', 'power'].includes(r.style) &&
    r.kind !== 'sleep'
  ) {
    score += 2;
    reasons.push('morning');
  }
  if (p.preferredTime === 'morning' && r.kind === 'sleep') score -= 3;
  // balance concerns
  if (p.limitations.includes('balance')) {
    const risky = share((e) => e.category === 'balance' && !e.tags.accessibility.includes('balance-support'));
    score -= risky * 6;
  }
  // freshness: avoid repeating what they just did
  const idx = recent.routineIds.indexOf(r.id);
  if (idx >= 0) score -= Math.max(1, 5 - idx);
  return { routine: r, score, reasons };
}

/** Routines this person can do, best first. `limit` trims the list; quick-relief sessions are left out (they live on Home). */
export function recommend(
  p: Profile,
  recent: Recent = { routineIds: [] },
  limit = 6,
  exclude: string[] = []
): Scored[] {
  return listRoutines()
    .filter((r) => r.kind !== 'quick-relief' && !exclude.includes(r.id))
    .filter((r) => blockedReason(r, p) === null)
    .map((r) => scoreRoutine(r, p, recent))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/**
 * The very first session. Always short and gentle: the 5-minute starter when it suits them, otherwise the best fit of
 * the short beginner routines (so a chair-only person is never sent to the floor).
 */
export function firstSessionFor(p: Profile): Routine {
  const short = listRoutines().filter(
    (r) => r.kind === 'routine' && r.totalSec <= 6 * 60 && r.level === 'beginner'
  );
  const ok = short.filter((r) => blockedReason(r, { ...p, experience: 'beginner' }) === null);
  const pool = ok.length ? ok : short;
  const starter = pool.find((r) => r.id === 'r-01');
  if (starter) return starter;
  return pool.map((r) => scoreRoutine(r, p)).sort((a, b) => b.score - a.score)[0].routine;
}

/**
 * Keep a program day that is safe for this person; swap one that is not for the best similar routine
 * (same length range, ranked by the engine). Rest days and routines that already fit are untouched.
 */
export function adaptRoutine(r: Routine, p: Profile): Routine {
  if (blockedReason(r, p) === null) return r;
  const alt = recommend(p, { routineIds: [] }, 20, [r.id]).filter(
    (s) => Math.abs(s.routine.totalSec - r.totalSec) <= 6 * 60
  );
  return (alt[0] ?? recommend(p, { routineIds: [] }, 1, [r.id])[0])?.routine ?? r;
}
