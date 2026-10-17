import { CalendarCheck, PersonSimpleTaiChi } from 'phosphor-react-native';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { FadeUp } from '@/components/fade-up';
import { GlassCard } from '@/components/glass-card';
import { ProgressRing } from '@/components/progress-ring';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { PersonalizationShell } from '@/features/onboarding/shell';
import { useT } from '@/i18n';
import { haptic } from '@/lib/haptics';
import { usePrefsStore } from '@/store/prefs-store';
import { useTheme } from '@/theme/theme-provider';

const OPTIONS = [5, 10, 15, 20] as const;

/** Onboarding Q2 — time per day. A big ring shows the choice (out of 20 minutes); below it, what that adds up to. */
export default function TimeScreen() {
  const { t } = useT();
  const { colors } = useTheme();
  const minutes = usePrefsStore((s) => s.minutesPerDay);
  const patch = usePrefsStore((s) => s.patch);
  // 10 min is pre-selected; Kai only reacts once the user actually chooses.
  const [touched, setTouched] = useState(false);
  const poses = Math.max(2, Math.round(minutes / 1.5));
  const week = minutes * 6; // six practice days, one rest day

  return (
    <PersonalizationShell
      step="time"
      title={t('onboardingQ.time.title')}
      subtitle={t('onboardingQ.time.subtitle')}
      reaction={touched ? t(`onboardingQ.time.reaction.${minutes}`) : null}
    >
      <FadeUp delay={100}>
        <GlassCard radius="hero" strong contentStyle={{ padding: 20, alignItems: 'center', gap: 16 }}>
          <ProgressRing
            progress={minutes / 20}
            size={190}
            strokeWidth={14}
            color="primary"
            accessibilityLabel={t('common.minutes', { count: minutes })}
          >
            <View style={{ alignItems: 'center' }}>
              <Text variant="timer" style={{ color: colors.forest }}>
                {String(minutes)}
              </Text>
              <Text variant="callout" style={{ color: colors.muted }}>
                {t('onboardingQ.time.unit')}
              </Text>
            </View>
          </ProgressRing>

          {/* the four choices, one tap each */}
          <View
            role="radiogroup"
            style={{
              flexDirection: 'row',
              alignSelf: 'stretch',
              backgroundColor: colors.mint,
              borderRadius: 999,
              padding: 4,
              gap: 4,
            }}
          >
            {OPTIONS.map((m) => {
              const on = minutes === m;
              return (
                <Pressable
                  key={m}
                  role="radio"
                  aria-checked={on}
                  accessibilityState={{ checked: on }}
                  accessibilityLabel={t('common.minutes', { count: m })}
                  onPress={() => {
                    haptic.select();
                    setTouched(true);
                    patch({ minutesPerDay: m });
                  }}
                  style={{
                    flex: 1,
                    minHeight: 48,
                    borderRadius: 999,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: on ? colors.primary : 'transparent',
                  }}
                >
                  <Text
                    variant="bodyLarge"
                    className="font-sans-semibold"
                    style={{ color: on ? colors.onPrimary : colors.forest }}
                  >
                    {String(m)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </GlassCard>
      </FadeUp>

      {/* what it adds up to */}
      <FadeUp delay={220} style={{ gap: 10 }}>
        {[
          { icon: PersonSimpleTaiChi, text: t('onboardingQ.time.poses', { count: poses }) },
          { icon: CalendarCheck, text: t('onboardingQ.time.week', { count: week }) },
        ].map((row, i) => (
          <View
            key={i}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
              backgroundColor: colors.mint,
              borderRadius: 20,
              paddingHorizontal: 16,
              paddingVertical: 14,
            }}
          >
            <Icon as={row.icon} size={24} weight="duotone" color={colors.primary} />
            <Text variant="body" style={{ flex: 1, color: colors.forest }}>
              {row.text}
            </Text>
          </View>
        ))}
      </FadeUp>
    </PersonalizationShell>
  );
}
