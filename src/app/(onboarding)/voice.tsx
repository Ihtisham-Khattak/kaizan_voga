import {
  CloudRain,
  Microphone,
  MicrophoneSlash,
  MusicNotes,
  Play,
  SpeakerSlash,
  Tree,
} from 'phosphor-react-native';
import { MotiView } from 'moti';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { FadeUp } from '@/components/fade-up';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';
import { ChoiceTile } from '@/features/onboarding/choice-tile';
import { PersonalizationShell } from '@/features/onboarding/shell';
import { useReduceMotion } from '@/hooks/use-reduced-motion';
import { useT } from '@/i18n';
import { useTheme } from '@/theme/theme-provider';
import { usePrefsStore } from '@/store/prefs-store';
import type { Ambience, VoicePreference } from '@/store/types';

const VOICES: { id: VoicePreference; icon: typeof Microphone }[] = [
  { id: 'female', icon: Microphone },
  { id: 'male', icon: Microphone },
  { id: 'none', icon: MicrophoneSlash },
];
const AMBIENCES: { id: Ambience; key: 'rain' | 'forest' | 'piano' | 'silence'; icon: typeof Tree }[] = [
  { id: 'rain', key: 'rain', icon: CloudRain },
  { id: 'forest', key: 'forest', icon: Tree },
  { id: 'piano', key: 'piano', icon: MusicNotes },
  { id: 'none', key: 'silence', icon: SpeakerSlash },
];

/** Little equaliser bars for the (UI-only) sound preview. */
function Bars({ playing }: { playing: boolean }) {
  const reduce = useReduceMotion();
  const { colors } = useTheme();
  return (
    <View className="h-5 flex-row items-end gap-[3px]">
      {[0, 1, 2, 3].map((i) => (
        <MotiView
          key={i}
          animate={{ height: playing && !reduce ? [6, 18, 9, 16, 6] : 6 }}
          transition={{ type: 'timing', duration: 900 + i * 140, loop: playing && !reduce }}
          style={{ width: 4, borderRadius: 2, backgroundColor: colors.leaf }}
        />
      ))}
    </View>
  );
}

/** Onboarding Q7 — voice, music and ambience. Audio is optional; every sound has a text caption. */
export default function VoiceScreen() {
  const { t } = useT();
  const voice = usePrefsStore((s) => s.voice);
  const music = usePrefsStore((s) => s.music);
  const ambience = usePrefsStore((s) => s.ambience);
  const patch = usePrefsStore((s) => s.patch);
  const [touched, setTouched] = useState(false);
  const [playing, setPlaying] = useState(false);

  // the preview is UI-only: it "plays" for a few seconds
  useEffect(() => {
    if (!playing) return;
    const id = setTimeout(() => setPlaying(false), 4000);
    return () => clearTimeout(id);
  }, [playing]);

  const current = AMBIENCES.find((a) => a.id === ambience)!;

  return (
    <PersonalizationShell
      step="voice"
      title={t('onboardingR.voice.title')}
      subtitle={t('onboardingR.voice.subtitle')}
      reaction={touched ? t('onboardingR.voice.reaction') : null}
    >
      <View className="gap-3">
        <Text variant="heading">{t('onboardingR.voice.voiceTitle')}</Text>
        <View className="flex-row justify-between" role="radiogroup">
          {VOICES.map((v, i) => (
            <ChoiceTile
              key={v.id}
              widthPct={31}
              index={i}
              label={t(`onboardingR.voice.${v.id}`)}
              selected={voice === v.id}
              onPress={() => {
                setTouched(true);
                patch({ voice: v.id });
              }}
              leading={
                <View className="size-14 items-center justify-center rounded-full bg-secondary">
                  <Icon as={v.icon} size={28} weight="duotone" className="text-primary" />
                </View>
              }
            />
          ))}
        </View>
      </View>

      <FadeUp delay={300} className="gap-3">
        <Text variant="heading">{t('onboardingR.voice.musicTitle')}</Text>
        <View className="min-h-16 flex-row items-center gap-3 rounded-card border border-border bg-card px-4 py-3">
          <Icon as={MusicNotes} size={24} weight="duotone" className="text-primary" />
          <Text variant="body" className="flex-1">
            {t('onboardingR.voice.musicLabel')}
          </Text>
          <Switch
            checked={music}
            onCheckedChange={(v) => {
              setTouched(true);
              patch({ music: v });
            }}
            accessibilityLabel={t('onboardingR.voice.musicLabel')}
          />
        </View>
      </FadeUp>

      <View className="gap-3">
        <Text variant="heading">{t('onboardingR.voice.ambienceTitle')}</Text>
        <View className="flex-row flex-wrap justify-between gap-y-3" role="radiogroup">
          {AMBIENCES.map((a, i) => (
            <ChoiceTile
              key={a.id}
              index={i + 3}
              label={t(`onboardingR.voice.${a.key}.title`)}
              sublabel={t(`onboardingR.voice.${a.key}.caption`)}
              selected={ambience === a.id}
              onPress={() => {
                setTouched(true);
                setPlaying(false);
                patch({ ambience: a.id });
              }}
              leading={
                <View className="size-14 items-center justify-center rounded-full bg-secondary">
                  <Icon as={a.icon} size={28} weight="duotone" className="text-primary" />
                </View>
              }
            />
          ))}
        </View>
        {/* UI-only preview of the selected sound, with a text alternative */}
        {ambience !== 'none' ? (
          <View className="flex-row items-center gap-3 rounded-card bg-secondary px-4 py-3">
            <Bars playing={playing} />
            <Text variant="caption" className="flex-1 text-secondary-foreground">
              {t(`onboardingR.voice.${current.key}.caption`)}
            </Text>
            <Button size="sm" variant="outline" onPress={() => setPlaying((p) => !p)}>
              <Icon as={Play} size={14} weight="fill" />
              <Text>{playing ? t('onboardingR.voice.previewing') : t('onboardingR.voice.preview')}</Text>
            </Button>
          </View>
        ) : null}
      </View>
    </PersonalizationShell>
  );
}
