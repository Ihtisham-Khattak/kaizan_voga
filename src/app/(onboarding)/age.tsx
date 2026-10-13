import { ScreenStub } from '@/components/screen-stub';

export default function Screen() {
  return (
    <ScreenStub
      id="P-08"
      title="Q8 Age confirmation"
      note="Personalization step"
      links={[{ label: 'Continue', href: '/safety' }]}
    />
  );
}
