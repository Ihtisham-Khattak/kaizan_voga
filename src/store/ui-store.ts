import { create } from 'zustand';

/** Transient UI state (not persisted). */
interface UiState {
  practiceSheet: boolean;
  openPractice: () => void;
  closePractice: () => void;
  /** Home: guest banner dismissed this session. */
  guestBannerDismissed: boolean;
  dismissGuestBanner: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  practiceSheet: false,
  openPractice: () => set({ practiceSheet: true }),
  closePractice: () => set({ practiceSheet: false }),
  guestBannerDismissed: false,
  dismissGuestBanner: () => set({ guestBannerDismissed: true }),
}));

// dev-only handle for browser tests (.tools/*.js)
if (__DEV__ && typeof window !== 'undefined')
  (window as unknown as { __ui?: typeof useUiStore }).__ui = useUiStore;
