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

  language: Language;
  theme: ThemePreference;
  motion: MotionPreference;
  captions: boolean;
  haptics: boolean;
  largerText: boolean;
  units: 'metric' | 'imperial';

  setHasSeenStory: (v: boolean) => void;
  setOnboardingStep: (step: string | null) => void;
  completeOnboarding: () => void;
  confirmAge: () => void;
  acknowledgeSafety: () => void;
  set: (patch: Partial<Pick<AppState, 'language' | 'theme' | 'motion' | 'captions' | 'haptics' | 'largerText' | 'units'>>) => void;
  /** "Replay intro" – re-shows the story without touching any user data. */
  replayIntro: () => void;
  reset: () => void;
}

const initial = {
  hasSeenStory: false,
  onboardingStep: null,
  onboardingComplete: false,
  ageConfirmed: false,
  safetyAcknowledgedAt: null,
  language: 'en' as Language,
  theme: 'system' as ThemePreference,
  motion: 'system' as MotionPreference,
  captions: true,
  haptics: true,
  largerText: false,
  units: 'metric' as const,
};

export const useAppStore = register(
  create<AppState>()(
    persist(
      (set) => ({
        ...initial,
        setHasSeenStory: (hasSeenStory) => set({ hasSeenStory }),
        setOnboardingStep: (onboardingStep) => set({ onboardingStep }),
        completeOnboarding: () => set({ onboardingComplete: true, onboardingStep: null }),
        confirmAge: () => set({ ageConfirmed: true }),
        acknowledgeSafety: () => set({ safetyAcknowledgedAt: new Date().toISOString() }),
        set: (patch) => set(patch),
        replayIntro: () => set({ hasSeenStory: false }),
        reset: () => set(initial),
      }),
      { name: 'kz-app', version: 1, storage }
    )
  )
);
