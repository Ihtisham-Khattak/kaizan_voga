import { useKeepAwake } from 'expo-keep-awake';
import { router, type Href } from 'expo-router';
import {
  Television,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  SlidersHorizontal,
  SpeakerHigh,
  SpeakerSlash,
  WarningCircle,
  X,
} from 'phosphor-react-native';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Character } from '@/characters/character';
import { AuroraBackground } from '@/components/aurora-background';
import { BottomSheet } from '@/components/bottom-sheet';
import { BreathingCircle } from '@/components/breathing-circle';
import { CoverArt, variantFor } from '@/components/cover-art';
import { GlassCard } from '@/components/glass-card';
import { ProgressRing } from '@/components/progress-ring';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { toast } from '@/components/toast';
import { getExercise } from '@/data/repo';
import { useT } from '@/i18n';
import { formatDuration } from '@/lib/format';
import { haptic } from '@/lib/haptics';
import { resolveRoutine } from '@/lib/routines';
import { buildPlan, planTotalSec } from '@/lib/session-plan';
import type { BreathPhase } from '@/lib/breath';
import { useLibraryStore } from '@/store/library-store';
import { useSessionStore } from '@/store/session-store';
import { useTheme } from '@/theme/theme-provider';

const clock = (sec: number) => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;

function RoundButton({
  icon,
  label,
  onPress,
  size = 48,
  primary,
}: {
  icon: React.ComponentProps<typeof Icon>['as'];
  label: string;
  onPress: () => void;
  size?: number;
  primary?: boolean;
}) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={() => {
        haptic.light();
        onPress();
      }}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={6}
      style={{ width: size, height: size, borderRadius: size / 2 }}
      className={primary ? 'items-center justify-center bg-primary' : 'items-center justify-center'}
    >
      <Icon
        as={icon}
        size={primary ? 28 : 24}
        weight={primary ? 'fill' : 'regular'}
        color={primary ? colors.onPrimary : colors.ink}
      />
    </Pressable>
  );
}

/** Immersive active session: breathing circle behind the pose, ring countdown, glass controls. Exit is always one tap away. */
export default function SessionPlayer() {
  useKeepAwake();
  const { t } = useT();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const { extras } = useTheme();
  const config = useSessionStore((s) => s.config);
  const setSummary = useSessionStore((s) => s.setSummary);
  const setLastSession = useLibraryStore((s) => s.setLastSession);

  const routine = config ? resolveRoutine(config.routineId) : null;
  const plan = useMemo(() => (routine && config ? buildPlan(routine, config) : []), [routine, config]);
  const planned = useMemo(() => planTotalSec(plan), [plan]);

  const first = Math.min(Math.max(0, config?.startIndex ?? 0), Math.max(0, plan.length - 1));
  const [index, setIndex] = useState(first);
  const [remaining, setRemaining] = useState(plan[first]?.durationSec ?? 0);
  const [practicedSec, setPracticedSec] = useState(0);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(false);
  const [cue, setCue] = useState<BreathPhase['kind']>('inhale');
  const [sheet, setSheet] = useState<null | 'discomfort' | 'modify' | 'exit' | 'cast'>(null);
  const [swaps, setSwaps] = useState<Record<number, string>>({});

  // Wall-clock based timer so backgrounding or a slow frame never drifts the countdown.
  const endAt = useRef(0);
  const frozen = useRef<number | null>(null);
  const practicedMs = useRef(0);
  const lastTick = useRef(0);
  const done = useRef(false);
  const posesDone = useRef(0);

  const step = plan[index];
  const exercise = step ? getExercise(step.exerciseId) : undefined;
  const next = plan[index + 1];
  const nextExercise = next ? getExercise(next.exerciseId) : undefined;
  const running = !paused && sheet === null;

  const finish = useCallback(
    (completed: boolean) => {
      if (done.current || !routine) return;
      done.current = true;
      const practicedSec = Math.round(practicedMs.current / 1000);
      if (completed) setLastSession(null);
      else
        setLastSession({
          contentId: routine.id,
          kind: routine.kind === 'quick-relief' ? 'quick-relief' : 'routine',
          stepIndex: index,
          elapsedSec: practicedSec,
          at: new Date().toISOString(),
        });
      if (!completed && practicedSec < 10) {
        router.back();
        return;
      }
      setSummary({
        id: `s${Date.now().toString(36)}`,
        contentId: routine.id,
        kind: routine.kind === 'quick-relief' ? 'quick-relief' : 'routine',
        title: routine.title,
        plannedSec: planned,
        practicedSec,
        posesDone: posesDone.current,
        completed,
      });
      router.replace('/session/complete' as Href);
    },
    [routine, index, planned, setLastSession, setSummary]
  );

  const goTo = useCallback(
    (i: number, counted: boolean) => {
      if (counted) posesDone.current += 1;
      if (i >= plan.length) return finish(true);
      const clamped = Math.max(0, i);
      setIndex(clamped);
      setRemaining(plan[clamped].durationSec);
      endAt.current = Date.now() + plan[clamped].durationSec * 1000;
      frozen.current = null;
      lastTick.current = Date.now();
    },
    [plan, finish]
  );

  // The clock: ticks while running, freezes (and keeps the remaining time) while paused or a sheet is open.
  useEffect(() => {
    if (!step) return;
    if (endAt.current === 0) endAt.current = Date.now() + step.durationSec * 1000;
    if (!running) {
      frozen.current ??= Math.max(0, endAt.current - Date.now());
      return;
    }
    if (frozen.current != null) {
      endAt.current = Date.now() + frozen.current;
      frozen.current = null;
    }
    lastTick.current = Date.now();
    const id = setInterval(() => {
      const now = Date.now();
      practicedMs.current += now - lastTick.current;
      lastTick.current = now;
      const left = Math.max(0, Math.ceil((endAt.current - now) / 1000));
      setRemaining(left);
      setPracticedSec(Math.round(practicedMs.current / 1000));
      if (left <= 0) goTo(index + 1, true);
    }, 250);
    return () => clearInterval(id);
  }, [running, step, index, goTo]);

  if (!config || !routine || !step || !exercise) {
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

  const ring = Math.min(264, Math.round(height * 0.31));
  const progress = 1 - remaining / step.durationSec;
  const stepText = exercise.steps.length
    ? exercise.steps[Math.min(exercise.steps.length - 1, Math.floor(progress * exercise.steps.length))]
    : '';
  const swapped = swaps[index];
  const isLast = index === plan.length - 1;

  const togglePause = () => setPaused((p) => !p);

  return (
    <View className="flex-1 bg-background">
      <AuroraBackground variant={routine.kind === 'sleep' ? 'evening' : 'day'} />

      <View
        style={{ paddingTop: insets.top + 8, paddingHorizontal: 16 }}
        className="flex-row items-center justify-between"
      >
        <GlassCard radius="pill" shadow={false}>
          <Pressable
            onPress={() => setSheet('exit')}
            accessibilityRole="button"
            accessibilityLabel={t('session.player.exit')}
            className="size-12 items-center justify-center"
          >
            <Icon as={X} size={22} weight="bold" className="text-foreground" />
          </Pressable>
        </GlassCard>
        <GlassCard radius={20} shadow={false} contentStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}>
          <Text variant="caption" className="font-sans-semibold">
            {t('session.player.poseOf', { n: index + 1, total: plan.length })}
          </Text>
        </GlassCard>
        <GlassCard radius="pill" shadow={false}>
          <Pressable
            onPress={() => setSheet('cast')}
            accessibilityRole="button"
            accessibilityLabel={t('session.player.cast')}
            className="size-12 items-center justify-center"
          >
            <Icon as={Television} size={22} className="text-foreground" />
          </Pressable>
        </GlassCard>
      </View>

      <View className="flex-1 items-center justify-evenly px-4">
        <View className="items-center gap-1">
          <Text variant="title" className="text-center" accessibilityRole="header" numberOfLines={2}>
            {exercise.name}
          </Text>
          <View className="flex-row flex-wrap items-center justify-center gap-2">
            {exercise.altName ? <Text variant="caption">{exercise.altName}</Text> : null}
            {step.side ? (
              <View className="rounded-pill bg-secondary px-3 py-1">
                <Text variant="caption" className="font-sans-semibold">
                  {t(`session.player.${step.side}`)}
                </Text>
              </View>
            ) : null}
            {config.chairMode ? (
              <View className="rounded-pill bg-secondary px-3 py-1">
                <Text variant="caption">{t('session.player.chairNote')}</Text>
              </View>
            ) : null}
          </View>
          {swapped ? (
            <Text variant="caption" className="text-center text-primary">
              {t('session.player.modifiedWith', { name: swapped })}
            </Text>
          ) : null}
        </View>

        <View style={{ width: ring + 56, height: ring + 56 }} className="items-center justify-center">
          <View style={{ position: 'absolute' }}>
            <BreathingCircle size={ring + 56} running={running} soft onPhaseChange={(p) => setCue(p.kind)} />
          </View>
          <ProgressRing
            progress={progress}
            size={ring}
            strokeWidth={10}
            duration={1000}
            linear
            accessibilityLabel={t('session.player.timeLeft', { sec: remaining })}
          >
            <View className="size-[72%] overflow-hidden rounded-full">
              <CoverArt
                tint={routine.cover}
                figure={variantFor(exercise)}
                height={ring * 0.72}
                width={ring * 0.72}
                rounded={ring}
              />
            </View>
          </ProgressRing>
        </View>

        <View className="items-center gap-1">
          <Text variant="timer" accessibilityLiveRegion="none">
            {clock(remaining)}
          </Text>
          <Text variant="label" className="text-primary">
            {t(`breath.${cue}`)}
          </Text>
          <Text variant="body" className="min-h-[48px] text-center" numberOfLines={3}>
            {stepText}
          </Text>
        </View>

        {nextExercise ? (
          <GlassCard radius={18} shadow={false} contentStyle={{ paddingHorizontal: 16, paddingVertical: 12 }}>
            <Text variant="caption" numberOfLines={1}>
              <Text variant="caption" className="font-sans-semibold">{`${t('session.player.next')}: `}</Text>
              {nextExercise.name}
              {next?.side ? ` · ${t(`session.player.${next.side}`)}` : ''}
            </Text>
          </GlassCard>
        ) : (
          <Text variant="caption" className="font-sans-semibold">
            {t('session.player.lastPose')}
          </Text>
        )}
      </View>

      <View
        style={{
          paddingBottom: Math.max(insets.bottom, 12) + 4,
          paddingHorizontal: 16,
          gap: 12,
          alignItems: 'center',
        }}
      >
        <GlassCard
          radius={32}
          contentStyle={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            paddingHorizontal: 12,
            paddingVertical: 8,
          }}
        >
          <RoundButton
            icon={SkipBack}
            label={t('session.player.previous')}
            onPress={() => goTo(index - 1, false)}
          />
          <RoundButton
            icon={SlidersHorizontal}
            label={t('session.player.modify')}
            onPress={() => setSheet('modify')}
          />
          <RoundButton
            icon={paused ? Play : Pause}
            label={paused ? t('session.player.resume') : t('session.player.pause')}
            onPress={togglePause}
            size={64}
            primary
          />
          <RoundButton
            icon={muted ? SpeakerSlash : SpeakerHigh}
            label={muted ? t('session.player.unmuted') : t('session.player.muted')}
            onPress={() => setMuted((m) => !m)}
          />
          <RoundButton
            icon={SkipForward}
            label={t('session.player.skip')}
            onPress={() => (isLast ? finish(true) : goTo(index + 1, false))}
          />
        </GlassCard>
        <Pressable
          onPress={() => setSheet('discomfort')}
          accessibilityRole="button"
          accessibilityLabel={t('session.player.discomfort')}
          hitSlop={8}
          className="min-h-11 flex-row items-center gap-2 rounded-pill px-4"
        >
          <Icon as={WarningCircle} size={18} className="text-muted-foreground" />
          <Text variant="caption" className="underline">
            {t('session.player.discomfort')}
          </Text>
        </Pressable>
      </View>

      {paused && sheet === null ? (
        <View
          style={{
            position: 'absolute',
            inset: 0,
            justifyContent: 'center',
            padding: 24,
            backgroundColor: extras.scrim,
          }}
        >
          <GlassCard strong radius={32} contentStyle={{ padding: 24, gap: 12, alignItems: 'center' }}>
            <Character name="kai" pose="float" mood="calm" size={96} />
            <Text variant="title" accessibilityRole="header">
              {t('session.player.paused')}
            </Text>
            <Text variant="caption">{formatDuration(Math.max(0, planned - practicedSec), t)}</Text>
            <Button size="lg" className="w-full" onPress={() => setPaused(false)}>
              <Text>{t('session.player.resume')}</Text>
            </Button>
            <Button
              variant="secondary"
              className="w-full"
              onPress={() => {
                setPaused(false);
                goTo(index, false);
              }}
            >
              <Text>{t('session.player.restart')}</Text>
            </Button>
            <Button
              variant="ghost"
              className="w-full"
              onPress={() => router.push('/settings/preferences' as Href)}
            >
              <Text>{t('session.player.settings')}</Text>
            </Button>
            <Button variant="ghost" className="w-full" onPress={() => setSheet('exit')}>
              <Text>{t('session.player.endSession')}</Text>
            </Button>
          </GlassCard>
        </View>
      ) : null}

      <BottomSheet
        visible={sheet === 'discomfort'}
        onClose={() => setSheet((s) => (s === 'discomfort' ? null : s))}
        title={t('session.player.discomfort')}
      >
        <Text variant="body">{t('session.player.discomfortBody')}</Text>
        <Button variant="secondary" onPress={() => setSheet('modify')}>
          <Text>{t('session.player.easier')}</Text>
        </Button>
        <Button
          variant="secondary"
          onPress={() => {
            setSheet(null);
            goTo(index + 1, false);
          }}
        >
          <Text>{t('session.player.skipPose')}</Text>
        </Button>
        <Button
          variant="secondary"
          onPress={() => {
            setSheet(null);
            setPaused(true);
          }}
        >
          <Text>{t('session.player.rest')}</Text>
        </Button>
        <Button variant="ghost" onPress={() => setSheet('exit')}>
          <Text>{t('session.player.endSession')}</Text>
        </Button>
      </BottomSheet>

      <BottomSheet
        visible={sheet === 'modify'}
        onClose={() => setSheet((s) => (s === 'modify' ? null : s))}
        title={t('session.player.modifyTitle')}
      >
        {exercise.modifications.length === 0 ? (
          <Text variant="body">{t('session.player.noMods')}</Text>
        ) : (
          exercise.modifications.map((m) => (
            <Pressable
              key={m.title}
              onPress={() => {
                setSwaps((cur) => ({ ...cur, [index]: m.title }));
                setSheet(null);
                toast.success(t('session.player.applied', { name: m.title }));
              }}
              accessibilityRole="button"
              accessibilityLabel={m.title}
              className="gap-1 rounded-2xl bg-secondary/70 p-4 active:bg-secondary"
            >
              <Text variant="label">{m.title}</Text>
              <Text variant="caption">{m.text}</Text>
            </Pressable>
          ))
        )}
      </BottomSheet>

      <BottomSheet
        visible={sheet === 'cast'}
        onClose={() => setSheet((s) => (s === 'cast' ? null : s))}
        title={t('session.player.cast')}
      >
        <Text variant="body">{t('session.player.castSoon')}</Text>
      </BottomSheet>

      <BottomSheet
        visible={sheet === 'exit'}
        onClose={() => setSheet((s) => (s === 'exit' ? null : s))}
        title={t('session.player.exitTitle')}
        hideClose
      >
        <Button size="lg" onPress={() => setSheet(null)}>
          <Text>{t('session.player.keepGoing')}</Text>
        </Button>
        <Button
          variant="secondary"
          onPress={() => {
            setSheet(null);
            finish(false);
          }}
        >
          <Text>{t('session.player.endSession')}</Text>
        </Button>
      </BottomSheet>
    </View>
  );
}
