import { router, type Href } from 'expo-router';
import { Lifebuoy } from 'phosphor-react-native';
import { View } from 'react-native';

import { SafetyNotice } from '@/components/safety-notice';
import { Text } from '@/components/ui/text';
import { Group, Row, SettingsScreen } from '@/features/settings/ui';
import { useT } from '@/i18n';

const POINTS = ['safety1', 'safety2', 'safety3', 'safety4', 'safety5'] as const;

/** Safety information. Always free, always reachable (Profile, onboarding, session screens). */
export default function SafetyScreen() {
  const { t } = useT();
  return (
    <SettingsScreen title={t('pf.info.safetyTitle')} subtitle={t('pf.info.safetyFree')}>
      <View className="px-4">
        <SafetyNotice
          variant="full"
          title={t('pf.info.safetyIntro')}
          lines={POINTS.map((k) => t(`pf.info.${k}`))}
        />
      </View>
      <View className="px-4">
        <Text variant="body" className="text-muted-foreground">
          {t('pf.info.safetyHelp')}
        </Text>
      </View>
      <Group>
        <Row
          first
          icon={Lifebuoy}
          label={t('pf.support.title')}
          onPress={() => router.push('/support/resources' as Href)}
        />
      </Group>
    </SettingsScreen>
  );
}
