import { Tabs } from 'expo-router';

import { TabBar } from '@/components/tab-bar';
import { useT } from '@/i18n';

/** Custom tab bar (card F-11): the centre Practice button opens quick actions once T-01 lands. */
export default function TabsLayout() {
  const { t } = useT();
  return (
    <Tabs tabBar={(props) => <TabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="home"
        options={{ title: t('tabs.home'), tabBarAccessibilityLabel: t('tabs.home') }}
      />
      <Tabs.Screen
        name="explore"
        options={{ title: t('tabs.explore'), tabBarAccessibilityLabel: t('tabs.explore') }}
      />
      <Tabs.Screen
        name="practice"
        options={{ title: t('tabs.practice'), tabBarAccessibilityLabel: t('tabs.practice') }}
      />
      <Tabs.Screen
        name="progress"
        options={{ title: t('tabs.progress'), tabBarAccessibilityLabel: t('tabs.progress') }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: t('tabs.profile'), tabBarAccessibilityLabel: t('tabs.profile') }}
      />
    </Tabs>
  );
}
