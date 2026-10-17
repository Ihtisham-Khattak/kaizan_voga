import type { Icon as PhosphorIcon } from 'phosphor-react-native';
import { View } from 'react-native';

import { GlassCard } from '@/components/glass-card';
import { ProgressRing } from '@/components/progress-ring';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useTheme } from '@/theme/theme-provider';

interface Props {
  label: string;
  value: string;
  caption?: string;
  icon?: PhosphorIcon;
  /** 0–1: shows a ring behind the value instead of the icon. */
  progress?: number;
}

/** A single statistic tile (sessions, minutes, streak…). Rest days are never shown as failure. */
export function ProgressCard({ label, value, caption, icon, progress }: Props) {
  const { colors } = useTheme();
  return (
    <GlassCard contentStyle={{ padding: 14, gap: 10 }}>
      <View
        accessible
        accessibilityLabel={`${label}: ${value}${caption ? `. ${caption}` : ''}`}
        style={{ gap: 10 }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text variant="overline" style={{ color: colors.muted }}>
            {label}
          </Text>
          {progress === undefined && icon ? (
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: colors.mint,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon as={icon} size={18} weight="duotone" color={colors.primary} />
            </View>
          ) : null}
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          {progress !== undefined ? <ProgressRing progress={progress} size={44} strokeWidth={5} /> : null}
          <Text
            variant="title1"
            numberOfLines={1}
            adjustsFontSizeToFit
            style={{ color: colors.forest, flexShrink: 1 }}
          >
            {value}
          </Text>
        </View>
        {caption ? (
          <Text variant="footnote" style={{ color: colors.muted }}>
            {caption}
          </Text>
        ) : null}
      </View>
    </GlassCard>
  );
}
