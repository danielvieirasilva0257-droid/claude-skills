"""Final audio for the Rotina v2 video: synthesized SFX (from sons.json) + voice + music, mixed in ffmpeg
(music ducked under the voice with sidechaincompress, amix normalize=0, two-pass loudnorm to -14 LUFS / -1.5 dBTP).

Run (from rotina-video/):  python -I audio/v2/mixar_v2.py
Inputs : audio/v2/sons.json (export with exportar_sons.ts), the voice track and the music track below.
Outputs: audio/v2/sfx-v2.wav (SFX bus) and public/v2/rotina-v2-mix.wav (final mix, 48 kHz stereo, 30.0 s).
SFX synthesis adapted from the motion-video kit (engine/sfx.py) + a few new sounds (slam, swish, coin, glitch, thump).
"""
import json
import os
import subprocess

import numpy as np
import soundfile as sf
from scipy.signal import butter, sosfilt

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
VOICE = os.path.join(HERE, 'gemini-3.8-flash-tts_Leda_roteiro-v2-1.6x-montada.flac')
MUSIC = os.path.join(HERE, 'numpy-pedalboard_house-120bpm_trilha-v2.flac')
CUES = os.path.join(HERE, 'sons.json')
SFX_OUT = os.path.join(HERE, 'sfx-v2.wav')
MIX_OUT = os.environ.get('MIX_OUT', os.path.join(ROOT, 'public', 'v2', 'rotina-v2-mix.wav'))

SR = 48000
FPS = 30
DUR = 30.0
N = int(SR * DUR)
rng = np.random.default_rng(7)

# mix levels (dB) — tuned by measuring, see the notes printed at the end
MUSIC_DB = -8.0
SFX_DB = -3.0
VOICE_DB = float(os.environ.get('VOICE_DB', '0.0'))  # VOICE_DB=-120 renders the background only (still ducked), for checks


def env(n, a, d, curve=4.0):
    t = np.arange(n) / SR
    return (np.minimum(1, t / max(a, 1e-4)) * np.exp(-curve * np.maximum(0, t - a) / max(d, 1e-4))).astype(np.float32)


def bp(x, lo, hi):
    return sosfilt(butter(2, [lo, min(hi, SR * 0.45)], 'band', fs=SR, output='sos'), x)


def hp(x, fc):
    return sosfilt(butter(2, fc, 'high', fs=SR, output='sos'), x)


def lp(x, fc):
    return sosfilt(butter(2, fc, 'low', fs=SR, output='sos'), x)


def sweep_noise(dur, f0, f1, q=0.6):
    n = int(dur * SR)
    x = rng.standard_normal(n)
    fc = np.geomspace(f0, f1, n)
    y = np.zeros(n)
    low = band = 0.0
    k = 1 / q
    for i in range(n):
        f = 2 * np.sin(np.pi * fc[i] / SR)
        high = x[i] - low - k * band
        band += f * high
        low += f * band
        y[i] = band
    return y / (np.abs(y).max() + 1e-9)


# ---------------- sound library
def whoosh(dur=.5, f0=300, f1=5000, peak=.55, **_):
    n = int(dur * SR)
    t = np.linspace(0, 1, n)
    e = np.where(t < peak, (t / peak) ** 2, ((1 - t) / (1 - peak)) ** 1.6)
    return (sweep_noise(dur, f0, f1) * e).astype(np.float32)


def swish(dur=.22, **_):
    return whoosh(dur, 900, 7000, 0.6) * 0.9


def pop(f0=700, f1=160, dur=.12, **_):
    n = int(dur * SR)
    t = np.arange(n) / SR
    fr = f1 + (f0 - f1) * np.exp(-t * 40)
    return (np.sin(2 * np.pi * np.cumsum(fr) / SR) * env(n, .002, .035)).astype(np.float32)


def thump(**_):
    return pop(220, 55, 0.22) * 1.2


def click(freq=2400, dur=.03, **_):
    n = int(dur * SR)
    t = np.arange(n) / SR
    nz = bp(rng.standard_normal(n), 2000, 9000) * env(n, .0005, .004, 6)
    return (nz * .6 + np.sin(2 * np.pi * freq * t) * env(n, .0005, .008, 5) * .5).astype(np.float32)


def tick(**_):
    n = int(.018 * SR)
    t = np.arange(n) / SR
    s = bp(rng.standard_normal(n), 3000, 10000) * env(n, .0003, .002, 6) * .7
    s += np.sin(2 * np.pi * rng.uniform(3200, 5200) * t) * env(n, .0003, .003, 6) * .25
    return s.astype(np.float32)


def chime(n1=1318.5, n2=1975.5, gap=.07, dur=1.2, **_):
    n = int(dur * SR)
    out = np.zeros(n, np.float32)
    t = np.arange(n) / SR
    for k, f in enumerate((n1, n2)):
        s = np.sin(2 * np.pi * f * t) + .35 * np.sin(2 * np.pi * f * 2.01 * t) + .12 * np.sin(2 * np.pi * f * 3.98 * t)
        s = (s * env(n, .002, .45, 3)).astype(np.float32)
        o = int(k * gap * SR)
        out[o:] += s[: n - o] * (.8 if k else 1)
    return out / np.abs(out).max()


def boom(dur=1.0, **_):
    n = int(dur * SR)
    t = np.arange(n) / SR
    fr = 38 + 60 * np.exp(-t * 18)
    return (np.tanh(2.2 * np.sin(2 * np.pi * np.cumsum(fr) / SR)) * env(n, .003, .35, 3)).astype(np.float32)


def scribble(dur=.32, **_):
    n = int(dur * SR)
    t = np.arange(n) / SR
    s = bp(rng.standard_normal(n), 1800, 6000)
    am = .55 + .45 * np.sin(2 * np.pi * 22 * t + rng.uniform(0, 6)) ** 2
    e = np.minimum(1, t / .03) * np.minimum(1, (dur - t) / .08)
    return (s * am * e / (np.abs(s).max() + 1e-9)).astype(np.float32)


def shimmer(dur=1.2, **_):
    n = int(dur * SR)
    t = np.arange(n) / SR
    s = sum(np.sin(2 * np.pi * f * t + rng.uniform(0, 6)) for f in (2637, 3136, 3951, 5274))
    e = np.minimum(1, t / (dur * .45)) * np.exp(-np.maximum(0, t - dur * .45) * 5)
    return (s / 4 * e).astype(np.float32)


def slam(**_):
    """Type landing: low thump + body + click."""
    n = int(0.3 * SR)
    t = np.arange(n) / SR
    fr = 48 + 70 * np.exp(-t / 0.03)
    low = np.tanh(1.8 * np.sin(2 * np.pi * np.cumsum(fr) / SR)) * np.exp(-t / 0.09)
    body = bp(rng.standard_normal(n), 180, 900) * np.exp(-t / 0.035) * 0.6
    clk = hp(rng.standard_normal(n), 2500) * np.exp(-t / 0.004) * 0.35
    x = low + body + clk
    return (x / (np.abs(x).max() + 1e-9)).astype(np.float32)


def coin(**_):
    """Bright 'ka-ching' for money in."""
    n = int(0.9 * SR)
    t = np.arange(n) / SR
    out = np.zeros(n, np.float32)
    for k, (f, d) in enumerate([(2093.0, 0.0), (2637.0, 0.07), (3136.0, 0.07)]):
        o = int(d * SR)
        s = (np.sin(2 * np.pi * f * t) + 0.4 * np.sin(2 * np.pi * f * 2.76 * t)) * np.exp(-t / 0.18)
        out[o:] += s[: n - o].astype(np.float32) * (1.0 if k == 0 else 0.7)
    out += (hp(rng.standard_normal(n), 5000) * np.exp(-t / 0.01) * 0.3).astype(np.float32)
    return out / np.abs(out).max()


def glitch(dur=0.24, **_):
    """Short digital burst (spreadsheet chaos)."""
    n = int(dur * SR)
    out = np.zeros(n, np.float32)
    seg = int(0.012 * SR)
    t = np.arange(seg) / SR
    for i in range(0, n, seg):
        f = rng.uniform(200, 3200)
        kind = rng.integers(0, 3)
        if kind == 0:
            s = np.sign(np.sin(2 * np.pi * f * t))
        elif kind == 1:
            s = np.round(rng.standard_normal(seg) * 2) / 2
        else:
            s = np.sin(2 * np.pi * f * t)
        out[i:i + seg] = s[: min(seg, n - i)] * rng.uniform(0.3, 1.0)
    out *= np.minimum(1, (n - np.arange(n)) / (0.04 * SR))
    return (bp(out, 300, 9000) * 0.8).astype(np.float32)


GEN = dict(whoosh=whoosh, swish=swish, pop=pop, thump=thump, click=click, tick=tick, chime=chime, boom=boom,
           scribble=scribble, shimmer=shimmer, slam=slam, coin=coin, glitch=glitch)

mix = np.zeros((N, 2), np.float32)


def place(sig, frame, gain=1.0, pan=0.0, panFrom=None, panTo=None):
    p = np.linspace(panFrom, panTo, len(sig)) if panFrom is not None else np.full(len(sig), pan)
    st = np.stack([sig * np.cos((p + 1) * np.pi / 4), sig * np.sin((p + 1) * np.pi / 4)], 1) * np.sqrt(2)
    i = int(round(frame / FPS * SR))
    if i < 0:
        st = st[-i:]
        i = 0
    j = min(N, i + len(st))
    if i < N:
        mix[i:j] += st[: j - i] * gain


for ev in json.load(open(CUES, encoding='utf-8')):
    name, fr, g, pan = ev.pop('name'), ev.pop('frame'), ev.pop('gain', 1), ev.pop('pan', 0)
    pf, pt = ev.pop('panFrom', None), ev.pop('panTo', None)
    if name in ('typing', 'clicks'):  # bursts: one sound every `step` frames until `to`
        to, step = ev.pop('to'), ev.pop('step', 2)
        for f in np.arange(fr, to, step):
            s = tick() if name == 'typing' else click(rng.uniform(2600, 3400), .02)
            place(s, float(f) + rng.uniform(-.3, .3), g * rng.uniform(.6, 1), pan + rng.uniform(-.3, .3))
        continue
    place(GEN[name](**ev), fr, g, pan, pf, pt)

peak = np.abs(mix).max()
if peak > 0.98:
    mix *= 0.98 / peak
sf.write(SFX_OUT, mix, SR, subtype='PCM_16')
print('sfx bus ->', SFX_OUT, 'peak', round(float(peak), 3))

# ---------------- ffmpeg mix: duck the music under the voice, sum, master
graph = (
    f"[1:a]aresample=48000,pan=stereo|c0=c0|c1=c0,apad=whole_dur={DUR},highpass=f=70,acompressor=threshold=-20dB:ratio=2.5:attack=4:release=90:makeup=1.5,asplit=2[vpre][vsc];[vpre]volume={VOICE_DB}dB[v];"
    f"[0:a]aresample=48000,volume={MUSIC_DB}dB[m];"
    f"[vsc]asplit=2[vsc1][vsc2];[m][vsc1]sidechaincompress=threshold=0.02:ratio=10:attack=10:release=380:knee=4[md];"
    f"[2:a]aresample=48000,volume={SFX_DB}dB[s0];[s0][vsc2]sidechaincompress=threshold=0.04:ratio=3:attack=5:release=250:knee=4[s];"
    f"[md][v][s]amix=inputs=3:normalize=0:duration=longest,apad=whole_dur={DUR},alimiter=limit=0.92:attack=3:release=50:level=disabled"
)
pre = MIX_OUT + '.pre.wav'
os.makedirs(os.path.dirname(MIX_OUT), exist_ok=True)
subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', MUSIC, '-i', VOICE, '-i', SFX_OUT, '-filter_complex', graph,
                '-t', str(DUR), '-ar', '48000', '-c:a', 'pcm_s24le', pre], check=True)
meas = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', pre, '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json', '-f', 'null', '-'],
                      capture_output=True, text=True).stderr
js = json.loads(meas[meas.rindex('{'):meas.rindex('}') + 1])
ln = (f"loudnorm=I=-14:TP=-1.5:LRA=11:measured_I={js['input_i']}:measured_TP={js['input_tp']}:measured_LRA={js['input_lra']}"
      f":measured_thresh={js['input_thresh']}:offset={js['target_offset']}:linear=true")
subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', pre, '-af', ln + f',aresample=48000,apad=whole_dur={DUR}', '-t', str(DUR), '-ar', '48000', '-c:a', 'pcm_s16le', MIX_OUT], check=True)
os.remove(pre)
print('mix ->', MIX_OUT, '| pre-master I', js['input_i'], 'TP', js['input_tp'])
