/** Names of the saved stores and what each holds, in plain words (shown in the file so it is understandable on its own). */
const WHAT: Record<string, string> = {
  'kz-app': 'App settings: language, theme, text size, onboarding progress',
  'kz-auth': 'Account on this device (guest or signed in)',
  'kz-prefs': 'Your goals, experience, time, schedule, equipment, voice and reminders',
  'kz-library': 'Favourites, recent searches, your custom routines, downloads',
  'kz-progress': 'Your sessions, mood check-ins and achievements',
  'kz-subscription': 'Plan status (prototype, no real purchase)',
};

/** Words that would be a secret if one ever got into a store; they are removed from the export, never written out. */
const SECRET = /token|password|secret|apikey|api_key/i;

function strip(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(strip);
  if (value && typeof value === 'object')
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([k, v]) => typeof v !== 'function' && !SECRET.test(k))
        .map(([k, v]) => [k, strip(v)])
    );
  return value;
}

/** Everything the app stores about the person, as one readable JSON document (card FN-12). Pure and testable. */
export function buildExport(snapshots: Record<string, unknown>, meta: { version: string; at?: Date }) {
  return {
    app: 'Kaizen Yoga',
    appVersion: meta.version,
    exportedAt: (meta.at ?? new Date()).toISOString(),
    note: 'This file contains the data Kaizen Yoga keeps for you on this device. Nothing here is sent anywhere.',
    data: Object.fromEntries(
      Object.entries(snapshots).map(([name, state]) => [
        name,
        { what: WHAT[name] ?? 'Saved data', state: strip(state) },
      ])
    ),
  };
}
