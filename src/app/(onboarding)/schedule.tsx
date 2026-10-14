import { Moon, Shuffle, Sun } from 'phosphor-react-native';
import { Pressable, View } from 'react-native';

import { FadeUp } from '@/components/fade-up';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { ChoiceTile } from '@/features/onboarding/choice-tile';
import { PersonalizationShell } from '@/features/onboarding/shell';
import { goNext } from '@/features/onboarding/steps';
import { useT } from '@/i18n';
import { KaizenIcon } from '@/icons';
import { haptic } from '@/lib/haptics';
import { cn } from '@/lib/utils';
import { weekdayLabel, weekdayOrder } from '@/lib/weekdays';
import { usePrefsStore } from '@/store/prefs-store';
import type { PreferredTime, Weekday } from '@/store/types';
import { useTheme } from '@/theme/theme-provider';

const TIMES: PreferredTime[] = ['morning', 'afternoon', 'evening', 'varies'];

function TimeIcon({ id }: { id: PreferredTime }) {
  const { tokens } = useTheme();
  return (
    <View className="bg-secondary size-14 items-center justify-center rounded-full">
      {id === 'morning' ? (
        <KaizenIcon name="sunrise" size={30} color={tokens.primary} />
      ) : (
        <Icon as={id === 'afternoon' ? Sun : id === 'evening' ? Moon : Shuffle} size={30} weight="duotone" className="text-primary" />
      )}
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
      canContinue={preferred !== null && days.length > 0}
      reaction={preferred ? t(`onboardingQ.schedule.reaction.${preferred}`) : null}
      onSkip={() => {
        patch({ preferredTime: preferred ?? 'varies' });
        goNext('schedule');
      }}
    >
      <View className="flex-row flex-wrap justify-between gap-y-3" role="radiogroup">
        {TIMES.map((id, i) => (
          <ChoiceTile
            key={id}
            index={i}
            label={t(`onboardingQ.schedule.${id}.title`)}
            sublabel={t(`onboardingQ.schedule.${id}.sub`)}
            selected={preferred === id}
            onPress={() => patch({ preferredTime: id })}
            leading={<TimeIcon id={id} />}
          />
        ))}
      </View>

      <FadeUp delay={500} className="gap-3">
        <Text variant="heading">{t('onboardingQ.schedule.daysTitle')}</Text>
        <View className="flex-row justify-between" role="group">
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
                  'size-11 items-center justify-center rounded-full border-2',
                  on ? 'border-primary bg-primary' : 'border-border bg-card'
                )}
              >
                <Text variant="label" className={cn(on ? 'text-primary-foreground' : 'text-foreground')}>
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
