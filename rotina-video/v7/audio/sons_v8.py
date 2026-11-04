# Sound-effect cues for v8 (copy of sons_v7.py + new scenes), computed from the same word times (plan/voz.json) and taps (rec/taps.json) as src/comp.js.
import json, unicodedata, re
V = json.load(open('../plan/voz.json')); TAPS = json.load(open('../rec/taps.json'))['taps']
norm = lambda s: re.sub(r'[^a-z0-9]', '', unicodedata.normalize('NFD', s.lower()).encode('ascii', 'ignore').decode())
def W(w, n=0):
    k = 0
    for x in V['words']:
        if norm(x['w']) == norm(w):
            if k == n: return x['s']
            k += 1
    raise KeyError(w)
L = [(l['s'], l['e']) for l in V['lines']]
F = lambda t: int(round(t * 30)); cues = []
def c(name, t, gain, **kw): cues.append(dict(name=name, frame=max(0, F(t)), gain=gain, pan=kw.pop('pan', 0), **kw))
def wh(t_land, gain, dur=.45, peak=.8, f0=300, f1=4500, **kw): c('whoosh', t_land - dur * peak, gain, dur=dur, peak=peak, f0=f0, f1=f1, **kw)
# hook
wh(0.25, .26, dur=.4, panFrom=-.6, panTo=0); wh(W('sobrou') + .2, .22, dur=.4, panFrom=.6, panTo=0)
c('pop', .62, .16); c('coin', .95, .12); c('scribble', W('salario') - .05, .07); c('pop', W('esse'), .1)
out0 = L[1][0] - .32
wh(out0 + .2, .22, dur=.5, f0=1800, f1=300); wh(L[1][0] + .3, .2, dur=.6, f0=200, f1=2200)
c('boom', W('rotina') + .1, .22); c('slam', W('rotina') + .35, .08)
# app taps (soft clicks)
ON = [(2.4, 5.4), (8.75, 13.0), (21.6, 26.0), (29.2, 32.8), (35.7, 40.6), (42.6, 45.3)]  # phone on screen (src/v8_body.js pose keys)
for tp in TAPS:
    if 'x' in tp and any(a < tp['t'] < b for a, b in ON): c('click', tp['t'] + .02, .06, freq=2600)
# salário / fixas / saldo
c('swish', W('salario', 1) - .05, .12); c('coin', W('salario', 1) + .2, .1)
c('swish', W('saem') - .1, .12); c('thump', W('saem') + .15, .12)
c('swish', W('saldo') - .12, .1); c('clicks', W('acompanha') - .2, .05, to=F(W('acompanha') + .5), step=2)
# iFood
wh(L[3][0] + .2, .18, panFrom=-.5, panTo=.2); c('swish', W('anota') - .1, .12)
c('typing', 9.4, .05, to=F(9.8), step=2); c('typing', 10.2, .05, to=F(10.35), step=2)
for w, n in [('hora', 0), ('categoria', 0), ('cartao', 0)]: c('pop', W(w, n) + .1, .1)
# conta fixa (green panel)
wh(L[4][0] - .05, .22, dur=.5, panFrom=-.7, panTo=0); c('swish', W('conta') + .1, .1)
for w in ['mensal', 'parcelada', 'unica']: wh(W(w) + .15, .14, dur=.35, panFrom=-.5, panTo=-.1); c('tick', W(w) + .2, .08)
wh(L[5][0] - .1, .16, dur=.4, f0=2000, f1=400)
# orçamentos
c('swish', L[5][0], .1); c('swish', W('categoria', 1), .09); c('pop', W('limite') + .1, .11)
c('shimmer', W('enche') - .1, .06, dur=1.2); c('slam', W('gasta') + .08, .12); c('glitch', W('gasta') + .1, .05)
# cartões
wh(W('cartao', 1) + .2, .2, dur=.5, panFrom=-.3, panTo=.5); wh(W('cartao', 1) + .4, .14, dur=.45, panFrom=-.2, panTo=.6)
c('shimmer', W('cartao', 1) + .5, .06, dur=.9); c('swish', W('fatura') - .05, .1); c('pop', W('usado') - .1, .11); c('swish', W('parcelas'), .1)
# assinaturas (dark)
wh(L[7][0] - .05, .22, dur=.55, f0=150, f1=1500); c('boom', L[7][0] + .05, .16); c('swish', W('assinaturas'), .1)
c('clicks', W('quanto', 1) - .1, .05, to=F(W('sai') + .3), step=2); c('shimmer', W('todo') - .05, .09, dur=1.4)
# investimentos (floor)
wh(L[8][0] + .15, .2, dur=.5, f0=1500, f1=200); c('swish', W('investimentos'), .1)
c('pop', W('reserva'), .1); c('swish', W('rende') - .1, .1); c('coin', W('rende') + .2, .1); c('clicks', W('rende') - .1, .045, to=F(W('mes', 2) + .2), step=2)
# relatório
wh(L[9][0] + .1, .18, panFrom=-.6, panTo=0); c('scribble', W('pra', 1) - .15, .05); c('swish', W('cada', 1) - .1, .1); c('slam', W('real') + .1, .13)
# o resto: phone spin
wh(36.05, .26, dur=.7, f0=200, f1=6000); c('scribble', W('resto') - .2, .07); c('pop', W('tambem'), .08)
# hábitos
c('swish', L[11][0], .1)
for tp in TAPS:
    if 'x' in tp and 37.8 < tp['t'] < 40.1: c('pop', tp['t'] + .08, .1); c('chime', tp['t'] + .1, .035, n1=1568, n2=2093, gap=.04, dur=.35)
# treino (green right)
wh(L[12][0] - .05, .22, dur=.5, panFrom=.7, panTo=0); c('swish', W('treino') - .05, .1); c('clicks', W('carga') - .1, .05, to=F(W('carga') + .6), step=2); c('thump', W('carga') + .6, .1)
# gráficos
wh(L[13][0] + .1, .18, dur=.45, f0=1800, f1=300); c('shimmer', L[13][0] + .1, .07, dur=.9)
for i in range(8): c('pop', L[13][0] + .2 + i * .06, .035, f0=500 + i * 60, f1=200)
c('swish', W('semana') - .1, .1); c('swish', W('mes', 3) - .1, .1)
# CTA
wh(L[14][0] + .2, .2, panFrom=-.6, panTo=0); c('slam', W('agora') + .1, .16)
tG = W('link') - .3
c('glitch', tG - .1, .14, dur=.4); c('boom', tG + .12, .26); c('typing', tG + .35, .05, to=F(tG + .8), step=3); c('pop', W('link'), .1)
# ---- v8 additions
for i in range(4): c('pop', .7 + i * .06, .05, f0=900 + i * 80, f1=300)            # hook icons orbiting
for i in range(4): c('pop', W('voce') + i * .06 + .2, .05, f0=800 + i * 60, f1=250)  # tab icons out of the phone
tp = W('saem') - .05; c('click', tp, .1, freq=2200); c('chime', tp + .26, .06, n1=1318.5, n2=1975.5, gap=.06, dur=.6)  # Paguei -> Pago
for w in ['mensal', 'parcelada', 'unica']: c('click', W(w) - .15, .08, freq=2400)    # segmented taps
c('pop', W('unica') + .25, .08)                                                     # aviso chip
for i in range(6): c('pop', L[7][0] + .2 + i * .07, .045, f0=1200 - i * 80, f1=400)   # neon icons appear
wh(W('pra') + .3, .14, dur=.45, f0=3000, f1=400); c('boom', W('sai') - .08, .14); c('shimmer', W('sai'), .07, dur=1.0)  # icons merge -> total
for i in range(4): c('coin', W('reserva') + .15 + i * .14 + .32, .05)                 # coins into the piggy bank
for i in range(12): c('pop', L[9][0] + .2 + i * .05, .03, f0=500 + i * 40, f1=200)    # chart bars
c('scribble', W('mostra'), .05, dur=.8)                                              # line drawing
for i in range(6): c('pop', L[10][0] + .4 + i * .05, .04, f0=900, f1=300)             # tab icons orbit the phone
c('swish', W('cada', 2) - .15, .08); c('thump', W('cada', 2) - .1, .12); c('chime', W('cada', 2) + .15, .06, n1=1568, n2=2349.3, gap=.05, dur=.6)  # FEITO button
c('pop', L[11][0] + 2.0, .08)                                                       # streak chip
c('swish', L[14][0] + .1, .12)                                                      # CTA button rises
cues.sort(key=lambda x: x['frame'])
json.dump(cues, open('sons_v8.json', 'w'), indent=1)
print(len(cues), 'cues')
