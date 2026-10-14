import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
      {/* setup floats over the previous screen as a glass sheet */}
      <Stack.Screen
        name="setup"
        options={{ presentation: 'transparentModal', animation: 'slide_from_bottom' }}
      />
      <Stack.Screen name="player" options={{ gestureEnabled: false }} />
      <Stack.Screen name="complete" options={{ gestureEnabled: false }} />
    </Stack>
  );
}
