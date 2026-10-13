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
  };
  getState: () => { reset: () => void };
};

export const registry: Registered[] = [];

export function register<T extends Registered>(store: T): T {
  registry.push(store);
  return store;
}
