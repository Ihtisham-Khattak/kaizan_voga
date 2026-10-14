import { View } from 'react-native';

import { Character } from '@/characters/character';
import { signature, type CharacterName } from '@/characters/palette';
import type { Pose } from '@/characters/types';
import type { Mood } from '@/store/types';

interface Props {
  name: CharacterName;
  mood?: Mood;
  pose?: Pose;
  size?: number;
  /** Colour ring in the character's signature colour. */
  ring?: boolean;
  animated?: boolean;
}

/** Circular head-and-shoulders crop of the shared Character – tiny icons on cards, headers, tab bars. */
export function CharacterAvatar({
  name,
  mood = 'happy',
  pose,
  size = 48,
  ring = false,
  animated = false,
}: Props) {
  const color = signature[name];
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color + '33',
        borderWidth: ring ? 2 : 0,
        borderColor: color,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'flex-end',
      }}
    >
      <View style={{ marginBottom: -size * 0.04 }}>
        <Character name={name} mood={mood} pose={pose} crop="bust" size={size * 1.02} animated={animated} />
      </View>
    </View>
  );
}
