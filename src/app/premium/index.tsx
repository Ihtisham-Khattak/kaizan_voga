import { ScreenStub } from '@/components/screen-stub';

export default function Screen() {
  return (
    <ScreenStub
      id="M-01"
      title="Premium"
      note=""
      links={[{ label: 'Need help affording?', href: '/premium/help-affording' }]}
    />
  );
}
