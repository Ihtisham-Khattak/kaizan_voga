import { View } from 'react-native';

import { GlassCard } from '@/components/glass-card';
import { Text } from '@/components/ui/text';
import { useT } from '@/i18n';
import { weekMinutes } from '@/lib/stats';
import { weekdayLabel } from '@/lib/weekdays';
import type { SessionRecord } from '@/store/types';
import { useTheme } from '@/theme/theme-provider';

const BAR_MAX = 96;

/**
 * This week at a glance: one bar per day (minutes practised). Days without practice stay a quiet dot, never a red
 * mark: rest is part of practice too. Today is outlined; values are also spoken for screen readers.
 */
export function WeekChart({ sessions }: { sessions: SessionRecord[] }) {
  const { t, i18n } = useT();
  const { colors } = useTheme();
  const week = weekMinutes(sessions);
  const max = Math.max(10, ...week.map((d) => d.minutes));
  const total = week.reduce((n, d) => n + d.minutes, 0);
  const active = week.filter((d) => d.minutes > 0).length;

  return (
    <GlassCard strong radius="hero" contentStyle={{ padding: 16, gap: 14 }}>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <Text variant="title3" style={{ color: colors.forest }}>
          {t('prog.week.title')}
        </Text>
        <Text variant="footnote" style={{ color: colors.muted }}>
          {t('prog.week.summary', { minutes: total, days: active })}
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          height: BAR_MAX + 28,
        }}
        accessible
        accessibilityLabel={week
          .map(
            (d) =>
              `${weekdayLabel((d.date.getDay() === 0 ? 7 : d.date.getDay()) as never, 'long', i18n.language)}: ${t('common.minutes', { count: d.minutes })}`
          )
          .join(', ')}
      >
        {week.map((d) => {
          const h = d.minutes > 0 ? Math.max(10, (d.minutes / max) * BAR_MAX) : 0;
          return (
            <View key={d.key} style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
              {d.minutes > 0 ? (
                <Text variant="footnote" style={{ color: colors.forest }}>
                  {String(d.minutes)}
                </Text>
              ) : null}
              {h > 0 ? (
                <View
                  style={{
                    width: 22,
                    height: h,
                    borderRadius: 11,
                    backgroundColor: colors.leaf,
                    borderWidth: d.isToday ? 2 : 0,
                    borderColor: colors.forest,
                  }}
                />
              ) : (
                <View
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    marginBottom: 6,
                    backgroundColor: d.isFuture ? colors.hairline : colors.mint,
                    borderWidth: d.isToday ? 2 : 0,
                    borderColor: colors.leaf,
                  }}
                />
              )}
              <Text
                variant="footnote"
                className={d.isToday ? 'font-sans-bold' : 'font-sans-medium'}
                style={{ color: d.isToday ? colors.forest : colors.muted }}
              >
                {weekdayLabel(
                  (d.date.getDay() === 0 ? 7 : d.date.getDay()) as never,
                  'narrow',
                  i18n.language
                )}
              </Text>
            </View>
          );
        })}
      </View>
    </GlassCard>
  );
}
