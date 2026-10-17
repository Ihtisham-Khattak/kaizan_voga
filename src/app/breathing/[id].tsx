import { useKeepAwake } from 'expo-keep-awake';
import { router, useLocalSearchParams, type Href } from 'expo-router';
import { Minus, Pause, Play, Plus, X } from 'phosphor-react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Character } from '@/characters/character';
import { AuroraBackground } from '@/components/aurora-background';
import { BottomSheet } from '@/components/bottom-sheet';
import { BreathingCircle } from '@/components/breathing-circle';
import { GlassCard } from '@/components/glass-card';
import { ProgressRing } from '@/components/progress-ring';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { getBreathing } from '@/data/repo';
import { useT } from '@/i18n';
import { haptic } from '@/lib/haptics';
import { useSessionStore } from '@/store/session-store';
import { useTheme } from '@/theme/theme-provider';
import { releaseAll, setAmbience } from '@/lib/soundscape';

const clock = (sec: number) => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;

/** Breathing player: intro (why it may help + duration) → guided circle with ring timer → shared completion screen. */
export default function BreathingPlayer() {
  useKeepAwake();
  const { t } = useT();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const { colors } = useTheme();
  const params = useLocalSearchParams<{ id: string; minutes?: string; ambience?: string }>();
  const session = getBreathing(String(params.id));
  const setSummary = useSessionStore((s) => s.setSummary);

  const [minutes, setMinutes] = useState(() =>
    Math.min(30, Math.max(1, Number(params.minutes) || session?.defaultMinutes || 3))
  );
  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [remaining, setRemaining] = useState(minutes * 60);
  const [cycles, setCycles] = useState(0);
  const endAt = useRef(0);
  const frozen = useRef<number | null>(null);
  const done = useRef(false);

  const total = minutes * 60;
  const running = started && !paused && !exiting;

  // the ambience chosen on the breathing hub plays while the practice runs and fades out on pause or exit
  const ambience = (
    ['rain', 'forest', 'piano'].includes(String(params.ambience)) ? params.ambience : 'none'
  ) as 'rain' | 'forest' | 'piano' | 'none';
  useEffect(() => {
    setAmbience(running ? ambience : 'none');
  }, [running, ambience]);
  useEffect(() => () => releaseAll(), []);

  const finish = useCallback(
    (completed: boolean, practicedSec: number) => {
      if (done.current || !session) return;
      done.current = true;
      if (practicedSec < 10) return router.back();
      setSummary({
        id: `b${Date.now().toString(36)}`,
        contentId: session.id,
        kind: 'breathing',
        title: session.title,
        plannedSec: total,
        practicedSec,
        posesDone: 0,
        completed,
      });
      router.replace('/session/complete' as Href);
    },
    [session, total, setSummary]
  );

  useEffect(() => {
    if (!started) return;
    if (endAt.current === 0) endAt.current = Date.now() + total * 1000;
    if (!running) {
      frozen.current ??= Math.max(0, endAt.current - Date.now());
      return;
    }
    if (frozen.current != null) {
      endAt.current = Date.now() + frozen.current;
      frozen.current = null;
    }
    const id = setInterval(() => {
      const left = Math.max(0, Math.ceil((endAt.current - Date.now()) / 1000));
      setRemaining(left);
      if (left <= 0) {
        haptic.success();
        finish(true, total);
      }
    }, 250);
    return () => clearInterval(id);
  }, [started, running, total, finish]);

  if (!session) {
    return (
      <View className="flex-1 items-center justify-center gap-4 bg-background p-6">
        <Character name="kai" mood="calm" size={140} />
        <Text variant="heading" className="text-center">
          {t('breathingUi.notFound')}
        </Text>
        <Button onPress={() => router.back()}>
          <Text>{t('common.back')}</Text>
        </Button>
      </View>
    );
  }

  const isScan = session.kind === 'body-scan';
  const regions = session.regions ?? [];
  const elapsed = total - remaining;
  const region = regions.length
    ? regions[Math.min(regions.length - 1, Math.floor((elapsed / total) * regions.length))]
    : null;
  const size = Math.min(300, Math.round(height * 0.36));

  if (!started) {
    return (
      <View className="flex-1 bg-background">
        <AuroraBackground />
        <ScrollView
          contentContainerStyle={{
            paddingTop: insets.top + 8,
            paddingBottom: insets.bottom + 24,
            paddingHorizontal: 24,
            gap: 16,
            alignItems: 'center',
          }}
        >
          <View className="w-full flex-row">
            <Pressable
              onPress={() => router.back()}
              accessibilityRole="button"
              accessibilityLabel={t('common.back')}
              className="size-12 items-center justify-center rounded-full"
            >
              <Icon as={X} size={24} className="text-foreground" />
            </Pressable>
          </View>
          <BreathingCircle size={size} running tint="sky" />
          <View className="items-center gap-1">
            <Text variant="title1" className="text-center" accessibilityRole="header">
              {isScan ? t('breathingUi.bodyScan') : session.title}
            </Text>
            <Text variant="body" className="text-center text-muted-foreground">
              {session.description}
            </Text>
          </View>
          <View className="w-full gap-1 rounded-3xl bg-card p-4">
            <Text variant="label">{t('breathingUi.why')}</Text>
            <Text variant="body">{session.why}</Text>
          </View>
          <View className="w-full items-center gap-2">
            <Text variant="label">{t('breathingUi.custom')}</Text>
            <View className="flex-row items-center gap-6">
              <Pressable
                onPress={() => {
                  haptic.select();
                  setMinutes((m) => Math.max(1, m - 1));
                  setRemaining(Math.max(1, minutes - 1) * 60);
                }}
                accessibilityRole="button"
                accessibilityLabel={`${t('breathingUi.custom')} −`}
                className="size-12 items-center justify-center rounded-full bg-secondary"
              >
                <Icon as={Minus} size={20} weight="bold" className="text-secondary-foreground" />
              </Pressable>
              <Text variant="title" className="min-w-24 text-center">
                {t('breathingUi.minutes', { count: minutes })}
              </Text>
              <Pressable
                onPress={() => {
                  haptic.select();
                  setMinutes((m) => Math.min(30, m + 1));
                  setRemaining(Math.min(30, minutes + 1) * 60);
                }}
                accessibilityRole="button"
                accessibilityLabel={`${t('breathingUi.custom')} +`}
                className="size-12 items-center justify-center rounded-full bg-secondary"
              >
                <Icon as={Plus} size={20} weight="bold" className="text-secondary-foreground" />
              </Pressable>
            </View>
          </View>
          <Button
            size="lg"
            className="w-full"
            onPress={() => {
              setRemaining(minutes * 60);
              setStarted(true);
            }}
          >
            <Text>{t('breathingUi.begin')}</Text>
          </Button>
          <Text variant="caption" className="text-center">
            {t('breathingUi.safety')}
          </Text>
        </ScrollView>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <AuroraBackground />
      <View
        style={{ paddingTop: insets.top + 8, paddingHorizontal: 16 }}
        className="flex-row items-center justify-between"
      >
        <GlassCard radius="pill" shadow={false}>
          <Pressable
            onPress={() => setExiting(true)}
            accessibilityRole="button"
            accessibilityLabel={t('session.player.exit')}
            className="size-12 items-center justify-center"
          >
            <Icon as={X} size={22} weight="bold" className="text-foreground" />
          </Pressable>
        </GlassCard>
        <GlassCard radius={20} shadow={false} contentStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}>
          <Text variant="caption" className="font-sans-semibold">
            {t('breathingUi.cycles', { count: cycles })}
          </Text>
        </GlassCard>
        <View className="size-12" />
      </View>

      <View className="flex-1 items-center justify-evenly px-4">
        <Text variant="title" className="text-center" accessibilityRole="header">
          {session.title}
        </Text>
        <ProgressRing
          progress={elapsed / total}
          size={size + 36}
          strokeWidth={8}
          duration={1000}
          linear
          accessibilityLabel={t('session.player.timeLeft', { sec: remaining })}
        >
          <BreathingCircle
            size={size}
            phases={session.pattern}
            running={running}
            showCue
            onPhaseChange={(p, i) => p.kind === 'exhale' && i > 0 && setCycles((c) => c + 1)}
          />
        </ProgressRing>
        <View className="items-center gap-1">
          <Text variant="timer">{clock(remaining)}</Text>
          {isScan ? (
            <>
              <Text variant="heading" className="text-center text-primary">
                {region}
              </Text>
              <Text variant="caption" className="text-center">
                {t('breathingUi.scanHint')}
              </Text>
            </>
          ) : null}
        </View>
      </View>

      <View style={{ paddingBottom: Math.max(insets.bottom, 12) + 8, alignItems: 'center' }}>
        <Pressable
          onPress={() => {
            haptic.light();
            setPaused((p) => !p);
          }}
          accessibilityRole="button"
          accessibilityLabel={paused ? t('breathingUi.resume') : t('breathingUi.pause')}
          className="size-[72px] items-center justify-center rounded-full bg-primary"
        >
          <Icon as={paused ? Play : Pause} size={30} weight="fill" color={colors.onPrimary} />
        </Pressable>
      </View>

      <BottomSheet
        visible={exiting}
        onClose={() => setExiting(false)}
        title={t('session.player.exitTitle')}
        hideClose
      >
        <Button size="lg" onPress={() => setExiting(false)}>
          <Text>{t('session.player.keepGoing')}</Text>
        </Button>
        <Button
          variant="secondary"
          onPress={() => {
            setExiting(false);
            finish(false, total - remaining);
          }}
        >
          <Text>{t('breathingUi.end')}</Text>
        </Button>
      </BottomSheet>
    </View>
  );
}
