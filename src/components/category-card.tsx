import { Pressable, View } from 'react-native';

import { CoverArt } from '@/components/cover-art';
import { STYLE_MOTIF } from '@/components/cover-motifs';
import { GlassCard } from '@/components/glass-card';
import { Text } from '@/components/ui/text';
import type { YogaStyle } from '@/data/types';
import { useT } from '@/i18n';
import { useTheme } from '@/theme/theme-provider';

interface Props {
  style: YogaStyle;
  /** tile = 2-up grid card; mini = compact shortcut for horizontal rows. */
  variant?: 'tile' | 'mini';
  onPress?: () => void;
}

/** A yoga style (Hatha, Yin, Prenatal…) as a card: tinted cover, name and a one-line plain-language explainer. */
export function CategoryCard({ style: s, variant = 'tile', onPress }: Props) {
  const { t } = useT();
  const { colors } = useTheme();
  const mini = variant === 'mini';
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={t('cards.category', { name: s.name, about: s.explainer })}
      style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1, width: mini ? 148 : '100%' })}
    >
      <GlassCard contentStyle={{ padding: mini ? 8 : 10, gap: mini ? 8 : 10 }}>
        <CoverArt tint={s.cover} motif={STYLE_MOTIF[s.id]} height={mini ? 72 : 104} rounded={14} />
        <View style={{ gap: 4, paddingHorizontal: 4, paddingBottom: 4 }}>
          <Text variant="title3" numberOfLines={mini ? 1 : 2} style={{ color: colors.forest }}>
            {s.name}
          </Text>
          {mini ? null : (
            <Text className="font-sans" variant="callout" numberOfLines={3} style={{ color: colors.muted }}>
              {s.explainer}
            </Text>
          )}
        </View>
      </GlassCard>
    </Pressable>
  );
}
