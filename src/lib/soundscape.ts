import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';
import * as Speech from 'expo-speech';
import { useSyncExternalStore } from 'react';

import type { Ambience, VoicePreference } from '@/store/types';

/**
 * The app's sound: looping ambience, a calm music bed, and a spoken voice sample.
 *  - Loops are original, synthesised files (scripts/make-sounds.py); swap for recorded audio before release.
 *  - The voice sample uses the phone's text-to-speech as a stand-in until recorded voice guides exist (FN-06).
 * Everything fades in and out, music and ambience can play together, and the voice sample ducks them while it speaks.
 * All calls are safe to make when audio is unavailable (muted device, web autoplay rules): they never throw.
 */
type Loop = 'rain' | 'forest' | 'piano' | 'music';

const SOURCES: Record<Loop, number> = {
  rain: require('../../assets/audio/rain.wav'),
  forest: require('../../assets/audio/forest.wav'),
  piano: require('../../assets/audio/piano.wav'),
  music: require('../../assets/audio/music.wav'),
};
const LEVEL: Record<Loop, number> = { rain: 0.75, forest: 0.8, piano: 0.7, music: 0.45 };
const DUCKED = 0.18;
const FADE_MS = 700;

export interface SoundState {
  /** The ambience loop currently playing (null = none). */
  ambience: Exclude<Ambience, 'none'> | null;
  music: boolean;
  /** The voice sample is being spoken. */
  voice: VoicePreference | null;
}

let state: SoundState = { ambience: null, music: false, voice: null };
const listeners = new Set<() => void>();
const emit = (next: Partial<SoundState>) => {
  state = { ...state, ...next };
  listeners.forEach((l) => l());
};

const players: Partial<Record<Loop, AudioPlayer>> = {};
const fades: Partial<Record<Loop, ReturnType<typeof setInterval>>> = {};
let ducked = false;
let modeSet = false;

async function ensureMode() {
  if (modeSet) return;
  modeSet = true;
  try {
    await setAudioModeAsync({ playsInSilentMode: true, interruptionMode: 'mixWithOthers' });
  } catch {
    /* audio mode is best-effort */
  }
}

function playerFor(loop: Loop): AudioPlayer | null {
  try {
    if (!players[loop]) {
      const p = createAudioPlayer(SOURCES[loop]);
      p.loop = true;
      p.volume = 0;
      players[loop] = p;
    }
    return players[loop] ?? null;
  } catch {
    return null;
  }
}

/** Ramp a loop's volume to `to` over `ms`; pauses it when it reaches silence. */
function fadeTo(loop: Loop, to: number, ms = FADE_MS) {
  const p = players[loop];
  if (!p) return;
  if (fades[loop]) clearInterval(fades[loop]);
  const from = p.volume ?? 0;
  const steps = Math.max(1, Math.round(ms / 50));
  let i = 0;
  fades[loop] = setInterval(() => {
    i += 1;
    try {
      p.volume = from + ((to - from) * i) / steps;
    } catch {
      /* player was released */
    }
    if (i >= steps) {
      clearInterval(fades[loop]);
      if (to === 0) {
        try {
          p.pause();
        } catch {
          /* ignore */
        }
      }
    }
  }, 50);
}

function startLoop(loop: Loop) {
  void ensureMode();
  const p = playerFor(loop);
  if (!p) return;
  try {
    p.play();
  } catch {
    return;
  }
  fadeTo(loop, ducked ? Math.min(DUCKED, LEVEL[loop]) : LEVEL[loop]);
}

function stopLoop(loop: Loop) {
  fadeTo(loop, 0, 450);
}

/** Choose the ambience loop ('none' = silence). Switching crossfades. */
export function setAmbience(id: Ambience) {
  const next = id === 'none' ? null : id;
  if (state.ambience && state.ambience !== next) stopLoop(state.ambience);
  if (next && state.ambience !== next) startLoop(next);
  emit({ ambience: next });
}

export function setMusic(on: boolean) {
  if (on && !state.music) startLoop('music');
  if (!on && state.music) stopLoop('music');
  emit({ music: on });
}

function setDucked(on: boolean) {
  ducked = on;
  (['rain', 'forest', 'piano', 'music'] as Loop[]).forEach((l) => {
    const playing = l === 'music' ? state.music : state.ambience === l;
    if (playing) fadeTo(l, on ? Math.min(DUCKED, LEVEL[l]) : LEVEL[l], 350);
  });
}

// ───────────────────────────── voice sample ─────────────────────────────

// Phone voices rarely say their gender outright, so recognise the usual markers: Google ("#male_1", "female"), Samsung
// ("SMTf00" / "SMTm00"), Apple and Microsoft first names. The `\b`-style guards stop "female" matching as "male".
const FEMALE =
  /female|woman|(^|[^a-z])f\d|smtf|samantha|karen|moira|tessa|victoria|ava|allison|susan|zira|fiona|serena|kate|hazel|libby|sonia|natasha|jenny|aria|emma|amy|joanna|salli|kimberly|ivy|nicole/i;
const MALE =
  /(^|[^a-z])male|(^|[^a-z])man\b|(^|[^a-z])m\d|smtm|daniel|alex|fred|tom|aaron|oliver|david|mark|rishi|george|james|ryan|guy|brian|matthew|justin|russell|arthur|thomas|gordon|ravi/i;

type Gendered = Exclude<VoicePreference, 'none'>;
const label = (v: { name?: string; identifier: string }) => `${v.name ?? ''} ${v.identifier}`;
const isFemale = (v: { name?: string; identifier: string }) =>
  FEMALE.test(label(v)) && !MALE.test(label(v).replace(/female/gi, ''));
const isMale = (v: { name?: string; identifier: string }) =>
  MALE.test(label(v).replace(/female/gi, '')) && !FEMALE.test(label(v).replace(/female/gi, 'x'));

/** What this phone offers, so the screen can say so honestly (a missing male voice is made deeper instead). */
export async function voiceSupport(lang: string) {
  try {
    const code = lang.startsWith('ur') ? 'ur' : 'en';
    const all = (await Speech.getAvailableVoicesAsync()).filter((v) =>
      v.language?.toLowerCase().startsWith(code)
    );
    return { female: all.some(isFemale), male: all.some(isMale), total: all.length };
  } catch {
    return { female: false, male: false, total: 0 };
  }
}

/** Pick a phone voice of the right gender. `matched` = we are confident of its gender; otherwise pitch carries it. */
async function pickVoice(kind: Gendered, lang: string) {
  try {
    const all = await Speech.getAvailableVoicesAsync();
    const inLang = all.filter((v) => v.language?.toLowerCase().startsWith(lang));
    // prefer the best quality voice of the right gender
    const pool = inLang.filter(kind === 'female' ? isFemale : isMale);
    pool.sort((a, b) => Number(b.quality === 'Enhanced') - Number(a.quality === 'Enhanced'));
    return pool[0] ? { id: pool[0].identifier, matched: true } : { id: undefined, matched: false };
  } catch {
    return { id: undefined, matched: false };
  }
}

/**
 * Speak guidance in the chosen voice. Female is higher and a little quicker, male lower and slower, so the two are
 * clearly different even on phones that expose only one voice. The phone's own voice stands in until recorded guides
 * ship (FN-06).
 */
export async function speak(kind: VoicePreference, text: string, lang: string) {
  stopVoice();
  if (kind === 'none') return;
  const code = lang.startsWith('ur') ? 'ur' : 'en';
  // the phone's voice list can be slow to load; never let it delay speech by more than a moment
  const pick = await Promise.race([
    pickVoice(kind, code),
    new Promise<{ id: undefined; matched: false }>((r) =>
      setTimeout(() => r({ id: undefined, matched: false }), 900)
    ),
  ]);
  setDucked(true);
  emit({ voice: kind });
  const done = () => {
    setDucked(false);
    emit({ voice: null });
  };
  const female = kind === 'female';
  try {
    Speech.speak(text, {
      language: code === 'ur' ? 'ur-PK' : 'en-US',
      voice: pick.id,
      pitch: pick.matched ? (female ? 1.06 : 0.92) : female ? 1.3 : 0.6,
      rate: female ? 0.9 : 0.8,
      onDone: done,
      onStopped: done,
      onError: done,
    });
  } catch {
    done();
  }
}

/** Kept for the Voice & music screen. */
export const previewVoice = speak;

// ───────────────────────────── chime ─────────────────────────────

let chime: AudioPlayer | null = null;
/** A soft bell: marks the start of a pose and the end of a session. Never throws. */
export function playChime() {
  try {
    void ensureMode();
    if (!chime) chime = createAudioPlayer(require('../../assets/audio/chime.wav'));
    chime.volume = 0.7;
    void chime.seekTo(0);
    chime.play();
  } catch {
    /* sound is optional */
  }
}

export function stopVoice() {
  try {
    void Speech.stop();
  } catch {
    /* ignore */
  }
  if (state.voice) {
    setDucked(false);
    emit({ voice: null });
  }
}

/** Fade everything out (leaving the screen or tapping "stop"). Keeps the players for quick reuse. */
export function stopAll() {
  stopVoice();
  (['rain', 'forest', 'piano', 'music'] as Loop[]).forEach((l) => stopLoop(l));
  emit({ ambience: null, music: false, voice: null });
}

/** Free the native players (call when the sound screen is gone for good). */
export function releaseAll() {
  stopAll();
  setTimeout(() => {
    (Object.keys(players) as Loop[]).forEach((l) => {
      try {
        players[l]?.remove();
      } catch {
        /* ignore */
      }
      delete players[l];
    });
  }, 900);
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
};

/** Reactive view of what is playing. */
export function useSoundscape(): SoundState {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => state
  );
}
