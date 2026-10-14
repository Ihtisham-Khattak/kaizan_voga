import { cva } from 'class-variance-authority';
import * as React from 'react';
import { Platform, Text as RNText, type Role, type TextStyle } from 'react-native';

import { Slot } from '@rn-primitives/slot';

import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/app-store';
import {
  URDU_HEADINGS,
  families,
  typography,
  type TypeName,
  type TypeStyle,
  type Weight,
} from '@/theme/typography';

/**
 * Text variants = the type table in docs/UI_Build.md (src/theme/typography.ts).
 *   display · title1 · timer · title2 · title3 · bodyLarge · body · callout · button · footnote · overline
 * Legacy names stay as aliases so older screens keep working:
 *   title→title2 · heading→title3 · lead→bodyLarge · label→callout (semibold) · caption→footnote
 */
type Variant =
  | TypeName
  | 'title'
  | 'heading'
  | 'lead'
  | 'label'
  | 'caption'
  | 'default'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'p'
  | 'large'
  | 'small'
  | 'muted'
  | 'blockquote'
  | 'code';

const ALIAS: Record<Exclude<Variant, TypeName>, TypeName> = {
  title: 'title2',
  heading: 'title3',
  lead: 'bodyLarge',
  label: 'callout',
  caption: 'footnote',
  default: 'body',
  h1: 'display',
  h2: 'title1',
  h3: 'title3',
  h4: 'bodyLarge',
  p: 'body',
  large: 'bodyLarge',
  small: 'footnote',
  muted: 'footnote',
  blockquote: 'bodyLarge',
  code: 'footnote',
};

const kebab = (s: string) => s.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase());

/** Tailwind classes for a type style (font family per weight + generated size/line-height). */
function classesFor(name: TypeName, s: TypeStyle): string {
  const fam =
    s.family === 'display'
      ? s.weight === '500'
        ? 'font-display-medium'
        : 'font-display'
      : s.weight === '400'
        ? 'font-sans'
        : `font-sans-${s.weight === '500' ? 'medium' : s.weight === '600' ? 'semibold' : 'bold'}`;
  return cn(fam, `text-kz-${kebab(name)}`, s.uppercase && 'uppercase');
}

const variants = Object.fromEntries(
  (Object.keys(typography) as TypeName[]).map((n) => [n, classesFor(n, typography[n])])
) as Record<TypeName, string>;
const textVariants = cva(Platform.select({ web: 'select-text' }), { variants: { variant: variants } });

const HEADING_LEVEL: Partial<Record<TypeName, string>> = {
  display: '1',
  title1: '1',
  title2: '2',
  title3: '3',
};
/** Styles that read as secondary text unless the surrounding context sets a colour. */
const MUTED: readonly TypeName[] = ['footnote', 'overline'];

const TextClassContext = React.createContext<string | undefined>(undefined);

function weightFromClass(cls: string): Weight {
  if (/font-(sans|display)-bold/.test(cls)) return '700';
  if (/font-(sans|display)-semibold|font-display(?!-)/.test(cls)) return '600';
  if (/font-(sans|display)-medium|font-display-medium/.test(cls)) return '500';
  return '400';
}

/** Urdu: Nastaliq swaps every family and needs ~2× line height (urduTitle 24/48, urduBody 18/38). */
function urduMetrics(name: TypeName, s: TypeStyle): { fontSize: number; lineHeight: number } {
  if (URDU_HEADINGS.includes(name))
    return { fontSize: typography.urduTitle.size, lineHeight: typography.urduTitle.lineHeight };
  if (name === 'bodyLarge' || name === 'body' || name === 'callout')
    return { fontSize: typography.urduBody.size, lineHeight: typography.urduBody.lineHeight };
  // button / footnote / overline keep their (smaller) size, with the same ~2.1× line height
  return { fontSize: s.size, lineHeight: Math.round(s.size * 2.1) };
}

function Text({
  className,
  asChild = false,
  variant = 'body',
  style,
  maxFontSizeMultiplier = 1.3, // Dynamic Type up to 130% without breaking layouts
  maxScale,
  ...props
}: React.ComponentProps<typeof RNText> &
  React.RefAttributes<RNText> & {
    variant?: Variant;
    asChild?: boolean;
    /** Cap the in-app Text size setting for fixed-width labels (e.g. tab labels). */
    maxScale?: number;
  }) {
  const textClass = React.useContext(TextClassContext);
  const language = useAppStore((s) => s.language);
  const setting = useAppStore((s) => s.textScale);
  const scale = maxScale ? Math.min(setting, maxScale) : setting;
  const Component = asChild ? Slot : RNText;

  const name: TypeName =
    variant in typography ? (variant as TypeName) : ALIAS[variant as Exclude<Variant, TypeName>];
  const spec = typography[name];
  const isLabel = variant === 'label';
  const resolved = cn(
    textVariants({ variant: name }),
    isLabel && 'font-sans-semibold',
    MUTED.includes(name) || variant === 'caption' || variant === 'muted'
      ? 'text-muted-foreground'
      : (textClass ?? 'text-foreground'),
    className
  );

  const rtl = language === 'ur';
  const urdu = rtl ? urduMetrics(name, spec) : null;
  const base = urdu ?? { fontSize: spec.size, lineHeight: spec.lineHeight };
  const dynamic: TextStyle = {};
  if (rtl) {
    dynamic.fontFamily = families.urdu[weightFromClass(resolved)];
    dynamic.writingDirection = 'rtl';
  }
  if (rtl || scale !== 1) {
    dynamic.fontSize = Math.round(base.fontSize * scale);
    dynamic.lineHeight = Math.round(base.lineHeight * scale);
  }
  if ('tabular' in spec && spec.tabular) dynamic.fontVariant = ['tabular-nums'];
  const merged = Object.keys(dynamic).length ? [style, dynamic] : style;

  return (
    <Component
      className={resolved}
      style={merged}
      maxFontSizeMultiplier={maxFontSizeMultiplier}
      role={HEADING_LEVEL[name] ? ('heading' as Role) : undefined}
      aria-level={HEADING_LEVEL[name]}
      {...props}
    />
  );
}

export { Text, TextClassContext, textVariants };
