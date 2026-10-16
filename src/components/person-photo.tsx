import { Image, View, type StyleProp, type ViewStyle } from 'react-native';

import { PHOTOS } from '@/characters/photos';
import type { Person } from '@/data/companions';

interface Props {
  person: Person;
  /** Which portrait: the worried one or the happy one. */
  variant?: 'before' | 'after';
  width: number;
  height: number;
  /** 1 = the photo just covers the box; larger crops in on the face. */
  zoom?: number;
  /** Where the face should land in the box, as a fraction of its height (default 0.42). */
  faceAt?: number;
  radius?: number;
  style?: StyleProp<ViewStyle>;
}

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

/** A cropped view onto a person's portrait. The photo always covers the box; the crop follows the face. */
export function PersonPhoto({
  person,
  variant = 'before',
  width,
  height,
  zoom = 1,
  faceAt = 0.42,
  radius = 0,
  style,
}: Props) {
  const { source, face } = PHOTOS[person][variant];
  const D = zoom * Math.max(width, height);
  const left = clamp(width / 2 - face.x * D, width - D, 0);
  const top = clamp(height * faceAt - face.y * D, height - D, 0);
  return (
    <View
      style={[{ width, height, borderRadius: radius, overflow: 'hidden' }, style]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Image
        source={source}
        style={{ position: 'absolute', width: D, height: D, left, top }}
        resizeMode="cover"
      />
    </View>
  );
}
