import { AnimatePresence, MotiView } from 'moti';
import { View } from 'react-native';

import { CharacterAvatar } from '@/components/character-avatar';
import { Text } from '@/components/ui/text';
import { useReduceMotion } from '@/hooks/use-reduced-motion';
import { useTheme } from '@/theme/theme-provider';

/**
 * Kai's short, friendly reaction after an answer: a small Kai and a `mint` bubble that slides in above the Continue
 * button and swaps smoothly when the answer changes. Takes no space when there is nothing to say. Never judgemental.
 */
export function KaiReaction({ text }: { text: string | null | undefined }) {
  const reduce = useReduceMotion();
  const { colors } = useTheme();
  return (
    <AnimatePresence exitBeforeEnter>
      {text ? (
        <MotiView
          key={text}
          from={{ opacity: 0, translateY: reduce ? 0 : 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          exit={{ opacity: 0 }}
          transition={{ type: 'timing', duration: 350 }}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingBottom: 12 }}
        >
          <CharacterAvatar name="kai" size={40} />
          <View
            style={{
              flex: 1,
              backgroundColor: colors.mint,
              borderRadius: 20,
              borderTopStartRadius: 6,
              paddingHorizontal: 14,
              paddingVertical: 8,
            }}
          >
            <Text variant="callout" style={{ color: colors.forest }}>
              {text}
            </Text>
          </View>
        </MotiView>
      ) : null}
    </AnimatePresence>
  );
}
