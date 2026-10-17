import { Pressable, View } from 'react-native';

import { CoverArt } from '@/components/cover-art';
import { PROGRAM_MOTIF } from '@/components/cover-motifs';
import { DifficultyBadge } from '@/components/difficulty-badge';
import { ProgressRing } from '@/components/progress-ring';
import { Badge } from '@/components/ui/badge';
import { Text } from '@/components/ui/text';
import type { Program } from '@/data/types';
import { PremiumBadge } from '@/components/premium-badge';
import { useT } from '@/i18n';
import { cn } from '@/lib/utils';

interface Props {
  program: Program;
  /** Days completed so far; when set (> 0) a progress ring is shown. */
  completedDays?: number;
  onPress?: () => void;
  className?: string;
}

/** Wide multi-week program card with optional progress ring and premium lock. */
export function ProgramCard({ program: p, completedDays = 0, onPress, className }: Props) {
  const { t } = useT();
  const total = p.days.length;
  const started = completedDays > 0;
  const weeks = t('cards.weeks', { count: p.weeks });
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={t('cards.program', { title: p.title, weeks })}
      className={cn(
        'w-full gap-3 overflow-hidden rounded-card border border-border bg-card p-3 active:opacity-90',
        className
      )}
    >
      <View>
        <CoverArt tint={p.cover} motif={PROGRAM_MOTIF[p.theme]} height={130} />
        <PremiumBadge
          id={p.id}
          premium={p.premium}
          contentKind="program"
          className="absolute start-2 top-2"
        />
      </View>
      <View className="flex-row items-center gap-3 px-1 pb-1">
        <View className="flex-1 gap-2">
          <Text variant="heading" numberOfLines={2}>
            {p.title}
          </Text>
          <View className="flex-row flex-wrap gap-2">
            <Badge variant="secondary">
              <Text>{weeks}</Text>
            </Badge>
            <DifficultyBadge level={p.level} />
          </View>
        </View>
        {started ? (
          <ProgressRing
            progress={completedDays / total}
            size={56}
            strokeWidth={6}
            accessibilityLabel={t('cards.dayOf', { day: completedDays, total })}
          >
            <Text variant="caption" className="font-sans-semibold text-foreground">
              {completedDays}
            </Text>
          </ProgressRing>
        ) : null}
      </View>
    </Pressable>
  );
}
