import { CaretRight, Heart, Leaf } from 'phosphor-react-native';
import { useState } from 'react';
import { I18nManager, View } from 'react-native';

import { CharacterAvatar } from '@/components/character-avatar';
import { FadeUp } from '@/components/fade-up';
import { GlassCard } from '@/components/glass-card';
import { PersonPhoto } from '@/components/person-photo';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { scenes } from '@/data/story';
import { useT } from '@/i18n';
import { haptic } from '@/lib/haptics';
import { useTheme } from '@/theme/theme-provider';

import { SceneScroll, stageWidth } from '../stage';
import type { SceneProps } from '../types';

const cfg = scenes[2];
const FRIENDS = ['hamid', 'hina', 'sierra'] as const;
const PAD = 8;
const GAP = 8;

/**
 * Scene 2 — "You're not alone". Built strictly from docs/UI_Build.md tokens: `bg` + aurora blobs, glass panels
 * (never glass on glass: inner pills and rows are `mint`), Fraunces display title, Jakarta body, `primary` button.
 * The three look toward each other; their two lines read as a short conversation.
 */
export function Scene2({ controls, width }: SceneProps) {
  const { t } = useT();
  const { colors } = useTheme();
  const w = stageWidth(width);
  const [agreed, setAgreed] = useState(false);
  const tileW = (w - 2 * PAD - 2 * GAP) / 3;
  const tileH = tileW * 0.98;
  const name = (id: string) => t(`story.s5.people.${id}.name`);

  return (
    <>
      <SceneScroll
        top={90}
        bandColor={colors.bg}
        cta={
          <FadeUp delay={1900} style={{ width: '100%', maxWidth: 420 }}>
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
          {/* heading: label chip · display title · supporting line */}
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
                {t('story.s2.chip')}
              </Text>
            </View>
            <Text variant="display" accessibilityRole="header" style={{ color: colors.forest }}>
              {t('story.s2.title')}
            </Text>
            <Text variant="bodyLarge" style={{ color: colors.muted }}>
              {t('story.s2.caption')}
            </Text>
          </FadeUp>

          {/* the three of them, together */}
          <FadeUp delay={200}>
            <GlassCard radius="hero" contentStyle={{ padding: PAD, flexDirection: 'row', gap: GAP }}>
              {FRIENDS.map((id) => (
                <View
                  key={id}
                  accessible
                  accessibilityRole="image"
                  accessibilityLabel={name(id)}
                  style={{ width: tileW, height: tileH, borderRadius: 20, overflow: 'hidden' }}
                >
                  <PersonPhoto person={id} width={tileW} height={tileH} faceAt={0.38} />
                  <View
                    style={{
                      position: 'absolute',
                      bottom: 8,
                      alignSelf: 'center',
                      borderRadius: 999,
                      paddingHorizontal: 10,
                      paddingVertical: 3,
                      backgroundColor: colors.mint,
                    }}
                  >
                    <Text variant="footnote" style={{ color: colors.forest }}>
                      {name(id)}
                    </Text>
                  </View>
                </View>
              ))}
            </GlassCard>
          </FadeUp>

          {/* what they say: two lines, ~600 ms apart */}
          <GlassCard strong contentStyle={{ padding: 14, gap: 12 }}>
            {cfg.bubbles.map((b, i) => (
              <FadeUp
                key={b.textKey}
                delay={b.delayMs}
                style={{
                  flexDirection: 'row',
                  gap: 12,
                  alignItems: 'flex-start',
                  paddingTop: i === 0 ? 0 : 12,
                  borderTopWidth: i === 0 ? 0 : 1,
                  borderTopColor: colors.hairline,
                }}
              >
                <CharacterAvatar name={b.speaker} size={44} />
                <View style={{ flex: 1, gap: 4 }}>
                  <Text className="font-sans-bold" variant="callout" style={{ color: colors.forest }}>
                    {name(b.speaker)}
                  </Text>
                  <View
                    style={{
                      alignSelf: 'flex-start',
                      backgroundColor: colors.mint,
                      borderRadius: 20,
                      borderTopStartRadius: 6,
                      paddingHorizontal: 14,
                      paddingVertical: 8,
                    }}
                  >
                    <Text variant="body" style={{ color: colors.forest }}>
                      {t(b.textKey)}
                    </Text>
                  </View>
                </View>
              </FadeUp>
            ))}
          </GlassCard>

          {/* a gentle observation */}
          <FadeUp
            delay={1700}
            style={{
              backgroundColor: colors.mint,
              borderRadius: 20,
              padding: 16,
              flexDirection: 'row',
              gap: 12,
              alignItems: 'flex-start',
            }}
          >
            <Icon as={Leaf} size={24} weight="duotone" color={colors.leaf} />
            <View style={{ flex: 1, gap: 4 }}>
              <Text variant="overline" style={{ color: colors.forest }}>
                {t('story.s2.observeLabel')}
              </Text>
              <Text variant="body" style={{ color: colors.forest }}>
                {t('story.s2.observe')}
              </Text>
            </View>
          </FadeUp>

          {/* one optional tap: "me too" */}
          <FadeUp delay={1900} style={{ gap: 8 }}>
            <View
              style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}
            >
              <Text variant="callout" style={{ color: colors.muted, flex: 1 }}>
                {t('story.s2.resonate')}
              </Text>
              <Button
                size="sm"
                variant={agreed ? 'default' : 'secondary'}
                accessibilityRole="button"
                accessibilityState={{ selected: agreed }}
                onPress={() => {
                  haptic.select();
                  setAgreed((a) => !a);
                }}
              >
                <Icon
                  as={Heart}
                  size={18}
                  weight={agreed ? 'fill' : 'regular'}
                  color={agreed ? colors.onPrimary : colors.forest}
                />
                <Text>{t('story.s2.yes')}</Text>
              </Button>
            </View>
            {agreed ? (
              <FadeUp distance={6} duration={300}>
                <Text variant="callout" style={{ color: colors.forest }}>
                  {t('story.s2.yesDone')}
                </Text>
              </FadeUp>
            ) : null}
          </FadeUp>
        </View>
      </SceneScroll>
    </>
  );
}
