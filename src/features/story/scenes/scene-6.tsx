import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScrollView, View } from 'react-native';

import { CharacterAvatar } from '@/components/character-avatar';
import { ConfettiLeaves } from '@/characters/props';
import { FadeUp } from '@/components/fade-up';
import { Text } from '@/components/ui/text';
import { scenes } from '@/data/story';
import { GoalsPicker } from '@/features/onboarding/goals-picker';
import { KaiReaction } from '@/features/onboarding/kai-reaction';
import { useT } from '@/i18n';
import { usePrefsStore } from '@/store/prefs-store';

import { leaveStory } from '../leave';
import { Entrance, SceneCTA, stageWidth } from '../stage';
import { useStoryColors } from '@/theme/story';
import type { SceneProps } from '../types';

const cfg = scenes[6];

/** Scene 6 — "What brings you here?" All four friends cheer; pick goals; Kai reacts; Continue → question 1. */
export function Scene6({ width, height }: SceneProps) {
  const { t } = useT();
  const insets = useSafeAreaInsets();
  const w = stageWidth(width);
  const goals = usePrefsStore((s) => s.goals);
  const sc = useStoryColors();
  const bottom = Math.max(insets.bottom, 12) + 44;

  return (
    <>
      <ConfettiLeaves width={width} height={height} count={10} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          alignItems: 'center',
          paddingTop: insets.top + 56,
          paddingBottom: bottom + 270, // clears the footer (Kai's reply, Continue, step line) so the last goal is fully visible
          paddingHorizontal: 16,
        }}
      >
        <FadeUp>
          <Text variant="title1" className="px-2 text-center" style={{ color: sc.title }}>
            {t('story.s6.title')}
          </Text>
        </FadeUp>

        {/* everyone's here, and happy */}
        <View style={{ width: w }} className="flex-row items-center justify-center pb-1 pt-4">
          {cfg.characters.map((c) => (
            <Entrance
              key={c.id}
              from="bottom"
              delay={c.enterAt + 100}
              distance={40}
              style={{ marginHorizontal: -6 }}
            >
              <CharacterAvatar name={c.id} size={84} ring mood="happy" />
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

      {/* Kai's reaction + Continue: a solid cream footer the goal list scrolls beneath */}
      <View
        style={{
          position: 'absolute',
          start: 0,
          end: 0,
          bottom: 0,
          backgroundColor: sc.bg,
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          borderTopWidth: 1,
          borderColor: sc.cardBorder,
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: bottom,
          alignItems: 'center',
          gap: 0,
        }}
      >
        <View style={{ width: w }}>
          <KaiReaction text={goals.length > 0 ? t('story.s6.kai') : null} />
        </View>
        <View style={{ width: w, alignItems: 'center' }}>
          <SceneCTA
            label={t('common.continue')}
            disabled={goals.length === 0}
            onPress={() => leaveStory({ goalsDone: true })}
          />
        </View>
      </View>
    </>
  );
}
