import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { register, storage } from './persist';

export type Plan = 'free' | 'monthly' | 'yearly';
export type SubscriptionStatus = 'free' | 'trial' | 'active' | 'cancelled' | 'expired';

/** Prototype only – no real purchase happens anywhere. FN-08 replaces this with RevenueCat / store receipts. */
interface SubscriptionState {
  plan: Plan;
  status: SubscriptionStatus;
  trialEndsAt: string | null;
  renewsAt: string | null;
  /** When a cancelled plan stops giving Premium (it keeps working until then). */
  endsAt: string | null;
  /** Home trial banner dismissed (resets on the next purchase). */
  trialBannerDismissed: boolean;
  subscribe: (plan: Exclude<Plan, 'free'>, withTrial: boolean) => void;
  switchPlan: (plan: Exclude<Plan, 'free'>) => void;
  cancel: () => void;
  resume: () => void;
  /** Mock restore: brings back the last plan if there was one. Returns whether anything was restored. */
  restore: () => boolean;
  dismissTrialBanner: () => void;
  reset: () => void;
}

const initial = {
  plan: 'free' as Plan,
  status: 'free' as SubscriptionStatus,
  trialEndsAt: null as string | null,
  renewsAt: null as string | null,
  endsAt: null as string | null,
  trialBannerDismissed: false,
};
const inDays = (d: number) => new Date(Date.now() + d * 86_400_000).toISOString();
const periodDays = (plan: Exclude<Plan, 'free'>) => (plan === 'yearly' ? 365 : 30);

export const useSubscriptionStore = register(
  create<SubscriptionState>()(
    persist(
      (set, get) => ({
        ...initial,
        subscribe: (plan, withTrial) =>
          set({
            plan,
            status: withTrial ? 'trial' : 'active',
            trialEndsAt: withTrial ? inDays(7) : null,
            renewsAt: inDays(withTrial ? 7 : periodDays(plan)),
            endsAt: null,
            trialBannerDismissed: false,
          }),
        switchPlan: (plan) => set({ plan }),
        cancel: () => set((s) => ({ status: 'cancelled', endsAt: s.renewsAt ?? inDays(30) })),
        resume: () =>
          set((s) => ({
            status: s.trialEndsAt && new Date(s.trialEndsAt) > new Date() ? 'trial' : 'active',
            endsAt: null,
          })),
        restore: () => {
          const s = get();
          if (s.plan === 'free') return false;
          set({ status: 'active', endsAt: null, renewsAt: inDays(periodDays(s.plan)) });
          return true;
        },
        dismissTrialBanner: () => set({ trialBannerDismissed: true }),
        reset: () => set(initial),
      }),
      { name: 'kz-subscription', version: 1, storage }
    )
  )
);

type Snapshot = Pick<SubscriptionState, 'status' | 'endsAt'>;

/** Premium is on during a trial and while active; a cancelled plan keeps it until its end date. */
export function hasPremium(s: Snapshot, now = Date.now()): boolean {
  if (s.status === 'trial' || s.status === 'active') return true;
  if (s.status === 'cancelled') return !s.endsAt || new Date(s.endsAt).getTime() > now;
  return false;
}

/** What the UI should call the state right now (a cancelled plan past its end date reads as expired). */
export function effectiveStatus(s: Snapshot, now = Date.now()): SubscriptionStatus {
  if (s.status === 'cancelled' && !hasPremium(s, now)) return 'expired';
  return s.status;
}

export const daysLeft = (iso: string | null, now = Date.now()) =>
  iso ? Math.max(0, Math.ceil((new Date(iso).getTime() - now) / 86_400_000)) : 0;

export const useHasPremium = () => useSubscriptionStore((s) => hasPremium(s));
