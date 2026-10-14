import { router, type Href } from 'expo-router';

/** One place for "go to X" so screens never hand-build URLs. */
export const openPose = (id: string) => router.push(`/pose/${id}` as Href);
export const openRoutine = (id: string) => router.push(`/routine/${id}` as Href);
export const openProgram = (id: string) => router.push(`/program/${id}` as Href);
export const startSession = (routineId: string) =>
  router.push({ pathname: '/session/setup', params: { routineId } } as Href);
export const startBreathing = (id?: string) => router.push((id ? `/breathing/${id}` : '/breathing') as Href);
export const openCollection = (kind: 'style' | 'category' | 'collection', id: string) =>
  router.push(`/library/${kind}/${id}` as Href);
export const openSearch = (params?: Record<string, string>) =>
  router.push({ pathname: '/search', params } as Href);
