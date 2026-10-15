import { CheckCircle, Leaf, MinusCircle, Quotes, Sparkle } from 'phosphor-react-native';
import { MotiView } from 'moti';
import { useState } from 'react';
import { Pressable, useWindowDimensions, View } from 'react-native';

import type { CharacterName } from '@/characters/palette';
import { CharacterAvatar } from '@/components/character-avatar';
import { FadeUp } from '@/components/fade-up';
import { PersonPhoto } from '@/components/person-photo';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useT } from '@/i18n';
import { haptic } from '@/lib/haptics';
import { signature } from '@/characters/palette';
import { useStoryColors } from '@/theme/story';

import { SceneCTA, SceneScroll } from '../stage';
import type { SceneProps } from '../types';

type Who = Exclude<CharacterName, 'kai'>;
const WHO: Who[] = ['hina', 'arfa', 'hamid', 'sierra'];
const KEYS = ['1', '2', '3'] as const;

function Panel({ who, kind }: { who: Who; kind: 'before' | 'after' }) {
  const { t } = useT();
  const sc = useStoryColors();
  const before = kind === 'before';
  const label = before ? t('story.s5.before') : t('story.s5.now');
  const texts = KEYS.map((k) => t(`story.s5.people.${who}.${before ? 'b' : 'a'}${k}`));
  return (
    <View
      accessible
      accessibilityLabel={`${label}. ${texts.join('. ')}`}
      style={{
        flex: 1,
        backgroundColor: before ? sc.beforeBg : sc.afterBg,
        padding: 12,
        gap: 14,
        borderRadius: 4,
      }}
    >
      <View
        style={{
          alignSelf: 'flex-start',
          borderRadius: 999,
          paddingHorizontal: 12,
          paddingVertical: 4,
          backgroundColor: before ? sc.circleBg : sc.button,
        }}
      >
        <Text variant="callout" style={{ color: before ? sc.body : sc.buttonText }}>
          {label}
        </Text>
      </View>
      <View style={{ gap: 12 }}>
        {texts.map((text, i) => (
          <View key={i} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
            <Icon
              as={before ? MinusCircle : CheckCircle}
              size={22}
              color={before ? sc.negative : sc.positive}
            />
            <Text variant="callout" style={{ flex: 1, color: sc.body }}>
              {text}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

/** Four ways in: pick the person who sounds most like you and see their before / after, what they started with, and what they would tell you. */
export function Scene5({ controls, width }: SceneProps) {
  const { t } = useT();
  const sc = useStoryColors();
  const { fontScale } = useWindowDimensions();
  const [who, setWho] = useState<Who>('hina');
  const w = Math.min(width - 32, 440);
  const sideBySide = w >= 330 && fontScale <= 1.15;
  const p = (k: string) => t(`story.s5.people.${who}.${k}`);

  return (
    <SceneScroll cta={<SceneCTA label={t('story.s5.cta')} onPress={controls.next} delay={1800} />}>
      <View style={{ width: w, gap: 18, alignItems: 'center' }}>
        <FadeUp className="items-center gap-3">
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              borderRadius: 999,
              paddingHorizontal: 16,
              paddingVertical: 8,
              backgroundColor: sc.chipBg,
            }}
          >
            <Icon as={Leaf} size={18} weight="duotone" color={sc.chipText} />
            <Text variant="overline" style={{ color: sc.chipText }}>
              {t('story.s5.chip')}
            </Text>
          </View>
          <Text
            variant="display"
            className="text-center"
            style={{ color: sc.title }}
            accessibilityRole="header"
          >
            {t('story.s5.title')}
          </Text>
          <Text variant="bodyLarge" className="text-center" style={{ color: sc.muted }}>
            {t('story.s5.subtitle')}
          </Text>
        </FadeUp>

        {/* who sounds like you? */}
        <FadeUp delay={150} style={{ width: '100%' }}>
          <View
            role="radiogroup"
            style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}
          >
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
                      backgroundColor: on ? sc.card : 'transparent',
                    }}
                  >
                    <CharacterAvatar name={id} size={58} mood={on ? 'happy' : 'neutral'} />
                  </View>
                  <Text
                    variant="callout"
                    style={{ color: on ? sc.title : sc.muted, fontWeight: on ? '700' : '500' }}
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
          style={{ width: '100%', gap: 16 }}
        >
          {/* their portrait, in their colour */}
          <View
            style={{
              width: '100%',
              borderRadius: 36,
              borderWidth: 4,
              borderColor: signature[who],
              overflow: 'hidden',
              backgroundColor: signature[who] + '33',
            }}
          >
            <PersonPhoto person={who} width={w - 8} height={Math.min(240, (w - 8) * 0.64)} faceAt={0.36} />
            <View
              style={{
                position: 'absolute',
                start: 12,
                bottom: 12,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                borderRadius: 999,
                paddingHorizontal: 14,
                paddingVertical: 6,
                backgroundColor: sc.card,
              }}
            >
              <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: signature[who] }} />
              <Text variant="callout" style={{ color: sc.title, fontWeight: '700' }}>
                {p('name')}
              </Text>
            </View>
          </View>

          <Text variant="title3" className="px-2 text-center font-display-medium" style={{ color: sc.body }}>
            {`“${p('tag')}”`}
          </Text>

          <View
            style={{
              width: '100%',
              backgroundColor: sc.card,
              borderRadius: 36,
              borderWidth: 1,
              borderColor: sc.cardBorder,
              padding: 14,
              overflow: 'hidden',
              flexDirection: sideBySide ? 'row' : 'column',
              gap: 12,
            }}
          >
            <View style={{ flex: sideBySide ? 1 : undefined, borderRadius: 20, overflow: 'hidden' }}>
              <Panel who={who} kind="before" />
            </View>
            <View style={{ flex: sideBySide ? 1 : undefined, borderRadius: 20, overflow: 'hidden' }}>
              <Panel who={who} kind="after" />
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              backgroundColor: sc.afterBg,
              borderRadius: 20,
              paddingHorizontal: 16,
              paddingVertical: 12,
            }}
          >
            <Icon as={Sparkle} size={20} weight="fill" color={sc.positive} />
            <Text variant="callout" style={{ flex: 1, color: sc.body }}>
              <Text variant="callout" style={{ color: sc.muted }}>{`${t('story.s5.started')}: `}</Text>
              {p('started')}
            </Text>
          </View>

          <View
            style={{
              backgroundColor: sc.noteBg,
              borderRadius: 24,
              padding: 16,
              flexDirection: 'row',
              gap: 14,
            }}
          >
            <View
              style={{
                width: 52,
                height: 52,
                borderRadius: 26,
                backgroundColor: sc.circleBg,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon as={Quotes} size={24} weight="fill" color={sc.title} />
            </View>
            <View style={{ flex: 1, gap: 8 }}>
              <Text variant="bodyLarge" style={{ color: sc.body, fontStyle: 'italic' }}>
                {`“${p('message')}”`}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View
                  style={{
                    width: 22,
                    height: 3,
                    borderRadius: 2,
                    backgroundColor: sc.positive,
                    opacity: 0.6,
                  }}
                />
                <Text variant="callout" style={{ color: sc.body, flex: 1 }}>
                  {p('author')}
                </Text>
              </View>
            </View>
          </View>
        </MotiView>

        <Text variant="footnote" className="text-center" style={{ color: sc.muted }}>
          {t('story.s5.illustrated')}
        </Text>
      </View>
    </SceneScroll>
  );
}
