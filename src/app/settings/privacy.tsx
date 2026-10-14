import { router, type Href } from 'expo-router';
import { ChartBar, DownloadSimple, Trash } from 'phosphor-react-native';
import { useState } from 'react';
import { View } from 'react-native';

import { BottomSheet } from '@/components/bottom-sheet';
import { toast } from '@/components/toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { Group, Row, SettingsScreen, SwitchRow } from '@/features/settings/ui';
import { useT } from '@/i18n';
import { resetAllStores, useAppStore } from '@/store';

const ITEMS = [
  { key: 'practice', device: false },
  { key: 'prefs', device: false },
  { key: 'mood', device: false },
  { key: 'limits', device: true },
  { key: 'account', device: false },
] as const;

/** Privacy & data: what we store and why, export, analytics opt-in, and a deliberate (typed) delete. */
export default function PrivacyScreen() {
  const { t } = useT();
  const analytics = useAppStore((s) => s.analytics);
  const setApp = useAppStore((s) => s.set);
  const [confirm, setConfirm] = useState(false);
  const [typed, setTyped] = useState('');
  const word = t('pf.privacy.confirmWord');
  const ready = typed.trim().toUpperCase() === word.toUpperCase();

  const wipe = () => {
    setConfirm(false);
    resetAllStores();
    toast.success(t('pf.privacy.deleted'));
    router.replace('/' as Href);
  };

  return (
    <SettingsScreen title={t('pf.privacy.title')} subtitle={t('pf.privacy.subtitle')} keyboard>
      <Group title={t('pf.privacy.store')}>
        {ITEMS.map((it, i) => (
          <Row
            key={it.key}
            first={i === 0}
            label={t(`pf.privacy.items.${it.key}.title`)}
            sub={`${t(`pf.privacy.items.${it.key}.body`)} · ${it.device ? t('pf.privacy.deviceOnly') : t('pf.privacy.synced')}`}
          />
        ))}
      </Group>

      <Group>
        <Row
          first
          icon={DownloadSimple}
          label={t('pf.privacy.export')}
          sub={t('pf.privacy.exportBody')}
          onPress={() => toast.info(t('pf.privacy.exportDone'))}
        />
        <SwitchRow
          icon={ChartBar}
          label={t('pf.privacy.analytics')}
          sub={t('pf.privacy.analyticsSub')}
          value={analytics}
          onChange={(v) => setApp({ analytics: v })}
        />
      </Group>

      <Group title={t('pf.privacy.deleteTitle')} footer={t('pf.privacy.deleteBody')}>
        <Row
          first
          danger
          icon={Trash}
          chevron={false}
          label={t('pf.privacy.deleteCta')}
          onPress={() => {
            setTyped('');
            setConfirm(true);
          }}
        />
      </Group>

      <BottomSheet visible={confirm} onClose={() => setConfirm(false)} title={t('pf.privacy.confirmTitle')}>
        <Text variant="body">{t('pf.privacy.deleteBody')}</Text>
        <View className="gap-2">
          <Text variant="label">{t('pf.privacy.confirmBody', { word })}</Text>
          <Input
            value={typed}
            onChangeText={setTyped}
            placeholder={t('pf.privacy.confirmPh')}
            autoCapitalize="characters"
            autoCorrect={false}
            accessibilityLabel={t('pf.privacy.confirmBody', { word })}
          />
        </View>
        <Button size="lg" variant="destructive" disabled={!ready} onPress={wipe}>
          <Text>{t('pf.privacy.deleteCta')}</Text>
        </Button>
        <Button variant="ghost" onPress={() => setConfirm(false)}>
          <Text>{t('common.cancel')}</Text>
        </Button>
      </BottomSheet>
    </SettingsScreen>
  );
}
