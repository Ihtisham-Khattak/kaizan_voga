import { Fraunces_500Medium, Fraunces_600SemiBold } from '@expo-google-fonts/fraunces';
import {
  NotoNastaliqUrdu_400Regular,
  NotoNastaliqUrdu_500Medium,
  NotoNastaliqUrdu_600SemiBold,
  NotoNastaliqUrdu_700Bold,
} from '@expo-google-fonts/noto-nastaliq-urdu';
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from '@expo-google-fonts/plus-jakarta-sans';
import { useFonts } from 'expo-font';

/** Load once in the root layout; hold the splash screen until `true`. */
export function useAppFonts() {
  const [loaded, error] = useFonts({
    Fraunces_500Medium,
    Fraunces_600SemiBold,
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    NotoNastaliqUrdu_400Regular,
    NotoNastaliqUrdu_500Medium,
    NotoNastaliqUrdu_600SemiBold,
    NotoNastaliqUrdu_700Bold,
  });
  // Never block the app forever on a font error – fall back to system fonts.
  return loaded || !!error;
}

export type Weight = '400' | '500' | '600' | '700';

/** Family for a given script + weight. Custom fonts need one family per weight on Android. */
export const urduFamily: Record<Weight, string> = {
  '400': 'NotoNastaliqUrdu_400Regular',
  '500': 'NotoNastaliqUrdu_500Medium',
  '600': 'NotoNastaliqUrdu_600SemiBold',
  '700': 'NotoNastaliqUrdu_700Bold',
};
