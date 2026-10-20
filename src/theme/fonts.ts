// Import each weight from its own entry point: the package root pulls in every weight and style (37 font files)
// even though the app uses ten.
import { Fraunces_500Medium } from '@expo-google-fonts/fraunces/500Medium';
import { Fraunces_600SemiBold } from '@expo-google-fonts/fraunces/600SemiBold';
import { NotoNastaliqUrdu_400Regular } from '@expo-google-fonts/noto-nastaliq-urdu/400Regular';
import { NotoNastaliqUrdu_500Medium } from '@expo-google-fonts/noto-nastaliq-urdu/500Medium';
import { NotoNastaliqUrdu_600SemiBold } from '@expo-google-fonts/noto-nastaliq-urdu/600SemiBold';
import { NotoNastaliqUrdu_700Bold } from '@expo-google-fonts/noto-nastaliq-urdu/700Bold';
import { PlusJakartaSans_400Regular } from '@expo-google-fonts/plus-jakarta-sans/400Regular';
import { PlusJakartaSans_500Medium } from '@expo-google-fonts/plus-jakarta-sans/500Medium';
import { PlusJakartaSans_600SemiBold } from '@expo-google-fonts/plus-jakarta-sans/600SemiBold';
import { PlusJakartaSans_700Bold } from '@expo-google-fonts/plus-jakarta-sans/700Bold';
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

export { families, type Weight } from './typography';
