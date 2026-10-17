import { router, type Href } from 'expo-router';
import { CaretRight } from 'phosphor-react-native';
import { I18nManager, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AuroraBackground } from '@/components/aurora-background';
import { GlassCard } from '@/components/glass-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useAppStore } from '@/store/app-store';
import { useAuthStore } from '@/store/auth-store';
import { useProgressStore } from '@/store/progress-store';
import { useTheme } from '@/theme/theme-provider';

/**
 * UI SHOWCASE (development only): every screen from the static-UI brief in one list. Tap one to open it on its own.
 * "Prepare preview" marks onboarding as done and continues as a guest, so app screens open without going through the funnel.
 * This is a review tool, not part of the product's navigation.
 */
const SCREENS: { n: number; name: string; route: string; note: string; isNew?: boolean; replay?: boolean }[] =
  [
    { n: 1, name: 'Welcome', route: '/story', note: 'First story scene (replays the intro)', replay: true },
    { n: 2, name: 'Home', route: '/home', note: 'Greeting, today, styles, programs, favorites' },
    {
      n: 3,
      name: 'Yoga styles',
      route: '/library/styles',
      note: 'Hatha, Vinyasa, Yin, Restorative, Power, Gentle, Chair, Prenatal',
      isNew: true,
    },
    { n: 4, name: 'Exercise library', route: '/explore', note: 'Search, filter chips, pose categories' },
    {
      n: 5,
      name: 'Exercise detail',
      route: '/pose/ex-01',
      note: 'Mountain Pose: steps, cautions, modifications',
    },
    {
      n: 6,
      name: 'Programs',
      route: '/library/programs',
      note: 'Curated by goal, with filter chips',
      isNew: true,
    },
    { n: 7, name: 'Program detail', route: '/program/p-begin', note: 'Yoga for Beginners: weekly schedule' },
    { n: 8, name: 'Workout session', route: '/session/setup?routineId=r-01', note: 'Setup, then the player' },
    { n: 9, name: 'Progress', route: '/progress', note: 'Stats, week, journey, mood' },
    { n: 10, name: 'Profile', route: '/profile', note: 'Companion, goals, settings' },
    { n: 11, name: 'Goals & preferences', route: '/settings/goals', note: 'Goals, experience, time, days' },
    {
      n: 12,
      name: 'Favorites',
      route: '/favorites',
      note: 'Saved poses and routines, with empty state',
      isNew: true,
    },
    { n: 13, name: 'Settings', route: '/settings/preferences', note: 'Voice, music, language, theme, units' },
    { n: 14, name: 'Subscription', route: '/premium', note: 'Free vs Premium (prototype, no purchase)' },
  ];

export default function ScreensShowcase() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const rtl = I18nManager.isRTL;

  const prepare = () => {
    useAppStore.getState().setHasSeenStory(true);
    useAppStore.getState().completeOnboarding();
    useAuthStore.getState().continueAsGuest();
  };
  /** Seed a week of gentle sample practice so Progress, Home and Favorites show populated states. */
  const sampleProgress = () => {
    const st = useProgressStore.getState();
    const mins = [0, 10, 5, 0, 12, 8, 6];
    const titles = ['5-Minute Starter', 'Morning Flow', 'Evening Wind-Down'];
    const ids = ['r-01', 'r-04', 'r-11'];
    mins.forEach((m, back) => {
      if (!m) return;
      const at = new Date();
      at.setDate(at.getDate() - back);
      at.setHours(8, 30, 0, 0);
      st.addSession({
        id: `sample-${back}`,
        at: at.toISOString(),
        contentId: ids[back % 3],
        kind: 'routine',
        title: titles[back % 3],
        plannedSec: m * 60,
        practicedSec: m * 60,
        posesDone: 5,
        completed: true,
        moodBefore: 'tired',
        moodAfter: 'calm',
      });
    });
  };
  const open = (s: (typeof SCREENS)[number]) => {
    if (s.replay) useAppStore.getState().setHasSeenStory(false);
    else prepare();
    router.push(s.route as Href);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <AuroraBackground />
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 40,
          paddingHorizontal: 16,
          gap: 12,
        }}
      >
        <Text variant="title1" style={{ color: colors.forest }}>
          Screen showcase
        </Text>
        <Text variant="body" style={{ color: colors.muted }}>
          Development preview of all 14 screens. Not part of the app navigation.
        </Text>
        <Button variant="secondary" onPress={prepare}>
          <Text>Prepare preview (skip onboarding, continue as guest)</Text>
        </Button>
        <Button variant="outline" onPress={sampleProgress}>
          <Text>Add a week of sample progress</Text>
        </Button>
        {SCREENS.map((s) => (
          <Pressable
            key={s.n}
            onPress={() => open(s)}
            accessibilityRole="button"
            accessibilityLabel={`${s.n}. ${s.name}. ${s.note}`}
          >
            <GlassCard contentStyle={{ padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: colors.mint,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text className="font-sans-bold" variant="callout" style={{ color: colors.forest }}>
                  {s.n}
                </Text>
              </View>
              <View style={{ flex: 1, gap: 2 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text className="font-sans-semibold" variant="bodyLarge" style={{ color: colors.forest }}>
                    {s.name}
                  </Text>
                  {s.isNew ? (
                    <Badge variant="secondary">
                      <Text>New</Text>
                    </Badge>
                  ) : null}
                </View>
                <Text className="font-sans" variant="callout" style={{ color: colors.muted }}>
                  {s.note}
                </Text>
              </View>
              <Icon
                as={CaretRight}
                size={18}
                color={colors.muted}
                style={rtl ? { transform: [{ scaleX: -1 }] } : undefined}
              />
            </GlassCard>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
