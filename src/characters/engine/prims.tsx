import { createContext, useContext } from 'react';
import { Circle, Defs, Ellipse, G, Path, RadialGradient, Rect, Stop } from 'react-native-svg';

import { shade, tint } from '../art/color';
import type { Prim } from '../art/types';

/**
 * Clay look: when set (to a unique id prefix), every solid, opaque hex fill is drawn with a soft radial gradient
 * (light from the upper left, darker rim) instead of a flat colour. Translucent shading shapes stay flat.
 */
export const ClayContext = createContext<string | null>(null);

const SOLID = /^#[0-9a-f]{6}$/i;
const clayId = (prefix: string, hex: string) => `${prefix}${hex.slice(1).toLowerCase()}`;

function fillOf(clay: string | null, p: { fill?: string; op?: number }) {
  if (!clay || !p.fill || !SOLID.test(p.fill) || (p.op !== undefined && p.op < 0.99)) return p.fill;
  return `url(#${clayId(clay, p.fill)})`;
}

function collect(list: Prim[], out: Set<string>) {
  for (const p of list) {
    if (p.k === 'g') collect(p.children, out);
    else if (p.fill && SOLID.test(p.fill) && (p.op === undefined || p.op >= 0.99))
      out.add(p.fill.toLowerCase());
  }
}

/** Gradient definitions for every colour used in these lists. Render once inside the clay figure's <Svg>. */
export function ClayDefs({ prefix, lists }: { prefix: string; lists: Prim[][] }) {
  const colours = new Set<string>();
  lists.forEach((l) => collect(l, colours));
  return (
    <Defs>
      {[...colours].map((hex) => (
        <RadialGradient key={hex} id={clayId(prefix, hex)} cx="0.34" cy="0.26" r="0.95" fx="0.34" fy="0.26">
          <Stop offset="0" stopColor={tint(hex, 0.3)} />
          <Stop offset="0.5" stopColor={hex} />
          <Stop offset="1" stopColor={shade(hex, 0.2)} />
        </RadialGradient>
      ))}
    </Defs>
  );
}

/** Renders character art data with react-native-svg. */
export function Prims({ list }: { list: Prim[] }) {
  const clay = useContext(ClayContext);
  return (
    <>
      {list.map((p, i) => {
        switch (p.k) {
          case 'path':
            return (
              <Path
                key={i}
                d={p.d}
                fill={fillOf(clay, p)}
                stroke={p.stroke}
                strokeWidth={p.sw}
                strokeLinecap={p.cap}
                strokeLinejoin={p.join}
                opacity={p.op}
              />
            );
          case 'circle':
            return (
              <Circle
                key={i}
                cx={p.cx}
                cy={p.cy}
                r={p.r}
                fill={fillOf(clay, p)}
                stroke={p.stroke}
                strokeWidth={p.sw}
                opacity={p.op}
              />
            );
          case 'ellipse':
            return (
              <Ellipse
                key={i}
                cx={p.cx}
                cy={p.cy}
                rx={p.rx}
                ry={p.ry}
                fill={fillOf(clay, p)}
                stroke={p.stroke}
                strokeWidth={p.sw}
                opacity={p.op}
                transform={p.rot ? `rotate(${p.rot} ${p.cx} ${p.cy})` : undefined}
              />
            );
          case 'rect':
            return (
              <Rect
                key={i}
                x={p.x}
                y={p.y}
                width={p.w}
                height={p.h}
                rx={p.rx}
                fill={fillOf(clay, p)}
                stroke={p.stroke}
                strokeWidth={p.sw}
                opacity={p.op}
                transform={p.rot ? `rotate(${p.rot} ${p.x + p.w / 2} ${p.y + p.h / 2})` : undefined}
              />
            );
          case 'g':
            return (
              <G key={i} transform={p.transform}>
                <Prims list={p.children} />
              </G>
            );
        }
      })}
    </>
  );
}
