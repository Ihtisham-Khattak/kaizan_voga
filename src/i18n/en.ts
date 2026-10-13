/**
 * English strings – the source of truth. `ur.ts` must provide every key (enforced by the `Translation` type).
 * Namespaces grow card by card: story.*, onboarding.*, auth.*, home.*, session.*, settings.*, premium.*, safety.*
 */
const en = {
  common: {
    appName: 'Kaizen Yoga',
    tagline: 'Small steps. Calmer days.',
    next: 'Next',
    back: 'Back',
    skip: 'Skip',
    continue: 'Continue',
    done: 'Done',
    cancel: 'Cancel',
    close: 'Close',
    save: 'Save',
    start: 'Start',
    retry: 'Try again',
    seeAll: 'See all',
    loading: 'Loading…',
    comingSoon: 'Coming soon',
    minutes: '{{count}} min',
    prototype: 'Prototype — no real purchase',
  },
  tabs: {
    home: 'Home',
    explore: 'Explore',
    practice: 'Practice',
    progress: 'Progress',
    profile: 'Profile',
  },
  a11y: {
    closeSheet: 'Close',
    goBack: 'Go back',
    skipIntro: 'Skip the introduction',
    showPassword: 'Show password',
    hidePassword: 'Hide password',
    favorite: 'Add to favourites',
    unfavorite: 'Remove from favourites',
  },
  languages: {
    en: 'English',
    ur: 'اردو',
  },
  mood: {
    stressed: 'Stressed',
    tired: 'Tired',
    neutral: 'Okay',
    calm: 'Calm',
    happy: 'Happy',
    a11y: 'Mood: {{mood}}, {{n}} of {{total}}',
    question: 'How are you feeling?',
  },
  breath: {
    inhale: 'Inhale…',
    hold: 'Hold…',
    exhale: 'Exhale…',
    rest: 'Rest…',
    a11y: 'Breathing guide. The circle grows as you breathe in and shrinks as you breathe out.',
  },
  story: {
    progress: 'Scene {{current}} of {{total}}',
    s0: {
      headline: 'Small steps. Calmer days.',
      sub: 'Welcome to Kaizen Yoga.',
      begin: 'Begin',
      haveAccount: 'I already have an account',
    },
    s1: {
      title: 'Sound familiar?',
      ali: 'Eight hours at the desk… my neck and back feel so stiff.',
      hina: "I lie in bed for hours. My mind just won't switch off.",
      omar: "Exams again. My chest feels tight and I can't focus.",
    },
    s2: {
      title: "You're not alone",
      hina: 'Wait… you feel that too?',
      ali: 'I thought it was just me.',
      caption: 'Stress, stiffness and restless nights are more common than you think.',
    },
    s3: {
      zara1: 'I felt exactly like that a few months ago.',
      zara2: 'Then I started Kaizen Yoga — just 10 minutes a day. Small steps, no pressure.',
      omar: 'Only 10 minutes?',
      zara3: 'Breathing, gentle stretches, a wind-down at night. Let me show you.',
    },
    s4: {
      title: "Kai's 30-day journey",
      week: 'Week {{n}}',
      w1: { title: 'Learn to breathe & move', sub: '5–10 minute beginner sessions' },
      w2: { title: 'Find your rhythm', sub: 'Gentle routines + reminders that fit your day' },
      w3: {
        title: 'Notice the shift',
        sub: 'Many people feel looser and calmer, with a wind-down routine for sleep',
      },
      w4: { title: "A habit that's yours", sub: 'A routine you can keep, at your own pace' },
      kai: 'After one month of small steps, this is how many people describe it: lighter, calmer, more in control.',
      footnote:
        "Everyone's experience is different. Kaizen Yoga supports wellbeing; it isn't medical treatment.",
    },
    s5: {
      title: "Zara's story",
      before: 'Before',
      now: 'Now',
      beforeText:
        'Racing thoughts, tight shoulders, skipping breakfast to rush to work, scrolling till 2 am.',
      nowText:
        '10 minutes of morning flow, a breathing break at lunch, and a wind-down routine that helps me fall asleep sooner. I feel more like myself.',
      zara: "It didn't change overnight. It changed one small step at a time — that's Kaizen.",
      illustrated: 'Illustrated story.',
      cta: 'Start my journey',
    },
    s6: {
      title: 'What brings you here?',
      subtitle: 'Pick anything that feels true. You can change this later.',
      kai: "Lovely — we'll start gently.",
      goals: {
        stress: 'Stress & anxious feelings',
        'back-neck': 'Stiff back/neck from sitting',
        sleep: 'Better sleep',
        focus: 'Focus & energy',
        flexibility: 'Flexibility',
        balance: 'Balance',
        gentle: 'Just gentle movement',
      },
    },
  },
  level: { beginner: 'Beginner', intermediate: 'Intermediate' },
  goal: {
    stress: 'Stress',
    'back-neck': 'Back & neck',
    sleep: 'Sleep',
    focus: 'Focus',
    flexibility: 'Flexibility',
    balance: 'Balance',
    gentle: 'Gentle',
  },
  cards: {
    seconds: '{{count}} sec',
    chairFriendly: 'Chair-friendly',
    premium: 'Premium',
    downloaded: 'Downloaded',
    placeholder: 'Illustration placeholder',
    weeks: '{{count}} weeks',
    days: '{{count}} days',
    dayOf: 'Day {{day}} of {{total}}',
    exercise: '{{name}}, {{level}}, {{duration}}',
    routine: '{{title}}, {{duration}}, {{level}}',
    program: '{{title}}, {{weeks}}',
  },
  safety: {
    stop: 'Stop if you feel sharp pain or dizziness.',
    title: 'A gentle reminder',
  },
  comingSoon: {
    title: 'This is coming soon',
    body: "We're still tending this part of the garden. Thanks for your patience.",
    cta: 'Back to Home',
  },
  dev: {
    uiKit: 'UI kit',
    characters: 'Character sheet',
  },
} as const;

export default en;

type DeepString<T> = { [K in keyof T]: T[K] extends string ? string : DeepString<T[K]> };
export type Translation = DeepString<typeof en>;
