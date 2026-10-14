import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * tailwind-merge must know our custom type scale and font families, otherwise `text-kz-title3`
 * (a font size) is mistaken for a text *colour* and gets dropped when a colour class follows it.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      // the type scale in src/theme/typography.ts (generated into tailwind.config via scripts/sync-theme.ts)
      'font-size': [
        {
          text: [
            'kz-display',
            'kz-title1',
            'kz-timer',
            'kz-title2',
            'kz-title3',
            'kz-body-large',
            'kz-body',
            'kz-callout',
            'kz-button',
            'kz-footnote',
            'kz-overline',
            'kz-urdu-title',
            'kz-urdu-body',
          ],
        },
      ],
      'font-family': [
        { font: ['display', 'display-medium', 'sans', 'sans-medium', 'sans-semibold', 'sans-bold'] },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
