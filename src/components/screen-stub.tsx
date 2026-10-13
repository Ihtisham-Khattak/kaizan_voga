import { router } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

interface Props {
  /** Todoist card id, e.g. "S-05" */
  id: string;
  title: string;
  /** What this screen will contain (one line). */
  note?: string;
  /** Quick links to neighbouring screens so the route graph can be walked end to end while screens are unbuilt. */
  links?: { label: string; href: string }[];
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
          paddingBottom: insets.bottom + 24,
          paddingHorizontal: 16,
          gap: 16,
        }}
      >
        <Badge variant="sand">
          <Text>{`Card ${id}`}</Text>
        </Badge>
        <Text variant="title">{title}</Text>
        {note ? <Text variant="caption">{note}</Text> : null}
        <View className="gap-3 pt-4">
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
