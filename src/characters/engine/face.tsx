import { useEffect } from 'react';
import Animated, { useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated';
import { Circle, G, Path } from 'react-native-svg';

import { useReduceMotion } from '@/hooks/use-reduced-motion';
import type { Mood } from '@/store/types';

import { blush, faceInk } from '../palette';

/**
 * The shared face system (viewBox 0 0 100 100): two dot eyes, a small curved-line mouth, tiny blush circles.
 * Expression changes ONLY through eyebrows + mouth curve (plus a little eye squint for tired/calm).
 * Used by every human character AND by the MoodPicker faces, so moods always read the same.
 */

interface FaceParams {
  /** Mouth curve: -1 frown … 0 flat … +1 broad smile */
  mouth: number;
  /** Brow tilt: +1 worried (inner ends raised) … -1 relaxed arch (outer ends raised) */
  tilt: number;
  /** Brow height: + lowers, − raises */
  lift: number;
  /** Eye openness 0.2 … 1 */
  eye: number;
  /** Brow arch */
  arch: number;
}

export const MOOD_PARAMS: Record<Mood, FaceParams> = {
  stressed: { mouth: -0.55, tilt: 1, lift: -1, eye: 1, arch: 0 },
  tired: { mouth: -0.15, tilt: 0.35, lift: 3, eye: 0.55, arch: 0 },
  neutral: { mouth: 0, tilt: 0, lift: 0, eye: 1, arch: 1 },
  calm: { mouth: 0.5, tilt: -0.25, lift: 0, eye: 0.7, arch: 2 },
  happy: { mouth: 0.95, tilt: -0.35, lift: -3, eye: 1, arch: 2.5 },
};

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface Props {
  mood: Mood;
}

/** Render inside an <Svg viewBox="0 0 100 100"> (or any <G> already scaled to that box). */
export function Face({ mood }: Props) {
  const reduce = useReduceMotion();
  const p = MOOD_PARAMS[mood];
  const mouth = useSharedValue(p.mouth);
  const tilt = useSharedValue(p.tilt);
  const lift = useSharedValue(p.lift);
  const eye = useSharedValue(p.eye);
  const arch = useSharedValue(p.arch);

  // Mood changes morph slowly – a friend's face relaxing, not snapping.
  useEffect(() => {
    const cfg = { duration: reduce ? 0 : 600 };
    mouth.value = withTiming(p.mouth, cfg);
    tilt.value = withTiming(p.tilt, cfg);
    lift.value = withTiming(p.lift, cfg);
    eye.value = withTiming(p.eye, cfg);
    arch.value = withTiming(p.arch, cfg);
  }, [mood, reduce, p, mouth, tilt, lift, eye, arch]);

  const mouthProps = useAnimatedProps(() => {
    const w = 14 + Math.max(0, mouth.value) * 4; // broader when happy
    return { d: `M${50 - w} 67 Q50 ${67 + mouth.value * 13} ${50 + w} 67` };
  });
  const leftBrow = useAnimatedProps(() => {
    const base = 33 + lift.value;
    const outer = base + tilt.value * 3;
    const inner = base - tilt.value * 3;
    return { d: `M24 ${outer} Q33 ${(outer + inner) / 2 - arch.value} 42 ${inner}` };
  });
  const rightBrow = useAnimatedProps(() => {
    const base = 33 + lift.value;
    const outer = base + tilt.value * 3;
    const inner = base - tilt.value * 3;
    return { d: `M76 ${outer} Q67 ${(outer + inner) / 2 - arch.value} 58 ${inner}` };
  });
  // Eyes are dots; squinting is a vertical shrink done by moving the centre of a smaller circle.
  const leftEye = useAnimatedProps(() => ({ r: 4.4 * (0.55 + 0.45 * eye.value) }));
  const rightEye = useAnimatedProps(() => ({ r: 4.4 * (0.55 + 0.45 * eye.value) }));

  return (
    <G>
      <Circle cx={21} cy={61} r={6.5} fill={blush} opacity={0.32} />
      <Circle cx={79} cy={61} r={6.5} fill={blush} opacity={0.32} />
      <AnimatedPath
        animatedProps={leftBrow}
        stroke={faceInk}
        strokeWidth={2.6}
        strokeLinecap="round"
        fill="none"
      />
      <AnimatedPath
        animatedProps={rightBrow}
        stroke={faceInk}
        strokeWidth={2.6}
        strokeLinecap="round"
        fill="none"
      />
      <AnimatedCircle animatedProps={leftEye} cx={34} cy={48} fill={faceInk} />
      <AnimatedCircle animatedProps={rightEye} cx={66} cy={48} fill={faceInk} />
      <AnimatedPath
        animatedProps={mouthProps}
        stroke={faceInk}
        strokeWidth={2.8}
        strokeLinecap="round"
        fill="none"
      />
    </G>
  );
}
