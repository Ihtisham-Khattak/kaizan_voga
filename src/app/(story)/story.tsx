import { Scene0 } from '@/features/story/scenes/scene-0';
import { Scene1 } from '@/features/story/scenes/scene-1';
import { Scene2 } from '@/features/story/scenes/scene-2';
import { Scene3 } from '@/features/story/scenes/scene-3';
import { Scene4 } from '@/features/story/scenes/scene-4';
import { Scene5 } from '@/features/story/scenes/scene-5';
import { Scene6 } from '@/features/story/scenes/scene-6';
import { StoryShell } from '@/features/story/shell';

const SCENES = [Scene0, Scene1, Scene2, Scene3, Scene4, Scene5, Scene6];

export default function StoryScreen() {
  return <StoryShell scenes={SCENES} />;
}
