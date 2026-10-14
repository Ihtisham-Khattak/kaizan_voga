import type { ReactNode } from 'react';
import { View } from 'react-native';

import { Character } from '@/characters/character';
import type { KaiPose } from '@/characters/types';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import type { Mood } from '@/store/types';

interface Props {
  title: string;
  body?: string;
  cta?: { label: string; onPress: () => void };
  /** Kai's mood for this situation (e.g. 'tired' for errors, 'calm' for nothing-here-yet). */
  mood?: Mood;
  pose?: KaiPose;
  /** Replace Kai with something else. */
  illustration?: ReactNode;
  className?: string;
}

/** Friendly empty state: Kai + warm copy + optional action. */
export function EmptyState({
  title,
  body,
  cta,
  mood = 'calm',
  pose = 'float',
  illustration,
  className,
}: Props) {
  return (
    <View className={cn('items-center gap-4 px-8 py-8', className)}>
      {illustration ?? <Character name="kai" pose={pose} mood={mood} size={150} />}
      <View className="items-center gap-2">
        <Text variant="title" className="text-center">
          {title}
        </Text>
        {body ? (
          <Text variant="body" className="text-center text-muted-foreground">
            {body}
          </Text>
        ) : null}
      </View>
      {cta ? (
        <Button variant="secondary" onPress={cta.onPress}>
          <Text>{cta.label}</Text>
        </Button>
      ) : null}
    </View>
  );
}
