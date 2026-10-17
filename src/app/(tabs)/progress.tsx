import { router, type Href } from 'expo-router';
import {
  CalendarBlank,
  CaretRight,
  ChartLineUp,
  CheckCircle,
  Clock,
  ClockCounterClockwise,
  Flame,
  Heart,
  Medal,
  NotePencil,
} from 'phosphor-react-native';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AuroraBackground } from '@/components/aurora-background';
import { EmptyState } from '@/components/empty-state';
import { ProgressCard } from '@/components/progress-card';
import { FadeUp } from '@/components/fade-up';
import { TAB_BAR_CLEARANCE } from '@/components/tab-bar';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { JourneyPath } from '@/features/progress/journey-path';
import { WeekChart } from '@/features/progress/week-chart';
import { ProgressSkeleton } from '@/features/states/skeletons';
import { useScreenLoading } from '@/hooks/use-screen-loading';
import { useT } from '@/i18n';
import { journeyDay, JOURNEY_DAYS, useTodayPlan } from '@/lib/journey';
import { startSession } from '@/lib/nav';
import { currentStreak, favouriteStyle, practicedKeys, totalMinutes } from '@/lib/stats';
import { useAppStore } from '@/store/app-store';
import { useProgressStore } from '@/store/progress-store';

const LINKS = [
  { key: 'calendar', href: '/journey/calendar', icon: CalendarBlank },
  { key: 'mood', href: '/journey/mood', icon: ChartLineUp },
  { key: 'reflection', href: '/journey/reflection', icon: NotePencil },
  { key: 'achievements', href: '/journey/achievements', icon: Medal },
  { key: 'history', href: '/journey/history', icon: ClockCounterClockwise },
] as const;

/** Progress tab: the 30-day journey path, three honest numbers, and doors to the deeper views. */
export default function ProgressScreen() {
  const { t } = useT();
  const insets = useSafeAreaInsets();
  const startedAt = useAppStore((s) => s.journeyStartedAt);
  const sessions = useProgressStore((s) => s.sessions);
  const plan = useTodayPlan();
  const day = journeyDay(startedAt);

  const loading = useScreenLoading();

  const practiced = practicedKeys(sessions);
  const minutes = totalMinutes(sessions);
  const fav = favouriteStyle(sessions);
  const streak = currentStreak(sessions);

  if (loading) return <ProgressSkeleton />;

  return (
    <View className="flex-1 bg-background">
      <AuroraBackground />
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 16,
          paddingBottom: TAB_BAR_CLEARANCE + 24,
          paddingHorizontal: 16,
          gap: 24,
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

        {
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
              <>
                <FadeUp delay={120}>
                  <View style={{ gap: 12 }}>
                    <View style={{ flexDirection: 'row', gap: 12 }}>
                      <View style={{ flex: 1 }}>
                        <ProgressCard
                          label={t('prog.stats.sessions')}
                          value={String(sessions.length)}
                          caption={t('prog.stats.sessionsCaption')}
                          icon={CheckCircle}
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <ProgressCard
                          label={t('prog.stats.minutes')}
                          value={String(minutes)}
                          caption={t('prog.stats.minutesCaption')}
                          icon={Clock}
                        />
                      </View>
                    </View>
                    <View style={{ flexDirection: 'row', gap: 12 }}>
                      <View style={{ flex: 1 }}>
                        <ProgressCard
                          label={t('prog.stats.streak')}
                          value={String(streak)}
                          caption={
                            streak > 0
                              ? t('prog.stats.streakCaption', { count: streak })
                              : t('prog.stats.streakNone')
                          }
                          icon={Flame}
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <ProgressCard
                          label={t('prog.stats.favourite')}
                          value={fav ?? t('prog.stats.none')}
                          icon={Heart}
                        />
                      </View>
                    </View>
                  </View>
                </FadeUp>
                <FadeUp delay={180}>
                  <WeekChart sessions={sessions} />
                </FadeUp>
              </>
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
        }
      </ScrollView>
    </View>
  );
}
