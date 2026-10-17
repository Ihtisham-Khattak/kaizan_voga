import { CaretRight } from 'phosphor-react-native';
import { I18nManager, View } from 'react-native';

import { CharacterAvatar } from '@/components/character-avatar';
import { FadeUp } from '@/components/fade-up';
import { GlassCard } from '@/components/glass-card';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import type { Person } from '@/data/companions';
import { scenes } from '@/data/story';
import { useT } from '@/i18n';
import { useTheme } from '@/theme/theme-provider';

import { SceneScroll, stageWidth } from '../stage';
import type { SceneProps } from '../types';

const cfg = scenes[1];

/**
 * Scene 1 — "Sound familiar?". Three ordinary people each say what their day feels like: a card per person with their
 * photo, a tag for the feeling and their words. Built strictly on the docs/UI_Build.md tokens.
 */
export function Scene1({ controls, width }: SceneProps) {
  const { t } = useT();
  const { colors } = useTheme();
  const w = stageWidth(width);
  const lastDelay = cfg.bubbles[cfg.bubbles.length - 1].delayMs;

  return (
    <SceneScroll
      top={90}
      bandColor={colors.bg}
      cta={
        <FadeUp delay={lastDelay + 500} style={{ width: '100%', maxWidth: 420 }}>
          <Button size="lg" onPress={controls.next} accessibilityLabel={t('common.next')}>
            <Text>{t('common.next')}</Text>
            <Icon
              as={CaretRight}
              size={18}
              weight="bold"
              color={colors.onPrimary}
              style={I18nManager.isRTL ? { transform: [{ scaleX: -1 }] } : undefined}
            />
          </Button>
        </FadeUp>
      }
    >
      <View style={{ width: w, gap: 14 }}>
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
              {t('story.s1.chip')}
            </Text>
          </View>
          <Text variant="display" accessibilityRole="header" style={{ color: colors.forest }}>
            {t('story.s1.title')}
          </Text>
          <Text variant="bodyLarge" style={{ color: colors.muted }}>
            {t('story.s1.subtitle')}
          </Text>
        </FadeUp>

        {/* one card per person, ~600 ms apart */}
        {cfg.bubbles.map((b) => {
          const id = b.speaker as Person;
          return (
            <FadeUp key={b.textKey} delay={b.delayMs}>
              <GlassCard
                contentStyle={{ padding: 14, flexDirection: 'row', gap: 14, alignItems: 'flex-start' }}
              >
                <CharacterAvatar name={id} size={64} />
                <View style={{ flex: 1, gap: 8 }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 8,
                    }}
                  >
                    <Text variant="callout" style={{ color: colors.forest, flexShrink: 1 }}>
                      {t(`story.s5.people.${id}.name`)}
                    </Text>
                    <View
                      style={{
                        borderRadius: 999,
                        paddingHorizontal: 10,
                        paddingVertical: 3,
                        backgroundColor: colors.mint,
                        flexShrink: 1,
                      }}
                    >
                      <Text variant="footnote" style={{ color: colors.forest }}>
                        {t(`story.s1.tags.${id}`)}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      backgroundColor: colors.bgMist,
                      borderRadius: 20,
                      borderTopStartRadius: 6,
                      paddingHorizontal: 14,
                      paddingVertical: 10,
                    }}
                  >
                    <Text variant="body" style={{ color: colors.ink }}>
                      {t(b.textKey)}
                    </Text>
                  </View>
                </View>
              </GlassCard>
            </FadeUp>
          );
        })}
      </View>
    </SceneScroll>
  );
}
