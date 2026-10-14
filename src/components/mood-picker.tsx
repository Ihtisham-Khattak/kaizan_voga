import { useEffect } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

import { Face } from '@/characters/engine/face';
import { Text } from '@/components/ui/text';
import { useReduceMotion } from '@/hooks/use-reduced-motion';
import { useT } from '@/i18n';
import { haptic } from '@/lib/haptics';
import { cn } from '@/lib/utils';
import { MOODS, type Mood } from '@/store/types';
import { spring } from '@/theme/motion';
import { art } from '@/theme/illustration';

/** One round mood face – same face system as the characters. Fixed palette so it reads in both themes. */
export function MoodFace({ mood, size = 52 }: { mood: Mood; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Circle cx={50} cy={50} r={50} fill={art.sand} />
      <Face mood={mood} />
    </Svg>
  );
}

function MoodOption({
  mood,
  index,
  selected,
  size,
  onSelect,
}: {
  mood: Mood;
  index: number;
  selected: boolean;
  size: number;
  onSelect: (m: Mood) => void;
}) {
  const { t } = useT();
  const reduce = useReduceMotion();
  const scale = useSharedValue(1);
  useEffect(() => {
    scale.value = reduce ? 1 : withSpring(selected ? 1.12 : 1, spring.gentle);
  }, [selected, reduce, scale]);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const label = t(`mood.${mood}`);

  return (
    <Pressable
      role="radio"
      aria-checked={selected}
      accessibilityLabel={t('mood.a11y', { mood: label, n: index + 1, total: MOODS.length })}
      accessibilityState={{ selected }}
      onPress={() => {
        haptic.select();
        onSelect(mood);
      }}
      className="min-h-11 min-w-11 flex-1 items-center gap-2 py-1"
    >
      <Animated.View
        style={style}
        className={cn(
          'items-center justify-center rounded-full border-[3px] p-1',
          selected ? 'border-leaf' : 'border-transparent'
        )}
      >
        <MoodFace mood={mood} size={size} />
      </Animated.View>
      {/* Label + weight change so selection never relies on colour alone */}
      <Text variant="caption" className={cn('text-center', selected && 'font-sans-semibold text-foreground')}>
        {label}
      </Text>
    </Pressable>
  );
}

interface Props {
  value: Mood | null;
  onChange: (m: Mood) => void;
  size?: number;
  className?: string;
}

/** Five faces: stressed · tired · neutral · calm · happy. */
export function MoodPicker({ value, onChange, size = 52, className }: Props) {
  return (
    <View role="radiogroup" className={cn('flex-row items-start justify-between', className)}>
      {MOODS.map((m, i) => (
        <MoodOption key={m} mood={m} index={i} selected={value === m} size={size} onSelect={onChange} />
      ))}
    </View>
  );
}
