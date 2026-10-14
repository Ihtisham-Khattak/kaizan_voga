import { Hand } from 'phosphor-react-native';
import { View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { ChoiceTile } from '@/features/onboarding/choice-tile';
import { PersonalizationShell } from '@/features/onboarding/shell';
import { useT } from '@/i18n';
import { KaizenIcon, type KaizenIconName } from '@/icons';
import { usePrefsStore } from '@/store/prefs-store';
import type { Equipment } from '@/store/types';
import { useTheme } from '@/theme/theme-provider';

const ITEMS: { id: Equipment; icon?: KaizenIconName }[] = [
  { id: 'mat', icon: 'mat' },
  { id: 'chair', icon: 'chair' },
  { id: 'blocks', icon: 'blocks' },
  { id: 'strap', icon: 'strap' },
  { id: 'cushion', icon: 'cushion' },
  { id: 'none' },
];

/** Onboarding Q5 — equipment. Multi-select; "None" clears the rest (and picking anything clears "None"). */
export default function EquipmentScreen() {
  const { t } = useT();
  const { colors } = useTheme();
  const equipment = usePrefsStore((s) => s.equipment);
  const patch = usePrefsStore((s) => s.patch);

  const toggle = (id: Equipment) => {
    if (id === 'none') return patch({ equipment: equipment.includes('none') ? [] : ['none'] });
    const rest = equipment.filter((e) => e !== 'none');
    patch({ equipment: rest.includes(id) ? rest.filter((e) => e !== id) : [...rest, id] });
  };

  return (
    <PersonalizationShell
      step="equipment"
      title={t('onboardingQ.equipment.title')}
      subtitle={t('onboardingQ.equipment.subtitle')}
      canContinue={equipment.length > 0}
      reaction={
        equipment.length === 0
          ? null
          : equipment.includes('none')
            ? t('onboardingQ.equipment.reactionNone')
            : t('onboardingQ.equipment.reactionSome')
      }
    >
      <View className="flex-row flex-wrap justify-between gap-y-3" role="group">
        {ITEMS.map((it, i) => (
          <ChoiceTile
            key={it.id}
            multi
            widthPct={31}
            index={i}
            label={t(`onboardingQ.equipment.${it.id}`)}
            selected={equipment.includes(it.id)}
            onPress={() => toggle(it.id)}
            leading={
              <View className="size-14 items-center justify-center rounded-full bg-secondary">
                {it.icon ? (
                  <KaizenIcon name={it.icon} size={30} color={colors.primary} />
                ) : (
                  <Icon as={Hand} size={28} weight="duotone" className="text-primary" />
                )}
              </View>
            }
          />
        ))}
      </View>
    </PersonalizationShell>
  );
}
