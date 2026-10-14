import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { Platform, Text as RNText, type Role, type TextStyle } from 'react-native';

import { Slot } from '@rn-primitives/slot';

import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/app-store';
import { urduFamily, type Weight } from '@/theme/fonts';

/**
 * Kaizen type scale: 32 / 24 / 20 / 17 / 15 / 13, line-height >= 1.4.
 * Headings use Fraunces (soft serif); everything else Plus Jakarta Sans.
 * Weights are expressed as families (font-sans-medium …) because custom fonts have no synthetic bold on Android.
 */
const textVariants = cva(Platform.select({ web: 'select-text' }), {
  variants: {
    variant: {
      display: 'font-display text-kz-display',
      title: 'font-display text-kz-title',
      heading: 'font-display text-kz-heading',
      lead: 'font-sans text-kz-lead',
      body: 'font-sans text-kz-body',
      label: 'font-sans-semibold text-kz-body',
      caption: 'font-sans text-kz-caption',
      // legacy shadcn aliases so stock RNR components keep working
      default: 'font-sans text-kz-body',
      h1: 'font-display text-kz-display',
      h2: 'font-display text-kz-title',
      h3: 'font-display text-kz-heading',
      h4: 'font-sans-semibold text-kz-lead',
      p: 'font-sans text-kz-body',
      large: 'font-sans-semibold text-kz-lead',
      small: 'font-sans-medium text-kz-caption',
      muted: 'font-sans text-kz-caption',
      blockquote: 'font-sans text-kz-body italic',
      code: 'font-sans text-kz-caption',
    },
  },
  defaultVariants: { variant: 'body' },
});

type TextVariantProps = VariantProps<typeof textVariants>;
type TextVariant = NonNullable<TextVariantProps['variant']>;

const HEADING_LEVEL: Partial<Record<TextVariant, string>> = {
  display: '1',
  h1: '1',
  title: '2',
  h2: '2',
  heading: '3',
  h3: '3',
  h4: '4',
};

const TextClassContext = React.createContext<string | undefined>(undefined);

const URDU_LINE_HEIGHT: Partial<Record<TextVariant, number>> = {
  display: 64,
  h1: 64,
  title: 52,
  h2: 52,
  heading: 44,
  h3: 44,
  lead: 46,
  body: 42,
  p: 42,
  default: 42,
  label: 42,
  h4: 46,
  large: 46,
  caption: 36,
  small: 36,
  muted: 36,
};

function weightFromClass(cls: string): Weight {
  if (/font-(sans|display)-bold/.test(cls)) return '700';
  if (/font-(sans|display)-semibold|font-display(?!-)/.test(cls)) return '600';
  if (/font-(sans|display)-medium/.test(cls)) return '500';
  return '400';
}

function Text({
  className,
  asChild = false,
  variant = 'body',
  style,
  maxFontSizeMultiplier = 1.3, // Dynamic Type up to 130% without breaking layouts
  ...props
}: React.ComponentProps<typeof RNText> &
  React.RefAttributes<RNText> &
  TextVariantProps & { asChild?: boolean }) {
  const textClass = React.useContext(TextClassContext);
  const language = useAppStore((s) => s.language);
  const Component = asChild ? Slot : RNText;
  // Colour: caption/muted stay muted; otherwise the surrounding context (Button, Card…) sets it, defaulting to foreground.
  const isMuted = variant === 'caption' || variant === 'muted';
  const resolved = cn(
    textVariants({ variant }),
    isMuted ? 'text-muted-foreground' : (textClass ?? 'text-foreground'),
    className
  );

  // Urdu: swap every family for Noto Nastaliq at the matching weight. Nastaliq is tall, so it needs generous line-height.
  const urduStyle: TextStyle | undefined =
    language === 'ur'
      ? {
          fontFamily: urduFamily[weightFromClass(resolved)],
          writingDirection: 'rtl',
          lineHeight: URDU_LINE_HEIGHT[variant ?? 'body'] ?? 40,
        }
      : undefined;

  return (
    <Component
      className={resolved}
      style={urduStyle ? [style, urduStyle] : style}
      maxFontSizeMultiplier={maxFontSizeMultiplier}
      role={variant && HEADING_LEVEL[variant] ? ('heading' as Role) : undefined}
      aria-level={variant ? HEADING_LEVEL[variant] : undefined}
      {...props}
    />
  );
}

export { Text, TextClassContext, textVariants };
