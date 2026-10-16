import { CaretRight } from 'phosphor-react-native';
import { MotiView } from 'moti';
import { I18nManager, View } from 'react-native';

import { LightRays } from '@/characters/props';
import { AuroraBackground } from '@/components/aurora-background';
import { CharacterAvatar } from '@/components/character-avatar';
import { FadeUp } from '@/components/fade-up';
import { GlassCard } from '@/components/glass-card';
import { PersonPhoto } from '@/components/person-photo';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import type { Person } from '@/data/companions';
import { scenes } from '@/data/story';
import { useReduceMotion } from '@/hooks/use-reduced-motion';
import { useT } from '@/i18n';
import { useTheme } from '@/theme/theme-provider';

import { dir, SceneScroll, stageWidth } from '../stage';
import type { SceneProps } from '../types';

const cfg = scenes[3];
const CAST: Person[] = ['hamid', 'hina', 'sierra', 'arfa'];
const PAD = 8;
const GAP = 8;

/** Consecutive lines by the same speaker share one name and avatar. */
function groupLines() {
  const groups: { speaker: Person; lines: { key: string; delay: number }[] }[] = [];
  for (const b of cfg.bubbles) {
    const last = groups[groups.length - 1];
    const line = { key: b.textKey, delay: b.delayMs };
    if (last && last.speaker === b.speaker) last.lines.push(line);
    else groups.push({ speaker: b.speaker as Person, lines: [line] });
  }
  return groups;
}

/**
 * Scene 3 — Arif arrives, calm and at ease; warm light enters. Built strictly on the docs/UI_Build.md tokens:
 * `bg` + aurora blobs, glass panels (inner pills and bubbles are `mint`), Fraunces display title, Jakarta body.
 */
export function Scene3({ controls, width, height }: SceneProps) {
  const { t } = useT();
  const { colors } = useTheme();
  const reduce = useReduceMotion();
  const w = stageWidth(width);
  const tileW = (w - 2 * PAD - 3 * GAP) / 4;
  const tileH = tileW * 1.2;
  const arfaEnter = cfg.characters.find((c) => c.id === 'arfa')!.enterAt;
  const groups = groupLines();
  const name = (id: string) => t(`story.s5.people.${id}.name`);
  const lastDelay = cfg.bubbles[cfg.bubbles.length - 1].delayMs;

  return (
    <>
      <AuroraBackground />
      {/* warm light enters from the corner */}
      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 0.55 }}
        transition={{ type: 'timing', duration: 1600, delay: 300 }}
        style={{ position: 'absolute', top: 0, start: 0, end: 0, bottom: 0 }}
        pointerEvents="none"
      >
        <LightRays width={width} height={height} />
      </MotiView>

      <SceneScroll
        top={90}
        bandColor={colors.bg}
        cta={
          <FadeUp delay={lastDelay + 600} style={{ width: '100%', maxWidth: 420 }}>
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
                {t('story.s3.chip')}
              </Text>
            </View>
            <Text variant="display" accessibilityRole="header" style={{ color: colors.forest }}>
              {t('story.s3.title')}
            </Text>
            <Text variant="bodyLarge" style={{ color: colors.muted }}>
              {t('story.s3.subtitle')}
            </Text>
          </FadeUp>

          {/* the three friends, then Arif walks in */}
          <GlassCard radius="hero" contentStyle={{ padding: PAD, flexDirection: 'row', gap: GAP }}>
            {CAST.map((id) => {
              const arfa = id === 'arfa';
              return (
                <MotiView
                  key={id}
                  from={{ opacity: 0, translateX: arfa && !reduce ? 80 * dir() : 0 }}
                  animate={{ opacity: 1, translateX: 0 }}
                  transition={{
                    type: 'timing',
                    duration: reduce ? 300 : 900,
                    delay: arfa ? arfaEnter : 150,
                  }}
                  accessible
                  accessibilityRole="image"
                  accessibilityLabel={name(id)}
                  style={{
                    width: tileW,
                    height: tileH,
                    borderRadius: 20,
                    overflow: 'hidden',
                    borderWidth: arfa ? 3 : 0,
                    borderColor: colors.leaf,
                  }}
                >
                  <PersonPhoto person={id} width={tileW} height={tileH} faceAt={0.38} />
                  <View
                    style={{
                      position: 'absolute',
                      bottom: 6,
                      alignSelf: 'center',
                      borderRadius: 999,
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                      backgroundColor: colors.mint,
                    }}
                  >
                    <Text variant="footnote" style={{ color: colors.forest }}>
                      {name(id)}
                    </Text>
                  </View>
                </MotiView>
              );
            })}
          </GlassCard>

          {/* what is said, one line at a time */}
          <GlassCard strong contentStyle={{ padding: 14, gap: 12 }}>
            {groups.map((g, gi) => (
              <FadeUp
                key={g.lines[0].key}
                delay={g.lines[0].delay}
                style={{
                  flexDirection: 'row',
                  gap: 12,
                  alignItems: 'flex-start',
                  paddingTop: gi === 0 ? 0 : 12,
                  borderTopWidth: gi === 0 ? 0 : 1,
                  borderTopColor: colors.hairline,
                }}
              >
                <CharacterAvatar name={g.speaker} size={44} />
                <View style={{ flex: 1, gap: 4 }}>
                  <Text variant="callout" style={{ color: colors.forest, fontWeight: '700' }}>
                    {name(g.speaker)}
                  </Text>
                  {g.lines.map((l) => (
                    <FadeUp
                      key={l.key}
                      delay={l.delay - g.lines[0].delay}
                      distance={8}
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
                        {t(l.key)}
                      </Text>
                    </FadeUp>
                  ))}
                </View>
              </FadeUp>
            ))}
          </GlassCard>
        </View>
      </SceneScroll>
    </>
  );
}
