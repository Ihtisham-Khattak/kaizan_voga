import { shade, tint } from './color';
import type { Prim, Pt } from './types';

/**
 * Semi-realistic editorial human figure (≈5 heads tall), drawn as plain data.
 * Canvas: viewBox "30 -60 140 340". Hips sit at y=170 (used to seat characters on the bench).
 * Same body for everyone; each character adds ONE signature colour + ONE accessory via HumanStyle.
 */
export const CANVAS = { x: 30, y: -60, w: 140, h: 340 };
export const HUMAN_VIEWBOX = `${CANVAS.x} ${CANVAS.y} ${CANVAS.w} ${CANVAS.h}`;
export const HUMAN_ASPECT = CANVAS.w / CANVAS.h;
export const HIP_Y = 170;
/** Head + shoulders crop used by avatars. */
export const BUST_VIEWBOX = '48 -60 104 140';

/** The head (+ hair, face, accessories) is drawn 18% larger around the chin: still adult proportions, but expressions stay readable at small sizes. */
export const HEAD_TRANSFORM = 'translate(100 41) scale(1.18) translate(-100 -41)';

/** Face is drawn in a 0–100 box, mapped onto the head with this transform (inside HEAD_TRANSFORM). */
export const FACE_TRANSFORM = 'translate(74 -8) scale(0.52)';

export type HumanPose = 'stand' | 'sit' | 'wave' | 'yoga';

export interface Ctx {
  skin: string;
  skinShade: string;
  top: string;
  topShade: string;
  hair: string;
}

export interface HumanStyle {
  skin: string;
  hair: string;
  top: string;
  sleeve: 'long' | 'short';
  /** Ribbed cuff colour at the wrists (hoodie). */
  cuff?: string;
  pants: string;
  shoes: string;
  /** Behind everything (long hair back, headphone band). */
  behind?: (c: Ctx) => Prim[];
  /** On the torso, before arms: collar, hood, scarf, headphone cups. */
  clothing?: (c: Ctx) => Prim[];
  /** Hair that falls IN FRONT of the shoulders (drawn after the torso, before arms). */
  frontHair?: (c: Ctx) => Prim[];
  /** Hair on the head, drawn before the face. */
  hairFront?: (c: Ctx) => Prim[];
  /** Face space (0–100): glasses etc. */
  faceOverlay?: (c: Ctx) => Prim[];
  /** On the head after hair: earrings. */
  earAccessory?: (c: Ctx) => Prim[];
}

interface Rig {
  armL: Pt[];
  armR: Pt[];
  legL: Pt[];
  legR: Pt[];
}

const standLegs = {
  legL: [
    [86, 168],
    [85, 218],
    [85, 258],
  ] as Pt[],
  legR: [
    [114, 168],
    [115, 218],
    [115, 258],
  ] as Pt[],
};
const armsDown = {
  armL: [
    [72, 66],
    [61, 112],
    [62, 150],
  ] as Pt[],
  armR: [
    [128, 66],
    [139, 112],
    [138, 150],
  ] as Pt[],
};

export const RIGS: Record<HumanPose, Rig> = {
  stand: { ...armsDown, ...standLegs },
  wave: {
    armL: armsDown.armL,
    armR: [
      [128, 66],
      [152, 92],
      [158, 46],
    ],
    ...standLegs,
  },
  // Seated, front view: thighs foreshortened (knees just below the hips), shins hanging, hands resting in the lap.
  sit: {
    armL: [
      [72, 66],
      [58, 108],
      [84, 156],
    ],
    armR: [
      [128, 66],
      [142, 108],
      [116, 156],
    ],
    legL: [
      [86, 168],
      [79, 196],
      [84, 246],
    ],
    legR: [
      [114, 168],
      [121, 196],
      [116, 246],
    ],
  },
  yoga: {
    armL: [
      [72, 66],
      [64, 108],
      [96, 106],
    ],
    armR: [
      [128, 66],
      [136, 108],
      [104, 106],
    ],
    legL: standLegs.legL,
    legR: [
      [114, 168],
      [146, 196],
      [102, 226],
    ],
  },
};

/** Waving arm (right): animated in the app between these two frames. */
export const WAVE = { shoulder: [128, 66] as Pt, elbow: [152, 92] as Pt, hand: [158, 46] as Pt };
export const ARM_W = { upper: 17, lower: 14, shortUpper: 18 };

const line = (a: Pt, b: Pt) => `M${a[0]} ${a[1]} L${b[0]} ${b[1]}`;
const lerp = (a: Pt, b: Pt, t: number): Pt => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const stroke = (
  d: string,
  color: string,
  sw: number,
  extra: Partial<Extract<Prim, { k: 'path' }>> = {}
): Prim => ({
  k: 'path',
  d,
  stroke: color,
  sw,
  cap: 'round',
  join: 'round',
  ...extra,
});

export function ctxOf(s: HumanStyle): Ctx {
  return {
    skin: s.skin,
    skinShade: shade(s.skin, 0.14),
    top: s.top,
    topShade: shade(s.top, 0.16),
    hair: s.hair,
  };
}

/** Hand: a soft oval continuing the forearm (no fingers). */
export function hand(wrist: Pt, towards: Pt, skin: string): Prim {
  const dx = wrist[0] - towards[0];
  const dy = wrist[1] - towards[1];
  const len = Math.hypot(dx, dy) || 1;
  const c: Pt = [wrist[0] + (dx / len) * 7, wrist[1] + (dy / len) * 7];
  return {
    k: 'ellipse',
    cx: c[0],
    cy: c[1],
    rx: 6.6,
    ry: 8.6,
    fill: skin,
    rot: (Math.atan2(dy, dx) * 180) / Math.PI - 90,
  };
}

export function arm(pts: Pt[], s: HumanStyle, c: Ctx): Prim[] {
  const [sh, el, wr] = pts;
  const out: Prim[] = [];
  if (s.sleeve === 'short') {
    const cut = lerp(sh, el, 0.62);
    out.push(stroke(line(sh, el), c.skin, ARM_W.upper - 2));
    out.push(stroke(line(el, wr), c.skin, ARM_W.lower - 1));
    out.push(stroke(line(sh, cut), s.top, ARM_W.shortUpper));
  } else {
    out.push(stroke(line(sh, el), s.top, ARM_W.upper));
    out.push(stroke(line(el, wr), s.top, ARM_W.lower));
    // soft shading on the underside of the forearm
    out.push(stroke(line(lerp(el, wr, 0.1), wr), c.topShade, 4, { op: 0.25 }));
    if (s.cuff) out.push(stroke(line(lerp(el, wr, 0.82), wr), s.cuff, ARM_W.lower + 1, { cap: 'butt' }));
  }
  out.push(hand(wr, el, c.skin));
  return out;
}

export function leg(pts: Pt[], s: HumanStyle): Prim[] {
  const [hip, knee, ankle] = pts;
  const pantsShade = shade(s.pants, 0.18);
  return [
    stroke(line(hip, knee), s.pants, 27),
    stroke(line(knee, ankle), s.pants, 19),
    // inner-leg shading
    stroke(line(lerp(hip, knee, 0.2), lerp(knee, ankle, 0.9)), pantsShade, 5, { op: 0.35 }),
    // shoe: soft rounded sneaker with a pale sole
    { k: 'rect', x: ankle[0] - 15, y: ankle[1] - 1, w: 30, h: 14, rx: 7, fill: s.shoes },
    { k: 'rect', x: ankle[0] - 15, y: ankle[1] + 10, w: 30, h: 5, rx: 2.5, fill: '#CFC7B6' },
  ];
}

export function torso(s: HumanStyle, c: Ctx): Prim[] {
  const d =
    'M70 62 C76 55 90 53 100 56 C110 53 124 55 130 62 C136 70 134 96 130 118 C128 136 129 156 131 174 L69 174 C71 156 72 136 70 118 C66 96 64 70 70 62 Z';
  return [
    { k: 'path', d, fill: s.top },
    // gentle form shading on the far side + soft highlight on the near shoulder
    {
      k: 'path',
      d: 'M116 58 C124 55 128 58 130 62 C136 70 134 96 130 118 C128 136 129 156 131 174 L112 174 C117 150 117 100 116 58 Z',
      fill: c.topShade,
      op: 0.28,
    },
    {
      k: 'path',
      d: 'M72 64 C78 58 86 56 92 57 C84 62 78 72 76 86 C72 78 70 70 72 64 Z',
      fill: tint(s.top, 0.3),
      op: 0.22,
    },
    // waistline fold
    stroke('M74 150 Q100 158 126 150', c.topShade, 2, { op: 0.3 }),
  ];
}

export function neck(c: Ctx): Prim[] {
  return [
    { k: 'path', d: 'M90 34 L90 54 Q100 62 110 54 L110 34 Z', fill: c.skin },
    { k: 'path', d: 'M90 38 Q100 51 110 38 L110 48 Q100 58 90 48 Z', fill: c.skinShade, op: 0.55 },
  ];
}

export function head(c: Ctx): Prim[] {
  return [
    { k: 'ellipse', cx: 76, cy: 16, rx: 4, ry: 6.5, fill: c.skin },
    { k: 'ellipse', cx: 124, cy: 16, rx: 4, ry: 6.5, fill: c.skin },
    { k: 'ellipse', cx: 76.5, cy: 16, rx: 1.8, ry: 3.4, fill: c.skinShade, op: 0.6 },
    { k: 'ellipse', cx: 123.5, cy: 16, rx: 1.8, ry: 3.4, fill: c.skinShade, op: 0.6 },
    {
      k: 'path',
      d: 'M76 8 C76 -10 88 -16 100 -16 C112 -16 124 -10 124 8 C124 24 114 40 100 41 C86 40 76 24 76 8 Z',
      fill: c.skin,
    },
    // soft jaw shadow
    {
      k: 'path',
      d: 'M80 24 C84 36 92 40 100 40 C108 40 116 36 120 24 C114 34 108 36 100 36 C92 36 86 34 80 24 Z',
      fill: c.skinShade,
      op: 0.35,
    },
  ];
}

export interface Layers {
  behind: Prim[];
  legs: Prim[];
  torso: Prim[];
  neck: Prim[];
  clothing: Prim[];
  frontHair: Prim[];
  armL: Prim[];
  armR: Prim[];
  head: Prim[];
  hairFront: Prim[];
  faceOverlay: Prim[];
  earAccessory: Prim[];
}

/** Everything except the animated face (and the waving right arm when animated – see Human). */
export function buildHuman(s: HumanStyle, pose: HumanPose): Layers {
  const rig = RIGS[pose];
  const c = ctxOf(s);
  const footY = Math.max(rig.legL[2][1], rig.legR[2][1]) + 16;
  return {
    behind: s.behind?.(c) ?? [],
    legs: [
      // soft contact shadow so the figure stands on the ground
      { k: 'ellipse', cx: 100, cy: footY, rx: 44, ry: 5, fill: '#000000', op: 0.12 } as Prim,
      ...leg(rig.legL, s),
      ...leg(rig.legR, s),
    ],
    torso: torso(s, c),
    neck: neck(c),
    clothing: s.clothing?.(c) ?? [],
    frontHair: s.frontHair?.(c) ?? [],
    armL: arm(rig.armL, s, c),
    armR: arm(rig.armR, s, c),
    head: head(c),
    hairFront: s.hairFront?.(c) ?? [],
    faceOverlay: s.faceOverlay?.(c) ?? [],
    earAccessory: s.earAccessory?.(c) ?? [],
  };
}
