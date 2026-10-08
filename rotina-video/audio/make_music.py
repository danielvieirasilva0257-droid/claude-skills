"""Original soundtrack for the Rotina video (120 BPM, 60 s), synthesized with numpy.

Structure (seconds):
  0-10  tension intro: dark pad, ticking hats, sub pulse, riser into the drop
  10    drop (logo reveal)
  10-58 motivational groove: kick, clap, hats, pumping bass, chord pad, pluck arp
  22/36/50 section hits: whoosh before, impact on the downbeat
  58-60 final hit and tail
Usage: python make_music.py out.wav
"""
import sys
import wave

import numpy as np

SR = 44100
BPM = 120
BEAT = 60 / BPM
DUR = 60.0
N = int(SR * DUR)
rng = np.random.default_rng(7)


def t_(sec):
    return np.arange(int(sec * SR)) / SR


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def lowpass(x, cutoff):
    """One-pole lowpass; cutoff may be an array (sweeps)."""
    cutoff = np.broadcast_to(np.asarray(cutoff, dtype=float), x.shape)
    a = 1 - np.exp(-2 * np.pi * cutoff / SR)
    y = np.empty_like(x)
    acc = 0.0
    for i in range(len(x)):
        acc += a[i] * (x[i] - acc)
        y[i] = acc
    return y


def lp2(x, cutoff):
    return lowpass(lowpass(x, cutoff), cutoff)


def highpass(x, cutoff):
    return x - lowpass(x, cutoff)


def saw(freq, t, detune_cents=(0,)):
    out = np.zeros_like(t)
    for d in detune_cents:
        f = freq * 2 ** (d / 1200)
        ph = rng.random()
        out += 2 * ((f * t + ph) % 1) - 1
    return out / len(detune_cents)


def place(buf, sig, start_sec, gain=1.0):
    s = int(start_sec * SR)
    if s >= len(buf):
        return
    e = min(len(buf), s + len(sig))
    buf[s:e] += sig[: e - s] * gain


def reverb(x, seconds=2.2, mix=0.25):
    n = int(seconds * SR)
    ir = rng.standard_normal(n) * np.exp(-np.linspace(0, 7, n))
    ir = lowpass(ir, 5000)
    ir /= np.sqrt(np.sum(ir**2))
    size = 1 << int(np.ceil(np.log2(len(x) + n)))
    wet = np.fft.irfft(np.fft.rfft(x, size) * np.fft.rfft(ir, size), size)[: len(x)]
    return x * (1 - mix) + wet * mix


# ---------- instruments ----------
def kick():
    t = t_(0.45)
    f = 45 + 110 * np.exp(-t * 28)
    ph = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(ph) * np.exp(-t * 7)
    click = rng.standard_normal(len(t)) * np.exp(-t * 300) * 0.3
    return np.tanh((body + click) * 1.8) * 0.9


def clap():
    t = t_(0.3)
    env = np.zeros_like(t)
    for d in (0, 0.011, 0.022):
        env += (t >= d) * np.exp(-np.clip(t - d, 0, None) * 60)
    env += np.exp(-t * 14) * 0.5
    n = highpass(rng.standard_normal(len(t)), 900)
    return lowpass(n, 6000) * env * 0.5


def hat(open_=False):
    t = t_(0.35 if open_ else 0.06)
    n = highpass(highpass(rng.standard_normal(len(t)), 7000), 7000)
    return n * np.exp(-t * (12 if open_ else 70)) * 0.35


def impact():
    t = t_(2.5)
    f = 30 + 70 * np.exp(-t * 6)
    boom = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 2.2)
    noise = lowpass(rng.standard_normal(len(t)), 1800) * np.exp(-t * 5) * 0.6
    return reverb(np.tanh((boom + noise) * 1.5), 2.5, 0.35) * 0.9


def whoosh(length=1.0):
    t = t_(length)
    n = rng.standard_normal(len(t))
    sweep = 300 + 7000 * (t / length) ** 2
    env = (t / length) ** 2.2
    return lp2(n, sweep) * env * 0.45


def riser(length=2.0):
    t = t_(length)
    f = 200 * 2 ** (3 * t / length)
    tone = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.25
    noise = lp2(rng.standard_normal(len(t)), 400 + 9000 * (t / length) ** 2) * 0.5
    return (tone + noise) * (t / length) ** 2


# Am - F - C - G (one chord per bar = 2 s)
CHORDS = [
    [57, 60, 64],  # Am
    [53, 57, 60],  # F
    [55, 60, 64],  # C
    [55, 59, 62],  # G
]
ROOTS = [45, 41, 48, 43]


def pad(chord, length, bright):
    t = t_(length)
    x = sum(saw(midi(n), t, (-9, 0, 8)) for n in chord + [chord[0] + 12])
    env = np.minimum(1, t / 0.25) * np.minimum(1, (length - t) / 0.3)
    return lp2(x, bright) * env * 0.12


def bass_note(note, length):
    t = t_(length)
    x = saw(midi(note), t, (0, 6)) + 0.6 * np.sin(2 * np.pi * midi(note - 12) * t)
    env = np.exp(-t * 3) * 0.6 + 0.4
    env *= np.minimum(1, (length - t) / 0.01)
    return lp2(x, 500 + 900 * np.exp(-t * 10)) * env * 0.3


def pluck(note, length=0.22):
    t = t_(length)
    x = saw(midi(note), t, (-4, 4))
    return lp2(x, 1200 + 5000 * np.exp(-t * 25)) * np.exp(-t * 14) * 0.13


# ---------- arrangement ----------
music = np.zeros(N)
drums = np.zeros(N)
side = np.ones(N)  # sidechain gain driven by the kick

K, C, H, HO = kick(), clap(), hat(), hat(True)

# intro: dark filtered pad + ticking + sub pulse
intro_pad = pad([57, 60, 64], 10.0, 600) + pad([45, 52], 10.0, 400) * 0.8
place(music, intro_pad * np.linspace(0.6, 1.0, len(intro_pad)), 0)
for i in range(int(10 / (BEAT / 2))):
    place(drums, H * (0.55 if i % 2 else 0.35), i * BEAT / 2)
for i in range(16):
    t = t_(0.3)
    place(music, np.sin(2 * np.pi * 55 * t) * np.exp(-t * 9) * 0.35, 2 + i * BEAT)
place(music, riser(2.0), 8.0, 0.8)

# main groove 10-58
for b in range(int(10 / BEAT), int(58 / BEAT)):
    s = b * BEAT
    if 57.0 <= s < 58:  # drum break before the final hit
        continue
    place(drums, K, s)
    env = np.ones(int(BEAT * SR))
    tt = np.arange(len(env)) / SR
    env = 1 - 0.65 * np.exp(-tt * 9)
    seg = side[int(s * SR) : int(s * SR) + len(env)]
    seg *= env[: len(seg)]
    if b % 2 == 1:
        place(drums, C, s, 0.9)
    place(drums, H, s + BEAT / 2, 0.8)
    place(drums, H, s + BEAT / 4, 0.3)
    place(drums, H, s + 3 * BEAT / 4, 0.3)
    if b % 8 == 7:
        place(drums, HO, s + BEAT / 2, 0.6)

for bar in range(5, 29):
    s = bar * 2.0
    ci = (bar - 5) % 4
    place(music, pad(CHORDS[ci], 2.0, 2200), s)
    for e in range(8):  # pumping 8th-note bass
        place(music, bass_note(ROOTS[ci], BEAT / 2 * 0.9), s + e * BEAT / 2)
    if bar >= 6:  # arp from the first feature on
        arp = CHORDS[ci] + [CHORDS[ci][1] + 12]
        for k in range(16):
            place(music, pluck(arp[(k * 3) % 4] + 12), s + k * BEAT / 4, 0.9 if k % 4 == 0 else 0.6)

# section transitions
for at in (10.0, 22.0, 36.0, 50.0):
    place(music, whoosh(1.0), at - 1.0)
    place(drums, impact(), at, 1.0 if at == 10.0 else 0.6)

# ending: last chord rings out
place(music, whoosh(1.0), 57.0)
place(drums, impact(), 58.0, 1.0)
place(music, pad([57, 60, 64, 69], 2.0, 1500) * np.linspace(1, 0, int(2.0 * SR)), 58.0)

mix = reverb(music * side, 1.8, 0.22) + drums
mix = np.tanh(mix * 1.1)
mix /= np.max(np.abs(mix)) + 1e-9
mix *= 0.89

# light stereo: delay the right channel slightly for width
right = np.concatenate([np.zeros(int(0.012 * SR)), mix[: -int(0.012 * SR)]])
stereo = np.stack([mix, 0.6 * mix + 0.4 * right], axis=1)

with wave.open(sys.argv[1], 'wb') as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((stereo * 32767).astype('<i2').tobytes())
print('ok', sys.argv[1])
