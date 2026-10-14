import { useEffect, useMemo } from 'react';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Circle, G, Path } from 'react-native-svg';

import { useReduceMotion } from '@/hooks/use-reduced-motion';
import type { Mood } from '@/store/types';

import { blush, faceInk } from '../palette';
import { MOOD_PARAMS } from './mood-params';
import { art } from '@/theme/illustration';

export { MOOD_PARAMS };

/**
 * The shared face system (viewBox 0 0 100 100): two dot eyes, a small curved-line mouth, tiny blush circles.
 * Expression changes ONLY through eyebrows + mouth curve (plus a little eye squint for tired/calm).
 * Used by every human character AND by the MoodPicker faces, so moods always read the same.
 */

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface Props {
  mood: Mood;
  /** Occasional soft blink (skipped with Reduce Motion). */
  blink?: boolean;
  /** Eyes gently shut with a small smile – used for Kai's sleep pose. */
  closed?: boolean;
  /** Thickens strokes + eyes (for smaller heads). Default 1. */
  boost?: number;
  /** When set, draws a subtle nose in this colour and little highlights in the eyes (semi-realistic humans). */
  noseColor?: string;
}

/** Render inside an <Svg viewBox="0 0 100 100"> (or any <G> already scaled to that box). */
export function Face({ mood, blink = false, closed = false, boost = 1, noseColor }: Props) {
  const reduce = useReduceMotion();
  const base = MOOD_PARAMS[mood];
  const p = useMemo(
    () => (closed ? { ...base, eye: 0.1, mouth: Math.max(base.mouth, 0.35) } : base),
    [closed, base]
  );
  const mouth = useSharedValue(p.mouth);
  const tilt = useSharedValue(p.tilt);
  const lift = useSharedValue(p.lift);
  const eye = useSharedValue(p.eye);
  const arch = useSharedValue(p.arch);
  const blinkScale = useSharedValue(1);

  // Mood changes morph slowly – a friend's face relaxing, not snapping.
  useEffect(() => {
    const cfg = { duration: reduce ? 0 : 600 };
    mouth.value = withTiming(p.mouth, cfg);
    tilt.value = withTiming(p.tilt, cfg);
    lift.value = withTiming(p.lift, cfg);
    eye.value = withTiming(p.eye, cfg);
    arch.value = withTiming(p.arch, cfg);
  }, [mood, closed, reduce, p, mouth, tilt, lift, eye, arch]);

  // A slow, irregular blink every 3.5–6 s makes characters feel alive without being busy.
  useEffect(() => {
    if (!blink || reduce || closed) return;
    let id: ReturnType<typeof setTimeout>;
    const schedule = () => {
      id = setTimeout(
        () => {
          blinkScale.value = withSequence(
            withTiming(0.08, { duration: 90 }),
            withTiming(1, { duration: 150 })
          );
          schedule();
        },
        3500 + Math.random() * 2500
      );
    };
    schedule();
    return () => clearTimeout(id);
  }, [blink, reduce, closed, blinkScale]);

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
  // Eyes are dots; squinting is a vertical shrink done by a smaller circle. `boost` makes them bolder on small heads.
  const eyeBoost = 1 + (boost - 1) * 0.6;
  const eyeR = (v: number, b: number) => Math.max(0.6, 4.4 * (0.55 + 0.45 * v) * b * eyeBoost);
  const leftEye = useAnimatedProps(() => ({ r: eyeR(eye.value, blinkScale.value) }));
  const rightEye = useAnimatedProps(() => ({ r: eyeR(eye.value, blinkScale.value) }));
  // little catch-lights (semi-realistic humans only)
  const leftShine = useAnimatedProps(() => {
    const r = eyeR(eye.value, blinkScale.value);
    return { cx: 34 + r * 0.35, cy: 48 - r * 0.35, r: Math.max(0.5, r * 0.28) };
  });
  const rightShine = useAnimatedProps(() => {
    const r = eyeR(eye.value, blinkScale.value);
    return { cx: 66 + r * 0.35, cy: 48 - r * 0.35, r: Math.max(0.5, r * 0.28) };
  });

  return (
    <G>
      <Circle cx={21} cy={61} r={6.5} fill={blush} opacity={0.3} />
      <Circle cx={79} cy={61} r={6.5} fill={blush} opacity={0.3} />
      {noseColor ? (
        <Path
          d="M49 52 Q47.5 58 51.5 58.5"
          stroke={noseColor}
          strokeWidth={1.8 * boost}
          strokeLinecap="round"
          fill="none"
          opacity={0.8}
        />
      ) : null}
      <AnimatedPath
        animatedProps={leftBrow}
        stroke={faceInk}
        strokeWidth={2.6 * boost}
        strokeLinecap="round"
        fill="none"
      />
      <AnimatedPath
        animatedProps={rightBrow}
        stroke={faceInk}
        strokeWidth={2.6 * boost}
        strokeLinecap="round"
        fill="none"
      />
      <AnimatedCircle animatedProps={leftEye} cx={34} cy={48} fill={faceInk} />
      <AnimatedCircle animatedProps={rightEye} cx={66} cy={48} fill={faceInk} />
      {noseColor ? (
        <>
          <AnimatedCircle animatedProps={leftShine} fill={art.white} opacity={0.9} />
          <AnimatedCircle animatedProps={rightShine} fill={art.white} opacity={0.9} />
        </>
      ) : null}
      <AnimatedPath
        animatedProps={mouthProps}
        stroke={faceInk}
        strokeWidth={2.8 * boost}
        strokeLinecap="round"
        fill="none"
      />
    </G>
  );
}
