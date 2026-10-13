import { ScreenStub } from '@/components/screen-stub';

export default function Screen() {
  return (
    <ScreenStub
      id="P-08"
      title="Under 18 info"
      note="Personalization step"
      links={[{ label: 'Continue', href: '/support/resources' }]}
    />
  );
}
