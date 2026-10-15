import { art } from '@/theme/illustration';

/**
 * Character art is fixed-palette: Hina/Arfa/Hamid/Sierra/Kai must look IDENTICAL in light and dark mode,
 * so nothing here reads the theme.
 */
export type CharacterName = 'hina' | 'arfa' | 'hamid' | 'sierra' | 'kai';

/** One signature colour per character – never changes. */
export const signature: Record<CharacterName, string> = {
  hina: art.lilac, // lilac dupatta
  arfa: art.teal, // teal cardigan
  hamid: art.mustard, // mustard sweater
  sierra: art.coral, // coral knit cardigan
  kai: art.sage, // lotus-leaf sprite
};

/** Warm, harmonious skin-tone family shared by all humans. */
export const skin = {
  hina: art.skinHina,
  arfa: art.skinArfa,
  hamid: art.skinHamid,
  sierra: art.skinSierra,
} as const;

export const hair = {
  hina: art.hairHina,
  arfa: art.hairArfa,
  hamid: art.hairHamid,
  sierra: art.hairSierra,
} as const;

/** Face features – same system for everyone. */
export const faceInk = art.ink;
export const blush = art.coral;
