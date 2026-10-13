import { ScreenStub } from '@/components/screen-stub';

export default function Screen() {
  return <ScreenStub id="S-01" title="Scene 0 \u2014 Welcome" note="Story onboarding scene" links={[{ label: "Next", href: "/scene-1" }, { label: "Skip \u2192 personalization", href: "/goals" }]} />;
}
