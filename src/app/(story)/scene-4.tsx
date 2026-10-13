import { ScreenStub } from '@/components/screen-stub';

export default function Screen() {
  return (
    <ScreenStub
      id="S-05"
      title="Scene 4 \u2014 Kai's 30-day journey"
      note="Story onboarding scene"
      links={[
        { label: 'Next', href: '/scene-5' },
        { label: 'Skip \u2192 personalization', href: '/goals' },
      ]}
    />
  );
}
