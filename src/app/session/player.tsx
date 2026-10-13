import { ScreenStub } from '@/components/screen-stub';

export default function Screen() {
  return <ScreenStub id="SE-02" title="Active session player" note="" links={[{ label: "Finish", href: "/session/complete" }]} />;
}
