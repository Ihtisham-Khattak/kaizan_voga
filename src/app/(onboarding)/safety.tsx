import { Heartbeat, HandPalm, Stethoscope } from 'phosphor-react-native';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { Character } from '@/characters/character';
import { FadeUp } from '@/components/fade-up';
import { Checkbox } from '@/components/ui/checkbox';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { PersonalizationShell } from '@/features/onboarding/shell';
import { goNext } from '@/features/onboarding/steps';
import { useT } from '@/i18n';
import { useAppStore } from '@/store/app-store';

const ROWS = [
  { key: 'stop', icon: HandPalm },
  { key: 'professional', icon: Stethoscope },
  { key: 'notMedical', icon: Heartbeat },
] as const;

/** Onboarding Q9 — safety notice. Required: Continue stays disabled until "I understand" is ticked. */
export default function SafetyScreen() {
  const { t } = useT();
  const [checked, setChecked] = useState(() => !!useAppStore.getState().safetyAcknowledgedAt);

  return (
    <PersonalizationShell
      step="safety"
      title={t('onboardingR.safety.title')}
      subtitle={t('onboardingR.safety.subtitle')}
      canContinue={checked}
      onContinue={() => {
        useAppStore.getState().acknowledgeSafety();
        goNext('safety');
      }}
    >
      <View className="items-center">
        <Character name="kai" pose="float" mood="calm" size={120} />
      </View>

      <View className="gap-4 rounded-card border border-danger/30 bg-bgMist p-6">
        {ROWS.map((r, i) => (
          <FadeUp key={r.key} delay={150 + i * 120} distance={10} className="flex-row items-start gap-3">
            <View className="size-10 items-center justify-center rounded-full bg-mint">
              <Icon as={r.icon} size={22} weight="duotone" className="text-primary" />
            </View>
            <Text variant="body" className="flex-1">
              {t(`onboardingR.safety.${r.key}`)}
            </Text>
          </FadeUp>
        ))}
      </View>

      <View className="flex-row items-center gap-3">
        <Checkbox
          checked={checked}
          onCheckedChange={setChecked}
          accessibilityLabel={t('onboardingR.safety.understand')}
          accessibilityHint={t('onboardingR.safety.hint')}
        />
        <Pressable
          onPress={() => setChecked((c) => !c)}
          className="min-h-11 flex-1 justify-center"
          accessibilityRole="button"
        >
          <Text variant="bodyLarge" className="font-sans-semibold">
            {t('onboardingR.safety.understand')}
          </Text>
        </Pressable>
      </View>
      {!checked ? <Text variant="caption">{t('onboardingR.safety.hint')}</Text> : null}
    </PersonalizationShell>
  );
}
