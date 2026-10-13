import { ScreenStub } from '@/components/screen-stub';

export default function Screen() {
  return (
    <ScreenStub
      id="A-03"
      title="Sign in"
      note="Auth (UI only, mock)"
      links={[
        { label: 'Forgot password', href: '/forgot-password' },
        { label: 'Home', href: '/home' },
      ]}
    />
  );
}
