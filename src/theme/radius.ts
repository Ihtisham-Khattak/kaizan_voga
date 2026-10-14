/** Radii (docs/UI_Build.md → Shape & spacing): inputs 12 · cards 20 · hero glass, sheets, tab bar 28 · buttons, chips 999. */
export const radius = { input: 12, card: 20, hero: 28, pill: 999 } as const;
export type RadiusKey = keyof typeof radius;
