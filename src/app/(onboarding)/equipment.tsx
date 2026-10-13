import { ScreenStub } from '@/components/screen-stub';

export default function Screen() {
  return (
    <ScreenStub
      id="P-05"
      title="Q5 Equipment"
      note="Personalization step"
      links={[{ label: 'Continue', href: '/accessibility' }]}
    />
  );
}
