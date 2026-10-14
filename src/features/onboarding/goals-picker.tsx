import { View } from 'react-native';

import { useT } from '@/i18n';
import { usePrefsStore } from '@/store/prefs-store';

import { GOALS, goalLeading } from './goal-options';
import { OptionCard } from './option-card';

/** "What brings you here?" – multi-select goal cards. Used by Story Scene 6 and the (onboarding)/goals route. */
export function GoalsPicker() {
  const { t } = useT();
  const goals = usePrefsStore((s) => s.goals);
  const toggle = usePrefsStore((s) => s.toggleGoal);
  return (
    <View className="gap-3" role="group">
      {GOALS.map((g, i) => (
        <OptionCard
          key={g.id}
          multi
          index={i}
          title={t(`story.s6.goals.${g.id}`)}
          leading={goalLeading(g)}
          selected={goals.includes(g.id)}
          onPress={() => toggle(g.id)}
        />
      ))}
    </View>
  );
}
