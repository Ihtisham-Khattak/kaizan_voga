import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetView,
  type BottomSheetBackdropProps,
  type BottomSheetBackgroundProps,
} from '@gorhom/bottom-sheet';
import { X } from 'phosphor-react-native';
import { useCallback, useEffect, useRef, type ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GlassCard } from '@/components/glass-card';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useT } from '@/i18n';
import { useTheme } from '@/theme/theme-provider';

function ScrollBody({ style, children }: { style: object; children: ReactNode }) {
  return <BottomSheetScrollView contentContainerStyle={style}>{children}</BottomSheetScrollView>;
}

/** Frosted-glass sheet surface; page content dims and blurs behind it. */
function SheetBackground({ style }: BottomSheetBackgroundProps) {
  return (
    <GlassCard strong radii={{ tl: 28, tr: 28 }} shadow={false} style={style} contentStyle={{ flex: 1 }} />
  );
}

interface Props {
  visible: boolean;
  onClose: () => void;
  title?: string;
  /** Fixed snap points (e.g. ['50%', '90%']). Omit to size the sheet to its content. */
  snapPoints?: (string | number)[];
  /** Hide the × button for sheets that must be answered (e.g. discomfort sheet keeps it). */
  hideClose?: boolean;
  /** Scrollable body for tall sheets (use with snapPoints, e.g. ['88%']). */
  scrollable?: boolean;
  children: ReactNode;
}

/**
 * Kaizen bottom sheet: soft handle, dimmed backdrop, rounded 28 corners, safe-area padding,
 * labelled close button, keyboard aware. Controlled via `visible`.
 */
export function BottomSheet({ visible, onClose, title, snapPoints, hideClose, scrollable, children }: Props) {
  const ref = useRef<BottomSheetModal>(null);
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { t } = useT();
  // Tall sheets scroll; short ones size to their content.
  const Body = scrollable ? ScrollBody : BottomSheetView;

  // Only dismiss something that was actually presented: calling dismiss() on a never-presented modal
  // can swallow the next present() on web.
  const presented = useRef(false);
  useEffect(() => {
    if (visible) {
      ref.current?.present();
      presented.current = true;
    } else if (presented.current) {
      ref.current?.dismiss();
      presented.current = false;
    }
  }, [visible]);

  const backdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.4}
        pressBehavior="close"
      />
    ),
    []
  );

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={snapPoints}
      enableDynamicSizing={!snapPoints}
      onDismiss={onClose}
      backdropComponent={backdrop}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
      backgroundComponent={SheetBackground}
      handleIndicatorStyle={{ backgroundColor: colors.hairline, width: 44 }}
    >
      <Body style={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 20, gap: 16 }}>
        {title || !hideClose ? (
          <View className="flex-row items-center justify-between gap-3">
            <Text variant="heading" className="flex-1" accessibilityRole="header">
              {title}
            </Text>
            {!hideClose ? (
              <Pressable
                onPress={() => ref.current?.dismiss()}
                accessibilityRole="button"
                accessibilityLabel={t('a11y.closeSheet')}
                className="size-11 items-center justify-center rounded-full bg-secondary"
              >
                <Icon as={X} size={18} weight="bold" className="text-secondary-foreground" />
              </Pressable>
            ) : null}
          </View>
        ) : null}
        {children}
      </Body>
    </BottomSheetModal>
  );
}
