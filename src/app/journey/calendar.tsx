import { router, type Href } from 'expo-router';
import { CaretLeft, CaretRight, Moon } from 'phosphor-react-native';
import { useState } from 'react';
import { I18nManager, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomSheet } from '@/components/bottom-sheet';
import { ScreenHeader } from '@/components/screen-header';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { SessionRow } from '@/features/progress/session-row';
import { KaizenIcon } from '@/icons';
import { useT } from '@/i18n';
import { haptic } from '@/lib/haptics';
import { isSameDay } from '@/lib/journey';
import { dayKey } from '@/lib/stats';
import { weekdayLabel, weekdayOrder } from '@/lib/weekdays';
import { usePrefsStore } from '@/store/prefs-store';
import { useProgressStore } from '@/store/progress-store';
import type { Weekday } from '@/store/types';
import { useTheme } from '@/theme/theme-provider';

function Legend({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <View className="flex-row items-center gap-2">
      {children}
      <Text variant="caption">{label}</Text>
    </View>
  );
}

/** Month calendar. Practised days are sage leaves; rest days are quiet moons. There is no "missed" state at all. */
export default function CalendarScreen() {
  const { t, i18n } = useT();
  const { colors, extras } = useTheme();
  const insets = useSafeAreaInsets();
  const sessions = useProgressStore((s) => s.sessions);
  const practiceDays = usePrefsStore((s) => s.practiceDays);
  const today = new Date();
  const [month, setMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [picked, setPicked] = useState<Date | null>(null);

  const order = weekdayOrder();
  const first = month;
  const lead = (() => {
    const iso = (first.getDay() === 0 ? 7 : first.getDay()) as Weekday;
    return order.indexOf(iso);
  })();
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells: (Date | null)[] = [
    ...Array.from({ length: lead }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(month.getFullYear(), month.getMonth(), i + 1)),
  ];

  const byDay = new Map<string, typeof sessions>();
  for (const s of sessions) {
    if (s.practicedSec <= 0) continue;
    const k = dayKey(new Date(s.at));
    byDay.set(k, [...(byDay.get(k) ?? []), s]);
  }
  const practicedThisMonth = cells.filter((d) => d && byDay.has(dayKey(d))).length;
  const atCurrentMonth = month.getFullYear() === today.getFullYear() && month.getMonth() === today.getMonth();
  const monthLabel = new Intl.DateTimeFormat(i18n.language, { month: 'long', year: 'numeric' }).format(month);
  const dayLabel = (d: Date) =>
    new Intl.DateTimeFormat(i18n.language, { weekday: 'long', day: 'numeric', month: 'long' }).format(d);
  const shift = (n: number) => {
    haptic.select();
    setMonth(new Date(month.getFullYear(), month.getMonth() + n, 1));
  };
  const rtl = I18nManager.isRTL;
  const pickedSessions = picked ? (byDay.get(dayKey(picked)) ?? []) : [];
  const pickedRest = picked
    ? !practiceDays.includes((picked.getDay() === 0 ? 7 : picked.getDay()) as Weekday)
    : false;

  return (
    <View className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 32, gap: 16 }}>
        <ScreenHeader title={t('prog.calendar.title')} subtitle={t('prog.calendar.rest')} />

        <View className="mx-4 gap-3 rounded-3xl border border-border bg-card p-4">
          <View className="flex-row items-center justify-between">
            <Pressable
              onPress={() => shift(-1)}
              accessibilityRole="button"
              accessibilityLabel={t('prog.calendar.prev')}
              className="size-11 items-center justify-center rounded-full bg-secondary"
            >
              <Icon as={rtl ? CaretRight : CaretLeft} size={20} className="text-secondary-foreground" />
            </Pressable>
            <Text variant="heading" accessibilityRole="header" accessibilityLiveRegion="polite">
              {monthLabel}
            </Text>
            <Pressable
              onPress={() => shift(1)}
              disabled={atCurrentMonth}
              accessibilityRole="button"
              accessibilityLabel={t('prog.calendar.next')}
              accessibilityState={{ disabled: atCurrentMonth }}
              className={`size-11 items-center justify-center rounded-full bg-secondary ${atCurrentMonth ? 'opacity-40' : ''}`}
            >
              <Icon as={rtl ? CaretLeft : CaretRight} size={20} className="text-secondary-foreground" />
            </Pressable>
          </View>

          <View className="flex-row">
            {order.map((iso) => (
              <View key={iso} className="flex-1 items-center py-1">
                <Text variant="caption" accessibilityLabel={weekdayLabel(iso, 'long', i18n.language)}>
                  {weekdayLabel(iso, 'narrow', i18n.language)}
                </Text>
              </View>
            ))}
          </View>

          <View className="flex-row flex-wrap">
            {cells.map((d, i) => {
              if (!d) return <View key={`b${i}`} style={{ width: `${100 / 7}%`, height: 48 }} />;
              const sess = byDay.get(dayKey(d));
              const isToday = isSameDay(d, today);
              const future = d > today && !isToday;
              const iso = (d.getDay() === 0 ? 7 : d.getDay()) as Weekday;
              const rest = !sess && !practiceDays.includes(iso) && !future;
              const state = sess ? 'Practiced' : isToday ? 'Today' : rest ? 'Rest' : 'Plain';
              return (
                <View
                  key={dayKey(d)}
                  style={{ width: `${100 / 7}%`, height: 48 }}
                  className="items-center justify-center"
                >
                  <Pressable
                    disabled={future}
                    onPress={() => {
                      haptic.select();
                      setPicked(d);
                    }}
                    accessibilityRole="button"
                    accessibilityLabel={t(`prog.calendar.day${state}`, { date: dayLabel(d) })}
                    accessibilityState={{ disabled: future }}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: sess ? colors.leaf : rest ? colors.mint : 'transparent',
                      borderWidth: isToday ? 2.5 : 0,
                      borderColor: colors.primary,
                      opacity: future ? 0.35 : 1,
                    }}
                  >
                    {sess ? (
                      <KaizenIcon name="leaf" size={18} color={extras.onLeaf} strokeWidth={2} />
                    ) : rest ? (
                      <Icon as={Moon} size={16} weight="duotone" className="text-muted-foreground" />
                    ) : (
                      <Text variant="caption" className={isToday ? 'font-sans-bold text-foreground' : ''}>
                        {d.getDate()}
                      </Text>
                    )}
                  </Pressable>
                </View>
              );
            })}
          </View>

          <View className="flex-row flex-wrap justify-center gap-x-5 gap-y-2 pt-1">
            <Legend label={t('prog.calendar.legendPracticed')}>
              <View className="size-5 items-center justify-center rounded-full bg-leaf">
                <KaizenIcon name="leaf" size={11} color={extras.onLeaf} strokeWidth={2} />
              </View>
            </Legend>
            <Legend label={t('prog.calendar.legendRest')}>
              <View className="size-5 items-center justify-center rounded-full bg-secondary">
                <Icon as={Moon} size={11} weight="duotone" className="text-muted-foreground" />
              </View>
            </Legend>
            <Legend label={t('prog.calendar.legendToday')}>
              <View className="size-5 rounded-full border-2 border-primary" />
            </Legend>
          </View>
        </View>

        <Text variant="body" className="px-6 text-center font-sans-semibold">
          {practicedThisMonth === 1
            ? t('prog.calendar.practicedOne')
            : t('prog.calendar.practiced', { count: practicedThisMonth })}
        </Text>
      </ScrollView>

      <BottomSheet
        visible={picked !== null}
        onClose={() => setPicked(null)}
        title={picked ? dayLabel(picked) : ''}
      >
        {pickedSessions.length ? (
          pickedSessions.map((s) => (
            <SessionRow
              key={s.id}
              session={s}
              onPress={() => {
                setPicked(null);
                router.push(`/journey/session/${s.id}` as Href);
              }}
            />
          ))
        ) : (
          <View className="items-center gap-2 py-2">
            {pickedRest ? (
              <Icon as={Moon} size={32} weight="duotone" className="text-muted-foreground" />
            ) : null}
            <Text variant="body" className="text-center">
              {pickedRest
                ? `${t('prog.calendar.restDay')}. ${t('prog.calendar.rest')}`
                : t('prog.calendar.none')}
            </Text>
          </View>
        )}
      </BottomSheet>
    </View>
  );
}
