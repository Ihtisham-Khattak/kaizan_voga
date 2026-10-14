import { MotiView } from 'moti';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { Character } from '@/characters/character';
import { Text } from '@/components/ui/text';
import { milestones, scenes, type Milestone } from '@/data/story';
import { useReduceMotion } from '@/hooks/use-reduced-motion';
import { useT } from '@/i18n';
import { KaizenIcon } from '@/icons';
import { haptic } from '@/lib/haptics';
import { cn } from '@/lib/utils';
import type { Mood } from '@/store/types';
import { spring } from '@/theme/motion';
import { useTheme } from '@/theme/theme-provider';

import { dir, Entrance, SceneCTA, SceneScroll, SceneTitle, stageWidth } from '../stage';
import type { SceneProps } from '../types';
import { art } from '@/theme/illustration';

const cfg = scenes[4];
const NODE = 30;

function MilestoneRow({
  m,
  lit,
  nextLit,
  isLast,
}: {
  m: Milestone;
  lit: boolean;
  nextLit: boolean;
  isLast: boolean;
}) {
  const { t } = useT();
  const { colors } = useTheme();
  const reduce = useReduceMotion();
  const [h, setH] = useState(0);

  return (
    <View onLayout={(e) => setH(e.nativeEvent.layout.height)} className="flex-row gap-3 pb-4">
      {/* path segment down to the next node: grey track, sage fill draws in when the next node lights */}
      {!isLast ? (
        <View
          style={{
            position: 'absolute',
            start: NODE / 2 - 1.5,
            top: NODE,
            width: 3,
            height: Math.max(0, h - NODE),
            borderRadius: 2,
            backgroundColor: colors.hairline,
            overflow: 'hidden',
          }}
        >
          <MotiView
            animate={{ height: nextLit ? Math.max(0, h - NODE) : 0 }}
            transition={{ type: 'timing', duration: reduce ? 200 : 700 }}
            style={{ width: 3, backgroundColor: colors.leaf }}
          />
        </View>
      ) : null}

      <View style={{ width: NODE, height: NODE }} className="items-center justify-center">
        {/* a ring ripples out when the node lights */}
        {lit && !reduce ? (
          <MotiView
            from={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 2.2, opacity: 0 }}
            transition={{ type: 'timing', duration: 900 }}
            style={{
              position: 'absolute',
              width: NODE,
              height: NODE,
              borderRadius: NODE / 2,
              backgroundColor: colors.leaf,
            }}
          />
        ) : null}
        <MotiView
          animate={{ scale: lit ? 1 : 0.9, backgroundColor: lit ? colors.leaf : colors.bgMist }}
          transition={{ type: 'spring', ...spring.pop }}
          style={{
            width: NODE,
            height: NODE,
            borderRadius: NODE / 2,
            borderWidth: 2,
            borderColor: lit ? colors.leaf : colors.hairline,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <MotiView
            animate={{ scale: lit ? 1 : 0, rotate: lit ? '0deg' : '-40deg' }}
            transition={{ type: 'spring', ...spring.pop, delay: 120 }}
          >
            <KaizenIcon name="leaf" size={16} color={art.night} strokeWidth={2} />
          </MotiView>
        </MotiView>
      </View>

      <MotiView
        animate={{ opacity: lit ? 1 : 0.5 }}
        transition={{ type: 'timing', duration: 500 }}
        style={{ flex: 1 }}
      >
        <View className={cn('self-start rounded-full bg-secondary px-3 py-1')}>
          <Text variant="caption" className="font-sans-semibold text-secondary-foreground">
            {t('story.s4.week', { n: m.week })}
          </Text>
        </View>
        <Text variant="bodyLarge" className="pt-1 font-sans-semibold">
          {t(m.titleKey)}
        </Text>
        <Text variant="caption">{t(m.subKey)}</Text>
      </MotiView>
    </View>
  );
}

/** Scene 4 — Kai's 30-day journey. The path lights up week by week and the friends' faces improve with it. */
export function Scene4({ controls, width }: SceneProps) {
  const { t } = useT();
  const reduce = useReduceMotion();
  const w = stageWidth(width);
  const [lit, setLit] = useState(0);

  useEffect(() => {
    const ids = milestones.map((m, i) =>
      setTimeout(() => {
        setLit(i + 1);
        haptic.select();
      }, m.litAt)
    );
    return () => ids.forEach(clearTimeout);
  }, []);

  const friendMood: Mood = lit === 0 ? 'stressed' : milestones[lit - 1].friendMood;
  const done = lit === milestones.length;
  const bubble = cfg.bubbles[0];

  return (
    <SceneScroll
      top={60}
      cta={
        <View className="w-full items-center gap-2">
          {/* always visible */}
          <Text variant="caption" className="max-w-[340px] text-center">
            {t('story.s4.footnote')}
          </Text>
          <SceneCTA label={t('common.next')} onPress={controls.next} delay={1000} />
        </View>
      }
      bottomPad={200}
    >
      <SceneTitle>{t('story.s4.title')}</SceneTitle>

      {/* Kai floats in; once the month is complete he cheers and says his line beside him */}
      <View style={{ width: w }} className="flex-row items-center gap-2 pt-1">
        <Entrance from="top" distance={60} delay={200}>
          <Character name="kai" pose={done ? 'celebrate' : 'float'} mood="happy" size={92} />
        </Entrance>
        <MotiView
          animate={{ opacity: done ? 1 : 0, translateX: done || reduce ? 0 : -12 * dir() }}
          transition={{ type: 'timing', duration: 500, delay: done ? 400 : 0 }}
          style={{ flex: 1 }}
          pointerEvents="none"
          accessibilityLiveRegion="polite"
        >
          <View className="rounded-[18px] border border-border bg-card px-4 py-3 shadow-lg shadow-forest/10">
            <View className="absolute -start-[7px] top-8 size-3.5 rotate-45 border-b border-s border-border bg-card" />
            <Text variant="caption" className="font-sans-semibold text-foreground">
              Kai
            </Text>
            <Text variant="caption" className="text-foreground">
              {t(bubble.textKey)}
            </Text>
          </View>
        </MotiView>
      </View>

      <View style={{ width: w }} className="flex-row gap-3 pt-2">
        <View className="flex-1 pt-1">
          {milestones.map((m, i) => (
            <MilestoneRow
              key={m.week}
              m={m}
              lit={lit > i}
              nextLit={lit > i + 1}
              isLast={i === milestones.length - 1}
            />
          ))}
        </View>

        {/* the three friends watch from the side */}
        <View className="items-center justify-start gap-1" style={{ width: 70 }}>
          {(['ali', 'hina', 'omar'] as const).map((n, i) => (
            <Entrance key={n} from="end" delay={300 + i * 150} distance={30}>
              <Character name={n} pose="stand" mood={friendMood} size={112} />
            </Entrance>
          ))}
        </View>
      </View>
    </SceneScroll>
  );
}
