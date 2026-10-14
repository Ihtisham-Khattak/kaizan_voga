import { cva, type VariantProps } from 'class-variance-authority';
import { View } from 'react-native';

import { Text, TextClassContext } from '@/components/ui/text';
import { cn } from '@/lib/utils';

/** Radius 20 (cards), soft low-opacity shadow with a large blur. For frosted panels use <GlassCard>. */
const cardVariants = cva('flex flex-col gap-4 rounded-card py-5', {
  variants: {
    variant: {
      default: 'border border-hairline bg-card shadow-lg shadow-forest/10',
      mint: 'bg-mint',
      sunrise: 'bg-sunriseSoft',
      lavender: 'bg-lavenderSoft',
      outline: 'border border-hairline bg-transparent',
      flat: 'bg-card',
    },
  },
  defaultVariants: { variant: 'default' },
});

function Card({
  className,
  variant,
  ...props
}: React.ComponentProps<typeof View> & React.RefAttributes<View> & VariantProps<typeof cardVariants>) {
  return (
    <TextClassContext.Provider value="text-card-foreground">
      <View className={cn(cardVariants({ variant }), className)} {...props} />
    </TextClassContext.Provider>
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<typeof View> & React.RefAttributes<View>) {
  return <View className={cn('flex flex-col gap-1.5 px-5', className)} {...props} />;
}

function CardTitle({
  className,
  ...props
}: React.ComponentProps<typeof Text> & React.RefAttributes<React.ComponentRef<typeof Text>>) {
  return <Text variant="heading" className={className} {...props} />;
}

function CardDescription({
  className,
  ...props
}: React.ComponentProps<typeof Text> & React.RefAttributes<React.ComponentRef<typeof Text>>) {
  return <Text variant="caption" className={className} {...props} />;
}

function CardContent({ className, ...props }: React.ComponentProps<typeof View> & React.RefAttributes<View>) {
  return <View className={cn('px-5', className)} {...props} />;
}

function CardFooter({ className, ...props }: React.ComponentProps<typeof View> & React.RefAttributes<View>) {
  return <View className={cn('flex flex-row items-center px-5', className)} {...props} />;
}

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, cardVariants };
