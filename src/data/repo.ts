/**
 * The ONLY module screens import content from. Today it reads local mock data synchronously;
 * a backend can replace the bodies with async fetches without changing any screen's layout.
 */
import type { Goal } from '@/store/types';

import { breathingById, breathingSessions } from './breathing';
import { exerciseById, exercises } from './exercises';
import { achievements, challenges, helplines, styles } from './misc';
import { programById, programs } from './programs';
import { routineById, routines } from './routines';
import type { Exercise, ExerciseCategory, Level, Routine } from './types';

export * from './types';

export const getExercise = (id: string) => exerciseById[id];
export const getRoutine = (id: string) => routineById[id];
export const getProgram = (id: string) => programById[id];
export const getBreathing = (id: string) => breathingById[id];

export const listExercises = () => exercises;
export const listRoutines = (kind?: Routine['kind']) =>
  kind ? routines.filter((r) => r.kind === kind) : routines;
export const listQuickRelief = () => routines.filter((r) => r.kind === 'quick-relief');
export const listSleep = () => routines.filter((r) => r.kind === 'sleep');
export const listPrograms = () => programs;
export const listBreathing = () => breathingSessions;
export const listAchievements = () => achievements;
export const listChallenges = () => challenges;
export const listStyles = () => styles;
export const listHelplines = () => helplines;

export const exercisesByCategory = (c: ExerciseCategory) => exercises.filter((e) => e.category === c);
export const routinesByGoal = (g: Goal) =>
  routines.filter((r) => r.kind !== 'quick-relief' && r.goals.includes(g));
export const routineMinutes = (r: Routine) => Math.max(1, Math.round(r.totalSec / 60));

export interface SearchFilters {
  query?: string;
  category?: ExerciseCategory;
  level?: Level;
  goal?: Goal;
  maxSec?: number;
  chairFriendly?: boolean;
}

const norm = (s: string) => s.toLowerCase().normalize('NFKD');

/** Simple client-side search across poses and routines; swap for a server search later. */
export function search(f: SearchFilters): { exercises: Exercise[]; routines: Routine[] } {
  const q = f.query ? norm(f.query.trim()) : '';
  const matchEx = (e: Exercise) =>
    (!q || norm(`${e.name} ${e.altName ?? ''} ${e.category}`).includes(q)) &&
    (!f.category || e.category === f.category) &&
    (!f.level || e.level === f.level) &&
    (!f.goal || e.tags.goal.includes(f.goal)) &&
    (!f.maxSec || e.durationSec <= f.maxSec) &&
    (!f.chairFriendly || e.tags.accessibility.includes('chair-friendly'));
  const matchRt = (r: Routine) =>
    (!q || norm(`${r.title} ${r.subtitle} ${r.style}`).includes(q)) &&
    (!f.level || r.level === f.level) &&
    (!f.goal || r.goals.includes(f.goal)) &&
    (!f.maxSec || r.totalSec <= f.maxSec) &&
    (!f.chairFriendly || r.chairFriendly);
  return {
    exercises: exercises.filter(matchEx),
    // Category only applies to poses.
    routines: f.category ? [] : routines.filter(matchRt),
  };
}
