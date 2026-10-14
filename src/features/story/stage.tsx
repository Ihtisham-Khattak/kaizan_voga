import { MotiView } from 'moti';
import { useEffect, useState, type ReactNode } from 'react';
import { I18nManager, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CANVAS, HIP_Y, HUMAN_ASPECT } from '@/characters/art/human';
import { Character } from '@/characters/character';
import { ThoughtIcon, Bench, type ThoughtKind } from '@/characters/props';
import { FadeUp } from '@/components/fade-up';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useReduceMotion } from '@/hooks/use-reduced-motion';
import type { Mood } from '@/store/types';
import { spring } from '@/theme/motion';
import { CaretRight } from 'phosphor-react-native';

/** +1 in LTR, −1 in RTL – multiply horizontal offsets so entrances come from the right side. */
export const dir = () => (I18nManager.isRTL ? -1 : 1);

/** Stage width: phone width minus gutters, capped for tablets/web. */
export const stageWidth = (screenW: number) => Math.min(screenW - 32, 380);

/** Scrolls only when the scene is taller than the screen (small phones / large text). */
export function SceneScroll({
  children,
  top = 72,
  cta,
  bottomPad,
}: {
  children: ReactNode;
  top?: number;
  /** Extra space under the scrolling content (defaults to clear the pinned CTA). */
  bottomPad?: number;
  /** Primary action, pinned above the progress dots (never pushed below the fold). */
  cta?: ReactNode;
}) {
  const insets = useSafeAreaInsets();
  return (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: 'center',
          paddingTop: top,
          paddingBottom: bottomPad ?? (cta ? 170 : 150),
          paddingHorizontal: 16,
        }}
      >
        {children}
      </ScrollView>
      {cta ? (
        <View
          pointerEvents="box-none"
          style={{
            position: 'absolute',
            start: 16,
            end: 16,
            bottom: Math.max(insets.bottom, 12) + 38,
            alignItems: 'center',
          }}
        >
          {cta}
        </View>
      ) : null}
    </>
  );
}

export function SceneTitle({ children, delay = 0 }: { children: string; delay?: number }) {
  return (
    <FadeUp delay={delay} className="px-2">
      <Text variant="title" className="text-center">
        {children}
      </Text>
    </FadeUp>
  );
}

/** Primary pill used at the bottom of scenes. */
export function SceneCTA({
  label,
  onPress,
  delay = 0,
}: {
  label: string;
  onPress: () => void;
  delay?: number;
}) {
  return (
    <FadeUp delay={delay} style={{ width: '100%', maxWidth: 380 }}>
      <Button size="lg" onPress={onPress}>
        <Text>{label}</Text>
        <Icon
          as={CaretRight}
          size={18}
          weight="bold"
          className="text-primary-foreground"
          style={I18nManager.isRTL ? { transform: [{ scaleX: -1 }] } : undefined}
        />
      </Button>
    </FadeUp>
  );
}

/** Start in one mood and relax into another after `delay` ms (the friends' expressions soften). */
export function useDelayedMood(from: Mood, to: Mood, delay: number): Mood {
  const [mood, setMood] = useState<Mood>(from);
  useEffect(() => {
    const id = setTimeout(() => setMood(to), delay);
    return () => clearTimeout(id);
  }, [to, delay]);
  return mood;
}

type Edge = 'start' | 'end' | 'bottom' | 'top';

/** Slide + fade in from an edge (RTL aware); just a fade with Reduce Motion. */
export function Entrance({
  children,
  from = 'bottom',
  delay = 0,
  distance = 48,
  style,
}: {
  children: ReactNode;
  from?: Edge;
  delay?: number;
  distance?: number;
  style?: object;
}) {
  const reduce = useReduceMotion();
  const x = from === 'start' ? -distance * dir() : from === 'end' ? distance * dir() : 0;
  const y = from === 'bottom' ? distance : from === 'top' ? -distance : 0;
  return (
    <MotiView
      from={{ opacity: 0, translateX: reduce ? 0 : x, translateY: reduce ? 0 : y }}
      animate={{ opacity: 1, translateX: 0, translateY: 0 }}
      transition={
        reduce ? { type: 'timing', duration: 300, delay } : { type: 'spring', ...spring.gentle, delay }
      }
      style={style}
    >
      {children}
    </MotiView>
  );
}

// ─────────────────────────── The three friends on their bench ───────────────────────────

/** Standard height of the seated friends in scenes 1–2. */
export const FRIEND_H = 212;
const THOUGHT_H = 76;
const THOUGHT_SIZE = 62;

/** Where the three seated friends stand inside a stage of width `w` (centres are used to aim speech-bubble tails). */
export function friendsLayout(w: number, charH: number) {
  const cw = charH * HUMAN_ASPECT;
  const gap = Math.max(0, (w - 3 * cw) / 2);
  const xs = [0, 1, 2].map((i) => i * (cw + gap));
  return { cw, gap, xs, centers: xs.map((x) => x + cw / 2) };
}

interface FriendsProps {
  width: number;
  charH?: number;
  moods: Record<'ali' | 'hina' | 'omar', Mood>;
  /** 'in' pops thought icons in; 'out' shows them then fades them away; 'none' hides them. */
  thoughts?: 'in' | 'out' | 'none';
  muted?: boolean;
  /** Small head-turn rotations (deg) toward each other – scene 2. */
  turn?: Partial<Record<'ali' | 'hina' | 'omar', number>>;
  turnDelay?: number;
  enterDelay?: number;
}

const THOUGHTS: Record<'ali' | 'hina' | 'omar', ThoughtKind> = { ali: 'ali', hina: 'hina', omar: 'omar' };

export function FriendsStage({
  width,
  charH = FRIEND_H,
  moods,
  thoughts = 'none',
  muted,
  turn,
  turnDelay = 500,
  enterDelay = 0,
}: FriendsProps) {
  const reduce = useReduceMotion();
  const { xs, centers } = friendsLayout(width, charH);
  const topPad = thoughts === 'none' ? 0 : THOUGHT_H;
  const benchW = Math.min(width, 380);
  const benchH = (benchW * 140) / 360;
  // bench seat top should sit at the friends' hips (y≈200 of the 310-tall canvas)
  const hipY = ((HIP_Y - CANVAS.y) * charH) / CANVAS.h;
  const seatY = (92 * benchH) / 140;
  const names = ['ali', 'hina', 'omar'] as const;

  return (
    <View style={{ width, height: topPad + charH }}>
      <View style={{ position: 'absolute', start: (width - benchW) / 2, top: topPad + hipY - seatY }}>
        <Bench width={benchW} muted={muted} />
      </View>

      {names.map((n, i) => (
        <Entrance
          key={n}
          from={i === 1 ? 'bottom' : i === 0 ? 'start' : 'end'}
          delay={enterDelay + i * 150}
          style={{ position: 'absolute', start: xs[i], top: topPad }}
        >
          <MotiView
            from={{ rotate: '0deg' }}
            animate={{ rotate: `${(turn?.[n] ?? 0) * dir()}deg` }}
            transition={{ type: 'timing', duration: reduce ? 0 : 700, delay: turnDelay }}
          >
            <Character name={n} pose="sit" mood={moods[n]} size={charH} />
          </MotiView>
        </Entrance>
      ))}

      {thoughts !== 'none'
        ? names.map((n, i) => (
            <MotiView
              key={n}
              from={{ opacity: 0, scale: reduce ? 1 : 0.6, translateY: 0 }}
              animate={
                thoughts === 'out'
                  ? { opacity: 0, scale: 1, translateY: reduce ? 0 : -8 }
                  : { opacity: 1, scale: 1, translateY: 0 }
              }
              transition={
                thoughts === 'out'
                  ? { type: 'timing', duration: 700, delay: 500 }
                  : { type: 'spring', ...spring.pop, delay: enterDelay + 500 + i * 150 }
              }
              style={{ position: 'absolute', top: 0, start: centers[i] - THOUGHT_SIZE / 2 }}
            >
              {/* the icon bobs gently while the friend is lost in thought */}
              <MotiView
                from={{ translateY: 0 }}
                animate={{ translateY: reduce || thoughts === 'out' ? 0 : -4 }}
                transition={{ type: 'timing', duration: 1800 + i * 250, loop: !reduce, repeatReverse: true }}
              >
                <ThoughtIcon kind={THOUGHTS[n]} size={THOUGHT_SIZE} />
              </MotiView>
            </MotiView>
          ))
        : null}
    </View>
  );
}
