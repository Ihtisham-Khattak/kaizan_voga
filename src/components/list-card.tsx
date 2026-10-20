import { CaretRight } from 'phosphor-react-native';
import type { ReactNode } from 'react';
import { I18nManager, Pressable, View } from 'react-native';

import { GlassCard } from '@/components/glass-card';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useTheme } from '@/theme/theme-provider';

interface Props {
  /** Square picture on the start side (a CoverArt at 72 px). */
  cover: ReactNode;
  title: string;
  subtitle?: string;
  /** Spoken label for screen readers (defaults to title + subtitle). */
  label?: string;
  onPress?: () => void;
}

/**
 * A full-width flowing card: picture on the start side, title and a short line beside it, chevron at the end.
 * One per line, content-sized height, so long text in any language wraps instead of clipping.
 */
export function ListCard({ cover, title, subtitle, label, onPress }: Props) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label ?? (subtitle ? `${title}. ${subtitle}` : title)}
      style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1 })}
    >
      <GlassCard contentStyle={{ padding: 10, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        <View style={{ width: 72, height: 72, borderRadius: 14, overflow: 'hidden' }}>{cover}</View>
        <View style={{ flex: 1, gap: 2 }}>
          <Text variant="title3" className="font-sans-semibold" style={{ color: colors.forest }}>
            {title}
          </Text>
          {subtitle ? (
            <Text variant="callout" className="font-sans" numberOfLines={2} style={{ color: colors.muted }}>
              {subtitle}
            </Text>
          ) : null}
        </View>
        <Icon
          as={CaretRight}
          size={18}
          color={colors.muted}
          style={I18nManager.isRTL ? { transform: [{ scaleX: -1 }] } : undefined}
        />
      </GlassCard>
    </Pressable>
  );
}
