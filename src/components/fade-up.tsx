import { MotiView } from 'moti';
import type { ComponentProps } from 'react';

import { useReduceMotion } from '@/hooks/use-reduced-motion';

type Props = ComponentProps<typeof MotiView> & {
  /** ms before the entrance starts */
  delay?: number;
  /** px the element rises while fading in (0 with Reduce Motion) */
  distance?: number;
  duration?: number;
};

/** Gentle entrance: fade in while rising a few pixels. Fade only with Reduce Motion. */
export function FadeUp({ delay = 0, distance = 14, duration = 600, children, ...rest }: Props) {
  const reduce = useReduceMotion();
  return (
    <MotiView
      from={{ opacity: 0, translateY: reduce ? 0 : distance }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: reduce ? 300 : duration, delay }}
      {...rest}
    >
      {children}
    </MotiView>
  );
}
