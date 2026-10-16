import { MotiView } from 'moti';
import { createContext, useContext } from 'react';
import { Easing } from 'react-native-reanimated';
import Svg from 'react-native-svg';

import { useReduceMotion } from '@/hooks/use-reduced-motion';
import type { Mood } from '@/store/types';

import { BUST_VIEWBOX, HUMAN_VIEWBOX, styleFor, type Outfit } from './art/human';
import { HUMAN_STYLES } from './art/styles';
import { Human } from './engine/human';
import { Kai, KAI_VIEWBOX } from './kai';
import type { CharacterName, HumanPose, KaiPose, Pose } from './types';

/** Art style for people. Screens opt in to 'clay' (soft figurine look) by wrapping their content in <CharacterLook look="clay">. */
export type Look = 'flat' | 'clay';
const LookContext = createContext<Look>('flat');
export const CharacterLook = LookContext.Provider;

const HUMAN_BUST = BUST_VIEWBOX;
const KAI_BUST = '8 6 144 150';

const styles = HUMAN_STYLES;

const HUMAN_POSES: HumanPose[] = ['stand', 'sit', 'wave', 'yoga', 'reach', 'sideReach'];
const KAI_POSES: KaiPose[] = ['float', 'wave', 'celebrate', 'bell', 'sleep'];

/** Accepts any Pose and maps it to something this character can do. */
function resolvePose(name: CharacterName, pose: Pose): HumanPose | KaiPose {
  if (name === 'kai') {
    if ((KAI_POSES as string[]).includes(pose)) return pose as KaiPose;
    return pose === 'yoga' ? 'sleep' : 'float';
  }
  if ((HUMAN_POSES as string[]).includes(pose)) return pose as HumanPose;
  return pose === 'celebrate' ? 'wave' : 'stand';
}

const DISPLAY = { hina: 'Hina', arfa: 'Arif', hamid: 'Hamid', sierra: 'Sarah', kai: 'Kai' } as const;

export interface CharacterProps {
  name: CharacterName;
  pose?: Pose;
  mood?: Mood;
  /** Rendered height in px. */
  size?: number;
  /** Mirror horizontally (use for RTL or to face the other way). */
  flip?: boolean;
  /** 'bust' = head and shoulders, for avatars. */
  crop?: 'full' | 'bust';
  /** Blink, idle float and waving. Off in dense grids. */
  animated?: boolean;
  /** Everyday clothes or session clothes. Same person either way. */
  outfit?: Outfit;
  /** Overrides the look set by <CharacterLook>. */
  look?: Look;
}

/**
 * THE character component. Every screen uses this – characters are never redrawn per screen,
 * which is what keeps Hina, Arif, Hamid, Sarah and Kai identical everywhere.
 */
export function Character({
  name,
  pose = name === 'kai' ? 'float' : 'stand',
  mood = 'neutral',
  size = 200,
  flip,
  crop = 'full',
  animated = true,
  outfit = 'everyday',
  look,
}: CharacterProps) {
  const reduce = useReduceMotion();
  const ctxLook = useContext(LookContext);
  const clay = (look ?? ctxLook) === 'clay';
  const resolved = resolvePose(name, pose);
  const isKai = name === 'kai';

  const viewBox = isKai
    ? crop === 'bust'
      ? KAI_BUST
      : KAI_VIEWBOX
    : crop === 'bust'
      ? HUMAN_BUST
      : HUMAN_VIEWBOX;
  const [, , vw, vh] = viewBox.split(' ').map(Number);
  const width = (size * vw) / vh;

  // Gentle idle: Kai floats, humans breathe. Nothing moves with Reduce Motion.
  const bob = animated && !reduce ? (isKai ? 6 : 1.6) : 0;

  return (
    <MotiView
      from={{ translateY: 0 }}
      animate={{ translateY: bob ? -bob : 0 }}
      transition={{
        type: 'timing',
        duration: isKai ? 2600 : 3400,
        loop: !!bob,
        repeatReverse: true,
        easing: Easing.inOut(Easing.sin),
      }}
      style={{ width, height: size, transform: [{ scaleX: flip ? -1 : 1 }] }}
      accessible
      accessibilityRole="image"
      accessibilityLabel={`${DISPLAY[name]}, ${mood}`}
    >
      <Svg width={width} height={size} viewBox={viewBox}>
        {isKai ? (
          <Kai pose={resolved as KaiPose} mood={mood} animated={animated} />
        ) : (
          <Human
            style={styleFor(styles[name], outfit)}
            pose={resolved as HumanPose}
            mood={mood}
            animated={animated}
            clay={clay}
          />
        )}
      </Svg>
    </MotiView>
  );
}

export { HUMAN_POSES, KAI_POSES };
