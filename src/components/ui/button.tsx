import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { ActivityIndicator, Platform, Pressable, type GestureResponderEvent } from 'react-native';

import { TextClassContext } from '@/components/ui/text';
import { haptic } from '@/lib/haptics';
import { cn } from '@/lib/utils';
import { useTheme } from '@/theme/theme-provider';

/** Pills (radius 999), min height 48, 44px+ touch target at every size. Text = `button` style (17/22 600). */
const buttonVariants = cva(
  cn(
    'group shrink-0 flex-row items-center justify-center gap-2 rounded-pill',
    Platform.select({
      web: 'whitespace-nowrap outline-none transition-all focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none',
    })
  ),
  {
    variants: {
      variant: {
        // primary actions (soft green glow, see Button)
        default: 'bg-primary active:bg-primary/90',
        // mint — secondary
        secondary: 'bg-mint active:bg-mint/80',
        outline: 'border border-hairline bg-bg active:bg-mint',
        ghost: 'active:bg-mint',
        // sunrise — celebration CTAs only
        sunrise: 'bg-sunriseSoft active:bg-sunriseSoft/80',
        // soft danger wash, never an alarming solid
        destructive: 'bg-danger/10 active:bg-danger/20',
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

// every button uses the `button` text style (Jakarta 17/22 600)
const buttonTextVariants = cva('font-sans-semibold text-kz-button', {
  variants: {
    variant: {
      default: 'text-onPrimary',
      secondary: 'text-forest',
      outline: 'text-ink',
      ghost: 'text-primary',
      sunrise: 'text-sunriseInk',
      destructive: 'text-danger',
      link: cn('text-primary group-active:underline', Platform.select({ web: 'hover:underline' })),
    },
    size: { default: '', sm: '', lg: '', icon: '' },
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

function Button({
  className,
  variant,
  size,
  loading,
  haptics = true,
  onPress,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const { shadows } = useTheme();
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
        // soft green glow under primary buttons
        style={[
          !isDisabled && (variant === undefined || variant === 'default') ? shadows.glow : null,
          props.style as never,
        ]}
        {...props}
      >
        {loading ? <ActivityIndicator size="small" /> : null}
        {children as React.ReactNode}
      </Pressable>
    </TextClassContext.Provider>
  );
}

export { Button, buttonTextVariants, buttonVariants };
export type { ButtonProps };
