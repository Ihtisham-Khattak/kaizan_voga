import { View } from 'react-native';

import { Text } from '@/components/ui/text';
import type { Level } from '@/data/types';
import { useT } from '@/i18n';
import { useTheme } from '@/theme/theme-provider';

const BARS: Record<Level, number> = { beginner: 1, intermediate: 2 };

/**
 * Difficulty label: three small rising bars plus the word, so level is never shown by colour alone.
 * `mint` pill with `forest` text; filled bars use `leaf`.
 */
export function DifficultyBadge({ level }: { level: Level }) {
  const { t } = useT();
  const { colors } = useTheme();
  const filled = BARS[level];
  return (
    <View
      accessible
      accessibilityLabel={t(`level.${level}`)}
      style={{
        alignSelf: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 4,
        backgroundColor: colors.mint,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 2, height: 12 }}>
        {[0, 1, 2].map((i) => (
          <View
            key={i}
            style={{
              width: 3,
              height: 5 + i * 3.5,
              borderRadius: 1.5,
              backgroundColor: i < filled ? colors.leaf : colors.hairline,
            }}
          />
        ))}
      </View>
      <Text variant="footnote" style={{ color: colors.forest }}>
        {t(`level.${level}`)}
      </Text>
    </View>
  );
}
