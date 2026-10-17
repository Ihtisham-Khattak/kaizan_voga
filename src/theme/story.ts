import { useMemo } from 'react';

import { useTheme } from './theme-provider';

/**
 * Colours for the first-launch story and the plan reveal. There is no separate palette any more: every value is read
 * from the docs/UI_Build.md tokens, so the whole funnel looks like the rest of the app in Light and Night.
 */
export interface StoryColors {
  bg: string;
  title: string;
  body: string;
  muted: string;
  card: string;
  cardBorder: string;
  beforeBg: string;
  beforePic: string;
  afterBg: string;
  afterPic: string;
  chipBg: string;
  chipText: string;
  button: string;
  buttonText: string;
  negative: string;
  positive: string;
  noteBg: string;
  line: string;
  nodeIdle: string;
  nodeActive: string;
  pillBg: string;
  dotOff: string;
  dotOn: string;
  circleBg: string;
  heroBg: string;
}

export function useStoryColors(): StoryColors {
  const { colors: c } = useTheme();
  return useMemo(
    () => ({
      bg: c.bg,
      title: c.forest,
      body: c.ink,
      muted: c.muted,
      card: c.glassStrong,
      cardBorder: c.glassBorder,
      beforeBg: c.bgMist,
      beforePic: c.hairline,
      afterBg: c.mint,
      afterPic: c.bg,
      chipBg: c.mint,
      chipText: c.forest,
      button: c.primary,
      buttonText: c.onPrimary,
      // `danger` is for safety messages only, so "before" states stay quiet
      negative: c.muted,
      positive: c.primary,
      noteBg: c.bgMist,
      line: c.hairline,
      nodeIdle: c.mint,
      nodeActive: c.primary,
      pillBg: c.mint,
      dotOff: c.hairline,
      dotOn: c.primary,
      circleBg: c.mint,
      heroBg: c.mint,
    }),
    [c]
  );
}
