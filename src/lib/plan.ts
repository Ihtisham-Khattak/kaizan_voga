import { getRoutine } from '@/data/repo';
import type { PreferredTime } from '@/store/types';

/** Mock plan generator (rule-based). FN-09 replaces this with the real engine. */
export const FIRST_SESSION_ID = 'r-01'; // the 5-minute starter, always gentle

export const firstSession = () => getRoutine(FIRST_SESSION_ID);

/** Suggested reminder time for each preferred time of day. */
export const suggestedReminderTime: Record<PreferredTime, string> = {
  morning: '08:00',
  afternoon: '13:00',
  evening: '20:00',
  varies: '09:00',
};
