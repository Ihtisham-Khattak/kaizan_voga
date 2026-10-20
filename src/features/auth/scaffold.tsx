import { router } from 'expo-router';
import { CaretLeft } from 'phosphor-react-native';
import type { ReactNode } from 'react';
import { I18nManager, Pressable, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Character } from '@/characters/character';
import { Blob } from '@/components/cover-art';
import { FadeUp } from '@/components/fade-up';
import { GlassCard } from '@/components/glass-card';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useT } from '@/i18n';
import type { Mood } from '@/store/types';
import { useTheme } from '@/theme/theme-provider';
import { safeBack } from '@/lib/nav';

interface Props {
  title: string;
  subtitle?: string;
  mood?: Mood;
  /** Hide the back arrow (e.g. the success state). */
  hideBack?: boolean;
  children: ReactNode;
  /** Quiet links under the form ("Already have an account? Sign in"). */
  footer?: ReactNode;
}

/**
 * Shared auth layout: soft backdrop, back button, Kai, title, form area that keeps the focused field above the
 * keyboard, and a footer. Used by every auth screen so they feel like one flow.
 */
export function AuthScaffold({ title, subtitle, mood = 'calm', hideBack, children, footer }: Props) {
  const { t } = useT();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View className="flex-1 bg-background">
      <View style={{ position: 'absolute', end: -70, top: -50 }} pointerEvents="none">
        <Blob color={colors.leaf} size={280} opacity={0.14} />
      </View>
      <View style={{ position: 'absolute', start: -80, bottom: 60 }} pointerEvents="none">
        <Blob color={colors.skySoft} size={240} opacity={0.25} />
      </View>

      {!hideBack && router.canGoBack() ? (
        <GlassCard radius={22} style={{ position: 'absolute', top: insets.top + 8, start: 12, zIndex: 5 }}>
          <Pressable
            onPress={() => safeBack()}
            accessibilityRole="button"
            accessibilityLabel={t('a11y.goBack')}
            className="size-11 items-center justify-center"
          >
            <Icon
              as={CaretLeft}
              size={20}
              weight="bold"
              style={I18nManager.isRTL ? { transform: [{ scaleX: -1 }] } : undefined}
            />
          </Pressable>
        </GlassCard>
      ) : null}

      <KeyboardAwareScrollView
        bottomOffset={32}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + 56,
          paddingBottom: insets.bottom + 32,
          paddingHorizontal: 24,
          gap: 24,
        }}
      >
        <View className="items-center">
          <Character name="kai" pose="float" mood={mood} size={104} />
        </View>
        <FadeUp className="gap-2">
          <Text variant="title1" className="text-center">
            {title}
          </Text>
          {subtitle ? (
            <Text variant="body" className="text-center text-muted-foreground">
              {subtitle}
            </Text>
          ) : null}
        </FadeUp>
        <FadeUp delay={150} className="gap-4">
          {children}
        </FadeUp>
        {footer ? <View className="items-center gap-1">{footer}</View> : null}
      </KeyboardAwareScrollView>
    </View>
  );
}
