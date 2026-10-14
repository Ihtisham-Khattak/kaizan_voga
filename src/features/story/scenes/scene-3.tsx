import { MotiView } from 'moti';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { Character } from '@/characters/character';
import { LightRays } from '@/characters/props';
import { SpeechBubble } from '@/components/speech-bubble';
import { scenes } from '@/data/story';
import { useReduceMotion } from '@/hooks/use-reduced-motion';
import { useT } from '@/i18n';

import {
  dir,
  friendsLayout,
  FriendsStage,
  SceneCTA,
  SceneScroll,
  stageWidth,
  useDelayedMood,
} from '../stage';
import type { SceneProps } from '../types';

const prev = scenes[2];
const cfg = scenes[3];
const m = (s: typeof cfg, id: 'ali' | 'hina' | 'omar') => s.characters.find((c) => c.id === id)!.mood;

const ZARA_H = 222;
const FRIEND_H = 164;
const WALK_MS = 1300;

/** Scene 3 — Zara arrives, calm and smiling. Warm light enters; the friends perk up. */
export function Scene3({ controls, width, height }: SceneProps) {
  const { t } = useT();
  const reduce = useReduceMotion();
  const w = stageWidth(width);
  const friendsW = w * 0.74;
  const { centers } = friendsLayout(friendsW, FRIEND_H);
  const zaraEnter = cfg.characters.find((c) => c.id === 'zara')!.enterAt;

  // a little bob in her step while she walks in
  const [walking, setWalking] = useState(true);
  useEffect(() => {
    const id = setTimeout(() => setWalking(false), zaraEnter + WALK_MS);
    return () => clearTimeout(id);
  }, [zaraEnter]);

  const moods = {
    ali: useDelayedMood(m(prev, 'ali'), m(cfg, 'ali'), 900),
    hina: useDelayedMood(m(prev, 'hina'), m(cfg, 'hina'), 900),
    omar: useDelayedMood(m(prev, 'omar'), m(cfg, 'omar'), 900),
  };

  const tailAt = (speaker: string) =>
    speaker === 'zara' ? 1 - 62 / w : (centers[['ali', 'hina', 'omar'].indexOf(speaker)] ?? w / 2) / w;

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

        <View style={{ width: w, height: ZARA_H }} className="mt-6">
          <View style={{ position: 'absolute', start: 0, bottom: 0 }}>
            <FriendsStage width={friendsW} charH={FRIEND_H} muted={false} moods={moods} />
          </View>

          <MotiView
            from={{ opacity: 0, translateX: reduce ? 0 : 280 * dir() }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ type: 'timing', duration: reduce ? 400 : WALK_MS, delay: zaraEnter }}
            style={{ position: 'absolute', end: 0, bottom: 0 }}
          >
            <MotiView
              animate={{ translateY: walking && !reduce ? -6 : 0 }}
              transition={{ type: 'timing', duration: 260, loop: walking && !reduce, repeatReverse: true }}
            >
              <Character name="zara" pose="stand" mood="calm" size={ZARA_H} />
            </MotiView>
          </MotiView>
        </View>
      </SceneScroll>
    </>
  );
}
