import { MotiView } from 'moti';
import { View } from 'react-native';

import { signature, type CharacterName } from '@/characters/palette';
import { Text } from '@/components/ui/text';
import { useReduceMotion } from '@/hooks/use-reduced-motion';
import { cn } from '@/lib/utils';
import { spring } from '@/theme/motion';

const DISPLAY_NAME: Record<CharacterName, string> = {
  zara: 'Zara',
  ali: 'Ali',
  hina: 'Hina',
  omar: 'Omar',
  kai: 'Kai',
};

interface Props {
  speaker: CharacterName;
  text: string;
  /** Delay before it pops in (story scenes stagger bubbles by ~600 ms). */
  delay?: number;
  /** Controlled visibility so a scene can start/stop its sequence. */
  visible?: boolean;
  /** Which side the tail sits on. Uses start/end so it mirrors in RTL. */
  tail?: 'start' | 'end' | 'none';
  /** Horizontal tail position as a fraction (0–1) of the bubble width from the start edge – points at the speaker. */
  tailAt?: number;
  /** Show the speaker's name above the text. */
  showName?: boolean;
  className?: string;
}

/**
 * Story speech bubble. Pops in with a soft spring (fade only with Reduce Motion).
 * The speaker's signature colour appears as a dot beside the name – never as the only identifier.
 */
export function SpeechBubble({
  speaker,
  text,
  delay = 0,
  visible = true,
  tail = 'start',
  tailAt,
  showName = true,
  className,
}: Props) {
  const reduce = useReduceMotion();
  const name = DISPLAY_NAME[speaker];

  return (
    <MotiView
      from={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.92, translateY: 10 }}
      animate={
        visible
          ? { opacity: 1, scale: 1, translateY: 0 }
          : reduce
            ? { opacity: 0 }
            : { opacity: 0, scale: 0.92, translateY: 10 }
      }
      transition={
        reduce ? { type: 'timing', duration: 300, delay } : { type: 'spring', ...spring.pop, delay }
      }
      pointerEvents={visible ? 'auto' : 'none'}
      accessibilityLiveRegion="polite"
      accessible
      accessibilityLabel={`${name}: ${text}`}
      className={className}
    >
      <View className="gap-1 rounded-[20px] border border-border bg-card px-4 py-3 shadow-lg shadow-forest/10">
        {showName ? (
          <View className="flex-row items-center gap-1.5">
            <View style={{ backgroundColor: signature[speaker] }} className="size-2.5 rounded-full" />
            <Text variant="caption" className="font-sans-semibold text-foreground">
              {name}
            </Text>
          </View>
        ) : null}
        <Text variant="body">{text}</Text>
      </View>
      {tail !== 'none' ? (
        <View
          className={cn(
            'absolute -bottom-[7px] size-3.5 rotate-45 border-b border-r border-border bg-card',
            tailAt === undefined && (tail === 'start' ? 'start-6' : 'end-6')
          )}
          style={tailAt === undefined ? undefined : { start: `${Math.round(tailAt * 100)}%`, marginStart: -7 }}
        />
      ) : null}
    </MotiView>
  );
}
