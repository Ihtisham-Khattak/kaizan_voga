import * as Clipboard from 'expo-clipboard';
import { Copy, HeartStraight, Phone, Siren } from 'phosphor-react-native';
import { useState } from 'react';
import { Linking, Pressable, View } from 'react-native';

import { toast } from '@/components/toast';
import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { listHelplines, type Helpline } from '@/data/repo';
import { Group, SettingsScreen } from '@/features/settings/ui';
import { useT } from '@/i18n';

const COUNTRIES = ['pk', 'in', 'uk', 'us', 'other'] as const;
const digits = (n: string) => n.replace(/[^\d+]/g, '');
const dialable = (n: string) => /\d{3,}/.test(n);

/** Crisis & helpline resources. Gentle tone, no diagnosis. Entries are data (placeholders until verified per country). */
export default function SupportResources() {
  const { t } = useT();
  const [country, setCountry] = useState<(typeof COUNTRIES)[number]>('pk');
  const lines = listHelplines();
  const emergency = lines.find((l) => l.id === 'h-emergency');
  const rest = lines.filter((l) => l.id !== 'h-emergency');

  const call = (l: Helpline) => {
    if (!dialable(l.number)) return toast.gentle(t('pf.support.notReady'));
    Linking.openURL(`tel:${digits(l.number)}`).catch(() => {});
  };
  const copy = async (l: Helpline) => {
    if (!dialable(l.number)) return toast.gentle(t('pf.support.notReady'));
    await Clipboard.setStringAsync(l.number);
    toast.success(t('pf.support.copied'));
  };

  return (
    <SettingsScreen title={t('pf.support.title')} subtitle={t('pf.support.gentle')}>
      <View className="mx-4 flex-row items-start gap-3 rounded-3xl bg-secondary/70 p-4">
        <Icon as={HeartStraight} size={26} weight="duotone" className="text-primary" />
        <Text variant="body" className="flex-1">
          {t('pf.support.intro')}
        </Text>
      </View>

      {emergency ? (
        <View className="mx-4 gap-3 rounded-3xl border-2 border-danger bg-card p-4">
          <View className="flex-row items-center gap-2">
            <Icon as={Siren} size={26} weight="duotone" className="text-danger" />
            <Text variant="heading">{t('pf.support.emergency')}</Text>
          </View>
          <Text variant="body">{t('pf.support.emergencyBody')}</Text>
          <Text variant="title1" accessibilityLabel={emergency.number}>
            {emergency.number}
          </Text>
          <Button size="lg" onPress={() => call(emergency)}>
            <Text>{t('pf.support.callEmergency')}</Text>
          </Button>
        </View>
      ) : null}

      <View className="gap-2 px-4">
        <Text variant="label" accessibilityRole="header" className="px-1 text-muted-foreground">
          {t('pf.support.country')}
        </Text>
        <View role="radiogroup" className="flex-row flex-wrap gap-2">
          {COUNTRIES.map((c) => (
            <Chip
              key={c}
              label={t(`pf.support.countries.${c}`)}
              selected={country === c}
              onPress={() => setCountry(c)}
            />
          ))}
        </View>
      </View>

      <Group title={t('pf.support.lines')} footer={t('pf.support.placeholder')}>
        {rest.map((l, i) => (
          <View key={l.id} className={`gap-2 px-4 py-3 ${i ? 'border-t border-border' : ''}`}>
            <View>
              <Text variant="label">{l.name}</Text>
              <Text variant="caption">{`${t(`pf.support.countries.${country}`)} · ${t('pf.support.hours', { hours: l.hours })}`}</Text>
            </View>
            <Text variant="title">{l.number}</Text>
            <View className="flex-row gap-2">
              <Pressable
                onPress={() => call(l)}
                accessibilityRole="button"
                accessibilityLabel={`${t('pf.support.call')} ${l.name}`}
                className="min-h-11 flex-row items-center gap-2 rounded-pill bg-primary px-4"
              >
                <Icon as={Phone} size={18} weight="fill" className="text-primary-foreground" />
                <Text variant="label" className="text-primary-foreground">
                  {t('pf.support.call')}
                </Text>
              </Pressable>
              <Pressable
                onPress={() => copy(l)}
                accessibilityRole="button"
                accessibilityLabel={`${t('pf.support.copy')}: ${l.name}`}
                className="min-h-11 flex-row items-center gap-2 rounded-pill bg-secondary px-4"
              >
                <Icon as={Copy} size={18} className="text-secondary-foreground" />
                <Text variant="label" className="text-secondary-foreground">
                  {t('pf.support.copy')}
                </Text>
              </Pressable>
            </View>
          </View>
        ))}
      </Group>
    </SettingsScreen>
  );
}
