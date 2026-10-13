/**
 * First-launch story: scene config only. ALL copy lives in src/i18n (keys below), so editing a string
 * never touches layout code. Scenes read this to decide who appears, in what mood, and when.
 */
import type { CharacterName, Pose } from '@/characters/types';
import type { Mood } from '@/store/types';

export interface SceneCharacter {
  id: CharacterName;
  pose: Pose;
  mood: Mood;
  /** Horizontal slot in the scene (mirrors in RTL). */
  slot: 'start' | 'center' | 'end';
  /** ms after the scene becomes active that this character enters. */
  enterAt: number;
}

export interface SceneBubble {
  speaker: CharacterName;
  textKey: string;
  /** ms after the scene becomes active – bubbles follow a ~600 ms cadence. */
  delayMs: number;
  tail?: 'start' | 'end';
}

export interface SceneProp {
  kind: 'bench' | 'thought-ali' | 'thought-hina' | 'thought-omar' | 'rays' | 'confetti';
  enterAt: number;
}

export interface SceneConfig {
  id: number;
  /** Background gradient [top, bottom] – muted/greyish while struggling, warm and bright when calm. */
  ambient: { light: [string, string]; dark: [string, string] };
  characters: SceneCharacter[];
  props: SceneProp[];
  bubbles: SceneBubble[];
  titleKey?: string;
  captionKey?: string;
}

export const BUBBLE_STAGGER_MS = 600;

export const scenes: SceneConfig[] = [
  // 0 — Welcome
  {
    id: 0,
    ambient: { light: ['#DCEBDF', '#FAF6EE'], dark: ['#16231D', '#121A16'] },
    characters: [{ id: 'kai', pose: 'wave', mood: 'happy', slot: 'center', enterAt: 400 }],
    props: [],
    bubbles: [],
  },
  // 1 — Sound familiar? (muted, desaturated)
  {
    id: 1,
    ambient: { light: ['#C7CDC8', '#DDE1DC'], dark: ['#1A201D', '#151A18'] },
    titleKey: 'story.s1.title',
    characters: [
      { id: 'ali', pose: 'sit', mood: 'stressed', slot: 'start', enterAt: 0 },
      { id: 'hina', pose: 'sit', mood: 'stressed', slot: 'center', enterAt: 150 },
      { id: 'omar', pose: 'sit', mood: 'stressed', slot: 'end', enterAt: 300 },
    ],
    props: [
      { kind: 'bench', enterAt: 0 },
      { kind: 'thought-ali', enterAt: 500 },
      { kind: 'thought-hina', enterAt: 650 },
      { kind: 'thought-omar', enterAt: 800 },
    ],
    bubbles: [
      { speaker: 'ali', textKey: 'story.s1.ali', delayMs: 900, tail: 'start' },
      { speaker: 'hina', textKey: 'story.s1.hina', delayMs: 900 + BUBBLE_STAGGER_MS, tail: 'start' },
      { speaker: 'omar', textKey: 'story.s1.omar', delayMs: 900 + 2 * BUBBLE_STAGGER_MS, tail: 'end' },
    ],
  },
  // 2 — You're not alone
  {
    id: 2,
    ambient: { light: ['#D3D9D2', '#E6E4DA'], dark: ['#1B221E', '#161C19'] },
    titleKey: 'story.s2.title',
    captionKey: 'story.s2.caption',
    characters: [
      { id: 'ali', pose: 'sit', mood: 'tired', slot: 'start', enterAt: 0 },
      { id: 'hina', pose: 'sit', mood: 'neutral', slot: 'center', enterAt: 0 },
      { id: 'omar', pose: 'sit', mood: 'tired', slot: 'end', enterAt: 0 },
    ],
    props: [{ kind: 'bench', enterAt: 0 }],
    bubbles: [
      { speaker: 'hina', textKey: 'story.s2.hina', delayMs: 700, tail: 'start' },
      { speaker: 'ali', textKey: 'story.s2.ali', delayMs: 700 + BUBBLE_STAGGER_MS, tail: 'start' },
    ],
  },
  // 3 — Zara arrives (warm light enters)
  {
    id: 3,
    ambient: { light: ['#F4E6CB', '#FAF3E3'], dark: ['#2A2418', '#1A1A14'] },
    characters: [
      { id: 'ali', pose: 'sit', mood: 'neutral', slot: 'start', enterAt: 0 },
      { id: 'hina', pose: 'sit', mood: 'neutral', slot: 'center', enterAt: 0 },
      { id: 'omar', pose: 'sit', mood: 'neutral', slot: 'end', enterAt: 0 },
      { id: 'zara', pose: 'stand', mood: 'calm', slot: 'end', enterAt: 600 },
    ],
    props: [
      { kind: 'bench', enterAt: 0 },
      { kind: 'rays', enterAt: 300 },
    ],
    bubbles: [
      { speaker: 'zara', textKey: 'story.s3.zara1', delayMs: 1400, tail: 'end' },
      { speaker: 'zara', textKey: 'story.s3.zara2', delayMs: 1400 + BUBBLE_STAGGER_MS, tail: 'end' },
      { speaker: 'omar', textKey: 'story.s3.omar', delayMs: 1400 + 2 * BUBBLE_STAGGER_MS, tail: 'end' },
      { speaker: 'zara', textKey: 'story.s3.zara3', delayMs: 1400 + 3 * BUBBLE_STAGGER_MS, tail: 'end' },
    ],
  },
  // 4 — Kai's 30-day journey (friends' moods improve as each milestone lights)
  {
    id: 4,
    ambient: { light: ['#DCEBDF', '#F3F8F0'], dark: ['#183025', '#121A16'] },
    titleKey: 'story.s4.title',
    characters: [
      { id: 'kai', pose: 'float', mood: 'happy', slot: 'center', enterAt: 0 },
      { id: 'ali', pose: 'sit', mood: 'stressed', slot: 'start', enterAt: 200 },
      { id: 'hina', pose: 'sit', mood: 'stressed', slot: 'start', enterAt: 350 },
      { id: 'omar', pose: 'sit', mood: 'stressed', slot: 'start', enterAt: 500 },
    ],
    props: [],
    bubbles: [{ speaker: 'kai', textKey: 'story.s4.kai', delayMs: 5200, tail: 'start' }],
  },
  // 5 — Zara's story (Before / Now)
  {
    id: 5,
    ambient: { light: ['#E9E3D3', '#FAF0DC'], dark: ['#1D2320', '#2A2418'] },
    titleKey: 'story.s5.title',
    characters: [
      { id: 'zara', pose: 'stand', mood: 'stressed', slot: 'start', enterAt: 0 },
      { id: 'zara', pose: 'stand', mood: 'calm', slot: 'end', enterAt: 500 },
    ],
    props: [],
    bubbles: [{ speaker: 'zara', textKey: 'story.s5.zara', delayMs: 1400, tail: 'end' }],
  },
  // 6 — What brings you here?
  {
    id: 6,
    ambient: { light: ['#FAF6EE', '#FCE9DF'], dark: ['#121A16', '#2A1E1A'] },
    titleKey: 'story.s6.title',
    characters: [
      { id: 'ali', pose: 'stand', mood: 'happy', slot: 'start', enterAt: 0 },
      { id: 'hina', pose: 'stand', mood: 'happy', slot: 'start', enterAt: 100 },
      { id: 'zara', pose: 'stand', mood: 'happy', slot: 'end', enterAt: 200 },
      { id: 'omar', pose: 'stand', mood: 'happy', slot: 'end', enterAt: 300 },
    ],
    props: [{ kind: 'confetti', enterAt: 600 }],
    bubbles: [],
  },
];

export const SCENE_COUNT = scenes.length;

/** Scene 4 milestones. `friendMood` is the mood the three friends show once the milestone lights up. */
export interface Milestone {
  week: 1 | 2 | 3 | 4;
  titleKey: string;
  subKey: string;
  friendMood: Mood;
  /** ms after the scene becomes active that this node lights. */
  litAt: number;
}

export const milestones: Milestone[] = [
  { week: 1, titleKey: 'story.s4.w1.title', subKey: 'story.s4.w1.sub', friendMood: 'tired', litAt: 1200 },
  { week: 2, titleKey: 'story.s4.w2.title', subKey: 'story.s4.w2.sub', friendMood: 'neutral', litAt: 2100 },
  { week: 3, titleKey: 'story.s4.w3.title', subKey: 'story.s4.w3.sub', friendMood: 'calm', litAt: 3000 },
  { week: 4, titleKey: 'story.s4.w4.title', subKey: 'story.s4.w4.sub', friendMood: 'happy', litAt: 3900 },
];

/** Scene 6 goal cards → matching character icon. */
export const goalCharacter: Record<string, CharacterName | null> = {
  stress: 'zara',
  'back-neck': 'ali',
  sleep: 'hina',
  focus: 'omar',
  flexibility: null,
  balance: null,
  gentle: null,
};
