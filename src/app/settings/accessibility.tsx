import { CircleHalf, DeviceMobileSpeaker, Subtitles } from 'phosphor-react-native';
import { View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Group, Segmented, SettingsScreen, SwitchRow } from '@/features/settings/ui';
import { useT } from '@/i18n';
import { useAppStore } from '@/store/app-store';
import type { MotionPreference } from '@/store/types';

/** Accessibility: every change applies immediately, and the preview card shows it. */
export default function AccessibilityScreen() {
  const { t } = useT();
  const app = useAppStore();

  return (
    <SettingsScreen title={t('pf.a11y.title')} subtitle={t('pf.a11y.subtitle')}>
      <View
        className="mx-4 gap-2 rounded-3xl border border-border bg-card p-4"
        accessibilityLabel={t('pf.a11y.previewTitle')}
      >
        <Text variant="caption" className="font-sans-semibold uppercase tracking-wide">
          {t('pf.a11y.previewTitle')}
        </Text>
        <Text variant="title">{t('pf.a11y.previewHead')}</Text>
        <Text variant="body">{t('pf.a11y.previewBody')}</Text>
        {app.captions ? (
          <View className="rounded-2xl bg-secondary px-3 py-2">
            <Text variant="caption" className="text-secondary-foreground">
              {t('pf.a11y.previewCaption')}
            </Text>
          </View>
        ) : null}
      </View>

      <Group>
        <Segmented<MotionPreference>
          first
          label={t('pf.a11y.motion')}
          sub={t('pf.a11y.motionSub')}
          value={app.motion}
          onChange={(motion) => app.set({ motion })}
          options={(['system', 'reduce', 'full'] as const).map((v) => ({
            id: v,
            label: t(`pf.a11y.motionOpts.${v}`),
          }))}
        />
        <Segmented<1 | 1.15 | 1.3>
          label={t('pf.a11y.text')}
          value={app.textScale}
          onChange={(textScale) => app.set({ textScale })}
          options={[
            { id: 1, label: t('pf.a11y.textOpts.std') },
            { id: 1.15, label: t('pf.a11y.textOpts.large') },
            { id: 1.3, label: t('pf.a11y.textOpts.largest') },
          ]}
        />
      </Group>

      <Group>
        <SwitchRow
          first
          icon={Subtitles}
          label={t('pf.a11y.captions')}
          sub={t('pf.a11y.captionsSub')}
          value={app.captions}
          onChange={(captions) => app.set({ captions })}
        />
        <SwitchRow
          icon={DeviceMobileSpeaker}
          label={t('pf.a11y.haptics')}
          sub={t('pf.a11y.hapticsSub')}
          value={app.haptics}
          onChange={(haptics) => app.set({ haptics })}
        />
        <SwitchRow
          icon={CircleHalf}
          label={t('pf.a11y.contrast')}
          sub={t('pf.a11y.contrastSub')}
          value={app.highContrast}
          onChange={(highContrast) => app.set({ highContrast })}
        />
      </Group>

      <View className="mx-4 gap-2 rounded-3xl bg-secondary/60 p-4">
        <View className="flex-row items-center gap-2">
          <Icon as={DeviceMobileSpeaker} size={20} weight="duotone" className="text-primary" />
          <Text variant="heading" accessibilityRole="header">
            {t('pf.a11y.tips')}
          </Text>
        </View>
        {(['tip1', 'tip2', 'tip3', 'tip4'] as const).map((k) => (
          <Text key={k} variant="body">{`• ${t(`pf.a11y.${k}`)}`}</Text>
        ))}
      </View>
    </SettingsScreen>
  );
}
