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
