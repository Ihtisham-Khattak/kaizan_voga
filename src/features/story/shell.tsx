import { router } from 'expo-router';
import { AnimatePresence, MotiView } from 'moti';
import { CaretLeft } from 'phosphor-react-native';
import { useCallback, useEffect, useState, type ComponentType } from 'react';
import { BackHandler, I18nManager, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SceneBackground } from '@/characters/props';
import { GlassCard } from '@/components/glass-card';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { scenes } from '@/data/story';
import { useReduceMotion } from '@/hooks/use-reduced-motion';
import { useT } from '@/i18n';
import { haptic } from '@/lib/haptics';
import { spring } from '@/theme/motion';
import { useTheme } from '@/theme/theme-provider';

import { leaveStory } from './leave';
import { dir } from './stage';
import type { SceneControls, SceneProps } from './types';

interface Props {
  scenes: ComponentType<SceneProps>[];
}

function Dot({ active }: { active: boolean }) {
  const { colors } = useTheme();
  const style = useAnimatedStyle(() => ({
    width: withSpring(active ? 26 : 8, spring.gentle),
    opacity: withSpring(active ? 1 : 0.45, spring.gentle),
  }));
  return (
    <Animated.View
      style={[{ height: 8, borderRadius: 4, backgroundColor: active ? colors.primary : colors.muted }, style]}
    />
  );
}

/**
 * The first-launch story: swipe or tap Next through the scenes. Skip is always visible (top-end),
 * progress dots sit at the bottom, and the ambient background shifts from muted to warm scene by scene.
 */
export function StoryShell({ scenes: SceneList }: Props) {
  const { t } = useT();
  const { scheme } = useTheme();
  const reduce = useReduceMotion();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const total = SceneList.length;
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const go = useCallback(
    (to: number) => {
      if (to < 0 || to >= total) return;
      setDirection(to > index ? 1 : -1);
      haptic.select();
      setIndex(to);
    },
    [index, total]
  );

  const controls: SceneControls = {
    index,
    total,
    next: () => (index === total - 1 ? leaveStory() : go(index + 1)),
    prev: () => go(index - 1),
    skip: leaveStory,
    finish: leaveStory,
    goSignIn: () => router.push('/sign-in'),
  };

  // Android back: previous scene first, exit only from scene 0.
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (index > 0) {
        go(index - 1);
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, [index, go]);

  // Swipe toward the "start" side to go forward (mirrors in RTL).
  const pan = Gesture.Pan()
    .activeOffsetX([-24, 24])
    .failOffsetY([-24, 24])
    .onEnd((e) => {
      const dx = e.translationX * dir();
      if (dx < -70) runOnJS(controls.next)();
      else if (dx > 70) runOnJS(controls.prev)();
    });

  const Scene = SceneList[index];
  const ambient = scenes[index].ambient[scheme];
  const slide = reduce ? 0 : 36 * direction * dir();

  return (
    <View className="flex-1 bg-background">
      <SceneBackground colors={ambient} />

      <GestureDetector gesture={pan}>
        <View style={StyleSheet.absoluteFill}>
          <AnimatePresence>
            <MotiView
              key={index}
              from={{ opacity: 0, translateX: slide }}
              animate={{ opacity: 1, translateX: 0 }}
              exit={{ opacity: 0, translateX: -slide }}
              transition={{ type: 'timing', duration: reduce ? 250 : 450 }}
              style={StyleSheet.absoluteFill}
            >
              <Scene controls={controls} width={width} height={height} />
            </MotiView>
          </AnimatePresence>
        </View>
      </GestureDetector>

      {/* Back (scenes 1+) */}
      {index > 0 ? (
        <GlassCard radius={22} style={{ position: 'absolute', top: insets.top + 8, start: 12 }}>
          <Pressable
            onPress={controls.prev}
            accessibilityRole="button"
            accessibilityLabel={t('a11y.goBack')}
            className="size-11 items-center justify-center"
          >
            <Icon
              as={CaretLeft}
              size={20}
              weight="bold"
              style={I18nManager.isRTL ? { transform: [{ scaleX: -1 }] } : undefined}
            />
          </Pressable>
        </GlassCard>
      ) : null}

      {/* Skip – visible on every scene */}
      <GlassCard radius="pill" style={{ position: 'absolute', top: insets.top + 8, end: 12 }}>
        <Pressable
          onPress={controls.skip}
          accessibilityRole="button"
          accessibilityLabel={t('a11y.skipIntro')}
          className="min-h-11 min-w-11 items-center justify-center px-4"
        >
          <Text variant="label">{t('common.skip')}</Text>
        </Pressable>
      </GlassCard>

      {/* Progress dots */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          bottom: Math.max(insets.bottom, 12) + 10,
          start: 0,
          end: 0,
          alignItems: 'center',
        }}
      >
        <GlassCard
          radius={16}
          shadow={false}
          contentStyle={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            paddingHorizontal: 16,
            paddingVertical: 8,
          }}
        >
          <View
            accessible
            accessibilityLabel={t('story.progress', { current: index + 1, total })}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
          >
            {SceneList.map((_, i) => (
              <Dot key={i} active={i === index} />
            ))}
          </View>
        </GlassCard>
      </View>
    </View>
  );
}
