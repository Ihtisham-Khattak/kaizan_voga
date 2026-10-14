import { Leaf } from 'phosphor-react-native';
import type { ReactNode } from 'react';
import { View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

interface Props {
  /** inline = small soft caution inside pose/session screens; full = onboarding safety card */
  variant?: 'inline' | 'full';
  title?: string;
  /** One or more short lines. */
  lines?: string[];
  children?: ReactNode;
  className?: string;
}

/**
 * Soft warning card – friendly, never alarming. Solid surface (never glass), `danger` icon + hairline edge + text (not colour alone).
 */
export function SafetyNotice({ variant = 'inline', title, lines = [], children, className }: Props) {
  const full = variant === 'full';
  return (
    <View
      accessible
      accessibilityRole="summary"
      className={cn(
        'rounded-card border border-danger/30 bg-bgMist',
        full ? 'gap-3 p-6' : 'gap-2 p-4',
        className
      )}
    >
      <View className="flex-row items-center gap-2">
        <Icon as={Leaf} size={full ? 26 : 20} weight="duotone" className="text-danger" />
        {title ? (
          <Text variant={full ? 'heading' : 'label'} className="flex-1">
            {title}
          </Text>
        ) : null}
      </View>
      {lines.map((l) => (
        <Text key={l} variant={full ? 'body' : 'caption'} className={cn(!full && 'text-foreground')}>
          {l}
        </Text>
      ))}
      {children}
    </View>
  );
}
