import { router } from 'expo-router';
import { AnimatePresence, MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { CaretLeft } from 'phosphor-react-native';
import { useCallback, useEffect, useState, type ComponentType } from 'react';
import { BackHandler, I18nManager, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CharacterLook } from '@/characters/character';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useReduceMotion } from '@/hooks/use-reduced-motion';
import { useT } from '@/i18n';
import { haptic } from '@/lib/haptics';
import { spring } from '@/theme/motion';
import { useStoryColors } from '@/theme/story';

import { leaveStory } from './leave';
import { dir } from './stage';
import type { SceneControls, SceneProps } from './types';

interface Props {
  scenes: ComponentType<SceneProps>[];
}

function Dot({ active }: { active: boolean }) {
  const sc = useStoryColors();
  const style = useAnimatedStyle(() => ({
    width: withSpring(active ? 28 : 8, spring.gentle),
  }));
  return (
    <Animated.View
      style={[{ height: 8, borderRadius: 4, backgroundColor: active ? sc.dotOn : sc.dotOff }, style]}
    />
  );
}

/**
 * The first-launch story: swipe or tap Next through the scenes. Skip is always visible (top-end),
 * progress dots sit at the bottom, and the ambient background shifts from muted to warm scene by scene.
 */
export function StoryShell({ scenes: SceneList }: Props) {
  const { t } = useT();
  const sc = useStoryColors();
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
  const sign = dir(); // read on the JS thread: the gesture callback is a worklet and cannot call dir()
  const pan = Gesture.Pan()
    .activeOffsetX([-24, 24])
    .failOffsetY([-24, 24])
    .onEnd((e) => {
      const dx = e.translationX * sign;
      if (dx < -70) runOnJS(controls.next)();
      else if (dx > 70) runOnJS(controls.prev)();
    });

  const Scene = SceneList[index];
  const slide = reduce ? 0 : 36 * direction * dir();

  return (
    <CharacterLook value="clay">
      <View style={{ flex: 1, backgroundColor: sc.bg }}>
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

        {/* solid band under the header so scrolling content never shows behind the controls */}
        <LinearGradient
          pointerEvents="none"
          colors={[sc.bg, sc.bg, sc.bg + '00']}
          locations={[0, 0.72, 1]}
          style={{ position: 'absolute', top: 0, start: 0, end: 0, height: insets.top + 78 }}
        />
        {/* header: back · progress pill · skip (Skip is visible on every scene) */}
        <View
          style={{
            position: 'absolute',
            top: 0,
            start: 0,
            end: 0,
            paddingTop: insets.top + 8,
            paddingHorizontal: 16,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {index > 0 ? (
            <Pressable
              onPress={controls.prev}
              accessibilityRole="button"
              accessibilityLabel={t('a11y.goBack')}
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: sc.circleBg,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon
                as={CaretLeft}
                size={22}
                weight="bold"
                color={sc.title}
                style={I18nManager.isRTL ? { transform: [{ scaleX: -1 }] } : undefined}
              />
            </Pressable>
          ) : (
            <View style={{ width: 48, height: 48 }} />
          )}
          <View
            accessible
            accessibilityLabel={t('story.progress', { current: index + 1, total })}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderRadius: 999,
              backgroundColor: sc.pillBg,
            }}
          >
            {SceneList.map((_, i) => (
              <Dot key={i} active={i === index} />
            ))}
          </View>
          <Pressable
            onPress={controls.skip}
            accessibilityRole="button"
            accessibilityLabel={t('a11y.skipIntro')}
            style={{
              minHeight: 48,
              minWidth: 48,
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 4,
            }}
          >
            <Text variant="bodyLarge" style={{ color: sc.muted }}>
              {t('common.skip')}
            </Text>
          </Pressable>
        </View>

        {/* footer: "Step 3 of 7 • Gentle foundations" */}
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
          <Text variant="callout" style={{ color: sc.body }}>
            {t('story.step', { current: index + 1, total })}
            <Text variant="callout" style={{ color: sc.muted }}>
              {'  •  '}
            </Text>
            <Text variant="callout" style={{ color: sc.positive }}>
              {t(`story.stepLabel.s${index}`)}
            </Text>
          </Text>
        </View>
      </View>
    </CharacterLook>
  );
}
