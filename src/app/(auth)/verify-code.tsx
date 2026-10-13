import { ScreenStub } from '@/components/screen-stub';

export default function Screen() {
  return <ScreenStub id="A-05" title="Verify code" note="Auth (UI only, mock)" links={[{ label: "Reset password", href: "/reset-password" }, { label: "Home", href: "/home" }]} />;
}
