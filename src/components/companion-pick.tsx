import { View } from 'react-native';

import { CharacterAvatar } from '@/components/character-avatar';
import { Text } from '@/components/ui/text';
import { PICKS } from '@/data/companions';
import { useT } from '@/i18n';

/** "Hina's pick": one of the four people vouches for this routine or program, with a one-line reason. */
export function CompanionPick({ id }: { id: string }) {
  const { t } = useT();
  const who = PICKS[id];
  if (!who) return null;
  const name = t(`story.s5.people.${who}.name`);
  return (
    <View
      accessible
      accessibilityLabel={`${t('companions.pick', { name })}. ${t(`companions.reasons.${id}`)}`}
      className="flex-row items-center gap-3 rounded-card border border-hairline bg-bgMist p-3"
    >
      <CharacterAvatar name={who} size={44} ring mood="happy" />
      <View className="flex-1">
        <Text variant="callout" className="font-sans-semibold">
          {t('companions.pick', { name })}
        </Text>
        <Text variant="footnote">{t(`companions.reasons.${id}`)}</Text>
      </View>
    </View>
  );
}
