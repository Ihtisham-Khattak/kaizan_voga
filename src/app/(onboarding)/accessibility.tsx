import { router } from 'expo-router';
import { Pressable, View } from 'react-native';

import { FadeUp } from '@/components/fade-up';
import { SafetyNotice } from '@/components/safety-notice';
import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';
import { PersonalizationShell } from '@/features/onboarding/shell';
import { useT } from '@/i18n';
import { usePrefsStore } from '@/store/prefs-store';
import type { Limitation } from '@/store/types';

const OPTIONS: Limitation[] = ['balance', 'knee', 'wrist', 'chair-only', 'avoid-floor'];

/**
 * Onboarding Q6 — optional accessibility / gentleness preferences. Never a medical form: plain language,
 * explains why we ask, and stays on the device. Fully skippable.
 */
export default function AccessibilityScreen() {
  const { t } = useT();
  const limitations = usePrefsStore((s) => s.limitations);
  const patch = usePrefsStore((s) => s.patch);

  const toggle = (l: Limitation, on: boolean) => {
    const next = on ? [...limitations, l] : limitations.filter((x) => x !== l);
    patch({ limitations: next, ...(l === 'chair-only' ? { chairMode: on } : null) });
  };

  return (
    <PersonalizationShell
      step="accessibility"
      title={t('onboardingQ.accessibility.title')}
      subtitle={t('onboardingQ.accessibility.subtitle')}
      reaction={limitations.length > 0 ? t('onboardingQ.accessibility.reaction') : null}
    >
      <FadeUp delay={100}>
        <SafetyNotice title={t('onboardingQ.accessibility.whyTitle')} lines={[t('onboardingQ.accessibility.whyBody')]}>
          <Pressable onPress={() => router.push('/settings/privacy')} accessibilityRole="link" className="min-h-11 justify-center">
            <Text variant="label" className="text-primary underline">
              {t('onboardingQ.accessibility.learnMore')}
            </Text>
          </Pressable>
        </SafetyNotice>
      </FadeUp>

      <View className="bg-card border-border overflow-hidden rounded-card border" role="group">
        {OPTIONS.map((l, i) => (
          <FadeUp key={l} delay={200 + i * 60} distance={10}>
            <View className={i > 0 ? 'border-border border-t' : undefined}>
              <View className="min-h-16 flex-row items-center gap-3 px-4 py-3">
                <Text variant="body" className="flex-1">
                  {t(`onboardingQ.accessibility.${l}`)}
                </Text>
                <Switch
                  checked={limitations.includes(l)}
                  onCheckedChange={(on) => toggle(l, on)}
                  accessibilityLabel={t(`onboardingQ.accessibility.${l}`)}
                />
              </View>
            </View>
          </FadeUp>
        ))}
      </View>
    </PersonalizationShell>
  );
}
