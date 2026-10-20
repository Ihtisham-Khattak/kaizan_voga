import { getProgram, getRoutine, type ProgramDay, type Routine } from '@/data/repo';
import { adaptRoutine, type Profile } from '@/lib/recommend';
import { useAppStore } from '@/store/app-store';
import { usePrefsStore } from '@/store/prefs-store';
import { useProgressStore } from '@/store/progress-store';
import type { SessionRecord } from '@/store/types';

export const JOURNEY_ID = 'p-30';
export const JOURNEY_DAYS = 30;

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
export const isSameDay = (a: Date, b: Date) => startOfDay(a).getTime() === startOfDay(b).getTime();

/** Day 1..30 of the journey (clamped). */
export function journeyDay(startedAt: string | null, now = new Date()): number {
  if (!startedAt) return 1;
  const days = Math.floor(
    (startOfDay(now).getTime() - startOfDay(new Date(startedAt)).getTime()) / 86_400_000
  );
  return Math.min(JOURNEY_DAYS, Math.max(1, days + 1));
}

export interface TodayPlan {
  day: number;
  total: number;
  entry: ProgramDay;
  routine?: Routine;
  isRest: boolean;
}

/** Today's entry in the 30-day program, adapted to the person (a routine that is unsafe for them is swapped for a similar one). */
export function todayPlan(startedAt: string | null, now = new Date(), profile?: Profile): TodayPlan {
  const program = getProgram(JOURNEY_ID);
  const day = journeyDay(startedAt, now);
  const entry = program.days[day - 1];
  return {
    day,
    total: JOURNEY_DAYS,
    entry,
    routine: entry.routineId
      ? profile
        ? adaptRoutine(getRoutine(entry.routineId), profile)
        : getRoutine(entry.routineId)
      : undefined,
    isRest: entry.kind === 'rest',
  };
}

export const useTodayPlan = () => {
  const prefs = usePrefsStore();
  return todayPlan(
    useAppStore((s) => s.journeyStartedAt),
    new Date(),
    prefs
  );
};

/** Sessions that happened on `day`. */
export const sessionsOn = (sessions: SessionRecord[], day: Date) =>
  sessions.filter((s) => isSameDay(new Date(s.at), day));
export const useSessionsOn = (day: Date) =>
  sessionsOn(
    useProgressStore((s) => s.sessions),
    day
  );

export type Part = 'morning' | 'afternoon' | 'evening';
export const partOfDay = (d = new Date()): Part =>
  d.getHours() < 12 ? 'morning' : d.getHours() < 18 ? 'afternoon' : 'evening';
