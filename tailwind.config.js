const { hairlineWidth } = require('nativewind/theme');

const rgb = (name) => `rgb(var(--${name}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // shadcn / React Native Reusables semantic tokens
        border: rgb('border'),
        input: rgb('input'),
        ring: rgb('ring'),
        background: rgb('background'),
        foreground: rgb('foreground'),
        primary: { DEFAULT: rgb('primary'), foreground: rgb('primary-foreground') },
        secondary: { DEFAULT: rgb('secondary'), foreground: rgb('secondary-foreground') },
        destructive: { DEFAULT: rgb('destructive'), foreground: rgb('destructive-foreground') },
        muted: { DEFAULT: rgb('muted'), foreground: rgb('muted-foreground') },
        accent: { DEFAULT: rgb('accent'), foreground: rgb('accent-foreground') },
        card: { DEFAULT: rgb('card'), foreground: rgb('card-foreground') },
        popover: { DEFAULT: rgb('popover'), foreground: rgb('popover-foreground') },
        // Kaizen brand palette (dark-mode aware via CSS variables)
        forest: rgb('forest'),
        sage: rgb('sage'),
        mint: rgb('mint'),
        cream: rgb('cream'),
        sand: rgb('sand'),
        coral: rgb('coral'),
        lavender: rgb('lavender'),
        ink: rgb('ink'),
        muted_text: rgb('muted-text'),
      },
      fontFamily: {
        display: ['Fraunces_600SemiBold'],
        'display-medium': ['Fraunces_500Medium'],
        sans: ['PlusJakartaSans_400Regular'],
        'sans-medium': ['PlusJakartaSans_500Medium'],
        'sans-semibold': ['PlusJakartaSans_600SemiBold'],
        'sans-bold': ['PlusJakartaSans_700Bold'],
      },
      fontSize: {
        // 32 / 24 / 20 / 17 / 15 / 13, line-height >= 1.4
        'kz-display': ['32px', { lineHeight: '45px' }],
        'kz-title': ['24px', { lineHeight: '34px' }],
        'kz-heading': ['20px', { lineHeight: '28px' }],
        'kz-lead': ['17px', { lineHeight: '25px' }],
        'kz-body': ['15px', { lineHeight: '22px' }],
        'kz-caption': ['13px', { lineHeight: '19px' }],
      },
      borderRadius: {
        card: '24px',
        pill: '999px',
      },
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
