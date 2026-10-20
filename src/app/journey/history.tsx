import { router, type Href } from 'expo-router';
import { memo, useCallback, useMemo, useState } from 'react';
import { FlatList, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EmptyFor } from '@/features/states/empty';
import { ScreenHeader } from '@/components/screen-header';
import { Chip } from '@/components/ui/chip';
import { Text } from '@/components/ui/text';
import { SessionRow } from '@/features/progress/session-row';
import { ListSkeleton } from '@/features/states/skeletons';
import { useScreenLoading } from '@/hooks/use-screen-loading';
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
  const loading = useScreenLoading();
  const insets = useSafeAreaInsets();
  const sessions = useProgressStore((s) => s.sessions);
  const [filter, setFilter] = useState<Filter>('all');

  const thisWeek = dayKey(startOfWeek(new Date()));
  const lastWeek = dayKey(addDays(startOfWeek(new Date()), -7));
  const fmt = useMemo(
    () => new Intl.DateTimeFormat(i18n.language, { day: 'numeric', month: 'short' }),
    [i18n.language]
  );
  const label = useCallback(
    (key: string) => {
      if (key === thisWeek) return t('prog.hist.thisWeek');
      if (key === lastWeek) return t('prog.hist.lastWeek');
      const [y, m, d] = key.split('-').map(Number);
      const from = new Date(y, m - 1, d);
      return `${fmt.format(from)} – ${fmt.format(addDays(from, 6))}`;
    },
    [t, fmt, thisWeek, lastWeek]
  );

  // One flat list of week headers and sessions, so only what is on screen is rendered (history grows without limit).
  const { rows, shownCount } = useMemo(() => {
    const shown = sessions.filter((s) => MATCH[filter](s.kind)).sort((a, b) => b.at.localeCompare(a.at));
    const out: Row[] = [];
    let current = '';
    for (const s of shown) {
      const k = dayKey(startOfWeek(new Date(s.at)));
      if (k !== current) {
        current = k;
        out.push({ type: 'week', id: `w-${k}`, key: k });
      }
      out.push({ type: 'session', id: s.id, session: s });
    }
    return { rows: out, shownCount: shown.length };
  }, [sessions, filter]);

  const open = useCallback((id: string) => router.push(`/journey/session/${id}` as Href), []);

  if (loading) return <ListSkeleton />;

  return (
    <View className="flex-1 bg-background">
      <FlatList
        data={rows}
        keyExtractor={(r) => r.id}
        contentContainerStyle={{ paddingBottom: insets.bottom + 32, gap: 8 }}
        initialNumToRender={12}
        windowSize={7}
        removeClippedSubviews
        ListHeaderComponent={
          <View style={{ gap: 16, paddingBottom: 8 }}>
            <ScreenHeader title={t('prog.hist.title')} subtitle={t('prog.hist.subtitle')} />
            <View className="flex-row flex-wrap gap-2 px-4">
              {(['all', 'routine', 'breathing', 'relief'] as Filter[]).map((f) => (
                <Chip
                  key={f}
                  label={t(`prog.hist.${f}`)}
                  selected={filter === f}
                  onPress={() => setFilter(f)}
                />
              ))}
            </View>
          </View>
        }
        ListEmptyComponent={
          <EmptyFor
            kind="history"
            body={sessions.length === 0 ? undefined : t('prog.hist.emptyFilter')}
            onCta={sessions.length === 0 ? () => router.push('/home' as Href) : undefined}
          />
        }
        ListFooterComponent={
          shownCount > 0 ? (
            <Text variant="footnote" className="px-4 pt-2 text-center text-muted-foreground">
              {t('prog.hist.count', { count: shownCount })}
            </Text>
          ) : null
        }
        renderItem={({ item }) =>
          item.type === 'week' ? (
            <View className="px-4 pt-3">
              <Text variant="label" accessibilityRole="header" className="text-muted-foreground">
                {label(item.key)}
              </Text>
            </View>
          ) : (
            <View className="px-4">
              <MemoRow session={item.session} onOpen={open} />
            </View>
          )
        }
      />
    </View>
  );
}

type Row =
  { type: 'week'; id: string; key: string } | { type: 'session'; id: string; session: SessionRecord };

/** Rows only re-render when their own session changes. */
const MemoRow = memo(function MemoRow({
  session,
  onOpen,
}: {
  session: SessionRecord;
  onOpen: (id: string) => void;
}) {
  return <SessionRow session={session} showDate onPress={() => onOpen(session.id)} />;
});
