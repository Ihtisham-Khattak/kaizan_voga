import { router, type Href } from 'expo-router';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { EmptyFor, type EmptyKind } from '@/features/states/empty';
import { InlineError } from '@/features/states/error-state';
import { Group, SettingsScreen, SwitchRow } from '@/features/settings/ui';
import { useUiStore } from '@/store/ui-store';

const KINDS: EmptyKind[] = [
  'favourites',
  'history',
  'downloads',
  'search',
  'custom',
  'mood',
  'achievements',
  'reminders',
];

/** Dev only: every state component in one place, plus toggles to force offline and loading app-wide. */
export default function StatesShowcase() {
  const forceOffline = useUiStore((s) => s.forceOffline);
  const forceLoading = useUiStore((s) => s.forceLoading);
  const setOffline = useUiStore((s) => s.setForceOffline);
  const setLoading = useUiStore((s) => s.setForceLoading);
  const insets = useSafeAreaInsets();

  return (
    <SettingsScreen title="States">
      <Group title="Toggles">
        <SwitchRow first label="Force offline banner" value={forceOffline} onChange={setOffline} />
        <SwitchRow
          label="Force loading skeletons"
          sub="Every screen stays on its skeleton"
          value={forceLoading}
          onChange={setLoading}
        />
      </Group>
      <View className="gap-3 px-4">
        <Text variant="title2">Screens</Text>
        <Button variant="secondary" onPress={() => router.push('/coming-soon' as Href)}>
          <Text>Coming soon</Text>
        </Button>
        <Button variant="secondary" onPress={() => router.push('/does-not-exist' as Href)}>
          <Text>Not found (error state)</Text>
        </Button>
        <Text variant="title2">Inline error</Text>
        <InlineError onRetry={() => {}} />
        <Text variant="title2">Empty states</Text>
        {KINDS.map((k) => (
          <View key={k} className="rounded-card border border-hairline bg-bgMist">
            <EmptyFor kind={k} onCta={() => {}} />
          </View>
        ))}
        <View style={{ height: insets.bottom }} />
      </View>
    </SettingsScreen>
  );
}
