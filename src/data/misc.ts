import type { Achievement, Challenge, Helpline, YogaStyle } from './types';

/** `icon` is a key in src/icons (Kaizen icon set). */
export const achievements: Achievement[] = [
  {
    id: 'first-step',
    title: 'First step',
    description: 'You started — that is the hardest part.',
    criteria: 'Finish your first session',
    icon: 'leaf',
    kaiMessage: 'You showed up. That is what counts.',
  },
  {
    id: 'first-breath',
    title: 'First breath',
    description: 'You took a mindful pause.',
    criteria: 'Finish a breathing session',
    icon: 'practice',
    kaiMessage: 'Slow and steady. Nicely done.',
  },
  {
    id: 'week-one',
    title: 'Week one',
    description: 'A full week of small steps.',
    criteria: 'Practice on 5 days in a week',
    icon: 'lotus',
    kaiMessage: 'Look at that rhythm forming.',
  },
  {
    id: 'morning-flow',
    title: 'Morning flow',
    description: 'Mornings, made gentler.',
    criteria: 'Finish 5 morning sessions',
    icon: 'goal-gentle',
    kaiMessage: 'A soft start to the day suits you.',
  },
  {
    id: 'wind-down',
    title: 'Wind-down',
    description: 'Evenings, slowed down.',
    criteria: 'Finish 5 evening sessions',
    icon: 'goal-sleep',
    kaiMessage: 'Rest well. You earned it.',
  },
  {
    id: 'rest-is-practice',
    title: 'Rest is practice',
    description: 'You rested, then came back.',
    criteria: 'Return after a rest day',
    icon: 'rest-moon',
    kaiMessage: 'Rest is part of practice too.',
  },
  {
    id: 'noticing',
    title: 'Noticing',
    description: 'You checked in with yourself.',
    criteria: 'Log your mood before and after 3 sessions',
    icon: 'goal-stress',
    kaiMessage: 'Noticing is a skill. You are building it.',
  },
  {
    id: 'steady',
    title: 'Steady',
    description: 'Balance, one breath at a time.',
    criteria: 'Finish 3 balance routines',
    icon: 'goal-balance',
    kaiMessage: 'Steady feet, steady mind.',
  },
  {
    id: 'desk-reset',
    title: 'Desk reset',
    description: 'You took care of your neck and shoulders.',
    criteria: 'Finish 5 desk-break sessions',
    icon: 'goal-back-neck',
    kaiMessage: 'Your shoulders say thank you.',
  },
  {
    id: 'showing-up',
    title: 'Showing up',
    description: 'Ten days of practice, your way.',
    criteria: 'Practice on 10 different days',
    icon: 'bell',
    kaiMessage: 'No rush. You are doing this your way.',
  },
  {
    id: 'explorer',
    title: 'Explorer',
    description: 'You tried something new.',
    criteria: 'Try 5 different routines',
    icon: 'goal-focus',
    kaiMessage: 'Curiosity looks good on you.',
  },
  {
    id: 'journey-30',
    title: '30-day journey',
    description: 'A month of small steps.',
    criteria: 'Complete the 30-Day Kaizen Beginner Journey',
    icon: 'badge-frame',
    kaiMessage: 'One small step at a time — that is Kaizen.',
  },
];

export const challenges: Challenge[] = [
  {
    id: 'morning-stretch-7',
    title: '7-day morning stretch',
    description: 'A few easy minutes each morning for a week. Skip a day and pick it back up — no pressure.',
    days: 7,
    cover: 'coral',
  },
  {
    id: 'wind-down-week',
    title: 'Wind-down week',
    description: 'A calming evening routine for seven nights, whenever suits you.',
    days: 7,
    cover: 'lavender',
  },
  {
    id: 'midday-breath',
    title: 'Midday breath break',
    description: 'A short breathing pause in the middle of your day for a week.',
    days: 7,
    cover: 'sage',
  },
];

export const styles: YogaStyle[] = [
  {
    id: 'hatha',
    name: 'Hatha',
    explainer: 'A slower pace where poses are held for a few breaths. A good foundation for beginners.',
    suits: 'Anyone new to yoga or who likes to take it slow.',
  },
  {
    id: 'gentle',
    name: 'Gentle',
    explainer: 'Soft, easy movements with plenty of time to rest between poses.',
    suits: 'Beginners, stiff mornings, or days you need extra kindness.',
  },
  {
    id: 'chair',
    name: 'Chair',
    explainer: 'Yoga done sitting or standing with a chair for support. No getting down on the floor.',
    suits: 'Desk breaks, limited mobility, or balance concerns.',
  },
  {
    id: 'restorative',
    name: 'Restorative',
    explainer: 'Supported, quiet poses held for longer using cushions so your body can fully rest.',
    suits: 'Winding down, stress, and evenings.',
  },
  {
    id: 'vinyasa',
    name: 'Vinyasa',
    explainer:
      'Poses linked together by your breath in a flowing sequence. We keep ours slow and beginner-friendly.',
    suits: 'People who like to keep moving once they feel comfortable.',
  },
  {
    id: 'mobility-balance',
    name: 'Mobility & Balance',
    explainer: 'Joint-friendly movements and steady-stance practice to feel more stable and free.',
    suits: 'Feeling stiff, or wanting to feel steadier on your feet.',
  },
  {
    id: 'breathing-mindfulness',
    name: 'Breathing & Mindfulness',
    explainer: 'Slow breathing and calm attention, with little or no movement.',
    suits: 'Busy minds, short breaks, and bedtime.',
  },
];

/** PLACEHOLDERS – replace with verified local helplines before release. Editable data, not hard-coded UI. */
export const helplines: Helpline[] = [
  {
    id: 'h-emergency',
    country: 'Your country',
    name: '[Local emergency services]',
    number: '[number]',
    hours: '24 hours',
    placeholder: true,
  },
  {
    id: 'h-mental-health',
    country: 'Your country',
    name: '[Local mental health helpline]',
    number: '[number]',
    hours: '[hours]',
    placeholder: true,
  },
  {
    id: 'h-support',
    country: 'Your country',
    name: '[Local listening / crisis support line]',
    number: '[number]',
    hours: '[hours]',
    placeholder: true,
  },
];
