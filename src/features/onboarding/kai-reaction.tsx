import { AnimatePresence, MotiView } from 'moti';
import { View } from 'react-native';

import { Character } from '@/characters/character';
import { Text } from '@/components/ui/text';
import { useReduceMotion } from '@/hooks/use-reduced-motion';

/**
 * Kai's short, friendly reaction after an answer. Pops in beside a floating Kai; swaps smoothly when the
 * answer changes. Never judgemental.
 */
export function KaiReaction({ text }: { text: string | null | undefined }) {
  const reduce = useReduceMotion();
  return (
    <View style={{ minHeight: 76 }} className="justify-center">
      <AnimatePresence exitBeforeEnter>
        {text ? (
          <MotiView
            key={text}
            from={{ opacity: 0, translateY: reduce ? 0 : 10, scale: reduce ? 1 : 0.97 }}
            animate={{ opacity: 1, translateY: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'timing', duration: 350 }}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
          >
            <Character name="kai" pose="float" mood="happy" size={68} />
            <View className="flex-1 rounded-[18px] border border-border bg-card px-4 py-3 shadow-lg shadow-forest/10">
              {/* tail pointing at Kai */}
              <View className="absolute -start-[7px] top-6 size-3.5 rotate-45 border-b border-s border-border bg-card" />
              <Text variant="body">{text}</Text>
            </View>
          </MotiView>
        ) : null}
      </AnimatePresence>
    </View>
  );
}
