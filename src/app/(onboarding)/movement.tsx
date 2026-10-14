import { Shuffle } from 'phosphor-react-native';
import { View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { OptionCard } from '@/features/onboarding/option-card';
import { PersonalizationShell } from '@/features/onboarding/shell';
import { useT } from '@/i18n';
import { KaizenIcon, type KaizenIconName } from '@/icons';
import { usePrefsStore } from '@/store/prefs-store';
import type { Movement } from '@/store/types';
import { useTheme } from '@/theme/theme-provider';

const OPTIONS: { id: Movement; icon?: KaizenIconName }[] = [
  { id: 'seated', icon: 'seated' },
  { id: 'standing', icon: 'standing' },
  { id: 'floor', icon: 'floor' },
  { id: 'low-impact', icon: 'low-impact' },
  { id: 'mixed' },
];

/** Onboarding Q4 — movement preference. Choosing "Seated" also switches chair mode on by default. */
export default function MovementScreen() {
  const { t } = useT();
  const { colors } = useTheme();
  const movement = usePrefsStore((s) => s.movement);
  const patch = usePrefsStore((s) => s.patch);

  return (
    <PersonalizationShell
      step="movement"
      title={t('onboardingQ.movement.title')}
      subtitle={t('onboardingQ.movement.subtitle')}
      canContinue={movement !== null}
      reaction={movement ? t(`onboardingQ.movement.reaction.${movement}`) : null}
    >
      <View className="gap-3" role="radiogroup">
        {OPTIONS.map((o, i) => (
          <OptionCard
            key={o.id}
            index={i}
            title={t(`onboardingQ.movement.${o.id}.title`)}
            subtitle={t(`onboardingQ.movement.${o.id}.sub`)}
            selected={movement === o.id}
            onPress={() => patch({ movement: o.id, chairMode: o.id === 'seated' })}
            leading={
              <View className="size-11 items-center justify-center rounded-full bg-secondary">
                {o.icon ? (
                  <KaizenIcon name={o.icon} size={26} color={colors.primary} />
                ) : (
                  <Icon as={Shuffle} size={24} weight="duotone" className="text-primary" />
                )}
              </View>
            }
          />
        ))}
      </View>
    </PersonalizationShell>
  );
}
