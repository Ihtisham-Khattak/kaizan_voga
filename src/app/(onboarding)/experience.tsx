import { View } from 'react-native';

import { OptionCard } from '@/features/onboarding/option-card';
import { PersonalizationShell } from '@/features/onboarding/shell';
import { goNext } from '@/features/onboarding/steps';
import { useT } from '@/i18n';
import { usePrefsStore } from '@/store/prefs-store';
import type { Experience } from '@/store/types';
import { KaizenIcon, type KaizenIconName } from '@/icons';
import { useTheme } from '@/theme/theme-provider';

const OPTIONS: { id: Experience; icon: KaizenIconName }[] = [
  { id: 'beginner', icon: 'leaf' },
  { id: 'some', icon: 'lotus' },
  { id: 'experienced', icon: 'badge-frame' },
];

/** Onboarding Q1 — experience level. Single select; Kai reacts; Skip defaults to Beginner. */
export default function ExperienceScreen() {
  const { t } = useT();
  const { tokens } = useTheme();
  const experience = usePrefsStore((s) => s.experience);
  const patch = usePrefsStore((s) => s.patch);

  return (
    <PersonalizationShell
      step="experience"
      title={t('onboarding.experience.title')}
      subtitle={t('onboarding.experience.subtitle')}
      canContinue={experience !== null}
      reaction={experience ? t(`onboarding.experience.reaction.${experience}`) : null}
      onSkip={() => {
        patch({ experience: 'beginner' });
        goNext('experience');
      }}
    >
      <View className="gap-3" role="radiogroup">
        {OPTIONS.map((o, i) => (
          <OptionCard
            key={o.id}
            index={i}
            title={t(`onboarding.experience.${o.id}.title`)}
            subtitle={t(`onboarding.experience.${o.id}.sub`)}
            selected={experience === o.id}
            onPress={() => patch({ experience: o.id })}
            leading={
              <View className="bg-secondary size-11 items-center justify-center rounded-full">
                <KaizenIcon name={o.icon} size={24} color={tokens.primary} />
              </View>
            }
          />
        ))}
      </View>
    </PersonalizationShell>
  );
}
