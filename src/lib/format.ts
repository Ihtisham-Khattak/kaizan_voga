import type { TFunction } from 'i18next';

/** "45 sec" under 90 s, otherwise whole minutes ("10 min"). */
export function formatDuration(sec: number, t: TFunction): string {
  if (sec < 90) return t('cards.seconds', { count: sec });
  return t('common.minutes', { count: Math.round(sec / 60) });
}

export const minutesOf = (sec: number) => Math.max(1, Math.round(sec / 60));

/** "08:00" → "8:00 AM" (locale aware). */
export function formatClock(hhmm: string, locale: string) {
  const [h, m] = hhmm.split(':').map(Number);
  const d = new Date(2024, 0, 1, h, m);
  return new Intl.DateTimeFormat(locale, { hour: 'numeric', minute: '2-digit' }).format(d);
}

/** Add minutes to "HH:mm", wrapping around midnight. */
export function addMinutes(hhmm: string, delta: number) {
  const [h, m] = hhmm.split(':').map(Number);
  const total = (((h * 60 + m + delta) % 1440) + 1440) % 1440;
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}
