import { ScreenStub } from '@/components/screen-stub';

export default function Screen() {
  return (
    <ScreenStub
      id="P-01"
      title="Q1 Experience"
      note="Personalization step"
      links={[{ label: 'Continue', href: '/time' }]}
    />
  );
}
