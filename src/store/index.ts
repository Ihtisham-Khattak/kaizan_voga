import { useEffect, useState } from 'react';

import { registry } from './persist';

export * from './app-store';
export * from './auth-store';
export * from './library-store';
export * from './prefs-store';
export * from './progress-store';
export * from './subscription-store';
export * from './types';

/** True once every persisted store has rehydrated from AsyncStorage. Gate the splash on this. */
export function useStoresHydrated() {
  const [ready, setReady] = useState(() => registry.every((s) => s.persist.hasHydrated()));
  useEffect(() => {
    if (ready) return;
    const check = () => registry.every((s) => s.persist.hasHydrated()) && setReady(true);
    const unsubs = registry.map((s) => s.persist.onFinishHydration(check));
    check();
    return () => unsubs.forEach((u) => u());
  }, [ready]);
  return ready;
}

/** "Delete my data": wipe every store and its storage. */
export function resetAllStores() {
  registry.forEach((s) => {
    s.getState().reset();
    s.persist.clearStorage();
  });
}
