import { ScreenStub } from '@/components/screen-stub';

export default function Screen() {
  return (
    <ScreenStub
      id="S-07"
      title="Scene 6 \u2014 What brings you here?"
      note="Story onboarding scene"
      links={[
        { label: 'Next', href: '/experience' },
        { label: 'Skip \u2192 personalization', href: '/goals' },
      ]}
    />
  );
}
