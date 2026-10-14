import { router, type Href } from 'expo-router';
import { Moon, Plus, X } from 'phosphor-react-native';
import { MotiView } from 'moti';
import { useMemo } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { CoverArt, variantFor } from '@/components/cover-art';
import { GlassCard } from '@/components/glass-card';
import { MoodPicker } from '@/components/mood-picker';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { getExercise, type Routine } from '@/data/repo';
import { useT } from '@/i18n';
import { KaizenIcon, type KaizenIconName } from '@/icons';
import { haptic } from '@/lib/haptics';
import { isSameDay } from '@/lib/journey';
import { minutesOf } from '@/lib/format';
import { cn } from '@/lib/utils';
import { weekdayLabel, weekdayOrder } from '@/lib/weekdays';
import { useProgressStore } from '@/store/progress-store';
import { usePrefsStore } from '@/store/prefs-store';
import type { Mood, SessionRecord, Weekday } from '@/store/types';
import { alpha } from '@/theme/colors';
import { coverColor } from '@/theme/cover';
import { useTheme } from '@/theme/theme-provider';

// ───────────────────────── Mood check-in ─────────────────────────
/** Optional one-tap check-in. After tapping it collapses to a thank-you with Undo (never nags). */
export function MoodCheckin() {
  const { t } = useT();
  const logs = useProgressStore((s) => s.moodLogs);
  const logMood = useProgressStore((s) => s.logMood);
  const removeMood = useProgressStore((s) => s.removeMood);
  const today = useMemo(
    () => logs.find((l) => l.context === 'checkin' && isSameDay(new Date(l.at), new Date())),
    [logs]
  );

  return (
    <View className="gap-3 rounded-card border border-border bg-card p-4">
      {today ? (
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-row items-center justify-between gap-3"
        >
          <Text variant="label">{t('home.moodThanks')}</Text>
          <Button size="sm" variant="ghost" onPress={() => removeMood(today.id)}>
            <Text>{t('home.undo')}</Text>
          </Button>
        </MotiView>
      ) : null}
      {today?.mood === 'stressed' ? (
        <View className="gap-1 rounded-card border border-danger/30 bg-bgMist p-3">
          <Text variant="body">{t('home.lowHelp')}</Text>
          <Pressable
            onPress={() => router.push('/support/resources' as Href)}
            accessibilityRole="button"
            className="min-h-11 justify-center"
          >
            <Text variant="label" className="text-primary underline">
              {t('home.lowHelpCta')}
            </Text>
          </Pressable>
        </View>
      ) : null}
      {today ? null : (
        <>
          <View className="gap-1">
            <Text variant="heading">{t('home.moodTitle')}</Text>
            <Text variant="caption">{t('home.moodHint')}</Text>
          </View>
          <MoodPicker value={null} onChange={(m: Mood) => logMood(m, 'checkin')} size={46} />
        </>
      )}
    </View>
  );
}

// ───────────────────────── Today's session hero ─────────────────────────
interface HeroProps {
  routine: Routine;
  day: number;
  total: number;
  practicedToday: boolean;
  onStart: () => void;
  onOpen: () => void;
}

/** The hero: illustrated cover, glass info panel with title / duration / level, Day X of 30, Start. */
export function TodayHero({ routine, day, total, practicedToday, onStart, onOpen }: HeroProps) {
  const { t } = useT();
  const first = routine.steps.find((s) => s.phase === 'main') ?? routine.steps[0];
  return (
    <View style={{ borderRadius: 28, overflow: 'hidden' }}>
      <CoverArt
        tint={routine.cover}
        figure={variantFor(getExercise(first.exerciseId))}
        height={236}
        rounded={0}
        figureShift={-34}
      />
      <View style={{ position: 'absolute', top: 14, start: 14 }}>
        <Badge variant="default">
          <Text>{t('home.dayOf', { day, total })}</Text>
        </Badge>
      </View>
      <View style={{ position: 'absolute', start: 10, end: 10, bottom: 10 }}>
        <GlassCard strong radius={22} contentStyle={{ padding: 16, gap: 12 }}>
          {/* title opens the routine; Start is a sibling button (never nested buttons) */}
          <Pressable
            onPress={onOpen}
            accessibilityRole="button"
            accessibilityLabel={`${t('home.todayTitle')}: ${routine.title}`}
          >
            <Text variant="caption" className="font-sans-semibold uppercase tracking-wide">
              {t('home.todayTitle')}
            </Text>
            <Text variant="heading" numberOfLines={1}>
              {routine.title}
            </Text>
          </Pressable>
          <View className="flex-row items-center justify-between gap-3">
            <View className="flex-row flex-wrap gap-2">
              <Badge variant="secondary">
                <Text>{t('common.minutes', { count: minutesOf(routine.totalSec) })}</Text>
              </Badge>
              <Badge variant="outline">
                <Text>{t(`level.${routine.level}`)}</Text>
              </Badge>
            </View>
            <Button size="sm" onPress={onStart}>
              <Text>{practicedToday ? t('home.practicedToday') : t('home.start')}</Text>
            </Button>
          </View>
        </GlassCard>
      </View>
    </View>
  );
}

/** Rest day: calm, never a failure. */
export function RestCard({ onBreathe }: { onBreathe: () => void }) {
  const { t } = useT();
  const { colors } = useTheme();
  return (
    <View className="gap-3 rounded-card bg-lavenderSoft p-6">
      <View className="flex-row items-center gap-3">
        <View className="size-12 items-center justify-center rounded-full bg-card">
          <KaizenIcon name="rest-moon" size={26} color={colors.primary} />
        </View>
        <Text variant="heading">{t('home.restTitle')}</Text>
      </View>
      <Text variant="body">{t('home.restBody')}</Text>
      <Button variant="secondary" onPress={onBreathe}>
        <Text>{t('home.restCta')}</Text>
      </Button>
    </View>
  );
}

// ───────────────────────── Quick relief ─────────────────────────
const QUICK_ICON: Record<string, KaizenIconName> = {
  'qr-01': 'calm-anxiety',
  'qr-02': 'desk-neck',
  'qr-03': 'cant-sleep',
  'qr-04': 'energy',
  'qr-05': 'exam',
};

export function QuickReliefRow({
  routines,
  onPress,
}: {
  routines: Routine[];
  onPress: (r: Routine) => void;
}) {
  const { t } = useT();
  const { colors } = useTheme();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 12, paddingHorizontal: 16 }}
    >
      {routines.map((r) => (
        <Pressable
          key={r.id}
          onPress={() => {
            haptic.select();
            onPress(r);
          }}
          accessibilityRole="button"
          accessibilityLabel={`${r.title}, ${t('common.minutes', { count: minutesOf(r.totalSec) })}`}
          style={{ backgroundColor: alpha(coverColor(colors, r.cover), 0.25) }}
          className="min-h-[124px] w-[118px] justify-between rounded-card p-3 active:opacity-90"
        >
          <View className="size-11 items-center justify-center rounded-full bg-card/80">
            <KaizenIcon name={QUICK_ICON[r.id] ?? 'leaf'} size={26} color={colors.primary} />
          </View>
          <View>
            <Text variant="label" numberOfLines={2}>
              {r.title}
            </Text>
            <Text variant="caption">{t('common.minutes', { count: minutesOf(r.totalSec) })}</Text>
          </View>
        </Pressable>
      ))}
    </ScrollView>
  );
}

// ───────────────────────── Weekly gentle strip ─────────────────────────
/** Dots for the days practised this week. Rest days are a calm moon, never a failure. */
export function WeekStrip({ sessions }: { sessions: SessionRecord[] }) {
  const { t, i18n } = useT();
  const { extras } = useTheme();
  const practiceDays = usePrefsStore((s) => s.practiceDays);
  const order = weekdayOrder();
  const today = new Date();
  const isoToday = (today.getDay() === 0 ? 7 : today.getDay()) as Weekday;
  const startIdx = order.indexOf(isoToday);

  return (
    <View className="gap-3 rounded-card border border-border bg-card p-4">
      <Text variant="heading">{t('home.week')}</Text>
      <View className="flex-row justify-between">
        {order.map((iso, i) => {
          const date = new Date(today);
          date.setDate(today.getDate() + (i - startIdx));
          const practiced = sessions.some((s) => isSameDay(new Date(s.at), date));
          const rest = !practiceDays.includes(iso);
          const isToday = i === startIdx;
          const state = practiced
            ? t('home.weekPracticed')
            : rest
              ? t('home.weekRest')
              : isToday
                ? t('home.weekToday')
                : '';
          return (
            <View
              key={iso}
              accessible
              accessibilityLabel={`${weekdayLabel(iso, 'long', i18n.language)}${state ? ', ' + state : ''}`}
              className="items-center gap-2"
            >
              <Text variant="caption">{weekdayLabel(iso, 'narrow', i18n.language)}</Text>
              <View
                className={cn(
                  'size-9 items-center justify-center rounded-full',
                  practiced ? 'bg-leaf' : 'bg-secondary',
                  isToday && 'border-2 border-primary'
                )}
              >
                {practiced ? (
                  <KaizenIcon name="leaf" size={18} color={extras.onLeaf} strokeWidth={2} />
                ) : rest ? (
                  <Icon as={Moon} size={16} weight="duotone" className="text-muted-foreground" />
                ) : null}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

// ───────────────────────── Guest banner ─────────────────────────
export function GuestBanner({ onCreate, onDismiss }: { onCreate: () => void; onDismiss: () => void }) {
  const { t } = useT();
  return (
    <GlassCard
      radius={20}
      contentStyle={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 12, padding: 16 }}
    >
      <View className="min-w-[160px] flex-1">
        <Text variant="label">{t('home.guestTitle')}</Text>
        <Text variant="caption">{t('home.guestBody')}</Text>
      </View>
      <Button size="sm" onPress={onCreate}>
        <Icon as={Plus} size={14} weight="bold" className="text-primary-foreground" />
        <Text>{t('home.guestCta')}</Text>
      </Button>
      <Pressable
        onPress={onDismiss}
        accessibilityRole="button"
        accessibilityLabel={t('home.dismiss')}
        className="size-10 items-center justify-center"
      >
        <Icon as={X} size={16} weight="bold" className="text-muted-foreground" />
      </Pressable>
    </GlassCard>
  );
}
