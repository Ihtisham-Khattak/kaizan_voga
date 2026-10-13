import { breathingSessions } from './breathing';
import { exercises } from './exercises';
import { achievements, challenges, styles } from './misc';
import { programs } from './programs';
import { routines } from './routines';

/** Returns a list of problems (empty = valid). Run with `npm run validate:data`. */
export function validateData(): string[] {
  const issues: string[] = [];
  const ids = new Set(exercises.map((e) => e.id));
  if (exercises.length !== 50) issues.push(`expected 50 exercises, got ${exercises.length}`);
  if (ids.size !== exercises.length) issues.push('duplicate exercise ids');

  const cats = new Map<string, number>();
  for (const e of exercises) {
    cats.set(e.category, (cats.get(e.category) ?? 0) + 1);
    if (e.steps.length < 3) issues.push(`${e.id}: needs >= 3 steps`);
    if (!e.cautions.length) issues.push(`${e.id}: needs a caution`);
    if (!e.modifications.length) issues.push(`${e.id}: needs a modification`);
    if (e.media.type !== 'placeholder') issues.push(`${e.id}: media should be placeholder`);
  }
  for (const [c, n] of cats) if (n < 3) issues.push(`category ${c} has only ${n}`);
  if (cats.size !== 10) issues.push(`expected 10 categories, got ${cats.size}`);

  const routineIds = new Set(routines.map((r) => r.id));
  for (const r of routines) {
    for (const s of r.steps)
      if (!ids.has(s.exerciseId)) issues.push(`${r.id}: unknown exercise ${s.exerciseId}`);
    const phases = r.steps.map((s) => s.phase);
    for (const p of ['settle', 'main', 'close'] as const)
      if (!phases.includes(p)) issues.push(`${r.id}: missing phase ${p}`);
  }
  const mins = (id: string) => routines.find((r) => r.id === id)!.totalSec / 60;
  const full = routines.filter((r) => r.kind !== 'quick-relief');
  if (full.length !== 12) issues.push(`expected 12 routines, got ${full.length}`);
  if (full.filter((r) => r.kind === 'sleep').length !== 2) issues.push('expected 2 sleep routines');
  for (const id of ['r-01', 'r-02', 'r-03'])
    if (Math.abs(mins(id) - 5) > 0.5) issues.push(`${id} should be ~5 min (${mins(id)})`);
  for (const id of ['r-04', 'r-05', 'r-06', 'r-07'])
    if (Math.abs(mins(id) - 10) > 0.5) issues.push(`${id} should be ~10 min (${mins(id)})`);
  for (const id of ['r-08', 'r-09', 'r-10'])
    if (mins(id) < 14.5 || mins(id) > 20.5) issues.push(`${id} should be 15-20 min (${mins(id)})`);
  const qr = routines.filter((r) => r.kind === 'quick-relief');
  if (qr.length !== 5) issues.push(`expected 5 quick-relief, got ${qr.length}`);
  for (const r of qr) if (r.totalSec < 60 || r.totalSec > 300) issues.push(`${r.id} should be 1-5 min`);

  if (programs.length !== 2) issues.push('expected 2 programs');
  const p30 = programs.find((p) => p.id === 'p-30');
  const pd = programs.find((p) => p.id === 'p-desk');
  if (p30?.days.length !== 30) issues.push(`30-day program has ${p30?.days.length} days`);
  if (pd?.days.length !== 14) issues.push(`desk program has ${pd?.days.length} days`);
  for (const p of programs)
    for (const d of p.days)
      if (d.routineId && !routineIds.has(d.routineId)) issues.push(`${p.id} day ${d.day}: unknown routine`);

  if (breathingSessions.length !== 6) issues.push('expected 6 breathing sessions');
  if (achievements.length !== 12) issues.push('expected 12 achievements');
  if (challenges.length !== 3) issues.push('expected 3 challenges');
  if (styles.length !== 7) issues.push('expected 7 styles');
  return issues;
}

export function summary() {
  return routines.map((r) => `${r.id} ${r.kind} ${(r.totalSec / 60).toFixed(1)}min ${r.title}`);
}
