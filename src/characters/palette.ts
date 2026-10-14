import { art } from '@/theme/illustration';

/**
 * Character art is fixed-palette: Zara/Ali/Hina/Omar/Kai must look IDENTICAL in light and dark mode,
 * so nothing here reads the theme.
 */
export type CharacterName = 'zara' | 'ali' | 'hina' | 'omar' | 'kai';

/** One signature colour per character – never changes. */
export const signature: Record<CharacterName, string> = {
  zara: art.teal, // teal top
  ali: art.mustard, // mustard hoodie
  hina: art.lilac, // lavender scarf / dupatta
  omar: art.coral, // coral t-shirt
  kai: art.sage, // lotus-leaf sprite
};

/** Warm, harmonious skin-tone family shared by all humans. */
export const skin = {
  zara: art.skinZara,
  ali: art.skinAli,
  hina: art.skinHina,
  omar: art.skinOmar,
} as const;

export const hair = {
  zara: art.hairZara,
  ali: art.hairAli,
  hina: art.hairHina,
  omar: art.hairOmar,
} as const;

/** Face features – same system for everyone. */
export const faceInk = art.ink;
export const blush = art.coral;
