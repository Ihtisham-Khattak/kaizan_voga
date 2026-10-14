import { View } from 'react-native';

import { FadeUp } from '@/components/fade-up';
import { SpeechBubble } from '@/components/speech-bubble';
import { Text } from '@/components/ui/text';
import { scenes } from '@/data/story';
import { useT } from '@/i18n';

import {
  FRIEND_H,
  friendsLayout,
  FriendsStage,
  SceneCTA,
  SceneScroll,
  SceneTitle,
  stageWidth,
  useDelayedMood,
} from '../stage';
import type { SceneProps } from '../types';

const prev = scenes[1];
const cfg = scenes[2];
const m = (s: typeof cfg, id: 'ali' | 'hina' | 'omar') => s.characters.find((c) => c.id === id)!.mood;

/** Scene 2 — "You're not alone". They turn toward each other and their expressions soften. */
export function Scene2({ controls, width }: SceneProps) {
  const { t } = useT();
  const w = stageWidth(width);
  const { centers } = friendsLayout(w, FRIEND_H);
  const moods = {
    ali: useDelayedMood(m(prev, 'ali'), m(cfg, 'ali'), 900),
    hina: useDelayedMood(m(prev, 'hina'), m(cfg, 'hina'), 700),
    omar: useDelayedMood(m(prev, 'omar'), m(cfg, 'omar'), 1100),
  };

  return (
    <SceneScroll cta={<SceneCTA label={t('common.next')} onPress={controls.next} delay={2900} />}>
      <SceneTitle>{t('story.s2.title')}</SceneTitle>

      <View style={{ width: w }} className="gap-3 pt-4">
        {cfg.bubbles.map((b) => (
          <SpeechBubble
            key={b.textKey}
            speaker={b.speaker}
            text={t(b.textKey)}
            delay={b.delayMs}
            tailAt={centers[['ali', 'hina', 'omar'].indexOf(b.speaker)] / w}
          />
        ))}
      </View>

      <View className="pt-6">
        {/* thoughts drift away; the three turn toward each other */}
        <FriendsStage
          width={w}
          muted
          thoughts="out"
          moods={moods}
          turn={{ ali: 5, hina: -3, omar: -5 }}
          turnDelay={500}
        />
      </View>

      <FadeUp delay={2300} className="max-w-[340px] pt-12">
        <Text variant="body" className="text-center text-muted-foreground">
          {t('story.s2.caption')}
        </Text>
      </FadeUp>
    </SceneScroll>
  );
}
