import * as Notifications from 'expo-notifications';
import { Linking, Platform, Pressable, View } from 'react-native';
import { BellRinging, BellSlash, Leaf, MoonStars } from 'phosphor-react-native';
import { useEffect, useState } from 'react';

import { toast } from '@/components/toast';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { DayPicker, Group, Segmented, SettingsScreen, SwitchRow, TimeStepper } from '@/features/settings/ui';
import { useT } from '@/i18n';
import { formatClock } from '@/lib/format';
import { haptic } from '@/lib/haptics';
import { usePrefsStore } from '@/store/prefs-store';
import type { ReminderSettings, Weekday } from '@/store/types';

type Permission = 'unknown' | 'granted' | 'denied';

async function currentPermission(): Promise<Permission> {
  if (Platform.OS === 'web') return 'granted';
  try {
    const res = await Notifications.getPermissionsAsync();
    return res.granted ? 'granted' : res.canAskAgain ? 'unknown' : 'denied';
  } catch {
    return 'unknown';
  }
}

async function askPermission(): Promise<Permission> {
  if (Platform.OS === 'web') return 'granted';
  try {
    const res = await Notifications.requestPermissionsAsync();
    return res.granted ? 'granted' : 'denied';
  } catch {
    return 'denied';
  }
}

/** Reminders: one soft daily nudge, your days, quiet hours, and a preview of how it will look. Scheduling is FN-07. */
export default function RemindersScreen() {
  const { t, i18n } = useT();
  const reminder = usePrefsStore((s) => s.reminder);
  const patch = usePrefsStore((s) => s.patch);
  const [permission, setPermission] = useState<Permission>('unknown');
  const update = (p: Partial<ReminderSettings>) => patch({ reminder: { ...reminder, ...p } });

  useEffect(() => {
    currentPermission().then(setPermission);
  }, []);

  const toggle = async (on: boolean) => {
    if (!on) return update({ enabled: false });
    const result = permission === 'granted' ? 'granted' : await askPermission();
    setPermission(result);
    update({ enabled: result === 'granted' });
  };

  const toggleDay = (d: Weekday) => {
    haptic.select();
    const days = reminder.days.includes(d)
      ? reminder.days.filter((x) => x !== d)
      : [...reminder.days, d].sort();
    update({ days });
  };

  const tone = reminder.tone ?? 'bell';
  const enabled = reminder.enabled;

  return (
    <SettingsScreen title={t('pf.rem.title')} subtitle={t('pf.rem.subtitle')}>
      {permission === 'denied' ? (
        <View className="mx-4 gap-2 rounded-3xl border border-hairline bg-skySoft p-4">
          <View className="flex-row items-center gap-2">
            <Icon as={BellSlash} size={22} weight="duotone" className="text-foreground" />
            <Text variant="heading" className="flex-1">
              {t('pf.rem.deniedTitle')}
            </Text>
          </View>
          <Text variant="body">{t('pf.rem.deniedBody')}</Text>
          <Button variant="secondary" onPress={() => Linking.openSettings().catch(() => {})}>
            <Text>{t('pf.rem.openSettings')}</Text>
          </Button>
        </View>
      ) : null}

      <Group>
        <SwitchRow
          first
          icon={BellRinging}
          label={t('pf.rem.enable')}
          sub={t('pf.rem.enableSub')}
          value={enabled}
          onChange={toggle}
        />
      </Group>

      <View className={enabled ? 'gap-5' : 'gap-5 opacity-50'} pointerEvents={enabled ? 'auto' : 'none'}>
        <Group>
          <TimeStepper
            first
            label={t('pf.rem.time')}
            value={reminder.time}
            onChange={(time) => update({ time })}
          />
          <DayPicker label={t('pf.rem.days')} value={reminder.days} onToggle={toggleDay} />
        </Group>

        <Group>
          <SwitchRow
            first
            icon={MoonStars}
            label={t('pf.rem.quiet')}
            sub={`${t('pf.rem.quietSub')} ${formatClock(reminder.quietHours.from, i18n.language)} – ${formatClock(reminder.quietHours.to, i18n.language)}`}
            value={reminder.quietHours.enabled}
            onChange={(v) => update({ quietHours: { ...reminder.quietHours, enabled: v } })}
          />
          {reminder.quietHours.enabled ? (
            <>
              <TimeStepper
                label={t('pf.rem.from')}
                value={reminder.quietHours.from}
                onChange={(from) => update({ quietHours: { ...reminder.quietHours, from } })}
              />
              <TimeStepper
                label={t('pf.rem.to')}
                value={reminder.quietHours.to}
                onChange={(to) => update({ quietHours: { ...reminder.quietHours, to } })}
              />
            </>
          ) : null}
        </Group>

        <Group>
          <Segmented
            first
            label={t('pf.rem.tone')}
            value={tone}
            onChange={(v) => update({ tone: v })}
            options={[
              { id: 'bell', label: t('pf.rem.toneBell') },
              { id: 'chime', label: t('pf.rem.toneChime') },
              { id: 'soft', label: t('pf.rem.toneSoft') },
            ]}
          />
        </Group>
      </View>

      <View className="gap-2 px-4">
        <Text variant="label" accessibilityRole="header" className="px-1 text-muted-foreground">
          {t('pf.rem.preview')}
        </Text>
        <View
          accessible
          accessibilityLabel={`${t('common.appName')}, ${t('pf.rem.previewBody')}`}
          className="flex-row items-start gap-3 rounded-3xl bg-secondary/80 p-4"
        >
          <View className="size-11 items-center justify-center rounded-2xl bg-primary">
            <Icon as={Leaf} size={24} weight="fill" className="text-primary-foreground" />
          </View>
          <View className="flex-1 gap-0.5">
            <View className="flex-row justify-between">
              <Text variant="label">{t('common.appName')}</Text>
              <Text variant="caption">{t('pf.rem.now')}</Text>
            </View>
            <Text variant="body">{t('pf.rem.previewBody')}</Text>
          </View>
        </View>
        <Pressable
          onPress={() => toast.info(t('pf.rem.testSent'))}
          accessibilityRole="button"
          className="min-h-11 items-center justify-center"
        >
          <Text variant="label" className="text-primary underline">
            {t('pf.rem.test')}
          </Text>
        </Pressable>
      </View>
    </SettingsScreen>
  );
}
