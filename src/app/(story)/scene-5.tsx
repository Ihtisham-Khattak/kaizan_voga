import { ScreenStub } from '@/components/screen-stub';

export default function Screen() {
  return (
    <ScreenStub
      id="S-06"
      title="Scene 5 \u2014 Zara's story"
      note="Story onboarding scene"
      links={[
        { label: 'Next', href: '/scene-6' },
        { label: 'Skip \u2192 personalization', href: '/goals' },
      ]}
    />
  );
}
