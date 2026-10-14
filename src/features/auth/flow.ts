import { router, type Href } from 'expo-router';
import { useEffect, useState } from 'react';

import { useAppStore } from '@/store/app-store';
import { useAuthStore } from '@/store/auth-store';
import type { AuthUser } from '@/store/types';

/**
 * Finish the account step: sign in (or continue as guest) and continue to where the user was headed
 * (the first session, or Home). A returning user who signs in from the Welcome scene skips story + onboarding.
 */
export function finishAuth(user?: AuthUser) {
  const app = useAppStore.getState();
  if (user) useAuthStore.getState().signIn(user);
  else useAuthStore.getState().continueAsGuest();
  if (user && !app.onboardingComplete) {
    app.setHasSeenStory(true);
    app.completeOnboarding();
  }
  const dest = app.postGateRoute ?? '/home';
  app.setPostGateRoute(null);
  router.replace(dest as Href);
}

/** Counts down from `seconds`; `restart()` begins again (used for "Resend in 0:28"). */
export function useCooldown(seconds: number) {
  const [left, setLeft] = useState(seconds);
  useEffect(() => {
    if (left <= 0) return;
    const id = setTimeout(() => setLeft((n) => n - 1), 1000);
    return () => clearTimeout(id);
  }, [left]);
  return { left, restart: () => setLeft(seconds) };
}
