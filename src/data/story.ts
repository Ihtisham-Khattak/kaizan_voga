/**
 * First-launch story: scene config only. ALL copy lives in src/i18n (keys below), so editing a string
 * never touches layout code. Scenes read this to decide who appears, in what mood, and when.
 */
import type { CharacterName, Pose } from '@/characters/types';
import type { Mood } from '@/store/types';
import { art } from '@/theme/illustration';

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
  kind: 'bench' | 'thought-hamid' | 'thought-hina' | 'thought-sierra' | 'rays' | 'confetti';
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
    ambient: { light: [art.mint, art.cream], dark: [art.c16231D, art.night] },
    characters: [{ id: 'kai', pose: 'wave', mood: 'happy', slot: 'center', enterAt: 400 }],
    props: [],
    bubbles: [],
  },
  // 1 — Sound familiar? (muted, desaturated)
  {
    id: 1,
    ambient: { light: [art.cC7CDC8, art.cDDE1DC], dark: [art.c1A201D, art.c151A18] },
    titleKey: 'story.s1.title',
    characters: [
      { id: 'hamid', pose: 'sit', mood: 'stressed', slot: 'start', enterAt: 0 },
      { id: 'hina', pose: 'sit', mood: 'stressed', slot: 'center', enterAt: 150 },
      { id: 'sierra', pose: 'sit', mood: 'stressed', slot: 'end', enterAt: 300 },
    ],
    props: [
      { kind: 'bench', enterAt: 0 },
      { kind: 'thought-hamid', enterAt: 500 },
      { kind: 'thought-hina', enterAt: 650 },
      { kind: 'thought-sierra', enterAt: 800 },
    ],
    bubbles: [
      { speaker: 'hamid', textKey: 'story.s1.hamid', delayMs: 900, tail: 'start' },
      { speaker: 'hina', textKey: 'story.s1.hina', delayMs: 900 + BUBBLE_STAGGER_MS, tail: 'start' },
      { speaker: 'sierra', textKey: 'story.s1.sierra', delayMs: 900 + 2 * BUBBLE_STAGGER_MS, tail: 'end' },
    ],
  },
  // 2 — You're not alone
  {
    id: 2,
    ambient: { light: [art.cD3D9D2, art.cE6E4DA], dark: [art.c1B221E, art.c161C19] },
    titleKey: 'story.s2.title',
    captionKey: 'story.s2.caption',
    characters: [
      { id: 'hamid', pose: 'sit', mood: 'tired', slot: 'start', enterAt: 0 },
      { id: 'hina', pose: 'sit', mood: 'neutral', slot: 'center', enterAt: 0 },
      { id: 'sierra', pose: 'sit', mood: 'tired', slot: 'end', enterAt: 0 },
    ],
    props: [{ kind: 'bench', enterAt: 0 }],
    bubbles: [
      { speaker: 'hina', textKey: 'story.s2.hina', delayMs: 700, tail: 'start' },
      { speaker: 'hamid', textKey: 'story.s2.hamid', delayMs: 700 + BUBBLE_STAGGER_MS, tail: 'start' },
    ],
  },
  // 3 — Arfa arrives (warm light enters)
  {
    id: 3,
    ambient: { light: [art.cF4E6CB, art.cFAF3E3], dark: [art.warmNight, art.c1A1A14] },
    characters: [
      { id: 'hamid', pose: 'sit', mood: 'neutral', slot: 'start', enterAt: 0 },
      { id: 'hina', pose: 'sit', mood: 'neutral', slot: 'center', enterAt: 0 },
      { id: 'sierra', pose: 'sit', mood: 'neutral', slot: 'end', enterAt: 0 },
      { id: 'arfa', pose: 'stand', mood: 'calm', slot: 'end', enterAt: 600 },
    ],
    props: [
      { kind: 'bench', enterAt: 0 },
      { kind: 'rays', enterAt: 300 },
    ],
    bubbles: [
      { speaker: 'arfa', textKey: 'story.s3.arfa1', delayMs: 1400, tail: 'end' },
      { speaker: 'arfa', textKey: 'story.s3.arfa2', delayMs: 1400 + BUBBLE_STAGGER_MS, tail: 'end' },
      { speaker: 'sierra', textKey: 'story.s3.sierra', delayMs: 1400 + 2 * BUBBLE_STAGGER_MS, tail: 'end' },
      { speaker: 'arfa', textKey: 'story.s3.arfa3', delayMs: 1400 + 3 * BUBBLE_STAGGER_MS, tail: 'end' },
    ],
  },
  // 4 — Kai's 30-day journey (friends' moods improve as each milestone lights)
  {
    id: 4,
    ambient: { light: [art.mint, art.cF3F8F0], dark: [art.c183025, art.night] },
    characters: [
      { id: 'kai', pose: 'float', mood: 'happy', slot: 'center', enterAt: 0 },
      { id: 'hamid', pose: 'sit', mood: 'stressed', slot: 'start', enterAt: 200 },
      { id: 'hina', pose: 'sit', mood: 'stressed', slot: 'start', enterAt: 350 },
      { id: 'sierra', pose: 'sit', mood: 'stressed', slot: 'start', enterAt: 500 },
    ],
    props: [],
    bubbles: [],
  },
  // 5 — Arfa's story (Before / Now)
  {
    id: 5,
    ambient: { light: [art.cE9E3D3, art.cFAF0DC], dark: [art.c1D2320, art.warmNight] },
    characters: [
      { id: 'arfa', pose: 'stand', mood: 'stressed', slot: 'start', enterAt: 0 },
      { id: 'arfa', pose: 'stand', mood: 'calm', slot: 'end', enterAt: 500 },
    ],
    props: [],
    bubbles: [],
  },
  // 6 — What brings you here?
  {
    id: 6,
    ambient: { light: [art.cream, art.cFCE9DF], dark: [art.night, art.c2A1E1A] },
    titleKey: 'story.s6.title',
    characters: [
      { id: 'hamid', pose: 'stand', mood: 'happy', slot: 'start', enterAt: 0 },
      { id: 'hina', pose: 'stand', mood: 'happy', slot: 'start', enterAt: 100 },
      { id: 'arfa', pose: 'stand', mood: 'happy', slot: 'end', enterAt: 200 },
      { id: 'sierra', pose: 'stand', mood: 'happy', slot: 'end', enterAt: 300 },
    ],
    props: [{ kind: 'confetti', enterAt: 600 }],
    bubbles: [],
  },
];

export const SCENE_COUNT = scenes.length;

/** Scene 4 milestones. `friendMood` is the mood the three friends show once the milestone lights up. */
/** Scene 6 goal cards → matching character icon. */
export const goalCharacter: Record<string, CharacterName | null> = {
  stress: 'hina',
  'back-neck': 'hamid',
  sleep: 'sierra',
  focus: 'arfa',
  flexibility: null,
  balance: null,
  gentle: null,
};
