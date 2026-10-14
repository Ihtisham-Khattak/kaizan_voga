import { useState } from 'react';
import { View } from 'react-native';

import { ProgressRing } from '@/components/progress-ring';
import { Text } from '@/components/ui/text';
import { ChoiceTile } from '@/features/onboarding/choice-tile';
import { PersonalizationShell } from '@/features/onboarding/shell';
import { useT } from '@/i18n';
import { usePrefsStore } from '@/store/prefs-store';

const OPTIONS = [5, 10, 15, 20] as const;

/** Onboarding Q2 — time per day. Each tile shows its share of a 20-minute ring. */
export default function TimeScreen() {
  const { t } = useT();
  const minutes = usePrefsStore((s) => s.minutesPerDay);
  const patch = usePrefsStore((s) => s.patch);
  // 10 min is pre-selected; Kai only reacts once the user actually chooses.
  const [touched, setTouched] = useState(false);

  return (
    <PersonalizationShell
      step="time"
      title={t('onboardingQ.time.title')}
      subtitle={t('onboardingQ.time.subtitle')}
      reaction={touched ? t(`onboardingQ.time.reaction.${minutes}`) : null}
    >
      <View className="flex-row flex-wrap justify-between gap-y-3" role="radiogroup">
        {OPTIONS.map((m, i) => (
          <ChoiceTile
            key={m}
            index={i}
            label={t('common.minutes', { count: m })}
            selected={minutes === m}
            onPress={() => {
              setTouched(true);
              patch({ minutesPerDay: m });
            }}
            leading={
              <ProgressRing
                progress={m / 20}
                size={72}
                strokeWidth={8}
                color={minutes === m ? 'primary' : 'leaf'}
              >
                <Text variant="heading">{String(m)}</Text>
              </ProgressRing>
            }
          />
        ))}
      </View>
    </PersonalizationShell>
  );
}
