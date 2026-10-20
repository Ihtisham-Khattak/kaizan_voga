import { MoonStars, Shuffle, Sun, SunHorizon } from 'phosphor-react-native';
import { AnimatePresence, MotiView } from 'moti';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FadeUp } from '@/components/fade-up';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { ChipIcon, ChoiceChip, ChoiceFlow } from '@/features/onboarding/choice-flow';
import { PersonalizationShell } from '@/features/onboarding/shell';
import { goNext } from '@/features/onboarding/steps';
import { useReduceMotion } from '@/hooks/use-reduced-motion';
import { useT } from '@/i18n';
import { haptic } from '@/lib/haptics';
import { cn } from '@/lib/utils';
import { weekdayLabel, weekdayOrder } from '@/lib/weekdays';
import { usePrefsStore } from '@/store/prefs-store';
import type { PreferredTime, Weekday } from '@/store/types';
import { useTheme } from '@/theme/theme-provider';

const TIMES: PreferredTime[] = ['morning', 'afternoon', 'evening', 'varies'];

function TimeIcon({ id }: { id: PreferredTime }) {
  const { colors } = useTheme();
  const icon =
    id === 'morning' ? SunHorizon : id === 'afternoon' ? Sun : id === 'evening' ? MoonStars : Shuffle;
  return (
    <ChipIcon>
      <Icon
        as={icon}
        size={22}
        weight="duotone"
        color={id === 'evening' ? colors.lavender : colors.primary}
      />
    </ChipIcon>
  );
}

/**
 * A big, soft sun or moon that drifts in behind the screen when a time of day is chosen. It belongs to the same mood
 * as the background: green dawn, clear blue afternoon, lavender evening. Tokens only; still with Reduce Motion.
 */
function TimeMotif({ time }: { time: PreferredTime | null }) {
  const { colors } = useTheme();
  const reduce = useReduceMotion();
  const insets = useSafeAreaInsets();
  const spec =
    time === 'morning'
      ? { icon: SunHorizon, color: colors.leaf }
      : time === 'afternoon'
        ? { icon: Sun, color: colors.sky }
        : time === 'evening'
          ? { icon: MoonStars, color: colors.lavender }
          : null;
  return (
    <View
      pointerEvents="none"
      style={{ position: 'absolute', end: -18, top: insets.top + 250, width: 190, height: 190 }}
    >
      <AnimatePresence exitBeforeEnter>
        {spec ? (
          <MotiView
            key={time}
            from={{ opacity: 0, scale: reduce ? 1 : 0.85, translateY: reduce ? 0 : 16 }}
            animate={{ opacity: 0.32, scale: 1, translateY: 0 }}
            exit={{ opacity: 0, scale: reduce ? 1 : 1.08 }}
            transition={{ type: 'timing', duration: 700 }}
          >
            <MotiView
              from={{ translateY: 0, rotate: '0deg' }}
              animate={{ translateY: reduce ? 0 : -8, rotate: reduce ? '0deg' : '4deg' }}
              transition={{ type: 'timing', duration: 3600, loop: !reduce, repeatReverse: true }}
            >
              <Icon as={spec.icon} size={190} weight="duotone" color={spec.color} />
            </MotiView>
          </MotiView>
        ) : null}
      </AnimatePresence>
    </View>
  );
}

/** Onboarding Q3 — preferred time of day + practice days. Rest days are framed as healthy. */
export default function ScheduleScreen() {
  const { t, i18n } = useT();
  const preferred = usePrefsStore((s) => s.preferredTime);
  const days = usePrefsStore((s) => s.practiceDays);
  const patch = usePrefsStore((s) => s.patch);
  const order = weekdayOrder();

  const toggleDay = (d: Weekday) => {
    haptic.select();
    patch({ practiceDays: days.includes(d) ? days.filter((x) => x !== d) : [...days, d].sort() });
  };

  return (
    <PersonalizationShell
      step="schedule"
      title={t('onboardingQ.schedule.title')}
      subtitle={t('onboardingQ.schedule.subtitle')}
      tone={preferred}
      backdrop={<TimeMotif time={preferred} />}
      canContinue={preferred !== null && days.length > 0}
      reaction={preferred ? t(`onboardingQ.schedule.reaction.${preferred}`) : null}
      onSkip={() => {
        patch({ preferredTime: preferred ?? 'varies' });
        goNext('schedule');
      }}
    >
      <ChoiceFlow>
        {TIMES.map((id, i) => (
          <ChoiceChip
            key={id}
            index={i}
            label={t(`onboardingQ.schedule.${id}.title`)}
            sublabel={t(`onboardingQ.schedule.${id}.sub`)}
            selected={preferred === id}
            onPress={() => patch({ preferredTime: id })}
            leading={<TimeIcon id={id} />}
          />
        ))}
      </ChoiceFlow>

      <FadeUp delay={500} className="gap-3">
        <Text variant="heading">{t('onboardingQ.schedule.daysTitle')}</Text>
        <View style={{ flexDirection: 'row', gap: 8 }} role="group">
          {order.map((d) => {
            const on = days.includes(d);
            return (
              <Pressable
                key={d}
                role="checkbox"
                aria-checked={on}
                accessibilityState={{ checked: on }}
                accessibilityLabel={weekdayLabel(d, 'long', i18n.language)}
                onPress={() => toggleDay(d)}
                className={cn(
                  'aspect-square flex-1 items-center justify-center rounded-full border-2',
                  on ? 'border-primary bg-primary' : 'border-hairline bg-mint'
                )}
              >
                <Text variant="label" className={cn(on ? 'text-onPrimary' : 'text-forest')}>
                  {weekdayLabel(d, 'narrow', i18n.language)}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <Text variant="caption">{t('onboardingQ.schedule.daysHint')}</Text>
      </FadeUp>
    </PersonalizationShell>
  );
}
