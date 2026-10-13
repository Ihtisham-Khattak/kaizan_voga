/**
 * Kaizen design tokens as plain values, for places className can't reach
 * (SVG fills, Reanimated colours, navigation theme).
 *
 * KEEP IN SYNC with the CSS variables in src/global.css – that file is what `className` reads.
 */

export interface Tokens {
  // shadcn semantic
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  border: string;
  input: string;
  ring: string;
  // Kaizen brand
  forest: string;
  sage: string;
  mint: string;
  cream: string;
  sand: string;
  coral: string;
  lavender: string;
  ink: string;
  mutedText: string;
}

export const lightTokens: Tokens = {
  background: '#FAF6EE',
  foreground: '#24302A',
  card: '#FFFDF8',
  cardForeground: '#24302A',
  popover: '#FFFDF8',
  primary: '#1F4D3A',
  primaryForeground: '#FAF6EE',
  secondary: '#DCEBDF',
  secondaryForeground: '#1F4D3A',
  muted: '#F1ECE0',
  mutedForeground: '#6F7A73',
  accent: '#6E9C7F',
  accentForeground: '#121A16',
  destructive: '#C8463C',
  border: '#E4DDCD',
  input: '#E4DDCD',
  ring: '#6E9C7F',
  forest: '#1F4D3A',
  sage: '#6E9C7F',
  mint: '#DCEBDF',
  cream: '#FAF6EE',
  sand: '#EED9B7',
  coral: '#E98A6B',
  lavender: '#B9AEE0',
  ink: '#24302A',
  mutedText: '#6F7A73',
};

export const darkTokens: Tokens = {
  background: '#121A16',
  foreground: '#EEF0EA',
  card: '#1C2620',
  cardForeground: '#EEF0EA',
  popover: '#1C2620',
  primary: '#8FBFA0',
  primaryForeground: '#121A16',
  secondary: '#26352E',
  secondaryForeground: '#DCEBDF',
  muted: '#26322B',
  mutedForeground: '#A0ACA4',
  accent: '#6E9C7F',
  accentForeground: '#EEF0EA',
  destructive: '#E66E64',
  border: '#2C3A32',
  input: '#2C3A32',
  ring: '#8FBFA0',
  forest: '#8FBFA0',
  sage: '#8FBFA0',
  mint: '#26352E',
  cream: '#121A16',
  sand: '#5C503C',
  coral: '#F0967A',
  lavender: '#968CC8',
  ink: '#EEF0EA',
  mutedText: '#A0ACA4',
};

/** Fixed (non-theme-switching) brand colours – use for illustrations that must look identical in both modes. */
export const brand = {
  forest: '#1F4D3A',
  sage: '#6E9C7F',
  mint: '#DCEBDF',
  cream: '#FAF6EE',
  sand: '#EED9B7',
  coral: '#E98A6B',
  lavender: '#B9AEE0',
  ink: '#24302A',
  muted: '#6F7A73',
  darkBg: '#121A16',
  darkCard: '#1C2620',
} as const;

/** 8-pt grid */
export const space = { 0: 0, 1: 4, 2: 8, 3: 12, 4: 16, 5: 24, 6: 32, 7: 40, 8: 48, 9: 64 } as const;
export const GUTTER = 16;

export const radius = { sm: 12, md: 16, card: 24, pill: 999 } as const;

/** Soft, low-opacity, large-blur shadows. iOS uses shadow*, Android falls back to elevation. */
export const shadows = {
  soft: {
    shadowColor: '#1F4D3A',
    shadowOpacity: 0.08,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  lifted: {
    shadowColor: '#1F4D3A',
    shadowOpacity: 0.14,
    shadowRadius: 32,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },
} as const;

/** Minimum touch target (WCAG / platform guidance). */
export const MIN_TOUCH = 44;
