import { router } from 'expo-router';
import { CaretLeft, Heart } from 'phosphor-react-native';
import { I18nManager, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GlassCard } from '@/components/glass-card';
import { Icon } from '@/components/ui/icon';
import { useT } from '@/i18n';
import { haptic } from '@/lib/haptics';
import { cn } from '@/lib/utils';
import { safeBack } from '@/lib/nav';

/** Floating glass Back (+ optional Favourite) buttons over a hero image. */
export function HeroActions({ favorite, onFavorite }: { favorite?: boolean; onFavorite?: () => void }) {
  const { t } = useT();
  const insets = useSafeAreaInsets();
  return (
    <>
      <GlassCard radius="pill" style={{ position: 'absolute', top: insets.top + 8, start: 12 }}>
        <Pressable
          onPress={() => safeBack()}
          accessibilityRole="button"
          accessibilityLabel={t('a11y.goBack')}
          className="size-11 items-center justify-center"
        >
          <Icon
            as={CaretLeft}
            size={20}
            weight="bold"
            style={I18nManager.isRTL ? { transform: [{ scaleX: -1 }] } : undefined}
          />
        </Pressable>
      </GlassCard>
      {onFavorite ? (
        <GlassCard radius="pill" style={{ position: 'absolute', top: insets.top + 8, end: 12 }}>
          <Pressable
            onPress={() => {
              haptic.select();
              onFavorite();
            }}
            accessibilityRole="button"
            accessibilityLabel={favorite ? t('a11y.unfavorite') : t('a11y.favorite')}
            accessibilityState={{ selected: !!favorite }}
            className="size-11 items-center justify-center"
          >
            <Icon
              as={Heart}
              size={22}
              weight={favorite ? 'fill' : 'regular'}
              className={cn(favorite ? 'text-primary' : 'text-foreground')}
            />
          </Pressable>
        </GlassCard>
      ) : null}
    </>
  );
}
