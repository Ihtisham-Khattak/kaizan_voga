import Svg, { Circle, Ellipse, G, Line, Path, Rect } from 'react-native-svg';

import { useTheme } from '@/theme/theme-provider';

export type SettingKind = 'desk' | 'sofa' | 'floor';

interface Props {
  kind: SettingKind;
  width: number;
  height: number;
  /** 'back' goes behind the character; 'front' (desk top, laptop) goes in front, hiding the legs. */
  layer: 'back' | 'front';
}

/**
 * Small lived-in rooms for the people's stories (docs/character-bible.md): an office desk, a living-room sofa,
 * a bedroom floor with a rug. Drawn on a 100×100 grid and stretched to the frame. Colours follow the theme so
 * they read in Light and Night.
 */
export function Setting({ kind, width, height, layer }: Props) {
  const { colors, isDark } = useTheme();
  const wood = isDark ? colors.bgMist : colors.sunriseSoft;
  const woodDark = isDark ? colors.hairline : colors.sunrise;
  const wall = isDark ? colors.bgMist : colors.skySoft;
  const window = isDark ? colors.auroraSky : colors.bg;
  const ink = colors.ink;
  const stroke = {
    stroke: ink,
    strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{ position: 'absolute', start: 0, top: 0 }}
    >
      {kind === 'desk' && layer === 'back' ? (
        <G>
          {/* office window and a shelf */}
          <Rect x={58} y={10} width={34} height={36} rx={2} fill={window} opacity={0.9} />
          <Path d="M75 10 V46 M58 28 H92" stroke={wall} strokeWidth={1.4} />
          <Rect x={6} y={30} width={24} height={2.4} rx={1} fill={woodDark} />
          <Rect x={9} y={20} width={5} height={10} rx={1} fill={colors.leaf} />
          <Rect x={15.5} y={17} width={5} height={13} rx={1} fill={colors.lavender} />
          <Rect x={22} y={22} width={5} height={8} rx={1} fill={colors.sunrise} />
        </G>
      ) : null}
      {kind === 'desk' && layer === 'front' ? (
        <G>
          {/* desk top, laptop and a cold mug */}
          <Rect x={0} y={68} width={100} height={6} fill={wood} />
          <Rect x={0} y={74} width={100} height={26} fill={woodDark} opacity={0.55} />
          <Path d="M16 68 L20 50 H48 L52 68 Z" fill={colors.bgMist} {...stroke} />
          <Path d="M12 68 H56" fill="none" {...stroke} />
          <Rect x={70} y={59} width={9} height={9} rx={1.6} fill={colors.bg} {...stroke} />
          <Path d="M79 62 Q84 63 79 67" fill="none" {...stroke} />
        </G>
      ) : null}
      {kind === 'sofa' && layer === 'back' ? (
        <G>
          {/* sofa back and arms, a lamp and its glow */}
          <Circle cx={86} cy={26} r={20} fill={colors.sunriseSoft} opacity={0.65} />
          <Rect x={8} y={40} width={84} height={46} rx={12} fill={colors.lavenderSoft} />
          <Rect x={2} y={56} width={16} height={34} rx={7} fill={colors.lavender} opacity={0.55} />
          <Rect x={82} y={56} width={16} height={34} rx={7} fill={colors.lavender} opacity={0.55} />
          <Path d="M88 30 V64" fill="none" {...stroke} />
          <Path d="M80 28 L96 28 L92 16 L84 16 Z" fill={colors.sunrise} {...stroke} />
          <Rect x={0} y={88} width={100} height={12} fill={woodDark} opacity={0.4} />
        </G>
      ) : null}
      {kind === 'floor' && layer === 'back' ? (
        <G>
          {/* bedroom wall, a plant and a shelf of books, a soft rug */}
          <Rect x={0} y={0} width={100} height={78} fill={wall} opacity={0.5} />
          <Rect x={0} y={78} width={100} height={22} fill={wood} opacity={0.8} />
          <Rect x={8} y={26} width={26} height={2.4} rx={1} fill={woodDark} />
          <Rect x={10} y={14} width={5} height={12} rx={1} fill={colors.primary} />
          <Rect x={16.5} y={17} width={5} height={9} rx={1} fill={colors.sunrise} />
          <Rect x={23} y={13} width={5} height={13} rx={1} fill={colors.sky} />
          <Path
            d="M82 78 Q78 62 84 52 M82 78 Q90 64 92 56 M82 78 Q84 60 78 50"
            stroke={colors.leaf}
            strokeWidth={2.4}
            strokeLinecap="round"
            fill="none"
          />
          <Rect x={76} y={74} width={12} height={8} rx={2} fill={colors.sunrise} />
          <Ellipse cx={50} cy={90} rx={40} ry={7} fill={colors.leaf} opacity={0.35} />
        </G>
      ) : null}
      {kind === 'floor' && layer === 'front' ? <Line x1={0} y1={0} x2={0} y2={0} /> : null}
    </Svg>
  );
}
