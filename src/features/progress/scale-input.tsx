import { Pressable, View } from 'react-native';

import { Text } from '@/components/ui/text';
import { useT } from '@/i18n';
import { haptic } from '@/lib/haptics';
import type { Score } from '@/store/types';

interface Props {
  label: string;
  low: string;
  high: string;
  value: Score;
  onChange: (v: Score) => void;
}

/** 1–5 scale with words at both ends. Five big circles (44px+) so it is easy to hit and to announce. */
export function ScaleInput({ label, low, high, value, onChange }: Props) {
  const { t } = useT();
  return (
    <View className="gap-2">
      <Text variant="label" accessibilityRole="header">
        {label}
      </Text>
      <View
        role="radiogroup"
        accessibilityLabel={label}
        accessibilityValue={{ min: 1, max: 5, now: value, text: t('prog.reflection.value', { value }) }}
        className="flex-row justify-between"
      >
        {([1, 2, 3, 4, 5] as Score[]).map((n) => {
          const on = n === value;
          return (
            <Pressable
              key={n}
              role="radio"
              aria-checked={on}
              accessibilityLabel={t('prog.reflection.value', { value: n })}
              accessibilityState={{ checked: on }}
              onPress={() => {
                haptic.select();
                onChange(n);
              }}
              hitSlop={4}
              className={`size-12 items-center justify-center rounded-full border-2 ${
                on ? 'border-primary bg-primary' : 'border-border bg-card'
              }`}
            >
              <Text variant="label" className={on ? 'text-primary-foreground' : 'text-foreground'}>
                {n}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <View className="flex-row justify-between">
        <Text variant="caption">{low}</Text>
        <Text variant="caption">{high}</Text>
      </View>
    </View>
  );
}
