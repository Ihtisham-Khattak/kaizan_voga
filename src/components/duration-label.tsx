import { Clock } from 'phosphor-react-native';
import { View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useT } from '@/i18n';
import { formatDuration } from '@/lib/format';
import { useTheme } from '@/theme/theme-provider';

/** Clock icon + duration ("45 sec", "10 min"). Pass seconds; it picks the unit. */
export function DurationLabel({ seconds, tone = 'muted' }: { seconds: number; tone?: 'muted' | 'forest' }) {
  const { t } = useT();
  const { colors } = useTheme();
  const color = tone === 'forest' ? colors.forest : colors.muted;
  const text = formatDuration(seconds, t);
  return (
    <View accessible accessibilityLabel={text} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
      <Icon as={Clock} size={14} color={color} />
      <Text variant="footnote" style={{ color }}>
        {text}
      </Text>
    </View>
  );
}
