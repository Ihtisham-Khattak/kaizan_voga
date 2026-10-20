import type { ReminderSettings, Weekday } from '@/store/types';

/** One weekly notification: `weekday` follows the notification API (1 = Sunday … 7 = Saturday); `iso` is our 1 = Monday … 7 = Sunday. */
export interface Slot {
  iso: Weekday;
  weekday: number;
  hour: number;
  minute: number;
}

const minutes = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

/** True when `at` (minutes after midnight) is inside the quiet window, which may run overnight (21:30 to 07:00). */
export function inQuietHours(at: number, from: string, to: string) {
  const a = minutes(from);
  const b = minutes(to);
  if (a === b) return false;
  return a < b ? at >= a && at < b : at >= a || at < b;
}

/**
 * When to send the daily nudge: only on the chosen days, at the chosen time, but never inside quiet hours: a time that
 * falls in the quiet window moves to the moment it ends. Pure, so it can be tested without a phone.
 */
export function reminderSlots(s: ReminderSettings): Slot[] {
  if (!s.enabled) return [];
  let at = minutes(s.time);
  if (s.quietHours.enabled && inQuietHours(at, s.quietHours.from, s.quietHours.to))
    at = minutes(s.quietHours.to);
  const hour = Math.floor(at / 60) % 24;
  const minute = at % 60;
  return [...new Set(s.days)]
    .sort((x, y) => x - y)
    .map((iso) => ({ iso, weekday: iso === 7 ? 1 : iso + 1, hour, minute }));
}
