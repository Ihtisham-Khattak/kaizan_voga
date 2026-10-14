import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Character } from '@/characters/character';
import { BottomSheet } from '@/components/bottom-sheet';
import { ProgressRing } from '@/components/progress-ring';
import { ScreenHeader } from '@/components/screen-header';
import { toast } from '@/components/toast';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { listAchievements, listChallenges, type Achievement } from '@/data/repo';
import { useT } from '@/i18n';
import { haptic } from '@/lib/haptics';
import { KaizenIcon, type KaizenIconName } from '@/icons';
import { useProgressStore } from '@/store/progress-store';
import { useTheme } from '@/theme/theme-provider';

/** Achievements (12 badges) and gentle challenges. Nothing here can be "failed" – only paused or picked up later. */
export default function AchievementsScreen() {
  const { t, i18n } = useT();
  const { colors, extras } = useTheme();
  const insets = useSafeAreaInsets();
  const unlocked = useProgressStore((s) => s.achievementsUnlocked);
  const challenges = useProgressStore((s) => s.challenges);
  const paused = useProgressStore((s) => s.challengesPaused);
  const { joinChallenge, togglePauseChallenge, logChallengeDay } = useProgressStore();
  const [open, setOpen] = useState<Achievement | null>(null);

  const all = listAchievements();
  const count = all.filter((a) => unlocked[a.id]).length;
  const fmt = (iso: string) =>
    new Intl.DateTimeFormat(i18n.language, { day: 'numeric', month: 'long', year: 'numeric' }).format(
      new Date(iso)
    );
  const loggedToday = (id: string) =>
    (challenges[id] ?? []).some((d) => new Date(d).toDateString() === new Date().toDateString());

  return (
    <View className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 32, gap: 24 }}>
        <ScreenHeader title={t('prog.ach.title')} subtitle={t('prog.ach.subtitle')} />

        <View className="gap-3 px-4">
          <Text variant="label">{t('prog.ach.unlocked', { count, total: all.length })}</Text>
          <View className="flex-row flex-wrap">
            {all.map((a) => {
              const on = Boolean(unlocked[a.id]);
              return (
                <View key={a.id} style={{ width: '33.333%' }} className="items-center px-1 pb-4">
                  <Pressable
                    onPress={() => {
                      haptic.select();
                      setOpen(a);
                    }}
                    accessibilityRole="button"
                    accessibilityLabel={`${a.title}. ${on ? t('prog.ach.earnedOn', { date: fmt(unlocked[a.id]) }) : t('prog.ach.locked')}`}
                    className="items-center gap-2"
                  >
                    <View
                      style={{
                        width: 72,
                        height: 72,
                        borderRadius: 36,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: on ? colors.leaf : 'transparent',
                        borderWidth: on ? 0 : 2,
                        borderStyle: 'dashed',
                        borderColor: colors.hairline,
                      }}
                    >
                      <KaizenIcon
                        name={a.icon as KaizenIconName}
                        size={34}
                        color={on ? extras.onLeaf : colors.muted}
                        strokeWidth={on ? 2 : 1.5}
                      />
                    </View>
                    <Text
                      variant="caption"
                      className={`text-center ${on ? 'font-sans-semibold text-foreground' : ''}`}
                      numberOfLines={2}
                    >
                      {a.title}
                    </Text>
                  </Pressable>
                </View>
              );
            })}
          </View>
        </View>

        <View className="gap-3 px-4">
          <View>
            <Text variant="title" accessibilityRole="header">
              {t('prog.ach.challenges')}
            </Text>
            <Text variant="caption">{t('prog.ach.challengesSub')}</Text>
          </View>
          {listChallenges().map((c) => {
            const joined = challenges[c.id] !== undefined;
            const done = challenges[c.id]?.length ?? 0;
            const isPaused = Boolean(paused[c.id]);
            const finished = done >= c.days;
            return (
              <View key={c.id} className="gap-3 rounded-3xl border border-border bg-card p-4">
                <View className="flex-row items-center gap-4">
                  <ProgressRing
                    progress={done / c.days}
                    size={64}
                    strokeWidth={7}
                    color={c.cover === 'lavender' ? 'lavender' : c.cover === 'coral' ? 'sunrise' : 'leaf'}
                    accessibilityLabel={t('prog.ach.ring', { done, days: c.days })}
                  >
                    <Text variant="label">{done}</Text>
                  </ProgressRing>
                  <View className="flex-1 gap-1">
                    <Text variant="heading">{c.title}</Text>
                    <Text variant="caption">{c.description}</Text>
                  </View>
                </View>
                {joined ? (
                  <Text variant="caption" className="font-sans-semibold">
                    {finished
                      ? t('prog.ach.complete')
                      : isPaused
                        ? t('prog.ach.paused')
                        : t('prog.ach.progress', { done, days: c.days })}
                  </Text>
                ) : null}
                <View className="flex-row flex-wrap gap-2">
                  {!joined ? (
                    <Button onPress={() => joinChallenge(c.id)}>
                      <Text>{t('prog.ach.join')}</Text>
                    </Button>
                  ) : finished ? null : (
                    <>
                      <Button
                        disabled={isPaused || loggedToday(c.id)}
                        onPress={() => {
                          logChallengeDay(c.id);
                          toast.success(t('prog.ach.loggedToday'));
                        }}
                      >
                        <Text>{loggedToday(c.id) ? t('prog.ach.loggedToday') : t('prog.ach.logToday')}</Text>
                      </Button>
                      <Button variant="secondary" onPress={() => togglePauseChallenge(c.id)}>
                        <Text>{isPaused ? t('prog.ach.resume') : t('prog.ach.pause')}</Text>
                      </Button>
                    </>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      <BottomSheet visible={open !== null} onClose={() => setOpen(null)} title={open?.title}>
        {open ? (
          <View className="gap-3">
            <View className="items-center">
              {unlocked[open.id] ? (
                <Character name="kai" pose="celebrate" mood="happy" size={110} />
              ) : (
                <View className="size-20 items-center justify-center rounded-full border-2 border-dashed border-border">
                  <KaizenIcon
                    name={open.icon as KaizenIconName}
                    size={36}
                    color={colors.muted}
                    strokeWidth={1.5}
                  />
                </View>
              )}
            </View>
            <Text variant="body" className="text-center">
              {open.description}
            </Text>
            <View className="gap-1 rounded-2xl bg-secondary/60 p-3">
              <Text variant="label">{t('prog.ach.how')}</Text>
              <Text variant="caption">{open.criteria}</Text>
            </View>
            {unlocked[open.id] ? (
              <>
                <Text variant="body" className="text-center font-sans-semibold">
                  {open.kaiMessage}
                </Text>
                <Text variant="caption" className="text-center">
                  {t('prog.ach.earnedOn', { date: fmt(unlocked[open.id]) })}
                </Text>
              </>
            ) : (
              <Text variant="caption" className="text-center">
                {t('prog.ach.locked')}
              </Text>
            )}
          </View>
        ) : null}
      </BottomSheet>
    </View>
  );
}
