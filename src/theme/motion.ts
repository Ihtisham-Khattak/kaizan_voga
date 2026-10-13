import { Easing, type WithSpringConfig, type WithTimingConfig } from 'react-native-reanimated';

/**
 * Motion language: slow and breathing. Nothing under 300 ms except micro press feedback.
 */
export const duration = { quick: 300, base: 450, slow: 600, scene: 900 } as const;

export const ease = Easing.inOut(Easing.ease);

export const timing = (ms: number = duration.base): WithTimingConfig => ({ duration: ms, easing: ease });

/** Low-stiffness springs – they settle softly instead of snapping. */
export const spring = {
  gentle: { damping: 18, stiffness: 90, mass: 1 } satisfies WithSpringConfig,
  soft: { damping: 22, stiffness: 70, mass: 1 } satisfies WithSpringConfig,
  pop: { damping: 14, stiffness: 120, mass: 0.9 } satisfies WithSpringConfig,
};

/** Delay between speech bubbles appearing in story scenes. */
export const BUBBLE_STAGGER = 600;
/** Delay between list/section entrances. */
export const SECTION_STAGGER = 60;

export const stagger = (index: number, step: number = SECTION_STAGGER, base = 0) => base + index * step;

export { BREATH } from '@/lib/breath';
