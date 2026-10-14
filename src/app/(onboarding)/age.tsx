import { router } from 'expo-router';
import { View } from 'react-native';

import { Character } from '@/characters/character';
import { FadeUp } from '@/components/fade-up';
import { Text } from '@/components/ui/text';
import { PersonalizationShell } from '@/features/onboarding/shell';
import { goNext } from '@/features/onboarding/steps';
import { useT } from '@/i18n';
import { useAppStore } from '@/store/app-store';

/** Onboarding Q8 — age confirmation (18+). Required: no Skip. We never collect a birthdate. */
export default function AgeScreen() {
  const { t } = useT();
  return (
    <PersonalizationShell
      step="age"
      title={t('onboardingR.age.title')}
      continueLabel={t('onboardingR.age.confirm')}
      onContinue={() => {
        useAppStore.getState().confirmAge();
        goNext('age');
      }}
      secondary={{ label: t('onboardingR.age.under'), onPress: () => router.push('/under-18') }}
    >
      <View className="items-center gap-6 pt-6">
        <Character name="kai" pose="float" mood="calm" size={190} />
        <FadeUp delay={200}>
          <Text variant="lead" className="max-w-[300px] text-center">
            {t('onboardingR.age.body')}
          </Text>
        </FadeUp>
      </View>
    </PersonalizationShell>
  );
}
