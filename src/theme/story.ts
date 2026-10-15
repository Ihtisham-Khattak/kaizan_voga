import { useTheme } from './theme-provider';

/**
 * Story + plan-reveal palette: the warmer cream / deep-green look used for the first-launch story and the plan
 * reveal (a deliberate, approved exception to the app's white/green system in docs/UI_Build.md). Light and Night.
 * Like every other colour it lives in /src/theme so no hex appears in components.
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

export const storyLight: StoryColors = {
  bg: '#FBF7EF',
  title: '#123D2E',
  body: '#3E4F46',
  muted: '#6B7A72',
  card: '#FFFFFF',
  cardBorder: '#EEE8DC',
  beforeBg: '#F4EFE7',
  beforePic: '#E9E4DA',
  afterBg: '#E5F3EA',
  afterPic: '#F3EBDD',
  chipBg: '#CDEBD6',
  chipText: '#1F6B45',
  button: '#1D4C3B',
  buttonText: '#FFFFFF',
  negative: '#C9544B',
  positive: '#2A7D55',
  noteBg: '#F1ECE3',
  line: '#DDD7CB',
  nodeIdle: '#EDE8DE',
  nodeActive: '#1D4C3B',
  pillBg: '#F0EBE1',
  dotOff: '#CFC9BD',
  dotOn: '#1D4C3B',
  circleBg: '#EDE8DE',
  heroBg: '#E3F2E7',
};

export const storyNight: StoryColors = {
  bg: '#0B1712',
  title: '#E8F2EC',
  body: '#C9D6CE',
  muted: '#9DB0A5',
  card: '#12241B',
  cardBorder: '#1E3328',
  beforeBg: '#16231D',
  beforePic: '#1B2A22',
  afterBg: '#173426',
  afterPic: '#1E3A2D',
  chipBg: '#1F4A35',
  chipText: '#7FE0A8',
  button: '#4FD18B',
  buttonText: '#0B1712',
  negative: '#F08A80',
  positive: '#4FD18B',
  noteBg: '#13241B',
  line: '#2A3F34',
  nodeIdle: '#1C2F25',
  nodeActive: '#4FD18B',
  pillBg: '#142A20',
  dotOff: '#3A4F44',
  dotOn: '#4FD18B',
  circleBg: '#142A20',
  heroBg: '#163326',
};

export function useStoryColors(): StoryColors {
  return useTheme().isDark ? storyNight : storyLight;
}
