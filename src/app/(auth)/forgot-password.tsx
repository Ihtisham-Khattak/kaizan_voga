import { ScreenStub } from '@/components/screen-stub';

export default function Screen() {
  return (
    <ScreenStub
      id="A-04"
      title="Forgot password"
      note="Auth (UI only, mock)"
      links={[{ label: 'Enter code', href: '/verify-code' }]}
    />
  );
}
