import { useEffect } from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { useReduceMotion } from '@/hooks/use-reduced-motion';
import { cn } from '@/lib/utils';
import { useTheme } from '@/theme/theme-provider';

/**
 * Loading placeholder (ST-01): a slow, breathing shimmer. With Reduce Motion it is a static tint.
 * Use the screen-sized compositions in features/states/skeletons.tsx rather than placing these by hand.
 */
function Skeleton({ className, style, ...props }: ViewProps & { className?: string }) {
  const reduce = useReduceMotion();
  const { colors } = useTheme();
  const o = useSharedValue(1);
  useEffect(() => {
    if (reduce) {
      o.value = 0.85;
      return;
    }
    o.value = withRepeat(
      withSequence(
        withTiming(0.5, { duration: 1400, easing: Easing.inOut(Easing.sin) }),
        withTiming(1, { duration: 1400, easing: Easing.inOut(Easing.sin) })
      ),
      -1
    );
  }, [reduce, o]);
  const animated = useAnimatedStyle(() => ({ opacity: o.value }));
  // Size and radius live on the plain View (className works there); the fill is a separate animated layer.
  return (
    <View
      className={cn('overflow-hidden rounded-card', className)}
      style={style}
      importantForAccessibility="no-hide-descendants"
      {...props}
    >
      <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: colors.auroraMint }, animated]} />
    </View>
  );
}

export { Skeleton };
