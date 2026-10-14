/**
 * Character art is plain data (no React) so it can be rendered by react-native-svg in the app AND by a tiny
 * SVG-string renderer in dev tooling for fast iteration (see .tools/preview.ts).
 */
export type Prim =
  | {
      k: 'path';
      d: string;
      fill?: string;
      stroke?: string;
      sw?: number;
      cap?: 'round' | 'butt' | 'square';
      join?: 'round' | 'miter';
      op?: number;
    }
  | {
      k: 'circle';
      cx: number;
      cy: number;
      r: number;
      fill?: string;
      stroke?: string;
      sw?: number;
      op?: number;
    }
  | {
      k: 'ellipse';
      cx: number;
      cy: number;
      rx: number;
      ry: number;
      fill?: string;
      stroke?: string;
      sw?: number;
      op?: number;
      rot?: number;
    }
  | {
      k: 'rect';
      x: number;
      y: number;
      w: number;
      h: number;
      rx?: number;
      fill?: string;
      stroke?: string;
      sw?: number;
      op?: number;
      rot?: number;
    }
  | { k: 'g'; transform: string; children: Prim[] };

export type Pt = readonly [number, number];
