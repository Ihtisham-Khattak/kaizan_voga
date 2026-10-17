import { useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { EmptyState } from '@/components/empty-state';
import { RoutineCard } from '@/components/routine-card';
import { SafetyNotice } from '@/components/safety-notice';
import { Text } from '@/components/ui/text';
import { getStyle, routinesByStyle } from '@/data/repo';
import { CollectionScaffold } from '@/features/library/collection-scaffold';
import { useT } from '@/i18n';
import { openRoutine } from '@/lib/nav';

/** Style detail: a plain-language explainer, who it suits, and routines in that style. */
export default function StyleScreen() {
  const { t } = useT();
  const { id } = useLocalSearchParams<{ id: string }>();
  const style = getStyle(String(id));
  const routines = routinesByStyle(String(id));
  if (!style)
    return (
      <CollectionScaffold title={t('comingSoon.title')}>
        <EmptyState title={t('explore.emptyCollection.title')} body={t('explore.emptyCollection.body')} />
      </CollectionScaffold>
    );
  return (
    <CollectionScaffold title={style.name} subtitle={style.explainer}>
      <View className="gap-1 rounded-card bg-secondary p-4">
        <Text variant="caption" className="font-sans-semibold uppercase tracking-wide">
          {t('explore.whoFor')}
        </Text>
        <Text variant="body" className="text-secondary-foreground">
          {style.suits}
        </Text>
      </View>
      {style.note ? <SafetyNotice title={t('safety.title')} lines={[style.note]} /> : null}
      <Text variant="heading" className="pt-2">
        {t('explore.sampleRoutines')}
      </Text>
      {routines.length === 0 ? (
        <EmptyState title={t('explore.emptyCollection.title')} body={t('explore.emptyCollection.body')} />
      ) : (
        routines.map((r) => (
          <RoutineCard key={r.id} variant="row" routine={r} onPress={() => openRoutine(r.id)} />
        ))
      )}
    </CollectionScaffold>
  );
}
