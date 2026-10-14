import Constants from 'expo-constants';
import { View } from 'react-native';

import { LotusLogo } from '@/characters/props';
import { Text } from '@/components/ui/text';
import { SettingsScreen } from '@/features/settings/ui';
import { useT } from '@/i18n';

/** About: version, a line on the name, credits and the illustrated-characters disclaimer. */
export default function AboutScreen() {
  const { t } = useT();
  const version = Constants.expoConfig?.version ?? '1.0.0';
  return (
    <SettingsScreen title={t('pf.info.aboutTitle')}>
      <View className="items-center gap-3 px-6">
        <LotusLogo size={104} />
        <Text variant="title">{t('common.appName')}</Text>
        <Text variant="caption">{t('pf.info.aboutVersion', { version })}</Text>
        <Text variant="body" className="text-center">
          {t('pf.info.aboutBody')}
        </Text>
        <Text variant="body" className="text-center text-muted-foreground">
          {t('pf.info.aboutCredits')}
        </Text>
      </View>
      <View className="mx-4 rounded-3xl bg-secondary/60 p-4">
        <Text variant="caption" className="text-center">
          {t('pf.info.aboutDisclaimer')}
        </Text>
      </View>
    </SettingsScreen>
  );
}
