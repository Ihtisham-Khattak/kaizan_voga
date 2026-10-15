import { useNetworkState } from 'expo-network';
import { WifiSlash } from 'phosphor-react-native';
import { AnimatePresence, MotiView } from 'moti';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useReduceMotion } from '@/hooks/use-reduced-motion';
import { useT } from '@/i18n';
import { useUiStore } from '@/store/ui-store';

/** True when the device has no connection (or the dev toggle forces it). Other features can read this too. */
export function useIsOffline(): boolean {
  const net = useNetworkState();
  const forced = useUiStore((s) => s.forceOffline);
  return forced || net.isConnected === false || net.isInternetReachable === false;
}

/**
 * Global offline banner (ST-03): slides in under the status bar, calm wording, never blocks the screen.
 * Downloaded sessions keep working offline – the banner says so. Mounted once at the root.
 */
export function OfflineBanner() {
  const { t } = useT();
  const insets = useSafeAreaInsets();
  const reduce = useReduceMotion();
  const offline = useIsOffline();

  return (
    <View pointerEvents="none" style={{ position: 'absolute', top: 0, start: 0, end: 0, zIndex: 50 }}>
      <AnimatePresence>
        {offline ? (
          <MotiView
            key="offline"
            from={{ opacity: 0, translateY: reduce ? 0 : -48 }}
            animate={{ opacity: 1, translateY: 0 }}
            exit={{ opacity: 0, translateY: reduce ? 0 : -48 }}
            transition={{ type: 'timing', duration: 350 }}
            accessibilityLiveRegion="polite"
            accessible
            accessibilityLabel={t('states.offline')}
            style={{ paddingTop: insets.top + 4, paddingHorizontal: 12 }}
          >
            <View className="flex-row items-center gap-3 rounded-card border border-hairline bg-skySoft px-4 py-3">
              <Icon as={WifiSlash} size={20} weight="duotone" className="text-sky" />
              <Text variant="callout" className="flex-1 text-foreground">
                {t('states.offline')}
              </Text>
            </View>
          </MotiView>
        ) : null}
      </AnimatePresence>
    </View>
  );
}
