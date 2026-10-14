import { shade, tint } from './color';
import type { HumanStyle } from './human';
import type { Prim } from './types';

/**
 * The four humans. Each = the shared body + ONE signature colour + ONE accessory that never changes:
 *   Zara – teal top · high bun · small leaf earring
 *   Ali  – mustard hoodie · round glasses
 *   Hina – lavender scarf / dupatta
 *   Omar – coral t-shirt · headphones around neck
 */
export const INK = '#24302A';
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

// ───────────────────────── Zara ─────────────────────────
export const ZARA: HumanStyle = {
  skin: '#E8B48F',
  hair: '#3B2A22',
  top: '#2FA4A0',
  sleeve: 'long',
  pants: '#38423E',
  shoes: '#F1ECE2',
  clothing: (c) => [
    ...crewNeck(c.skin, c.topShade),
    stroke('M78 112 Q86 124 82 142', c.topShade, 2, 0.3),
    stroke('M122 112 Q114 124 118 142', c.topShade, 2, 0.3),
  ],
  hairFront: (c) => [
    // high bun with a coral hair tie
    { k: 'ellipse', cx: 100, cy: -29, rx: 12.5, ry: 10.5, fill: c.hair },
    stroke('M89 -25 Q100 -19 111 -25', '#E98A6B', 3),
    stroke('M93 -34 Q100 -37 107 -33', tint(c.hair, 0.35), 2, 0.7),
    // hair swept back from a soft side parting
    {
      k: 'path',
      d: 'M76 6 C74 -12 86 -20 100 -20 C114 -20 126 -12 124 6 C120 -3 112 -8 104 -9 C98 -4 86 -4 76 6 Z',
      fill: c.hair,
    },
    stroke('M84 -6 Q92 -17 98 -23', tint(c.hair, 0.3), 1.6, 0.55),
    stroke('M110 -9 Q108 -17 103 -23', tint(c.hair, 0.3), 1.6, 0.55),
  ],
  earAccessory: () => [
    stroke('M76 24 L75.5 30', '#6E9C7F', 1.6),
    { k: 'path', d: 'M75.5 29 C68.5 31 68.5 40 74 43.5 C80 40 80 33 75.5 29 Z', fill: '#6E9C7F' },
    stroke('M75 31 L74.2 41', '#DCEBDF', 1.2, 0.9),
  ],
};

// ───────────────────────── Ali ─────────────────────────
export const ALI: HumanStyle = {
  skin: '#C98F68',
  hair: '#2B2420',
  top: '#E2B13C',
  cuff: '#C79A2B',
  sleeve: 'long',
  pants: '#3F5575',
  shoes: '#2F2A27',
  clothing: (c) => [
    // hood resting on the shoulders, with a dark opening
    { k: 'path', d: 'M76 60 Q100 84 124 60 Q116 47 100 47 Q84 47 76 60 Z', fill: shade(c.top, 0.18) },
    { k: 'path', d: 'M86 58 Q100 71 114 58 Q100 53 86 58 Z', fill: shade(c.top, 0.5) },
    // drawstrings
    stroke('M94 70 L92.5 98 M106 70 L107.5 98', '#FAF6EE', 2.4),
    { k: 'circle', cx: 92.5, cy: 100, r: 2.8, fill: '#FAF6EE' },
    { k: 'circle', cx: 107.5, cy: 100, r: 2.8, fill: '#FAF6EE' },
    // kangaroo pocket
    { k: 'path', d: 'M78 136 L122 136 L129 170 L71 170 Z', fill: shade(c.top, 0.1), op: 0.8 },
    stroke('M78 136 L71 170 M122 136 L129 170', shade(c.top, 0.3), 1.6, 0.5),
  ],
  hairFront: (c) => [
    {
      k: 'path',
      d: 'M76 5 C74 -13 85 -20 100 -20 C115 -20 126 -13 124 5 C121 -5 113 -9 100 -9 C87 -9 79 -5 76 5 Z',
      fill: c.hair,
    },
    { k: 'path', d: 'M88 -17 Q100 -26 114 -16 Q104 -20 88 -17 Z', fill: c.hair },
    stroke('M90 -13 Q100 -19 112 -12', tint(c.hair, 0.3), 1.6, 0.5),
    // light stubble along the jaw
    {
      k: 'path',
      d: 'M78 20 C80 38 90 42 100 42 C110 42 120 38 122 20 C116 31 108 34 100 34 C92 34 84 31 78 20 Z',
      fill: c.hair,
      op: 0.2,
    },
  ],
  faceOverlay: () => [
    { k: 'circle', cx: 34, cy: 48, r: 12.5, fill: '#FFFFFF', op: 0.1 },
    { k: 'circle', cx: 66, cy: 48, r: 12.5, fill: '#FFFFFF', op: 0.1 },
    { k: 'circle', cx: 34, cy: 48, r: 12.5, stroke: INK, sw: 3, fill: 'none' },
    { k: 'circle', cx: 66, cy: 48, r: 12.5, stroke: INK, sw: 3, fill: 'none' },
    stroke('M46.5 46 Q50 43 53.5 46', INK, 2.6),
    stroke('M21.5 46 L13 42 M78.5 46 L87 42', INK, 2.6),
  ],
};

// ───────────────────────── Hina ─────────────────────────
export const HINA: HumanStyle = {
  skin: '#D9A27B',
  hair: '#2F2420',
  top: '#EFE6D6',
  sleeve: 'long',
  pants: '#8E8470',
  shoes: '#6B5445',
  behind: (c) => [
    // long hair falling behind the shoulders
    {
      k: 'path',
      d: 'M72 6 C68 -14 82 -22 100 -22 C118 -22 132 -14 128 6 C133 32 135 62 131 96 C129 108 120 112 112 106 L88 106 C80 112 71 108 69 96 C65 62 67 32 72 6 Z',
      fill: c.hair,
    },
  ],
  clothing: (c) => [
    ...crewNeck(c.skin, c.topShade),
    // lavender dupatta: wrapped round the neck, one long drape over the shoulder
    { k: 'path', d: 'M69 60 Q100 84 131 60 L135 76 Q100 100 65 76 Z', fill: '#B9AEE0' },
    { k: 'path', d: 'M69 62 Q50 108 55 182 L80 188 Q74 122 94 86 Z', fill: '#B9AEE0' },
    { k: 'path', d: 'M69 62 Q50 108 55 182 L62 183 Q58 112 74 70 Z', fill: shade('#B9AEE0', 0.12), op: 0.7 },
    stroke('M62 96 Q58 136 64 176', '#E4DEF6', 3, 0.85),
    stroke('M66 76 Q100 100 134 76', '#E4DEF6', 2, 0.7),
  ],
  frontHair: (c) => [
    { k: 'path', d: 'M79 28 C72 52 71 80 77 102 C81 107 88 103 88 96 C84 78 86 54 88 34 Z', fill: c.hair },
    {
      k: 'path',
      d: 'M121 28 C128 52 129 80 123 102 C119 107 112 103 112 96 C116 78 114 54 112 34 Z',
      fill: c.hair,
    },
  ],
  hairFront: (c) => [
    {
      k: 'path',
      d: 'M75 8 C73 -12 86 -21 100 -21 C114 -21 127 -12 125 8 C120 -5 111 -11 100 -11 C89 -11 80 -5 75 8 Z',
      fill: c.hair,
    },
    stroke('M100 -20 L100 -10', shade(c.hair, 0.35), 1.6, 0.7),
    stroke('M86 -9 Q92 -16 98 -19', tint(c.hair, 0.3), 1.5, 0.5),
  ],
};

// ───────────────────────── Omar ─────────────────────────
export const OMAR: HumanStyle = {
  skin: '#F0C3A0',
  hair: '#4A3226',
  top: '#E98A6B',
  sleeve: 'short',
  pants: '#3D4651',
  shoes: '#F1ECE2',
  clothing: (c) => [
    ...crewNeck(c.skin, c.topShade),
    // headphones resting around the neck: band behind the head, ear cups on the chest
    stroke('M86 104 Q78 74 91 57 M114 104 Q122 74 109 57', '#2F3A35', 4.5),
    { k: 'rect', x: 74, y: 98, w: 20, h: 28, rx: 9, fill: '#2F3A35' },
    { k: 'rect', x: 106, y: 98, w: 20, h: 28, rx: 9, fill: '#2F3A35' },
    { k: 'rect', x: 78, y: 103, w: 12, h: 18, rx: 6, fill: '#4D5C54' },
    { k: 'rect', x: 110, y: 103, w: 12, h: 18, rx: 6, fill: '#4D5C54' },
    { k: 'circle', cx: 84, cy: 112, r: 2.6, fill: '#E98A6B' },
    { k: 'circle', cx: 116, cy: 112, r: 2.6, fill: '#E98A6B' },
  ],
  hairFront: (c) => [
    {
      k: 'path',
      d: 'M76 6 C74 -12 86 -19 100 -19 C114 -19 126 -12 124 6 C121 -4 113 -8 100 -8 C87 -8 79 -4 76 6 Z',
      fill: c.hair,
    },
    // soft curls
    ...(
      [
        [79, -6, 7],
        [85, -15, 8],
        [95, -21, 8.5],
        [106, -21, 8.5],
        [116, -15, 8],
        [121, -6, 7],
      ] as [number, number, number][]
    ).map(([cx, cy, r]): Prim => ({ k: 'circle', cx, cy, r, fill: c.hair })),
    stroke('M92 -18 Q96 -22 102 -20', tint(c.hair, 0.3), 1.6, 0.55),
  ],
};

export const HUMAN_STYLES = { zara: ZARA, ali: ALI, hina: HINA, omar: OMAR } as const;
