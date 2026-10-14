import { useEffect, useMemo } from 'react';
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Ellipse, G, Path } from 'react-native-svg';

import { useReduceMotion } from '@/hooks/use-reduced-motion';
import type { Mood } from '@/store/types';

import { shade } from '../art/color';
import {
  ARM_W,
  buildHuman,
  FACE_TRANSFORM,
  HEAD_TRANSFORM,
  WAVE,
  type HumanPose,
  type HumanStyle,
} from '../art/human';
import { Face } from './face';
import { Prims } from './prims';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedEllipse = Animated.createAnimatedComponent(Ellipse);

/** Right arm that waves: elbow + hand swing gently (a static raised arm with Reduce Motion). */
function WavingArm({ style }: { style: HumanStyle }) {
  const reduce = useReduceMotion();
  const t = useSharedValue(0);
  useEffect(() => {
    if (reduce) {
      t.value = 0;
      return;
    }
    t.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 520, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 520, easing: Easing.inOut(Easing.sin) })
      ),
      -1
    );
  }, [reduce, t]);

  const [sx, sy] = WAVE.shoulder;
  const short = style.sleeve === 'short';
  const elbow = (v: number) => [WAVE.elbow[0] + v * 4, WAVE.elbow[1] - v * 2];
  const hand = (v: number) => [WAVE.hand[0] - v * 16, WAVE.hand[1] + v * 4];

  const upper = useAnimatedProps(() => {
    const e = elbow(t.value);
    return { d: `M${sx} ${sy} L${e[0]} ${e[1]}` };
  });
  const lower = useAnimatedProps(() => {
    const e = elbow(t.value);
    const h = hand(t.value);
    return { d: `M${e[0]} ${e[1]} L${h[0]} ${h[1]}` };
  });
  const sleeve = useAnimatedProps(() => {
    const e = elbow(t.value);
    return { d: `M${sx} ${sy} L${sx + (e[0] - sx) * 0.62} ${sy + (e[1] - sy) * 0.62}` };
  });
  const handProps = useAnimatedProps(() => {
    const h = hand(t.value);
    return { cx: h[0] - 2, cy: h[1] - 5 };
  });

  const common = { strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' };
  return (
    <>
      <AnimatedPath
        animatedProps={upper}
        stroke={short ? style.skin : style.top}
        strokeWidth={short ? ARM_W.upper - 2 : ARM_W.upper}
        {...common}
      />
      <AnimatedPath
        animatedProps={lower}
        stroke={short ? style.skin : style.top}
        strokeWidth={short ? ARM_W.lower - 1 : ARM_W.lower}
        {...common}
      />
      {short ? (
        <AnimatedPath animatedProps={sleeve} stroke={style.top} strokeWidth={ARM_W.shortUpper} {...common} />
      ) : null}
      <AnimatedEllipse animatedProps={handProps} rx={6.6} ry={8.6} fill={style.skin} />
    </>
  );
}

interface Props {
  style: HumanStyle;
  pose: HumanPose;
  mood: Mood;
  animated: boolean;
}

/**
 * One semi-realistic body for every human. All geometry lives in ../art (plain data); this component only
 * layers it and adds the animated bits: the face (mood morph + blink) and the waving arm.
 */
export function Human({ style, pose, mood, animated }: Props) {
  const L = useMemo(() => buildHuman(style, pose), [style, pose]);
  const nose = useMemo(() => shade(style.skin, 0.25), [style.skin]);
  const animateWave = pose === 'wave' && animated;

  return (
    <G>
      <G transform={HEAD_TRANSFORM}>
        <Prims list={L.behind} />
      </G>
      <Prims list={L.legs} />
      <Prims list={L.torso} />
      <Prims list={L.neck} />
      <Prims list={L.clothing} />
      <Prims list={L.frontHair} />
      <Prims list={L.armL} />
      {animateWave ? <WavingArm style={style} /> : <Prims list={L.armR} />}

      <G transform={HEAD_TRANSFORM}>
        <Prims list={L.head} />
        <Prims list={L.hairFront} />
        <G transform={FACE_TRANSFORM}>
          <Face mood={mood} blink={animated} boost={1.5} noseColor={nose} />
          <Prims list={L.faceOverlay} />
        </G>
        <Prims list={L.earAccessory} />
      </G>
    </G>
  );
}
