import type { TFunction } from 'i18next';

/** "45 sec" under 90 s, otherwise whole minutes ("10 min"). */
export function formatDuration(sec: number, t: TFunction): string {
  if (sec < 90) return t('cards.seconds', { count: sec });
  return t('common.minutes', { count: Math.round(sec / 60) });
}

export const minutesOf = (sec: number) => Math.max(1, Math.round(sec / 60));
