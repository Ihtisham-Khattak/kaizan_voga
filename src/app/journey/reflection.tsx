import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Character } from '@/characters/character';
import { ScreenHeader } from '@/components/screen-header';
import { toast } from '@/components/toast';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { ScaleInput } from '@/features/progress/scale-input';
import { useT } from '@/i18n';
import { journeyDay } from '@/lib/journey';
import { useAppStore } from '@/store/app-store';
import { useProgressStore } from '@/store/progress-store';
import type { MonthlyReflection, Mood, Score } from '@/store/types';

const KEYS = ['stress', 'sleep', 'energy', 'stiffness'] as const;
type Key = (typeof KEYS)[number];
// For stress and stiffness a LOWER number is the better direction; for sleep and energy a higher one is.
const LOWER_IS_BETTER: Record<Key, boolean> = { stress: true, sleep: false, energy: false, stiffness: true };

const wellbeing = (r: MonthlyReflection) =>
  KEYS.reduce((n, k) => n + (LOWER_IS_BETTER[k] ? 6 - r[k] : r[k]), 0) / KEYS.length;
const zaraMood = (r: MonthlyReflection): Mood => {
  const w = wellbeing(r);
  return w >= 4 ? 'happy' : w >= 3.2 ? 'calm' : w >= 2.4 ? 'neutral' : 'stressed';
};

function Half({ title, r, day }: { title: string; r: MonthlyReflection; day: string }) {
  const { t } = useT();
  return (
    <View className="flex-1 items-center gap-1 p-3">
      <Text variant="label" className="uppercase tracking-wide">
        {title}
      </Text>
      <Text variant="caption">{day}</Text>
      <Character name="zara" crop="bust" mood={zaraMood(r)} size={96} animated={false} />
      {KEYS.map((k) => (
        <Text key={k} variant="caption" className="text-center">
          {`${t(`prog.reflection.short.${k}`)}: ${r[k]} / 5`}
        </Text>
      ))}
    </View>
  );
}

/** Monthly self-check (stress, sleep, energy, stiffness) and a before/now comparison once there is something to compare. */
export default function ReflectionScreen() {
  const { t, i18n } = useT();
  const insets = useSafeAreaInsets();
  const startedAt = useAppStore((s) => s.journeyStartedAt);
  const reflections = useProgressStore((s) => s.reflections);
  const addReflection = useProgressStore((s) => s.addReflection);
  const day = journeyDay(startedAt);
  const [scores, setScores] = useState<Record<Key, Score>>({ stress: 3, sleep: 3, energy: 3, stiffness: 3 });

  const ordered = [...reflections].sort((a, b) => a.at.localeCompare(b.at));
  const before = ordered[0];
  const now = ordered[ordered.length - 1];
  const compare = ordered.length >= 2;
  const better = compare && wellbeing(now) >= wellbeing(before);
  const fmt = (iso: string) =>
    new Intl.DateTimeFormat(i18n.language, { day: 'numeric', month: 'short' }).format(new Date(iso));

  const save = () => {
    addReflection({ id: `r${Date.now().toString(36)}`, at: new Date().toISOString(), day, ...scores });
    toast.success(t('prog.reflection.saved'));
  };

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 32, gap: 16 }}
        keyboardShouldPersistTaps="handled"
      >
        <ScreenHeader title={t('prog.reflection.title')} subtitle={t('prog.reflection.subtitle')} />

        {day >= 30 ? (
          <View className="mx-4 rounded-3xl bg-secondary/70 p-4">
            <Text variant="heading">{t('prog.reflection.day30')}</Text>
            <Text variant="body">{t('prog.reflection.day30Body')}</Text>
          </View>
        ) : null}

        {compare ? (
          <View className="mx-4 gap-3">
            <Text variant="heading" accessibilityRole="header">
              {t('prog.reflection.split')}
            </Text>
            <View className="overflow-hidden rounded-3xl border border-border bg-card">
              <View className="flex-row">
                <Half title={t('prog.reflection.beforeLabel')} r={before} day={fmt(before.at)} />
                <View className="w-px bg-border" />
                <Half title={t('prog.reflection.nowLabel')} r={now} day={fmt(now.at)} />
              </View>
              <View className="flex-row items-center gap-3 border-t border-border bg-secondary/50 p-3">
                <Character
                  name="kai"
                  pose="float"
                  mood={better ? 'happy' : 'calm'}
                  size={56}
                  animated={false}
                />
                <Text variant="body" className="flex-1">
                  {better ? t('prog.reflection.kaiBetter') : t('prog.reflection.kaiSame')}
                </Text>
              </View>
            </View>
          </View>
        ) : reflections.length === 1 ? (
          <Text variant="caption" className="mx-4 text-center">
            {t('prog.reflection.firstNote')}
          </Text>
        ) : null}

        <View className="mx-4 gap-6 rounded-3xl border border-border bg-card p-4">
          {KEYS.map((k) => (
            <ScaleInput
              key={k}
              label={t(`prog.reflection.${k}`)}
              low={t(`prog.reflection.${k}Lo`)}
              high={t(`prog.reflection.${k}Hi`)}
              value={scores[k]}
              onChange={(v) => setScores((cur) => ({ ...cur, [k]: v }))}
            />
          ))}
          <Button size="lg" onPress={save}>
            <Text>{t('prog.reflection.save')}</Text>
          </Button>
          <Text variant="caption" className="text-center">
            {t('prog.reflection.private')}
          </Text>
        </View>

        {reflections.length ? (
          <View className="mx-4 gap-2">
            <Text variant="heading" accessibilityRole="header">
              {t('prog.reflection.history')}
            </Text>
            {reflections.map((r) => (
              <View
                key={r.id}
                className="flex-row items-center justify-between rounded-2xl border border-border bg-card px-4 py-3"
              >
                <View>
                  <Text variant="label">{fmt(r.at)}</Text>
                  <Text variant="caption">{t('prog.reflection.day', { day: r.day })}</Text>
                </View>
                <Text variant="caption">
                  {KEYS.map((k) => `${t(`prog.reflection.short.${k}`)} ${r[k]}`).join(' · ')}
                </Text>
              </View>
            ))}
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}
