import { getRoutine, getExercise, type Routine } from '@/data/repo';
import { useLibraryStore } from '@/store/library-store';
import type { CustomRoutine, Equipment } from '@/store/types';

const uid = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

/** A user-built routine, expressed as a normal Routine so setup/player/detail screens can treat it uniformly. */
export function customToRoutine(c: CustomRoutine): Routine {
  const steps = c.items.map((i) => ({
    exerciseId: i.exerciseId,
    durationSec: i.durationSec,
    phase: 'main' as const,
  }));
  const exs = c.items.map((i) => getExercise(i.exerciseId)).filter(Boolean);
  return {
    id: `custom:${c.id}`,
    kind: 'routine',
    title: c.name,
    subtitle: `${c.items.length}`,
    description: '',
    goals: [],
    level: 'beginner',
    style: 'gentle',
    steps,
    totalSec: steps.reduce((n, s) => n + s.durationSec, 0),
    equipment: [...new Set(exs.flatMap((e) => e.tags.equipment))] as Equipment[],
    chairFriendly: exs.length > 0 && exs.every((e) => e.tags.accessibility.includes('chair-friendly')),
    premium: false,
    cover: 'sand',
  };
}

/** Looks up library routines AND "custom:<id>" routines. */
export function resolveRoutine(id: string): Routine | undefined {
  if (id.startsWith('custom:')) {
    const c = useLibraryStore.getState().customRoutines.find((r) => `custom:${r.id}` === id);
    return c ? customToRoutine(c) : undefined;
  }
  return getRoutine(id);
}

export function createCustomRoutine(name: string): CustomRoutine {
  const routine: CustomRoutine = { id: uid(), name: name.trim() || 'My routine', items: [] };
  useLibraryStore.getState().saveCustomRoutine(routine);
  return routine;
}

export function addPoseToRoutine(routineId: string, exerciseId: string) {
  const store = useLibraryStore.getState();
  const r = store.customRoutines.find((x) => x.id === routineId);
  if (!r) return;
  const dur = getExercise(exerciseId)?.durationSec ?? 45;
  store.saveCustomRoutine({ ...r, items: [...r.items, { exerciseId, durationSec: dur }] });
}
