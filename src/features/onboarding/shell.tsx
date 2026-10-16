import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { CaretLeft, CaretRight } from 'phosphor-react-native';
import { useEffect, type ReactNode } from 'react';
import { I18nManager, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AuroraBackground, type AuroraTone } from '@/components/aurora-background';
import { FadeUp } from '@/components/fade-up';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useT } from '@/i18n';
import { useAppStore } from '@/store/app-store';
import { useTheme } from '@/theme/theme-provider';

import { KaiReaction } from './kai-reaction';
import { goBack, goNext, REQUIRED, STEPS, stepIndex, type StepKey } from './steps';

interface Props {
  step: StepKey;
  title: string;
  subtitle?: string;
  children: ReactNode;
  /** Enables Continue. Defaults to true. */
  canContinue?: boolean;
  onContinue?: () => void;
  continueLabel?: string;
  /** Kai's friendly reaction to the current answer (null/undefined hides it). */
  reaction?: string | null;
  /** Called when the user skips; defaults to just moving on. Apply sensible defaults here. */
  onSkip?: () => void;
  /** Hide Back (first step). */
  hideBack?: boolean;
  /** Optional quiet action under Continue (e.g. "I'm under 18", "Not now"). */
  secondary?: { label: string; onPress: () => void };
  /** Time-of-day mood for this screen's background (see AuroraBackground). Leave undefined for the default. */
  tone?: AuroraTone | null;
  /** Decoration drawn behind the content (e.g. a sun or moon for the practice-time question). */
  backdrop?: ReactNode;
}

/**
 * Layout shared by every personalization step, built on the docs/UI_Build.md tokens: aurora background, Back · progress
 * · Skip, a "Step n of N" chip, a Fraunces display title, scrolling content, and a Continue button pinned over a soft
 * fade with Kai's reaction above it. Age + Safety cannot be skipped.
 */
export function PersonalizationShell({
  step,
  title,
  subtitle,
  children,
  canContinue = true,
  onContinue,
  continueLabel,
  reaction,
  onSkip,
  hideBack,
  secondary,
  tone,
  backdrop,
}: Props) {
  const { t } = useT();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const index = stepIndex(step);
  const progress = (index + 1) / STEPS.length;
  const required = REQUIRED.includes(step);
  const rtl = I18nManager.isRTL;

  // Remember where the user is so a relaunch resumes here.
  useEffect(() => {
    useAppStore.getState().setOnboardingStep(`/${step}`);
  }, [step]);

  const bottom = Math.max(insets.bottom, 16);
  // button (56) + optional secondary (48) + reaction (60) + padding
  const footerH = 56 + (secondary ? 48 : 0) + 60 + bottom + 24;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <AuroraBackground tone={tone} />
      {backdrop}

      {/* header: back · progress · skip */}
      <View
        style={{
          paddingTop: insets.top + 8,
          paddingHorizontal: 16,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
        }}
      >
        {hideBack ? (
          <View style={{ width: 44, height: 44 }} />
        ) : (
          <Pressable
            onPress={() => goBack(step)}
            accessibilityRole="button"
            accessibilityLabel={t('a11y.goBack')}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: colors.mint,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon
              as={CaretLeft}
              size={20}
              weight="bold"
              color={colors.forest}
              style={rtl ? { transform: [{ scaleX: -1 }] } : undefined}
            />
          </Pressable>
        )}

        <View
          style={{ flex: 1, height: 8, borderRadius: 4, overflow: 'hidden', backgroundColor: colors.mint }}
          accessible
          accessibilityRole="progressbar"
          accessibilityLabel={t('onboarding.progress', { current: index + 1, total: STEPS.length })}
          accessibilityValue={{ min: 0, max: 100, now: Math.round(progress * 100) }}
        >
          <MotiView
            from={{ width: `${(index / STEPS.length) * 100}%` }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ type: 'timing', duration: 600 }}
            style={{ height: '100%', borderRadius: 4, backgroundColor: colors.leaf }}
          />
        </View>

        {required ? (
          <View style={{ minWidth: 44 }} />
        ) : (
          <Pressable
            onPress={onSkip ?? (() => goNext(step))}
            accessibilityRole="button"
            accessibilityLabel={t('common.skip')}
            style={{
              minHeight: 44,
              minWidth: 44,
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 4,
            }}
          >
            <Text variant="bodyLarge" style={{ color: colors.muted }}>
              {t('common.skip')}
            </Text>
          </Pressable>
        )}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 20,
          paddingBottom: footerH + 24,
          gap: 20,
        }}
      >
        <FadeUp style={{ gap: 12, alignItems: 'flex-start' }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              borderRadius: 999,
              paddingHorizontal: 12,
              paddingVertical: 6,
              backgroundColor: colors.mint,
            }}
          >
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.leaf }} />
            <Text variant="overline" style={{ color: colors.forest }}>
              {t('onboarding.progress', { current: index + 1, total: STEPS.length })}
            </Text>
          </View>
          <Text variant="display" accessibilityRole="header" style={{ color: colors.forest }}>
            {title}
          </Text>
          {subtitle ? (
            <Text variant="bodyLarge" style={{ color: colors.muted }}>
              {subtitle}
            </Text>
          ) : null}
        </FadeUp>
        {children}
      </ScrollView>

      {/* footer: a soft fade so the list never runs into the button, Kai's reaction, then Continue */}
      <LinearGradient
        pointerEvents="none"
        colors={[colors.bg + '00', colors.bg, colors.bg]}
        locations={[0, 0.32, 1]}
        style={{ position: 'absolute', start: 0, end: 0, bottom: 0, height: footerH }}
      />
      <View
        pointerEvents="box-none"
        style={{ position: 'absolute', start: 16, end: 16, bottom: bottom, gap: 0 }}
      >
        <KaiReaction text={reaction} />
        <Button size="lg" disabled={!canContinue} onPress={onContinue ?? (() => goNext(step))}>
          <Text>{continueLabel ?? t('common.continue')}</Text>
          <Icon
            as={CaretRight}
            size={18}
            weight="bold"
            color={colors.onPrimary}
            style={rtl ? { transform: [{ scaleX: -1 }] } : undefined}
          />
        </Button>
        {secondary ? (
          <Button variant="ghost" onPress={secondary.onPress}>
            <Text>{secondary.label}</Text>
          </Button>
        ) : null}
      </View>
    </View>
  );
}
