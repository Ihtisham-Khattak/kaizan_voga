import { ScreenStub } from '@/components/screen-stub';

export default function Screen() {
  return <ScreenStub id="S-03" title="Scene 2 \u2014 You're not alone" note="Story onboarding scene" links={[{ label: "Next", href: "/scene-3" }, { label: "Skip \u2192 personalization", href: "/goals" }]} />;
}
