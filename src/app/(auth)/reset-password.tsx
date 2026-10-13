import { ScreenStub } from '@/components/screen-stub';

export default function Screen() {
  return <ScreenStub id="A-06" title="Reset password" note="Auth (UI only, mock)" links={[{ label: "Back to sign in", href: "/sign-in" }]} />;
}
