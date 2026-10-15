import { router, type Href } from 'expo-router';
import { Trash, WifiHigh } from 'phosphor-react-native';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { BottomSheet } from '@/components/bottom-sheet';
import { toast } from '@/components/toast';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Progress } from '@/components/ui/progress';
import { Text } from '@/components/ui/text';
import { Group, SettingsScreen, SwitchRow } from '@/features/settings/ui';
import { EmptyFor } from '@/features/states/empty';
import { useT } from '@/i18n';
import { resolveRoutine } from '@/lib/routines';
import { useAppStore } from '@/store/app-store';
import { useLibraryStore } from '@/store/library-store';

/** Pretend device allowance for downloads (mock). FN-10 reads the real free space. */
const TOTAL_MB = 500;

/** Downloads manager (UI + mock data): list, per-item delete, delete all, storage meter, Wi-Fi only. */
export default function DownloadsScreen() {
  const { t } = useT();
  const downloads = useLibraryStore((s) => s.downloads);
  const remove = useLibraryStore((s) => s.removeDownload);
  const wifiOnly = useAppStore((s) => s.wifiOnly);
  const setApp = useAppStore((s) => s.set);
  const [confirm, setConfirm] = useState(false);

  const used = Math.round(
    downloads.filter((d) => d.status === 'downloaded').reduce((n, d) => n + d.sizeMb, 0)
  );

  return (
    <SettingsScreen title={t('pf.dl.title')} subtitle={t('pf.dl.subtitle')}>
      <View className="mx-4 gap-2 rounded-3xl border border-border bg-card p-4">
        <Text variant="label">{t('pf.dl.used', { used, total: TOTAL_MB })}</Text>
        <Progress
          value={(used / TOTAL_MB) * 100}
          accessibilityLabel={t('pf.dl.meter')}
          className="h-3 bg-secondary"
          indicatorClassName="bg-leaf"
        />
      </View>

      {downloads.length === 0 ? (
        <EmptyFor kind="downloads" onCta={() => router.push('/explore' as Href)} />
      ) : (
        <Group>
          {downloads.map((d, i) => {
            const routine = resolveRoutine(d.id);
            const name = routine?.title ?? d.id;
            const busy = d.status === 'downloading';
            return (
              <View
                key={d.id}
                className={`min-h-16 flex-row items-center gap-3 px-4 py-3 ${i ? 'border-t border-border' : ''}`}
              >
                <View className="flex-1 gap-1">
                  <Text variant="label" numberOfLines={1}>
                    {name}
                  </Text>
                  {busy ? (
                    <>
                      <Progress
                        value={d.progress * 100}
                        className="h-1.5 bg-secondary"
                        indicatorClassName="bg-leaf"
                      />
                      <Text variant="caption">
                        {t('pf.dl.downloading', { pct: Math.round(d.progress * 100) })}
                      </Text>
                    </>
                  ) : (
                    <Text variant="caption">{`${t('pf.dl.ready')} · ${d.sizeMb} MB`}</Text>
                  )}
                </View>
                <Pressable
                  onPress={() => {
                    remove(d.id);
                    toast.info(t('pf.dl.removed'));
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={t('pf.dl.remove', { name })}
                  className="size-11 items-center justify-center rounded-full bg-secondary active:opacity-80"
                >
                  <Icon as={Trash} size={20} className="text-secondary-foreground" />
                </Pressable>
              </View>
            );
          })}
        </Group>
      )}

      <Group>
        <SwitchRow
          first
          icon={WifiHigh}
          label={t('pf.dl.wifi')}
          sub={t('pf.dl.wifiSub')}
          value={wifiOnly}
          onChange={(v) => setApp({ wifiOnly: v })}
        />
      </Group>

      {downloads.length ? (
        <View className="px-4">
          <Button variant="secondary" onPress={() => setConfirm(true)}>
            <Text>{t('pf.dl.deleteAll')}</Text>
          </Button>
        </View>
      ) : null}

      <BottomSheet visible={confirm} onClose={() => setConfirm(false)} title={t('pf.dl.deleteAllTitle')}>
        <Text variant="body">{t('pf.dl.deleteAllBody')}</Text>
        <Button
          size="lg"
          onPress={() => {
            downloads.forEach((d) => remove(d.id));
            setConfirm(false);
            toast.info(t('pf.dl.removed'));
          }}
        >
          <Text>{t('pf.dl.deleteAll')}</Text>
        </Button>
        <Button variant="ghost" onPress={() => setConfirm(false)}>
          <Text>{t('pf.dl.cancel')}</Text>
        </Button>
      </BottomSheet>
    </SettingsScreen>
  );
}
