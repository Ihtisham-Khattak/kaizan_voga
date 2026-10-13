import { brand } from '@/theme/tokens';

/**
 * Character art is fixed-palette: Zara/Ali/Hina/Omar/Kai must look IDENTICAL in light and dark mode,
 * so nothing here reads the theme.
 */
export type CharacterName = 'zara' | 'ali' | 'hina' | 'omar' | 'kai';

/** One signature colour per character – never changes. */
export const signature: Record<CharacterName, string> = {
  zara: '#2FA4A0', // teal top
  ali: '#E2B13C', // mustard hoodie
  hina: brand.lavender, // lavender scarf / dupatta
  omar: brand.coral, // coral t-shirt
  kai: brand.sage, // lotus-leaf sprite
};

/** Warm, harmonious skin-tone family shared by all humans. */
export const skin = {
  zara: '#E8B48F',
  ali: '#C98F68',
  hina: '#D9A27B',
  omar: '#F0C3A0',
} as const;

export const hair = {
  zara: '#3B2A22',
  ali: '#2B2420',
  hina: '#2F2420',
  omar: '#4A3226',
} as const;

/** Face features – same system for everyone. */
export const faceInk = '#24302A';
export const blush = '#E98A6B';
