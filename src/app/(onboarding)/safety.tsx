import { Check, Heartbeat, HandPalm, Stethoscope } from 'phosphor-react-native';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { CharacterAvatar } from '@/components/character-avatar';
import { FadeUp } from '@/components/fade-up';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { OptionSurface } from '@/features/onboarding/option-surface';
import { PersonalizationShell } from '@/features/onboarding/shell';
import { goNext } from '@/features/onboarding/steps';
import { useT } from '@/i18n';
import { haptic } from '@/lib/haptics';
import { useAppStore } from '@/store/app-store';
import { useTheme } from '@/theme/theme-provider';

const ROWS = [
  { key: 'stop', icon: HandPalm },
  { key: 'professional', icon: Stethoscope },
  { key: 'notMedical', icon: Heartbeat },
] as const;

/**
 * Onboarding Q9 — safety notice. Required: Continue stays disabled until "I understand" is ticked.
 * The notice itself is a solid surface with a `danger` edge (the spec forbids glass on safety messages); the
 * confirmation below it is a large selectable card, easy to hit and impossible to miss.
 */
export default function SafetyScreen() {
  const { t } = useT();
  const { colors } = useTheme();
  const [checked, setChecked] = useState(() => !!useAppStore.getState().safetyAcknowledgedAt);

  return (
    <PersonalizationShell
      step="safety"
      title={t('onboardingR.safety.title')}
      subtitle={t('onboardingR.safety.subtitle')}
      canContinue={checked}
      onContinue={() => {
        useAppStore.getState().acknowledgeSafety();
        goNext('safety');
      }}
    >
      <FadeUp delay={100}>
        <View
          accessible
          accessibilityRole="summary"
          style={{
            backgroundColor: colors.bgMist,
            borderRadius: 28,
            borderWidth: 1,
            borderColor: colors.danger + '55',
            padding: 20,
            gap: 18,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <CharacterAvatar name="kai" size={44} />
            <Text variant="title3" className="font-sans-semibold" style={{ flex: 1, color: colors.forest }}>
              {t('onboardingR.safety.cardTitle')}
            </Text>
          </View>
          {ROWS.map((r, i) => (
            <View key={r.key}>
              {i > 0 ? (
                <View style={{ height: 1, backgroundColor: colors.hairline, marginBottom: 18 }} />
              ) : null}
              <FadeUp
                delay={200 + i * 120}
                distance={10}
                style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 14 }}
              >
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: colors.mint,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon as={r.icon} size={24} weight="duotone" color={colors.primary} />
                </View>
                <Text variant="body" style={{ flex: 1, color: colors.ink }}>
                  {t(`onboardingR.safety.${r.key}`)}
                </Text>
              </FadeUp>
            </View>
          ))}
        </View>
      </FadeUp>

      <FadeUp delay={500}>
        <Pressable
          role="checkbox"
          aria-checked={checked}
          accessibilityState={{ checked }}
          accessibilityLabel={t('onboardingR.safety.understand')}
          accessibilityHint={t('onboardingR.safety.hint')}
          onPress={() => {
            haptic.select();
            setChecked((c) => !c);
          }}
          style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1 })}
        >
          <OptionSurface selected={checked} pad={16}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
              <View
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 10,
                  borderWidth: 2,
                  borderColor: checked ? colors.leaf : colors.hairline,
                  backgroundColor: checked ? colors.leaf : 'transparent',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {checked ? <Icon as={Check} size={16} weight="bold" color={colors.onPrimary} /> : null}
              </View>
              <Text
                variant="bodyLarge"
                className="font-sans-semibold"
                style={{ flex: 1, color: colors.forest }}
              >
                {t('onboardingR.safety.understand')}
              </Text>
            </View>
          </OptionSurface>
        </Pressable>
        {!checked ? (
          <Text variant="footnote" style={{ color: colors.muted, marginTop: 8, paddingHorizontal: 4 }}>
            {t('onboardingR.safety.hint')}
          </Text>
        ) : null}
      </FadeUp>
    </PersonalizationShell>
  );
}
