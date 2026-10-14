import { Check } from 'phosphor-react-native';
import { MotiView } from 'moti';
import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';

import { FadeUp } from '@/components/fade-up';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useReduceMotion } from '@/hooks/use-reduced-motion';
import { haptic } from '@/lib/haptics';
import { cn } from '@/lib/utils';
import { spring } from '@/theme/motion';

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
 * Large, friendly selectable card (min 64px tall). Selection = sage border + tinted fill + check mark + a soft
 * spring — never colour alone.
 */
export function OptionCard({ title, subtitle, selected, onPress, leading, multi, index = 0 }: Props) {
  const reduce = useReduceMotion();
  return (
    <FadeUp delay={120 + index * 70} distance={18}>
      <MotiView
        animate={{ scale: selected && !reduce ? 1.015 : 1 }}
        transition={{ type: 'spring', ...spring.gentle }}
      >
        <Pressable
          role={multi ? 'checkbox' : 'radio'}
          aria-checked={selected}
          accessibilityState={{ checked: selected }}
          accessibilityLabel={subtitle ? `${title}. ${subtitle}` : title}
          onPress={() => {
            haptic.select();
            onPress();
          }}
          className={cn(
            'min-h-16 flex-row items-center gap-3 rounded-card border-2 px-4 py-3 active:opacity-90',
            selected ? 'border-leaf bg-secondary' : 'border-border bg-card'
          )}
        >
          {leading ? <View className="size-12 items-center justify-center">{leading}</View> : null}
          <View className="flex-1 gap-1">
            <Text
              variant="bodyLarge"
              className={cn('font-sans-semibold', selected && 'text-secondary-foreground')}
            >
              {title}
            </Text>
            {subtitle ? <Text variant="caption">{subtitle}</Text> : null}
          </View>
          <View
            className={cn(
              'size-7 items-center justify-center border-2',
              multi ? 'rounded-lg' : 'rounded-full',
              selected ? 'border-leaf bg-leaf' : 'border-border bg-transparent'
            )}
          >
            {selected ? <Icon as={Check} size={16} weight="bold" className="text-onLeaf" /> : null}
          </View>
        </Pressable>
      </MotiView>
    </FadeUp>
  );
}
