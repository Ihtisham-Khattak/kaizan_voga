import { useReducedMotion as useSystemReducedMotion } from 'react-native-reanimated';

import { useAppStore } from '@/store';

/**
 * True when movement should be replaced with plain fades.
 * Follows the OS "Reduce Motion" setting unless the user overrode it in Settings → Accessibility.
 */
export function useReduceMotion(): boolean {
  const system = useSystemReducedMotion();
  const pref = useAppStore((s) => s.motion);
  if (pref === 'reduce') return true;
  if (pref === 'full') return false;
  return system;
}
