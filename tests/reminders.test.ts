import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { inQuietHours, reminderSlots } from '../src/lib/reminder-times';
import type { ReminderSettings } from '../src/store/types';

const base: ReminderSettings = {
  enabled: true,
  time: '08:00',
  days: [1, 2, 3, 4, 5, 6, 7],
  quietHours: { enabled: true, from: '21:30', to: '07:00' },
};

describe('reminder slots', () => {
  it('schedules nothing when reminders are off', () => {
    assert.deepEqual(reminderSlots({ ...base, enabled: false }), []);
  });

  it('schedules one slot per chosen day, only on those days', () => {
    const slots = reminderSlots({ ...base, days: [1, 3, 5] });
    assert.deepEqual(
      slots.map((s) => s.iso),
      [1, 3, 5]
    );
    assert.ok(slots.every((s) => s.hour === 8 && s.minute === 0));
  });

  it('converts Monday-first days to the notification API (1 = Sunday)', () => {
    const byIso = Object.fromEntries(reminderSlots(base).map((s) => [s.iso, s.weekday]));
    assert.equal(byIso[7], 1); // Sunday
    assert.equal(byIso[1], 2); // Monday
    assert.equal(byIso[6], 7); // Saturday
  });

  it('removes duplicate days', () => {
    assert.equal(reminderSlots({ ...base, days: [2, 2, 2] }).length, 1);
  });

  it('moves a time inside overnight quiet hours to the moment they end', () => {
    const [s] = reminderSlots({ ...base, time: '22:30', days: [1] });
    assert.equal(s.hour, 7);
    assert.equal(s.minute, 0);
    const [t] = reminderSlots({ ...base, time: '03:15', days: [1] });
    assert.equal(t.hour, 7);
  });

  it('keeps a time outside quiet hours, and ignores quiet hours when switched off', () => {
    assert.equal(reminderSlots({ ...base, time: '20:00', days: [1] })[0].hour, 20);
    assert.equal(
      reminderSlots({
        ...base,
        time: '22:30',
        days: [1],
        quietHours: { ...base.quietHours, enabled: false },
      })[0].hour,
      22
    );
  });

  it('handles daytime quiet hours and an empty window', () => {
    assert.equal(inQuietHours(13 * 60, '12:00', '14:00'), true);
    assert.equal(inQuietHours(14 * 60, '12:00', '14:00'), false);
    assert.equal(inQuietHours(600, '09:00', '09:00'), false);
  });

  it('the quiet window boundaries: start is quiet, end is not', () => {
    assert.equal(inQuietHours(21 * 60 + 30, '21:30', '07:00'), true);
    assert.equal(inQuietHours(7 * 60, '21:30', '07:00'), false);
  });
});
