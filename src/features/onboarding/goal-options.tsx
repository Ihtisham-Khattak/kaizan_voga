import type { ReactNode } from 'react';
import { View } from 'react-native';

import type { CharacterName } from '@/characters/palette';
import { CharacterAvatar } from '@/components/character-avatar';
import { KaizenIcon, type KaizenIconName } from '@/icons';
import type { Goal } from '@/store/types';
import { useTheme } from '@/theme/theme-provider';

/**
 * The goals, in the brief's order. Every row gets the same illustration: a round character avatar (the friend who
 * shares that goal, or Kai for the general ones) with the goal's own icon as a small badge. One format for all seven.
 */
export const GOALS: { id: Goal; character: CharacterName; icon: KaizenIconName }[] = [
  { id: 'stress', character: 'hina', icon: 'goal-stress' },
  { id: 'back-neck', character: 'hamid', icon: 'goal-back-neck' },
  { id: 'sleep', character: 'sierra', icon: 'goal-sleep' },
  { id: 'focus', character: 'arfa', icon: 'goal-focus' },
  { id: 'flexibility', character: 'kai', icon: 'goal-flex' },
  { id: 'balance', character: 'kai', icon: 'goal-balance' },
  { id: 'gentle', character: 'kai', icon: 'goal-gentle' },
];

function GoalIllustration({ g }: { g: (typeof GOALS)[number] }) {
  const { colors } = useTheme();
  return (
    <View style={{ width: 52, height: 52 }}>
      <CharacterAvatar name={g.character} size={48} mood="happy" />
      <View
        style={{
          position: 'absolute',
          end: -2,
          bottom: -2,
          width: 24,
          height: 24,
          borderRadius: 12,
          backgroundColor: colors.mint,
          borderWidth: 2,
          borderColor: colors.bg,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <KaizenIcon name={g.icon} size={14} color={colors.primary} />
      </View>
    </View>
  );
}

export function goalLeading(g: (typeof GOALS)[number]): ReactNode {
  return <GoalIllustration g={g} />;
}
