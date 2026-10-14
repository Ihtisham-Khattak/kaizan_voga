/**
 * Compatibility layer: the semantic names (background, card, secondary, sage…) that className and older code use,
 * derived from the new palette in colors.ts. New code should prefer `useTheme().colors` (colors.ts names).
 * Pure data – read by the theme sync script (scripts/sync-theme.ts) to generate src/global.css.
 */
import { extras, palettes, type Extras, type Palette, type Scheme } from './colors';

export { GUTTER, MIN_TOUCH } from './spacing';

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
  destructiveForeground: string;
  border: string;
  input: string;
  ring: string;
  // legacy brand names → new palette
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

export function toTokens(p: Palette, e: Extras): Tokens {
  return {
    background: p.bg,
    foreground: p.ink,
    card: p.bgMist,
    cardForeground: p.ink,
    popover: p.bg,
    primary: p.primary,
    primaryForeground: p.onPrimary,
    secondary: p.mint,
    secondaryForeground: p.forest,
    muted: p.bgMist,
    mutedForeground: p.muted,
    accent: p.leaf,
    accentForeground: e.onLeaf,
    destructive: p.danger,
    destructiveForeground: e.onDanger,
    border: p.hairline,
    input: p.hairline,
    ring: p.leaf,
    forest: p.forest,
    sage: p.leaf,
    mint: p.mint,
    cream: p.bg,
    sand: p.sunriseSoft,
    coral: p.sunrise,
    lavender: p.lavender,
    ink: p.ink,
    mutedText: p.muted,
  };
}

export const lightTokens = toTokens(palettes.light, extras.light);
export const darkTokens = toTokens(palettes.night, extras.night);
export const tokensFor = (s: Scheme) => (s === 'night' ? darkTokens : lightTokens);
