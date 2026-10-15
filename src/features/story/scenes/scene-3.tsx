import { MotiView } from 'moti';
import { View } from 'react-native';

import { LightRays } from '@/characters/props';
import { SpeechBubble } from '@/components/speech-bubble';
import { scenes } from '@/data/story';
import { useReduceMotion } from '@/hooks/use-reduced-motion';
import { useT } from '@/i18n';

import {
  dir,
  friendsLayout,
  FriendsStage,
  PortraitTile,
  SceneCTA,
  SceneScroll,
  stageWidth,
  useDelayedMood,
} from '../stage';
import type { SceneProps } from '../types';

const cfg = scenes[3];

const FRIEND_GAP = 10;
const WALK_MS = 1300;

/** Scene 3 — Arfa arrives, calm and at ease. Warm light enters; the three friends look up. */
export function Scene3({ controls, width, height }: SceneProps) {
  const { t } = useT();
  const reduce = useReduceMotion();
  const w = stageWidth(width);
  const friendsW = w * 0.64;
  const arfaW = w - friendsW - FRIEND_GAP;
  const arfaH = arfaW * 1.3;
  const { centers } = friendsLayout(friendsW);
  const arfaEnter = cfg.characters.find((c) => c.id === 'arfa')!.enterAt;

  const tailAt = (speaker: string) =>
    speaker === 'arfa'
      ? 1 - arfaW / 2 / w
      : (centers[['hamid', 'hina', 'sierra'].indexOf(speaker)] ?? w / 2) / w;

  return (
    <>
      {/* warm light enters from the corner */}
      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ type: 'timing', duration: 1600, delay: 300 }}
        style={{ position: 'absolute', top: 0, start: 0, end: 0, bottom: 0 }}
        pointerEvents="none"
      >
        <LightRays width={width} height={height} />
      </MotiView>

      <SceneScroll
        top={96}
        cta={
          <SceneCTA label={t('common.next')} onPress={controls.next} delay={cfg.bubbles[3].delayMs + 900} />
        }
      >
        <View style={{ width: w }} className="gap-3">
          {cfg.bubbles.map((b) => (
            <SpeechBubble
              key={b.textKey}
              speaker={b.speaker}
              text={t(b.textKey)}
              delay={b.delayMs}
              tailAt={tailAt(b.speaker)}
            />
          ))}
        </View>

        <View style={{ width: w, height: arfaH }} className="mt-6">
          <View style={{ position: 'absolute', start: 0, bottom: 0 }}>
            <FriendsStage width={friendsW} muted={false} />
          </View>

          <MotiView
            from={{ opacity: 0, translateX: reduce ? 0 : 280 * dir() }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ type: 'timing', duration: reduce ? 400 : WALK_MS, delay: arfaEnter }}
            style={{ position: 'absolute', end: 0, bottom: 0 }}
          >
            <PortraitTile person="arfa" width={arfaW} height={arfaH} ring={4} />
          </MotiView>
        </View>
      </SceneScroll>
    </>
  );
}
