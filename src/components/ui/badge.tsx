import { cva, type VariantProps } from 'class-variance-authority';
import { View } from 'react-native';

import { Slot } from '@rn-primitives/slot';

import { TextClassContext } from '@/components/ui/text';
import { cn } from '@/lib/utils';

/** Static label pill. For selectable pills use <Chip>. */
const badgeVariants = cva('shrink-0 flex-row items-center justify-center gap-1 self-start overflow-hidden rounded-pill px-3 py-1', {
  variants: {
    variant: {
      default: 'bg-primary',
      secondary: 'bg-secondary',
      coral: 'bg-coral/25',
      lavender: 'bg-lavender/35',
      sand: 'bg-sand/60',
      destructive: 'bg-destructive/10',
      outline: 'border-border border',
    },
  },
  defaultVariants: { variant: 'secondary' },
});

const badgeTextVariants = cva('font-sans-medium text-kz-caption', {
  variants: {
    variant: {
      default: 'text-primary-foreground',
      secondary: 'text-secondary-foreground',
      coral: 'text-foreground',
      lavender: 'text-foreground',
      sand: 'text-foreground',
      destructive: 'text-destructive',
      outline: 'text-foreground',
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
