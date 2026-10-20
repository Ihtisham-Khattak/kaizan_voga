import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage } from 'zustand/middleware';

/** One storage adapter for every store. Swap here (e.g. MMKV) without touching the stores. */
export const storage = createJSONStorage(() => AsyncStorage);

/** Every persisted store registers here so hydration + "delete my data" work across all of them. */
type Registered = {
  persist: {
    hasHydrated: () => boolean;
    onFinishHydration: (fn: () => void) => () => void;
    clearStorage: () => void;
    getOptions: () => { name?: string };
  };
  getState: () => { reset: () => void };
};

export const registry: Registered[] = [];

export function register<T extends Registered>(store: T): T {
  registry.push(store);
  return store;
}

/** The saved state of every store, keyed by its storage name (functions drop out when serialised). Used by "Export my data". */
export function snapshotStores(): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  registry.forEach((s) => {
    const name = s.persist.getOptions().name;
    if (name) out[name] = s.getState();
  });
  return out;
}
