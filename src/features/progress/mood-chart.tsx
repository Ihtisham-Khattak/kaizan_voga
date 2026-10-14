import { View } from 'react-native';
import Svg, { Circle, G, Line, Polygon, Text as SvgText } from 'react-native-svg';

import { MOOD_LEVEL } from '@/lib/stats';
import { useT } from '@/i18n';
import { MOODS, type SessionRecord } from '@/store/types';
import { useTheme } from '@/theme/theme-provider';

const H = 220;
const PAD_L = 62;
const PAD_R = 14;
const PAD_T = 14;
const PAD_B = 14;

interface Props {
  /** Sessions that have BOTH a before and an after mood, oldest first. */
  data: SessionRecord[];
  width: number;
}

/**
 * Paired dots over time: ○ before, ◆ after, joined by a line. Shape (not just colour) tells them apart, and the
 * y-axis carries mood words. An accessible table alternative lives next to this on the screen.
 */
export function MoodChart({ data, width }: Props) {
  const { t } = useT();
  const { colors } = useTheme();
  const plotW = Math.max(40, width - PAD_L - PAD_R);
  const plotH = H - PAD_T - PAD_B;
  const y = (level: number) => PAD_T + plotH - ((level - 1) / 4) * plotH;
  const INSET = 14; // keep the first/last pair off the axis labels and the edge
  const x = (i: number) =>
    PAD_L +
    INSET +
    (data.length === 1 ? (plotW - INSET * 2) / 2 : (i / (data.length - 1)) * (plotW - INSET * 2));

  return (
    <View accessibilityRole="image" accessibilityLabel={t('prog.mood.chartLabel')}>
      <Svg width={width} height={H}>
        {MOODS.map((m) => (
          <G key={m}>
            <Line
              x1={PAD_L}
              x2={width - PAD_R}
              y1={y(MOOD_LEVEL[m])}
              y2={y(MOOD_LEVEL[m])}
              stroke={colors.hairline}
              strokeWidth={1}
              strokeDasharray="3 5"
            />
            <SvgText
              x={PAD_L - 8}
              y={y(MOOD_LEVEL[m]) + 4}
              fontSize={11}
              fill={colors.muted}
              textAnchor="end"
            >
              {t(`mood.${m}`)}
            </SvgText>
          </G>
        ))}
        {data.map((s, i) => {
          const b = y(MOOD_LEVEL[s.moodBefore!]);
          const a = y(MOOD_LEVEL[s.moodAfter!]);
          const cx = x(i);
          return (
            <G key={s.id}>
              <Line
                x1={cx}
                x2={cx}
                y1={b}
                y2={a}
                stroke={colors.leaf}
                strokeWidth={2.5}
                strokeLinecap="round"
                opacity={0.7}
              />
              <Circle cx={cx} cy={b} r={6} fill={colors.bgMist} stroke={colors.ink} strokeWidth={2} />
              <Polygon
                points={`${cx},${a - 8} ${cx + 8},${a} ${cx},${a + 8} ${cx - 8},${a}`}
                fill={colors.primary}
                stroke={colors.bgMist}
                strokeWidth={1.5}
              />
            </G>
          );
        })}
      </Svg>
    </View>
  );
}
