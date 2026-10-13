import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { register, storage } from './persist';

export type Plan = 'free' | 'monthly' | 'yearly';
export type SubscriptionStatus = 'free' | 'trial' | 'active' | 'cancelled' | 'expired';

/** Prototype only – no real purchase happens anywhere. */
interface SubscriptionState {
  plan: Plan;
  status: SubscriptionStatus;
  trialEndsAt: string | null;
  renewsAt: string | null;
  subscribe: (plan: Exclude<Plan, 'free'>, withTrial: boolean) => void;
  cancel: () => void;
  reset: () => void;
}

const initial = {
  plan: 'free' as Plan,
  status: 'free' as SubscriptionStatus,
  trialEndsAt: null,
  renewsAt: null,
};
const inDays = (d: number) => new Date(Date.now() + d * 86_400_000).toISOString();

export const useSubscriptionStore = register(
  create<SubscriptionState>()(
    persist(
      (set) => ({
        ...initial,
        subscribe: (plan, withTrial) =>
          set({
            plan,
            status: withTrial ? 'trial' : 'active',
            trialEndsAt: withTrial ? inDays(7) : null,
            renewsAt: inDays(withTrial ? 7 : plan === 'yearly' ? 365 : 30),
          }),
        cancel: () => set({ status: 'cancelled' }),
        reset: () => set(initial),
      }),
      { name: 'kz-subscription', version: 1, storage }
    )
  )
);
