import { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';

import type { Prim } from '../art/types';

/** Renders character art data with react-native-svg. */
export function Prims({ list }: { list: Prim[] }) {
  return (
    <>
      {list.map((p, i) => {
        switch (p.k) {
          case 'path':
            return (
              <Path
                key={i}
                d={p.d}
                fill={p.fill}
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
                fill={p.fill}
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
                fill={p.fill}
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
                fill={p.fill}
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
