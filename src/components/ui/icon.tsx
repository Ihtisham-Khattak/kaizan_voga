import type { Icon as PhosphorIcon, IconProps as PhosphorProps } from 'phosphor-react-native';
import { cssInterop } from 'nativewind';
import * as React from 'react';

import { TextClassContext } from '@/components/ui/text';
import { cn } from '@/lib/utils';

type IconProps = PhosphorProps & {
  /** Any Phosphor icon component, e.g. `as={Leaf}`. */
  as: PhosphorIcon;
  className?: string;
};

function IconImpl({ as: IconComponent, ...props }: IconProps) {
  return <IconComponent {...props} />;
}

// Lets `className="text-primary size-5"` drive Phosphor's `color` and `size` props.
cssInterop(IconImpl, {
  className: {
    target: 'style',
    nativeStyleToProp: { color: 'color', height: 'size', width: 'size' },
  },
});

/**
 * Phosphor icon with NativeWind `className` support.
 * Use `weight="regular"` for UI icons and `weight="duotone"` for feature cards.
 * Decorative – put the accessibility label on the pressable parent.
 */
function Icon({ as: IconComponent, className, size = 20, weight = 'regular', ...props }: IconProps) {
  const textClass = React.useContext(TextClassContext);
  return (
    <IconImpl
      as={IconComponent}
      className={cn('text-foreground', textClass, className)}
      size={size}
      weight={weight}
      {...props}
    />
  );
}

export { Icon };
