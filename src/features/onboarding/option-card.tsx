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
  title: string;
  subtitle?: string;
  selected: boolean;
  onPress: () => void;
  /** Small illustration on the start side: a character avatar or Kaizen icon. */
  leading?: ReactNode;
  /** Multi-select shows a checkbox, single-select a radio. */
  multi?: boolean;
  /** Entrance stagger position. */
  index?: number;
}

/**
 * Large, friendly selectable row (min 64px tall). Selection = `leaf` edge + `mint` fill + check mark — never colour
 * alone. The row never changes size, so a selected row stays in line with the others.
 */
export function OptionCard({ title, subtitle, selected, onPress, leading, multi, index = 0 }: Props) {
  const { colors } = useTheme();
  return (
    <FadeUp delay={120 + index * 70} distance={18}>
      <Pressable
        role={multi ? 'checkbox' : 'radio'}
        aria-checked={selected}
        accessibilityState={{ checked: selected }}
        accessibilityLabel={subtitle ? `${title}. ${subtitle}` : title}
        onPress={() => {
          haptic.select();
          onPress();
        }}
        style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1 })}
      >
        <OptionSurface
          selected={selected}
          pad={14}
          contentStyle={{ minHeight: 64, justifyContent: 'center' }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            {leading ? <View style={{ width: 52, alignItems: 'center' }}>{leading}</View> : null}
            <View style={{ flex: 1, gap: 2 }}>
              <Text className="font-sans-semibold" variant="bodyLarge" style={{ color: colors.forest }}>
                {title}
              </Text>
              {subtitle ? (
                <Text className="font-sans" variant="callout" style={{ color: colors.muted }}>
                  {subtitle}
                </Text>
              ) : null}
            </View>
            <View
              style={{
                width: 28,
                height: 28,
                borderRadius: multi ? 10 : 14,
                borderWidth: 2,
                borderColor: selected ? colors.leaf : colors.hairline,
                backgroundColor: selected ? colors.leaf : 'transparent',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {selected ? <Icon as={Check} size={16} weight="bold" color={colors.onPrimary} /> : null}
            </View>
          </View>
        </OptionSurface>
      </Pressable>
    </FadeUp>
  );
}
