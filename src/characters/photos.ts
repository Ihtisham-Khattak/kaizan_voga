import type { ImageSourcePropType } from 'react-native';

import type { Person } from '@/data/companions';

/**
 * Rendered portraits of the four people (assets/images/people). Square 900px images; `face` is where the face
 * sits (0–1 of the image) so avatars and cards can crop around it.
 */
export const PHOTOS: Record<
  Person,
  { source: ImageSourcePropType; face: { x: number; y: number }; hairy?: boolean }
> = {
  hina: { source: require('../../assets/images/people/hina.jpg'), face: { x: 0.5, y: 0.27 } },
  arfa: { source: require('../../assets/images/people/arfa.jpg'), face: { x: 0.5, y: 0.27 } },
  hamid: { source: require('../../assets/images/people/hamid.jpg'), face: { x: 0.53, y: 0.28 } },
  sierra: {
    source: require('../../assets/images/people/sierra.jpg'),
    face: { x: 0.51, y: 0.3 },
    hairy: true,
  },
};
