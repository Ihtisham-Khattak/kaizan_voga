import { useLocalSearchParams } from 'expo-router';

import { EmptyState } from '@/components/empty-state';
import { RoutineCard } from '@/components/routine-card';
import { listQuickRelief, listRoutines, listSleep } from '@/data/repo';
import { CollectionScaffold } from '@/features/library/collection-scaffold';
import { useT } from '@/i18n';
import { openRoutine } from '@/lib/nav';

/** Curated lists: sleep & wind-down, quick relief, all routines. */
export default function CollectionScreen() {
  const { t } = useT();
  const { id } = useLocalSearchParams<{ id: string }>();
  const kind = String(id);
  const config =
    kind === 'sleep'
      ? { title: t('explore.sleep'), list: listSleep(), tint: 'lavender' as const }
      : kind === 'quick-relief'
        ? { title: t('explore.quickRelief'), list: listQuickRelief(), tint: 'sand' as const }
        : {
            title: t('explore.allRoutines'),
            list: listRoutines().filter((r) => r.kind !== 'quick-relief'),
            tint: 'mint' as const,
          };
  return (
    <CollectionScaffold
      title={config.title}
      subtitle={t('explore.routineCount', { count: config.list.length })}
      tint={config.tint}
    >
      {config.list.length === 0 ? (
        <EmptyState title={t('explore.emptyCollection.title')} body={t('explore.emptyCollection.body')} />
      ) : (
        config.list.map((r) => (
          <RoutineCard key={r.id} variant="row" routine={r} onPress={() => openRoutine(r.id)} />
        ))
      )}
    </CollectionScaffold>
  );
}
