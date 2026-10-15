import type { Plan } from '@/store/subscription-store';

export type PaidPlan = Exclude<Plan, 'free'>;

/** Placeholder prices – the store sets the real ones (FN-08). Keys match premium.paywall.* i18n. */
export const PRICE_KEY: Record<PaidPlan, 'monthlyPrice' | 'yearlyPrice'> = {
  monthly: 'monthlyPrice',
  yearly: 'yearlyPrice',
};

/** Paywall rows: [i18n key, included in Free]. Everything is included in Premium. */
export const COMPARISON: readonly (readonly [string, boolean])[] = [
  ['starter', true],
  ['relief', true],
  ['safety', true],
  ['poses', true],
  ['programs', false],
  ['sleep', false],
  ['offline', false],
  ['insights', false],
  ['voices', false],
  ['custom', false],
];

/** What the success screen lists as newly unlocked. */
export const UNLOCKED = COMPARISON.filter(([, free]) => !free).map(([key]) => key);
