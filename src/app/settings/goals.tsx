import { router, type Href } from 'expo-router';
import { ArrowsClockwise, PlayCircle } from 'phosphor-react-native';
import { useState } from 'react';
import { View } from 'react-native';

import { BottomSheet } from '@/components/bottom-sheet';
import { toast } from '@/components/toast';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { GoalsPicker } from '@/features/onboarding/goals-picker';
import { DayPicker, Group, Row, Segmented, SettingsScreen } from '@/features/settings/ui';
import { useT } from '@/i18n';
import { haptic } from '@/lib/haptics';
import { useAppStore } from '@/store/app-store';
import { usePrefsStore } from '@/store/prefs-store';
import type { Experience, PreferredTime, Weekday } from '@/store/types';

/** Edit goals & plan with the same cards as onboarding. Changes save instantly; refreshing the 30-day path asks first. */
export default function GoalsScreen() {
  const { t } = useT();
  const prefs = usePrefsStore();
  const restartJourney = useAppStore((s) => s.restartJourney);
  const replayIntro = useAppStore((s) => s.replayIntro);
  const [sheet, setSheet] = useState<null | 'plan' | 'replay'>(null);

  const toggleDay = (d: Weekday) => {
    haptic.select();
    const days = prefs.practiceDays.includes(d)
      ? prefs.practiceDays.filter((x) => x !== d)
      : [...prefs.practiceDays, d].sort();
    if (days.length) prefs.patch({ practiceDays: days as Weekday[] });
  };

  return (
    <SettingsScreen title={t('pf.goals.title')} subtitle={t('pf.goals.subtitle')}>
      <View className="gap-3 px-4">
        <Text variant="heading" accessibilityRole="header">
          {t('pf.goals.goals')}
        </Text>
        <GoalsPicker />
      </View>

      <Group>
        <Segmented<Experience>
          first
          label={t('pf.goals.experience')}
          value={prefs.experience ?? 'beginner'}
          onChange={(experience) => prefs.patch({ experience })}
          options={(['beginner', 'some', 'experienced'] as const).map((v) => ({
            id: v,
            label: t(`pf.goals.experienceOpts.${v}`),
          }))}
        />
        <Segmented<5 | 10 | 15 | 20>
          label={t('pf.goals.time')}
          value={prefs.minutesPerDay}
          onChange={(minutesPerDay) => prefs.patch({ minutesPerDay })}
          options={([5, 10, 15, 20] as const).map((m) => ({
            id: m,
            label: t('common.minutes', { count: m }),
          }))}
        />
        <Segmented<PreferredTime>
          label={t('pf.goals.when')}
          value={prefs.preferredTime ?? 'varies'}
          onChange={(preferredTime) => prefs.patch({ preferredTime })}
          options={(['morning', 'afternoon', 'evening', 'varies'] as const).map((v) => ({
            id: v,
            label: t(`pf.profile.timeOf.${v}`),
          }))}
        />
        <DayPicker label={t('pf.goals.days')} value={prefs.practiceDays} onToggle={toggleDay} />
      </Group>

      <Group>
        <Row
          first
          icon={ArrowsClockwise}
          label={t('pf.goals.regenerate')}
          sub={t('pf.goals.regenerateSub')}
          onPress={() => setSheet('plan')}
        />
        <Row icon={PlayCircle} label={t('pf.profile.replay')} onPress={() => setSheet('replay')} />
      </Group>

      <BottomSheet visible={sheet === 'plan'} onClose={() => setSheet(null)} title={t('pf.goals.regenTitle')}>
        <Text variant="body">{t('pf.goals.regenBody')}</Text>
        <Button
          size="lg"
          onPress={() => {
            setSheet(null);
            restartJourney();
            toast.success(t('pf.goals.regenDone'));
          }}
        >
          <Text>{t('pf.goals.regenCta')}</Text>
        </Button>
        <Button variant="ghost" onPress={() => setSheet(null)}>
          <Text>{t('common.cancel')}</Text>
        </Button>
      </BottomSheet>

      <BottomSheet
        visible={sheet === 'replay'}
        onClose={() => setSheet(null)}
        title={t('pf.profile.replayTitle')}
      >
        <Text variant="body">{t('pf.profile.replayBody')}</Text>
        <Button
          size="lg"
          onPress={() => {
            setSheet(null);
            replayIntro();
            router.replace('/story' as Href);
          }}
        >
          <Text>{t('pf.profile.replayCta')}</Text>
        </Button>
        <Button variant="ghost" onPress={() => setSheet(null)}>
          <Text>{t('common.cancel')}</Text>
        </Button>
      </BottomSheet>
    </SettingsScreen>
  );
}
