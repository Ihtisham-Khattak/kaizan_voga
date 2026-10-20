import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { buildExport } from '../src/lib/export-data';

describe('export my data', () => {
  const snap = {
    'kz-prefs': { goals: ['sleep'], minutesPerDay: 10, patch: () => 1 },
    'kz-progress': { sessions: [{ id: 's1', title: 'Morning Flow', practicedSec: 300 }], moodLogs: [] },
    'kz-auth': {
      status: 'signedIn',
      user: { name: 'Sam', email: 'sam@example.com', accessToken: 'SECRET123' },
    },
  };
  const out = buildExport(snap, { version: '9.9.9', at: new Date('2026-10-20T08:00:00Z') });

  it('names the app, version and time', () => {
    assert.equal(out.app, 'Kaizen Yoga');
    assert.equal(out.appVersion, '9.9.9');
    assert.equal(out.exportedAt, '2026-10-20T08:00:00.000Z');
  });

  it("includes the person's sessions, goals and account name", () => {
    const text = JSON.stringify(out);
    assert.ok(text.includes('Morning Flow') && text.includes('sleep') && text.includes('Sam'));
  });

  it('leaves out functions and anything that looks like a secret', () => {
    const text = JSON.stringify(out);
    assert.ok(!text.includes('SECRET123'));
    assert.ok(!text.includes('accessToken'));
    assert.ok(!('patch' in (out.data['kz-prefs'].state as object)));
  });

  it('explains each saved store in plain words', () => {
    assert.match(out.data['kz-progress'].what, /sessions/i);
  });
});
