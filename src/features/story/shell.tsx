import { router } from 'expo-router';
import { AnimatePresence, MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { CaretLeft, CaretRight } from 'phosphor-react-native';
import { useCallback, useEffect, useState, type ComponentType } from 'react';
import { BackHandler, I18nManager, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Easing, runOnJS } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CharacterLook } from '@/characters/character';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useReduceMotion } from '@/hooks/use-reduced-motion';
import { useT } from '@/i18n';
import { haptic } from '@/lib/haptics';
import { useStoryColors } from '@/theme/story';
import { useTheme } from '@/theme/theme-provider';

import { leaveStory } from './leave';
import { dir } from './stage';
import type { SceneControls, SceneProps } from './types';

interface Props {
  scenes: ComponentType<SceneProps>[];
}

/**
 * A soft tab on the screen edge, vertically centred, that breathes (zoom in, zoom out) to say "this way".
 * `next` sits on the end edge, `prev` on the start edge; both mirror in RTL. Tokens only (docs/UI_Build.md).
 */
function EdgeArrow({ kind, onPress, label }: { kind: 'next' | 'prev'; onPress: () => void; label: string }) {
  const { colors } = useTheme();
  const reduce = useReduceMotion();
  const next = kind === 'next';
  // `next` points to the reading direction's end, `prev` to its start; the caret itself flips in RTL
  const flip = I18nManager.isRTL ? { transform: [{ scaleX: -1 }] } : undefined;
  const side = next ? { end: 0 } : { start: 0 };
  const inner = 16;
  return (
    <MotiView
      key={kind}
      from={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: 'timing', duration: 300 }}
      pointerEvents="box-none"
      style={[{ position: 'absolute', top: '50%', marginTop: -30 }, side]}
    >
      <MotiView
        from={{ scale: 1 }}
        animate={{ scale: reduce ? 1 : 1.16 }}
        transition={{
          type: 'timing',
          duration: 1100,
          loop: !reduce,
          repeatReverse: true,
          easing: Easing.inOut(Easing.sin),
        }}
      >
        <Pressable
          onPress={() => {
            haptic.light();
            onPress();
          }}
          accessibilityRole="button"
          accessibilityLabel={label}
          hitSlop={8}
          style={{
            width: 32,
            height: 60,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.glassStrong,
            borderWidth: 1,
            borderColor: colors.glassBorder,
            borderStartWidth: next ? 1 : 0,
            borderEndWidth: next ? 0 : 1,
            borderTopStartRadius: next ? inner : 0,
            borderBottomStartRadius: next ? inner : 0,
            borderTopEndRadius: next ? 0 : inner,
            borderBottomEndRadius: next ? 0 : inner,
          }}
        >
          <Icon
            as={next ? CaretRight : CaretLeft}
            size={20}
            weight="bold"
            color={colors.forest}
            style={flip}
          />
        </Pressable>
      </MotiView>
    </MotiView>
  );
}

/**
 * The first-launch story: swipe or tap Next through the scenes. Skip is always visible (top-end),
 * the step line sits at the bottom, edge arrows show the way, and the ambient background shifts from muted to warm scene by scene.
 */
/** Positions already rebuilt on the docs/UI_Build.md tokens (the other scenes still use the story palette). */
const TOKEN_SCENES = new Set([2, 3, 4]);

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
  // Scenes rebuilt strictly on the docs/UI_Build.md tokens sit on the theme `bg`, so the header band must match.
  const { colors } = useTheme();
  const token = TOKEN_SCENES.has(index);
  const surface = token ? colors.bg : sc.bg;
  // header + footer colours: spec tokens for token scenes, the story palette for the rest
  const chrome = token
    ? {
        circleBg: colors.mint,
        title: colors.forest,
        muted: colors.muted,
        body: colors.ink,
        positive: colors.primary,
      }
    : sc;
  const slide = reduce ? 0 : 36 * direction * dir();

  return (
    <CharacterLook value="clay">
      <View style={{ flex: 1, backgroundColor: surface }}>
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
          colors={[surface, surface, surface + '00']}
          locations={[0, 0.72, 1]}
          style={{ position: 'absolute', top: 0, start: 0, end: 0, height: insets.top + 78 }}
        />
        {/* edge arrows: forward on every scene but the last, back on every scene but the first */}
        <AnimatePresence>
          {index < total - 1 ? (
            <EdgeArrow key={`n${index}`} kind="next" onPress={controls.next} label={t('common.next')} />
          ) : null}
          {index > 0 ? (
            <EdgeArrow key={`p${index}`} kind="prev" onPress={controls.prev} label={t('a11y.goBack')} />
          ) : null}
        </AnimatePresence>

        {/* header: back · skip (Skip is visible on every scene) */}
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
                backgroundColor: chrome.circleBg,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon
                as={CaretLeft}
                size={22}
                weight="bold"
                color={chrome.title}
                style={I18nManager.isRTL ? { transform: [{ scaleX: -1 }] } : undefined}
              />
            </Pressable>
          ) : (
            <View style={{ width: 48, height: 48 }} />
          )}
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
            <Text variant="bodyLarge" style={{ color: chrome.muted }}>
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
          <Text variant="callout" style={{ color: chrome.body }}>
            {t('story.step', { current: index + 1, total })}
            <Text variant="callout" style={{ color: chrome.muted }}>
              {'  •  '}
            </Text>
            <Text variant="callout" style={{ color: chrome.positive }}>
              {t(`story.stepLabel.s${index}`)}
            </Text>
          </Text>
        </View>
      </View>
    </CharacterLook>
  );
}
