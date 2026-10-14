import { useEffect } from 'react';
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Circle, Defs, Ellipse, G, Path, RadialGradient, Stop } from 'react-native-svg';

import { useReduceMotion } from '@/hooks/use-reduced-motion';
import type { Mood } from '@/store/types';

import { Face } from './engine/face';
import { faceInk } from './palette';
import type { KaiPose } from './types';

const AnimatedPath = Animated.createAnimatedComponent(Path);

/**
 * Kai – the Kaizen guide. A small round sage-green lotus-leaf sprite with a soft glow and two dot eyes.
 * Canvas: viewBox "0 0 160 180". Not a human: no limbs, just two leaf "hands".
 */
export const KAI_VIEWBOX = '0 0 160 180';
const SAGE = '#6E9C7F';
const SAGE_LIGHT = '#8FBFA0';
const SAGE_DARK = '#58866A';

const Sparkle = ({ x, y, color, s = 1 }: { x: number; y: number; color: string; s?: number }) => (
  <G transform={`translate(${x} ${y}) scale(${s})`}>
    <Path d="M0 -8 L2 -2 L8 0 L2 2 L0 8 L-2 2 L-8 0 L-2 -2 Z" fill={color} />
  </G>
);

const leafHand = (side: 'l' | 'r', raised: number) => {
  // raised: 0 = resting at the side, 1 = lifted up
  const dir = side === 'l' ? -1 : 1;
  const bx = 80 + dir * 44;
  const by = 108 - raised * 34;
  const tx = bx + dir * (14 + raised * 6);
  const ty = by - 18 - raised * 14;
  return `M${bx} ${by} C ${bx + dir * 2} ${by - 14} ${tx - dir * 2} ${ty + 8} ${tx} ${ty} C ${tx + dir * 6} ${ty + 16} ${bx + dir * 12} ${by + 6} ${bx} ${by} Z`;
};

function WavingLeaf({ animated }: { animated: boolean }) {
  const reduce = useReduceMotion();
  const t = useSharedValue(0);
  useEffect(() => {
    if (!animated || reduce) {
      t.value = 0;
      return;
    }
    t.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 480, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 480, easing: Easing.inOut(Easing.sin) })
      ),
      -1
    );
  }, [animated, reduce, t]);
  const props = useAnimatedProps(() => {
    const bx = 124;
    const by = 78;
    const tx = 140 + t.value * 8;
    const ty = 46 + t.value * 4;
    return {
      d: `M${bx} ${by} C ${bx + 2} ${by - 14} ${tx - 2} ${ty + 10} ${tx} ${ty} C ${tx + 8} ${ty + 16} ${bx + 12} ${by + 6} ${bx} ${by} Z`,
    };
  });
  return <AnimatedPath animatedProps={props} fill={SAGE_LIGHT} />;
}

interface Props {
  pose: KaiPose;
  mood: Mood;
  animated: boolean;
}

export function Kai({ pose, mood, animated }: Props) {
  const sleeping = pose === 'sleep';
  const celebrate = pose === 'celebrate';
  return (
    <G transform={sleeping ? 'rotate(-6 80 98)' : undefined}>
      <Defs>
        <RadialGradient id="kaiGlow" cx="50%" cy="50%" r="50%">
          <Stop offset="0" stopColor={SAGE_LIGHT} stopOpacity={0.55} />
          <Stop offset="1" stopColor={SAGE_LIGHT} stopOpacity={0} />
        </RadialGradient>
      </Defs>

      {/* soft glow + ground shadow */}
      <Circle cx={80} cy={98} r={80} fill="url(#kaiGlow)" />
      <Ellipse cx={80} cy={170} rx={26} ry={5} fill={faceInk} opacity={0.12} />

      {/* leaf hands */}
      {pose === 'wave' ? (
        <>
          <Path d={leafHand('l', 0)} fill={SAGE_LIGHT} />
          <WavingLeaf animated={animated} />
        </>
      ) : (
        <>
          <Path d={leafHand('l', celebrate ? 1 : 0)} fill={SAGE_LIGHT} />
          <Path d={leafHand('r', celebrate ? 1 : pose === 'bell' ? 0.6 : 0)} fill={SAGE_LIGHT} />
        </>
      )}

      {/* body */}
      <Circle cx={80} cy={98} r={46} fill={SAGE} />
      <Ellipse
        cx={64}
        cy={80}
        rx={15}
        ry={9}
        fill={SAGE_LIGHT}
        opacity={0.65}
        transform="rotate(-30 64 80)"
      />

      {/* lotus-leaf crown */}
      <Path d="M80 56 C58 52 46 34 52 16 C72 20 86 36 80 56 Z" fill={SAGE_DARK} />
      <Path d="M80 56 C102 52 114 34 108 16 C88 20 74 36 80 56 Z" fill={SAGE_DARK} />
      <Path d="M80 56 C70 40 72 24 80 12 C88 24 90 40 80 56 Z" fill={SAGE_LIGHT} />
      <Path d="M80 54 L80 22" stroke="#DCEBDF" strokeWidth={1.6} strokeLinecap="round" opacity={0.7} />

      {/* face: same system as the humans */}
      <G transform="translate(40 58) scale(0.8)">
        <Face mood={mood} blink={animated && !sleeping} closed={sleeping} />
        {sleeping ? (
          // closed-eye arcs
          <>
            <Path
              d="M28 50 Q34 56 40 50"
              stroke={faceInk}
              strokeWidth={2.8}
              strokeLinecap="round"
              fill="none"
            />
            <Path
              d="M60 50 Q66 56 72 50"
              stroke={faceInk}
              strokeWidth={2.8}
              strokeLinecap="round"
              fill="none"
            />
          </>
        ) : null}
      </G>

      {/* pose extras */}
      {celebrate ? (
        <>
          <Sparkle x={20} y={44} color="#E98A6B" s={1.1} />
          <Sparkle x={142} y={32} color="#EED9B7" />
          <Sparkle x={146} y={96} color="#B9AEE0" s={0.9} />
          <Sparkle x={14} y={100} color="#EED9B7" s={0.8} />
          <Sparkle x={80} y={4} color="#E98A6B" s={0.8} />
        </>
      ) : null}
      {pose === 'bell' ? (
        <G transform="translate(132 70)">
          <Path
            d="M-10 14 C-10 4 -6 -5 0 -5 C6 -5 10 4 10 14 Z"
            fill="#EED9B7"
            stroke="#C9A97A"
            strokeWidth={1.4}
          />
          <Circle cx={0} cy={17.5} r={2.6} fill="#E98A6B" />
          <Path
            d="M16 4 Q21 10 16 16 M20 0 Q27 10 20 20"
            stroke={SAGE_DARK}
            strokeWidth={1.6}
            strokeLinecap="round"
            fill="none"
          />
        </G>
      ) : null}
      {sleeping ? (
        <G stroke={SAGE_DARK} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" fill="none">
          <Path d="M112 44 h12 l-12 13 h12" />
          <Path d="M130 28 h8 l-8 9 h8" />
        </G>
      ) : null}
    </G>
  );
}
