import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { register, storage } from './persist';
import type {
  Ambience,
  Equipment,
  Experience,
  Goal,
  Limitation,
  Movement,
  PreferredTime,
  ReminderSettings,
  VoicePreference,
  Weekday,
} from './types';

export interface Prefs {
  name: string;
  /** Which illustrated companion shows on the Profile. */
  avatar: 'zara' | 'ali' | 'hina' | 'omar';
  goals: Goal[];
  experience: Experience | null;
  minutesPerDay: 5 | 10 | 15 | 20;
  preferredTime: PreferredTime | null;
  practiceDays: Weekday[];
  movement: Movement | null;
  equipment: Equipment[];
  /** Optional, stays on device. */
  limitations: Limitation[];
  chairMode: boolean;
  voice: VoicePreference;
  music: boolean;
  ambience: Ambience;
  reminder: ReminderSettings;
}

interface PrefsState extends Prefs {
  patch: (p: Partial<Prefs>) => void;
  toggleGoal: (g: Goal) => void;
  reset: () => void;
}

export const defaultPrefs: Prefs = {
  name: '',
  avatar: 'zara',
  goals: [],
  experience: null,
  minutesPerDay: 10,
  preferredTime: null,
  practiceDays: [1, 2, 3, 4, 5, 6, 7],
  movement: null,
  equipment: [],
  limitations: [],
  chairMode: false,
  voice: 'female',
  music: true,
  ambience: 'rain',
  reminder: {
    enabled: false,
    time: '08:00',
    days: [1, 2, 3, 4, 5],
    quietHours: { enabled: true, from: '21:30', to: '07:00' },
    tone: 'bell',
  },
};

export const usePrefsStore = register(
  create<PrefsState>()(
    persist(
      (set) => ({
        ...defaultPrefs,
        patch: (p) => set(p),
        toggleGoal: (g) =>
          set((s) => ({ goals: s.goals.includes(g) ? s.goals.filter((x) => x !== g) : [...s.goals, g] })),
        reset: () => set(defaultPrefs),
      }),
      { name: 'kz-prefs', version: 1, storage }
    )
  )
);
