import { useEffect, useRef } from 'react';

import { useLibraryStore } from '@/store/library-store';

/**
 * MOCK offline download for a routine: animates progress, then marks it downloaded.
 * FN-10 replaces this with real resumable downloads (expo-file-system).
 */
export function useDownload(routineId: string, sizeMb = 24) {
  const item = useLibraryStore((s) => s.downloads.find((d) => d.id === routineId));
  const setDownload = useLibraryStore((s) => s.setDownload);
  const remove = useLibraryStore((s) => s.removeDownload);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => void (timer.current && clearInterval(timer.current)), []);

  const start = () => {
    let p = 0;
    setDownload({ id: routineId, sizeMb, status: 'downloading', progress: 0 });
    timer.current = setInterval(() => {
      p = Math.min(1, p + 0.12);
      setDownload({ id: routineId, sizeMb, status: p >= 1 ? 'downloaded' : 'downloading', progress: p });
      if (p >= 1 && timer.current) clearInterval(timer.current);
    }, 450);
  };

  return {
    status: item?.status ?? 'none',
    progress: item?.progress ?? 0,
    start,
    remove: () => remove(routineId),
  } as const;
}
