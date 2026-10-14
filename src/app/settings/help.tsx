import { CaretDown, CaretUp, MagnifyingGlass } from 'phosphor-react-native';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { router, type Href } from 'expo-router';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { SettingsScreen } from '@/features/settings/ui';
import { useT } from '@/i18n';

const KEYS = [1, 2, 3, 4, 5, 6] as const;

/** Help & FAQ: search + expandable answers. */
export default function HelpScreen() {
  const { t } = useT();
  const [q, setQ] = useState('');
  const [open, setOpen] = useState<number | null>(null);
  const needle = q.trim().toLowerCase();
  const shown = KEYS.filter(
    (n) => !needle || `${t(`pf.info.faq.q${n}`)} ${t(`pf.info.faq.a${n}`)}`.toLowerCase().includes(needle)
  );

  return (
    <SettingsScreen title={t('pf.info.helpTitle')} keyboard>
      <View className="gap-3 px-4">
        <View className="justify-center">
          <Input
            value={q}
            onChangeText={setQ}
            placeholder={t('pf.info.helpSearch')}
            accessibilityLabel={t('pf.info.helpSearch')}
            returnKeyType="search"
            className="ps-12"
          />
          <View pointerEvents="none" className="absolute start-4">
            <Icon as={MagnifyingGlass} size={20} className="text-muted-foreground" />
          </View>
        </View>

        {shown.length === 0 ? (
          <Text variant="body" className="py-6 text-center text-muted-foreground">
            {t('pf.info.helpNone')}
          </Text>
        ) : (
          <View className="overflow-hidden rounded-3xl border border-border bg-card">
            {shown.map((n, i) => {
              const expanded = open === n;
              return (
                <View key={n} className={i ? 'border-t border-border' : ''}>
                  <Pressable
                    onPress={() => setOpen(expanded ? null : n)}
                    accessibilityRole="button"
                    accessibilityState={{ expanded }}
                    accessibilityLabel={t(`pf.info.faq.q${n}`)}
                    className="min-h-14 flex-row items-center gap-3 px-4 py-3 active:bg-secondary/50"
                  >
                    <Text variant="label" className="flex-1">
                      {t(`pf.info.faq.q${n}`)}
                    </Text>
                    <Icon as={expanded ? CaretUp : CaretDown} size={18} className="text-muted-foreground" />
                  </Pressable>
                  {expanded ? (
                    <View className="px-4 pb-4">
                      <Text variant="body" className="text-muted-foreground">
                        {t(`pf.info.faq.a${n}`)}
                      </Text>
                    </View>
                  ) : null}
                </View>
              );
            })}
          </View>
        )}

        <Button variant="secondary" onPress={() => router.push('/settings/contact' as Href)}>
          <Text>{t('pf.info.contactTitle')}</Text>
        </Button>
      </View>
    </SettingsScreen>
  );
}
