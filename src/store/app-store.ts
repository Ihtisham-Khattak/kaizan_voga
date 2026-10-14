import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { register, storage } from './persist';
import type { Language, MotionPreference, ThemePreference } from './types';

interface AppState {
  /** Story is shown only on first launch. */
  hasSeenStory: boolean;
  /** Last personalization route reached, so a user can resume. */
  onboardingStep: string | null;
  onboardingComplete: boolean;
  ageConfirmed: boolean;
  safetyAcknowledgedAt: string | null;
  /** Where to go once the account gate is answered (set by the plan reveal). */
  postGateRoute: string | null;
  /** ISO date the 30-day journey began (set when onboarding completes). */
  journeyStartedAt: string | null;

  language: Language;
  theme: ThemePreference;
  motion: MotionPreference;
  captions: boolean;
  haptics: boolean;
  /** App-wide text size multiplier. */
  textScale: 1 | 1.15 | 1.3;
  highContrast: boolean;
  units: 'metric' | 'imperial';
  /** Offline downloads only over Wi-Fi. */
  wifiOnly: boolean;
  /** Anonymous usage stats – opt-in, off by default. */
  analytics: boolean;
  /** Share mindful minutes with Apple Health / Health Connect (UI only for now). */
  healthSync: boolean;

  setHasSeenStory: (v: boolean) => void;
  setOnboardingStep: (step: string | null) => void;
  completeOnboarding: () => void;
  confirmAge: () => void;
  acknowledgeSafety: () => void;
  setPostGateRoute: (r: string | null) => void;
  set: (
    patch: Partial<
      Pick<
        AppState,
        | 'language'
        | 'theme'
        | 'motion'
        | 'captions'
        | 'haptics'
        | 'textScale'
        | 'highContrast'
        | 'units'
        | 'wifiOnly'
        | 'analytics'
        | 'healthSync'
      >
    >
  ) => void;
  /** "Replay intro" – re-shows the story without touching any user data. */
  replayIntro: () => void;
  /** Start the 30-day path again from day 1 (history is kept). */
  restartJourney: () => void;
  reset: () => void;
}

const initial = {
  hasSeenStory: false,
  onboardingStep: null,
  onboardingComplete: false,
  ageConfirmed: false,
  safetyAcknowledgedAt: null,
  postGateRoute: null as string | null,
  journeyStartedAt: null as string | null,
  language: 'en' as Language,
  theme: 'system' as ThemePreference,
  motion: 'system' as MotionPreference,
  captions: true,
  haptics: true,
  textScale: 1 as 1 | 1.15 | 1.3,
  highContrast: false,
  units: 'metric' as const,
  wifiOnly: true,
  analytics: false,
  healthSync: false,
};

export const useAppStore = register(
  create<AppState>()(
    persist(
      (set) => ({
        ...initial,
        setHasSeenStory: (hasSeenStory) => set({ hasSeenStory }),
        setOnboardingStep: (onboardingStep) => set({ onboardingStep }),
        completeOnboarding: () =>
          set((s) => ({
            onboardingComplete: true,
            onboardingStep: null,
            journeyStartedAt: s.journeyStartedAt ?? new Date().toISOString(),
          })),
        confirmAge: () => set({ ageConfirmed: true }),
        acknowledgeSafety: () => set({ safetyAcknowledgedAt: new Date().toISOString() }),
        setPostGateRoute: (postGateRoute) => set({ postGateRoute }),
        set: (patch) => set(patch),
        replayIntro: () => set({ hasSeenStory: false }),
        restartJourney: () => set({ journeyStartedAt: new Date().toISOString() }),
        reset: () => set(initial),
      }),
      { name: 'kz-app', version: 1, storage }
    )
  )
);
