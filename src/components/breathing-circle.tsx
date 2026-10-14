import { useEffect, useState } from 'react';
import { View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { Text } from '@/components/ui/text';
import { useReduceMotion } from '@/hooks/use-reduced-motion';
import { useT } from '@/i18n';
import { CALM_BREATH, type BreathPhase } from '@/lib/breath';
import { useTheme } from '@/theme/theme-provider';
import type { Tokens } from '@/theme/tokens';

const MIN_SCALE = 0.62;

interface Props {
  size?: number;
  /** Phases in order; defaults to the signature 4 s in / hold / 6 s out. */
  phases?: BreathPhase[];
  running?: boolean;
  tint?: keyof Pick<Tokens, 'sage' | 'lavender' | 'coral' | 'sand' | 'primary'>;
  /** Show "Inhale… / Hold… / Exhale…" in the middle. */
  showCue?: boolean;
  /** Softer, more transparent rings – for use as a background behind characters. */
  soft?: boolean;
  onPhaseChange?: (phase: BreathPhase, index: number) => void;
  /** Extra content centred in the circle (replaces the cue). */
  children?: React.ReactNode;
}

/**
 * The recurring "breathing circle" motif. Concentric circles expand on inhale and contract on exhale.
 * Reduce Motion: the circle stops moving and its glow cross-fades instead; the text cue still changes.
 */
export function BreathingCircle({
  size = 240,
  phases = CALM_BREATH,
  running = true,
  tint = 'sage',
  showCue = false,
  soft = false,
  onPhaseChange,
  children,
}: Props) {
  const { t } = useT();
  const { tokens } = useTheme();
  const reduce = useReduceMotion();
  const [index, setIndex] = useState(0);
  const scale = useSharedValue(running ? MIN_SCALE : 0.8);
  const glow = useSharedValue(0);

  const phase = phases[index % phases.length];

  useEffect(() => {
    if (!running) {
      scale.value = withTiming(0.8, { duration: 600 });
      glow.value = withTiming(0.4, { duration: 600 });
      return;
    }
    onPhaseChange?.(phase, index);
    const ease = { duration: phase.ms, easing: Easing.inOut(Easing.sin) };
    if (phase.kind === 'inhale') {
      if (!reduce) scale.value = withTiming(1, ease);
      glow.value = withTiming(1, ease);
    } else if (phase.kind === 'exhale') {
      if (!reduce) scale.value = withTiming(MIN_SCALE, ease);
      glow.value = withTiming(0, ease);
    }
    const id = setTimeout(() => setIndex((i) => (i + 1) % phases.length), phase.ms);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, index, phases, reduce]);

  const outer = useAnimatedStyle(() => ({
    transform: [{ scale: reduce ? 0.9 : scale.value }],
    opacity: (reduce ? 0.12 + glow.value * 0.3 : 0.2 + glow.value * 0.1) * (soft ? 0.7 : 1),
  }));
  const mid = useAnimatedStyle(() => ({
    transform: [{ scale: reduce ? 0.78 : 0.82 * scale.value + 0.1 }],
    opacity: (reduce ? 0.2 + glow.value * 0.35 : 0.35) * (soft ? 0.7 : 1),
  }));
  const core = useAnimatedStyle(() => ({
    transform: [{ scale: reduce ? 0.62 : 0.62 * scale.value + 0.12 }],
    opacity: soft ? 0.5 : 0.9,
  }));

  const color = tokens[tint];
  const disc = (d: number) => ({
    position: 'absolute' as const,
    width: d,
    height: d,
    borderRadius: d / 2,
    backgroundColor: color,
  });

  return (
    <View
      style={{ width: size, height: size }}
      className="items-center justify-center"
      accessibilityRole="image"
      accessibilityLabel={t('breath.a11y')}
    >
      <Animated.View style={[disc(size), outer]} />
      <Animated.View style={[disc(size), mid]} />
      <Animated.View style={[disc(size), core]} />
      <View className="absolute items-center justify-center px-6">
        {children ??
          (showCue ? (
            <Text variant="heading" className="text-center text-primary-foreground">
              {t(`breath.${phase.kind}`)}
            </Text>
          ) : null)}
      </View>
    </View>
  );
}
