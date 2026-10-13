import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

import { useAppStore } from '@/store/app-store';

const enabled = () => Platform.OS !== 'web' && useAppStore.getState().haptics;

/** Soft, sparing haptics – respects the Settings toggle. */
export const haptic = {
  /** Selecting a chip / card / tab. */
  select: () => enabled() && Haptics.selectionAsync().catch(() => {}),
  /** Pressing a primary action. */
  light: () => enabled() && Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {}),
  /** Session finished, achievement unlocked. */
  success: () => enabled() && Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {}),
  /** Gentle heads-up (never harsh). */
  warning: () => enabled() && Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {}),
};
