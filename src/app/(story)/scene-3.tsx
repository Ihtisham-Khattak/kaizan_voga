import { ScreenStub } from '@/components/screen-stub';

export default function Screen() {
  return (
    <ScreenStub
      id="S-04"
      title="Scene 3 \u2014 Zara arrives"
      note="Story onboarding scene"
      links={[
        { label: 'Next', href: '/scene-4' },
        { label: 'Skip \u2192 personalization', href: '/goals' },
      ]}
    />
  );
}
