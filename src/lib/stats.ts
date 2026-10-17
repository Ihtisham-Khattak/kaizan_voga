import { getRoutine, getStyle } from '@/data/repo';
import { weekdayOrder } from '@/lib/weekdays';
import type { Mood, SessionRecord } from '@/store/types';

/** Local calendar-day key, e.g. "2026-10-14". */
export const dayKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

/** Days on which at least some practice happened. Partial sessions count: rest and effort both matter. */
export const practicedKeys = (sessions: SessionRecord[]) =>
  new Set(sessions.filter((s) => s.practicedSec > 0).map((s) => dayKey(new Date(s.at))));

export const totalMinutes = (sessions: SessionRecord[]) =>
  Math.round(sessions.reduce((n, s) => n + s.practicedSec, 0) / 60);

/** Name of the yoga style practised most, or null. Breathing sessions count as their own "style". */
export function favouriteStyle(sessions: SessionRecord[]): string | null {
  const counts = new Map<string, number>();
  for (const s of sessions) {
    const id = s.kind === 'breathing' ? 'breathing-mindfulness' : getRoutine(s.contentId)?.style;
    if (id) counts.set(id, (counts.get(id) ?? 0) + 1);
  }
  const top = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
  return top ? (getStyle(top[0] as never)?.name ?? null) : null;
}

export const MOOD_LEVEL: Record<Mood, number> = { stressed: 1, tired: 2, neutral: 3, calm: 4, happy: 5 };

/** Start of the week containing `d`, using the device's first weekday. */
export function startOfWeek(d: Date) {
  const first = weekdayOrder()[0];
  const iso = d.getDay() === 0 ? 7 : d.getDay();
  const back = (iso - first + 7) % 7;
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() - back);
}

export const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

/** Minutes practised on each of the 7 days of the week containing `today` (first weekday follows the device). */
export function weekMinutes(sessions: SessionRecord[], today = new Date()) {
  const start = startOfWeek(today);
  return Array.from({ length: 7 }, (_, i) => {
    const day = addDays(start, i);
    const key = dayKey(day);
    const sec = sessions
      .filter((s) => dayKey(new Date(s.at)) === key)
      .reduce((n, s) => n + s.practicedSec, 0);
    return {
      date: day,
      key,
      minutes: Math.round(sec / 60),
      isToday: key === dayKey(today),
      isFuture: day > today && key !== dayKey(today),
    };
  });
}

/**
 * Days in a row with some practice, counted back from today. Today not being practised yet does not break it
 * (the day is not over); only a fully missed day ends it. Rest days are never described as failure in the UI.
 */
export function currentStreak(sessions: SessionRecord[], today = new Date()) {
  const days = practicedKeys(sessions);
  let d = startOfDay(today);
  if (!days.has(dayKey(d))) d = addDays(d, -1);
  let n = 0;
  while (days.has(dayKey(d))) {
    n += 1;
    d = addDays(d, -1);
  }
  return n;
}
