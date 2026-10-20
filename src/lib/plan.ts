import { getRoutine } from '@/data/repo';
import { firstSessionFor, type Profile } from '@/lib/recommend';
import type { PreferredTime } from '@/store/types';

/** Plan helpers. The ranking itself lives in src/lib/recommend.ts (FN-09). */
export const FIRST_SESSION_ID = 'r-01'; // the 5-minute starter, always gentle

/** The first session: the 5-minute starter when it suits the person, otherwise the best gentle fit (never the floor for chair-only). */
export const firstSession = (profile?: Profile) =>
  profile ? firstSessionFor(profile) : getRoutine(FIRST_SESSION_ID);

/** Suggested reminder time for each preferred time of day. */
export const suggestedReminderTime: Record<PreferredTime, string> = {
  morning: '08:00',
  afternoon: '13:00',
  evening: '20:00',
  varies: '09:00',
};
