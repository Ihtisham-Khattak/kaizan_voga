import { Hand } from 'phosphor-react-native';
import { View } from 'react-native';

import { FadeUp } from '@/components/fade-up';
import { ProgressRing } from '@/components/progress-ring';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { listExercises } from '@/data/repo';
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

  // live count: poses that need nothing beyond what the user ticked ("none" = no equipment at all)
  const all = listExercises();
  const have = new Set<string>(equipment.filter((e) => e !== 'none'));
  const doable = all.filter((e) => e.tags.equipment.every((q) => have.has(q))).length;

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
            widthPct={48}
            index={i}
            label={t(`onboardingQ.equipment.${it.id}`)}
            sublabel={t(`onboardingQ.equipment.${it.id}Sub`)}
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

      {equipment.length > 0 ? (
        <FadeUp>
          <View
            accessible
            accessibilityLiveRegion="polite"
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 14,
              backgroundColor: colors.mint,
              borderRadius: 20,
              padding: 14,
            }}
          >
            <ProgressRing progress={doable / all.length} size={56} strokeWidth={6} color="primary">
              <Text variant="callout" className="font-sans-bold" style={{ color: colors.forest }}>
                {String(doable)}
              </Text>
            </ProgressRing>
            <View style={{ flex: 1, gap: 2 }}>
              <Text variant="callout" className="font-sans-semibold" style={{ color: colors.forest }}>
                {t('onboardingQ.equipment.canDo', { count: doable, total: all.length })}
              </Text>
              <Text variant="footnote" style={{ color: colors.muted }}>
                {t('onboardingQ.equipment.canDoHint')}
              </Text>
            </View>
          </View>
        </FadeUp>
      ) : null}
    </PersonalizationShell>
  );
}
