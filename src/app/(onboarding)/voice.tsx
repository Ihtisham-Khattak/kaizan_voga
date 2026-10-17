import { useFocusEffect } from 'expo-router';
import { MotiView } from 'moti';
import {
  CloudRain,
  Info,
  MicrophoneSlash,
  MusicNotes,
  Play,
  SpeakerHigh,
  SpeakerSlash,
  Stop,
  Tree,
  Waveform,
} from 'phosphor-react-native';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';

import { CharacterAvatar } from '@/components/character-avatar';
import { FadeUp } from '@/components/fade-up';
import { GlassCard } from '@/components/glass-card';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';
import { ChoiceTile } from '@/features/onboarding/choice-tile';
import { PersonalizationShell } from '@/features/onboarding/shell';
import { useReduceMotion } from '@/hooks/use-reduced-motion';
import { useT } from '@/i18n';
import {
  previewVoice,
  releaseAll,
  setAmbience,
  setMusic,
  stopAll,
  stopVoice,
  useSoundscape,
} from '@/lib/soundscape';
import { usePrefsStore } from '@/store/prefs-store';
import type { Ambience, VoicePreference } from '@/store/types';
import { useTheme } from '@/theme/theme-provider';

const AMBIENCES: { id: Ambience; key: 'rain' | 'forest' | 'piano' | 'silence'; icon: typeof Tree }[] = [
  { id: 'rain', key: 'rain', icon: CloudRain },
  { id: 'forest', key: 'forest', icon: Tree },
  { id: 'piano', key: 'piano', icon: MusicNotes },
  { id: 'none', key: 'silence', icon: SpeakerSlash },
];

/** Equaliser bars that dance while sound plays and rest while it does not. */
function Bars({ playing, count = 5, height = 22 }: { playing: boolean; count?: number; height?: number }) {
  const reduce = useReduceMotion();
  const { colors } = useTheme();
  const live = playing && !reduce;
  return (
    <View style={{ height, flexDirection: 'row', alignItems: 'flex-end', gap: 3 }}>
      {Array.from({ length: count }, (_, i) => (
        <MotiView
          key={i}
          animate={{ height: live ? [6, height, 10, height * 0.8, 6] : playing ? height * 0.6 : 6 }}
          transition={{ type: 'timing', duration: 800 + i * 130, loop: live }}
          style={{ width: 4, borderRadius: 2, backgroundColor: colors.leaf }}
        />
      ))}
    </View>
  );
}

/** The centrepiece: a breathing sound orb that glows while anything plays, with what is playing under it. */
function SoundOrb({ playing, label, onStop }: { playing: boolean; label: string; onStop: () => void }) {
  const { t } = useT();
  const { colors } = useTheme();
  const reduce = useReduceMotion();
  const breathe = playing && !reduce;
  const ring = (size: number, color: string, delay: number, opacity: number) => (
    <MotiView
      key={size}
      animate={{ scale: breathe ? 1.14 : 1, opacity: playing ? opacity : opacity * 0.55 }}
      transition={{ type: 'timing', duration: 2800, delay, loop: breathe, repeatReverse: true }}
      style={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
      }}
    />
  );
  return (
    <GlassCard radius="hero" strong contentStyle={{ padding: 20, alignItems: 'center', gap: 14 }}>
      <View style={{ width: 168, height: 168, alignItems: 'center', justifyContent: 'center' }}>
        {ring(168, colors.auroraMint, 0, 0.9)}
        {ring(124, colors.auroraSky, 350, 0.9)}
        {ring(84, colors.leaf, 700, 1)}
        {/* drawn last and absolutely positioned so the rings (also absolute) never paint over it */}
        <View style={{ position: 'absolute' }} pointerEvents="none">
          <Icon as={playing ? Waveform : SpeakerHigh} size={34} weight="bold" color={colors.onPrimary} />
        </View>
      </View>
      <View style={{ alignItems: 'center', gap: 6 }} accessibilityLiveRegion="polite">
        <Text variant="overline" style={{ color: colors.muted }}>
          {playing ? t('onboardingR.voice.nowPlaying') : t('onboardingR.voice.idle')}
        </Text>
        {playing ? (
          <Text variant="title3" style={{ color: colors.forest, textAlign: 'center' }}>
            {label}
          </Text>
        ) : null}
      </View>
      <Bars playing={playing} count={9} height={26} />
      {playing ? (
        <Button size="sm" variant="secondary" onPress={onStop}>
          <Icon as={Stop} size={16} weight="fill" color={colors.forest} />
          <Text>{t('onboardingR.voice.stop')}</Text>
        </Button>
      ) : null}
    </GlassCard>
  );
}

/**
 * Onboarding Q7 — voice, music and ambience, with real sound: tap a voice to hear it, flip Music on, pick an ambience
 * and it plays (they mix, and the voice sample softens the others while it speaks). Everything stops when you leave.
 * Audio is optional; every sound has a text caption.
 */
export default function VoiceScreen() {
  const { t, i18n } = useT();
  const { colors } = useTheme();
  const voice = usePrefsStore((s) => s.voice);
  const music = usePrefsStore((s) => s.music);
  const ambience = usePrefsStore((s) => s.ambience);
  const patch = usePrefsStore((s) => s.patch);
  const sound = useSoundscape();
  const [touched, setTouched] = useState(false);

  // sound stops when this screen loses focus (Continue / Back) and the players are freed when it is gone
  useFocusEffect(useCallback(() => () => stopAll(), []));
  useEffect(() => () => releaseAll(), []);

  const pickVoice = (id: VoicePreference) => {
    setTouched(true);
    patch({ voice: id });
    if (id === 'none') stopVoice();
    else void previewVoice(id, t('onboardingR.voice.sample'), i18n.language);
  };

  const pickAmbience = (id: Ambience) => {
    setTouched(true);
    patch({ ambience: id });
    // tapping the one that is already playing switches it off
    setAmbience(id !== 'none' && sound.ambience === id ? 'none' : id);
  };

  const toggleMusic = (on: boolean) => {
    setTouched(true);
    patch({ music: on });
    setMusic(on);
  };

  const playing = sound.ambience !== null || sound.music || sound.voice !== null;
  const names = [
    sound.voice ? t(`onboardingR.voice.${sound.voice}`) : null,
    sound.ambience ? t(`onboardingR.voice.${sound.ambience}.title`) : null,
    sound.music ? t('onboardingR.voice.musicLabel') : null,
  ].filter(Boolean) as string[];

  return (
    <PersonalizationShell
      step="voice"
      title={t('onboardingR.voice.title')}
      subtitle={t('onboardingR.voice.subtitle')}
      reaction={touched ? t('onboardingR.voice.reaction') : null}
    >
      <FadeUp delay={100}>
        <SoundOrb playing={playing} label={names.join('  ·  ')} onStop={stopAll} />
      </FadeUp>

      <View style={{ gap: 12 }}>
        <Text variant="title3" style={{ color: colors.forest }}>
          {t('onboardingR.voice.voiceTitle')}
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }} role="radiogroup">
          {(['female', 'male', 'none'] as VoicePreference[]).map((id, i) => (
            <ChoiceTile
              key={id}
              widthPct={31}
              index={i}
              label={t(`onboardingR.voice.${id}`)}
              sublabel={
                id === 'none'
                  ? t('onboardingR.voice.noneSub')
                  : sound.voice === id
                    ? t('onboardingR.voice.speaking')
                    : t(`onboardingR.voice.${id}Sub`)
              }
              selected={voice === id}
              onPress={() => pickVoice(id)}
              leading={
                id === 'none' ? (
                  <View className="size-14 items-center justify-center rounded-full bg-secondary">
                    <Icon as={MicrophoneSlash} size={28} weight="duotone" color={colors.primary} />
                  </View>
                ) : (
                  <CharacterAvatar name={id === 'female' ? 'hina' : 'hamid'} size={56} mood="happy" />
                )
              }
            />
          ))}
        </View>
      </View>

      <FadeUp delay={300} style={{ gap: 12 }}>
        <Text variant="title3" style={{ color: colors.forest }}>
          {t('onboardingR.voice.musicTitle')}
        </Text>
        <GlassCard contentStyle={{ padding: 14, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <View className="size-12 items-center justify-center rounded-full bg-secondary">
            {sound.music ? (
              <Bars playing count={3} height={18} />
            ) : (
              <Icon as={MusicNotes} size={24} weight="duotone" color={colors.primary} />
            )}
          </View>
          <View style={{ flex: 1, gap: 2 }}>
            <Text className="font-sans-semibold" variant="bodyLarge" style={{ color: colors.forest }}>
              {t('onboardingR.voice.musicLabel')}
            </Text>
            <Text variant="callout" style={{ color: colors.muted }}>
              {sound.music ? t('onboardingR.voice.playingTag') : t('onboardingR.voice.musicCaption')}
            </Text>
          </View>
          {/* hear it without changing the saved choice */}
          <Pressable
            onPress={() => {
              setTouched(true);
              setMusic(!sound.music);
            }}
            accessibilityRole="button"
            accessibilityLabel={
              sound.music ? t('onboardingR.voice.stopMusic') : t('onboardingR.voice.hearMusic')
            }
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: colors.mint,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon as={sound.music ? Stop : Play} size={18} weight="fill" color={colors.forest} />
          </Pressable>
          <Switch
            checked={music}
            onCheckedChange={toggleMusic}
            accessibilityLabel={t('onboardingR.voice.musicLabel')}
          />
        </GlassCard>
      </FadeUp>

      <View style={{ gap: 12 }}>
        <Text variant="title3" style={{ color: colors.forest }}>
          {t('onboardingR.voice.ambienceTitle')}
        </Text>
        <View
          style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 12 }}
          role="radiogroup"
        >
          {AMBIENCES.map((a, i) => {
            const on = sound.ambience === a.id;
            return (
              <ChoiceTile
                key={a.id}
                index={i + 3}
                label={t(`onboardingR.voice.${a.key}.title`)}
                sublabel={on ? t('onboardingR.voice.playingTag') : t(`onboardingR.voice.${a.key}.caption`)}
                selected={ambience === a.id}
                onPress={() => pickAmbience(a.id)}
                leading={
                  on ? (
                    <View className="size-14 items-center justify-center rounded-full bg-secondary">
                      <Bars playing count={4} height={22} />
                    </View>
                  ) : (
                    <View className="size-14 items-center justify-center rounded-full bg-secondary">
                      <Icon as={a.icon} size={28} weight="duotone" color={colors.primary} />
                    </View>
                  )
                }
              />
            );
          })}
        </View>
      </View>

      <View style={{ flexDirection: 'row', gap: 8, alignItems: 'flex-start' }}>
        <Icon as={Info} size={18} color={colors.muted} />
        <Text variant="footnote" style={{ flex: 1, color: colors.muted }}>
          {t('onboardingR.voice.note')}
        </Text>
      </View>
    </PersonalizationShell>
  );
}
