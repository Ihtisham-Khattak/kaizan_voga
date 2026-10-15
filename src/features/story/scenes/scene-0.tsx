import { MotiView } from 'moti';
import { View } from 'react-native';

import { Character } from '@/characters/character';
import { ConfettiLeaves, LotusLogo } from '@/characters/props';
import { BreathingCircle } from '@/components/breathing-circle';
import { FadeUp } from '@/components/fade-up';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useReduceMotion } from '@/hooks/use-reduced-motion';
import { useT } from '@/i18n';
import { spring } from '@/theme/motion';

import { SceneCTA, SceneScroll } from '../stage';
import type { SceneProps } from '../types';

/** Scene 0 — Welcome. Kai floats in and waves while a breathing circle pulses behind him. */
export function Scene0({ controls, width, height }: SceneProps) {
  const { t } = useT();
  const reduce = useReduceMotion();
  const size = Math.min(width * 0.84, 320);

  return (
    <>
      {/* a few leaves drift down, slowly */}
      <ConfettiLeaves width={width} height={height} count={7} />
      <SceneScroll
        top={72}
        cta={
          <View style={{ width: '100%', maxWidth: 420, gap: 4 }}>
            <SceneCTA label={t('story.s0.begin')} onPress={controls.next} delay={2200} />
            <Button variant="ghost" onPress={controls.goSignIn}>
              <Text>{t('story.s0.haveAccount')}</Text>
            </Button>
          </View>
        }
      >
        <FadeUp className="items-center gap-2">
          <LotusLogo size={64} />
          <Text variant="label" className="uppercase tracking-[3px]">
            {t('common.appName')}
          </Text>
        </FadeUp>

        <View style={{ width: size, height: size }} className="my-3 items-center justify-center">
          <BreathingCircle size={size} soft tint="sunrise" />
          <MotiView
            from={{ opacity: 0, translateY: reduce ? 0 : -240 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={
              reduce
                ? { type: 'timing', duration: 400, delay: 300 }
                : { type: 'spring', ...spring.soft, delay: 400 }
            }
            style={{ position: 'absolute' }}
          >
            <Character name="kai" pose="wave" mood="happy" size={size * 0.74} />
          </MotiView>
        </View>

        <View className="items-center gap-2 px-2">
          <FadeUp delay={1500}>
            <Text variant="display" className="max-w-[270px] text-center">
              {t('story.s0.headline')}
            </Text>
          </FadeUp>
          <FadeUp delay={1850}>
            <Text variant="lead" className="text-center text-muted-foreground">
              {t('story.s0.sub')}
            </Text>
          </FadeUp>
        </View>
      </SceneScroll>
    </>
  );
}
