import { CaretRight, CheckCircle, Leaf, MinusCircle, Quotes, Sparkle } from 'phosphor-react-native';
import { MotiView } from 'moti';
import { useState } from 'react';
import { I18nManager, Pressable, useWindowDimensions, View } from 'react-native';

import { signature, type CharacterName } from '@/characters/palette';
import { CharacterAvatar } from '@/components/character-avatar';
import { FadeUp } from '@/components/fade-up';
import { GlassCard } from '@/components/glass-card';
import { PersonPhoto } from '@/components/person-photo';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useT } from '@/i18n';
import { haptic } from '@/lib/haptics';
import { useTheme } from '@/theme/theme-provider';

import { SceneScroll } from '../stage';
import type { SceneProps } from '../types';

type Who = Exclude<CharacterName, 'kai'>;
const WHO: Who[] = ['hina', 'arfa', 'hamid', 'sierra'];
const KEYS = ['1', '2', '3'] as const;

const FRAME_H = 176;

/** One side of the story card: the person's portrait, worried before and happy with Kaizen. */
function Frame({ who, kind, bg }: { who: Who; kind: 'before' | 'after'; bg: string }) {
  const [w, setW] = useState(140);
  return (
    <View
      onLayout={(e) => setW(e.nativeEvent.layout.width)}
      style={{ height: FRAME_H, borderRadius: 12, overflow: 'hidden', backgroundColor: bg }}
    >
      <PersonPhoto person={who} variant={kind} width={w} height={FRAME_H} faceAt={0.3} />
    </View>
  );
}

function Panel({ who, kind }: { who: Who; kind: 'before' | 'after' }) {
  const { t } = useT();
  const { colors } = useTheme();
  const before = kind === 'before';
  const label = before ? t('story.s5.before') : t('story.s5.now');
  const texts = KEYS.map((k) => t(`story.s5.people.${who}.${before ? 'b' : 'a'}${k}`));
  return (
    <View
      accessible
      accessibilityLabel={`${label}. ${texts.join('. ')}`}
      style={{
        flex: 1,
        backgroundColor: before ? colors.bgMist : colors.mint,
        padding: 12,
        gap: 12,
        borderRadius: 20,
      }}
    >
      <View
        style={{
          alignSelf: 'flex-start',
          borderRadius: 999,
          paddingHorizontal: 12,
          paddingVertical: 4,
          backgroundColor: before ? colors.hairline : colors.primary,
        }}
      >
        <Text variant="callout" style={{ color: before ? colors.muted : colors.onPrimary }}>
          {label}
        </Text>
      </View>
      <Frame who={who} kind={kind} bg={before ? colors.hairline : colors.mint} />
      <View style={{ gap: 10 }}>
        {texts.map((text, i) => (
          <View key={i} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
            {/* `danger` is for safety messages only (UI_Build.md), so "before" uses a quiet muted minus */}
            <Icon
              as={before ? MinusCircle : CheckCircle}
              size={20}
              color={before ? colors.muted : colors.leaf}
            />
            <Text variant="callout" style={{ flex: 1, color: colors.ink }}>
              {text}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

/**
 * Four ways in — pick the person who sounds most like you; their story (before / with Kaizen), what they started
 * with, and what they would tell you. Built strictly on the docs/UI_Build.md tokens.
 */
export function Scene5({ controls, width }: SceneProps) {
  const { t } = useT();
  const { colors } = useTheme();
  const { fontScale } = useWindowDimensions();
  const [who, setWho] = useState<Who>('hina');
  const w = Math.min(width - 32, 440);
  const sideBySide = w >= 330 && fontScale <= 1.15;
  const p = (k: string) => t(`story.s5.people.${who}.${k}`);

  return (
    <>
      <SceneScroll
        top={90}
        bandColor={colors.bg}
        cta={
          <FadeUp delay={1200} style={{ width: '100%', maxWidth: 420 }}>
            <Button size="lg" onPress={controls.next} accessibilityLabel={t('story.s5.cta')}>
              <Text>{t('story.s5.cta')}</Text>
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
              <Icon as={Leaf} size={16} weight="duotone" color={colors.leaf} />
              <Text variant="overline" style={{ color: colors.forest }}>
                {t('story.s5.chip')}
              </Text>
            </View>
            <Text variant="display" accessibilityRole="header" style={{ color: colors.forest }}>
              {t('story.s5.title')}
            </Text>
            <Text variant="bodyLarge" style={{ color: colors.muted }}>
              {t('story.s5.subtitle')}
            </Text>
          </FadeUp>

          {/* who sounds like you? */}
          <FadeUp delay={150}>
            <View role="radiogroup" style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              {WHO.map((id) => {
                const on = id === who;
                return (
                  <Pressable
                    key={id}
                    role="radio"
                    aria-checked={on}
                    accessibilityLabel={t('story.s5.storyOf', { name: t(`story.s5.people.${id}.name`) })}
                    onPress={() => {
                      haptic.select();
                      setWho(id);
                    }}
                    style={{ alignItems: 'center', gap: 6, width: 78 }}
                  >
                    <View
                      style={{
                        padding: 3,
                        borderRadius: 40,
                        borderWidth: 3,
                        borderColor: on ? signature[id] : 'transparent',
                      }}
                    >
                      <CharacterAvatar name={id} size={58} />
                    </View>
                    <Text
                      variant="callout"
                      className={on ? 'font-sans-bold' : 'font-sans-medium'}
                      style={{ color: on ? colors.forest : colors.muted }}
                    >
                      {t(`story.s5.people.${id}.name`)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </FadeUp>

          <MotiView
            key={who}
            from={{ opacity: 0, translateY: 8 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 320 }}
            style={{ gap: 14 }}
          >
            <Text variant="title3" style={{ color: colors.forest }}>
              {`“${p('tag')}”`}
            </Text>

            {/* their story: before / with Kaizen */}
            <GlassCard
              radius="hero"
              contentStyle={{ padding: 12, gap: 12, flexDirection: sideBySide ? 'row' : 'column' }}
            >
              <Panel who={who} kind="before" />
              <Panel who={who} kind="after" />
            </GlassCard>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                backgroundColor: colors.mint,
                borderRadius: 20,
                paddingHorizontal: 16,
                paddingVertical: 12,
              }}
            >
              <Icon as={Sparkle} size={20} weight="fill" color={colors.leaf} />
              <Text variant="callout" style={{ flex: 1, color: colors.forest }}>
                <Text variant="callout" style={{ color: colors.muted }}>{`${t('story.s5.started')}: `}</Text>
                {p('started')}
              </Text>
            </View>

            <View
              style={{
                backgroundColor: colors.bgMist,
                borderRadius: 20,
                padding: 16,
                flexDirection: 'row',
                gap: 14,
              }}
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
                <Icon as={Quotes} size={22} weight="fill" color={colors.leaf} />
              </View>
              <View style={{ flex: 1, gap: 8 }}>
                <Text variant="bodyLarge" style={{ color: colors.ink }}>
                  {`“${p('message')}”`}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <View style={{ width: 22, height: 3, borderRadius: 2, backgroundColor: colors.leaf }} />
                  <Text variant="callout" style={{ color: colors.forest, flex: 1 }}>
                    {p('author')}
                  </Text>
                </View>
              </View>
            </View>
          </MotiView>

          <Text variant="footnote" style={{ color: colors.muted, textAlign: 'center' }}>
            {t('story.s5.illustrated')}
          </Text>
        </View>
      </SceneScroll>
    </>
  );
}
