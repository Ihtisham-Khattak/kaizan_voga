import type { ImageSourcePropType } from 'react-native';

import type { Person } from '@/data/companions';

interface Shot {
  source: ImageSourcePropType;
  /** Where the face sits (0–1 of the image) so avatars and cards can crop around it. */
  face: { x: number; y: number };
}

/**
 * Rendered portraits of the four people (assets/images/people), square 900px images.
 * `before` is the worried / neutral portrait, `after` the happy one. The story's before/after card uses both;
 * avatars use `after` when the person is shown happy or calm.
 */
export const PHOTOS: Record<Person, { before: Shot; after: Shot; hairy?: boolean }> = {
  hina: {
    before: { source: require('../../assets/images/people/hina.jpg'), face: { x: 0.5, y: 0.27 } },
    after: { source: require('../../assets/images/people/hina-after.jpg'), face: { x: 0.51, y: 0.27 } },
  },
  arfa: {
    before: { source: require('../../assets/images/people/arfa.jpg'), face: { x: 0.5, y: 0.27 } },
    after: { source: require('../../assets/images/people/arfa-after.jpg'), face: { x: 0.5, y: 0.21 } },
  },
  hamid: {
    before: { source: require('../../assets/images/people/hamid.jpg'), face: { x: 0.53, y: 0.28 } },
    after: { source: require('../../assets/images/people/hamid-after.jpg'), face: { x: 0.5, y: 0.15 } },
  },
  sierra: {
    before: { source: require('../../assets/images/people/sierra.jpg'), face: { x: 0.51, y: 0.3 } },
    after: { source: require('../../assets/images/people/sierra-after.jpg'), face: { x: 0.52, y: 0.27 } },
    hairy: true,
  },
};
