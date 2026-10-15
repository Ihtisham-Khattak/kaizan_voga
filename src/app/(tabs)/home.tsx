import { router, type Href } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AuroraBackground } from '@/components/aurora-background';
import { CharacterAvatar } from '@/components/character-avatar';
import { EmptyFor } from '@/features/states/empty';
import { ExerciseCard } from '@/components/exercise-card';
import { FadeUp } from '@/components/fade-up';
import { RoutineCard } from '@/components/routine-card';
import { SectionHeader } from '@/components/section-header';
import { TAB_BAR_CLEARANCE } from '@/components/tab-bar';
import { toast } from '@/components/toast';
import { Text } from '@/components/ui/text';
import { getExercise, getRoutine, listQuickRelief, listRoutines } from '@/data/repo';
import {
  GuestBanner,
  MoodCheckin,
  QuickReliefRow,
  RestCard,
  TrialBanner,
  TodayHero,
  WeekStrip,
} from '@/features/home/parts';
import { HomeSkeleton } from '@/features/states/skeletons';
import { useScreenLoading } from '@/hooks/use-screen-loading';
import { useT } from '@/i18n';
import { isSameDay, partOfDay, useTodayPlan } from '@/lib/journey';
import { openCollection, openPose, openRoutine, startBreathing, startSession } from '@/lib/nav';
import { useAuthStore } from '@/store/auth-store';
import { useLibraryStore } from '@/store/library-store';
import { usePrefsStore } from '@/store/prefs-store';
import { useProgressStore } from '@/store/progress-store';
import { useSubscriptionStore } from '@/store/subscription-store';
import { useUiStore } from '@/store/ui-store';

const px = { paddingHorizontal: 16 };

/** Home (Today): greeting, optional mood check-in, today's session, quick relief, recommendations, favourites, week. */
export default function HomeScreen() {
  const { t, i18n } = useT();
  const loading = useScreenLoading();
  const insets = useSafeAreaInsets();
  const plan = useTodayPlan();
  const prefs = usePrefsStore();
  const user = useAuthStore((s) => s.user);
  const authStatus = useAuthStore((s) => s.status);
  const sessions = useProgressStore((s) => s.sessions);
  const { favorites, lastSession, toggleFavorite } = useLibraryStore();
  const bannerDismissed = useUiStore((s) => s.guestBannerDismissed);
  const showTrial = useSubscriptionStore((s) => s.status === 'trial' && !s.trialBannerDismissed);
  const dismissBanner = useUiStore((s) => s.dismissGuestBanner);

  const name = user?.name || prefs.name || t('home.friend');
  const practicedToday = sessions.some((s) => isSameDay(new Date(s.at), new Date()));
  const dateLabel = new Intl.DateTimeFormat(i18n.language, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  const recommended = useMemo(() => {
    const score = (g: string[]) => g.filter((x) => prefs.goals.includes(x as never)).length;
    return listRoutines()
      .filter((r) => r.kind !== 'quick-relief' && r.id !== plan.routine?.id)
      .sort((a, b) => score(b.goals) - score(a.goals))
      .slice(0, 6);
  }, [prefs.goals, plan.routine?.id]);

  const favExercises = favorites
    .filter((k) => k.startsWith('exercise:'))
    .map((k) => getExercise(k.slice(9)))
    .filter(Boolean);
  const favRoutines = favorites
    .filter((k) => k.startsWith('routine:'))
    .map((k) => getRoutine(k.slice(8)))
    .filter(Boolean);
  const resumeRoutine = lastSession?.kind === 'routine' ? getRoutine(lastSession.contentId) : undefined;

  if (loading) return <HomeSkeleton />;

  return (
    <View className="flex-1 bg-background">
      <AuroraBackground variant={partOfDay() === 'evening' ? 'evening' : 'day'} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + 12,
          paddingBottom: TAB_BAR_CLEARANCE + insets.bottom + 32,
          gap: 24,
        }}
      >
        {/* greeting */}
        <FadeUp style={px} className="flex-row items-center justify-between gap-3">
          <View className="flex-1">
            <Text variant="title1" numberOfLines={2}>
              {t('home.hello', { greeting: t(`home.greeting.${partOfDay()}`), name })}
            </Text>
            <Text variant="caption">{dateLabel}</Text>
          </View>
          <Pressable
            onPress={() => toast.gentle(t('common.tagline'))}
            accessibilityRole="button"
            accessibilityLabel="Kai"
          >
            <CharacterAvatar name="kai" size={52} ring animated />
          </Pressable>
        </FadeUp>

        {authStatus === 'guest' && !bannerDismissed ? (
          <FadeUp delay={60} style={px}>
            <GuestBanner onCreate={() => router.push('/sign-up')} onDismiss={dismissBanner} />
          </FadeUp>
        ) : null}

        {showTrial ? (
          <FadeUp delay={80} style={px}>
            <TrialBanner />
          </FadeUp>
        ) : null}

        <FadeUp delay={100} style={px}>
          <MoodCheckin />
        </FadeUp>

        {/* today */}
        <FadeUp delay={160} style={px}>
          {plan.isRest || !plan.routine ? (
            <RestCard onBreathe={() => startBreathing()} />
          ) : (
            <TodayHero
              routine={plan.routine}
              day={plan.day}
              total={plan.total}
              practicedToday={practicedToday}
              onStart={() => startSession(plan.routine!.id)}
              onOpen={() => openRoutine(plan.routine!.id)}
            />
          )}
        </FadeUp>

        <FadeUp delay={220} className="gap-3">
          <SectionHeader title={t('home.quickTitle')} subtitle={t('home.quickSub')} />
          <QuickReliefRow routines={listQuickRelief()} onPress={(r) => startSession(r.id)} />
        </FadeUp>

        {resumeRoutine ? (
          <FadeUp delay={260} className="gap-3">
            <SectionHeader title={t('home.resume')} />
            <View style={px}>
              <RoutineCard
                variant="row"
                routine={resumeRoutine}
                onPress={() => openRoutine(resumeRoutine.id)}
              />
            </View>
          </FadeUp>
        ) : null}

        <FadeUp delay={300} className="gap-3">
          <SectionHeader
            title={t('home.recommended')}
            onSeeAll={() => openCollection('collection', 'routines')}
          />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 16, paddingHorizontal: 16 }}
          >
            {recommended.map((r) => (
              <RoutineCard key={r.id} routine={r} onPress={() => openRoutine(r.id)} />
            ))}
          </ScrollView>
        </FadeUp>

        <FadeUp delay={340} className="gap-3">
          <SectionHeader title={t('home.favorites')} />
          {favExercises.length + favRoutines.length === 0 ? (
            <View style={px}>
              <View className="rounded-card border border-border bg-card">
                <EmptyFor kind="favourites" onCta={() => router.push('/explore' as Href)} />
              </View>
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 16, paddingHorizontal: 16 }}
            >
              {favRoutines.map((r) => (
                <RoutineCard key={r!.id} routine={r!} onPress={() => openRoutine(r!.id)} />
              ))}
              {favExercises.map((e) => (
                <ExerciseCard
                  key={e!.id}
                  variant="tile"
                  exercise={e!}
                  isFavorite
                  onFavorite={() => toggleFavorite(`exercise:${e!.id}`)}
                  onPress={() => openPose(e!.id)}
                />
              ))}
            </ScrollView>
          )}
        </FadeUp>

        <FadeUp delay={380} style={px}>
          <WeekStrip sessions={sessions} />
        </FadeUp>
      </ScrollView>
    </View>
  );
}
