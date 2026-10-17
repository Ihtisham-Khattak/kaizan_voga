#!/usr/bin/env python3
"""
Rebuilds the Kaizen logo as clean vectors with a transparent background, then makes every icon from it.

  python3 -m venv /tmp/brand-venv && /tmp/brand-venv/bin/pip install potracer pillow numpy
  /tmp/brand-venv/bin/python scripts/make-brand.py

Input : assets/brand/source/kaizen-logo-original.jpg  (the supplied artwork, kept untouched)
Output: assets/brand/*.svg + *.png (logo, mark, light variant) and the app icons in assets/images/
The artwork is flat one-colour, so tracing it gives a sharp result at any size (no background, no JPEG noise).
"""
import os

import numpy as np
import potrace
from PIL import Image, ImageFilter

ROOT = os.path.join(os.path.dirname(__file__), '..')
SRC = os.path.join(ROOT, 'assets', 'brand', 'source', 'kaizen-logo-original.jpg')
BRAND = os.path.join(ROOT, 'assets', 'brand')
IMAGES = os.path.join(ROOT, 'assets', 'images')

INK = (0x17, 0x43, 0x1E)  # the logo's own green
LIGHT = (0xE8, 0xF2, 0xEC)  # for dark backgrounds (the Night `forest` token value)
MINT = (0xE6, 0xF4, 0xEA)  # launcher background (the `mint` token value)
EMBLEM_ROWS = (148, 462)
WORD_ROWS = (498, 555)
UP = 4  # trace at 4x for smooth curves

img = Image.open(SRC).convert('L')
lum = np.asarray(img).astype(float)
bg, ink_l = 232.0, 95.0  # anything darker than ink_l is solid ink, so JPEG noise inside strokes disappears
alpha = np.clip((bg - lum) / (bg - ink_l), 0, 1)  # soft anti-aliased edge: 0 = background, 1 = ink
alpha = alpha * alpha * (3 - 2 * alpha)  # smoothstep: crisper edge, no halo


def region(y0, y1, pad=6):
    sub = alpha[max(0, y0 - pad): y1 + pad + 1]
    xs = np.where(sub.max(axis=0) > 0.5)[0]
    return sub, xs.min() - pad, xs.max() + pad


def trace(sub, x0, x1):
    crop = sub[:, x0: x1 + 1]
    im = Image.fromarray((crop * 255).astype(np.uint8)).resize(
        (crop.shape[1] * UP, crop.shape[0] * UP), Image.LANCZOS
    ).filter(ImageFilter.GaussianBlur(1.2))
    mask = np.asarray(im) > 127
    bm = potrace.Bitmap(~mask)  # potracer traces the False area, so invert to trace the ink
    pl = bm.trace(turdsize=20, alphamax=1.1, opticurve=True, opttolerance=0.3)
    f = lambda p: f'{p.x / UP:.2f} {p.y / UP:.2f}'
    d = []
    for c in pl:
        d.append(f'M{f(c.start_point)}')
        for s in c.segments:
            if s.is_corner:
                d.append(f'L{f(s.c)}L{f(s.end_point)}')
            else:
                d.append(f'C{f(s.c1)} {f(s.c2)} {f(s.end_point)}')
        d.append('Z')
    return ''.join(d), crop.shape[1], crop.shape[0]


e_sub, ex0, ex1 = region(*EMBLEM_ROWS)
w_sub, wx0, wx1 = region(*WORD_ROWS)
e_d, e_w, e_h = trace(e_sub, ex0, ex1)
w_d, w_w, w_h = trace(w_sub, wx0, wx1)

# lock-up: emblem centred above the wordmark, same scale as the original artwork
gap = 36
W = max(e_w, w_w)
H = e_h + gap + w_h
ex = (W - e_w) / 2
wx = (W - w_w) / 2
hexs = lambda c: '#%02x%02x%02x' % c


def svg(paths, w, h, colour):
    body = ''.join(f'<path transform="translate({tx:.2f} {ty:.2f})" d="{d}"/>' for d, tx, ty in paths)
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w:.0f} {h:.0f}" width="{w:.0f}" height="{h:.0f}" '
        f'fill="{hexs(colour)}" fill-rule="evenodd">{body}</svg>\n'
    )


lock = [(e_d, ex, 0), (w_d, wx, e_h + gap)]
files = {
    'kaizen-logo.svg': svg(lock, W, H, INK),
    'kaizen-logo-light.svg': svg(lock, W, H, LIGHT),
    'kaizen-mark.svg': svg([(e_d, 0, 0)], e_w, e_h, INK),
    'kaizen-mark-light.svg': svg([(e_d, 0, 0)], e_w, e_h, LIGHT),
}
for name, s in files.items():
    open(os.path.join(BRAND, name), 'w').write(s)
# the path data, for the in-app component (src/components/brand-logo.tsx)
open(os.path.join(BRAND, 'mark-path.txt'), 'w').write(f'{e_w} {e_h}\n{e_d}\n')


def render(paths, w, h, colour, scale):
    """Rasterise by drawing the traced mask again at high resolution (transparent background)."""
    out = Image.new('RGBA', (int(w * scale), int(h * scale)), (0, 0, 0, 0))
    fill = Image.new('RGBA', out.size, colour + (255,))
    for sub, x0, x1, tx, ty in paths:
        crop = sub[:, x0: x1 + 1]
        m = Image.fromarray((crop * 255).astype(np.uint8)).resize(
            (int(crop.shape[1] * scale), int(crop.shape[0] * scale)), Image.LANCZOS
        )
        layer = Image.new('L', out.size, 0)
        layer.paste(m, (int(tx * scale), int(ty * scale)))
        out.paste(fill, (0, 0), layer)
    return out


E = (e_sub, ex0, ex1)
Wd = (w_sub, wx0, wx1)
logo_png = render([E + (ex, 0), Wd + (wx, e_h + gap)], W, H, INK, 3)
logo_png.save(os.path.join(BRAND, 'kaizen-logo.png'))
render([E + (ex, 0), Wd + (wx, e_h + gap)], W, H, LIGHT, 3).save(os.path.join(BRAND, 'kaizen-logo-light.png'))
mark_png = render([E + (0, 0)], e_w, e_h, INK, 5)
mark_png.save(os.path.join(BRAND, 'kaizen-mark.png'))
mark_light = render([E + (0, 0)], e_w, e_h, LIGHT, 5)
mark_light.save(os.path.join(BRAND, 'kaizen-mark-light.png'))


def fit(mark, canvas, frac, bgcolour=None):
    """Centre `mark` on a square canvas so it fills `frac` of the width/height."""
    c = Image.new('RGBA', (canvas, canvas), (bgcolour + (255,)) if bgcolour else (0, 0, 0, 0))
    s = canvas * frac / max(mark.size)
    m = mark.resize((int(mark.width * s), int(mark.height * s)), Image.LANCZOS)
    c.alpha_composite(m, ((canvas - m.width) // 2, (canvas - m.height) // 2))
    return c


# launcher / store icon: flat on mint (no transparency: required by iOS), mark ~62% of the width
fit(mark_png, 1024, 0.74, MINT).convert('RGB').save(os.path.join(IMAGES, 'icon.png'))
# Android adaptive icon: foreground stays inside the safe zone (~58%), background is plain mint
fit(mark_png, 1024, 0.64).save(os.path.join(IMAGES, 'android-icon-foreground.png'))
Image.new('RGB', (1024, 1024), MINT).save(os.path.join(IMAGES, 'android-icon-background.png'))
# Android 13 themed icon: the shape only (the system colours it)
mono = Image.new('RGBA', mark_png.size, (0, 0, 0, 0))
mono.paste(Image.new('RGBA', mark_png.size, (0, 0, 0, 255)), (0, 0), mark_png.split()[3])
fit(mono, 1024, 0.64).save(os.path.join(IMAGES, 'android-icon-monochrome.png'))
# splash: mark only, transparent (light and dark variants)
fit(mark_png, 1024, 0.9).save(os.path.join(IMAGES, 'splash-icon.png'))
fit(mark_light, 1024, 0.9).save(os.path.join(IMAGES, 'splash-icon-dark.png'))
# web favicon
fit(mark_png, 256, 0.78, MINT).convert('RGB').resize((48, 48), Image.LANCZOS).save(os.path.join(IMAGES, 'favicon.png'))
print('emblem', e_w, 'x', e_h, '| wordmark', w_w, 'x', w_h, '| lock-up', W, 'x', H)
