import { ScreenStub } from '@/components/screen-stub';

export default function Screen() {
  return (
    <ScreenStub
      id="P-06"
      title="Q6 Accessibility"
      note="Personalization step"
      links={[{ label: 'Continue', href: '/voice' }]}
    />
  );
}
