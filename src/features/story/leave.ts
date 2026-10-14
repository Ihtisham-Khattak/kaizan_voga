import { router } from 'expo-router';

import { useAppStore } from '@/store/app-store';

/**
 * Leave the story (finished OR skipped): mark it seen, then continue.
 *  - first run, skipped            → personalization goals picker
 *  - first run, goals already done → personalization question 1 (experience)
 *  - replaying the intro           → straight back Home
 */
export function leaveStory(opts: { goalsDone?: boolean } = {}) {
  const { onboardingComplete, setHasSeenStory } = useAppStore.getState();
  setHasSeenStory(true);
  if (onboardingComplete) router.replace('/home');
  else router.replace(opts.goalsDone ? '/experience' : '/goals');
}
