import { ScreenStub } from '@/components/screen-stub';

export default function Screen() {
  return (
    <ScreenStub
      id="S-02"
      title="Scene 1 \u2014 Sound familiar?"
      note="Story onboarding scene"
      links={[
        { label: 'Next', href: '/scene-2' },
        { label: 'Skip \u2192 personalization', href: '/goals' },
      ]}
    />
  );
}
