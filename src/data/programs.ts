import { routineById } from './routines';
import type { Program, ProgramDay } from './types';

const day = (n: number, routineId: string | null, restTitle = 'Rest day'): ProgramDay =>
  routineId
    ? { day: n, kind: 'session', title: routineById[routineId].title, routineId }
    : { day: n, kind: 'rest', title: restTitle };

/** Week patterns: 6 gentle sessions + 1 rest day (rest is part of practice too). */
const journeyWeeks: (string | null)[][] = [
  // Week 1 — Learn to breathe & move
  ['r-01', 'r-03', 'r-02', 'r-01', 'r-04', 'r-03', null],
  // Week 2 — Find your rhythm
  ['r-04', 'r-06', 'r-05', 'r-04', 'r-07', 'r-11', null],
  // Week 3 — Notice the shift
  ['r-08', 'r-04', 'r-06', 'r-11', 'r-05', 'r-09', null],
  // Week 4 — A habit that's yours
  ['r-04', 'r-07', 'r-08', 'r-11', 'r-05', 'r-09', null],
];

const journeyDays: ProgramDay[] = [
  ...journeyWeeks.flatMap((w, wi) => w.map((r, di) => day(wi * 7 + di + 1, r))),
  day(29, 'r-04'),
  day(30, 'r-11'),
];

const deskWeeks: (string | null)[][] = [
  ['r-02', 'qr-02', 'r-05', 'r-06', 'qr-02', 'r-04', null],
  ['r-02', 'r-05', 'qr-02', 'r-06', 'r-07', 'r-05', null],
];
const deskDays = deskWeeks.flatMap((w, wi) => w.map((r, di) => day(wi * 7 + di + 1, r)));

export const programs: Program[] = [
  {
    id: 'p-30',
    title: '30-Day Kaizen Beginner Journey',
    description:
      'One small step a day for a month. Short beginner sessions, a weekly rest day and a wind-down routine for evenings — at your own pace.',
    weeks: 4,
    days: journeyDays,
    level: 'beginner',
    goals: ['gentle', 'stress', 'sleep', 'flexibility'],
    premium: false,
    cover: 'sage',
  },
  {
    id: 'p-desk',
    title: 'Desk Body Reset — 14 days',
    description: 'Two weeks of short, chair-friendly breaks and gentle stretches for long days at a desk.',
    weeks: 2,
    days: deskDays,
    level: 'beginner',
    goals: ['back-neck', 'focus'],
    premium: true,
    cover: 'sand',
  },
];

export const programById = Object.fromEntries(programs.map((p) => [p.id, p]));
