#!/usr/bin/env python3
"""
Synthesises the onboarding / session sound loops (original, royalty-free): rain, forest, soft piano, calm music.
Run: python3 scripts/make-sounds.py   → writes assets/audio/*.wav (then compressed to mp3 if sox can).
Replace these with recorded or licensed audio before release (docs/PLAN.md, FN-06).
"""
import os
import subprocess
import wave

import numpy as np
from scipy import signal

SR = 22050
rng = np.random.default_rng(7)
OUT = os.path.join(os.path.dirname(__file__), '..', 'assets', 'audio')
os.makedirs(OUT, exist_ok=True)


def band(x, lo, hi):
    sos = signal.butter(4, [lo, hi], btype='band', fs=SR, output='sos')
    return signal.sosfilt(sos, x)


def low(x, hz):
    return signal.sosfilt(signal.butter(4, hz, btype='low', fs=SR, output='sos'), x)


def high(x, hz):
    return signal.sosfilt(signal.butter(4, hz, btype='high', fs=SR, output='sos'), x)


def noise(n):
    return rng.standard_normal(n)


def reverb(x, seconds=1.8, wet=0.3):
    n = int(seconds * SR)
    ir = noise(n) * np.exp(-np.arange(n) / (seconds * SR / 5))
    ir = low(ir, 3500)
    wetsig = signal.fftconvolve(x, ir)[: len(x)]
    wetsig /= max(1e-9, np.max(np.abs(wetsig)))
    return (1 - wet) * x + wet * wetsig * np.max(np.abs(x))


def loopable(x, fade=1.5):
    """Cross-fade the tail into the head so the loop has no seam."""
    n = int(fade * SR)
    body = x[:-n].copy()
    t = np.linspace(0, 1, n)
    body[:n] = body[:n] * t + x[-n:] * (1 - t)
    return body


def norm(x, peak=0.6):
    return x / max(1e-9, np.max(np.abs(x))) * peak


def save(name, x):
    pcm = (np.clip(x, -1, 1) * 32767).astype(np.int16)
    path = os.path.join(OUT, name + '.wav')
    with wave.open(path, 'wb') as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())
    mp3 = os.path.join(OUT, name + '.mp3')
    try:
        subprocess.run(['sox', path, '-C', '64', mp3], check=True, capture_output=True)
        os.remove(path)
        print('wrote', mp3, os.path.getsize(mp3) // 1024, 'KB')
    except Exception:
        print('wrote', path, os.path.getsize(path) // 1024, 'KB (wav)')


def rain(dur=14):
    n = int(dur * SR)
    t = np.arange(n) / SR
    bed = band(noise(n), 700, 9000) * (0.85 + 0.15 * np.sin(2 * np.pi * 0.13 * t))
    rumble = low(noise(n), 260) * 0.35
    drops = np.zeros(n)
    for i in rng.integers(0, n - 400, int(dur * 55)):
        k = int(rng.uniform(80, 220))
        drops[i : i + k] += rng.uniform(0.2, 0.8) * np.exp(-np.arange(k) / (k / 6)) * rng.standard_normal(k)
    drops = band(drops, 2200, 7500)
    return loopable(norm(bed * 0.8 + rumble + drops * 0.9, 0.55))


def chirp_note(f0, f1, dur):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = np.linspace(f0, f1, n) + 90 * np.sin(2 * np.pi * 28 * t)
    ph = 2 * np.pi * np.cumsum(f) / SR
    env = np.sin(np.pi * np.arange(n) / n) ** 2
    return (np.sin(ph) + 0.3 * np.sin(2 * ph)) * env


def forest(dur=18):
    n = int(dur * SR)
    t = np.arange(n) / SR
    wind = low(noise(n), 420) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.07 * t + 1)) * 0.5
    gust = np.clip(low(noise(n), 0.6) * 12, 0, 1)
    leaves = band(noise(n), 2500, 6500) * gust * 0.16
    birds = np.zeros(n)
    for start in np.sort(rng.uniform(0.8, dur - 2.5, 9)):
        base = rng.uniform(2300, 4300)
        pos = int(start * SR)
        for k in range(rng.integers(2, 5)):
            note = chirp_note(base * rng.uniform(0.9, 1.15), base * rng.uniform(1.1, 1.5), rng.uniform(0.07, 0.16))
            end = min(n, pos + len(note))
            birds[pos:end] += note[: end - pos] * rng.uniform(0.18, 0.3)
            pos += len(note) + int(rng.uniform(0.04, 0.12) * SR)
    mix = reverb(wind + leaves + birds, 1.4, 0.25)
    return loopable(norm(mix, 0.5), 2.0)


def piano_note(freq, dur=4.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    out = np.zeros(n)
    for h in range(1, 7):
        decay = 1.6 / (h**0.6)
        out += (1 / h**1.15) * np.sin(2 * np.pi * freq * h * (1 + 0.0004 * h * h) * t) * np.exp(-t / decay)
    out *= np.minimum(1, t / 0.006)
    return out


def piano(dur=24):
    n = int(dur * SR)
    out = np.zeros(n)
    scale = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33]  # C major pentatonic
    pos = 0.4
    while pos < dur - 4:
        f = scale[rng.integers(0, len(scale))]
        note = piano_note(f)
        i = int(pos * SR)
        end = min(n, i + len(note))
        out[i:end] += note[: end - i] * rng.uniform(0.6, 1.0)
        if rng.random() < 0.3:
            f2 = scale[rng.integers(0, len(scale))] / 2
            note2 = piano_note(f2)
            end2 = min(n, i + len(note2))
            out[i:end2] += note2[: end2 - i] * 0.5
        pos += rng.uniform(1.6, 3.4)
    out = low(out, 4200)
    return loopable(norm(reverb(out, 2.2, 0.4), 0.55), 3.0)


def pad_chord(freqs, dur):
    n = int(dur * SR)
    t = np.arange(n) / SR
    out = np.zeros(n)
    for f in freqs:
        for det in (-0.004, 0.0, 0.004):
            out += np.sin(2 * np.pi * f * (1 + det) * t) + 0.35 * np.sin(2 * np.pi * 2 * f * (1 + det) * t)
    env = np.minimum(np.minimum(t / 1.8, 1), np.minimum((dur - t) / 1.8, 1))
    return out * env


def music(dur=28):
    chords = [
        [130.81, 196.0, 329.63, 493.88, 587.33],  # Cmaj9
        [110.0, 164.81, 261.63, 392.0, 493.88],  # Am9
        [87.31, 130.81, 329.63, 440.0, 523.25],  # Fmaj7
        [98.0, 146.83, 329.63, 493.88, 587.33],  # G6
    ]
    n = int(dur * SR)
    out = np.zeros(n)
    each = dur / len(chords)
    for i, c in enumerate(chords):
        seg = pad_chord(c, each + 3.5)
        s = int(i * each * SR)
        e = min(n, s + len(seg))
        out[s:e] += seg[: e - s]
    t = np.arange(n) / SR
    out *= 0.85 + 0.15 * np.sin(2 * np.pi * 0.18 * t)
    out = low(out, 2400)
    return loopable(norm(reverb(out, 2.4, 0.35), 0.5), 3.5)


for name, fn in [('rain', rain), ('forest', forest), ('piano', piano), ('music', music)]:
    save(name, fn())
