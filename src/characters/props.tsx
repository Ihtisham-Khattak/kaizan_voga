import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import Svg, {
  Circle,
  Defs,
  G,
  Line,
  LinearGradient as SvgGradient,
  Path,
  Rect,
  Stop,
} from 'react-native-svg';

import { useReduceMotion } from '@/hooks/use-reduced-motion';
import { useTheme } from '@/theme/theme-provider';
import { art } from '@/theme/illustration';

/** Story-scene props and backgrounds. Shared by scenes 0–6 and the completion celebration. */

// ───────────────────────── Bench ─────────────────────────
export function Bench({ width = 340, muted = false }: { width?: number; muted?: boolean }) {
  const wood = muted ? art.cB3A892 : art.cC9A57A;
  const dark = muted ? art.c968B77 : art.cA5835A;
  return (
    <Svg width={width} height={(width * 140) / 360} viewBox="0 0 360 140">
      {/* backrest */}
      <Rect x={40} y={0} width={14} height={104} rx={7} fill={dark} />
      <Rect x={306} y={0} width={14} height={104} rx={7} fill={dark} />
      <Rect x={22} y={8} width={316} height={16} rx={8} fill={wood} />
      <Rect x={22} y={34} width={316} height={16} rx={8} fill={wood} />
      <Rect x={22} y={60} width={316} height={16} rx={8} fill={wood} />
      {/* seat */}
      <Rect x={8} y={92} width={344} height={22} rx={11} fill={wood} />
      <Rect x={8} y={104} width={344} height={10} rx={5} fill={dark} opacity={0.35} />
      {/* legs */}
      <Rect x={36} y={112} width={14} height={28} rx={7} fill={dark} />
      <Rect x={310} y={112} width={14} height={28} rx={7} fill={dark} />
    </Svg>
  );
}

// ───────────────────────── Thought icons ─────────────────────────
export type ThoughtKind = 'hamid' | 'hina' | 'sierra';

/** Small thought bubble above a person: Hamid laptop + clock, Hina a packed calendar + clock, Sarah moon + swirls. */
export function ThoughtIcon({ kind, size = 84 }: { kind: ThoughtKind; size?: number }) {
  const { colors } = useTheme();
  const ink = colors.ink;
  const stroke = {
    stroke: ink,
    strokeWidth: 2.4,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    fill: 'none',
  };
  return (
    <Svg width={size} height={(size * 100) / 90} viewBox="0 0 90 100">
      <Circle cx={45} cy={40} r={37} fill={colors.bgMist} stroke={colors.hairline} strokeWidth={1.5} />
      <Circle cx={32} cy={84} r={6} fill={colors.bgMist} stroke={colors.hairline} strokeWidth={1.5} />
      <Circle cx={24} cy={95} r={3.4} fill={colors.bgMist} stroke={colors.hairline} strokeWidth={1.5} />
      {kind === 'hamid' && (
        <G>
          {/* laptop */}
          <Rect x={16} y={30} width={34} height={22} rx={3} {...stroke} />
          <Path d="M11 58 H55" {...stroke} />
          {/* clock */}
          <Circle cx={61} cy={28} r={11} {...stroke} fill={colors.bgMist} />
          <Path d="M61 21 V28 L66 31" {...stroke} strokeWidth={2} />
        </G>
      )}
      {kind === 'hina' && (
        <G>
          {/* a packed calendar and a ticking clock */}
          <Rect x={14} y={30} width={36} height={30} rx={4} {...stroke} />
          <Path d="M14 40 H50" {...stroke} />
          <Path d="M24 26 V33 M40 26 V33" {...stroke} />
          <Rect x={20} y={46} width={6} height={6} rx={1.5} {...stroke} fill={art.sand} />
          <Rect x={30} y={46} width={6} height={6} rx={1.5} {...stroke} fill={art.sand} />
          <Rect x={40} y={46} width={6} height={6} rx={1.5} {...stroke} fill={art.sand} />
          <Circle cx={63} cy={52} r={11} {...stroke} fill={colors.bgMist} />
          <Path d="M63 45 V52 L68 55" {...stroke} strokeWidth={2} />
        </G>
      )}
      {kind === 'sierra' && (
        <G>
          {/* moon */}
          <Path d="M52 22 A16 16 0 1 0 60 52 A13 13 0 0 1 52 22 Z" {...stroke} />
          {/* swirling lines */}
          <Path d="M18 34 C 26 28 34 40 26 44 C 20 46 22 38 28 38" {...stroke} strokeWidth={2} />
          <Path d="M62 62 C 70 56 78 66 71 70 C 65 72 66 65 72 65" {...stroke} strokeWidth={2} />
        </G>
      )}
    </Svg>
  );
}

// ───────────────────────── Light rays (Scene 3) ─────────────────────────
export function LightRays({ width, height }: { width: number; height: number }) {
  const rays = [0.0, 0.18, 0.36, 0.54].map((s) => s);
  return (
    <Svg width={width} height={height} style={StyleSheet.absoluteFill} pointerEvents="none">
      <Defs>
        <SvgGradient id="ray" x1="1" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={art.sunbeam} stopOpacity={0.75} />
          <Stop offset="1" stopColor={art.sunbeam} stopOpacity={0} />
        </SvgGradient>
      </Defs>
      {rays.map((s, i) => (
        <Path
          key={i}
          d={`M${width + 10} -10 L${width * (0.68 - s * 0.95)} ${height} L${width * (0.5 - s * 0.95)} ${height} Z`}
          fill="url(#ray)"
          opacity={0.55 - i * 0.07}
        />
      ))}
    </Svg>
  );
}

// ───────────────────────── Confetti leaves ─────────────────────────
const LEAF_COLORS = [art.sage, art.sageLight, art.coral, art.sand, art.lilac];

function Leaf({ color, size }: { color: string; size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M3 21 C3 9 10 3 21 3 C21 14 14 21 3 21 Z" fill={color} />
      <Path d="M3 21 L13 11" stroke={art.cream} strokeWidth={1.4} strokeLinecap="round" opacity={0.6} />
    </Svg>
  );
}

/** Soft confetti of leaves, falling slowly on a loop (scattered and still with Reduce Motion). */
export function ConfettiLeaves({
  width,
  height,
  count = 14,
}: {
  width: number;
  height: number;
  count?: number;
}) {
  const reduce = useReduceMotion();
  return (
    <View style={[StyleSheet.absoluteFill, { overflow: 'hidden' }]} pointerEvents="none">
      {Array.from({ length: count }).map((_, i) => {
        const x = ((i * 53 + 11) % 100) / 100;
        const size = 14 + ((i * 7) % 12);
        const color = LEAF_COLORS[i % LEAF_COLORS.length];
        const dur = 5200 + ((i * 431) % 3200);
        const startY = reduce ? (((i * 29) % 80) / 100) * height : -40;
        return (
          <MotiView
            key={i}
            from={{ translateY: startY, rotate: `${(i * 47) % 360}deg`, opacity: reduce ? 0.8 : 0 }}
            animate={
              reduce
                ? { opacity: 0.8 }
                : { translateY: height + 40, rotate: `${((i * 47) % 360) + 280}deg`, opacity: 1 }
            }
            transition={
              reduce
                ? { type: 'timing', duration: 400 }
                : { type: 'timing', duration: dur, delay: i * 380, loop: true, repeatReverse: false }
            }
            style={{ position: 'absolute', start: x * width, top: 0 }}
          >
            <Leaf color={color} size={size} />
          </MotiView>
        );
      })}
    </View>
  );
}

// ───────────────────────── Scene background ─────────────────────────
type Pair = [string, string];

/** Full-bleed gradient that cross-fades whenever `colors` change (muted → warm across the story). */
export function SceneBackground({ colors, duration = 900 }: { colors: Pair; duration?: number }) {
  const reduce = useReduceMotion();
  const [layers, setLayers] = useState<{ from: Pair; to: Pair }>({ from: colors, to: colors });
  const current = useRef<Pair>(colors);
  const progress = useSharedValue(1);

  useEffect(() => {
    if (current.current[0] === colors[0] && current.current[1] === colors[1]) return;
    setLayers({ from: current.current, to: colors });
    current.current = colors;
    progress.value = 0;
    progress.value = withTiming(1, { duration: reduce ? 300 : duration });
  }, [colors, duration, reduce, progress]);

  const topStyle = useAnimatedStyle(() => ({ opacity: progress.value }));
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <LinearGradient colors={layers.from} style={StyleSheet.absoluteFill} />
      <Animated.View style={[StyleSheet.absoluteFill, topStyle]}>
        <LinearGradient colors={layers.to} style={StyleSheet.absoluteFill} />
      </Animated.View>
    </View>
  );
}

// ───────────────────────── Logo mark ─────────────────────────
/** Kaizen Yoga lotus mark inside a soft ring – used on Welcome, splash and About. */
export function LotusLogo({ size = 96 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 120 120">
      <Circle cx={60} cy={60} r={56} fill={art.mint} />
      <Circle cx={60} cy={60} r={56} fill="none" stroke={art.sage} strokeWidth={2.5} opacity={0.5} />
      <Path d="M60 24 C74 38 78 62 60 84 C42 62 46 38 60 24 Z" fill={art.sage} />
      <Path d="M60 84 C40 86 24 74 18 52 C38 50 54 62 60 84 Z" fill={art.sageDark} />
      <Path d="M60 84 C80 86 96 74 102 52 C82 50 66 62 60 84 Z" fill={art.sageDark} />
      <Path d="M60 84 C52 74 50 60 60 42 C70 60 68 74 60 84 Z" fill={art.sageLight} />
      <Line x1={30} y1={92} x2={90} y2={92} stroke={art.forestDeep} strokeWidth={3.5} strokeLinecap="round" />
    </Svg>
  );
}
