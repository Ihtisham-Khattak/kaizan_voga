import { router, useLocalSearchParams, type Href } from 'expo-router';
import { CaretDown, Check } from 'phosphor-react-native';
import { AnimatePresence, MotiView } from 'moti';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CoverArt } from '@/components/cover-art';
import { EmptyState } from '@/components/empty-state';
import { GlassCard } from '@/components/glass-card';
import { ProgressRing } from '@/components/progress-ring';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { getProgram, getRoutine, type ProgramDay } from '@/data/repo';
import { HeroActions } from '@/features/pose/hero-actions';
import { CompanionPick } from '@/components/companion-pick';
import { PremiumBadge } from '@/components/premium-badge';
import { gate } from '@/lib/entitlement';
import { useT } from '@/i18n';
import { KaizenIcon } from '@/icons';
import { minutesOf } from '@/lib/format';
import { JOURNEY_ID, journeyDay } from '@/lib/journey';
import { startBreathing, startSession } from '@/lib/nav';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/app-store';
import { useTheme } from '@/theme/theme-provider';

type State = 'done' | 'today' | 'upcoming' | 'rest';

function DayRow({ d, state }: { d: ProgramDay; state: State }) {
  const { t } = useT();
  const { colors } = useTheme();
  const routine = d.routineId ? getRoutine(d.routineId) : undefined;
  return (
    <Pressable
      onPress={() => routine && router.push(`/routine/${routine.id}` as Href)}
      disabled={!routine}
      accessibilityRole="button"
      accessibilityLabel={`${t('program.week', { n: Math.ceil(d.day / 7) })}, ${d.day}: ${d.title}`}
      className={cn('flex-row items-center gap-3 rounded-2xl px-3 py-3', state === 'today' && 'bg-secondary')}
    >
      <View
        className={cn(
          'size-9 items-center justify-center rounded-full',
          state === 'done' ? 'bg-leaf' : state === 'today' ? 'bg-primary' : 'bg-secondary'
        )}
      >
        {state === 'done' ? (
          <Icon as={Check} size={16} weight="bold" className="text-onLeaf" />
        ) : state === 'rest' ? (
          <KaizenIcon name="rest-moon" size={18} color={colors.muted} />
        ) : (
          <Text
            variant="caption"
            className={cn(
              'font-sans-bold',
              state === 'today' ? 'text-primary-foreground' : 'text-foreground'
            )}
          >
            {String(d.day)}
          </Text>
        )}
      </View>
      <View className="flex-1">
        <Text variant="label" numberOfLines={1}>
          {d.kind === 'rest' ? t('program.restDay') : d.title}
        </Text>
        <Text variant="caption">
          {state === 'today'
            ? t('program.today')
            : state === 'done'
              ? t('program.completed')
              : routine
                ? t('common.minutes', { count: minutesOf(routine.totalSec) })
                : t('program.upcoming')}
        </Text>
      </View>
    </Pressable>
  );
}

/** Program detail: cover, description, progress, week-by-week list (completed / today / upcoming / rest), sticky Start/Continue. */
export default function ProgramDetail() {
  const { t } = useT();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const p = getProgram(String(id));
  const startedAt = useAppStore((s) => s.journeyStartedAt);
  const isJourney = p?.id === JOURNEY_ID;
  const today = isJourney ? journeyDay(startedAt) : 1;
  const done = isJourney ? today - 1 : 0;
  const [openWeek, setOpenWeek] = useState(Math.ceil(today / 7));

  if (!p) {
    return (
      <View className="flex-1 justify-center bg-background">
        <EmptyState
          mood="tired"
          title={t('pose.notFound.title')}
          body={t('pose.notFound.body')}
          cta={{ label: t('common.back'), onPress: () => router.back() }}
        />
      </View>
    );
  }

  const weeks = Array.from({ length: Math.ceil(p.days.length / 7) }, (_, i) =>
    p.days.slice(i * 7, i * 7 + 7)
  );
  const stateOf = (d: ProgramDay): State =>
    d.day === today
      ? 'today'
      : d.day < today
        ? d.kind === 'rest'
          ? 'rest'
          : 'done'
        : d.kind === 'rest'
          ? 'rest'
          : 'upcoming';
  const next = p.days[Math.min(today, p.days.length) - 1];

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
      >
        <View style={{ borderBottomLeftRadius: 32, borderBottomRightRadius: 32, overflow: 'hidden' }}>
          <CoverArt tint={p.cover} height={230} rounded={0} />
          <View style={{ position: 'absolute', bottom: 12, start: 14 }}>
            <PremiumBadge id={p.id} premium={p.premium} contentKind={'program'} />
          </View>
        </View>

        <View className="gap-4 px-4 pt-6">
          <View className="flex-row items-center gap-4">
            <View className="flex-1 gap-1">
              <Text variant="title1" accessibilityRole="header">
                {p.title}
              </Text>
              <View className="flex-row flex-wrap gap-2 pt-1">
                <Badge variant="secondary">
                  <Text>{t('cards.weeks', { count: p.weeks })}</Text>
                </Badge>
                <Badge variant="outline">
                  <Text>{t(`level.${p.level}`)}</Text>
                </Badge>
              </View>
            </View>
            <ProgressRing
              progress={done / p.days.length}
              size={72}
              strokeWidth={8}
              accessibilityLabel={t('program.daysDone', { done, total: p.days.length })}
            >
              <Text variant="label">{String(done)}</Text>
            </ProgressRing>
          </View>
          <Text variant="body">{p.description}</Text>
          <CompanionPick id={p.id} />
          <Text variant="caption">{t('program.daysDone', { done, total: p.days.length })}</Text>

          {/* weeks */}
          <View className="gap-2">
            {weeks.map((days, wi) => {
              const open = openWeek === wi + 1;
              const doneCount = days.filter((d) => stateOf(d) === 'done').length;
              return (
                <View key={wi} className="overflow-hidden rounded-card border border-border bg-card">
                  <Pressable
                    onPress={() => setOpenWeek(open ? 0 : wi + 1)}
                    accessibilityRole="button"
                    accessibilityState={{ expanded: open }}
                    className="min-h-14 flex-row items-center justify-between px-4"
                  >
                    <View>
                      <Text variant="heading">{t('program.week', { n: wi + 1 })}</Text>
                      <Text variant="caption">
                        {t('program.daysDone', { done: doneCount, total: days.length })}
                      </Text>
                    </View>
                    <MotiView
                      animate={{ rotate: open ? '180deg' : '0deg' }}
                      transition={{ type: 'timing', duration: 250 }}
                    >
                      <Icon as={CaretDown} size={20} className="text-muted-foreground" />
                    </MotiView>
                  </Pressable>
                  <AnimatePresence>
                    {open ? (
                      <MotiView
                        from={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ type: 'timing', duration: 250 }}
                        style={{ paddingHorizontal: 8, paddingBottom: 8 }}
                      >
                        {days.map((d) => (
                          <DayRow key={d.day} d={d} state={stateOf(d)} />
                        ))}
                      </MotiView>
                    ) : null}
                  </AnimatePresence>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <HeroActions />

      <GlassCard
        strong
        radii={{ tl: 28, tr: 28 }}
        style={{ position: 'absolute', start: 0, end: 0, bottom: 0 }}
        contentStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: Math.max(insets.bottom, 12) }}
      >
        <Button
          size="lg"
          onPress={() => {
            if (!gate({ kind: 'content', id: p.id, premium: p.premium, contentKind: 'program' })) return;
            if (next.routineId) startSession(next.routineId);
            else startBreathing();
          }}
        >
          <Text>{done > 0 ? t('program.continue') : t('program.start')}</Text>
        </Button>
      </GlassCard>
    </View>
  );
}
