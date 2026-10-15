import { View } from 'react-native';

import { Character } from '@/characters/character';
import { PHOTOS } from '@/characters/photos';
import { signature, type CharacterName } from '@/characters/palette';
import type { Person } from '@/data/companions';

import { PersonPhoto } from './person-photo';
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

/** Circular head crop – Hina, Arfa, Hamid and Sierra use their portraits; Kai uses the illustrated Character. */
export function CharacterAvatar({
  name,
  mood = 'happy',
  pose,
  size = 48,
  ring = false,
  animated = false,
}: Props) {
  const color = signature[name];
  if (name !== 'kai') {
    const inner = size - (ring ? 4 : 0);
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
        }}
      >
        <PersonPhoto
          person={name as Person}
          width={inner}
          height={inner}
          zoom={PHOTOS[name as Person].hairy ? 1.9 : 2.3}
          faceAt={0.46}
        />
      </View>
    );
  }
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
