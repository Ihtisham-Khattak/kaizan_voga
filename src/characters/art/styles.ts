import { shade, tint } from './color';
import type { HumanStyle } from './human';
import type { Prim } from './types';
import { art } from '@/theme/illustration';

/**
 * The four people (docs/character-bible.md). Each = the shared body + ONE signature colour + a few details that
 * never change, plus a `yoga` outfit (everyday clothes swapped for session clothes; same face, hair, skin):
 *   Hina   – lilac dupatta · hair tied back with a clip · office lanyard
 *   Arfa   – teal cardigan · long wavy hair in a loose braid · small stud earrings
 *   Hamid  – mustard sweater over a collared shirt · round glasses · light stubble · sturdy build
 *   Sierra – coral knit cardigan · loose curls · hoop earrings
 */
export const INK = art.ink;
const stroke = (d: string, color: string, sw: number, op = 1): Prim => ({
  k: 'path',
  d,
  stroke: color,
  sw,
  cap: 'round',
  join: 'round',
  op,
});

/** Crew neckline: shows a little neck/collarbone skin in a soft scoop. */
const crewNeck = (skin: string, edge: string): Prim[] => [
  { k: 'path', d: 'M87 55 Q100 72 113 55 Q100 60 87 55 Z', fill: skin },
  stroke('M87 55 Q100 72 113 55', edge, 2.2, 0.7),
];

// ───────────────────────── Hina ─────────────────────────
export const HINA: HumanStyle = {
  skin: art.skinHina,
  hair: art.hairHina,
  top: art.cEFE6D6,
  sleeve: 'long',
  pants: art.slate,
  shoes: art.c6B5445,
  behind: (c) => [
    // low ponytail peeking out behind the right shoulder
    {
      k: 'path',
      d: 'M116 2 C138 8 144 40 135 68 C131 78 122 75 124 64 C127 44 122 24 110 10 Z',
      fill: c.hair,
    },
  ],
  clothing: (c) => [
    ...crewNeck(c.skin, c.topShade),
    // lilac dupatta: round the neck with one long drape over the shoulder
    { k: 'path', d: 'M69 60 Q100 84 131 60 L135 76 Q100 100 65 76 Z', fill: art.lilac },
    { k: 'path', d: 'M69 62 Q50 108 55 182 L80 188 Q74 122 94 86 Z', fill: art.lilac },
    { k: 'path', d: 'M69 62 Q50 108 55 182 L62 183 Q58 112 74 70 Z', fill: shade(art.lilac, 0.12), op: 0.7 },
    stroke('M62 96 Q58 136 64 176', art.lilacSoft, 3, 0.85),
    stroke('M66 76 Q100 100 134 76', art.lilacSoft, 2, 0.7),
    // office lanyard with a badge
    stroke('M93 70 L97 106 M107 70 L103 106', art.teal, 2.2, 0.95),
    { k: 'rect', x: 92, y: 106, w: 16, h: 20, rx: 3, fill: art.white },
    { k: 'rect', x: 95, y: 110, w: 10, h: 3.5, rx: 1.7, fill: art.sageLight },
    { k: 'rect', x: 95, y: 116, w: 7, h: 2.5, rx: 1.2, fill: art.lilacSoft },
  ],
  hairFront: (c) => [
    // hair swept back and tied; a small clip at the back of the head
    {
      k: 'path',
      d: 'M75 8 C73 -12 86 -21 100 -21 C114 -21 127 -12 125 8 C120 -5 111 -11 100 -11 C89 -11 80 -5 75 8 Z',
      fill: c.hair,
    },
    stroke('M100 -20 L100 -10', shade(c.hair, 0.35), 1.6, 0.7),
    stroke('M86 -9 Q92 -16 98 -19', tint(c.hair, 0.3), 1.5, 0.5),
    { k: 'rect', x: 112, y: -9, w: 11, h: 4.5, rx: 2.2, fill: art.sand },
  ],
  yoga: {
    top: art.lilacSoft,
    sleeve: 'short',
    pants: art.charcoal,
    shoes: art.shoe,
    clothing: (c) => [...crewNeck(c.skin, c.topShade)],
  },
};

// ───────────────────────── Arfa ─────────────────────────
export const ARFA: HumanStyle = {
  skin: art.skinArfa,
  hair: art.hairArfa,
  top: art.teal,
  sleeve: 'long',
  pants: art.c3F5575,
  shoes: art.shoe,
  behind: (c) => [
    // long wavy hair behind the shoulders
    {
      k: 'path',
      d: 'M72 6 C68 -14 82 -22 100 -22 C118 -22 132 -14 128 6 C132 30 132 56 126 82 C120 88 113 74 116 58 L84 58 C87 74 80 88 74 82 C68 56 68 30 72 6 Z',
      fill: c.hair,
    },
  ],
  clothing: (c) => [
    // open cardigan over a light top
    { k: 'path', d: 'M88 56 L100 118 L112 56 Q100 68 88 56 Z', fill: art.cEFE6D6 },
    stroke('M88 56 L97 160', shade(c.top, 0.3), 2, 0.6),
    stroke('M112 56 L103 160', shade(c.top, 0.3), 2, 0.6),
    { k: 'circle', cx: 100, cy: 100, r: 2.4, fill: art.cEFE6D6 },
    { k: 'circle', cx: 100, cy: 122, r: 2.4, fill: art.cEFE6D6 },
    { k: 'circle', cx: 100, cy: 144, r: 2.4, fill: art.cEFE6D6 },
  ],
  frontHair: (c) => [
    // loose braid over the left shoulder, tied with a mustard band
    ...Array.from({ length: 7 }, (_, i): Prim => ({
      k: 'ellipse',
      cx: 80 - i * 0.5,
      cy: 64 + i * 14,
      rx: 7.5 - i * 0.35,
      ry: 8.6,
      fill: i % 2 ? shade(c.hair, 0.12) : c.hair,
    })),
    { k: 'rect', x: 72, y: 160, w: 15, h: 6, rx: 3, fill: art.mustard },
    { k: 'path', d: 'M74 166 L72 182 L82 182 L84 166 Z', fill: c.hair },
  ],
  hairFront: (c) => [
    {
      k: 'path',
      d: 'M75 8 C73 -12 86 -21 100 -21 C114 -21 127 -12 125 8 C119 -4 110 -10 100 -10 C90 -10 81 -4 75 8 Z',
      fill: c.hair,
    },
    stroke('M100 -20 L100 -10', shade(c.hair, 0.35), 1.6, 0.7),
    stroke('M82 -8 Q88 -16 96 -19', tint(c.hair, 0.3), 1.5, 0.5),
    stroke('M118 -8 Q112 -16 104 -19', tint(c.hair, 0.3), 1.5, 0.5),
  ],
  earAccessory: () => [
    { k: 'circle', cx: 76, cy: 31, r: 2.3, fill: art.sand },
    { k: 'circle', cx: 124, cy: 31, r: 2.3, fill: art.sand },
  ],
  yoga: {
    top: art.mint,
    sleeve: 'short',
    pants: art.charcoal,
    shoes: art.shoe,
    clothing: (c) => [...crewNeck(c.skin, c.topShade)],
  },
};

// ───────────────────────── Hamid ─────────────────────────
export const HAMID: HumanStyle = {
  skin: art.skinHamid,
  hair: art.hairHamid,
  top: art.mustard,
  cuff: art.cC79A2B,
  sleeve: 'long',
  pants: art.c3D4651,
  shoes: art.c6B5445,
  clothing: (c) => [
    // a sturdier midsection (not an athlete, and not drawn as one)
    { k: 'ellipse', cx: 100, cy: 140, rx: 31, ry: 31, fill: c.top },
    // collared shirt under a crew-neck sweater
    { k: 'path', d: 'M84 54 L100 78 L116 54 L108 48 L100 60 L92 48 Z', fill: art.white },
    stroke('M100 78 L100 88', shade(art.white, 0.2), 1.6, 0.6),
    // ribbed hem
    { k: 'path', d: 'M73 162 Q100 175 127 162 L129 174 Q100 188 71 174 Z', fill: art.cC79A2B },
  ],
  hairFront: (c) => [
    {
      k: 'path',
      d: 'M76 5 C74 -13 85 -20 100 -20 C115 -20 126 -13 124 5 C121 -5 113 -9 100 -9 C87 -9 79 -5 76 5 Z',
      fill: c.hair,
    },
    { k: 'path', d: 'M88 -17 Q100 -26 114 -16 Q104 -20 88 -17 Z', fill: c.hair },
    stroke('M90 -13 Q100 -19 112 -12', tint(c.hair, 0.3), 1.6, 0.5),
    // a little grey at the temples
    stroke('M77 2 Q78 -6 83 -10 M123 2 Q122 -6 117 -10', art.greyTemple, 2.2, 0.8),
    // light stubble along the jaw
    {
      k: 'path',
      d: 'M78 20 C80 38 90 42 100 42 C110 42 120 38 122 20 C116 31 108 34 100 34 C92 34 84 31 78 20 Z',
      fill: c.hair,
      op: 0.22,
    },
  ],
  faceOverlay: () => [
    { k: 'circle', cx: 34, cy: 48, r: 12.5, fill: art.white, op: 0.1 },
    { k: 'circle', cx: 66, cy: 48, r: 12.5, fill: art.white, op: 0.1 },
    { k: 'circle', cx: 34, cy: 48, r: 12.5, stroke: INK, sw: 3, fill: 'none' },
    { k: 'circle', cx: 66, cy: 48, r: 12.5, stroke: INK, sw: 3, fill: 'none' },
    stroke('M46.5 46 Q50 43 53.5 46', INK, 2.6),
    stroke('M21.5 46 L13 42 M78.5 46 L87 42', INK, 2.6),
  ],
  yoga: {
    top: art.c8A948E,
    cuff: undefined,
    sleeve: 'short',
    pants: art.charcoal,
    shoes: art.shoe,
    clothing: (c) => [
      { k: 'ellipse', cx: 100, cy: 140, rx: 31, ry: 31, fill: c.top },
      ...crewNeck(c.skin, c.topShade),
    ],
  },
};

// ───────────────────────── Sierra ─────────────────────────
export const SIERRA: HumanStyle = {
  skin: art.skinSierra,
  hair: art.hairSierra,
  top: art.coral,
  sleeve: 'long',
  pants: art.c8E8470,
  shoes: art.c6B5445,
  behind: (c) => [
    // a soft cloud of curls around the head and down to the shoulders
    { k: 'path', d: 'M68 4 C66 -16 82 -24 100 -24 C118 -24 134 -16 132 4 L132 62 L68 62 Z', fill: c.hair },
    ...(
      [
        [66, 12, 12],
        [64, 32, 12],
        [66, 52, 12],
        [72, 68, 11],
        [134, 12, 12],
        [136, 32, 12],
        [134, 52, 12],
        [128, 68, 11],
      ] as [number, number, number][]
    ).map(([cx, cy, r]): Prim => ({ k: 'circle', cx, cy, r, fill: c.hair })),
  ],
  clothing: (c) => [
    // open knit cardigan over a cream top, with soft ribbing
    { k: 'path', d: 'M88 56 L100 112 L112 56 Q100 66 88 56 Z', fill: art.cEFE6D6 },
    ...[80, 86, 92, 108, 114, 120].map((x): Prim =>
      stroke(`M${x} 116 L${x} 168`, shade(c.top, 0.22), 2, 0.3)
    ),
    stroke('M88 56 L96 168', shade(c.top, 0.3), 2, 0.55),
    stroke('M112 56 L104 168', shade(c.top, 0.3), 2, 0.55),
    // small pendant
    stroke('M91 60 Q100 86 109 60', art.sand, 1.6, 0.9),
    { k: 'circle', cx: 100, cy: 84, r: 3, fill: art.sand },
  ],
  frontHair: (c) => [
    ...(
      [
        [79, 54, 9],
        [77, 68, 8],
        [121, 54, 9],
        [123, 68, 8],
      ] as [number, number, number][]
    ).map(([cx, cy, r]): Prim => ({ k: 'circle', cx, cy, r, fill: c.hair })),
  ],
  hairFront: (c) => [
    {
      k: 'path',
      d: 'M76 8 C74 -12 86 -19 100 -19 C114 -19 126 -12 124 8 C121 -3 113 -8 100 -8 C87 -8 79 -3 76 8 Z',
      fill: c.hair,
    },
    ...(
      [
        [78, -4, 8],
        [83, -14, 9],
        [93, -21, 9.5],
        [107, -21, 9.5],
        [117, -14, 9],
        [122, -4, 8],
      ] as [number, number, number][]
    ).map(([cx, cy, r]): Prim => ({ k: 'circle', cx, cy, r, fill: c.hair })),
    stroke('M92 -19 Q97 -24 104 -21', tint(c.hair, 0.3), 1.6, 0.55),
  ],
  earAccessory: () => [
    { k: 'circle', cx: 75.5, cy: 37, r: 5.2, stroke: art.sand, sw: 1.7, fill: 'none' },
    { k: 'circle', cx: 124.5, cy: 37, r: 5.2, stroke: art.sand, sw: 1.7, fill: 'none' },
  ],
  yoga: {
    top: art.sand,
    sleeve: 'long',
    pants: art.charcoal,
    shoes: art.shoe,
    clothing: (c) => [...crewNeck(c.skin, c.topShade)],
  },
};

export const HUMAN_STYLES = { hina: HINA, arfa: ARFA, hamid: HAMID, sierra: SIERRA } as const;
