import { GoalsPicker } from '@/features/onboarding/goals-picker';
import { PersonalizationShell } from '@/features/onboarding/shell';
import { useT } from '@/i18n';
import { usePrefsStore } from '@/store/prefs-store';

/** Landing for Skip from the story: the same goals question as Scene 6, in the personalization shell. */
export default function GoalsScreen() {
  const { t } = useT();
  const count = usePrefsStore((s) => s.goals.length);
  return (
    <PersonalizationShell
      step="goals"
      hideBack
      title={t('onboarding.goals.title')}
      subtitle={t('onboarding.goals.subtitle')}
      canContinue={count > 0}
      reaction={count > 0 ? t('onboarding.goals.reaction') : null}
    >
      <GoalsPicker />
    </PersonalizationShell>
  );
}
