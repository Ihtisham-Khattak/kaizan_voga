import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { register, storage } from './persist';
import type { Mood, MoodLog, MonthlyReflection, SessionRecord } from './types';

interface ProgressState {
  sessions: SessionRecord[];
  moodLogs: MoodLog[];
  reflections: MonthlyReflection[];
  achievementsUnlocked: Record<string, string>; // id -> ISO date
  /** challengeId -> ISO dates practiced */
  challenges: Record<string, string[]>;
  /** Mood chosen on Home check-in today (used for before → after). */
  addSession: (s: SessionRecord) => void;
  logMood: (mood: Mood, context: MoodLog['context'], sessionId?: string) => MoodLog;
  addReflection: (r: MonthlyReflection) => void;
  unlock: (achievementId: string) => void;
  joinChallenge: (id: string) => void;
  reset: () => void;
}

const initial = {
  sessions: [] as SessionRecord[],
  moodLogs: [] as MoodLog[],
  reflections: [] as MonthlyReflection[],
  achievementsUnlocked: {} as Record<string, string>,
  challenges: {} as Record<string, string[]>,
};

const uid = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

export const useProgressStore = register(
  create<ProgressState>()(
    persist(
      (set) => ({
        ...initial,
        addSession: (s) => set((st) => ({ sessions: [s, ...st.sessions] })),
        logMood: (mood, context, sessionId) => {
          const log: MoodLog = { id: uid(), at: new Date().toISOString(), mood, context, sessionId };
          set((st) => ({ moodLogs: [log, ...st.moodLogs] }));
          return log;
        },
        addReflection: (r) => set((st) => ({ reflections: [r, ...st.reflections] })),
        unlock: (id) =>
          set((st) =>
            st.achievementsUnlocked[id]
              ? st
              : { achievementsUnlocked: { ...st.achievementsUnlocked, [id]: new Date().toISOString() } }
          ),
        joinChallenge: (id) =>
          set((st) => ({ challenges: { ...st.challenges, [id]: st.challenges[id] ?? [] } })),
        reset: () => set(initial),
      }),
      { name: 'kz-progress', version: 1, storage }
    )
  )
);
