import { Check } from 'phosphor-react-native';
import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';

import { FadeUp } from '@/components/fade-up';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { haptic } from '@/lib/haptics';
import { useTheme } from '@/theme/theme-provider';

import { OptionSurface } from './option-surface';

interface Props {
  label: string;
  sublabel?: string;
  selected: boolean;
  onPress: () => void;
  /** Illustration / ring / icon shown above the label. */
  leading: ReactNode;
  multi?: boolean;
  index?: number;
  /** Tile width as a % of the row (2 per row = 48, 3 per row = 31). */
  widthPct?: number;
}

/** Square-ish selectable tile for grids (time, time-of-day, equipment). Same selection language as OptionCard. */
export function ChoiceTile({
  label,
  sublabel,
  selected,
  onPress,
  leading,
  multi,
  index = 0,
  widthPct = 48,
}: Props) {
  const { colors } = useTheme();
  return (
    <FadeUp delay={120 + index * 70} distance={18} style={{ width: `${widthPct}%` }}>
      <Pressable
        role={multi ? 'checkbox' : 'radio'}
        aria-checked={selected}
        accessibilityState={{ checked: selected }}
        accessibilityLabel={sublabel ? `${label}. ${sublabel}` : label}
        onPress={() => {
          haptic.select();
          onPress();
        }}
        style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1 })}
      >
        <OptionSurface
          selected={selected}
          pad={12}
          contentStyle={{ minHeight: 132, alignItems: 'center', justifyContent: 'center' }}
        >
          <View style={{ alignItems: 'center', gap: 8 }}>
            <View style={{ height: 72, alignItems: 'center', justifyContent: 'center' }}>{leading}</View>
            <Text variant="bodyLarge" style={{ color: colors.forest, textAlign: 'center' }}>
              {label}
            </Text>
            {sublabel ? (
              <Text variant="callout" style={{ color: colors.muted, textAlign: 'center' }}>
                {sublabel}
              </Text>
            ) : null}
          </View>
          {selected ? (
            <View
              style={{
                position: 'absolute',
                end: 8,
                top: 8,
                width: 24,
                height: 24,
                borderRadius: 12,
                backgroundColor: colors.leaf,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon as={Check} size={14} weight="bold" color={colors.onPrimary} />
            </View>
          ) : null}
        </OptionSurface>
      </Pressable>
    </FadeUp>
  );
}
