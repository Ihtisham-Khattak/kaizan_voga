import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getExercise, listRoutines } from '../src/data/repo';
import {
  adaptRoutine,
  blockedReason,
  firstSessionFor,
  recommend,
  scoreRoutine,
  type Profile,
} from '../src/lib/recommend';

const base: Profile = {
  goals: ['stress'],
  experience: 'beginner',
  minutesPerDay: 10,
  preferredTime: null,
  movement: null,
  equipment: [],
  limitations: [],
  chairMode: false,
};
const FLOOR = ['floor', 'prone', 'supine', 'kneeling'];
const poses = (id: string) =>
  listRoutines()
    .find((r) => r.id === id)!
    .steps.map((s) => getExercise(s.exerciseId));

describe('recommend: hard safety rules', () => {
  it('chair-only people are only ever offered chair-friendly routines', () => {
    const p = { ...base, limitations: ['chair-only' as const] };
    const out = recommend(p, undefined, 50);
    assert.ok(out.length > 0, 'there must be something to offer');
    assert.ok(out.every((s) => s.routine.chairFriendly));
  });

  it('chair mode behaves like chair-only', () => {
    const out = recommend({ ...base, chairMode: true }, undefined, 50);
    assert.ok(out.length > 0 && out.every((s) => s.routine.chairFriendly));
  });

  it('"avoid the floor" never offers a routine with floor, kneeling, prone or lying poses', () => {
    const out = recommend({ ...base, limitations: ['avoid-floor'] }, undefined, 50);
    assert.ok(out.length > 0);
    for (const s of out)
      for (const e of poses(s.routine.id))
        assert.ok(!FLOOR.includes(e.tags.position), `${s.routine.title}: ${e.name}`);
  });

  it('knee sensitivity never offers a kneeling pose without the low-knee-load tag', () => {
    for (const s of recommend({ ...base, limitations: ['knee'] }, undefined, 50))
      for (const e of poses(s.routine.id))
        assert.ok(
          !(e.tags.position === 'kneeling' && !e.tags.accessibility.includes('low-knee-load')),
          `${s.routine.title}: ${e.name}`
        );
  });

  it('beginners are not offered intermediate routines', () => {
    assert.ok(recommend(base, undefined, 50).every((s) => s.routine.level === 'beginner'));
  });

  it('"no equipment" means no routine that needs props', () => {
    for (const s of recommend({ ...base, equipment: ['none'] }, undefined, 50))
      assert.deepEqual(
        s.routine.equipment.filter((e) => e !== 'none'),
        []
      );
  });

  it('owning only a mat never offers a routine that needs blocks or a strap', () => {
    for (const s of recommend({ ...base, equipment: ['mat'] }, undefined, 50))
      assert.ok(s.routine.equipment.every((e) => e === 'mat'));
  });

  it('never offers quick-relief sessions as a recommendation', () => {
    assert.ok(recommend(base, undefined, 50).every((s) => s.routine.kind !== 'quick-relief'));
  });
});

describe('recommend: ranking', () => {
  it('prefers routines that match the chosen goals', () => {
    const top = recommend({ ...base, goals: ['sleep'] }, undefined, 3);
    assert.ok(top.every((s) => s.routine.goals.includes('sleep')));
  });

  it('prefers restorative routines for an evening practice', () => {
    const calm = scoreRoutine(
      listRoutines().find((r) => r.id === 'r-11')!,
      { ...base, preferredTime: 'evening' }
    );
    const morning = scoreRoutine(
      listRoutines().find((r) => r.id === 'r-11')!,
      { ...base, preferredTime: 'morning' }
    );
    assert.ok(calm.score > morning.score);
  });

  it('gets closer to the chosen length', () => {
    const r5 = listRoutines().find((r) => r.id === 'r-01')!; // 5 min
    assert.ok(
      scoreRoutine(r5, { ...base, minutesPerDay: 5 }).score >
        scoreRoutine(r5, { ...base, minutesPerDay: 20 }).score
    );
  });

  it('lowers what was just practised', () => {
    const r = listRoutines().find((x) => x.id === 'r-04')!;
    assert.ok(scoreRoutine(r, base, { routineIds: ['r-04'] }).score < scoreRoutine(r, base).score);
  });

  it('is deterministic', () => {
    assert.deepEqual(
      recommend(base).map((s) => s.routine.id),
      recommend(base).map((s) => s.routine.id)
    );
  });

  it('every reason is explained by a real fact', () => {
    for (const s of recommend({ ...base, goals: ['stress'] }))
      for (const reason of s.reasons)
        assert.ok(['goal', 'time', 'level', 'movement', 'evening', 'morning'].includes(reason));
  });
});

describe('first session and program adaptation', () => {
  it('is the 5-minute starter for a typical beginner', () => {
    assert.equal(firstSessionFor(base).id, 'r-01');
  });

  it('is safe for a chair-only person', () => {
    const r = firstSessionFor({ ...base, limitations: ['chair-only'] });
    assert.equal(blockedReason(r, { ...base, limitations: ['chair-only'] }), null);
    assert.ok(r.chairFriendly);
  });

  it('is short and beginner level whatever the profile', () => {
    for (const p of [
      base,
      { ...base, equipment: ['none' as const] },
      { ...base, limitations: ['avoid-floor' as const] },
      { ...base, experience: 'experienced' as const },
    ]) {
      const r = firstSessionFor(p);
      assert.ok(r.totalSec <= 6 * 60 && r.level === 'beginner');
    }
  });

  it('keeps a program day that already fits', () => {
    const r = listRoutines().find((x) => x.id === 'r-01')!;
    assert.equal(adaptRoutine(r, base).id, 'r-01');
  });

  it('swaps a program day that is unsafe for the person', () => {
    const profile = { ...base, limitations: ['chair-only' as const] };
    const floorRoutine = listRoutines().find((r) => !r.chairFriendly && r.kind === 'routine')!;
    const swapped = adaptRoutine(floorRoutine, profile);
    assert.notEqual(swapped.id, floorRoutine.id);
    assert.equal(blockedReason(swapped, profile), null);
  });
});
