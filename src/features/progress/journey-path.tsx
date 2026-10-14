import { Moon, Star } from 'phosphor-react-native';
import { MotiView } from 'moti';
import { useState } from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { getProgram } from '@/data/repo';
import { useReduceMotion } from '@/hooks/use-reduced-motion';
import { useT } from '@/i18n';
import { JOURNEY_ID } from '@/lib/journey';
import { addDays, dayKey, startOfDay } from '@/lib/stats';
import { KaizenIcon } from '@/icons';
import { useTheme } from '@/theme/theme-provider';

const COLS = 5;
const ROW_H = 76;
const NODE = 44;
const MILESTONES = [7, 14, 21, 28, 30];

interface Props {
  startedAt: string | null;
  currentDay: number;
  /** Local day keys on which the user practised. */
  practiced: Set<string>;
}

/**
 * The 30-day journey as a winding path (rows alternate direction). Done days are leaves, rest days are moons,
 * today has a soft pulsing ring. A day that passed without practice is just a quiet empty circle – no ✗, no shame.
 */
export function JourneyPath({ startedAt, currentDay, practiced }: Props) {
  const { t } = useT();
  const { colors, extras } = useTheme();
  const reduce = useReduceMotion();
  const [width, setWidth] = useState(340);
  const days = getProgram(JOURNEY_ID).days;
  const start = startOfDay(startedAt ? new Date(startedAt) : new Date());

  const pad = NODE / 2 + 6;
  const rows = Math.ceil(days.length / COLS);
  const pos = (i: number) => {
    const row = Math.floor(i / COLS);
    const col = i % COLS;
    const c = row % 2 === 0 ? col : COLS - 1 - col;
    return { x: pad + (c * (width - pad * 2)) / (COLS - 1), y: row * ROW_H + ROW_H / 2 };
  };

  const done = (i: number) => practiced.has(dayKey(addDays(start, i)));
  // path split into the travelled part (sage) and what's ahead (dashed)
  const seg = (from: number, to: number) =>
    Array.from({ length: to - from + 1 }, (_, k) => {
      const p = pos(from + k);
      return `${k === 0 ? 'M' : 'L'}${p.x} ${p.y}`;
    }).join(' ');

  return (
    <View
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      style={{ height: rows * ROW_H }}
      accessibilityRole="list"
    >
      <Svg width={width} height={rows * ROW_H} style={{ position: 'absolute' }}>
        {currentDay > 1 ? (
          <Path
            d={seg(0, currentDay - 1)}
            stroke={colors.leaf}
            strokeWidth={4}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity={0.7}
          />
        ) : null}
        {currentDay < days.length ? (
          <Path
            d={seg(currentDay - 1, days.length - 1)}
            stroke={colors.hairline}
            strokeWidth={3}
            strokeDasharray="2 8"
            strokeLinecap="round"
            fill="none"
          />
        ) : null}
      </Svg>

      {days.map((d, i) => {
        const n = i + 1;
        const p = pos(i);
        const isToday = n === currentDay;
        const isDone = done(i);
        const isRest = d.kind === 'rest';
        const past = n < currentDay;
        const milestone = MILESTONES.includes(n);
        const state = isDone ? 'done' : isToday ? 'today' : isRest ? 'rest' : past ? 'plain' : 'upcoming';
        return (
          <View
            key={n}
            accessible
            accessibilityRole="text"
            accessibilityLabel={`${t(`prog.node.${state}`, { day: n })}${milestone ? `, ${t('prog.milestone')}` : ''}`}
            style={{
              position: 'absolute',
              left: p.x - NODE / 2,
              top: p.y - NODE / 2,
              width: NODE,
              height: NODE,
            }}
            className="items-center justify-center"
          >
            {isToday && !reduce ? (
              <MotiView
                from={{ scale: 1, opacity: 0.5 }}
                animate={{ scale: 1.45, opacity: 0 }}
                transition={{ type: 'timing', duration: 2200, loop: true }}
                style={{
                  position: 'absolute',
                  width: NODE,
                  height: NODE,
                  borderRadius: NODE / 2,
                  backgroundColor: colors.leaf,
                }}
              />
            ) : null}
            <View
              style={{
                width: NODE - 4,
                height: NODE - 4,
                borderRadius: NODE,
                backgroundColor: isDone
                  ? colors.leaf
                  : isToday
                    ? colors.bgMist
                    : isRest
                      ? colors.mint
                      : colors.bgMist,
                borderWidth: isToday ? 3 : 1.5,
                borderColor: isToday ? colors.primary : isDone ? colors.leaf : colors.hairline,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isDone ? (
                <KaizenIcon name="leaf" size={20} color={extras.onLeaf} strokeWidth={2} />
              ) : isRest ? (
                <Icon as={Moon} size={18} weight="duotone" className="text-muted-foreground" />
              ) : (
                <Text
                  variant="caption"
                  className={isToday ? 'font-sans-bold text-foreground' : 'text-muted-foreground'}
                >
                  {n}
                </Text>
              )}
            </View>
            {milestone ? (
              <View
                style={{
                  position: 'absolute',
                  top: -4,
                  end: -4,
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: colors.sunriseSoft,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon as={Star} size={12} weight="fill" className="text-foreground" />
              </View>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}
