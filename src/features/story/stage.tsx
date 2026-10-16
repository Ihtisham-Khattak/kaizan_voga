import { MotiView } from 'moti';
import { useEffect, useState, type ReactNode } from 'react';
import { I18nManager, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { signature } from '@/characters/palette';
import { ThoughtIcon, type ThoughtKind } from '@/characters/props';
import { PersonPhoto } from '@/components/person-photo';
import type { Person } from '@/data/companions';
import { art } from '@/theme/illustration';
import { FadeUp } from '@/components/fade-up';
import { LinearGradient } from 'expo-linear-gradient';
import { Icon } from '@/components/ui/icon';
import { haptic } from '@/lib/haptics';
import { useStoryColors } from '@/theme/story';
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
  bandColor,
}: {
  children: ReactNode;
  top?: number;
  /** Colour of the fade band under the pinned CTA. Defaults to the story background; token screens pass `colors.bg`. */
  bandColor?: string;
  /** Extra space under the scrolling content (defaults to clear the pinned CTA). */
  bottomPad?: number;
  /** Primary action, pinned above the progress dots (never pushed below the fold). */
  cta?: ReactNode;
}) {
  const insets = useSafeAreaInsets();
  const sc = useStoryColors();
  // solid band under the button + footer so scrolling content never shows through them
  const band = Math.max(insets.bottom, 12) + 44 + 60 + 24;
  return (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: 'center',
          // clears the header row (back · dots · skip); `top` is extra space on top of that
          paddingTop: insets.top + 56 + Math.max(0, top - 72),
          paddingBottom: bottomPad ?? (cta ? 190 : 120),
          paddingHorizontal: 16,
        }}
      >
        {children}
      </ScrollView>
      {cta ? (
        <LinearGradient
          pointerEvents="none"
          colors={[(bandColor ?? sc.bg) + '00', bandColor ?? sc.bg, bandColor ?? sc.bg]}
          locations={[0, 0.28, 1]}
          style={{ position: 'absolute', start: 0, end: 0, bottom: 0, height: band }}
        />
      ) : null}
      {cta ? (
        <View
          pointerEvents="box-none"
          style={{
            position: 'absolute',
            start: 16,
            end: 16,
            bottom: Math.max(insets.bottom, 12) + 44,
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
  const sc = useStoryColors();
  return (
    <FadeUp delay={delay} className="px-2">
      <Text variant="title1" className="text-center" style={{ color: sc.title }}>
        {children}
      </Text>
    </FadeUp>
  );
}

/** Primary pill used at the bottom of scenes: deep-green fill, white label, arrow. */
export function SceneCTA({
  label,
  onPress,
  delay = 0,
  disabled,
}: {
  label: string;
  onPress: () => void;
  delay?: number;
  disabled?: boolean;
}) {
  const sc = useStoryColors();
  return (
    <FadeUp delay={delay} style={{ width: '100%', maxWidth: 420 }}>
      <Pressable
        onPress={() => {
          haptic.light();
          onPress();
        }}
        accessibilityRole="button"
        accessibilityLabel={label}
        disabled={disabled}
        accessibilityState={{ disabled }}
        style={{
          opacity: disabled ? 0.45 : 1,
          minHeight: 60,
          borderRadius: 999,
          backgroundColor: sc.button,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          paddingHorizontal: 24,
          shadowColor: sc.button,
          shadowOpacity: 0.25,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: 6 },
          // no `elevation`: on Android its shadow ignores the fade-in and shows as a grey ghost first
        }}
      >
        <Text variant="button" style={{ color: sc.buttonText }}>
          {label}
        </Text>
        <Icon
          as={CaretRight}
          size={18}
          weight="bold"
          color={sc.buttonText}
          style={I18nManager.isRTL ? { transform: [{ scaleX: -1 }] } : undefined}
        />
      </Pressable>
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

// ─────────────────────────── The three friends (portrait tiles) ───────────────────────────

/** Kept for callers that size the stage; the tiles derive their height from the stage width. */
export const FRIEND_H = 212;
const THOUGHT_H = 76;
const THOUGHT_SIZE = 62;
const TILE_GAP = 10;
const TILE_RATIO = 1.28;

/** Where the three portrait tiles sit inside a stage of width `w` (centres aim the speech-bubble tails). */
export function friendsLayout(w: number, _charH?: number) {
  const tw = (w - 2 * TILE_GAP) / 3;
  const xs = [0, 1, 2].map((i) => i * (tw + TILE_GAP));
  return { cw: tw, th: tw * TILE_RATIO, gap: TILE_GAP, xs, centers: xs.map((x) => x + tw / 2) };
}

interface FriendsProps {
  width: number;
  charH?: number;
  moods?: Record<'hamid' | 'hina' | 'sierra', Mood>;
  /** 'in' pops thought icons in; 'out' shows them then fades them away; 'none' hides them. */
  thoughts?: 'in' | 'out' | 'none';
  /** Slightly greyed while they are struggling (scenes 1–2). */
  muted?: boolean;
  /** Small tilts (deg) toward each other – scene 2. */
  turn?: Partial<Record<'hamid' | 'hina' | 'sierra', number>>;
  turnDelay?: number;
  enterDelay?: number;
}

const THOUGHTS: Record<'hamid' | 'hina' | 'sierra', ThoughtKind> = {
  hamid: 'hamid',
  hina: 'hina',
  sierra: 'sierra',
};

/** Rounded portrait tile in a person's signature colour. */
export function PortraitTile({
  person,
  width,
  height,
  muted,
  ring = 3,
}: {
  person: Person;
  width: number;
  height: number;
  muted?: boolean;
  ring?: number;
}) {
  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={person}
      style={{
        width,
        height,
        borderRadius: 22,
        borderWidth: ring,
        borderColor: signature[person],
        overflow: 'hidden',
        backgroundColor: signature[person] + '33',
      }}
    >
      <PersonPhoto person={person} width={width - ring * 2} height={height - ring * 2} faceAt={0.4} />
      {muted ? (
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: 0,
            start: 0,
            end: 0,
            bottom: 0,
            backgroundColor: art.cC7CDC8,
            opacity: 0.22,
          }}
        />
      ) : null}
    </View>
  );
}

export function FriendsStage({
  width,
  thoughts = 'none',
  muted,
  turn,
  turnDelay = 500,
  enterDelay = 0,
}: FriendsProps) {
  const reduce = useReduceMotion();
  const { cw, th, xs, centers } = friendsLayout(width);
  const topPad = thoughts === 'none' ? 0 : THOUGHT_H;
  const names = ['hamid', 'hina', 'sierra'] as const;

  return (
    <View style={{ width, height: topPad + th }}>
      {names.map((n, i) => (
        <Entrance
          key={n}
          from={i === 1 ? 'bottom' : i === 0 ? 'start' : 'end'}
          delay={enterDelay + i * 150}
          style={{ position: 'absolute', start: xs[i], top: topPad }}
        >
          <MotiView
            from={{ rotate: '0deg' }}
            animate={{ rotate: `${(turn?.[n] ?? 0) * 0.4 * dir()}deg` }}
            transition={{ type: 'timing', duration: reduce ? 0 : 700, delay: turnDelay }}
          >
            <PortraitTile person={n} width={cw} height={th} muted={muted} />
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
