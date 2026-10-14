import { useState } from 'react';
import { View } from 'react-native';

import { Text } from '@/components/ui/text';
import { Group, Segmented, SettingsScreen } from '@/features/settings/ui';
import { useT } from '@/i18n';

type Doc = 'terms' | 'privacy';

/** Terms and Privacy viewers. Placeholder copy – replace with reviewed legal text before release. */
export default function TermsScreen() {
  const { t } = useT();
  const [doc, setDoc] = useState<Doc>('terms');
  return (
    <SettingsScreen title={t('pf.info.legalTitle')}>
      <Group>
        <Segmented<Doc>
          first
          label={t('pf.info.legalTitle')}
          value={doc}
          onChange={setDoc}
          options={[
            { id: 'terms', label: t('pf.info.terms') },
            { id: 'privacy', label: t('pf.info.privacy') },
          ]}
        />
      </Group>
      <View className="mx-4 gap-3 rounded-3xl border border-border bg-card p-6">
        <Text variant="title" accessibilityRole="header">
          {t(`pf.info.${doc}`)}
        </Text>
        <Text variant="caption" className="font-sans-semibold">
          {t('pf.info.legalPlaceholder')}
        </Text>
        {(['legal1', 'legal2', 'legal3'] as const).map((k) => (
          <Text key={k} variant="body">
            {t(`pf.info.${k}`)}
          </Text>
        ))}
      </View>
    </SettingsScreen>
  );
}
