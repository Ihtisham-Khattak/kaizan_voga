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

/** Build a program's days from week patterns (null = rest day). */
const fromWeeks = (weeks: (string | null)[][]): ProgramDay[] =>
  weeks.flatMap((w, wi) => w.map((r, di) => day(wi * 7 + di + 1, r)));

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
    theme: 'beginners',
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
    theme: 'mobility',
    premium: true,
    cover: 'sand',
  },
  {
    id: 'p-begin',
    title: 'Yoga for Beginners',
    description:
      'Two easy weeks to learn the basics: breathing, a few simple poses and a rhythm that fits your day. Rest days included.',
    weeks: 2,
    days: fromWeeks([
      ['r-01', 'r-03', 'r-02', 'r-05', 'r-01', 'r-04', null],
      ['r-03', 'r-05', 'r-04', 'r-06', 'r-04', 'r-07', null],
    ]),
    level: 'beginner',
    goals: ['gentle', 'stress'],
    theme: 'beginners',
    premium: false,
    cover: 'mint',
  },
  {
    id: 'p-morning',
    title: 'Morning Energy',
    description: 'A week of bright, easy starts: a few gentle minutes to wake your body and clear your head.',
    weeks: 1,
    days: fromWeeks([['r-03', 'r-04', 'qr-04', 'r-03', 'r-04', 'r-07', null]]),
    level: 'beginner',
    goals: ['focus', 'flexibility'],
    theme: 'mobility',
    premium: false,
    cover: 'coral',
  },
  {
    id: 'p-relax',
    title: 'Deep Relaxation',
    description:
      'Two weeks of slow breathing, restorative poses and quiet rests, to help your body and mind unwind.',
    weeks: 2,
    days: fromWeeks([
      ['r-06', 'r-09', 'qr-01', 'r-21', 'r-09', 'r-11', null],
      ['r-06', 'r-12', 'r-21', 'r-11', 'qr-01', 'r-12', null],
    ]),
    level: 'beginner',
    goals: ['stress', 'sleep'],
    theme: 'stress',
    premium: true,
    cover: 'lavender',
  },
  {
    id: 'p-flex',
    title: 'Full-Body Flexibility',
    description: 'Three weeks of gentle stretches from head to toe, building slowly so nothing is forced.',
    weeks: 3,
    days: fromWeeks([
      ['r-05', 'r-17', 'r-05', 'r-04', 'r-17', 'r-11', null],
      ['r-17', 'r-05', 'r-10', 'r-20', 'r-17', 'r-11', null],
      ['r-10', 'r-17', 'r-08', 'r-22', 'r-20', 'r-11', null],
    ]),
    level: 'beginner',
    goals: ['flexibility', 'back-neck'],
    theme: 'flexibility',
    premium: true,
    cover: 'sage',
  },
  {
    id: 'p-sleep',
    title: 'Better Sleep',
    description:
      'Two weeks of evening wind-downs and sleep-friendly rests, so bedtime feels calmer. Many people find a steady routine helps.',
    weeks: 2,
    days: fromWeeks([
      ['qr-03', 'r-11', 'r-12', 'r-11', 'qr-03', 'r-12', null],
      ['r-11', 'r-12', 'qr-03', 'r-11', 'r-12', 'r-09', null],
    ]),
    level: 'beginner',
    goals: ['sleep', 'stress'],
    theme: 'sleep',
    premium: true,
    cover: 'lavender',
  },
  {
    id: 'p-core',
    title: 'Core Strength',
    description:
      'Two weeks of steady, back-friendly strength: balance, bridges and supported holds. Easier versions are always there.',
    weeks: 2,
    days: fromWeeks([
      ['r-18', 'r-07', 'r-13', 'r-05', 'r-18', 'r-04', null],
      ['r-13', 'r-14', 'r-18', 'r-19', 'r-14', 'r-11', null],
    ]),
    level: 'intermediate',
    goals: ['balance', 'back-neck'],
    theme: 'strength',
    premium: true,
    cover: 'coral',
  },
];

export const programById = Object.fromEntries(programs.map((p) => [p.id, p]));
