import { Redirect, type Href } from 'expo-router';

import { useAppStore, useAuthStore } from '@/store';

/** Entry point: sends each launch to the right place in the funnel (see RootStack guards). */
export default function Index() {
  const hasSeenStory = useAppStore((s) => s.hasSeenStory);
  const onboardingComplete = useAppStore((s) => s.onboardingComplete);
  const onboardingStep = useAppStore((s) => s.onboardingStep);
  const authStatus = useAuthStore((s) => s.status);

  if (!hasSeenStory) return <Redirect href={'/story' as Href} />;
  if (!onboardingComplete) return <Redirect href={(onboardingStep ?? '/goals') as Href} />;
  if (authStatus === 'none') return <Redirect href="/gate" />;
  return <Redirect href="/home" />;
}
