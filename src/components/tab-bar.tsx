import type { Tabs } from 'expo-router';
import { Compass, House, Leaf, UserCircle } from 'phosphor-react-native';
import { MotiView } from 'moti';
import type { ComponentProps } from 'react';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useReduceMotion } from '@/hooks/use-reduced-motion';
import { useT } from '@/i18n';
import { KaizenIcon } from '@/icons';
import { haptic } from '@/lib/haptics';
import { cn } from '@/lib/utils';
import { useTheme } from '@/theme/theme-provider';

type TabBarFn = NonNullable<ComponentProps<typeof Tabs>['tabBar']>;
type TabBarProps = Parameters<TabBarFn>[0];

const ICONS = { home: House, explore: Compass, progress: Leaf, profile: UserCircle } as const;

/**
 * Custom 5-tab bar: Home · Explore · **Practice (centre, elevated breathing-circle button)** · Progress · Profile.
 * Active tab = bold label + dot + sage icon (never colour alone). Hidden screens (e.g. session) are filtered out.
 */
export function TabBar({ state, descriptors, navigation }: TabBarProps) {
  const insets = useSafeAreaInsets();
  const { tokens } = useTheme();
  const { t } = useT();
  const reduce = useReduceMotion();

  return (
    <View
      style={{ paddingBottom: Math.max(insets.bottom, 8) }}
      className="flex-row items-end border-t border-border bg-card px-2 pt-2"
    >
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const name = route.name as 'home' | 'explore' | 'practice' | 'progress' | 'profile';
        const label = t(`tabs.${name}`);
        const { options } = descriptors[route.key];

        const onPress = () => {
          haptic.select();
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!focused && !event.defaultPrevented) navigation.navigate(route.name, route.params);
        };
        const onLongPress = () => navigation.emit({ type: 'tabLongPress', target: route.key });

        if (name === 'practice') {
          return (
            <View key={route.key} className="flex-1 items-center" style={{ marginTop: -22 }}>
              <Pressable
                onPress={onPress}
                onLongPress={onLongPress}
                accessibilityRole="button"
                accessibilityLabel={options.tabBarAccessibilityLabel ?? label}
                accessibilityState={{ selected: focused }}
                className="items-center gap-1"
              >
                <MotiView
                  from={{ scale: 1 }}
                  animate={{ scale: reduce ? 1 : 1.07 }}
                  transition={{ type: 'timing', duration: 3000, loop: !reduce, repeatReverse: true }}
                  style={{
                    shadowColor: tokens.forest,
                    shadowOpacity: 0.25,
                    shadowRadius: 18,
                    shadowOffset: { width: 0, height: 8 },
                    elevation: 8,
                  }}
                  className="size-16 items-center justify-center rounded-full border-4 border-card bg-primary"
                >
                  <KaizenIcon name="practice" size={30} color={tokens.primaryForeground} />
                </MotiView>
                <Text
                  variant="caption"
                  className={cn('text-kz-caption', focused && 'font-sans-semibold text-foreground')}
                >
                  {label}
                </Text>
              </Pressable>
            </View>
          );
        }

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
              className={cn('text-kz-caption', focused && 'font-sans-semibold text-foreground')}
            >
              {label}
            </Text>
            <View className={cn('size-1 rounded-full', focused ? 'bg-sage' : 'bg-transparent')} />
          </Pressable>
        );
      })}
    </View>
  );
}
