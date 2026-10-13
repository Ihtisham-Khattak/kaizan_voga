import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * tailwind-merge must know our custom type scale and font families, otherwise `text-kz-heading`
 * (a font size) is mistaken for a text *colour* and gets dropped when a colour class follows it.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: ['kz-display', 'kz-title', 'kz-heading', 'kz-lead', 'kz-body', 'kz-caption'] }],
      'font-family': [{ font: ['display', 'display-medium', 'sans', 'sans-medium', 'sans-semibold', 'sans-bold'] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
