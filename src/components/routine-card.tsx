import { ArrowDown } from 'phosphor-react-native';
import { Pressable, View } from 'react-native';

import { CoverArt, variantFor } from '@/components/cover-art';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { getExercise, type Routine } from '@/data/repo';
import { PremiumBadge } from '@/components/premium-badge';
import { useT } from '@/i18n';
import { minutesOf } from '@/lib/format';
import { cn } from '@/lib/utils';

interface Props {
  routine: Routine;
  /** tile = carousel card (cover on top); row = compact list row */
  variant?: 'tile' | 'row';
  downloaded?: boolean;
  onPress?: () => void;
  className?: string;
}

/** Routine / quick-relief / sleep card. */
export function RoutineCard({ routine: r, variant = 'tile', downloaded, onPress, className }: Props) {
  const { t } = useT();
  const minutes = t('common.minutes', { count: minutesOf(r.totalSec) });
  const firstMain = r.steps.find((s) => s.phase === 'main') ?? r.steps[0];
  const figure = variantFor(getExercise(firstMain.exerciseId));
  const label = t('cards.routine', { title: r.title, duration: minutes, level: t(`level.${r.level}`) });

  const meta = (
    <View className="flex-row flex-wrap items-center gap-2">
      <Badge variant="secondary">
        <Text>{minutes}</Text>
      </Badge>
      <Badge variant="outline">
        <Text>{t(`level.${r.level}`)}</Text>
      </Badge>
      {r.goals[0] ? (
        <Badge variant={r.kind === 'sleep' ? 'lavender' : 'sky'}>
          <Text>{t(`goal.${r.goals[0]}`)}</Text>
        </Badge>
      ) : null}
      {downloaded ? (
        <Badge variant="secondary" accessibilityLabel={t('cards.downloaded')}>
          <Icon as={ArrowDown} size={14} weight="bold" />
        </Badge>
      ) : null}
    </View>
  );

  const premium = (
    <PremiumBadge id={r.id} premium={r.premium} contentKind={r.kind} className="absolute start-2 top-2" />
  );

  if (variant === 'row') {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={label}
        className={cn(
          'flex-row items-center gap-3 rounded-card border border-border bg-card p-3 active:opacity-90',
          className
        )}
      >
        <View className="size-[72px] overflow-hidden rounded-2xl">
          <CoverArt tint={r.cover} figure={figure} height={72} width={72} rounded={12} />
        </View>
        <View className="flex-1 gap-1">
          <Text variant="label" numberOfLines={2}>
            {r.title}
          </Text>
          <Text variant="caption" numberOfLines={1}>
            {r.subtitle}
          </Text>
          {meta}
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      className={cn('w-64 gap-3 active:opacity-90', className)}
    >
      <View>
        <CoverArt tint={r.cover} figure={figure} height={140} />
        {premium}
      </View>
      <View className="gap-2 px-1">
        <Text variant="heading" numberOfLines={2}>
          {r.title}
        </Text>
        <Text variant="caption" numberOfLines={2}>
          {r.subtitle}
        </Text>
        {meta}
      </View>
    </Pressable>
  );
}
