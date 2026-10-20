import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { exercises, exerciseById, MERGED_EXERCISES } from '../src/data/exercises';
import { programs } from '../src/data/programs';
import { routineById, routines } from '../src/data/routines';
import { validateData } from '../src/data/validate';
import { buildPlan, planTotalSec } from '../src/lib/session-plan';

describe('content data', () => {
  it('passes the built-in validator', () => {
    assert.deepEqual(validateData(), []);
  });

  it('has unique ids', () => {
    for (const list of [exercises.map((e) => e.id), routines.map((r) => r.id), programs.map((p) => p.id)])
      assert.equal(new Set(list).size, list.length);
  });

  it('gives every pose an easier or supported way to do it, steps, cautions and breathing cues', () => {
    for (const e of exercises) {
      assert.ok(e.modifications.length >= 1, `${e.name}: no modification`);
      assert.ok(e.steps.length >= 3, `${e.name}: too few steps`);
      assert.ok(e.cautions.length >= 1, `${e.name}: no caution`);
      assert.ok(e.breathingCues.length >= 1, `${e.name}: no breathing cue`);
    }
  });

  it('keeps old (merged) pose ids working', () => {
    for (const [old, now] of Object.entries(MERGED_EXERCISES)) {
      assert.ok(!exercises.some((e) => e.id === old), `${old} should be gone from the list`);
      assert.equal(exerciseById[old].id, now);
    }
  });

  it('every routine step points at a pose that exists', () => {
    for (const r of routines)
      for (const s of r.steps) assert.ok(exerciseById[s.exerciseId], `${r.id}: ${s.exerciseId}`);
  });

  it('every program day points at a routine that exists, and has a rest day each week', () => {
    for (const p of programs) {
      for (const d of p.days) if (d.routineId) assert.ok(routineById[d.routineId], `${p.id} day ${d.day}`);
      assert.ok(
        p.days.some((d) => d.kind === 'rest'),
        `${p.id}: no rest day`
      );
    }
  });

  it('uses gentle wording only: no cures, guarantees or diagnosis in poses', () => {
    const banned = /\b(cure|cures|heal|heals|guarantee|guaranteed|diagnos\w*|treat(ment)?|therapy)\b/i;
    for (const e of exercises)
      for (const text of [...e.steps, ...e.cautions, e.setup, e.safeExit])
        assert.ok(!banned.test(text), `${e.name}: "${text}"`);
  });
});

describe('session plan', () => {
  const r = routines.find((x) => x.id === 'r-01')!;

  it('splits two-sided poses into left then right', () => {
    const plan = buildPlan(
      routines.find((x) => x.id === 'r-17')!,
      { scale: 1, pace: 'normal' }
    );
    const two = plan.filter((s) => s.side);
    assert.ok(two.length > 0 && two.length % 2 === 0);
    assert.equal(two[0].side, 'left');
    assert.equal(two[1].side, 'right');
  });

  it('slow pace is longer than normal pace', () => {
    assert.ok(
      planTotalSec(buildPlan(r, { scale: 1, pace: 'slow' })) >
        planTotalSec(buildPlan(r, { scale: 1, pace: 'normal' }))
    );
  });

  it('never gives a step less than 15 seconds', () => {
    for (const step of buildPlan(r, { scale: 0.3, pace: 'normal' })) assert.ok(step.durationSec >= 15);
  });
});
