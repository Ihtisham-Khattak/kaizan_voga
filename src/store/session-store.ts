import { create } from 'zustand';

import type { SessionConfig } from '@/lib/session-plan';
import type { ContentKind } from '@/store/types';

export interface SessionSummary {
  id: string;
  contentId: string;
  kind: ContentKind;
  title: string;
  plannedSec: number;
  practicedSec: number;
  posesDone: number;
  completed: boolean;
}

/** Transient state handed between setup → player → complete (not persisted). */
interface SessionState {
  config: SessionConfig | null;
  summary: SessionSummary | null;
  setConfig: (c: SessionConfig | null) => void;
  setSummary: (s: SessionSummary | null) => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  config: null,
  summary: null,
  setConfig: (config) => set({ config }),
  setSummary: (summary) => set({ summary }),
}));
