import type { Extras, Palette } from './colors';
import { alpha } from './colors';

/**
 * Shadows (docs/UI_Build.md): glass panels get "0 8 32, forest at 10%"; primary and the centre Practice
 * button get a soft green glow. iOS uses shadow*, Android falls back to elevation.
 */
export function makeShadows(colors: Palette, extras: Extras) {
  return {
    /** Glass panel shadow. */
    glass: {
      shadowColor: extras.shadow,
      shadowOpacity: 0.1,
      shadowRadius: 32,
      shadowOffset: { width: 0, height: 8 },
      elevation: 6,
    },
    /** Soft green glow under primary buttons and the centre Practice button. */
    glow: {
      shadowColor: colors.leaf,
      shadowOpacity: 0.35,
      shadowRadius: 20,
      shadowOffset: { width: 0, height: 8 },
      elevation: 8,
    },
    /** A tint helper for borders/dividers that should follow the shadow colour. */
    tint: alpha(extras.shadow.startsWith('#') ? extras.shadow : '#000000', 0.1),
  } as const;
}

export type Shadows = ReturnType<typeof makeShadows>;
