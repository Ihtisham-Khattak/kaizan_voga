import { ScreenStub } from '@/components/screen-stub';

export default function Screen() {
  return (
    <ScreenStub
      id="P-03"
      title="Q3 Preferred time & days"
      note="Personalization step"
      links={[{ label: 'Continue', href: '/movement' }]}
    />
  );
}
