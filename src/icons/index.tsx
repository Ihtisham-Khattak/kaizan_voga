import type { ReactNode } from 'react';
import Svg, { Circle, G, Path, Rect } from 'react-native-svg';
import { art } from '@/theme/illustration';

/**
 * ORIGINAL Kaizen icon set – brand moments only (Practice tab button, quick-relief tiles, goal cards,
 * achievement badges, equipment, movement). Everyday UI icons use Phosphor.
 *
 * Rules: 24×24 grid · 1.75 px stroke · round caps + joins · one corner radius · a small leaf accent
 * (borrowed from Kai) where it fits.
 */

export const STROKE = 1.75;

/** Small Kai-style leaf accent, top-right. */
const Leaf = ({ x = 0, y = 0 }: { x?: number; y?: number }) => (
  <Path d={`M${16 + x} ${6 + y}c0-2.2 1.6-3.6 3.8-3.6 0 2.2-1.6 3.6-3.8 3.6z`} />
);

type Draw = () => ReactNode;

const icons = {
  // ── brand ──────────────────────────────────────────
  /** Centre tab button: breathing circle + leaf */
  practice: () => (
    <>
      <Circle cx={10.5} cy={14} r={7} />
      <Circle cx={10.5} cy={14} r={3} />
      <Leaf x={1.5} y={-1} />
    </>
  ),
  leaf: () => (
    <>
      <Path d="M5 19c0-8 5-14 15-14 0 10-6 15-15 14z" />
      <Path d="M5 19l8-8" />
    </>
  ),
  lotus: () => (
    <>
      <Path d="M12 5c2.5 2.5 3 6 0 10-3-4-2.5-7.5 0-10z" />
      <Path d="M12 15c-3.5.5-6.5-1-8-4.5 3.5-.5 6.5 1 8 4.5z" />
      <Path d="M12 15c3.5.5 6.5-1 8-4.5-3.5-.5-6.5 1-8 4.5z" />
      <Path d="M5 19h14" />
    </>
  ),
  bell: () => (
    <>
      <Path d="M6 17c1-1 1.5-3 1.5-6a4.5 4.5 0 0 1 9 0c0 3 .5 5 1.5 6z" />
      <Path d="M10 20a2 2 0 0 0 4 0" />
      <Leaf y={-1} x={-2} />
    </>
  ),
  /** Rest day – a calm crescent with Kai's leaf (never a failure marker). */
  'rest-moon': () => (
    <>
      <Path d="M18 15.5A7.5 7.5 0 0 1 8.5 6a7.5 7.5 0 1 0 9.5 9.5z" />
      <Leaf x={1} y={-1} />
    </>
  ),
  'badge-frame': () => (
    <>
      <Path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" />
      <Path d="M9 12.5c0-2.2 1.4-3.6 3.5-3.6 0 2.2-1.4 3.6-3.5 3.6z" />
      <Path d="M9 12.5l-1 1.5" />
    </>
  ),

  // ── quick relief ──────────────────────────────────
  'calm-anxiety': () => (
    <>
      <Path d="M3 11c2-3 4-3 6 0s4 3 6 0 4-3 6 0" />
      <Path d="M6 16c1.5-1.5 3-1.5 4.5 0s3 1.5 4.5 0 3-1.5 3-1.5" />
      <Leaf y={-1} x={-4} />
    </>
  ),
  'desk-neck': () => (
    <>
      <Circle cx={8.5} cy={6.5} r={2.5} />
      <Path d="M8.5 9.5v4.5c0 1 .8 2 2 2H15" />
      <Path d="M4 20h16" />
      <Path d="M15 11.5h5V16" />
    </>
  ),
  'cant-sleep': () => (
    <>
      <Path d="M19 15A7.5 7.5 0 0 1 9 5a7.5 7.5 0 1 0 10 10z" />
      <Path d="M14 4h4l-4 4h4" />
    </>
  ),
  energy: () => (
    <>
      <Path d="M13 3L6 13h5l-1 8 7-10h-5z" />
    </>
  ),
  exam: () => (
    <>
      <Path d="M5 5h10a3 3 0 0 1 3 3v11H8a3 3 0 0 1-3-3z" />
      <Path d="M8 19a3 3 0 0 1-3-3" />
      <Path d="M9 11.5l2 2 3.5-4" />
    </>
  ),

  // ── goals ────────────────────────────────────────
  'goal-stress': () => (
    <>
      <Path d="M12 12c0-1 1.5-1.5 2-.5s-.5 3-2.5 3-3.5-2-3.5-4 2-5 5-5 6 2.5 6 6" />
      <Leaf y={14} x={-6} />
    </>
  ),
  'goal-back-neck': () => (
    <>
      <Path d="M10 3c3 2 3 4 1 6s-2 4 1 6 1 4-1 6" />
      <Path d="M14 7h3M14 12h3M14 17h3" />
    </>
  ),
  'goal-sleep': () => (
    <>
      <Path d="M19 14.5A7.5 7.5 0 0 1 9.5 5a7.5 7.5 0 1 0 9.5 9.5z" />
      <Path d="M17.5 4v3M16 5.5h3" />
    </>
  ),
  'goal-focus': () => (
    <>
      <Circle cx={12} cy={12} r={8} />
      <Circle cx={12} cy={12} r={4} />
      <Circle cx={12} cy={12} r={0.6} />
    </>
  ),
  'goal-flex': () => (
    <>
      <Circle cx={17.5} cy={5.5} r={2} />
      <Path d="M4 19c4-8 8-11 13-11" />
      <Path d="M8 19h9" />
    </>
  ),
  'goal-balance': () => (
    <>
      <Rect x={6} y={16} width={12} height={4} rx={2} />
      <Rect x={8} y={11} width={8} height={4} rx={2} />
      <Rect x={10} y={6.5} width={4} height={3.5} rx={1.75} />
    </>
  ),
  'goal-gentle': () => (
    <>
      <Path d="M20 4c-8 0-13 5-14 14l-1 2" />
      <Path d="M9 15c3 0 6-2 7-6" />
      <Path d="M7.5 11.5c2 0 4-1 5-3.5" />
    </>
  ),

  // ── equipment ────────────────────────────────────
  mat: () => (
    <>
      <Rect x={4} y={9} width={16} height={6} rx={3} />
      <Path d="M17 9a3 3 0 0 1 0 6" />
    </>
  ),
  chair: () => (
    <>
      <Path d="M8 3v9" />
      <Path d="M8 3h2" />
      <Path d="M8 12h9" />
      <Path d="M9 12v8M16 12v8" />
    </>
  ),
  blocks: () => (
    <>
      <Rect x={3} y={12} width={9} height={8} rx={2} />
      <Rect x={12} y={5} width={9} height={8} rx={2} />
    </>
  ),
  strap: () => (
    <>
      <Path d="M5 8h14a3 3 0 0 1 0 6H5a3 3 0 0 1 0-6z" />
      <Path d="M10 6.5v9" />
    </>
  ),
  cushion: () => (
    <>
      <Path d="M5 7c4-1.5 10-1.5 14 0 1 4 1 6 0 10-4 1.5-10 1.5-14 0-1-4-1-6 0-10z" />
      <Circle cx={12} cy={12} r={0.7} />
    </>
  ),

  // ── movement ────────────────────────────────────
  seated: () => (
    <>
      <Circle cx={9.5} cy={5.5} r={2} />
      <Path d="M9.5 8v6h6.5v5" />
      <Path d="M4 20h13" />
    </>
  ),
  standing: () => (
    <>
      <Circle cx={12} cy={4.5} r={2} />
      <Path d="M12 7.5v7" />
      <Path d="M7.5 10h9" />
      <Path d="M12 14.5l-3 6M12 14.5l3 6" />
    </>
  ),
  floor: () => (
    <>
      <Circle cx={5} cy={13} r={2} />
      <Path d="M8 15h8l4 3" />
      <Path d="M3 20h18" />
    </>
  ),
  'low-impact': () => (
    <>
      <Path d="M3 14c3-4 6-4 9 0s6 4 9 0" />
      <Leaf y={-1} x={-4} />
    </>
  ),
  sunrise: () => (
    <>
      <Path d="M4 18h16" />
      <Path d="M8 18a4 4 0 0 1 8 0" />
      <Path d="M12 6v3M5.5 11l2 2M18.5 11l-2 2" />
    </>
  ),
} satisfies Record<string, Draw>;

export type KaizenIconName = keyof typeof icons;
export const kaizenIconNames = Object.keys(icons) as KaizenIconName[];

interface Props {
  name: KaizenIconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export function KaizenIcon({ name, size = 24, color = art.forestDeep, strokeWidth = STROKE }: Props) {
  const draw = icons[name];
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <G stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" fill="none">
        {draw()}
      </G>
    </Svg>
  );
}

export const isKaizenIcon = (n: string): n is KaizenIconName => n in icons;
