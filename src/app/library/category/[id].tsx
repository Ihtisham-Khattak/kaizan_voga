import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView } from 'react-native';

import { EmptyFor } from '@/features/states/empty';
import { ExerciseCard } from '@/components/exercise-card';
import { Chip } from '@/components/ui/chip';
import { exercisesByCategory, type ExerciseCategory, type Level } from '@/data/repo';
import { CollectionScaffold } from '@/features/library/collection-scaffold';
import { useT } from '@/i18n';
import { openPose } from '@/lib/nav';
import { useLibraryStore } from '@/store/library-store';

/** Pose category list with quick level / chair-friendly filters and favourites. */
export default function CategoryScreen() {
  const { t } = useT();
  const { id } = useLocalSearchParams<{ id: string }>();
  const category = String(id) as ExerciseCategory;
  const [level, setLevel] = useState<Level | null>(null);
  const [chair, setChair] = useState(false);
  const favorites = useLibraryStore((s) => s.favorites);
  const toggle = useLibraryStore((s) => s.toggleFavorite);

  const list = exercisesByCategory(category)
    .filter((e) => !level || e.level === level)
    .filter((e) => !chair || e.tags.accessibility.includes('chair-friendly'));

  return (
    <CollectionScaffold
      title={t(`explore.categoryName.${category}`)}
      subtitle={t('explore.poseCount', { count: exercisesByCategory(category).length })}
    >
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
        <Chip
          label={t('explore.all')}
          selected={!level && !chair}
          onPress={() => {
            setLevel(null);
            setChair(false);
          }}
        />
        <Chip
          label={t('level.beginner')}
          selected={level === 'beginner'}
          onPress={() => setLevel(level === 'beginner' ? null : 'beginner')}
        />
        <Chip
          label={t('level.intermediate')}
          selected={level === 'intermediate'}
          onPress={() => setLevel(level === 'intermediate' ? null : 'intermediate')}
        />
        <Chip label={t('explore.chair')} selected={chair} onPress={() => setChair(!chair)} />
      </ScrollView>
      {list.length === 0 ? (
        <EmptyFor kind="search" />
      ) : (
        list.map((e) => (
          <ExerciseCard
            key={e.id}
            exercise={e}
            isFavorite={favorites.includes(`exercise:${e.id}`)}
            onFavorite={() => toggle(`exercise:${e.id}`)}
            onPress={() => openPose(e.id)}
          />
        ))
      )}
    </CollectionScaffold>
  );
}
