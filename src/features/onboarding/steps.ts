import { router, type Href } from 'expo-router';

import { useAppStore } from '@/store/app-store';

/** Personalization route order. `goals` is also Scene 6 of the story; Skip lands here. */
export const STEPS = [
  'goals',
  'experience',
  'time',
  'schedule',
  'movement',
  'equipment',
  'accessibility',
  'voice',
  'safety',
  'reminders',
  'plan',
] as const;
export type StepKey = (typeof STEPS)[number];

/** Steps that cannot be skipped (legal / safety). */
export const REQUIRED: StepKey[] = ['safety'];

export const stepIndex = (k: StepKey) => STEPS.indexOf(k);
export const hrefOf = (k: StepKey) => `/${k}` as Href;

let lastNav = { from: '', at: 0 };

export function goNext(k: StepKey) {
  const next = STEPS[stepIndex(k) + 1];
  if (!next) return;
  // a double tap (or a delayed callback after a tap) must not open the next screen twice
  const now = Date.now();
  if (lastNav.from === k && now - lastNav.at < 1500) return;
  lastNav = { from: k, at: now };
  useAppStore.getState().setOnboardingStep(`/${next}`);
  router.push(hrefOf(next));
}

export function goBack(k: StepKey) {
  const i = stepIndex(k);
  if (router.canGoBack()) router.back();
  else if (i > 0) router.replace(hrefOf(STEPS[i - 1]));
}
