import type { ReactNode } from 'react';
import { View } from 'react-native';

import type { CharacterName } from '@/characters/palette';
import { CharacterAvatar } from '@/components/character-avatar';
import { KaizenIcon, type KaizenIconName } from '@/icons';
import type { Goal } from '@/store/types';
import { useTheme } from '@/theme/theme-provider';

/** Brief order. Four goals are voiced by a friend; the rest use an original Kaizen icon. */
export const GOALS: { id: Goal; character?: CharacterName; icon: KaizenIconName }[] = [
  { id: 'stress', character: 'hina', icon: 'goal-stress' },
  { id: 'back-neck', character: 'hamid', icon: 'goal-back-neck' },
  { id: 'sleep', character: 'sierra', icon: 'goal-sleep' },
  { id: 'focus', character: 'arfa', icon: 'goal-focus' },
  { id: 'flexibility', icon: 'goal-flex' },
  { id: 'balance', icon: 'goal-balance' },
  { id: 'gentle', icon: 'goal-gentle' },
];

function IconBubble({ name }: { name: KaizenIconName }) {
  const { colors } = useTheme();
  return (
    <View className="size-11 items-center justify-center rounded-full bg-secondary">
      <KaizenIcon name={name} size={24} color={colors.primary} />
    </View>
  );
}

export function goalLeading(g: (typeof GOALS)[number]): ReactNode {
  return g.character ? (
    <CharacterAvatar name={g.character} size={44} mood="happy" />
  ) : (
    <IconBubble name={g.icon} />
  );
}
