import { useEffect, useState } from 'react';

import { useUiStore } from '@/store/ui-store';

/**
 * True for a brief moment when a screen first appears (so the skeleton is part of the feel), and for as long as
 * the dev toggle "force loading" is on. Phase 2 replaces the timer with real fetch state (FN-03).
 */
export function useScreenLoading(ms = 300): boolean {
  const forced = useUiStore((s) => s.forceLoading);
  const [waiting, setWaiting] = useState(true);
  useEffect(() => {
    const id = setTimeout(() => setWaiting(false), ms);
    return () => clearTimeout(id);
  }, [ms]);
  return forced || waiting;
}
