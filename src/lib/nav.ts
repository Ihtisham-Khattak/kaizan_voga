import { router, type Href } from 'expo-router';

import { gate } from '@/lib/entitlement';
import { resolveRoutine } from '@/lib/routines';

/** One place for "go to X" so screens never hand-build URLs. */
export const openPose = (id: string) => router.push(`/pose/${id}` as Href);
export const openRoutine = (id: string) => router.push(`/routine/${id}` as Href);
export const openProgram = (id: string) => router.push(`/program/${id}` as Href);
/** Premium-aware: locked routines open the upsell sheet instead (the starter session and quick relief are never locked). */
export const startSession = (routineId: string) => {
  const r = resolveRoutine(routineId);
  if (r && !gate({ kind: 'content', id: r.id, premium: r.premium, contentKind: r.kind })) return;
  router.push({ pathname: '/session/setup', params: { routineId } } as Href);
};
export const startBreathing = (id?: string) => router.push((id ? `/breathing/${id}` : '/breathing') as Href);
export const openCollection = (kind: 'style' | 'category' | 'collection', id: string) =>
  router.push(`/library/${kind}/${id}` as Href);
export const openSearch = (params?: Record<string, string>) =>
  router.push({ pathname: '/search', params } as Href);
export const openStyles = () => router.push('/library/styles' as Href);
export const openPrograms = () => router.push('/library/programs' as Href);
export const openFavorites = () => router.push('/favorites' as Href);
