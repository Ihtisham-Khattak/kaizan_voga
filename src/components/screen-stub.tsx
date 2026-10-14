import { router } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { resetAllStores, useAppStore, useAuthStore } from '@/store';

interface Props {
  /** Todoist card id, e.g. "S-05" */
  id: string;
  title: string;
  /** What this screen will contain (one line). */
  note?: string;
  /** Quick links to neighbouring screens so the route graph can be walked end to end while screens are unbuilt. */
  links?: { label: string; href: string }[];
}

/** Developer-only shortcuts, so the screens that DO exist (UI kit, characters, icons) are reachable on a device. */
function DevShortcuts() {
  const skipToApp = () => {
    useAppStore.setState({ hasSeenStory: true, onboardingComplete: true });
    useAuthStore.getState().continueAsGuest();
    router.replace('/home');
  };
  const reset = () => {
    resetAllStores();
    router.replace('/');
  };
  return (
    <View className="gap-2 rounded-card border border-border bg-card p-4">
      <Text variant="label">Developer shortcuts</Text>
      <Text variant="caption">Built so far — open these to see the real UI:</Text>
      <Button variant="default" onPress={() => router.push('/dev/ui-kit')}>
        <Text>UI kit (components)</Text>
      </Button>
      <Button variant="default" onPress={() => router.push('/dev/characters')}>
        <Text>Character sheet</Text>
      </Button>
      <Button variant="default" onPress={() => router.push('/dev/icons')}>
        <Text>Icon set</Text>
      </Button>
      <View className="flex-row gap-2 pt-1">
        <Button variant="outline" size="sm" className="flex-1" onPress={skipToApp}>
          <Text>Skip to app</Text>
        </Button>
        <Button variant="outline" size="sm" className="flex-1" onPress={reset}>
          <Text>Reset first launch</Text>
        </Button>
      </View>
    </View>
  );
}

/**
 * Placeholder for a route whose real screen hasn't been built yet. Keeps every button/tab pointing at a
 * real destination (acceptance: "no dead ends"). Replace the route's default export when the card ships.
 */
export function ScreenStub({ id, title, note, links = [] }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View className="flex-1 bg-background">
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 24,
          paddingBottom: insets.bottom + 120,
          paddingHorizontal: 16,
          gap: 16,
        }}
      >
        <Badge variant="sand">
          <Text>{`Placeholder · card ${id}`}</Text>
        </Badge>
        <Text variant="title">{title}</Text>
        {note ? <Text variant="caption">{`${note} — not built yet.`}</Text> : null}
        {__DEV__ ? <DevShortcuts /> : null}
        <View className="gap-3 pt-2">
          {links.map((l) => (
            <Button key={l.href + l.label} variant="secondary" onPress={() => router.push(l.href as never)}>
              <Text>{l.label}</Text>
            </Button>
          ))}
          {router.canGoBack() ? (
            <Button variant="ghost" onPress={() => router.back()}>
              <Text>Back</Text>
            </Button>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}
