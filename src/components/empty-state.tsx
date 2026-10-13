import type { ReactNode } from 'react';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { KaizenIcon } from '@/icons';
import { cn } from '@/lib/utils';
import { useTheme } from '@/theme/theme-provider';

interface Props {
  title: string;
  body?: string;
  cta?: { label: string; onPress: () => void };
  /** Replace the default illustration. The Kai character is plugged in here once C-06 lands. */
  illustration?: ReactNode;
  className?: string;
}

/** Friendly empty state: illustration + warm copy + optional action. */
export function EmptyState({ title, body, cta, illustration, className }: Props) {
  const { tokens } = useTheme();
  return (
    <View className={cn('items-center gap-4 px-8 py-10', className)}>
      {illustration ?? (
        <View className="size-28 items-center justify-center rounded-full bg-secondary">
          <KaizenIcon name="leaf" size={48} color={tokens.sage} />
        </View>
      )}
      <View className="items-center gap-1.5">
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
