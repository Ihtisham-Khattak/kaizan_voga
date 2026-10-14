/** Spacing scale (docs/UI_Build.md → Shape & spacing): 4 / 8 / 12 / 16 / 24 / 32 / 48, with 16px side gutters. */
export const spacing = { 1: 4, 2: 8, 3: 12, 4: 16, 5: 24, 6: 32, 7: 48 } as const;
export type SpacingKey = keyof typeof spacing;

/** Screen side gutter. */
export const GUTTER = 16;

/** Minimum touch target (WCAG / platform guidance). */
export const MIN_TOUCH = 44;
