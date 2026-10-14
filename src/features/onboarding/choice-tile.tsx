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
  const reduce = useReduceMotion();
  return (
    <FadeUp delay={120 + index * 70} distance={18} style={{ width: `${widthPct}%` }}>
      <MotiView
        animate={{ scale: selected && !reduce ? 1.03 : 1 }}
        transition={{ type: 'spring', ...spring.gentle }}
      >
        <Pressable
          role={multi ? 'checkbox' : 'radio'}
          aria-checked={selected}
          accessibilityState={{ checked: selected }}
          accessibilityLabel={sublabel ? `${label}. ${sublabel}` : label}
          onPress={() => {
            haptic.select();
            onPress();
          }}
          className={cn(
            'min-h-[132px] items-center justify-center gap-2 rounded-card border-2 px-3 py-4 active:opacity-90',
            selected ? 'border-sage bg-secondary' : 'border-border bg-card'
          )}
        >
          <View className="h-[72px] items-center justify-center">{leading}</View>
          <Text
            variant="label"
            className={cn('text-center text-kz-lead', selected && 'text-secondary-foreground')}
          >
            {label}
          </Text>
          {sublabel ? (
            <Text variant="caption" className="text-center">
              {sublabel}
            </Text>
          ) : null}
          {selected ? (
            <View className="absolute end-2 top-2 size-6 items-center justify-center rounded-full bg-sage">
              <Icon as={Check} size={14} weight="bold" className="text-[#121A16]" />
            </View>
          ) : null}
        </Pressable>
      </MotiView>
    </FadeUp>
  );
}
