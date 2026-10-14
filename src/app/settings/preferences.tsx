import { Armchair, MusicNotes } from 'phosphor-react-native';

import { Group, Segmented, SettingsScreen, SwitchRow } from '@/features/settings/ui';
import { useT } from '@/i18n';
import { useAppStore } from '@/store/app-store';
import { usePrefsStore } from '@/store/prefs-store';
import type { Ambience, Language, ThemePreference, VoicePreference } from '@/store/types';

/** Preferences: guidance (voice/music), language, theme, units, session length. */
export default function PreferencesScreen() {
  const { t } = useT();
  const prefs = usePrefsStore();
  const app = useAppStore();

  return (
    <SettingsScreen title={t('pf.prefs.title')} subtitle={t('pf.prefs.subtitle')}>
      <Group title={t('pf.prefs.guidance')}>
        <Segmented<VoicePreference>
          first
          label={t('pf.prefs.voice')}
          value={prefs.voice}
          onChange={(voice) => prefs.patch({ voice })}
          options={(['female', 'male', 'none'] as const).map((v) => ({
            id: v,
            label: t(`onboardingR.voice.${v}`),
          }))}
        />
        <SwitchRow
          icon={MusicNotes}
          label={t('pf.prefs.music')}
          value={prefs.music}
          onChange={(music) => prefs.patch({ music })}
        />
        {prefs.music ? (
          <Segmented<Ambience>
            label={t('pf.prefs.ambience')}
            value={prefs.ambience}
            onChange={(ambience) => prefs.patch({ ambience })}
            options={(
              [
                ['rain', 'rain'],
                ['forest', 'forest'],
                ['piano', 'piano'],
                ['none', 'silence'],
              ] as const
            ).map(([id, key]) => ({ id, label: t(`onboardingR.voice.${key}.title`) }))}
          />
        ) : null}
        <Segmented<5 | 10 | 15 | 20>
          label={t('pf.prefs.length')}
          value={prefs.minutesPerDay}
          onChange={(minutesPerDay) => prefs.patch({ minutesPerDay })}
          options={([5, 10, 15, 20] as const).map((m) => ({
            id: m,
            label: t('common.minutes', { count: m }),
          }))}
        />
        <SwitchRow
          icon={Armchair}
          label={t('pf.prefs.chair')}
          sub={t('pf.prefs.chairSub')}
          value={prefs.chairMode}
          onChange={(chairMode) => prefs.patch({ chairMode })}
        />
      </Group>

      <Group footer={t('pf.prefs.languageNote')}>
        <Segmented<Language>
          first
          label={t('pf.prefs.language')}
          value={app.language}
          onChange={(language) => app.set({ language })}
          options={[
            { id: 'en', label: t('languages.en') },
            { id: 'ur', label: t('languages.ur') },
          ]}
        />
      </Group>

      <Group>
        <Segmented<ThemePreference>
          first
          label={t('pf.prefs.theme')}
          value={app.theme}
          onChange={(theme) => app.set({ theme })}
          options={(['light', 'dark', 'system'] as const).map((v) => ({
            id: v,
            label: t(`pf.prefs.themeOpts.${v}`),
          }))}
        />
        <Segmented<'metric' | 'imperial'>
          label={t('pf.prefs.units')}
          value={app.units}
          onChange={(units) => app.set({ units })}
          options={(['metric', 'imperial'] as const).map((v) => ({
            id: v,
            label: t(`pf.prefs.unitsOpts.${v}`),
          }))}
        />
      </Group>
    </SettingsScreen>
  );
}
