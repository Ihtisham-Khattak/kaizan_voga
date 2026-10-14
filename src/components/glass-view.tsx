import { BlurView } from 'expo-blur';
import { useEffect, useState, type ReactNode } from 'react';
import { AccessibilityInfo, Platform, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '@/theme/theme-provider';

/**
 * Glassmorphism for React Native (translated from the web "glassmorphism" pattern: translucent fill +
 * backdrop blur + hairline border). Use it for surfaces that FLOAT over moving or colourful content:
 * tab bar, pinned footers, bottom sheets, toasts, overlay buttons. Do NOT use it for text-heavy cards on
 * plain backgrounds – there is nothing to blur and it only costs contrast and performance.
 *
 * Contrast: the translucent fill is deliberately strong (≥ 0.55 alpha) so text keeps WCAG AA on top of
 * any background; "Reduce Transparency" (iOS) falls back to a solid card colour.
 */
export type GlassLevel = 'subtle' | 'standard' | 'strong';

const LIGHT: Record<GlassLevel, { blur: number; fill: string }> = {
  subtle: { blur: 18, fill: 'rgba(255,255,255,0.42)' },
  standard: { blur: 36, fill: 'rgba(255,255,255,0.60)' },
  strong: { blur: 60, fill: 'rgba(255,255,255,0.80)' },
};
const DARK: Record<GlassLevel, { blur: number; fill: string }> = {
  subtle: { blur: 20, fill: 'rgba(28,38,32,0.42)' },
  standard: { blur: 40, fill: 'rgba(28,38,32,0.60)' },
  strong: { blur: 60, fill: 'rgba(28,38,32,0.82)' },
};

function useReduceTransparency() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (Platform.OS !== 'ios') return;
    AccessibilityInfo.isReduceTransparencyEnabled()
      .then(setOn)
      .catch(() => {});
    const sub = AccessibilityInfo.addEventListener('reduceTransparencyChanged', setOn);
    return () => sub.remove();
  }, []);
  return on;
}

interface Props {
  level?: GlassLevel;
  radius?: number;
  /** Per-corner radii for sheets/bars (overrides `radius`). */
  radii?: { tl?: number; tr?: number; br?: number; bl?: number };
  /** Extra tint over the glass (e.g. a sage wash for success). */
  tint?: string;
  border?: boolean;
  shadow?: boolean;
  /** Outer box: position, size, margins. */
  style?: StyleProp<ViewStyle>;
  /** Inner content box: padding, flexDirection, gap, alignment. */
  contentStyle?: StyleProp<ViewStyle>;
  children?: ReactNode;
}

export function GlassView({
  level = 'standard',
  radius = 24,
  radii,
  tint,
  border = true,
  shadow = true,
  style,
  contentStyle,
  children,
}: Props) {
  const { scheme, tokens } = useTheme();
  const reduceTransparency = useReduceTransparency();
  const g = (scheme === 'dark' ? DARK : LIGHT)[level];
  const borderColor = scheme === 'dark' ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.75)';
  const corners: ViewStyle = radii
    ? {
        borderTopLeftRadius: radii.tl ?? 0,
        borderTopRightRadius: radii.tr ?? 0,
        borderBottomRightRadius: radii.br ?? 0,
        borderBottomLeftRadius: radii.bl ?? 0,
      }
    : { borderRadius: radius };

  return (
    // Outer view carries the shadow (iOS clips shadows on views with overflow:hidden); inner view clips the blur.
    <View
      style={[
        corners,
        shadow && {
          shadowColor: tokens.forest,
          shadowOpacity: scheme === 'dark' ? 0.4 : 0.12,
          shadowRadius: 24,
          shadowOffset: { width: 0, height: 10 },
          elevation: 6,
        },
        style,
      ]}
    >
      <View
        style={[
          corners,
          {
            overflow: 'hidden',
            borderWidth: border ? StyleSheet.hairlineWidth * 2 : 0,
            borderColor,
          },
          contentStyle,
        ]}
      >
        {reduceTransparency ? (
          <View style={[StyleSheet.absoluteFill, { backgroundColor: tokens.card }]} />
        ) : (
          <>
            <BlurView
              intensity={g.blur}
              tint={scheme === 'dark' ? 'dark' : 'light'}
              experimentalBlurMethod="dimezisBlurView" // real blur on Android
              style={[StyleSheet.absoluteFill, corners]}
            />
            <View style={[StyleSheet.absoluteFill, corners, { backgroundColor: g.fill }]} />
            {tint ? <View style={[StyleSheet.absoluteFill, { backgroundColor: tint }]} /> : null}
          </>
        )}
        {children}
      </View>
    </View>
  );
}
