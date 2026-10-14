import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import Svg, { Circle, Polygon } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/empty-state';
import { ScreenHeader } from '@/components/screen-header';
import { Chip } from '@/components/ui/chip';
import { Text } from '@/components/ui/text';
import { MoodChart } from '@/features/progress/mood-chart';
import { useT } from '@/i18n';
import { partOfDay, type Part } from '@/lib/journey';
import { MOOD_LEVEL } from '@/lib/stats';
import { useProgressStore } from '@/store/progress-store';
import { useTheme } from '@/theme/theme-provider';

type Range = '7' | '30' | 'all';
const RANGE_DAYS: Record<Range, number> = { '7': 7, '30': 30, all: 100000 };

/** Soft, hedged wording on purpose: "often", "may". Never a claim about health. */
function useInsight(data: ReturnType<typeof useData>) {
  const { t } = useT();
  const deltas = data.map((s) => ({
    d: MOOD_LEVEL[s.moodAfter!] - MOOD_LEVEL[s.moodBefore!],
    part: partOfDay(new Date(s.at)),
  }));
  const avg = deltas.reduce((n, x) => n + x.d, 0) / (deltas.length || 1);
  const parts = (['morning', 'afternoon', 'evening'] as Part[])
    .map((p) => {
      const mine = deltas.filter((x) => x.part === p);
      return { p, n: mine.length, avg: mine.reduce((n, x) => n + x.d, 0) / (mine.length || 1) };
    })
    .filter((x) => x.n >= 2 && x.avg > 0)
    .sort((a, b) => b.avg - a.avg);
  if (parts.length && parts[0].avg >= avg)
    return t('prog.mood.insightPart', { part: t(`prog.mood.part.${parts[0].p}`) });
  if (avg > 0) return t('prog.mood.insightUp');
  return t('prog.mood.insightFlat');
}

function useData(range: Range, now: number) {
  const sessions = useProgressStore((s) => s.sessions);
  const cutoff = now - RANGE_DAYS[range] * 86_400_000;
  return sessions
    .filter((s) => s.moodBefore && s.moodAfter && new Date(s.at).getTime() >= cutoff)
    .sort((a, b) => a.at.localeCompare(b.at));
}

/** Mood insights: before/after chart, a gentle insight sentence, and a text table for screen-reader users. */
export default function MoodScreen() {
  const { t, i18n } = useT();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [range, setRange] = useState<Range>('30');
  const [table, setTable] = useState(false);
  const [width, setWidth] = useState(340);
  const [now] = useState(() => Date.now());
  const data = useData(range, now);
  const insight = useInsight(data);
  const fmt = (iso: string) =>
    new Intl.DateTimeFormat(i18n.language, { day: 'numeric', month: 'short' }).format(new Date(iso));

  return (
    <View className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 32, gap: 16 }}>
        <ScreenHeader title={t('prog.mood.title')} subtitle={t('prog.mood.subtitle')} />

        <View className="flex-row flex-wrap gap-2 px-4">
          {(['7', '30', 'all'] as Range[]).map((r) => (
            <Chip
              key={r}
              label={t(`prog.mood.range${r === 'all' ? 'All' : r}`)}
              selected={range === r}
              onPress={() => setRange(r)}
            />
          ))}
        </View>

        {data.length < 3 ? (
          <EmptyState
            title={t('prog.mood.emptyTitle')}
            body={t('prog.mood.emptyBody')}
            mood="calm"
            pose="float"
          />
        ) : (
          <>
            <View className="mx-4 gap-3 rounded-3xl border border-border bg-card p-4">
              <View className="flex-row items-center justify-center gap-6">
                <View className="flex-row items-center gap-2">
                  <Svg width={16} height={16}>
                    <Circle cx={8} cy={8} r={6} fill={colors.bgMist} stroke={colors.ink} strokeWidth={2} />
                  </Svg>
                  <Text variant="caption">{t('prog.mood.before')}</Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <Svg width={16} height={16}>
                    <Polygon points="8,0 16,8 8,16 0,8" fill={colors.primary} />
                  </Svg>
                  <Text variant="caption">{t('prog.mood.after')}</Text>
                </View>
              </View>
              <View onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
                <MoodChart data={data} width={width} />
              </View>
            </View>

            <View className="mx-4 rounded-3xl bg-secondary/70 p-4">
              <Text variant="heading" accessibilityLiveRegion="polite">
                {insight}
              </Text>
            </View>

            <Pressable
              onPress={() => setTable((v) => !v)}
              accessibilityRole="button"
              accessibilityState={{ expanded: table }}
              className="mx-4 min-h-11 items-center justify-center rounded-pill bg-secondary px-4"
            >
              <Text variant="label">{table ? t('prog.mood.hideTable') : t('prog.mood.table')}</Text>
            </Pressable>
            {table ? (
              <View
                className="mx-4 overflow-hidden rounded-2xl border border-border bg-card"
                accessibilityRole="list"
              >
                <View className="flex-row bg-secondary px-4 py-2">
                  <Text variant="caption" className="flex-1 font-sans-semibold">
                    {t('prog.mood.date')}
                  </Text>
                  <Text variant="caption" className="flex-1 font-sans-semibold">
                    {t('prog.mood.before')}
                  </Text>
                  <Text variant="caption" className="flex-1 font-sans-semibold">
                    {t('prog.mood.after')}
                  </Text>
                </View>
                {data.map((s) => (
                  <View
                    key={s.id}
                    accessible
                    accessibilityLabel={t('prog.mood.pair', {
                      date: fmt(s.at),
                      before: t(`mood.${s.moodBefore!}`),
                      after: t(`mood.${s.moodAfter!}`),
                    })}
                    className="flex-row border-t border-border px-4 py-3"
                  >
                    <Text variant="caption" className="flex-1">
                      {fmt(s.at)}
                    </Text>
                    <Text variant="caption" className="flex-1">
                      {t(`mood.${s.moodBefore!}`)}
                    </Text>
                    <Text variant="caption" className="flex-1">
                      {t(`mood.${s.moodAfter!}`)}
                    </Text>
                  </View>
                ))}
              </View>
            ) : null}
          </>
        )}
      </ScrollView>
    </View>
  );
}
