import { DevSettings, I18nManager, Platform } from 'react-native';

import type { Language } from '@/store/types';

export const isRtlLanguage = (lang: Language) => lang === 'ur';

/**
 * Make the native layout direction match the language.
 *
 * React Native only picks up a direction change after a JS reload. Returns `true` when the
 * app must be restarted for the layout to flip (the caller shows a "Restart to apply" notice).
 * In dev we reload automatically; in production the user relaunches (or add expo-updates → reloadAsync).
 */
export function applyDirection(lang: Language): boolean {
  if (Platform.OS === 'web') return false;
  const rtl = isRtlLanguage(lang);
  I18nManager.allowRTL(rtl);
  I18nManager.swapLeftAndRightInRTL(true);
  if (I18nManager.isRTL === rtl) return false;
  I18nManager.forceRTL(rtl);
  if (__DEV__) DevSettings.reload();
  return true;
}

/** Use for directional glyphs (back arrow, chevrons, "next"). Do NOT use for play/pause or media timelines. */
export const flipIfRtl = I18nManager.isRTL ? { transform: [{ scaleX: -1 }] } : undefined;
