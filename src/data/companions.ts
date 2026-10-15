import type { CharacterName } from '@/characters/palette';

/** The four people (docs/character-bible.md). */
export type Person = Exclude<CharacterName, 'kai'>;
export const PEOPLE: Person[] = ['hina', 'arfa', 'hamid', 'sierra'];

/**
 * Whose "pick" a routine or program is, and why (reason text: i18n companions.reasons.<id>).
 * Only things that genuinely fit that person's story: desk breaks → Hina/Hamid, beginner/easy versions → Arfa,
 * evenings and sleep → Sierra.
 */
export const PICKS: Record<string, Person> = {
  'r-01': 'arfa',
  'r-02': 'hina',
  'r-03': 'hina',
  'r-05': 'hamid',
  'r-06': 'hina',
  'r-08': 'arfa',
  'r-11': 'sierra',
  'r-12': 'sierra',
  'qr-02': 'hina',
  'qr-03': 'sierra',
  'p-30': 'arfa',
  'p-desk': 'hamid',
};
