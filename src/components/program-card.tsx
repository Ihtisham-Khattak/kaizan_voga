import { Lock } from 'phosphor-react-native';
import { Pressable, View } from 'react-native';

import { CoverArt } from '@/components/cover-art';
import { ProgressRing } from '@/components/progress-ring';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import type { Program } from '@/data/types';
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
        <CoverArt tint={p.cover} height={130} />
        {p.premium ? (
          <View className="absolute start-2 top-2 flex-row items-center gap-1 rounded-full bg-card/90 px-2 py-1">
            <Icon as={Lock} size={12} weight="bold" />
            <Text variant="caption" className="font-sans-semibold text-foreground">
              {t('cards.premium')}
            </Text>
          </View>
        ) : null}
      </View>
      <View className="flex-row items-center gap-3 px-1 pb-1">
        <View className="flex-1 gap-1.5">
          <Text variant="heading" numberOfLines={2}>
            {p.title}
          </Text>
          <View className="flex-row flex-wrap gap-1.5">
            <Badge variant="secondary">
              <Text>{weeks}</Text>
            </Badge>
            <Badge variant="outline">
              <Text>{t(`level.${p.level}`)}</Text>
            </Badge>
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
