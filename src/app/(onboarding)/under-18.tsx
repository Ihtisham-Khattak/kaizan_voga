import { router } from 'expo-router';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Character } from '@/characters/character';
import { FadeUp } from '@/components/fade-up';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useT } from '@/i18n';

/** Polite information screen for under-18 visitors. No account is created; points to support resources. */
export default function Under18Screen() {
  const { t } = useT();
  const insets = useSafeAreaInsets();
  return (
    <View
      className="flex-1 items-center justify-center gap-6 bg-background px-8"
      style={{ paddingBottom: insets.bottom + 24 }}
    >
      <Character name="kai" pose="float" mood="tired" size={190} />
      <FadeUp delay={150} className="items-center gap-2">
        <Text variant="title" className="text-center">
          {t('onboardingR.age.underTitle')}
        </Text>
        <Text variant="body" className="text-center text-muted-foreground">
          {t('onboardingR.age.underBody')}
        </Text>
      </FadeUp>
      <FadeUp delay={350} className="w-full max-w-[380px] gap-2 pt-2">
        <Button size="lg" onPress={() => router.push('/support/resources')}>
          <Text>{t('onboardingR.age.resources')}</Text>
        </Button>
        <Button variant="ghost" onPress={() => router.back()}>
          <Text>{t('onboardingR.age.back')}</Text>
        </Button>
      </FadeUp>
    </View>
  );
}
