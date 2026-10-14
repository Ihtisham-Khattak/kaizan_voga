import { ArrowsLeftRight } from 'phosphor-react-native';
import { MotiView } from 'moti';
import { useWindowDimensions, View } from 'react-native';

import { Character } from '@/characters/character';
import { FadeUp } from '@/components/fade-up';
import { SpeechBubble } from '@/components/speech-bubble';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { scenes } from '@/data/story';
import { useReduceMotion } from '@/hooks/use-reduced-motion';
import { useT } from '@/i18n';
import { useTheme } from '@/theme/theme-provider';

import { Entrance, SceneCTA, SceneScroll, SceneTitle, stageWidth, useDelayedMood } from '../stage';
import type { SceneProps } from '../types';
import { art } from '@/theme/illustration';

const cfg = scenes[5];

function Panel({
  label,
  text,
  mood,
  bg,
  tint,
  from,
  delay,
  compact,
}: {
  label: string;
  text: string;
  mood: 'stressed' | 'calm';
  bg: string;
  tint: string;
  from: 'start' | 'end';
  delay: number;
  compact: boolean;
}) {
  return (
    <Entrance from={from} delay={delay} distance={40} style={{ flex: 1 }}>
      <View
        accessible
        accessibilityLabel={`${label}. ${text}`}
        style={{ backgroundColor: bg, flex: 1, padding: 14, gap: 8, alignItems: 'center' }}
      >
        <View style={{ backgroundColor: tint }} className="rounded-full px-3 py-1">
          <Text variant="caption" className="font-sans-semibold text-foreground">
            {label}
          </Text>
        </View>
        <Character name="zara" pose="stand" mood={mood} size={compact ? 170 : 200} />
        <Text variant="caption" className="text-center text-foreground">
          {text}
        </Text>
      </View>
    </Entrance>
  );
}

/** Scene 5 — Zara's story. A split card: Before (muted, stressed) and Now (warm, calm) with the SAME Zara. */
export function Scene5({ controls, width }: SceneProps) {
  const { t } = useT();
  const { scheme } = useTheme();
  const reduce = useReduceMotion();
  const { fontScale } = useWindowDimensions();
  const w = stageWidth(width);
  const sideBySide = w >= 330 && fontScale <= 1.15;
  const dark = scheme === 'dark';
  // the right-hand Zara starts out as stressed as the left one, then relaxes into calm
  const nowMood = useDelayedMood('stressed', 'calm', 1300);
  const bubble = cfg.bubbles[0];

  return (
    <SceneScroll top={64} cta={<SceneCTA label={t('story.s5.cta')} onPress={controls.next} delay={2500} />}>
      <SceneTitle>{t('story.s5.title')}</SceneTitle>

      <View
        style={{
          width: w,
          flexDirection: sideBySide ? 'row' : 'column',
          borderRadius: 24,
          overflow: 'hidden',
        }}
        className="mt-4"
      >
        <Panel
          label={t('story.s5.before')}
          text={t('story.s5.beforeText')}
          mood="stressed"
          bg={dark ? art.c222A26 : art.cDDE0DB}
          tint={dark ? art.c8A948E : art.cC5CBC6}
          from="start"
          delay={100}
          compact={!sideBySide}
        />
        <Panel
          label={t('story.s5.now')}
          text={t('story.s5.nowText')}
          mood={nowMood === 'calm' ? 'calm' : 'stressed'}
          bg={dark ? art.c33291B : art.cFAEBD0}
          tint={art.sand}
          from="end"
          delay={700}
          compact={!sideBySide}
        />

        {/* the divider handle between the two Zaras */}
        {sideBySide ? (
          <MotiView
            from={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: reduce ? 1 : [1, 1.12, 1] }}
            transition={{ type: 'timing', duration: 2200, delay: 900, loop: !reduce }}
            style={{ position: 'absolute', start: w / 2 - 20, top: 96 }}
          >
            <View className="size-10 items-center justify-center rounded-full border border-border bg-card shadow-lg shadow-forest/20">
              <Icon as={ArrowsLeftRight} size={18} weight="bold" />
            </View>
          </MotiView>
        ) : null}
      </View>

      <View style={{ width: w }} className="pt-5">
        <SpeechBubble
          speaker={bubble.speaker}
          text={t(bubble.textKey)}
          delay={bubble.delayMs + 400}
          tail="none"
        />
      </View>

      <FadeUp delay={2400} className="pt-3">
        <Text variant="caption" className="text-center italic">
          {t('story.s5.illustrated')}
        </Text>
      </FadeUp>
    </SceneScroll>
  );
}
