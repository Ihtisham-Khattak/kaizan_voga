import { CheckCircle, Info, Leaf } from 'phosphor-react-native';
import { MotiView } from 'moti';
import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GlassCard } from '@/components/glass-card';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useReduceMotion } from '@/hooks/use-reduced-motion';
import { haptic } from '@/lib/haptics';

type ToastKind = 'success' | 'info' | 'gentle';
interface ToastItem {
  id: number;
  message: string;
  kind: ToastKind;
}

type Listener = (t: ToastItem) => void;
let listener: Listener | null = null;
let counter = 0;

const emit = (message: string, kind: ToastKind) => listener?.({ id: ++counter, message, kind });

/** Imperative API: `toast.success('Saved to favourites')` from anywhere. Needs <ToastHost /> mounted once at the root. */
export const toast = {
  success: (message: string) => {
    haptic.success();
    emit(message, 'success');
  },
  info: (message: string) => emit(message, 'info'),
  /** Gentle heads-up – never alarming. */
  gentle: (message: string) => emit(message, 'gentle'),
};

const ICON = { success: CheckCircle, info: Info, gentle: Leaf } as const;
const TONE = { success: 'leaf', info: undefined, gentle: 'sky' } as const;

const DURATION = 3000;

export function ToastHost() {
  const insets = useSafeAreaInsets();
  const reduce = useReduceMotion();
  const [item, setItem] = useState<ToastItem | null>(null);

  useEffect(() => {
    listener = setItem;
    return () => {
      listener = null;
    };
  }, []);

  useEffect(() => {
    if (!item) return;
    const id = setTimeout(() => setItem(null), DURATION);
    return () => clearTimeout(id);
  }, [item]);

  const dismiss = useCallback(() => setItem(null), []);
  // Swipe up to dismiss
  const pan = Gesture.Pan().onEnd((e) => {
    if (e.translationY < -16) runOnJS(dismiss)();
  });

  if (!item) return null;
  const IconCmp = ICON[item.kind];

  return (
    <View pointerEvents="box-none" style={{ position: 'absolute', top: insets.top + 8, start: 16, end: 16 }}>
      <GestureDetector gesture={pan}>
        <MotiView
          key={item.id}
          from={reduce ? { opacity: 0 } : { opacity: 0, translateY: -16 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 350 }}
          accessibilityLiveRegion="polite"
          accessible
          accessibilityLabel={item.message}
        >
          <GlassCard
            strong
            radius="card"
            tone={TONE[item.kind]}
            contentStyle={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
              paddingHorizontal: 16,
              paddingVertical: 12,
            }}
          >
            <Icon as={IconCmp} size={22} weight="duotone" className="text-primary" />
            <Text variant="body" className="flex-1">
              {item.message}
            </Text>
          </GlassCard>
        </MotiView>
      </GestureDetector>
    </View>
  );
}
