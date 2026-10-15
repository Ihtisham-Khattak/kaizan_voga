import { create } from 'zustand';

/** What the "this is part of Premium" sheet is about. */
export type LockReason = 'content' | 'downloads' | 'custom-routines' | 'insights' | 'voices';

/** Transient UI state (not persisted). */
interface UiState {
  practiceSheet: boolean;
  openPractice: () => void;
  closePractice: () => void;
  /** Home: guest banner dismissed this session. */
  guestBannerDismissed: boolean;
  dismissGuestBanner: () => void;
  /** Premium gating: the upsell sheet opened by `gate()` in lib/entitlement.ts. */
  /** Dev toggles: preview the offline banner and force every screen's loading skeleton. */
  forceOffline: boolean;
  forceLoading: boolean;
  setForceOffline: (v: boolean) => void;
  setForceLoading: (v: boolean) => void;
  locked: LockReason | null;
  openLocked: (reason: LockReason) => void;
  closeLocked: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  practiceSheet: false,
  openPractice: () => set({ practiceSheet: true }),
  closePractice: () => set({ practiceSheet: false }),
  guestBannerDismissed: false,
  dismissGuestBanner: () => set({ guestBannerDismissed: true }),
  forceOffline: false,
  forceLoading: false,
  setForceOffline: (forceOffline) => set({ forceOffline }),
  setForceLoading: (forceLoading) => set({ forceLoading }),
  locked: null,
  openLocked: (locked) => set({ locked }),
  closeLocked: () => set({ locked: null }),
}));

// dev-only handle for browser tests (.tools/*.js)
if (__DEV__ && typeof window !== 'undefined')
  (window as unknown as { __ui?: typeof useUiStore }).__ui = useUiStore;
