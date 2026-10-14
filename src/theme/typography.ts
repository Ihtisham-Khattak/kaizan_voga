/**
 * Type scale (docs/UI_Build.md → Typography). Sizes are pt on iOS and sp on Android – React Native uses the
 * same number for both, scaled by the system font size up to 130% (see Text). Fraunces is for display moments
 * only (28+), Plus Jakarta Sans for all interface text, Noto Nastaliq Urdu for Urdu.
 */
export type Weight = '400' | '500' | '600' | '700';

export const families = {
  display: { '500': 'Fraunces_500Medium', '600': 'Fraunces_600SemiBold' },
  sans: {
    '400': 'PlusJakartaSans_400Regular',
    '500': 'PlusJakartaSans_500Medium',
    '600': 'PlusJakartaSans_600SemiBold',
    '700': 'PlusJakartaSans_700Bold',
  },
  urdu: {
    '400': 'NotoNastaliqUrdu_400Regular',
    '500': 'NotoNastaliqUrdu_500Medium',
    '600': 'NotoNastaliqUrdu_600SemiBold',
    '700': 'NotoNastaliqUrdu_700Bold',
  },
} as const;

export interface TypeStyle {
  family: 'display' | 'sans' | 'urdu';
  size: number;
  lineHeight: number;
  weight: Weight;
  letterSpacing?: number;
  uppercase?: boolean;
  /** Fixed-width digits so countdowns don't jitter. */
  tabular?: boolean;
}

export const typography = {
  display: { family: 'display', size: 34, lineHeight: 40, weight: '600' }, // onboarding titles, plan reveal, session complete
  title1: { family: 'display', size: 28, lineHeight: 34, weight: '600' }, // home greeting, screen titles
  timer: { family: 'display', size: 64, lineHeight: 68, weight: '500', tabular: true }, // countdown, breathing counter
  title2: { family: 'sans', size: 22, lineHeight: 28, weight: '700' }, // section headers
  title3: { family: 'sans', size: 20, lineHeight: 26, weight: '600' }, // card titles, pose names
  bodyLarge: { family: 'sans', size: 17, lineHeight: 26, weight: '400' }, // default reading text, speech bubbles
  body: { family: 'sans', size: 16, lineHeight: 24, weight: '400' }, // descriptions, settings rows
  callout: { family: 'sans', size: 15, lineHeight: 22, weight: '500' }, // meta lines, chips
  button: { family: 'sans', size: 17, lineHeight: 22, weight: '600' }, // all buttons
  footnote: { family: 'sans', size: 13, lineHeight: 18, weight: '500' }, // trust badges, tab labels
  overline: { family: 'sans', size: 12, lineHeight: 16, weight: '700', letterSpacing: 0.8, uppercase: true }, // smallest size
  urduTitle: { family: 'urdu', size: 24, lineHeight: 48, weight: '600' }, // Nastaliq needs ~2× line height
  urduBody: { family: 'urdu', size: 18, lineHeight: 38, weight: '400' },
} as const satisfies Record<string, TypeStyle>;

export type TypeName = keyof typeof typography;

/** Styles that read as headings in Urdu (use urduTitle); everything else uses urduBody. */
export const URDU_HEADINGS: readonly TypeName[] = ['display', 'title1', 'timer', 'title2', 'title3'];

export const familyName = (s: Pick<TypeStyle, 'family' | 'weight'>): string =>
  (families[s.family] as Record<string, string>)[s.weight];
