import type { ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { GlassCard } from '@/components/glass-card';
import { useTheme } from '@/theme/theme-provider';

interface Props {
  selected: boolean;
  /** Inner padding (the selected variant subtracts the extra border pixel so both sizes match). */
  pad?: number;
  contentStyle?: StyleProp<ViewStyle>;
  /** Fill the height of the slot it is in (tiles in a grid row end up equally tall). */
  fill?: boolean;
  children: ReactNode;
}

/**
 * The surface behind every selectable card and tile (docs/UI_Build.md): resting = `glass` panel, selected = solid
 * `mint` with a 2px `leaf` edge (never glass on glass, never colour alone: a check mark is always drawn too).
 * Both states are exactly the same size, so selecting never shifts the layout.
 */
export function OptionSurface({ selected, pad = 16, contentStyle, fill, children }: Props) {
  const { colors } = useTheme();
  if (selected) {
    return (
      <View
        style={[
          {
            borderRadius: 20,
            borderWidth: 2,
            borderColor: colors.leaf,
            backgroundColor: colors.mint,
            padding: pad - 1,
          },
          fill ? { flex: 1 } : null,
          contentStyle,
        ]}
      >
        {children}
      </View>
    );
  }
  return (
    <GlassCard
      shadow={false}
      style={fill ? { flex: 1 } : undefined}
      contentStyle={[{ padding: pad }, fill ? { flex: 1 } : null, contentStyle]}
    >
      {children}
    </GlassCard>
  );
}
