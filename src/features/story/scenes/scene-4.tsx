import { Heart, InfinityIcon, Moon, Wind } from 'phosphor-react-native';
import { MotiView } from 'moti';
import { useWindowDimensions, View } from 'react-native';

import { CharacterAvatar } from '@/components/character-avatar';
import { FadeUp } from '@/components/fade-up';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useReduceMotion } from '@/hooks/use-reduced-motion';
import { useT } from '@/i18n';
import { KaizenIcon } from '@/icons';
import { useStoryColors } from '@/theme/story';

import { SceneCTA, SceneScroll } from '../stage';
import type { SceneProps } from '../types';

const WEEKS = [1, 2, 3, 4] as const;
const NODE_ICON = { 2: Wind, 3: Moon, 4: InfinityIcon } as const;

function Node({ week, delay }: { week: (typeof WEEKS)[number]; delay: number }) {
  const sc = useStoryColors();
  const reduce = useReduceMotion();
  const active = week === 1;
  return (
    <MotiView
      from={{ opacity: 0, scale: reduce ? 1 : 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'timing', duration: 450, delay }}
      style={{
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: active ? sc.nodeActive : sc.nodeIdle,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 4,
        borderColor: sc.bg,
      }}
    >
      {active ? (
        <KaizenIcon name="lotus" size={26} color={sc.buttonText} strokeWidth={2} />
      ) : (
        <Icon as={NODE_ICON[week as 2 | 3 | 4]} size={24} color={sc.muted} />
      )}
    </MotiView>
  );
}

/** Scene 5 (step 6) — "Your 30-Day Kaizen Path": a hero card, a four-week timeline, a gentle reminder. */
export function Scene4({ controls, width }: SceneProps) {
  const { t } = useT();
  const sc = useStoryColors();
  const { fontScale } = useWindowDimensions();
  const w = Math.min(width - 32, 440);
  const big = fontScale > 1.15;

  return (
    <SceneScroll cta={<SceneCTA label={t('story.s4.cta')} onPress={controls.next} delay={2200} />}>
      <View style={{ width: w, gap: 16 }}>
        <FadeUp>
          <View
            style={{
              backgroundColor: sc.heroBg,
              borderRadius: 40,
              padding: 20,
              alignItems: 'center',
              gap: 10,
            }}
          >
            <View>
              <View style={{ padding: 6, borderRadius: 60, backgroundColor: sc.chipBg }}>
                <CharacterAvatar name="kai" size={96} animated />
              </View>
              <View
                style={{
                  position: 'absolute',
                  end: -6,
                  bottom: -4,
                  width: 38,
                  height: 38,
                  borderRadius: 19,
                  backgroundColor: sc.card,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 1,
                  borderColor: sc.cardBorder,
                }}
              >
                <KaizenIcon name="lotus" size={20} color={sc.title} strokeWidth={2} />
              </View>
            </View>
            <Text
              variant="display"
              className="text-center"
              style={{ color: sc.title }}
              accessibilityRole="header"
            >
              {t('story.s4.title')}
            </Text>
            <Text variant="bodyLarge" className="text-center" style={{ color: sc.body }}>
              {t('story.s4.subtitle')}
            </Text>
          </View>
        </FadeUp>

        {/* timeline: nodes on a quiet vertical line, one card per week */}
        <View style={{ gap: 14 }}>
          {!big ? (
            <View
              style={{
                position: 'absolute',
                start: 24,
                top: 30,
                bottom: 70,
                width: 3,
                borderRadius: 2,
                backgroundColor: sc.line,
              }}
            />
          ) : null}
          {WEEKS.map((n, i) => {
            const active = n === 1;
            return (
              <View key={n} style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
                {big ? null : (
                  <View style={{ width: 52, alignItems: 'center', gap: 4 }}>
                    <Node week={n} delay={500 + i * 350} />
                    <Text variant="overline" style={{ color: active ? sc.title : sc.muted }}>
                      {active ? t('story.s4.now') : t('story.s4.wk', { n })}
                    </Text>
                  </View>
                )}
                <FadeUp delay={400 + i * 350} style={{ flex: 1 }}>
                  <View
                    accessible
                    accessibilityLabel={`${t(`story.s4.w${n}.title`)}. ${t(`story.s4.w${n}.tag`)}. ${t(`story.s4.w${n}.body`)}`}
                    style={{
                      borderRadius: 28,
                      padding: 18,
                      gap: 10,
                      backgroundColor: active ? sc.card : sc.noteBg,
                      borderWidth: active ? 1 : 0,
                      borderColor: sc.cardBorder,
                      shadowColor: sc.title,
                      shadowOpacity: active ? 0.08 : 0,
                      shadowRadius: 14,
                      shadowOffset: { width: 0, height: 6 },
                    }}
                  >
                    <Text
                      variant="title2"
                      style={{ color: sc.title, fontFamily: undefined }}
                      className="font-display"
                    >
                      {t(`story.s4.w${n}.title`)}
                    </Text>
                    <View
                      style={{
                        alignSelf: 'flex-start',
                        borderRadius: 999,
                        paddingHorizontal: 12,
                        paddingVertical: 4,
                        backgroundColor: active ? sc.chipBg : sc.nodeIdle,
                      }}
                    >
                      <Text variant="callout" style={{ color: active ? sc.chipText : sc.body }}>
                        {t(`story.s4.w${n}.tag`)}
                      </Text>
                    </View>
                    <Text variant="body" style={{ color: sc.body }}>
                      {t(`story.s4.w${n}.body`)}
                    </Text>
                    {active ? (
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <View
                          style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: sc.positive }}
                        />
                        <Text variant="callout" style={{ color: sc.positive }}>
                          {t('story.s4.w1.status')}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                </FadeUp>
              </View>
            );
          })}
        </View>

        <FadeUp delay={1900}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 14,
              backgroundColor: sc.noteBg,
              borderRadius: 24,
              padding: 14,
            }}
          >
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: sc.chipBg,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon as={Heart} size={22} color={sc.title} />
            </View>
            <Text variant="body" style={{ flex: 1, color: sc.body }}>
              <Text variant="body" style={{ color: sc.title }}>{`${t('story.s4.reminderLead')} `}</Text>
              {t('story.s4.reminder')}
            </Text>
          </View>
        </FadeUp>
        <Text variant="footnote" className="px-2 text-center" style={{ color: sc.muted }}>
          {t('story.s4.footnote')}
        </Text>
      </View>
    </SceneScroll>
  );
}
