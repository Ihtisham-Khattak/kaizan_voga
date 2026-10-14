import { cva, type VariantProps } from 'class-variance-authority';
import { View } from 'react-native';

import { Slot } from '@rn-primitives/slot';

import { TextClassContext } from '@/components/ui/text';
import { cn } from '@/lib/utils';

/** Static label pill. For selectable pills use <Chip>. */
const badgeVariants = cva(
  'shrink-0 flex-row items-center justify-center gap-1 self-start overflow-hidden rounded-pill px-3 py-1',
  {
    variants: {
      variant: {
        default: 'bg-primary',
        secondary: 'bg-mint',
        sky: 'bg-skySoft',
        lavender: 'bg-lavenderSoft',
        // celebration / achievements only
        sunrise: 'bg-sunriseSoft',
        destructive: 'bg-danger/10',
        outline: 'border border-hairline',
      },
    },
    defaultVariants: { variant: 'secondary' },
  }
);

const badgeTextVariants = cva('font-sans-medium text-kz-footnote', {
  variants: {
    variant: {
      default: 'text-onPrimary',
      secondary: 'text-forest',
      sky: 'text-sky',
      lavender: 'text-lavender',
      sunrise: 'text-sunriseInk',
      destructive: 'text-danger',
      outline: 'text-ink',
    },
  },
  defaultVariants: { variant: 'secondary' },
});

type BadgeProps = React.ComponentProps<typeof View> &
  React.RefAttributes<View> & { asChild?: boolean } & VariantProps<typeof badgeVariants>;

function Badge({ className, variant, asChild, ...props }: BadgeProps) {
  const Component = asChild ? Slot : View;
  return (
    <TextClassContext.Provider value={badgeTextVariants({ variant })}>
      <Component className={cn(badgeVariants({ variant }), className)} {...props} />
    </TextClassContext.Provider>
  );
}

export { Badge, badgeTextVariants, badgeVariants };
export type { BadgeProps };
