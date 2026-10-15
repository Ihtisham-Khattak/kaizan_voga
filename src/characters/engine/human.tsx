import { useEffect, useId, useMemo } from 'react';
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

import { shade, tint } from '../art/color';
import {
  ARM_W,
  buildHuman,
  CLAY_ARM_W,
  CLAY_HEAD_TRANSFORM,
  FACE_TRANSFORM,
  HEAD_TRANSFORM,
  WAVE,
  type HumanPose,
  type HumanStyle,
} from '../art/human';
import { Face } from './face';
import { ClayContext, ClayDefs, Prims } from './prims';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedEllipse = Animated.createAnimatedComponent(Ellipse);

/** Right arm that waves: elbow + hand swing gently (a static raised arm with Reduce Motion). */
function WavingArm({ style, clay }: { style: HumanStyle; clay: boolean }) {
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
  // Called from animated props (UI thread) – they must be worklets, see the note in face.tsx.
  const elbow = (v: number) => {
    'worklet';
    return [WAVE.elbow[0] + v * 4, WAVE.elbow[1] - v * 2];
  };
  const hand = (v: number) => {
    'worklet';
    return [WAVE.hand[0] - v * 16, WAVE.hand[1] + v * 4];
  };

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
  const W = clay ? CLAY_ARM_W : ARM_W;
  const armColour = short ? style.skin : style.top;
  const upperW = short ? W.upper - 2 : W.upper;
  const lowerW = short ? W.lower - 1 : W.lower;
  return (
    <>
      {clay ? (
        <>
          {/* dark rim underneath, then the lit body, then a thin highlight: reads as a soft tube */}
          <AnimatedPath
            animatedProps={upper}
            stroke={shade(armColour, 0.17)}
            strokeWidth={upperW}
            {...common}
          />
          <AnimatedPath
            animatedProps={lower}
            stroke={shade(armColour, 0.17)}
            strokeWidth={lowerW}
            {...common}
          />
        </>
      ) : null}
      <G transform={clay ? 'translate(-1 -0.8)' : undefined}>
        <AnimatedPath
          animatedProps={upper}
          stroke={armColour}
          strokeWidth={clay ? upperW - 3 : upperW}
          {...common}
        />
        <AnimatedPath
          animatedProps={lower}
          stroke={armColour}
          strokeWidth={clay ? lowerW - 3 : lowerW}
          {...common}
        />
      </G>
      {short ? (
        <AnimatedPath animatedProps={sleeve} stroke={style.top} strokeWidth={W.shortUpper} {...common} />
      ) : null}
      {clay ? (
        <G transform="translate(-3 -2)">
          <AnimatedPath
            animatedProps={lower}
            stroke={tint(armColour, 0.4)}
            strokeWidth={3.4}
            opacity={0.3}
            {...common}
          />
        </G>
      ) : null}
      <AnimatedEllipse animatedProps={handProps} rx={clay ? 9 : 6.6} ry={clay ? 11 : 8.6} fill={style.skin} />
    </>
  );
}

interface Props {
  style: HumanStyle;
  pose: HumanPose;
  mood: Mood;
  animated: boolean;
  /** Soft clay-figurine look (toy-sized head, shaded tube limbs, gradient fills). */
  clay?: boolean;
}

/**
 * One semi-realistic body for every human. All geometry lives in ../art (plain data); this component only
 * layers it and adds the animated bits: the face (mood morph + blink) and the waving arm.
 */
export function Human({ style, pose, mood, animated, clay = false }: Props) {
  const L = useMemo(() => buildHuman(style, pose, clay), [style, pose, clay]);
  const prefix = `cl${useId().replace(/[^a-zA-Z0-9]/g, '')}_`;
  const headT = clay ? CLAY_HEAD_TRANSFORM : HEAD_TRANSFORM;
  const nose = useMemo(() => shade(style.skin, 0.25), [style.skin]);
  const animateWave = pose === 'wave' && animated;

  return (
    <ClayContext.Provider value={clay ? prefix : null}>
      {clay ? (
        <ClayDefs
          prefix={prefix}
          lists={[
            L.behind,
            L.legs,
            L.torso,
            L.neck,
            L.clothing,
            L.frontHair,
            L.armL,
            L.armR,
            L.head,
            L.hairFront,
            L.faceOverlay,
            L.earAccessory,
          ]}
        />
      ) : null}
      <G>
        <G transform={headT}>
          <Prims list={L.behind} />
        </G>
        <Prims list={L.legs} />
        <Prims list={L.torso} />
        <Prims list={L.neck} />
        <Prims list={L.clothing} />
        <Prims list={L.frontHair} />
        <Prims list={L.armL} />
        {animateWave ? <WavingArm style={style} clay={clay} /> : <Prims list={L.armR} />}

        <G transform={headT}>
          <Prims list={L.head} />
          <Prims list={L.hairFront} />
          <G transform={FACE_TRANSFORM}>
            <Face mood={mood} blink={animated} boost={clay ? 1.15 : 1.5} noseColor={nose} />
            <Prims list={L.faceOverlay} />
          </G>
          <Prims list={L.earAccessory} />
        </G>
      </G>
    </ClayContext.Provider>
  );
}
