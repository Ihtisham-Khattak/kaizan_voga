/**
 * Kaizen Yoga colour tokens – the single source of truth (docs/UI_Build.md → DESIGN SYSTEM → Colors).
 * Light and Night values are exactly the spec table. Pure data (no React Native imports) so the
 * theme sync script can read it. Components never hard-code hex: use `useTheme().colors`.
 */
export interface Palette {
  /** Main background */
  bg: string;
  /** Alternate sections, list rows, Reduce-Transparency fallback */
  bgMist: string;
  /** Blurred blob behind glass */
  auroraMint: string;
  /** Second blurred blob behind glass */
  auroraSky: string;
  /** Standard glass card fill */
  glass: string;
  /** Glass behind long text, forms, tab bar, sheets */
  glassStrong: string;
  /** 1px edge on every glass panel */
  glassBorder: string;
  /** Headings, logo */
  forest: string;
  /** Body text */
  ink: string;
  /** Secondary text */
  muted: string;
  /** Buttons, selected tab, links */
  primary: string;
  /** Text on primary */
  onPrimary: string;
  /** Icons, progress rings, breathing circle (not body text in light) */
  leaf: string;
  /** Chips, selected states (text on it: forest) */
  mint: string;
  /** Breathing, anxiety relief, inhale cue */
  sky: string;
  skySoft: string;
  /** Sleep, wind-down, evening Home tint */
  lavender: string;
  lavenderSoft: string;
  /** Achievements and celebration only */
  sunrise: string;
  sunriseSoft: string;
  sunriseInk: string;
  /** Dividers, input borders */
  hairline: string;
  /** Safety messages only, never for missed days */
  danger: string;
}

export const lightColors: Palette = {
  bg: '#FFFFFF',
  bgMist: '#F2F8F4',
  auroraMint: '#CDEED9',
  auroraSky: '#D3ECF6',
  glass: 'rgba(255,255,255,0.62)',
  glassStrong: 'rgba(255,255,255,0.84)',
  glassBorder: 'rgba(255,255,255,0.85)',
  forest: '#0F3D2E',
  ink: '#14261D',
  muted: '#5A6B62',
  primary: '#1B7A4B',
  onPrimary: '#FFFFFF',
  leaf: '#2FA866',
  mint: '#E6F4EA',
  sky: '#2E6F8E',
  skySoft: '#DCEEF5',
  lavender: '#6A55C2',
  lavenderSoft: '#ECE8FA',
  sunrise: '#F2A65A',
  sunriseSoft: '#FDEBD9',
  sunriseInk: '#8A4B12',
  hairline: '#E1EBE5',
  danger: '#C2453D',
};

export const nightColors: Palette = {
  bg: '#0B1712',
  bgMist: '#0F1F18',
  auroraMint: '#14382A',
  auroraSky: '#12303D',
  glass: 'rgba(22,40,31,0.60)',
  glassStrong: 'rgba(18,34,27,0.82)',
  glassBorder: 'rgba(255,255,255,0.12)',
  forest: '#E8F2EC',
  ink: '#E8F2EC',
  muted: '#9DB0A5',
  primary: '#4FD18B',
  onPrimary: '#0B1712',
  leaf: '#4FD18B',
  mint: '#173426',
  sky: '#7CC4DE',
  skySoft: '#15303B',
  lavender: '#B9AEF0',
  lavenderSoft: '#231F38',
  sunrise: '#F5B678',
  sunriseSoft: '#33251A',
  sunriseInk: '#F5B678',
  hairline: '#22342B',
  danger: '#F08A80',
};

/**
 * Helpers the spec table does not list but every screen needs. Derived from the table where possible
 * so there is still exactly one palette.
 */
export interface Extras {
  /** Pure white / black for text on photos & illustration highlights. */
  white: string;
  black: string;
  /** Dim layer behind sheets and modals. */
  scrim: string;
  /** Icon / text colour on a `leaf` fill (dark in both modes for AA). */
  onLeaf: string;
  /** Text on a `danger` fill. */
  onDanger: string;
  /** Shadow tint: forest at 10% in Light (spec); plain black in Night, where a pale shadow would glow. */
  shadow: string;
}

export const lightExtras: Extras = {
  white: '#FFFFFF',
  black: '#000000',
  scrim: 'rgba(11,23,18,0.45)',
  onLeaf: lightColors.ink,
  onDanger: lightColors.onPrimary,
  shadow: lightColors.forest,
};

export const nightExtras: Extras = {
  white: '#FFFFFF',
  black: '#000000',
  scrim: 'rgba(0,0,0,0.55)',
  onLeaf: nightColors.bg,
  onDanger: nightColors.bg,
  shadow: '#000000',
};

export type Scheme = 'light' | 'night';
export const palettes: Record<Scheme, Palette> = { light: lightColors, night: nightColors };
export const extras: Record<Scheme, Extras> = { light: lightExtras, night: nightExtras };

/** "#RRGGBB" + alpha (0–1) → "rgba(r,g,b,a)". For soft tints of a token, e.g. `alpha(colors.danger, 0.3)`. */
export function alpha(hex: string, a: number): string {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.replace(/./g, '$&$&') : h, 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

/** "#RRGGBB" → "r g b" (CSS variable channels, so `bg-primary/50` works). */
export function rgbChannels(hex: string): string {
  const n = parseInt(hex.slice(1), 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}
