import type { Tabs } from 'expo-router';
import { Compass, House, Leaf, UserCircle } from 'phosphor-react-native';
import { MotiView } from 'moti';
import type { ComponentProps, ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GlassCard } from '@/components/glass-card';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useReduceMotion } from '@/hooks/use-reduced-motion';
import { useT } from '@/i18n';
import { KaizenIcon } from '@/icons';
import { haptic } from '@/lib/haptics';
import { cn } from '@/lib/utils';
import { useUiStore } from '@/store/ui-store';
import { useTheme } from '@/theme/theme-provider';

type TabBarFn = NonNullable<ComponentProps<typeof Tabs>['tabBar']>;
type TabBarProps = Parameters<TabBarFn>[0];

const ICONS = { home: House, explore: Compass, progress: Leaf, profile: UserCircle } as const;

/** Height content should reserve at the bottom so nothing hides behind the floating bar. */
export const TAB_BAR_CLEARANCE = 104;

/**
 * Floating glass tab bar: Home · Explore · **Practice (centre, elevated breathing-circle button)** · Progress · Profile.
 * Content scrolls underneath and blurs through the glass. Active tab = bold label + dot + filled icon
 * (never colour alone). The Practice button sits OUTSIDE the glass so it can rise above the bar.
 */
export function TabBar({ state, descriptors, navigation }: TabBarProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { t } = useT();
  const reduce = useReduceMotion();

  const handlers = (routeKey: string, routeName: string, params: object | undefined, focused: boolean) => ({
    onPress: () => {
      haptic.select();
      const event = navigation.emit({ type: 'tabPress', target: routeKey, canPreventDefault: true });
      if (!focused && !event.defaultPrevented) navigation.navigate(routeName, params);
    },
    onLongPress: () => navigation.emit({ type: 'tabLongPress', target: routeKey }),
  });

  const items = state.routes.map((route, index) => {
    const focused = state.index === index;
    const name = route.name as 'home' | 'explore' | 'practice' | 'progress' | 'profile';
    const label = t(`tabs.${name}`);
    const { options } = descriptors[route.key];
    const { onPress, onLongPress } = handlers(route.key, route.name, route.params, focused);

    // keeps the four tabs evenly spaced around the raised Practice button (rendered outside the glass below)
    if (name === 'practice') return <View key={route.key} style={{ flex: 1 }} />;

    const IconCmp = ICONS[name as keyof typeof ICONS];
    if (!IconCmp) return null;
    return (
      <Pressable
        key={route.key}
        onPress={onPress}
        onLongPress={onLongPress}
        accessibilityRole="tab"
        accessibilityLabel={options.tabBarAccessibilityLabel ?? label}
        accessibilityState={{ selected: focused }}
        className="min-h-14 flex-1 items-center justify-center gap-0.5"
      >
        <Icon
          as={IconCmp}
          size={24}
          weight={focused ? 'fill' : 'regular'}
          className={focused ? 'text-primary' : 'text-muted-foreground'}
        />
        <Text
          variant="caption"
          className={cn('text-kz-footnote', focused && 'font-sans-semibold text-foreground')}
        >
          {label}
        </Text>
        <View className={cn('size-1 rounded-full', focused ? 'bg-leaf' : 'bg-transparent')} />
      </Pressable>
    );
  });

  const practiceIndex = state.routes.findIndex((r) => r.name === 'practice');
  let practice: ReactNode = null;
  if (practiceIndex >= 0) {
    const route = state.routes[practiceIndex];
    const focused = state.index === practiceIndex;
    const label = t('tabs.practice');
    const { onLongPress } = handlers(route.key, route.name, route.params, focused);
    // The centre button never navigates: it opens the Practice quick-actions sheet.
    const onPress = () => {
      haptic.select();
      useUiStore.getState().openPractice();
    };
    practice = (
      <View
        pointerEvents="box-none"
        style={{ position: 'absolute', start: 0, end: 0, top: -28, alignItems: 'center' }}
      >
        <Pressable
          onPress={onPress}
          onLongPress={onLongPress}
          accessibilityRole="button"
          accessibilityLabel={descriptors[route.key].options.tabBarAccessibilityLabel ?? label}
          accessibilityState={{ selected: focused }}
          className="items-center gap-1"
        >
          <MotiView
            from={{ scale: 1 }}
            animate={{ scale: reduce ? 1 : 1.07 }}
            transition={{ type: 'timing', duration: 3000, loop: !reduce, repeatReverse: true }}
          >
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                borderWidth: 4,
                borderColor: colors.bgMist,
                backgroundColor: colors.primary,
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: colors.forest,
                shadowOpacity: 0.3,
                shadowRadius: 18,
                shadowOffset: { width: 0, height: 8 },
                elevation: 8,
              }}
            >
              <KaizenIcon name="practice" size={30} color={colors.onPrimary} />
            </View>
          </MotiView>
          <Text
            variant="caption"
            className={cn('text-kz-footnote', focused && 'font-sans-semibold text-foreground')}
          >
            {label}
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View
      pointerEvents="box-none"
      style={{ position: 'absolute', start: 12, end: 12, bottom: Math.max(insets.bottom, 10) + 4 }}
    >
      <GlassCard
        radius={30}
        contentStyle={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 8,
          paddingVertical: 8,
        }}
      >
        {items}
      </GlassCard>
      {practice}
    </View>
  );
}
