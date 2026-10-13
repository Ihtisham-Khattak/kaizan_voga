import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { register, storage } from './persist';
import type { CustomRoutine, DownloadItem } from './types';

export interface LastSession {
  contentId: string;
  kind: 'routine' | 'breathing' | 'quick-relief' | 'program-day';
  stepIndex: number;
  elapsedSec: number;
  at: string;
}

interface LibraryState {
  /** Favourited ids, prefixed by kind: "exercise:ex-01", "routine:r-03". */
  favorites: string[];
  recentSearches: string[];
  customRoutines: CustomRoutine[];
  downloads: DownloadItem[];
  lastSession: LastSession | null;

  toggleFavorite: (key: string) => void;
  addRecentSearch: (q: string) => void;
  clearRecentSearches: () => void;
  saveCustomRoutine: (r: CustomRoutine) => void;
  removeCustomRoutine: (id: string) => void;
  setDownload: (d: DownloadItem) => void;
  removeDownload: (id: string) => void;
  setLastSession: (s: LastSession | null) => void;
  reset: () => void;
}

const initial = {
  favorites: [] as string[],
  recentSearches: [] as string[],
  customRoutines: [] as CustomRoutine[],
  downloads: [] as DownloadItem[],
  lastSession: null as LastSession | null,
};

export const useLibraryStore = register(
  create<LibraryState>()(
    persist(
      (set) => ({
        ...initial,
        toggleFavorite: (key) =>
          set((s) => ({
            favorites: s.favorites.includes(key)
              ? s.favorites.filter((k) => k !== key)
              : [key, ...s.favorites],
          })),
        addRecentSearch: (q) => {
          const query = q.trim();
          if (!query) return;
          set((s) => ({
            recentSearches: [query, ...s.recentSearches.filter((x) => x !== query)].slice(0, 8),
          }));
        },
        clearRecentSearches: () => set({ recentSearches: [] }),
        saveCustomRoutine: (r) =>
          set((s) => ({ customRoutines: [r, ...s.customRoutines.filter((x) => x.id !== r.id)] })),
        removeCustomRoutine: (id) =>
          set((s) => ({ customRoutines: s.customRoutines.filter((x) => x.id !== id) })),
        setDownload: (d) => set((s) => ({ downloads: [d, ...s.downloads.filter((x) => x.id !== d.id)] })),
        removeDownload: (id) => set((s) => ({ downloads: s.downloads.filter((x) => x.id !== id) })),
        setLastSession: (lastSession) => set({ lastSession }),
        reset: () => set(initial),
      }),
      { name: 'kz-library', version: 1, storage }
    )
  )
);
