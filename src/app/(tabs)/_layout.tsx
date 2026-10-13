import { Tabs } from 'expo-router';
import { Compass, FlowerLotus, House, Leaf, UserCircle } from 'phosphor-react-native';

import { useT } from '@/i18n';
import { useTheme } from '@/theme/theme-provider';

/**
 * Temporary stock tab bar. Replaced by the custom <TabBar> with the elevated breathing-circle
 * Practice button in card F-11 / T-01.
 */
export default function TabsLayout() {
  const { t } = useT();
  const { tokens } = useTheme();

  const screen = (name: string, title: string, Icon: typeof House) => (
    <Tabs.Screen
      name={name}
      options={{
        title,
        tabBarAccessibilityLabel: title,
        tabBarIcon: ({ color, size, focused }) => <Icon color={color as string} size={size} weight={focused ? 'fill' : 'regular'} />,
      }}
    />
  );

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: tokens.primary,
        tabBarInactiveTintColor: tokens.mutedText,
        tabBarStyle: { backgroundColor: tokens.card, borderTopColor: tokens.border },
        tabBarLabelStyle: { fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 12 },
      }}>
      {screen('home', t('tabs.home'), House)}
      {screen('explore', t('tabs.explore'), Compass)}
      {screen('practice', t('tabs.practice'), FlowerLotus)}
      {screen('progress', t('tabs.progress'), Leaf)}
      {screen('profile', t('tabs.profile'), UserCircle)}
    </Tabs>
  );
}
