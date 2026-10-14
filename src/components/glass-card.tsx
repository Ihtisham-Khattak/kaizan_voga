import { BlurView } from 'expo-blur';
import { createContext, useContext, type ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { useReduceTransparency } from '@/hooks/use-reduce-transparency';
import { alpha } from '@/theme/colors';
import { radius as radii } from '@/theme/radius';
import { useTheme } from '@/theme/theme-provider';

/**
 * THE glass surface (docs/UI_Build.md → Glassmorphism rules). Every frosted panel in the app is a GlassCard:
 *  - fill `glass` (or `glassStrong` for text-heavy panels, forms, the tab bar and sheets)
 *  - backdrop blur 16 – never above 20
 *  - 1px `glassBorder`, soft shadow (0 8 32, forest at 10%)
 *  - radius 20 (card) · 28 (hero) · 999 (pill)
 *  - Reduce Transparency (OS) / High contrast → solid `bgMist`
 *  - Never glass on glass: a GlassCard inside another one drops its blur and becomes a solid `mint` surface.
 * Do not use for safety notices or anything in `danger`.
 */
export const GLASS_BLUR = 16;
const MAX_BLUR = 20;

type Tone = 'leaf' | 'sunrise' | 'sky' | 'lavender';
type Radius = 'card' | 'hero' | 'pill';

/** Numbers from older call sites snap to the spec radii (≥26 hero, ≥19 card, otherwise pill-ish chips). */
function resolveRadius(r: Radius | number | undefined): number {
  if (r === undefined || r === 'card') return radii.card;
  if (r === 'hero') return radii.hero;
  if (r === 'pill') return radii.pill;
  if (r >= 26) return radii.hero;
  if (r >= 19) return radii.card;
  return radii.pill;
}

const NestedGlass = createContext(false);

interface Props {
  /** Use `glassStrong` – for long text, forms, the tab bar and sheets. */
  strong?: boolean;
  radius?: Radius | number;
  /** Per-corner radii for sheets and bars (e.g. top corners only). Values snap to the spec radii. */
  radii?: { tl?: number; tr?: number; br?: number; bl?: number };
  /** A soft colour wash over the glass (celebration, success). Uses palette tokens, never raw colour. */
  tone?: Tone;
  shadow?: boolean;
  /** Outer box: position, size, margins. */
  style?: StyleProp<ViewStyle>;
  /** Inner content box: padding, flexDirection, gap, alignment. */
  contentStyle?: StyleProp<ViewStyle>;
  children?: ReactNode;
}

export function GlassCard({
  strong = false,
  radius,
  radii: perCorner,
  tone,
  shadow = true,
  style,
  contentStyle,
  children,
}: Props) {
  const { colors, shadows, scheme } = useTheme();
  const reduceTransparency = useReduceTransparency();
  const nested = useContext(NestedGlass);

  const corners: ViewStyle = perCorner
    ? {
        borderTopLeftRadius: perCorner.tl ? resolveRadius(perCorner.tl) : 0,
        borderTopRightRadius: perCorner.tr ? resolveRadius(perCorner.tr) : 0,
        borderBottomRightRadius: perCorner.br ? resolveRadius(perCorner.br) : 0,
        borderBottomLeftRadius: perCorner.bl ? resolveRadius(perCorner.bl) : 0,
      }
    : { borderRadius: resolveRadius(radius) };

  const solid = reduceTransparency || nested;
  const fill = nested
    ? colors.mint
    : reduceTransparency
      ? colors.bgMist
      : strong
        ? colors.glassStrong
        : colors.glass;
  const edge = solid ? colors.hairline : colors.glassBorder;
  const blur = Math.min(GLASS_BLUR, MAX_BLUR);

  return (
    // Outer view carries the shadow (iOS clips shadows on views with overflow:hidden); inner view clips the blur.
    <NestedGlass.Provider value>
      <View style={[corners, shadow && !nested && shadows.glass, style]}>
        <View style={[corners, { overflow: 'hidden', borderWidth: 1, borderColor: edge }, contentStyle]}>
          {solid ? null : (
            <BlurView
              intensity={blur}
              tint={scheme === 'dark' ? 'dark' : 'light'}
              experimentalBlurMethod="dimezisBlurView" // real blur on Android
              style={[StyleSheet.absoluteFill, corners]}
            />
          )}
          <View style={[StyleSheet.absoluteFill, corners, { backgroundColor: fill }]} />
          {tone && !solid ? (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: alpha(colors[tone], 0.16) }]} />
          ) : null}
          {children}
        </View>
      </View>
    </NestedGlass.Provider>
  );
}
