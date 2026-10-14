const { hairlineWidth } = require('nativewind/theme');
// Colours, type scale, font families and radii are generated from src/theme/*.ts – run `npm run theme:sync`.
const theme = require('./src/theme/tailwind.generated');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  // Text builds `text-kz-<style>` dynamically, so Tailwind can't see these names in the source.
  safelist: Object.keys(theme.fontSize).map((k) => `text-${k}`),
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // shadcn / React Native Reusables semantic tokens (generated, with -foreground pairs)
        border: theme.colors.border,
        input: theme.colors.input,
        ring: theme.colors.ring,
        background: theme.colors.background,
        foreground: theme.colors.foreground,
        primary: { DEFAULT: theme.colors.primary, foreground: theme.colors['primary-foreground'] },
        secondary: { DEFAULT: theme.colors.secondary, foreground: theme.colors['secondary-foreground'] },
        destructive: { DEFAULT: theme.colors.destructive, foreground: theme.colors['destructive-foreground'] },
        muted: { DEFAULT: theme.colors.muted, foreground: theme.colors['muted-foreground'] },
        accent: { DEFAULT: theme.colors.accent, foreground: theme.colors['accent-foreground'] },
        card: { DEFAULT: theme.colors.card, foreground: theme.colors['card-foreground'] },
        popover: { DEFAULT: theme.colors.popover, foreground: theme.colors['popover-foreground'] },
        // Kaizen palette names (colors.ts) as classes: bg-leaf, text-sky, bg-skySoft …
        bg: theme.colors.bg,
        bgMist: theme.colors['bg-mist'],
        forest: theme.colors.forest,
        ink: theme.colors.ink,
        mint: theme.colors.mint,
        leaf: theme.colors.leaf,
        sky: theme.colors.sky,
        skySoft: theme.colors['sky-soft'],
        lavender: theme.colors.lavender,
        lavenderSoft: theme.colors['lavender-soft'],
        sunrise: theme.colors.sunrise,
        sunriseSoft: theme.colors['sunrise-soft'],
        sunriseInk: theme.colors['sunrise-ink'],
        hairline: theme.colors.hairline,
        danger: theme.colors.danger,
        onPrimary: theme.colors['on-primary'],
        onLeaf: theme.colors['on-leaf'],
        onDanger: theme.colors['on-danger'],
      },
      fontFamily: theme.fontFamily,
      fontSize: theme.fontSize,
      borderRadius: theme.borderRadius,
      borderWidth: { hairline: hairlineWidth() },
      keyframes: {
        'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
        'accordion-up': { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
