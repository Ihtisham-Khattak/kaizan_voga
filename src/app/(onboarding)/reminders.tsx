import * as Notifications from 'expo-notifications';
import { Minus, Plus } from 'phosphor-react-native';
import { useEffect, useRef, useState } from 'react';
import { Platform, Pressable, View } from 'react-native';

import { Character } from '@/characters/character';
import { FadeUp } from '@/components/fade-up';
import { GlassCard } from '@/components/glass-card';
import { Icon } from '@/components/ui/icon';
import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';
import { PersonalizationShell } from '@/features/onboarding/shell';
import { goNext } from '@/features/onboarding/steps';
import { useT } from '@/i18n';
import { addMinutes, formatClock } from '@/lib/format';
import { haptic } from '@/lib/haptics';
import { suggestedReminderTime } from '@/lib/plan';
import { usePrefsStore } from '@/store/prefs-store';

/** Real OS permission prompt where supported; web/unsupported counts as granted so the UI flow still works. */
async function askPermission(): Promise<boolean> {
  if (Platform.OS === 'web') return true;
  try {
    const res = await Notifications.requestPermissionsAsync();
    return res.granted;
  } catch {
    return false;
  }
}

function StepButton({
  label,
  onPress,
  children,
}: {
  label: string;
  onPress: () => void;
  children: React.ReactNode;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={() => {
        haptic.select();
        onPress();
      }}
      className="size-11 items-center justify-center rounded-full bg-secondary active:opacity-80"
    >
      {children}
    </Pressable>
  );
}

/** Onboarding Q10 — gentle reminder pre-prompt (Kai with a soft bell). Scheduling itself is card FN-07. */
export default function RemindersScreen() {
  const { t, i18n } = useT();
  const reminder = usePrefsStore((s) => s.reminder);
  const preferred = usePrefsStore((s) => s.preferredTime);
  const patch = usePrefsStore((s) => s.patch);
  const [message, setMessage] = useState<string | null>(null);

  // start from a sensible time for the user's preferred time of day
  useEffect(() => {
    if (!reminder.enabled)
      patch({ reminder: { ...reminder, time: suggestedReminderTime[preferred ?? 'varies'] } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setTime = (time: string) => patch({ reminder: { ...reminder, time } });
  const locale = i18n.language;

  const busy = useRef(false);
  const yes = async () => {
    if (busy.current) return; // one tap is enough: ignore taps while the permission prompt is open
    busy.current = true;
    const granted = await askPermission();
    patch({ reminder: { ...reminder, enabled: granted } });
    setMessage(granted ? t('onboardingR.reminders.granted') : t('onboardingR.reminders.denied'));
    setTimeout(() => goNext('reminders'), 1400);
  };

  return (
    <PersonalizationShell
      step="reminders"
      title={t('onboardingR.reminders.title')}
      continueLabel={t('onboardingR.reminders.yes')}
      onContinue={yes}
      secondary={{ label: t('onboardingR.reminders.no'), onPress: () => goNext('reminders') }}
      reaction={message ?? undefined}
    >
      <View className="items-center gap-3">
        <Character name="kai" pose="bell" mood="happy" size={170} />
        <Text variant="body" className="max-w-[320px] text-center text-muted-foreground">
          {t('onboardingR.reminders.body')}
        </Text>
      </View>

      <FadeUp delay={200}>
        <GlassCard strong contentStyle={{ padding: 16, gap: 16 }}>
          <View className="flex-row items-center justify-between gap-3">
            <Text variant="label">{t('onboardingR.reminders.time')}</Text>
            <View className="flex-row items-center gap-3">
              <StepButton
                label={t('onboardingR.reminders.earlier')}
                onPress={() => setTime(addMinutes(reminder.time, -30))}
              >
                <Icon as={Minus} size={18} weight="bold" />
              </StepButton>
              <Text variant="heading" className="min-w-[88px] text-center" accessibilityLiveRegion="polite">
                {formatClock(reminder.time, locale)}
              </Text>
              <StepButton
                label={t('onboardingR.reminders.later')}
                onPress={() => setTime(addMinutes(reminder.time, 30))}
              >
                <Icon as={Plus} size={18} weight="bold" />
              </StepButton>
            </View>
          </View>
          <View className="h-px bg-hairline" />
          <View className="flex-row items-center gap-3">
            <View className="flex-1">
              <Text variant="label">{t('onboardingR.reminders.quiet')}</Text>
              <Text variant="caption">{`${formatClock(reminder.quietHours.from, locale)} – ${formatClock(reminder.quietHours.to, locale)}`}</Text>
            </View>
            <Switch
              checked={reminder.quietHours.enabled}
              onCheckedChange={(v) =>
                patch({ reminder: { ...reminder, quietHours: { ...reminder.quietHours, enabled: v } } })
              }
              accessibilityLabel={t('onboardingR.reminders.quiet')}
            />
          </View>
        </GlassCard>
      </FadeUp>
    </PersonalizationShell>
  );
}
