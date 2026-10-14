import { View } from 'react-native';
import Svg, { Circle, Line, Path } from 'react-native-svg';

import type { CoverTint, Exercise } from '@/data/types';
import { KaizenIcon } from '@/icons';
import { coverColor } from '@/theme/cover';
import { useTheme } from '@/theme/theme-provider';

type Variant = 'standing' | 'seated' | 'balance' | 'lying' | 'kneeling' | 'breathing';

/** Pick a stick-figure variant from the exercise. One consistent placeholder style for all poses. */
export function variantFor(e: Pick<Exercise, 'category' | 'tags'>): Variant {
  if (e.category === 'breathing') return 'breathing';
  if (e.category === 'balance') return 'balance';
  switch (e.tags.position) {
    case 'seated':
      return 'seated';
    case 'floor':
    case 'prone':
    case 'supine':
      return 'lying';
    case 'kneeling':
      return 'kneeling';
    default:
      return 'standing';
  }
}

/** Simple pill-limbed figure on a 100×100 grid – a clearly-marked PLACEHOLDER until real pose art exists. */
export function PoseFigure({
  variant,
  size = 96,
  color,
}: {
  variant: Variant;
  size?: number;
  color: string;
}) {
  const L = {
    stroke: color,
    strokeWidth: 7,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    fill: 'none',
  };
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      {variant === 'standing' && (
        <>
          <Circle cx={50} cy={20} r={9} fill={color} />
          <Path d="M50 32 V62 M50 40 L33 54 M50 40 L67 54 M50 62 L41 90 M50 62 L59 90" {...L} />
        </>
      )}
      {variant === 'balance' && (
        <>
          <Circle cx={50} cy={20} r={9} fill={color} />
          <Path d="M50 32 V62 M50 40 L30 44 M50 40 L70 44 M50 62 V90 M50 62 L68 70 L52 76" {...L} />
        </>
      )}
      {variant === 'seated' && (
        <>
          <Circle cx={44} cy={24} r={9} fill={color} />
          <Path d="M44 36 V64 L72 64 V88 M44 44 L62 56" {...L} />
          <Line
            x1={26}
            y1={90}
            x2={82}
            y2={90}
            stroke={color}
            strokeWidth={3}
            strokeLinecap="round"
            opacity={0.5}
          />
        </>
      )}
      {variant === 'lying' && (
        <>
          <Circle cx={22} cy={64} r={9} fill={color} />
          <Path d="M34 68 H64 L86 68 M40 70 L50 78" {...L} />
          <Line
            x1={10}
            y1={86}
            x2={92}
            y2={86}
            stroke={color}
            strokeWidth={3}
            strokeLinecap="round"
            opacity={0.5}
          />
        </>
      )}
      {variant === 'kneeling' && (
        <>
          <Circle cx={30} cy={70} r={9} fill={color} />
          <Path d="M42 66 Q60 50 76 62 L76 82 M42 70 L24 82" {...L} />
          <Line
            x1={10}
            y1={88}
            x2={92}
            y2={88}
            stroke={color}
            strokeWidth={3}
            strokeLinecap="round"
            opacity={0.5}
          />
        </>
      )}
      {variant === 'breathing' && (
        <>
          <Circle cx={50} cy={24} r={9} fill={color} />
          <Path d="M50 36 V60 M50 44 L36 62 M50 44 L64 62" {...L} />
          <Path d="M28 76 Q50 62 72 76 Q50 88 28 76 Z" {...L} strokeWidth={5} />
        </>
      )}
    </Svg>
  );
}

/** Soft organic blob behind covers. */
export function Blob({
  color,
  size = 120,
  opacity = 0.5,
}: {
  color: string;
  size?: number;
  opacity?: number;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 120 120" style={{ position: 'absolute' }}>
      <Path
        d="M60 8c22 0 44 14 50 36s-4 40-20 56-42 20-60 8S6 74 10 52 38 8 60 8z"
        fill={color}
        opacity={opacity}
      />
    </Svg>
  );
}

interface CoverProps {
  tint: CoverTint;
  /** Variant for the placeholder figure; omit for a plain blob + dots cover. */
  figure?: Variant;
  className?: string;
  /** Pixel height; width fills the parent. */
  height?: number;
  width?: number | `${number}%`;
  rounded?: number;
  /** Shift the figure/motif vertically (negative = up), e.g. to clear a glass panel laid over the bottom. */
  figureShift?: number;
  /** Override the figure size (px); defaults to ~80% of the height, max 110. */
  figureSize?: number;
}

/** Tinted cover art for routines/programs/exercises. Colours come from tokens so dark mode just works. */
export function CoverArt({
  tint,
  figure,
  height = 120,
  width = '100%',
  rounded = 20,
  figureShift = 0,
  figureSize,
}: CoverProps) {
  const { colors } = useTheme();
  const base = coverColor(colors, tint);
  return (
    <View
      style={{
        height,
        width,
        borderRadius: rounded,
        overflow: 'hidden',
        backgroundColor: base + '55',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Lighter + warmer blobs than the base tint so the shapes are actually visible */}
      <View style={{ position: 'absolute', end: -20, top: -24, width: height * 1.3, height: height * 1.3 }}>
        <Blob color={colors.bgMist} size={height * 1.3} opacity={0.45} />
      </View>
      <View
        style={{ position: 'absolute', start: -18, bottom: -26, width: height * 0.9, height: height * 0.9 }}
      >
        <Blob color={colors.sunriseSoft} size={height * 0.9} opacity={0.5} />
      </View>
      <View style={{ transform: [{ translateY: figureShift }] }}>
        {figure ? (
          <PoseFigure
            variant={figure}
            size={figureSize ?? Math.min(height * 0.8, 110)}
            color={colors.primary}
          />
        ) : (
          <KaizenIcon
            name="lotus"
            size={Math.min(height * 0.5, 64)}
            color={colors.primary}
            strokeWidth={1.5}
          />
        )}
      </View>
    </View>
  );
}
