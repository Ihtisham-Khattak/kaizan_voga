import { useEffect, useState } from 'react';
import { AccessibilityInfo, Platform } from 'react-native';

import { useAppStore } from '@/store/app-store';

/**
 * True when glass should render as a solid surface (and aurora blobs should hide): the OS "Reduce Transparency"
 * setting (iOS), or the in-app High contrast mode. Android has no OS equivalent.
 */
export function useReduceTransparency(): boolean {
  const highContrast = useAppStore((s) => s.highContrast);
  const [os, setOs] = useState(false);
  useEffect(() => {
    if (Platform.OS !== 'ios') return;
    AccessibilityInfo.isReduceTransparencyEnabled()
      .then(setOs)
      .catch(() => {});
    const sub = AccessibilityInfo.addEventListener('reduceTransparencyChanged', setOs);
    return () => sub.remove();
  }, []);
  return os || highContrast;
}
