import type { Palette } from './colors';

/** The tint names routines/programs carry in their data (src/data/types.ts CoverTint). */
export type CoverTint = 'sage' | 'mint' | 'sand' | 'coral' | 'lavender';

/** Maps a content tint to a palette colour. Sunrise is reserved for celebration, so warm covers use its soft tint. */
export function coverColor(colors: Palette, tint: CoverTint): string {
  switch (tint) {
    case 'sage':
      return colors.leaf;
    case 'mint':
      return colors.auroraMint;
    case 'sand':
      return colors.sunriseSoft;
    case 'coral':
      return colors.sunrise;
    case 'lavender':
      return colors.lavender;
  }
}
