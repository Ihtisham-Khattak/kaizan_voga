import '@/global.css';

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ToastHost } from '@/components/toast';
import { applyDirection } from '@/i18n/direction';
import { detectLanguage, i18n, setLanguage } from '@/i18n';
import { useAppStore, useAuthStore, useStoresHydrated } from '@/store';
import { useAppFonts } from '@/theme/fonts';
import { ThemeProvider } from '@/theme/theme-provider';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const fontsReady = useAppFonts();
  const hydrated = useStoresHydrated();

  useEffect(() => {
    if (fontsReady && hydrated) SplashScreen.hideAsync();
  }, [fontsReady, hydrated]);

  if (!fontsReady || !hydrated) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <KeyboardProvider>
          <ThemeProvider>
            <BottomSheetModalProvider>
              <LanguageSync />
              <RootStack />
              <ToastHost />
              <PortalHost />
            </BottomSheetModalProvider>
          </ThemeProvider>
        </KeyboardProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

/** Keeps i18next + native layout direction in step with the persisted language. */
function LanguageSync() {
  const language = useAppStore((s) => s.language);
  const hasSeenStory = useAppStore((s) => s.hasSeenStory);
  const onboardingComplete = useAppStore((s) => s.onboardingComplete);
  const set = useAppStore((s) => s.set);

  // First launch only: follow the device language if we support it.
  useEffect(() => {
    if (!hasSeenStory && !onboardingComplete) {
      const detected = detectLanguage();
      if (detected !== language) set({ language: detected });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (i18n.language !== language) setLanguage(language);

  useEffect(() => {
    applyDirection(language);
  }, [language]);

  return null;
}

/**
 * Route guards – the app is one linear funnel the first time, then straight to Home:
 *   story → personalization → plan reveal → account gate (sign up / sign in / guest) → tabs
 */
function RootStack() {
  const hasSeenStory = useAppStore((s) => s.hasSeenStory);
  const onboardingComplete = useAppStore((s) => s.onboardingComplete);
  const authStatus = useAuthStore((s) => s.status);

  const inStory = !hasSeenStory;
  const inOnboarding = !onboardingComplete;
  const inApp = onboardingComplete && authStatus !== 'none';

  return (
    <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Screen name="index" />

      <Stack.Protected guard={inStory}>
        <Stack.Screen name="(story)" />
      </Stack.Protected>

      <Stack.Protected guard={inOnboarding}>
        <Stack.Screen name="(onboarding)" />
      </Stack.Protected>

      {/* Sign in / sign up are reachable from the Welcome scene, the account gate and Profile (guests). */}
      <Stack.Screen name="(auth)" />

      <Stack.Protected guard={inApp}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="pose/[id]" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="routine/[id]" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="routine/custom/[id]" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="program/[id]" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="search" options={{ animation: 'fade' }} />
        <Stack.Screen name="session" options={{ animation: 'fade', gestureEnabled: false }} />
        <Stack.Screen name="breathing" options={{ animation: 'fade' }} />
        <Stack.Screen name="premium" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
        <Stack.Screen name="settings" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="support" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="library" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="coming-soon" options={{ presentation: 'modal' }} />
      </Stack.Protected>

      {/* Developer tools – always reachable in dev builds */}
      <Stack.Protected guard={__DEV__}>
        <Stack.Screen name="dev" options={{ animation: 'slide_from_right' }} />
      </Stack.Protected>
    </Stack>
  );
}
