import { router, type Href } from 'expo-router';
import { MagnifyingGlass, Sliders } from 'phosphor-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AuroraBackground } from '@/components/aurora-background';
import { CoverArt, variantFor } from '@/components/cover-art';
import { FadeUp } from '@/components/fade-up';
import { GlassCard } from '@/components/glass-card';
import { ProgramCard } from '@/components/program-card';
import { RoutineCard } from '@/components/routine-card';
import { SectionHeader } from '@/components/section-header';
import { TAB_BAR_CLEARANCE } from '@/components/tab-bar';
import { Chip } from '@/components/ui/chip';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import {
  exercisesByCategory,
  getExercise,
  listPrograms,
  listSleep,
  listStyles,
  routinesByGoal,
  type ExerciseCategory,
} from '@/data/repo';
import { ExploreSkeleton } from '@/features/states/skeletons';
import { useScreenLoading } from '@/hooks/use-screen-loading';
import { useT } from '@/i18n';
import { openCollection, openProgram, openRoutine, openSearch } from '@/lib/nav';
import { customToRoutine } from '@/lib/routines';
import { useLibraryStore } from '@/store/library-store';
import { usePrefsStore } from '@/store/prefs-store';
import type { Goal } from '@/store/types';

const CATEGORIES: ExerciseCategory[] = [
  'standing',
  'seated',
  'balance',
  'floor',
  'prone',
  'mobility',
  'restorative',
  'flows',
  'breathing',
  'chair',
];
const GOALS: Goal[] = ['stress', 'back-neck', 'sleep', 'focus', 'flexibility', 'balance', 'gentle'];
const FILTERS = ['category', 'level', 'duration', 'goal', 'position', 'equipment', 'chair'] as const;
const px = { paddingHorizontal: 16 };

/** Explore / Library: search, filter chips, programs, routines by goal, styles, pose library, sleep. */
export default function ExploreScreen() {
  const { t } = useT();
  const loading = useScreenLoading();
  const insets = useSafeAreaInsets();
  const myGoals = usePrefsStore((s) => s.goals);
  const [goal, setGoal] = useState<Goal>(myGoals[0] ?? 'stress');
  const byGoal = routinesByGoal(goal);
  const custom = useLibraryStore((s) => s.customRoutines);

  if (loading) return <ExploreSkeleton />;

  return (
    <View className="flex-1 bg-background">
      <AuroraBackground />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + 12,
          paddingBottom: TAB_BAR_CLEARANCE + insets.bottom + 32,
          gap: 24,
        }}
      >
        <FadeUp style={px} className="gap-3">
          <Text variant="title1" accessibilityRole="header">
            {t('explore.title')}
          </Text>
          {/* search bar (opens the Search screen) */}
          <Pressable
            onPress={() => openSearch()}
            accessibilityRole="search"
            accessibilityLabel={t('explore.searchPh')}
          >
            <GlassCard
              radius={999}
              contentStyle={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                paddingHorizontal: 16,
                minHeight: 52,
              }}
            >
              <Icon as={MagnifyingGlass} size={20} />
              <Text variant="body" className="flex-1 text-muted-foreground">
                {t('explore.searchPh')}
              </Text>
              <Icon as={Sliders} size={20} className="text-muted-foreground" />
            </GlassCard>
          </Pressable>
        </FadeUp>

        {/* filter chips: each opens Search with that filter ready */}
        <FadeUp delay={80}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8, paddingHorizontal: 16 }}
          >
            {FILTERS.map((f) => (
              <Chip key={f} label={t(`explore.${f}`)} onPress={() => openSearch({ filter: f })} />
            ))}
          </ScrollView>
        </FadeUp>

        {custom.length ? (
          <FadeUp delay={110} className="gap-3">
            <SectionHeader title={t('custom.myRoutines')} />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 16, paddingHorizontal: 16 }}
            >
              {custom.map((c) => (
                <RoutineCard
                  key={c.id}
                  routine={customToRoutine(c)}
                  onPress={() => router.push(`/routine/custom/${c.id}` as Href)}
                />
              ))}
            </ScrollView>
          </FadeUp>
        ) : null}

        <FadeUp delay={140} className="gap-3">
          <SectionHeader title={t('explore.programs')} />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 16, paddingHorizontal: 16 }}
          >
            {listPrograms().map((p) => (
              <View key={p.id} style={{ width: 310 }}>
                <ProgramCard program={p} onPress={() => openProgram(p.id)} />
              </View>
            ))}
          </ScrollView>
        </FadeUp>

        <FadeUp delay={190} className="gap-3">
          <SectionHeader
            title={t('explore.byGoal')}
            onSeeAll={() => openCollection('collection', 'routines')}
          />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8, paddingHorizontal: 16 }}
          >
            {GOALS.map((g) => (
              <Chip key={g} label={t(`goal.${g}`)} selected={goal === g} onPress={() => setGoal(g)} />
            ))}
          </ScrollView>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 16, paddingHorizontal: 16 }}
          >
            {byGoal.map((r) => (
              <RoutineCard key={r.id} routine={r} onPress={() => openRoutine(r.id)} />
            ))}
          </ScrollView>
        </FadeUp>

        <FadeUp delay={240} className="gap-3">
          <SectionHeader title={t('explore.styles')} />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12, paddingHorizontal: 16 }}
          >
            {listStyles().map((s) => (
              <Pressable
                key={s.id}
                onPress={() => openCollection('style', s.id)}
                accessibilityRole="button"
                accessibilityLabel={`${s.name}. ${s.explainer}`}
                className="w-[250px] gap-2 rounded-card border border-border bg-card p-4 active:opacity-90"
              >
                <Text variant="heading">{s.name}</Text>
                <Text variant="caption" numberOfLines={4}>
                  {s.explainer}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </FadeUp>

        <FadeUp delay={290} className="gap-3">
          <SectionHeader title={t('explore.poses')} />
          <View style={px} className="flex-row flex-wrap justify-between gap-y-3">
            {CATEGORIES.map((c) => {
              const list = exercisesByCategory(c);
              return (
                <Pressable
                  key={c}
                  onPress={() => openCollection('category', c)}
                  accessibilityRole="button"
                  accessibilityLabel={`${t(`explore.categoryName.${c}`)}, ${t('explore.poseCount', { count: list.length })}`}
                  style={{ width: '48%' }}
                  className="gap-2 active:opacity-90"
                >
                  <CoverArt tint="mint" figure={variantFor(getExercise(list[0].id))} height={104} />
                  <Text variant="label">{t(`explore.categoryName.${c}`)}</Text>
                  <Text variant="caption">{t('explore.poseCount', { count: list.length })}</Text>
                </Pressable>
              );
            })}
          </View>
        </FadeUp>

        <FadeUp delay={340} className="gap-3">
          <SectionHeader title={t('explore.sleep')} onSeeAll={() => openCollection('collection', 'sleep')} />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 16, paddingHorizontal: 16 }}
          >
            {listSleep().map((r) => (
              <RoutineCard key={r.id} routine={r} onPress={() => openRoutine(r.id)} />
            ))}
          </ScrollView>
        </FadeUp>
      </ScrollView>
    </View>
  );
}
