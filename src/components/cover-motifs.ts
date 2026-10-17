import {
  Armchair,
  Feather,
  Flower,
  Heart,
  Lightning,
  Moon,
  MoonStars,
  Plant,
  Scales,
  PersonSimpleTaiChi,
  Sun,
  SunHorizon,
  Waves,
  Wind,
  type Icon,
} from 'phosphor-react-native';

import type { ProgramTheme, StyleId } from '@/data/types';

/**
 * One recognisable motif per style and program theme. They stand in for photography until real pictures are added
 * (docs: UI-10): same tinted cover, but each card is told apart at a glance.
 */
export const STYLE_MOTIF: Record<StyleId, Icon> = {
  hatha: Sun,
  vinyasa: Waves,
  yin: MoonStars,
  restorative: Flower,
  power: Lightning,
  gentle: Feather,
  chair: Armchair,
  prenatal: Heart,
  'mobility-balance': Scales,
  'breathing-mindfulness': Wind,
};

export const PROGRAM_MOTIF: Record<ProgramTheme, Icon> = {
  beginners: Plant,
  flexibility: PersonSimpleTaiChi,
  stress: Wind,
  sleep: Moon,
  strength: Lightning,
  mobility: SunHorizon,
};
