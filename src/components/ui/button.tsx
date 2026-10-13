import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { ActivityIndicator, Platform, Pressable, type GestureResponderEvent } from 'react-native';

import { TextClassContext } from '@/components/ui/text';
import { haptic } from '@/lib/haptics';
import { cn } from '@/lib/utils';

/** Pills (radius 999), min height 48, 44px+ touch target at every size. */
const buttonVariants = cva(
  cn(
    'group shrink-0 flex-row items-center justify-center gap-2 rounded-pill',
    Platform.select({
      web: 'focus-visible:ring-ring/50 whitespace-nowrap outline-none transition-all focus-visible:ring-[3px] disabled:pointer-events-none',
    })
  ),
  {
    variants: {
      variant: {
        // forest — primary actions
        default: 'bg-primary active:bg-primary/90',
        // mint — secondary
        secondary: 'bg-secondary active:bg-secondary/80',
        outline: 'border-border bg-card active:bg-secondary/60 border',
        ghost: 'active:bg-secondary/70',
        // coral — gentle highlight CTAs
        coral: 'bg-coral active:bg-coral/90',
        // soft red wash, never an alarming solid
        destructive: 'bg-destructive/10 active:bg-destructive/20',
        link: '',
      },
      size: {
        default: 'min-h-12 px-6 py-3',
        sm: 'min-h-11 px-4 py-2',
        lg: 'min-h-14 px-8 py-4',
        icon: 'size-11',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
);

const buttonTextVariants = cva('font-sans-semibold text-kz-body', {
  variants: {
    variant: {
      default: 'text-primary-foreground',
      secondary: 'text-secondary-foreground',
      outline: 'text-foreground',
      ghost: 'text-primary',
      coral: 'text-[#24302A]', // ink on coral: AA in both modes
      destructive: 'text-destructive',
      link: cn('text-primary group-active:underline', Platform.select({ web: 'hover:underline' })),
    },
    size: { default: '', sm: 'text-kz-caption', lg: 'text-kz-lead', icon: '' },
  },
  defaultVariants: { variant: 'default', size: 'default' },
});

type ButtonProps = React.ComponentProps<typeof Pressable> &
  React.RefAttributes<React.ComponentRef<typeof Pressable>> &
  VariantProps<typeof buttonVariants> & {
    loading?: boolean;
    /** Soft tap feedback; set false for rapid-fire controls. */
    haptics?: boolean;
  };

function Button({ className, variant, size, loading, haptics = true, onPress, disabled, children, ...props }: ButtonProps) {
  const isDisabled = disabled || loading;
  const handlePress = (e: GestureResponderEvent) => {
    if (haptics) haptic.light();
    onPress?.(e);
  };
  return (
    <TextClassContext.Provider value={buttonTextVariants({ variant, size })}>
      <Pressable
        className={cn(isDisabled && 'opacity-50', buttonVariants({ variant, size }), className)}
        role="button"
        disabled={isDisabled}
        aria-busy={loading}
        aria-disabled={isDisabled}
        onPress={handlePress}
        {...props}>
        {loading ? <ActivityIndicator size="small" /> : null}
        {children as React.ReactNode}
      </Pressable>
    </TextClassContext.Provider>
  );
}

export { Button, buttonTextVariants, buttonVariants };
export type { ButtonProps };
