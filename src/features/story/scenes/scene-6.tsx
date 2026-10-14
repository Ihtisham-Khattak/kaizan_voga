import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScrollView, View } from 'react-native';

import { Character } from '@/characters/character';
import { GlassCard } from '@/components/glass-card';
import { ConfettiLeaves } from '@/characters/props';
import { FadeUp } from '@/components/fade-up';
import { SpeechBubble } from '@/components/speech-bubble';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { scenes } from '@/data/story';
import { GoalsPicker } from '@/features/onboarding/goals-picker';
import { useT } from '@/i18n';
import { usePrefsStore } from '@/store/prefs-store';

import { leaveStory } from '../leave';
import { Entrance, stageWidth } from '../stage';
import type { SceneProps } from '../types';

const cfg = scenes[6];

/** Scene 6 — "What brings you here?" All four friends cheer; pick goals; Kai reacts; Continue → question 1. */
export function Scene6({ width, height }: SceneProps) {
  const { t } = useT();
  const insets = useSafeAreaInsets();
  const w = stageWidth(width);
  const goals = usePrefsStore((s) => s.goals);
  const bottom = Math.max(insets.bottom, 12) + 36;

  return (
    <>
      <ConfettiLeaves width={width} height={height} count={10} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          alignItems: 'center',
          paddingTop: 48,
          paddingBottom: bottom + 130,
          paddingHorizontal: 16,
        }}
      >
        <FadeUp>
          <Text variant="title" className="px-2 text-center">
            {t('story.s6.title')}
          </Text>
        </FadeUp>

        {/* everyone's here, and happy */}
        <View style={{ width: w }} className="flex-row items-end justify-center pt-3">
          {cfg.characters.map((c, i) => (
            <Entrance
              key={c.id}
              from="bottom"
              delay={c.enterAt + 100}
              distance={50}
              style={{ marginHorizontal: -4 }}
            >
              <Character name={c.id} pose={i === 2 ? 'wave' : 'stand'} mood="happy" size={150} />
            </Entrance>
          ))}
        </View>

        <FadeUp delay={500} className="pb-4 pt-2">
          <Text variant="body" className="text-center text-muted-foreground">
            {t('story.s6.subtitle')}
          </Text>
        </FadeUp>

        <View style={{ width: w }}>
          <GoalsPicker />
        </View>
      </ScrollView>

      {/* Kai's reaction + Continue: a glass footer the goal list scrolls beneath */}
      <GlassCard
        strong
        radii={{ tl: 28, tr: 28 }}
        style={{ position: 'absolute', start: 0, end: 0, bottom: 0 }}
        contentStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: bottom,
          alignItems: 'center',
          gap: 12,
        }}
      >
        <View style={{ width: w }}>
          <SpeechBubble speaker="kai" text={t('story.s6.kai')} visible={goals.length > 0} tail="none" />
        </View>
        <View style={{ width: w }}>
          <Button size="lg" disabled={goals.length === 0} onPress={() => leaveStory({ goalsDone: true })}>
            <Text>{t('common.continue')}</Text>
          </Button>
        </View>
      </GlassCard>
    </>
  );
}
