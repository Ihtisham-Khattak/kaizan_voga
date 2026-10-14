import { router, type Href } from 'expo-router';
import {
  CalendarBlank,
  CaretRight,
  ChartLineUp,
  ClockCounterClockwise,
  Medal,
  NotePencil,
} from 'phosphor-react-native';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/empty-state';
import { FadeUp } from '@/components/fade-up';
import { TAB_BAR_CLEARANCE } from '@/components/tab-bar';
import { Icon } from '@/components/ui/icon';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { JourneyPath } from '@/features/progress/journey-path';
import { useT } from '@/i18n';
import { journeyDay, JOURNEY_DAYS, useTodayPlan } from '@/lib/journey';
import { startSession } from '@/lib/nav';
import { favouriteStyle, practicedKeys, totalMinutes } from '@/lib/stats';
import { useAppStore } from '@/store/app-store';
import { useProgressStore } from '@/store/progress-store';

const LINKS = [
  { key: 'calendar', href: '/journey/calendar', icon: CalendarBlank },
  { key: 'mood', href: '/journey/mood', icon: ChartLineUp },
  { key: 'reflection', href: '/journey/reflection', icon: NotePencil },
  { key: 'achievements', href: '/journey/achievements', icon: Medal },
  { key: 'history', href: '/journey/history', icon: ClockCounterClockwise },
] as const;

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-1 items-center gap-0.5 rounded-2xl border border-border bg-card px-2 py-3">
      <Text variant="title" numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
      <Text variant="caption" className="text-center" numberOfLines={2}>
        {label}
      </Text>
    </View>
  );
}

/** Progress tab: the 30-day journey path, three honest numbers, and doors to the deeper views. */
export default function ProgressScreen() {
  const { t } = useT();
  const insets = useSafeAreaInsets();
  const startedAt = useAppStore((s) => s.journeyStartedAt);
  const sessions = useProgressStore((s) => s.sessions);
  const plan = useTodayPlan();
  const day = journeyDay(startedAt);

  // brief skeleton so the first paint feels like loading real data (Phase 2 swaps in the real fetch)
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const id = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(id);
  }, []);

  const practiced = practicedKeys(sessions);
  const minutes = totalMinutes(sessions);
  const fav = favouriteStyle(sessions);

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 16,
          paddingBottom: TAB_BAR_CLEARANCE + 24,
          paddingHorizontal: 16,
          gap: 20,
        }}
      >
        <View className="gap-1">
          <Text variant="title1" accessibilityRole="header">
            {t('prog.title')}
          </Text>
          <Text variant="body" className="text-muted-foreground">
            {t('prog.subtitle')}
          </Text>
        </View>

        {loading ? (
          <View className="gap-4">
            <Skeleton className="h-72 w-full rounded-3xl" />
            <View className="flex-row gap-3">
              <Skeleton className="h-20 flex-1" />
              <Skeleton className="h-20 flex-1" />
              <Skeleton className="h-20 flex-1" />
            </View>
          </View>
        ) : (
          <>
            <FadeUp>
              <View className="gap-3 rounded-3xl border border-border bg-card p-4">
                <View className="flex-row items-baseline justify-between">
                  <Text variant="heading">{t('prog.journey')}</Text>
                  <Text variant="caption" className="font-sans-semibold">
                    {t('prog.dayOf', { day, total: JOURNEY_DAYS })}
                  </Text>
                </View>
                <JourneyPath startedAt={startedAt} currentDay={day} practiced={practiced} />
                <Text variant="caption" className="text-center">
                  {t('prog.pathHint')}
                </Text>
              </View>
            </FadeUp>

            {sessions.length === 0 ? (
              <EmptyState
                title={t('prog.emptyTitle')}
                body={t('prog.emptyBody')}
                mood="happy"
                pose="wave"
                cta={
                  plan.routine
                    ? { label: t('prog.emptyCta'), onPress: () => startSession(plan.routine!.id) }
                    : undefined
                }
              />
            ) : (
              <FadeUp delay={120}>
                <View className="flex-row gap-3">
                  <Stat label={t('prog.stats.minutes')} value={String(minutes)} />
                  <Stat label={t('prog.stats.sessions')} value={String(sessions.length)} />
                  <Stat label={t('prog.stats.favourite')} value={fav ?? t('prog.stats.none')} />
                </View>
              </FadeUp>
            )}

            <FadeUp delay={200}>
              <View className="gap-2">
                <Text variant="heading" accessibilityRole="header">
                  {t('prog.lookCloser')}
                </Text>
                {LINKS.map(({ key, href, icon }) => (
                  <Pressable
                    key={key}
                    onPress={() => router.push(href as Href)}
                    accessibilityRole="button"
                    accessibilityLabel={`${t(`prog.links.${key}`)}. ${t(`prog.links.${key}Sub`)}`}
                    className="min-h-16 flex-row items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 active:opacity-80"
                  >
                    <View className="size-11 items-center justify-center rounded-full bg-secondary">
                      <Icon as={icon} size={22} weight="duotone" className="text-primary" />
                    </View>
                    <View className="flex-1">
                      <Text variant="label">{t(`prog.links.${key}`)}</Text>
                      <Text variant="caption">{t(`prog.links.${key}Sub`)}</Text>
                    </View>
                    <Icon as={CaretRight} size={18} className="text-muted-foreground" />
                  </Pressable>
                ))}
              </View>
            </FadeUp>
          </>
        )}
      </ScrollView>
    </View>
  );
}
