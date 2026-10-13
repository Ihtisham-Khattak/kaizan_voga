import { ScreenStub } from '@/components/screen-stub';

export default function Screen() {
  return (
    <ScreenStub
      id="A-02"
      title="Sign up"
      note="Auth (UI only, mock)"
      links={[
        { label: 'Verify code', href: '/verify-code' },
        { label: 'Sign in instead', href: '/sign-in' },
      ]}
    />
  );
}
