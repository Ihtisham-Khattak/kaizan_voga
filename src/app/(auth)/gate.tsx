import { ScreenStub } from '@/components/screen-stub';

export default function Screen() {
  return <ScreenStub id="A-01" title="Account gate \u2014 Save your journey" note="Auth (UI only, mock)" links={[{ label: "Sign up", href: "/sign-up" }, { label: "Sign in", href: "/sign-in" }, { label: "Continue as guest", href: "/home" }]} />;
}
