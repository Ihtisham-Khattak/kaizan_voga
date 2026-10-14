// Shared domain types for persisted user state. Content models (exercises, routines…) live in src/data/types.ts.

export type Language = 'en' | 'ur';
export type ThemePreference = 'light' | 'dark' | 'system';
export type MotionPreference = 'system' | 'reduce' | 'full';

export type Goal = 'stress' | 'back-neck' | 'sleep' | 'focus' | 'flexibility' | 'balance' | 'gentle';
export type Experience = 'beginner' | 'some' | 'experienced';
export type PreferredTime = 'morning' | 'afternoon' | 'evening' | 'varies';
/** ISO weekday: 1 = Monday … 7 = Sunday */
export type Weekday = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type Movement = 'seated' | 'standing' | 'floor' | 'low-impact' | 'mixed';
export type Equipment = 'mat' | 'chair' | 'blocks' | 'strap' | 'cushion' | 'none';
export type Limitation = 'balance' | 'knee' | 'wrist' | 'chair-only' | 'avoid-floor';
export type VoicePreference = 'female' | 'male' | 'none';
export type Ambience = 'rain' | 'forest' | 'piano' | 'none';

/** Same vocabulary as the character `mood` prop so MoodPicker faces match Zara & friends. */
export type Mood = 'stressed' | 'tired' | 'neutral' | 'calm' | 'happy';
export const MOODS: readonly Mood[] = ['stressed', 'tired', 'neutral', 'calm', 'happy'] as const;
export const moodScore = (m: Mood) => MOODS.indexOf(m) + 1;

export type Score = 1 | 2 | 3 | 4 | 5;

export interface MoodLog {
  id: string;
  at: string; // ISO
  mood: Mood;
  context: 'checkin' | 'before' | 'after';
  sessionId?: string;
}

export type ContentKind = 'routine' | 'breathing' | 'quick-relief' | 'program-day';

export interface SessionRecord {
  id: string;
  at: string; // ISO
  contentId: string;
  kind: ContentKind;
  title: string;
  plannedSec: number;
  practicedSec: number;
  posesDone: number;
  completed: boolean;
  moodBefore?: Mood;
  moodAfter?: Mood;
  note?: string;
}

export interface MonthlyReflection {
  id: string;
  at: string; // ISO
  day: number; // journey day (1–30)
  stress: Score;
  sleep: Score;
  energy: Score;
  stiffness: Score;
}

export interface CustomRoutine {
  id: string;
  name: string;
  items: { exerciseId: string; durationSec: number }[];
}

export interface DownloadItem {
  id: string; // routine id
  sizeMb: number;
  status: 'downloading' | 'downloaded';
  progress: number; // 0–1
}

export interface ReminderSettings {
  enabled: boolean;
  time: string; // "HH:mm"
  days: Weekday[];
  quietHours: { enabled: boolean; from: string; to: string };
  /** Gentle chime choice. Optional so older saved state still loads. */
  tone?: 'bell' | 'chime' | 'soft';
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}
