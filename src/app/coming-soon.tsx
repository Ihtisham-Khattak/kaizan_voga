import { useLocalSearchParams } from 'expo-router';

import { ComingSoon } from '@/features/states/coming-soon';

/** Any unbuilt destination can route here: router.push({ pathname: '/coming-soon', params: { title } }). */
export default function ComingSoonScreen() {
  const { title } = useLocalSearchParams<{ title?: string }>();
  return <ComingSoon title={title ? String(title) : undefined} />;
}
