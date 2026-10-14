import { useEffect, useId } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';

import { useReduceMotion } from '@/hooks/use-reduced-motion';
import { useReduceTransparency } from '@/hooks/use-reduce-transparency';
import { useTheme } from '@/theme/theme-provider';

interface BlobProps {
  color: string;
  size: number;
  x: number;
  y: number;
  /** Drift distance (px) and period (ms) – slow, so it reads as breathing, not animation. */
  drift: number;
  period: number;
  still: boolean;
  id: string;
}

/** A large soft blob. A radial gradient fading to transparent stands in for a ~60px blur (RN has no blur filter). */
function Blob({ color, size, x, y, drift, period, still, id }: BlobProps) {
  const t = useSharedValue(0);
  useEffect(() => {
    if (still) {
      t.value = 0;
      return;
    }
    t.value = withRepeat(
      withSequence(
        withTiming(1, { duration: period, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: period, easing: Easing.inOut(Easing.sin) })
      ),
      -1
    );
  }, [still, period, t]);
  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: t.value * drift }, { translateY: t.value * drift * -0.7 }],
  }));
  return (
    <Animated.View style={[{ position: 'absolute', left: x, top: y, width: size, height: size }, style]}>
      <Svg width={size} height={size}>
        <Defs>
          <RadialGradient id={id} cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor={color} stopOpacity={1} />
            <Stop offset="0.55" stopColor={color} stopOpacity={0.55} />
            <Stop offset="1" stopColor={color} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Circle cx={size / 2} cy={size / 2} r={size / 2} fill={`url(#${id})`} />
      </Svg>
    </Animated.View>
  );
}

interface Props {
  /** Evening screens swap one blob for `lavenderSoft` (sleep, wind-down, evening Home). */
  variant?: 'day' | 'evening';
}

/**
 * The soft colour glass floats over (docs/UI_Build.md): 2–3 large `auroraMint` / `auroraSky` blobs on `bg`,
 * drifting slowly. Glass on plain white just looks grey, so every glass screen has one of these behind it.
 * Reduce Transparency hides the blobs; Reduce Motion stops the drift.
 */
export function AuroraBackground({ variant = 'day' }: Props) {
  const { colors } = useTheme();
  const { width, height } = useWindowDimensions();
  const reduceMotion = useReduceMotion();
  const reduceTransparency = useReduceTransparency();
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const evening = variant === 'evening';

  return (
    <View
      pointerEvents="none"
      style={[StyleSheet.absoluteFill, { backgroundColor: colors.bg, overflow: 'hidden' }]}
    >
      {reduceTransparency ? null : (
        <>
          <Blob
            id={`a${uid}`}
            color={colors.auroraMint}
            size={width * 1.25}
            x={-width * 0.4}
            y={-width * 0.2}
            drift={36}
            period={14000}
            still={reduceMotion}
          />
          <Blob
            id={`b${uid}`}
            color={evening ? colors.lavenderSoft : colors.auroraSky}
            size={width * 1.1}
            x={width * 0.25}
            y={height * 0.28}
            drift={-30}
            period={17000}
            still={reduceMotion}
          />
          <Blob
            id={`c${uid}`}
            color={colors.auroraMint}
            size={width * 0.95}
            x={-width * 0.3}
            y={height * 0.62}
            drift={28}
            period={20000}
            still={reduceMotion}
          />
        </>
      )}
    </View>
  );
}
