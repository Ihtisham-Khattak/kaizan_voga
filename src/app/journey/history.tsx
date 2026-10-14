import { router, type Href } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/empty-state';
import { ScreenHeader } from '@/components/screen-header';
import { Chip } from '@/components/ui/chip';
import { Text } from '@/components/ui/text';
import { SessionRow } from '@/features/progress/session-row';
import { useT } from '@/i18n';
import { addDays, dayKey, startOfWeek } from '@/lib/stats';
import { useProgressStore } from '@/store/progress-store';
import type { ContentKind, SessionRecord } from '@/store/types';

type Filter = 'all' | 'routine' | 'breathing' | 'relief';
const MATCH: Record<Filter, (k: ContentKind) => boolean> = {
  all: () => true,
  routine: (k) => k === 'routine' || k === 'program-day',
  breathing: (k) => k === 'breathing',
  relief: (k) => k === 'quick-relief',
};

/** Every session, newest first, grouped by week. */
export default function HistoryScreen() {
  const { t, i18n } = useT();
  const insets = useSafeAreaInsets();
  const sessions = useProgressStore((s) => s.sessions);
  const [filter, setFilter] = useState<Filter>('all');

  const shown = sessions.filter((s) => MATCH[filter](s.kind)).sort((a, b) => b.at.localeCompare(a.at));
  const thisWeek = dayKey(startOfWeek(new Date()));
  const lastWeek = dayKey(addDays(startOfWeek(new Date()), -7));
  const groups = new Map<string, SessionRecord[]>();
  for (const s of shown) {
    const k = dayKey(startOfWeek(new Date(s.at)));
    groups.set(k, [...(groups.get(k) ?? []), s]);
  }
  const fmt = new Intl.DateTimeFormat(i18n.language, { day: 'numeric', month: 'short' });
  const label = (key: string) => {
    if (key === thisWeek) return t('prog.hist.thisWeek');
    if (key === lastWeek) return t('prog.hist.lastWeek');
    const [y, m, d] = key.split('-').map(Number);
    const from = new Date(y, m - 1, d);
    return `${fmt.format(from)} – ${fmt.format(addDays(from, 6))}`;
  };

  return (
    <View className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 32, gap: 16 }}>
        <ScreenHeader title={t('prog.hist.title')} subtitle={t('prog.hist.subtitle')} />
        <View className="flex-row flex-wrap gap-2 px-4">
          {(['all', 'routine', 'breathing', 'relief'] as Filter[]).map((f) => (
            <Chip key={f} label={t(`prog.hist.${f}`)} selected={filter === f} onPress={() => setFilter(f)} />
          ))}
        </View>

        {shown.length === 0 ? (
          <EmptyState
            title={t('prog.hist.emptyTitle')}
            body={sessions.length === 0 ? t('prog.hist.emptyBody') : t('prog.hist.emptyFilter')}
            mood="calm"
          />
        ) : (
          [...groups.entries()].map(([key, list]) => (
            <View key={key} className="gap-2 px-4">
              <Text variant="label" accessibilityRole="header" className="text-muted-foreground">
                {label(key)}
              </Text>
              {list.map((s) => (
                <SessionRow
                  key={s.id}
                  session={s}
                  showDate
                  onPress={() => router.push(`/journey/session/${s.id}` as Href)}
                />
              ))}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
