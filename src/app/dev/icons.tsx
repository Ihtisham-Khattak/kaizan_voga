import { router } from 'expo-router';
import { Leaf as PhLeaf } from 'phosphor-react-native';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { KaizenIcon, kaizenIconNames } from '@/icons';
import { useTheme } from '@/theme/theme-provider';
import { safeBack } from '@/lib/nav';

/** Card F-12 – Kaizen icon set preview at 16 / 24 / 32 / 48, plus the Phosphor wrapper. */
export default function IconsScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{
        paddingTop: insets.top + 16,
        paddingBottom: insets.bottom + 40,
        paddingHorizontal: 16,
        gap: 20,
      }}
    >
      <Text variant="title">Kaizen icons</Text>
      <Text variant="caption">24×24 grid · 1.75 px stroke · rounded caps/joins · leaf accent</Text>

      <View className="flex-row flex-wrap gap-3">
        {kaizenIconNames.map((name) => (
          <View
            key={name}
            className="w-[30%] items-center gap-2 rounded-2xl border border-border bg-card py-3"
          >
            <KaizenIcon name={name} size={32} color={colors.primary} />
            <View className="flex-row items-end gap-2">
              <KaizenIcon name={name} size={16} color={colors.muted} />
              <KaizenIcon name={name} size={24} color={colors.leaf} />
              <KaizenIcon name={name} size={48} color={colors.sunrise} />
            </View>
            <Text variant="caption" numberOfLines={1}>
              {name}
            </Text>
          </View>
        ))}
      </View>

      <Text variant="heading">Phosphor wrapper</Text>
      <View className="flex-row items-center gap-4">
        <Icon as={PhLeaf} size={28} className="text-leaf" />
        <Icon as={PhLeaf} size={28} weight="duotone" className="text-leaf" />
        <Icon as={PhLeaf} size={28} weight="fill" className="text-sunrise" />
      </View>
      <Button variant="ghost" onPress={() => safeBack()}>
        <Text>Back</Text>
      </Button>
    </ScrollView>
  );
}
