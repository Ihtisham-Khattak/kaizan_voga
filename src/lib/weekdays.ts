import { getCalendars } from 'expo-localization';

import type { Weekday } from '@/store/types';

/** ISO weekdays in the user's locale order (e.g. Sunday-first or Monday-first). */
export function weekdayOrder(): Weekday[] {
  const fw = getCalendars()[0]?.firstWeekday; // 1 = Sunday … 7 = Saturday
  const first = fw ? (fw === 1 ? 7 : fw - 1) : 1;
  return Array.from({ length: 7 }, (_, i) => (((first - 1 + i) % 7) + 1) as Weekday);
}

/** Localised weekday name. 'narrow' gives M T W…, 'long' is for screen readers. */
export function weekdayLabel(iso: Weekday, style: 'narrow' | 'short' | 'long', locale: string) {
  const monday = new Date(2024, 0, 1); // a known Monday
  monday.setDate(1 + (iso - 1));
  return new Intl.DateTimeFormat(locale, { weekday: style }).format(monday);
}
