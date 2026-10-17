"""Rotina v5 (13/10/2026, estilo do video-modelo, 16:9): copia do trilha_v3.py (que veio do exemplo_trilha_v2.py da
skill trilha-e-mixagem). Grade em 100 BPM (batida = 18 quadros) com a batida 0 no quadro 23: a virada cai em "No Rotina"
(quadro 311), uma batida de silencio sob "Baixe", a volta no clique do "agora" (527) e o golpe final no logo (563).
Mudou so a grade, as secoes, os acordes e a duracao (22,4 s).
Original: Rotina v2, 120 BPM, A minor -> C major ending.
Fully synthesized with numpy + pedalboard (no samples, no third-party audio: free to use in paid ads).

How to reuse for another video:
  1. Set the grid so the important beat lands on a key word of the narration: here beat k is at (10 + 15k) / 30 s,
     so the drop (beat 10 = frame 160) lands on "Com o app Rotina". Change beat_t() and the T_* section times.
  2. Edit CHORDS (time, chord) and VOICE / ROOT if you want other harmony.
  3. Run, then check the RMS around the drop and the final hit, the spectrogram and the loudness (see SKILL.md).
Sound: polyBLEP supersaw pads/stabs, pitch-enveloped kick, 3-burst claps, 16th hats with swing, sub + mid bass,
plucks with dotted-8th delay, risers, snare rolls, impacts, sidechain pumping, reverb/delay sends,
mid/side widening, -3 dB dip at 2.4 kHz for the narrator; master with ffmpeg alimiter + two-pass loudnorm.

Run:  python -I exemplo_trilha_v2.py <out.wav> [events.json]     (about 17 s on 4 CPUs)
Needs numpy, scipy, soundfile, pedalboard and ffmpeg.
"""
import json
import sys

import numpy as np
import soundfile as sf
from pedalboard import Compressor, Delay, HighpassFilter, PeakFilter, Pedalboard, Reverb
from scipy.signal import butter, sosfilt

SR = 48000
DUR = 22.4
N = int(SR * DUR)
rng = np.random.default_rng(20261009)


def beat_t(k):
    return (23 + 18 * k) / 30.0  # batida 0 no quadro 23; batida 16 = quadro 311 ("No Rotina")


def idx(t):
    return int(round(t * SR))


# ------------------------------------------------------------------ structure (seconds)
T_DROP = beat_t(16)  # q311 "No Rotina"
T_B = beat_t(24)  # q455 ("Treino e habitos tambem")
T_C = beat_t(25)  # q473
T_F = beat_t(26)  # q491 (preparacao do CTA)
T_BREAK = beat_t(27)  # q509 (silencio sob "Baixe")
T_BACK = beat_t(28)  # q527 (volta no clique do "agora")
T_HIT = beat_t(30)  # q563 (golpe final, o logo pousa)

# chords: (start time, name). Voicings below.
CHORDS = [
    (0.0, 'Am'), (beat_t(4), 'F'), (beat_t(8), 'G'), (beat_t(12), 'Em'),
    (T_DROP, 'Am'), (beat_t(18), 'F'), (beat_t(20), 'C'), (beat_t(22), 'G'),
    (T_B, 'Am'), (T_C, 'F'),
    (T_F, 'F'), (T_BREAK, 'G'), (T_HIT, 'Cadd9'),
]
VOICE = {  # MIDI notes (pad / stabs)
    'Am': [57, 60, 64, 69], 'F': [57, 60, 65, 69], 'C': [55, 60, 64, 67], 'G': [55, 59, 62, 67],
    'Em': [55, 59, 64, 67], 'Cadd9': [55, 60, 64, 67, 74],
}
ROOT = {'Am': 33, 'F': 29, 'C': 36, 'G': 31, 'Em': 28, 'Cadd9': 36}  # bass roots (A1, F1, C2, G1, E1, C2)


def chord_at(t):
    name = CHORDS[0][1]
    for t0, n in CHORDS:
        if t >= t0 - 1e-9:
            name = n
    return name


def hz(m):
    return 440.0 * 2 ** ((m - 69) / 12)


# ------------------------------------------------------------------ helpers
def tracks():
    return np.zeros((N, 2), np.float32)


def add(buf, sig, t, gain=1.0, pan=0.0):
    """Add mono or stereo signal at time t with constant-power pan."""
    i = idx(t)
    if i >= N:
        return
    if sig.ndim == 1:
        lg = np.cos((pan + 1) * np.pi / 4) * np.sqrt(2)
        rg = np.sin((pan + 1) * np.pi / 4) * np.sqrt(2)
        st = np.stack([sig * lg, sig * rg], 1)
    else:
        st = sig
    j = min(N, i + len(st))
    if i < 0:
        st = st[-i:]
        i = 0
    buf[i:j] += (st[: j - i] * gain).astype(np.float32)


def env_ad(n, a, d, curve=1.0):
    t = np.arange(n) / SR
    att = np.clip(t / max(a, 1e-4), 0, 1)
    dec = np.exp(-np.maximum(0, t - a) / max(d, 1e-4)) ** curve
    return (att * dec).astype(np.float32)


def env_adsr(n, a, r_start, r):
    """attack a, hold until r_start, release r (seconds)."""
    t = np.arange(n) / SR
    e = np.clip(t / max(a, 1e-4), 0, 1)
    e *= np.clip(1 - (t - r_start) / max(r, 1e-4), 0, 1)
    return e.astype(np.float32)


def lp(x, fc, order=2):
    return sosfilt(butter(order, min(fc, SR * 0.45), 'low', fs=SR, output='sos'), x, axis=0).astype(np.float32)


def hp(x, fc, order=2):
    return sosfilt(butter(order, fc, 'high', fs=SR, output='sos'), x, axis=0).astype(np.float32)


def bp(x, lo, hi, order=2):
    return sosfilt(butter(order, [lo, min(hi, SR * 0.45)], 'band', fs=SR, output='sos'), x, axis=0).astype(np.float32)


def noise(n, stereo=False):
    if stereo:
        return rng.standard_normal((n, 2)).astype(np.float32)
    return rng.standard_normal(n).astype(np.float32)


def blep_saw(freq, n, phase0=0.0):
    """Band-limited sawtooth (polyBLEP), freq scalar or array."""
    f = np.broadcast_to(np.asarray(freq, dtype=np.float64), (n,))
    dt = f / SR
    ph = (phase0 + np.cumsum(dt)) % 1.0
    y = 2.0 * ph - 1.0
    m1 = ph < dt
    t1 = ph[m1] / dt[m1]
    y[m1] -= t1 + t1 - t1 * t1 - 1.0
    m2 = ph > 1.0 - dt
    t2 = (ph[m2] - 1.0) / dt[m2]
    y[m2] -= t2 * t2 + t2 + t2 + 1.0
    return y.astype(np.float32)


def supersaw(notes, n, detune_cents=13, voices=7, width=0.8):
    """Stereo detuned saw stack for a list of MIDI notes."""
    out = np.zeros((n, 2), np.float32)
    for m in notes:
        for v in range(voices):
            c = (v - (voices - 1) / 2) / ((voices - 1) / 2) * detune_cents
            f = hz(m) * 2 ** (c / 1200)
            s = blep_saw(f, n, rng.uniform(0, 1))
            pan = (v - (voices - 1) / 2) / ((voices - 1) / 2) * width
            out[:, 0] += s * np.cos((pan + 1) * np.pi / 4)
            out[:, 1] += s * np.sin((pan + 1) * np.pi / 4)
    return out / (len(notes) * voices) * 2.2


def pluck(m, dur=0.35, bright=1.0):
    """Additive plucked tone: higher harmonics decay faster."""
    n = int(dur * SR)
    t = np.arange(n) / SR
    f0 = hz(m)
    y = np.zeros(n, np.float32)
    h = 1
    while h * f0 < 12000 and h <= 24:
        y += (1.0 / h) * np.sin(2 * np.pi * f0 * h * t + rng.uniform(0, 6.28)) * np.exp(-t * (6 + 2.2 * h / bright))
        h += 1
    y *= np.clip(t / 0.002, 0, 1)
    return (y / (np.abs(y).max() + 1e-9)).astype(np.float32)


# ------------------------------------------------------------------ drum and fx voices
def kick(n_dur=0.42, punch=1.0):
    n = int(n_dur * SR)
    t = np.arange(n) / SR
    f = 47 + (165 - 47) * np.exp(-t / 0.016)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR)
    e = np.clip(t / 0.0006, 0, 1) * np.exp(-t / 0.16) * np.clip(1 - (t - 0.30) / 0.12, 0, 1)
    body = np.tanh(1.8 * body * e) / np.tanh(1.8)
    click = hp(noise(n), 3000) * np.exp(-t / 0.0025) * 0.35 + np.sin(2 * np.pi * 1800 * t) * np.exp(-t / 0.004) * 0.25
    return (body * 0.95 + click * punch).astype(np.float32)


def clap():
    n = int(0.35 * SR)
    t = np.arange(n) / SR
    x = np.zeros(n, np.float32)
    nz = bp(noise(n), 900, 5000)
    for k, d in enumerate([0.0, 0.009, 0.019]):
        i = int(d * SR)
        x[i:] += nz[: n - i] * np.exp(-(t[: n - i]) / 0.006) * (0.8 + 0.1 * k)
    tail = bp(noise(n), 1000, 4000) * np.exp(-np.maximum(0, t - 0.022) / 0.07) * (t > 0.02)
    x += tail * 0.7
    return x / (np.abs(x).max() + 1e-9)


def hat(open_=False):
    n = int((0.22 if open_ else 0.05) * SR)
    t = np.arange(n) / SR
    x = hp(noise(n), 7500, 4)
    # a few metallic partials
    for f in (5270, 7040, 8360):
        x += 0.08 * np.sign(np.sin(2 * np.pi * f * t))
    x = hp(x, 6500)
    d = 0.075 if open_ else 0.014
    return (x * np.exp(-t / d) * np.clip(t / 0.0008, 0, 1) / 3).astype(np.float32)


def snare(tone=190.0, dur=0.22):
    n = int(dur * SR)
    t = np.arange(n) / SR
    body = np.sin(2 * np.pi * tone * t) * np.exp(-t / 0.05)
    nz = bp(noise(n), 1500, 9000) * np.exp(-t / 0.075)
    x = body * 0.6 + nz
    return (x / (np.abs(x).max() + 1e-9)).astype(np.float32)


def tom(f0=140.0, f1=85.0):
    n = int(0.35 * SR)
    t = np.arange(n) / SR
    f = f1 + (f0 - f1) * np.exp(-t / 0.05)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.14)
    return np.tanh(1.4 * x).astype(np.float32)


def crash(dur=2.2):
    n = int(dur * SR)
    t = np.arange(n) / SR
    x = hp(noise(n, stereo=True), 3500, 2)
    x = x + 0.35 * bp(noise(n, stereo=True), 6000, 12000)
    e = np.clip(t / 0.002, 0, 1) * np.exp(-t / 0.55)
    return (x * e[:, None] * 0.5).astype(np.float32)


def boom(dur=1.4, f0=62.0, f1=33.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = f1 + (f0 - f1) * np.exp(-t / 0.18)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.45) * np.clip(t / 0.003, 0, 1)
    return np.tanh(2.0 * x).astype(np.float32)


def riser(dur, f_lo=300.0, f_hi=9000.0, tone=True):
    n = int(dur * SR)
    t = np.arange(n) / SR
    p = t / dur
    # noise through a sweeping band (chunked biquad bandpass)
    x = noise(n, stereo=True)
    y = np.zeros_like(x)
    hop = 256
    zi = None
    for s in range(0, n, hop):
        fc = f_lo * (f_hi / f_lo) ** (s / n)
        sos = butter(2, [fc * 0.7, min(fc * 1.4, SR * 0.45)], 'band', fs=SR, output='sos')
        if zi is None:
            zi = np.zeros((sos.shape[0], 2, 2))
        seg, zi = sosfilt(sos, x[s:s + hop], axis=0, zi=zi)
        y[s:s + hop] = seg
    y /= np.abs(y).max() + 1e-9
    out = y * (p ** 2.2)[:, None]
    if tone:
        f = hz(57) * 2 ** (2 * p ** 1.6)  # A3 -> A5
        s = blep_saw(f, n)
        s = lp(s, 3500)
        out += (s * (p ** 2.5) * 0.25)[:, None]
    return out.astype(np.float32)


def reverse_crash(dur=1.0):
    c = crash(dur * 1.6)[: int(dur * SR)]
    return c[::-1].copy()


# ------------------------------------------------------------------ buses
drums = tracks()
bass = tracks()
music = tracks()
fx = tracks()
send_verb = tracks()
send_delay = tracks()

KICK = kick()
KICK_SOFT = lp(kick(punch=0.0), 160)
CLAP = clap()
HATC = hat()
HATO = hat(True)

events = []


def ev(name, t, **kw):
    events.append({'evento': name, 't': round(t, 3), 'frame': round(t * 30), **kw})


kicks = []  # times for sidechain


def section(t):
    if t < T_DROP:
        return 'intro'
    if t < T_B:
        return 'A'
    if t < T_C:
        return 'B'
    if t < T_F:
        return 'C'
    if t < T_BREAK:
        return 'F1'
    if t < T_BACK:
        return 'break'
    if t < T_HIT:
        return 'F2'
    return 'end'


# ---- drums
for k in range(-1, 60):
    t = beat_t(k)
    if t < 0 or t >= DUR:
        continue
    sec = section(t)
    b = (k - 2) % 4  # beat in bar (0 = downbeat)
    if sec == 'intro':
        if k >= 2 and t < beat_t(15.5):
            add(drums, KICK_SOFT, t, 0.15)  # muffled heartbeat
        continue
    if sec == 'break':
        continue
    if sec == 'end':
        if k == 58:
            add(drums, KICK, t, 1.0)
            kicks.append(t)
        continue
    add(drums, KICK, t, 0.95)
    kicks.append(t)
    if b in (1, 3):
        add(drums, CLAP, t, 0.42)
        add(send_verb, CLAP, t, 0.22)

# ---- hats and percussion on 16ths
for j in range(-8, 240):
    t = beat_t(0) + j * 0.15
    if t < 0 or t >= DUR:
        continue
    sec = section(t)
    pos = j % 4  # 16th position in the beat
    vel = [0.55, 0.28, 0.85, 0.32][pos] * rng.uniform(0.85, 1.0)
    swing = 0.012 if pos in (1, 3) else 0.0
    if sec == 'intro':
        if t < beat_t(15.5):
            # clock-like ticks, getting louder through the intro
            g = 0.35 + 0.65 * (t / T_DROP)
            add(drums, HATC, t + swing, 0.13 * vel * g, pan=0.25 if pos % 2 else -0.15)
        continue
    if sec in ('break',):
        if pos == 2:
            add(drums, HATC, t, 0.06)
        continue
    if sec == 'end':
        continue
    add(drums, HATC, t + swing, 0.16 * vel, pan=0.2 if pos % 2 else -0.1)
    if pos == 2 and sec in ('A', 'C', 'F1', 'F2'):
        add(drums, HATO, t, 0.13, pan=0.15)
    if sec == 'B':
        if pos in (1, 3):
            sh = bp(noise(int(0.06 * SR)), 3000, 9000) * env_ad(int(0.06 * SR), 0.004, 0.02)
            add(drums, sh, t + swing, 0.07 * vel, pan=-0.35)
        if pos == 3 and (j // 4) % 2 == 1:
            add(drums, snare(420, 0.08), t, 0.12, pan=0.3)  # rim-ish accent

# ---- snare rolls / fills
def roll(t0, t1, start_div=8, end_div=32, g0=0.12, g1=0.5, tone0=180.0, tone1=270.0):
    t = t0
    while t < t1 - 1e-6:
        p = (t - t0) / (t1 - t0)
        div = start_div if p < 0.34 else (16 if p < 0.67 else end_div)
        step = 2.4 / div  # segundos a 100 BPM (semibreve = 2,4 s)
        add(drums, snare(tone0 + (tone1 - tone0) * p), t, g0 + (g1 - g0) * p ** 1.5, pan=0.0)
        add(send_verb, snare(tone0 + (tone1 - tone0) * p), t, 0.08 + 0.15 * p)
        t += step


roll(beat_t(13), beat_t(15.5), g0=0.06, g1=0.3)
ev('intro_snare_roll', beat_t(13), fim=round(beat_t(15.5), 3))
for (a, bb) in [(beat_t(23), beat_t(24))]:
    roll(a, bb, start_div=16, end_div=32, g0=0.18, g1=0.45)
    add(drums, tom(150, 95), a + 0.3, 0.35, pan=-0.3)
    add(drums, tom(115, 70), a + 0.45, 0.4, pan=0.3)
    ev('fill', a, fim=round(bb, 3))
roll(beat_t(25), T_F, start_div=8, end_div=32, g0=0.12, g1=0.5)
ev('build_snare_roll', beat_t(25), fim=round(T_F, 3))
roll(T_BACK, T_HIT, start_div=8, end_div=32, g0=0.06, g1=0.26)
ev('final_snare_roll', T_BACK, fim=round(T_HIT, 3))

# ---- impacts, crashes, risers
add(fx, riser(T_DROP - beat_t(12)), beat_t(12), 0.2)
ev('riser_intro', beat_t(12), fim=round(T_DROP, 3))
add(fx, reverse_crash(1.0), T_DROP - 1.0, 0.45)
for t, big in [(T_DROP, 1.0), (T_B, 0.5), (T_BACK, 0.8), (T_HIT, 1.0)]:
    add(fx, crash(2.4 if big > 0.9 else 1.8), t, 0.55 * big)
    add(bass, boom(1.5 if big > 0.9 else 1.0), t, 0.75 * big)
    ev('impacto', t, intensidade=big)
for (a, bb) in [(beat_t(23), T_B)]:
    add(fx, riser(bb - a, 800, 9000, tone=False), a, 0.16)
add(fx, riser(T_F - beat_t(25), 500, 9000), beat_t(25), 0.22)
ev('riser_build', beat_t(25), fim=round(T_F, 3))
add(fx, riser(T_HIT - T_BREAK, 300, 10000), T_BREAK, 0.24)
ev('riser_final', T_BREAK, fim=round(T_HIT, 3))
add(fx, reverse_crash(0.8), T_HIT - 0.8, 0.35)
ev('drop', T_DROP)
ev('break', T_BREAK, fim=round(T_BACK, 3))
ev('final_hit', T_HIT)

# ---- bass: sub on offbeats (A, C, final), rolling 16ths (B)
def sub_note(m, dur, gain):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = hz(m + 12) if hz(m) < 40 else hz(m)
    x = np.sin(2 * np.pi * f * t) + 0.12 * np.sin(2 * np.pi * 2 * f * t)
    x *= env_adsr(n, 0.004, dur - 0.03, 0.03)
    return np.tanh(1.3 * x).astype(np.float32) * gain


for k in range(14, 40):
    t = beat_t(k)
    sec = section(t)
    if sec in ('break', 'end'):
        continue
    root = ROOT[chord_at(t + 0.26)]
    if sec == 'B':
        for s in range(4):
            ts = t + s * 0.15
            add(bass, sub_note(root, 0.11, 0.42 if s else 0.0), ts)
            mb = blep_saw(hz(root + 12), int(0.11 * SR)) * env_adsr(int(0.11 * SR), 0.003, 0.07, 0.03)
            add(bass, lp(mb, 520 + 180 * (s == 2)), ts, 0.22)
    else:
        add(bass, sub_note(root, 0.2, 0.5), t + 0.3)
# intro pulse: low sub on beats under the heartbeat
for k in range(2, 14):
    t = beat_t(k)
    if t < beat_t(15.5):
        add(bass, sub_note(ROOT[chord_at(t)], 0.3, 0.12), t)
add(bass, sub_note(36, 0.66, 0.55), T_HIT)  # final C

# ---- pad: supersaw chords, sidechain-pumped, filter by section
PAD_LP = {'intro': 700, 'A': 1700, 'B': 1150, 'C': 2600, 'F1': 2400, 'break': 1400, 'F2': 2000, 'end': 3000}
bounds = [c[0] for c in CHORDS] + [DUR]
for (t0, name), t1 in zip(CHORDS, bounds[1:]):
    n = idx(t1) - idx(t0)
    if n <= 0:
        continue
    rel = 0.25 if name != 'Cadd9' else 0.6
    x = supersaw(VOICE[name], n + int(rel * SR))
    e = env_adsr(len(x), 0.06 if t0 > 0 else 0.4, n / SR, rel)
    x *= e[:, None]
    # filter: piecewise by section at the segment start (intro opens toward the drop)
    sec = section(t0 + 0.01)
    fc = PAD_LP[sec]
    if sec == 'intro':
        # open the filter through the intro in chunks
        y = np.zeros_like(x)
        hop = 2048
        zi = None
        for s in range(0, len(x), hop):
            tt = t0 + s / SR
            fcs = 500 + 1400 * min(1, max(0, tt / T_DROP)) ** 2
            sos = butter(2, fcs, 'low', fs=SR, output='sos')
            if zi is None:
                zi = np.zeros((sos.shape[0], 2, 2))
            seg, zi = sosfilt(sos, x[s:s + hop], axis=0, zi=zi)
            y[s:s + hop] = seg
        x = y
    else:
        x = lp(x, fc, 2)
    x = hp(x, 180)
    gain = {'intro': 0.1, 'A': 0.15, 'B': 0.13, 'C': 0.15, 'F1': 0.16, 'break': 0.42, 'F2': 0.15, 'end': 0.22}[sec]
    add(music, x, t0, gain)
    add(send_verb, x, t0, gain * 0.35)

# ---- stabs: drop + offbeats in A/C/F1, bright short chords
def stab(name, dur=0.16, fc=4200):
    n = int(dur * SR)
    x = supersaw(VOICE[name], n, detune_cents=9)
    x = lp(x, fc)
    x *= env_ad(n, 0.002, dur * 0.35)[:, None]
    return hp(x, 200)


add(music, stab('Am', 0.5, 5200), T_DROP, 0.42)
add(send_verb, stab('Am', 0.5, 5200), T_DROP, 0.25)
add(music, stab('F', 0.45, 5200), T_F, 0.38)
add(music, stab('Cadd9', 0.66, 5600), T_HIT, 0.4)
add(send_verb, stab('Cadd9', 0.66, 5600), T_HIT, 0.3)
for k in range(14, 40):
    t = beat_t(k)
    sec = section(t)
    b = (k - 2) % 4
    if sec in ('A', 'C') and b in (1, 3):
        name = chord_at(t + 0.26)
        add(music, stab(name), t + 0.3, 0.2 if sec == 'A' else 0.17, pan=-0.1 if b == 1 else 0.1)
        add(send_verb, stab(name), t + 0.3, 0.08)

# ---- plucks: filtered arp in the intro, bright 16th arp in section C
def arp_notes(name):
    v = VOICE[name]
    return [v[0] + 12, v[1] + 12, v[2] + 12, v[1] + 12, v[3] + 12 if len(v) > 3 else v[0] + 24, v[2] + 12]


for j in range(0, 200):
    t = beat_t(0) + j * 0.3  # colcheias na intro
    if t >= beat_t(15.5):
        break
    name = chord_at(t)
    notes = arp_notes(name)
    m = notes[j % len(notes)] - 12
    p = pluck(m, 0.3, bright=0.6 + 0.8 * t / T_DROP)
    p = lp(p, 900 + 2200 * (t / T_DROP) ** 2)
    add(music, p, t, 0.07 + 0.05 * t / T_DROP, pan=0.3 if j % 2 else -0.3)
    add(send_delay, p, t, 0.05)
for j in range(0, 400):
    t = T_C + j * 0.15
    if t >= T_F:
        break
    name = chord_at(t)
    notes = arp_notes(name)
    m = notes[j % len(notes)]
    p = pluck(m, 0.25, bright=1.4)
    add(music, p, t, 0.07 * (0.8 + 0.2 * (j % 2 == 0)), pan=0.35 if j % 2 else -0.35)
    add(send_delay, p, t, 0.045)
    add(send_verb, p, t, 0.03)

# ------------------------------------------------------------------ sidechain pump
def pump(times, depth, tau=0.085, attack=0.004):
    g = np.ones(N, np.float32)
    t = np.arange(N) / SR
    for tk in times:
        i0 = idx(tk - attack)
        i1 = min(N, idx(tk + 0.45))
        if i0 >= N:
            continue
        tt = t[i0:i1] - tk
        dip = np.where(tt < 0, depth * (1 + tt / attack), depth * np.exp(-tt / tau))
        g[i0:i1] = np.minimum(g[i0:i1], 1 - np.clip(dip, 0, depth))
    return g


gp_music = pump(kicks, 0.62)
gp_bass = pump(kicks, 0.55, tau=0.06)
music *= gp_music[:, None]
bass *= gp_bass[:, None]
send_verb *= pump(kicks, 0.4)[:, None]

# ------------------------------------------------------------------ dropout before the drop (everything but fx)
t = np.arange(N) / SR
mute = np.ones(N, np.float32)
a, b = beat_t(15.5), T_DROP
fade = 0.015
mute[(t >= a + fade) & (t < b - 0.002)] = 0.0
ramp = (t >= a) & (t < a + fade)
mute[ramp] = 1 - (t[ramp] - a) / fade
for buf in (drums, bass, music, send_delay):
    buf *= mute[:, None]
send_verb *= np.where((t >= a) & (t < b), 0.5, 1.0)[:, None]
# v5: a intro fica ~9 dB abaixo da virada. A faixa e curta (8 s de groove depois da virada): sem isto, o loudnorm
# do final sobe a intro ate o nivel do groove e a virada perde o contraste.
intro_g = np.where(t < T_DROP - 0.02, 0.85, 1.0).astype(np.float32)
for buf in (drums, bass, music, send_delay, send_verb):
    buf *= intro_g[:, None]

# ------------------------------------------------------------------ effects and mix
verb = Pedalboard([Reverb(room_size=0.82, damping=0.45, wet_level=1.0, dry_level=0.0, width=1.0)])
dly = Pedalboard([Delay(delay_seconds=0.45, feedback=0.32, mix=1.0), Reverb(room_size=0.5, wet_level=0.4, dry_level=0.6)])
verb_out = verb(send_verb.T.copy(), SR).T
dly_out = dly(send_delay.T.copy(), SR).T
music_bus = music + dly_out * 0.9 + verb_out * 0.75
# widen the music bus (mid/side): more side, same mid
mid = (music_bus[:, 0] + music_bus[:, 1]) / 2
side = (music_bus[:, 0] - music_bus[:, 1]) / 2 * 2.4
music_bus = np.stack([mid + side, mid - side], 1).astype(np.float32)
# leave room for the narrator
music_bus = Pedalboard([PeakFilter(cutoff_frequency_hz=2400, gain_db=-3.0, q=0.8)])(music_bus.T.copy(), SR).T
drums_bus = drums
mix = drums_bus * 1.0 + bass * 1.0 + music_bus * 1.0 + fx * 1.0
# mono below 120 Hz (kick + sub centered)
low = lp(mix, 120, 4)
mono_low = low.mean(axis=1, keepdims=True)
mix = mix - low + mono_low

master = Pedalboard([
    HighpassFilter(cutoff_frequency_hz=25),
    Compressor(threshold_db=-14, ratio=2.0, attack_ms=12, release_ms=140),
])
y = master(mix.T.copy(), SR).T
# level: put the RMS around -18 dBFS; peak limiting and loudness are finished with ffmpeg (alimiter + loudnorm), see master() below
rms = np.sqrt(np.mean(y ** 2)) + 1e-9
y *= 10 ** ((-18.0 - 20 * np.log10(rms)) / 20)
# end: short fade to avoid a click
fade_n = int(0.07 * SR)
y[-fade_n:] *= np.linspace(1, 0, fade_n)[:, None]
y = y[:N]

out = sys.argv[1] if len(sys.argv) > 1 else 'trilha.wav'
tmp = out + '.pre.wav'
sf.write(tmp, y.astype(np.float32), SR, subtype='FLOAT')
# master: true-peak-safe limiter + loudness to about -14 LUFS (two-pass loudnorm, linear)
import subprocess, os
meas = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', tmp, '-af', 'alimiter=limit=0.8:attack=4:release=60:level=disabled,loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json', '-f', 'null', '-'], capture_output=True, text=True).stderr
js = json.loads(meas[meas.rindex('{'):meas.rindex('}') + 1])
ln = f"loudnorm=I=-14:TP=-1.5:LRA=11:measured_I={js['input_i']}:measured_TP={js['input_tp']}:measured_LRA={js['input_lra']}:measured_thresh={js['input_thresh']}:offset={js['target_offset']}:linear=true"
subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', tmp, '-af', 'alimiter=limit=0.8:attack=4:release=60:level=disabled,' + ln + ',aresample=48000', '-c:a', 'pcm_s16le', '-ar', '48000', out], check=True)
os.remove(tmp)
print('wrote', out)
if len(sys.argv) > 2:
    json.dump(sorted(events, key=lambda e: e['t']), open(sys.argv[2], 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print('events ->', sys.argv[2])
