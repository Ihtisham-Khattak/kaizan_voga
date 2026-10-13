import type { Mood } from '@/store/types';

export type { CharacterName } from './palette';

/** Humans share these poses. */
export type HumanPose = 'stand' | 'sit' | 'wave' | 'yoga';
/** Kai floats; extra poses for celebration / reminder / sleep moments. */
export type KaiPose = 'float' | 'wave' | 'celebrate' | 'bell' | 'sleep';
export type Pose = HumanPose | KaiPose;

export type { Mood };
