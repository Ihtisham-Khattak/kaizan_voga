import { Check } from 'phosphor-react-native';
import * as React from 'react';
import { Pressable, type PressableProps } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { Text, TextClassContext } from '@/components/ui/text';
import { haptic } from '@/lib/haptics';
import { cn } from '@/lib/utils';

type ChipProps = Omit<PressableProps, 'children'> & {
  label: string;
  selected?: boolean;
  /** Optional leading icon element (e.g. a Phosphor icon). */
  icon?: React.ReactNode;
  className?: string;
};

/**
 * Selectable pill (filters, weekdays, equipment). Selection is shown by border + check icon + weight,
 * never by colour alone.
 */
function Chip({ label, selected = false, icon, className, onPress, ...props }: ChipProps) {
  return (
    <TextClassContext.Provider value={cn('text-secondary-foreground', selected && 'font-sans-semibold')}>
      <Pressable
        role="checkbox"
        aria-checked={selected}
        accessibilityLabel={label}
        accessibilityState={{ checked: selected }}
        hitSlop={4}
        onPress={(e) => {
          haptic.select();
          onPress?.(e);
        }}
        className={cn(
          'min-h-11 flex-row items-center justify-center gap-2 rounded-pill border-2 px-4 py-2',
          selected ? 'border-leaf bg-secondary' : 'border-transparent bg-secondary/60 active:bg-secondary',
          className
        )}
        {...props}
      >
        {selected ? <Icon as={Check} size={16} weight="bold" className="text-primary" /> : icon}
        <Text variant="callout">{label}</Text>
      </Pressable>
    </TextClassContext.Provider>
  );
}

export { Chip };
export type { ChipProps };
