import { ScreenStub } from '@/components/screen-stub';

export default function Screen() {
  return <ScreenStub id="H-01" title="Home (Today)" note="Tab screen" links={[{ label: "Dev: UI kit", href: "/dev/ui-kit" }, { label: "Dev: characters", href: "/dev/characters" }, { label: "Search", href: "/search" }, { label: "Pose detail", href: "/pose/ex-01" }, { label: "Routine detail", href: "/routine/r-01" }, { label: "Program detail", href: "/program/p-30" }, { label: "Session setup", href: "/session/setup" }, { label: "Breathing & Relax", href: "/breathing" }, { label: "Premium", href: "/premium" }, { label: "Settings", href: "/settings/preferences" }, { label: "Coming soon", href: "/coming-soon" }]} />;
}
