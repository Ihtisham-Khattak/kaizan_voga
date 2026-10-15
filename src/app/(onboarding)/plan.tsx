import { router, type Href } from 'expo-router';
import { AnimatePresence, MotiView } from 'moti';
import { useEffect, useState } from 'react';
import { ScrollView, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Character, CharacterLook } from '@/characters/character';
import type { CharacterName } from '@/characters/palette';
import { CharacterAvatar } from '@/components/character-avatar';
import { goalCharacter } from '@/data/story';
import { ConfettiLeaves } from '@/characters/props';
import { BreathingCircle } from '@/components/breathing-circle';
import { FadeUp } from '@/components/fade-up';
import { RoutineCard } from '@/components/routine-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SceneCTA } from '@/features/story/stage';
import { useStoryColors } from '@/theme/story';
import { Text } from '@/components/ui/text';
import { useT } from '@/i18n';
import { firstSession } from '@/lib/plan';
import { weekdayLabel, weekdayOrder } from '@/lib/weekdays';
import { useAppStore } from '@/store/app-store';
import { useAuthStore } from '@/store/auth-store';
import { usePrefsStore } from '@/store/prefs-store';
import { cn } from '@/lib/utils';

const LINES = ['line1', 'line2', 'line3'] as const;

function Loader() {
  const { t } = useT();
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((n) => Math.min(n + 1, LINES.length - 1)), 900);
    return () => clearInterval(id);
  }, []);
  return (
    <MotiView
      from={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: 'timing', duration: 400 }}
      style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 32 }}
    >
      <View style={{ width: 240, height: 240 }} className="items-center justify-center">
        <BreathingCircle size={240} soft tint="leaf" />
        <View style={{ position: 'absolute' }}>
          <Character name="kai" pose="float" mood="calm" size={120} />
        </View>
      </View>
      <View className="items-center gap-2">
        <Text variant="title" className="text-center">
          {t('onboardingR.plan.building')}
        </Text>
        <AnimatePresence exitBeforeEnter>
          <MotiView
            key={i}
            from={{ opacity: 0, translateY: 6 }}
            animate={{ opacity: 1, translateY: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'timing', duration: 350 }}
          >
            <Text variant="caption">{t(`onboardingR.plan.${LINES[i]}`)}</Text>
          </MotiView>
        </AnimatePresence>
      </View>
    </MotiView>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View className="gap-2">
      <Text variant="caption" className="font-sans-semibold uppercase tracking-wide">
        {label}
      </Text>
      {children}
    </View>
  );
}

function Summary() {
  const { t, i18n } = useT();
  const sc = useStoryColors();
  const insets = useSafeAreaInsets();
  const prefs = usePrefsStore();
  const routine = firstSession();
  // the person whose story is closest to the user's first goal (falls back to Arfa, the beginner's way in)
  const like = (goalCharacter[prefs.goals[0] ?? ''] ?? 'arfa') as Exclude<CharacterName, 'kai'>;
  const order = weekdayOrder();

  const go = (dest: '/session/setup' | '/home') => {
    const app = useAppStore.getState();
    app.completeOnboarding();
    // everyone passes the account gate once (sign up / sign in / guest), then continues where they were headed
    app.setPostGateRoute(dest);
    router.replace((useAuthStore.getState().status === 'none' ? '/gate' : dest) as Href);
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingTop: insets.top + 24,
        paddingBottom: insets.bottom + 32,
        paddingHorizontal: 16,
        gap: 16,
      }}
    >
      <FadeUp className="items-center gap-1">
        <Character name="kai" pose="celebrate" mood="happy" size={120} />
        <Text variant="display" className="text-center" style={{ color: sc.title }}>
          {t('onboardingR.plan.title')}
        </Text>
      </FadeUp>

      <FadeUp delay={200}>
        <View
          style={{
            backgroundColor: sc.card,
            borderRadius: 36,
            borderWidth: 1,
            borderColor: sc.cardBorder,
            padding: 22,
            gap: 16,
          }}
        >
          <Row label={t('onboardingR.plan.focus')}>
            <View className="flex-row flex-wrap gap-2">
              {(prefs.goals.length ? prefs.goals : (['gentle'] as const)).map((g) => (
                <Badge key={g} variant="secondary">
                  <Text>{t(`goal.${g}`)}</Text>
                </Badge>
              ))}
            </View>
          </Row>
          <View className="flex-row gap-6">
            <Row label={t('onboardingR.plan.daily')}>
              <Text variant="heading">{t('common.minutes', { count: prefs.minutesPerDay })}</Text>
            </Row>
            <Row label={t('onboardingR.plan.when')}>
              <Text variant="heading">
                {t(`onboardingQ.schedule.${prefs.preferredTime ?? 'varies'}.title`)}
              </Text>
            </Row>
          </View>
          <Row label={t('onboardingR.plan.days')}>
            <View className="flex-row gap-2">
              {order.map((d) => {
                const on = prefs.practiceDays.includes(d);
                return (
                  <View
                    key={d}
                    accessible
                    accessibilityLabel={`${weekdayLabel(d, 'long', i18n.language)}: ${on ? t('onboardingR.plan.days') : t('onboardingR.plan.rest')}`}
                    className={cn(
                      'size-8 items-center justify-center rounded-full',
                      on ? 'bg-primary' : 'border border-border'
                    )}
                  >
                    <Text
                      variant="caption"
                      className={cn(
                        'font-sans-semibold',
                        on ? 'text-primary-foreground' : 'text-muted-foreground'
                      )}
                    >
                      {weekdayLabel(d, 'narrow', i18n.language)}
                    </Text>
                  </View>
                );
              })}
            </View>
            <Text variant="caption">{t('onboardingR.plan.rest')}</Text>
          </Row>
          <Row label={t('onboardingR.plan.first')}>
            <RoutineCard variant="row" routine={routine} />
          </Row>
          <View
            accessible
            accessibilityLabel={`${t('onboardingR.plan.similar')} ${t(`story.s5.people.${like}.started`)}`}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
              backgroundColor: sc.afterBg,
              borderRadius: 20,
              padding: 12,
            }}
          >
            <CharacterAvatar name={like} size={44} ring mood="happy" />
            <View style={{ flex: 1 }}>
              <Text variant="footnote">{t('onboardingR.plan.similar')}</Text>
              <Text variant="callout" style={{ color: sc.title }}>
                {t(`story.s5.people.${like}.started`)}
              </Text>
            </View>
          </View>
        </View>
      </FadeUp>

      <FadeUp delay={500} className="gap-2">
        <SceneCTA label={t('onboardingR.plan.startFirst')} onPress={() => go('/session/setup')} />
        <Button size="lg" variant="secondary" onPress={() => go('/home')}>
          <Text>{t('onboardingR.plan.explore')}</Text>
        </Button>
        <Text variant="caption" className="pt-1 text-center">
          {t('onboardingR.plan.note')}
        </Text>
      </FadeUp>
    </ScrollView>
  );
}

/** Onboarding Q11 — plan reveal: a breathing loader, then a glass summary of the 30-day journey. */
export default function PlanScreen() {
  const sc = useStoryColors();
  const { width, height } = useWindowDimensions();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setReady(true), 3000);
    return () => clearTimeout(id);
  }, []);

  return (
    <CharacterLook value="clay">
      <View style={{ flex: 1, backgroundColor: sc.bg }}>
        <ConfettiLeaves width={width} height={height} count={ready ? 9 : 4} />
        <AnimatePresence exitBeforeEnter>{ready ? <Summary key="s" /> : <Loader key="l" />}</AnimatePresence>
      </View>
    </CharacterLook>
  );
}
