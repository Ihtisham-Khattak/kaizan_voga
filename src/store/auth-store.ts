import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { register, storage } from './persist';
import type { AuthUser } from './types';

/**
 * 'none'     – no choice made yet (account gate is shown after the plan reveal)
 * 'guest'    – everything stays on this device
 * 'signedIn' – mock account (real backend + tokens in expo-secure-store come later, see card A-08)
 */
export type AuthStatus = 'none' | 'guest' | 'signedIn';

interface AuthState {
  status: AuthStatus;
  user: AuthUser | null;
  continueAsGuest: () => void;
  signIn: (user: AuthUser) => void;
  signOut: () => void;
  reset: () => void;
}

export const useAuthStore = register(
  create<AuthState>()(
    persist(
      (set) => ({
        status: 'none',
        user: null,
        continueAsGuest: () => set({ status: 'guest', user: null }),
        signIn: (user) => set({ status: 'signedIn', user }),
        signOut: () => set({ status: 'none', user: null }),
        reset: () => set({ status: 'none', user: null }),
      }),
      { name: 'kz-auth', version: 1, storage }
    )
  )
);
