import { Check, Clock } from 'phosphor-react-native';
import { Pressable, View } from 'react-native';

import { FadeUp } from '@/components/fade-up';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { OptionSurface } from '@/features/onboarding/option-surface';
import { PersonalizationShell } from '@/features/onboarding/shell';
import { goNext } from '@/features/onboarding/steps';
import { useT } from '@/i18n';
import { haptic } from '@/lib/haptics';
import { usePrefsStore } from '@/store/prefs-store';
import type { Experience } from '@/store/types';
import { useTheme } from '@/theme/theme-provider';

const OPTIONS: { id: Experience; bars: 1 | 2 | 3 }[] = [
  { id: 'beginner', bars: 1 },
  { id: 'some', bars: 2 },
  { id: 'experienced', bars: 3 },
];

/** Three rising bars inside a round badge: how far along, at a glance (and never by colour alone: the title says it too). */
function LevelMeter({ bars, on }: { bars: number; on: boolean }) {
  const { colors } = useTheme();
  return (
    <View
      style={{
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: on ? colors.bg : colors.mint,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 4, height: 26 }}>
        {[0, 1, 2].map((i) => (
          <View
            key={i}
            style={{
              width: 6,
              height: 10 + i * 8,
              borderRadius: 3,
              backgroundColor: i < bars ? colors.leaf : colors.hairline,
            }}
          />
        ))}
      </View>
    </View>
  );
}

/** Onboarding Q1 — experience level. Single select; each level says what the sessions will be like. Skip = Beginner. */
export default function ExperienceScreen() {
  const { t } = useT();
  const { colors } = useTheme();
  const experience = usePrefsStore((s) => s.experience);
  const patch = usePrefsStore((s) => s.patch);

  return (
    <PersonalizationShell
      step="experience"
      title={t('onboarding.experience.title')}
      subtitle={t('onboarding.experience.subtitle')}
      canContinue={experience !== null}
      reaction={experience ? t(`onboarding.experience.reaction.${experience}`) : null}
      onSkip={() => {
        patch({ experience: 'beginner' });
        goNext('experience');
      }}
    >
      <View style={{ gap: 14 }} role="radiogroup">
        {OPTIONS.map((o, i) => {
          const on = experience === o.id;
          return (
            <FadeUp key={o.id} delay={120 + i * 80} distance={18}>
              <Pressable
                role="radio"
                aria-checked={on}
                accessibilityState={{ checked: on }}
                accessibilityLabel={`${t(`onboarding.experience.${o.id}.title`)}. ${t(`onboarding.experience.${o.id}.sub`)}. ${t(`onboarding.experience.${o.id}.plan`)}`}
                onPress={() => {
                  haptic.select();
                  patch({ experience: o.id });
                }}
                style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1 })}
              >
                <OptionSurface selected={on} pad={16}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                    <LevelMeter bars={o.bars} on={on} />
                    <View style={{ flex: 1, gap: 2 }}>
                      <Text variant="title3" className="font-sans-semibold" style={{ color: colors.forest }}>
                        {t(`onboarding.experience.${o.id}.title`)}
                      </Text>
                      <Text variant="callout" className="font-sans" style={{ color: colors.muted }}>
                        {t(`onboarding.experience.${o.id}.sub`)}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 14,
                        borderWidth: 2,
                        borderColor: on ? colors.leaf : colors.hairline,
                        backgroundColor: on ? colors.leaf : 'transparent',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {on ? <Icon as={Check} size={16} weight="bold" color={colors.onPrimary} /> : null}
                    </View>
                  </View>
                  {/* what that means for the sessions */}
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 8,
                      marginTop: 12,
                      borderRadius: 14,
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      backgroundColor: on ? colors.bg : colors.mint,
                    }}
                  >
                    <Icon as={Clock} size={16} color={colors.primary} />
                    <Text variant="footnote" style={{ flex: 1, color: colors.forest }}>
                      {t(`onboarding.experience.${o.id}.plan`)}
                    </Text>
                  </View>
                </OptionSurface>
              </Pressable>
            </FadeUp>
          );
        })}
      </View>
    </PersonalizationShell>
  );
}
