import { router, type Href } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { ExerciseCard } from '@/components/exercise-card';
import { FadeUp } from '@/components/fade-up';
import { RoutineCard } from '@/components/routine-card';
import { Chip } from '@/components/ui/chip';
import { getExercise, getRoutine } from '@/data/repo';
import { CollectionScaffold } from '@/features/library/collection-scaffold';
import { EmptyFor } from '@/features/states/empty';
import { useT } from '@/i18n';
import { openPose, openRoutine } from '@/lib/nav';
import { useLibraryStore } from '@/store/library-store';

type Tab = 'poses' | 'routines';

/** Favorites: saved poses and routines in two tabs, with a Kai empty state when there is nothing yet. */
export default function FavoritesScreen() {
  const { t } = useT();
  const { favorites, toggleFavorite } = useLibraryStore();
  const [tab, setTab] = useState<Tab>('poses');
  const poses = favorites
    .filter((k) => k.startsWith('exercise:'))
    .map((k) => getExercise(k.slice(9)))
    .filter(Boolean);
  const routines = favorites
    .filter((k) => k.startsWith('routine:'))
    .map((k) => getRoutine(k.slice(8)))
    .filter(Boolean);
  const empty = poses.length + routines.length === 0;
  const shown = tab === 'poses' ? poses : routines;

  return (
    <CollectionScaffold
      title={t('favoritesScreen.title')}
      subtitle={
        empty
          ? t('favoritesScreen.subtitle')
          : t('favoritesScreen.saved', { count: poses.length + routines.length })
      }
    >
      {empty ? (
        <FadeUp>
          <EmptyFor kind="favourites" onCta={() => router.push('/explore' as Href)} />
        </FadeUp>
      ) : (
        <>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8 }}
            role="radiogroup"
          >
            <Chip
              label={`${t('favoritesScreen.poses')} · ${poses.length}`}
              selected={tab === 'poses'}
              onPress={() => setTab('poses')}
            />
            <Chip
              label={`${t('favoritesScreen.routines')} · ${routines.length}`}
              selected={tab === 'routines'}
              onPress={() => setTab('routines')}
            />
          </ScrollView>
          {shown.length === 0 ? (
            <EmptyFor kind="favourites" onCta={() => router.push('/explore' as Href)} />
          ) : (
            <View style={{ gap: 12 }}>
              {tab === 'poses'
                ? poses.map((e, i) => (
                    <FadeUp key={e!.id} delay={i * 50} distance={12}>
                      <ExerciseCard
                        exercise={e!}
                        isFavorite
                        onFavorite={() => toggleFavorite(`exercise:${e!.id}`)}
                        onPress={() => openPose(e!.id)}
                      />
                    </FadeUp>
                  ))
                : routines.map((r, i) => (
                    <FadeUp key={r!.id} delay={i * 50} distance={12}>
                      <RoutineCard variant="row" routine={r!} onPress={() => openRoutine(r!.id)} />
                    </FadeUp>
                  ))}
            </View>
          )}
        </>
      )}
    </CollectionScaffold>
  );
}
