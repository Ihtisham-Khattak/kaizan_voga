import { View } from 'react-native';

import { SpeechBubble } from '@/components/speech-bubble';
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
} from '../stage';
import type { SceneProps } from '../types';

const cfg = scenes[1];
const mood = (id: 'ali' | 'hina' | 'omar') => cfg.characters.find((c) => c.id === id)!.mood;

/** Scene 1 — "Sound familiar?" Muted palette. Three friends on a bench, each with a worry above them. */
export function Scene1({ controls, width }: SceneProps) {
  const { t } = useT();
  const w = stageWidth(width);
  const { centers } = friendsLayout(w, FRIEND_H);

  return (
    <SceneScroll cta={<SceneCTA label={t('common.next')} onPress={controls.next} delay={2900} />}>
      <SceneTitle>{t('story.s1.title')}</SceneTitle>

      {/* bubbles pop in one by one (≈600 ms apart); each tail points at its speaker */}
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
        <FriendsStage
          width={w}
          muted
          thoughts="in"
          moods={{ ali: mood('ali'), hina: mood('hina'), omar: mood('omar') }}
        />
      </View>
    </SceneScroll>
  );
}
