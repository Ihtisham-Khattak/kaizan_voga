import { Icon } from '@/components/ui/icon';
import { cn } from '@/lib/utils';
import * as CheckboxPrimitive from '@rn-primitives/checkbox';
import { Check } from 'phosphor-react-native';
import { Platform } from 'react-native';

const DEFAULT_HIT_SLOP = 10; // 24px box + 2x10 = 44px target

function Checkbox({
  className,
  checkedClassName,
  indicatorClassName,
  iconClassName,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root> & {
  checkedClassName?: string;
  indicatorClassName?: string;
  iconClassName?: string;
}) {
  return (
    <CheckboxPrimitive.Root
      className={cn(
        'size-6 shrink-0 rounded-lg border-2 border-input dark:bg-input/30',
        Platform.select({
          web: 'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive peer cursor-default outline-none transition-shadow focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed',
          native: 'overflow-hidden',
        }),
        props.checked && cn('border-primary', checkedClassName),
        props.disabled && 'opacity-50',
        className
      )}
      hitSlop={DEFAULT_HIT_SLOP}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className={cn('h-full w-full items-center justify-center bg-primary', indicatorClassName)}
      >
        <Icon as={Check} size={16} weight="bold" className={cn('text-primary-foreground', iconClassName)} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
