import { Check } from 'phosphor-react-native';
import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';

import { FadeUp } from '@/components/fade-up';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { haptic } from '@/lib/haptics';
import { useTheme } from '@/theme/theme-provider';

import { OptionSurface } from './option-surface';

/**
 * A flowing row of options: each chip is as wide as its content needs, rows fill from the start edge and wrap onto
 * the next line, and chips on a row stretch to share the leftover space. (A flex-wrap layout, not a fixed grid.)
 */
export function ChoiceFlow({ children, gap = 10 }: { children: ReactNode; gap?: number }) {
  return <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap }}>{children}</View>;
}

/** The round icon badge every chip uses (same size and colour everywhere). */
export function ChipIcon({ children }: { children: ReactNode }) {
  const { colors } = useTheme();
  return (
    <View
      style={{
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.mint,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {children}
    </View>
  );
}

interface Props {
  label: string;
  sublabel?: string;
  selected: boolean;
  onPress: () => void;
  leading?: ReactNode;
  multi?: boolean;
  index?: number;
}

/**
 * One chip: icon, label and a short line, selected = `mint` fill + `leaf` edge + a check (never colour alone). Sized by
 * its content (grows to share the row), never below a comfortable touch height.
 */
export function ChoiceChip({ label, sublabel, selected, onPress, leading, multi, index = 0 }: Props) {
  const { colors } = useTheme();
  return (
    <FadeUp delay={100 + index * 60} distance={14} style={{ flexGrow: 1, flexShrink: 1, maxWidth: '100%' }}>
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
          contentStyle={{ minHeight: 64, justifyContent: 'center' }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            {leading}
            <View style={{ flexShrink: 1, gap: 1 }}>
              <Text variant="callout" className="font-sans-semibold" style={{ color: colors.forest }}>
                {label}
              </Text>
              {sublabel ? (
                <Text variant="footnote" className="font-sans" style={{ color: colors.muted }}>
                  {sublabel}
                </Text>
              ) : null}
            </View>
            <View style={{ width: 20, alignItems: 'center' }}>
              {selected ? <Icon as={Check} size={16} weight="bold" color={colors.leaf} /> : null}
            </View>
          </View>
        </OptionSurface>
      </Pressable>
    </FadeUp>
  );
}
