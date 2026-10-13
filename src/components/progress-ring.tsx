import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { Easing, useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

import { useTheme } from '@/theme/theme-provider';
import type { Tokens } from '@/theme/tokens';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface Props {
  /** 0 – 1 */
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: keyof Pick<Tokens, 'sage' | 'coral' | 'primary' | 'lavender'>;
  /** Animation length for each progress change. Use ~1000 + linear for per-second countdowns. */
  duration?: number;
  linear?: boolean;
  /** Centre slot: countdown text, percentage, icon… */
  children?: React.ReactNode;
  accessibilityLabel?: string;
}

/** Animated arc – sizes: S 48 / M 96 / XL 240 (session countdown). */
export function ProgressRing({
  progress,
  size = 96,
  strokeWidth = 10,
  color = 'sage',
  duration = 600,
  linear = false,
  children,
  accessibilityLabel,
}: Props) {
  const { tokens } = useTheme();
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  const p = useSharedValue(Math.min(1, Math.max(0, progress)));

  useEffect(() => {
    p.value = withTiming(Math.min(1, Math.max(0, progress)), {
      duration,
      easing: linear ? Easing.linear : Easing.inOut(Easing.ease),
    });
  }, [progress, duration, linear, p]);

  const animatedProps = useAnimatedProps(() => ({ strokeDashoffset: c * (1 - p.value) }));

  return (
    <View
      style={{ width: size, height: size }}
      className="items-center justify-center"
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(progress * 100) }}
    >
      <Svg width={size} height={size} style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={tokens.secondary}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={tokens[color]}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={c}
          animatedProps={animatedProps}
          fill="none"
        />
      </Svg>
      {children}
    </View>
  );
}
