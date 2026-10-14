import { Armchair, Heart } from 'phosphor-react-native';
import { Pressable, View } from 'react-native';

import { CoverArt, variantFor } from '@/components/cover-art';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import type { Exercise } from '@/data/types';
import { useT } from '@/i18n';
import { haptic } from '@/lib/haptics';
import { formatDuration } from '@/lib/format';
import { cn } from '@/lib/utils';

interface Props {
  exercise: Exercise;
  /** row = list item, tile = carousel tile */
  variant?: 'row' | 'tile';
  isFavorite?: boolean;
  onPress?: () => void;
  onFavorite?: () => void;
  className?: string;
}

function FavoriteButton({ active, onPress }: { active: boolean; onPress?: () => void }) {
  const { t } = useT();
  return (
    <Pressable
      hitSlop={6}
      accessibilityRole="button"
      accessibilityLabel={active ? t('a11y.unfavorite') : t('a11y.favorite')}
      accessibilityState={{ selected: active }}
      onPress={() => {
        haptic.select();
        onPress?.();
      }}
      className="size-11 items-center justify-center"
    >
      <Icon
        as={Heart}
        size={22}
        weight={active ? 'fill' : 'regular'}
        className={active ? 'text-primary' : 'text-muted-foreground'}
      />
    </Pressable>
  );
}

/** Pose card – thumbnail (placeholder figure), name, Sanskrit name, level, duration, favourite. */
export function ExerciseCard({
  exercise: e,
  variant = 'row',
  isFavorite = false,
  onPress,
  onFavorite,
  className,
}: Props) {
  const { t } = useT();
  const duration = formatDuration(e.durationSec, t);
  const label = t('cards.exercise', { name: e.name, level: t(`level.${e.level}`), duration });
  const chair = e.tags.accessibility.includes('chair-friendly');

  if (variant === 'tile') {
    return (
      <View className={cn('w-40', className)}>
        {/* Favourite is a sibling of the pressable card (never nested – nested buttons are invalid on web) */}
        <View className="absolute end-0 top-0 z-10">
          <FavoriteButton active={isFavorite} onPress={onFavorite} />
        </View>
        <Pressable
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel={label}
          className="gap-2 active:opacity-90"
        >
          <CoverArt tint="mint" figure={variantFor(e)} height={120} />
          <View className="gap-0.5 px-1">
            <Text variant="label" numberOfLines={2}>
              {e.name}
            </Text>
            {e.altName ? (
              <Text variant="caption" className="italic" numberOfLines={1}>
                {e.altName}
              </Text>
            ) : null}
            <Text variant="caption">{`${t(`level.${e.level}`)} · ${duration}`}</Text>
          </View>
        </Pressable>
      </View>
    );
  }

  return (
    <View className={cn('rounded-card border border-border bg-card', className)}>
      <View className="absolute end-1 top-1/2 z-10 -mt-[22px]">
        <FavoriteButton active={isFavorite} onPress={onFavorite} />
      </View>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={label}
        className="flex-row items-center gap-3 p-3 pe-14 active:opacity-90"
      >
        <View className="size-[72px] overflow-hidden rounded-2xl">
          <CoverArt tint="mint" figure={variantFor(e)} height={72} width={72} rounded={16} />
        </View>
        <View className="flex-1 gap-1">
          <Text variant="label" numberOfLines={2}>
            {e.name}
          </Text>
          {e.altName ? (
            <Text variant="caption" className="italic" numberOfLines={1}>
              {e.altName}
            </Text>
          ) : null}
          <View className="flex-row flex-wrap items-center gap-1.5">
            <Badge variant="secondary">
              <Text>{t(`level.${e.level}`)}</Text>
            </Badge>
            <Badge variant="outline">
              <Text>{duration}</Text>
            </Badge>
            {chair ? (
              <Badge variant="secondary" accessibilityLabel={t('cards.chairFriendly')}>
                <Icon as={Armchair} size={14} />
              </Badge>
            ) : null}
          </View>
        </View>
      </Pressable>
    </View>
  );
}
