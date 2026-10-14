const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));

function parse(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}
const toHex = (r: number, g: number, b: number) =>
  '#' + [r, g, b].map((v) => clamp(v).toString(16).padStart(2, '0')).join('');

/** Mix towards black by `amt` (0–1). */
export function shade(hex: string, amt: number) {
  const [r, g, b] = parse(hex);
  return toHex(r * (1 - amt), g * (1 - amt), b * (1 - amt));
}
/** Mix towards white by `amt` (0–1). */
export function tint(hex: string, amt: number) {
  const [r, g, b] = parse(hex);
  return toHex(r + (255 - r) * amt, g + (255 - g) * amt, b + (255 - b) * amt);
}
/** Mix two colours. */
export function mix(a: string, b: string, t: number) {
  const [r1, g1, b1] = parse(a);
  const [r2, g2, b2] = parse(b);
  return toHex(r1 + (r2 - r1) * t, g1 + (g2 - g1) * t, b1 + (b2 - b1) * t);
}
