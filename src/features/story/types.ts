export interface SceneControls {
  index: number;
  total: number;
  next: () => void;
  prev: () => void;
  /** Leave the story for the personalization questions (always visible Skip). */
  skip: () => void;
  /** Finish the story normally (last scene). */
  finish: () => void;
  /** "I already have an account" */
  goSignIn: () => void;
}

export interface SceneProps {
  controls: SceneControls;
  /** Window width/height in px. */
  width: number;
  height: number;
}
