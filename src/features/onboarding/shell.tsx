import { MotiView } from 'moti';
import { CaretLeft } from 'phosphor-react-native';
import { useEffect, type ReactNode } from 'react';
import { I18nManager, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AuroraBackground } from '@/components/aurora-background';
import { Blob } from '@/components/cover-art';
import { GlassCard } from '@/components/glass-card';
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
}

/**
 * Layout shared by every personalization step: progress bar, Back + Skip, large title, scrolling content,
 * a Kai reaction and the primary Continue button pinned to the bottom. Age + Safety cannot be skipped.
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
}: Props) {
  const { t } = useT();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const index = stepIndex(step);
  const progress = index / (STEPS.length - 1);
  const required = REQUIRED.includes(step);

  // Remember where the user is so a relaunch resumes here.
  useEffect(() => {
    useAppStore.getState().setOnboardingStep(`/${step}`);
  }, [step]);

  const footerH = 112 + insets.bottom;

  return (
    <View className="flex-1 bg-background">
      <AuroraBackground />
      {/* soft organic backdrop */}
      <View style={{ position: 'absolute', end: -60, top: -40 }} pointerEvents="none">
        <Blob color={colors.leaf} size={260} opacity={0.12} />
      </View>
      <View style={{ position: 'absolute', start: -70, bottom: 120 }} pointerEvents="none">
        <Blob color={colors.sunriseSoft} size={220} opacity={0.22} />
      </View>

      {/* header: back · progress · skip */}
      <View style={{ paddingTop: insets.top + 8 }} className="flex-row items-center gap-3 px-4">
        {hideBack ? (
          <View className="size-11" />
        ) : (
          <Pressable
            onPress={() => goBack(step)}
            accessibilityRole="button"
            accessibilityLabel={t('a11y.goBack')}
            className="size-11 items-center justify-center rounded-full bg-card/80"
          >
            <Icon
              as={CaretLeft}
              size={20}
              weight="bold"
              style={I18nManager.isRTL ? { transform: [{ scaleX: -1 }] } : undefined}
            />
          </Pressable>
        )}

        <View
          className="h-2 flex-1 overflow-hidden rounded-full bg-secondary"
          accessible
          accessibilityRole="progressbar"
          accessibilityLabel={t('onboarding.progress', { current: index + 1, total: STEPS.length })}
          accessibilityValue={{ min: 0, max: 100, now: Math.round(progress * 100) }}
        >
          <MotiView
            from={{ width: `${Math.max(0, (index - 1) / (STEPS.length - 1)) * 100}%` }}
            animate={{ width: `${Math.max(progress, 0.04) * 100}%` }}
            transition={{ type: 'timing', duration: 600 }}
            style={{ height: '100%', borderRadius: 999, backgroundColor: colors.leaf }}
          />
        </View>

        {required ? (
          <View className="min-w-11" />
        ) : (
          <Pressable
            onPress={onSkip ?? (() => goNext(step))}
            accessibilityRole="button"
            accessibilityLabel={t('common.skip')}
            className="min-h-11 min-w-11 items-center justify-center rounded-full px-3"
          >
            <Text variant="label" className="text-muted-foreground">
              {t('common.skip')}
            </Text>
          </Pressable>
        )}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 24,
          paddingBottom: footerH + 40,
          gap: 24,
        }}
      >
        <View className="gap-2">
          <FadeUp>
            <Text variant="display">{title}</Text>
          </FadeUp>
          {subtitle ? (
            <FadeUp delay={120}>
              <Text variant="body" className="text-muted-foreground">
                {subtitle}
              </Text>
            </FadeUp>
          ) : null}
        </View>
        {children}
      </ScrollView>

      {/* pinned glass footer: Kai's reaction + Continue (content scrolls and blurs underneath) */}
      <GlassCard
        strong
        radii={{ tl: 28, tr: 28 }}
        style={{ position: 'absolute', start: 0, end: 0, bottom: 0 }}
        contentStyle={{ paddingHorizontal: 24, paddingTop: 12, paddingBottom: Math.max(insets.bottom, 16) }}
      >
        {/* screens that never react (age, safety) omit the prop, so no empty space is reserved */}
        {reaction !== undefined ? <KaiReaction text={reaction} /> : null}
        <View className={reaction !== undefined ? 'pt-3' : 'pt-1'}>
          <Button size="lg" disabled={!canContinue} onPress={onContinue ?? (() => goNext(step))}>
            <Text>{continueLabel ?? t('common.continue')}</Text>
          </Button>
          {secondary ? (
            <Button variant="ghost" onPress={secondary.onPress}>
              <Text>{secondary.label}</Text>
            </Button>
          ) : null}
        </View>
      </GlassCard>
    </View>
  );
}
