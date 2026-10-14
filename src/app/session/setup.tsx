import { router, useLocalSearchParams, type Href } from 'expo-router';
import { Microphone, MicrophoneSlash } from 'phosphor-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CoverArt, variantFor } from '@/components/cover-art';
import { GlassCard } from '@/components/glass-card';
import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { Icon } from '@/components/ui/icon';
import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';
import { getExercise } from '@/data/repo';
import { useT } from '@/i18n';
import { FIRST_SESSION_ID } from '@/lib/plan';
import { minutesOf } from '@/lib/format';
import { resolveRoutine } from '@/lib/routines';
import type { SessionConfig } from '@/lib/session-plan';
import { usePrefsStore } from '@/store/prefs-store';
import { useTheme } from '@/theme/theme-provider';
import { useSessionStore } from '@/store/session-store';
import type { Ambience, VoicePreference } from '@/store/types';

const FOCUS = ['Back', 'Hips', 'Shoulders', 'Posture', 'Balance', 'Relaxation'] as const;
const AMBIENCES: Ambience[] = ['rain', 'forest', 'piano', 'none'];
const AMB_KEY: Record<Ambience, 'rain' | 'forest' | 'piano' | 'silence'> = {
  rain: 'rain',
  forest: 'forest',
  piano: 'piano',
  none: 'silence',
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View className="gap-2">
      <Text variant="label">{title}</Text>
      <View className="flex-row flex-wrap gap-2">{children}</View>
    </View>
  );
}

/** Session setup: a glass sheet over the previous screen. Pre-filled from your preferences. */
export default function SessionSetup() {
  const { t } = useT();
  const insets = useSafeAreaInsets();
  const { extras } = useTheme();
  const { routineId } = useLocalSearchParams<{ routineId?: string }>();
  const routine = resolveRoutine(routineId ? String(routineId) : FIRST_SESSION_ID);
  const prefs = usePrefsStore();
  const setConfig = useSessionStore((s) => s.setConfig);

  const designed = routine ? minutesOf(routine.totalSec) : 10;
  const options = [5, 10, 15, 20].filter((m) => m !== designed && m / designed >= 0.5 && m / designed <= 2);
  const [minutes, setMinutes] = useState(designed);
  const [voice, setVoice] = useState<VoicePreference>(prefs.voice);
  const [music, setMusic] = useState(prefs.music);
  const [ambience, setAmbience] = useState<Ambience>(prefs.ambience);
  const [pace, setPace] = useState<'slow' | 'normal'>('normal');
  const [focus, setFocus] = useState<string[]>([]);
  const [chair, setChair] = useState(prefs.chairMode);

  if (!routine) return null;
  const first = routine.steps.find((s) => s.phase === 'main') ?? routine.steps[0];

  const start = () => {
    const cfg: SessionConfig = {
      routineId: routine.id,
      scale: (minutes * 60) / routine.totalSec,
      pace,
      voice,
      music,
      ambience,
      focus,
      chairMode: chair,
    };
    setConfig(cfg);
    router.replace('/session/player' as Href);
  };

  return (
    <View className="flex-1 justify-end">
      <Pressable
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          start: 0,
          end: 0,
          backgroundColor: extras.scrim,
        }}
        onPress={() => router.back()}
        accessibilityRole="button"
        accessibilityLabel={t('common.close')}
      />
      <GlassCard
        strong
        radii={{ tl: 32, tr: 32 }}
        shadow={false}
        style={{ maxHeight: '90%' }}
        contentStyle={{ flexShrink: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 24, paddingBottom: 12, gap: 16 }}
        >
          <View className="flex-row items-center gap-3">
            <View className="size-16 overflow-hidden rounded-2xl">
              <CoverArt
                tint={routine.cover}
                figure={variantFor(getExercise(first.exerciseId))}
                height={64}
                width={64}
                rounded={12}
              />
            </View>
            <View className="flex-1">
              <Text variant="caption" className="font-sans-semibold uppercase tracking-wide">
                {t('session.setup.title')}
              </Text>
              <Text variant="heading" numberOfLines={2}>
                {routine.title}
              </Text>
              <Text variant="caption">{`${t('session.setup.summary', { minutes, pace: t(`session.setup.${pace}`) })}${chair ? t('session.setup.summaryChair') : ''}`}</Text>
            </View>
          </View>

          <Section title={t('session.setup.duration')}>
            <Chip
              label={`${t('common.minutes', { count: designed })} · ${t('session.setup.original')}`}
              selected={minutes === designed}
              onPress={() => setMinutes(designed)}
            />
            {options.map((m) => (
              <Chip
                key={m}
                label={t('common.minutes', { count: m })}
                selected={minutes === m}
                onPress={() => setMinutes(m)}
              />
            ))}
          </Section>

          <Section title={t('session.setup.voice')}>
            {(['female', 'male', 'none'] as VoicePreference[]).map((v) => (
              <Chip
                key={v}
                label={t(`onboardingR.voice.${v}`)}
                selected={voice === v}
                onPress={() => setVoice(v)}
                icon={<Icon as={v === 'none' ? MicrophoneSlash : Microphone} size={16} />}
              />
            ))}
          </Section>

          <View className="gap-2">
            <Text variant="label">{t('session.setup.music')}</Text>
            <View className="flex-row items-center justify-between gap-3">
              <Text variant="body">{t('session.setup.musicLabel')}</Text>
              <Switch
                checked={music}
                onCheckedChange={setMusic}
                accessibilityLabel={t('session.setup.musicLabel')}
              />
            </View>
            {music ? (
              <View className="flex-row flex-wrap gap-2">
                {AMBIENCES.map((a) => (
                  <Chip
                    key={a}
                    label={t(`onboardingR.voice.${AMB_KEY[a]}.title`)}
                    selected={ambience === a}
                    onPress={() => setAmbience(a)}
                  />
                ))}
              </View>
            ) : null}
          </View>

          <Section title={t('session.setup.pace')}>
            {(['slow', 'normal'] as const).map((p) => (
              <Chip
                key={p}
                label={t(`session.setup.${p}`)}
                selected={pace === p}
                onPress={() => setPace(p)}
              />
            ))}
          </Section>

          <Section title={t('session.setup.focus')}>
            {FOCUS.map((f) => (
              <Chip
                key={f}
                label={t(`session.setup.focus${f}`)}
                selected={focus.includes(f)}
                onPress={() =>
                  setFocus((cur) => (cur.includes(f) ? cur.filter((x) => x !== f) : [...cur, f]))
                }
              />
            ))}
          </Section>

          <View className="flex-row items-center justify-between gap-3">
            <View className="flex-1">
              <Text variant="label">{t('session.setup.chair')}</Text>
              <Text variant="caption">{t('session.setup.chairHint')}</Text>
            </View>
            <Switch
              checked={chair}
              onCheckedChange={setChair}
              accessibilityLabel={t('session.setup.chair')}
            />
          </View>
        </ScrollView>

        <View
          style={{
            paddingHorizontal: 24,
            paddingTop: 12,
            paddingBottom: Math.max(insets.bottom, 14),
            gap: 8,
          }}
        >
          <Button size="lg" onPress={start}>
            <Text>{t('session.setup.start')}</Text>
          </Button>
          <Text variant="caption" className="text-center">
            {t('session.setup.safety')}
          </Text>
        </View>
      </GlassCard>
    </View>
  );
}
