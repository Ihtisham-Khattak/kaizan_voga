import { HeartStraight, MonitorPlay, Watch } from 'phosphor-react-native';
import { useEffect, useRef, useState } from 'react';
import { Platform, View } from 'react-native';

import { Text } from '@/components/ui/text';
import { Group, Row, SettingsScreen, SwitchRow } from '@/features/settings/ui';
import { useT } from '@/i18n';
import { useAppStore } from '@/store/app-store';

/** Health sync & devices – UI only. The toggle walks through an "asking permission" state so the flow is reviewable. */
export default function HealthScreen() {
  const { t } = useT();
  const healthSync = useAppStore((s) => s.healthSync);
  const setApp = useAppStore((s) => s.set);
  const [asking, setAsking] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => void (timer.current && clearTimeout(timer.current)), []);

  const toggle = (on: boolean) => {
    if (!on) return setApp({ healthSync: false });
    setAsking(true);
    timer.current = setTimeout(() => {
      setAsking(false);
      setApp({ healthSync: true });
    }, 1200);
  };

  const service = Platform.OS === 'ios' ? t('pf.health.apple') : t('pf.health.connect');
  const status = asking
    ? t('pf.health.statusAsk')
    : healthSync
      ? t('pf.health.statusOn')
      : t('pf.health.statusOff');

  return (
    <SettingsScreen title={t('pf.health.title')} subtitle={t('pf.health.subtitle')}>
      <Group title={service} footer={t('pf.health.prototype')}>
        <SwitchRow
          first
          icon={HeartStraight}
          label={t('pf.health.toggle')}
          sub={status}
          value={healthSync || asking}
          disabled={asking}
          onChange={toggle}
        />
      </Group>

      <View className="mx-4 gap-2 rounded-3xl bg-secondary/60 p-4">
        <Text variant="heading" accessibilityRole="header">
          {t('pf.health.sharedTitle')}
        </Text>
        <Text variant="body">{`• ${t('pf.health.shared1')}`}</Text>
        <Text variant="body" className="text-muted-foreground">
          {t('pf.health.notShared')}
        </Text>
        <Text variant="caption">{t('pf.health.statusDenied')}</Text>
      </View>

      <Group>
        <Row
          first
          icon={Watch}
          label={t('pf.health.devices')}
          sub={t('pf.health.devicesSub')}
          right={<Text variant="caption">{t('pf.health.soon')}</Text>}
        />
        <Row
          icon={MonitorPlay}
          label={t('pf.health.cast')}
          sub={t('pf.health.castSub')}
          right={<Text variant="caption">{t('pf.health.soon')}</Text>}
        />
      </Group>
    </SettingsScreen>
  );
}
