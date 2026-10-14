import { alpha, type Extras, type Palette } from './colors';

/**
 * Resolves a `text-<token>` (optionally `/alpha`) class to an actual colour from the palette.
 * Icons need a real colour value: on web, Phosphor's SVG keeps its default black fill unless `color` is set,
 * so className colours alone are not enough. Returns undefined when the classes carry no colour token.
 */
export function resolveClassColor(classes: string, c: Palette, e: Extras): string | undefined {
  const table: Record<string, string> = {
    foreground: c.ink,
    ink: c.ink,
    'card-foreground': c.ink,
    muted: c.muted,
    'muted-foreground': c.muted,
    primary: c.primary,
    'primary-foreground': c.onPrimary,
    onPrimary: c.onPrimary,
    secondary: c.mint,
    'secondary-foreground': c.forest,
    forest: c.forest,
    leaf: c.leaf,
    onLeaf: e.onLeaf,
    sky: c.sky,
    lavender: c.lavender,
    sunrise: c.sunrise,
    sunriseInk: c.sunriseInk,
    danger: c.danger,
    destructive: c.danger,
    accent: c.leaf,
    'accent-foreground': e.onLeaf,
    background: c.bg,
  };
  let found: string | undefined;
  for (const m of classes.matchAll(/(?:^|\s)text-([A-Za-z-]+?)(?:\/(\d{1,3}))?(?=\s|$)/g)) {
    const key = m[1];
    if (key.startsWith('kz-') || !(key in table)) continue;
    found = m[2] ? alpha(table[key], Number(m[2]) / 100) : table[key];
  }
  return found;
}
