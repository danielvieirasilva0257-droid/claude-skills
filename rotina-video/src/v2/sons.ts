import {SEC, W} from './tempo';

// Sound effects cue list (frame-accurate, 30 fps). Exported to JSON by audio/v2/exportar_sons.ts and
// synthesized + mixed by audio/v2/mixar_v2.py. Whooshes are placed so their PEAK lands on the landing frame.
// [name, frame, gain, pan, options]
export type Cue = [string, number, number, number, Record<string, number>?];

const whooshTo = (land: number, gain: number, dur = 0.45, peak = 0.75, pan = 0, opts: Record<string, number> = {}): Cue => [
	'whoosh',
	land - Math.round(dur * peak * 30),
	gain,
	pan,
	{dur, peak, ...opts},
];

const H_TAPS = [W(4, 'Marque') + 2, W(4, 'desmarque') + 2, W(4, 'hábitos') + 1, W(4, 'dia') - 2, W(4, 'dia') + 5, W(4, 'veja') + 2];

// landing offsets of the entrance springs (see parts.tsx): Entra lands at +7, Atras at +9, the split titles meet at +8.
// A swish (0.22 s, peak at 60%) started at at-1 peaks on the spring's top speed (+2..+3).
const ENTRA = 7;
const ATRAS = 9;
const TITULO = 8;
// split title: one whoosh per half (left half from the left edge, right half from the right edge) + the hit when they meet
const titulo = (at: number, gain: number): Cue[] => [
	whooshTo(at + 3, gain * 0.5, 0.3, 0.8, 0, {panFrom: -0.8, panTo: -0.1}),
	whooshTo(at + 3, gain * 0.5, 0.3, 0.8, 0, {panFrom: 0.8, panTo: 0.1}),
	['slam', at + TITULO, gain, 0],
];
// text from an edge: swish on the way in (panned from that side) + an optional landing sound
const entra = (at: number, pan: number, land?: Cue): Cue[] => [['swish', at - 1, 0.26, pan], ...(land ? [land] : [])];

export const SFX: Cue[] = [
	// ---- hook: frantic spreadsheet; stickers slide in from the left edge
	['glitch', 0, 0.45, 0],
	['typing', 2, 0.16, 0, {to: 56, step: 2}],
	...entra(W(1, 'sua'), -0.5, ['pop', W(1, 'sua') + ENTRA, 0.3, -0.2, {f0: 520, f1: 150}]),
	...entra(W(1, 'numa'), -0.5, ['pop', W(1, 'numa') + ENTRA, 0.3, -0.1, {f0: 560, f1: 160}]),
	...entra(W(1, 'de'), -0.5, ['pop', W(1, 'de') + ENTRA, 0.3, -0.15, {f0: 600, f1: 170}]),
	// camera pull-back: the screen shrinks into the phone (fastest at "no" + 4); "NO CELULAR?" drops from the top
	whooshTo(W(1, 'no') + 4, 0.42, 0.55, 0.6, 0, {f0: 1800, f1: 250}),
	['slam', W(1, 'no') + 2 + ENTRA, 0.35, 0],
	['chime', W(2, 'treinos') + ENTRA, 0.3, -0.25],
	['swish', W(2, 'treinos') - 1, 0.2, -0.5],
	['chime', W(2, 'faturou') - 3 + ENTRA, 0.3, 0.25],
	['swish', W(2, 'faturou') - 4, 0.2, 0.5],
	['glitch', W(2, 'Mas'), 0.4, 0],
	['clicks', W(2, 'Mas') + 4, 0.18, 0, {to: W(2, 'controle') + 6, step: 2}],
	// the question lines whip in from the right edge
	whooshTo(W(2, 'tudo') + 3, 0.32, 0.25, 0.85, 0, {panFrom: 0.7, panTo: 0.1}),
	['slam', W(2, 'tudo') + ENTRA, 0.4, 0],
	whooshTo(W(2, 'controle') + 3, 0.35, 0.25, 0.85, 0, {panFrom: 0.7, panTo: 0.1}),
	['slam', W(2, 'controle') + ENTRA, 0.45, 0],
	['pop', W(2, 'controle') + ENTRA + 4, 0.4, 0.3, {f0: 900, f1: 220}],
	whooshTo(164, 0.5, 0.35, 0.85),
	// ---- reveal
	['pop', SEC.drop, 0.45, 0, {f0: 420, f1: 110, dur: 0.18}],
	['shimmer', SEC.drop + 3, 0.22, 0, {dur: 1.0}],
	['typing', W(3, 'app'), 0.12, 0, {to: W(3, 'app') + 12, step: 2}],
	['swish', W(3, 'você') - 1, 0.2, -0.5],
	['scribble', W(3, 'você') + 4, 0.22, 0.2, {dur: 0.32}],
	// ---- phone bursts out; HÁBITOS halves meet from both edges
	whooshTo(200, 0.6, 0.6, 0.75, 0, {panFrom: -0.3, panTo: 0.1}),
	['thump', 202, 0.4, 0],
	...titulo(197, 0.42),
	// chips slide out from behind the phone (left side)
	['swish', W(4, 'Marque') - 1, 0.2, -0.4],
	['pop', W(4, 'Marque') + ATRAS - 1, 0.3, -0.4, {f0: 700, f1: 200}],
	['swish', W(4, 'desmarque') - 1, 0.2, -0.4],
	['pop', W(4, 'desmarque') + ATRAS - 1, 0.3, -0.35, {f0: 640, f1: 180}],
	...H_TAPS.map((t, i): Cue => ['click', t, 0.28, 0.1, {freq: 2200 + i * 120}]),
	['swish', W(4, 'sequência') - 7, 0.3, -0.4],
	['chime', W(4, 'sequência') + 3, 0.4, 0.35, {n1: 1568, n2: 2349}],
	whooshTo(266, 0.28, 0.35, 0.8, 0, {panFrom: 0.2, panTo: -0.6}),
	// ---- Métricas: chart card from behind the phone (right), "+34 PTS" from the right edge
	['swish', W(5, 'gráficos') - 3, 0.3, 0.4],
	...Array.from({length: 7}).map((_, i): Cue => ['tick', W(5, 'semana', 0) - 6 + i * 3, 0.16, 0.3]),
	...entra(W(5, 'evoluiu') - 1, 0.6, ['slam', W(5, 'evoluiu') - 1 + ENTRA, 0.45, 0.2]),
	['chime', W(5, 'evoluiu') + ENTRA, 0.22, 0.2],
	// ---- whip to Treino (right -> left, like the ink wipe), then TREINO meets from both edges
	whooshTo(338, 0.7, 0.5, 0.8, 0, {panFrom: 0.6, panTo: -0.6}),
	...titulo(W(6, 'treino'), 0.5),
	['swish', 355, 0.22, 0],
	...entra(362, -0.5),
	...Array.from({length: 7}).map((_, i): Cue => ['pop', 367 + i * 2, 0.2, -0.6 + i * 0.2, {f0: 600 + i * 70, f1: 200}]),
	['shimmer', W(6, 'inteira') - 2, 0.28, 0, {dur: 0.9}],
	whooshTo(396, 0.3, 0.35, 0.8, 0, {panFrom: 0, panTo: -0.6}),
	...entra(W(7, 'Defina'), -0.5),
	...(['força', 'hipertrofia', 'resistência', 'deload'] as const).flatMap((w): Cue[] => [whooshTo(W(7, w) + 3, 0.2, 0.22, 0.85, 0, {panFrom: 0.6, panTo: 0.1}), ['slam', W(7, w) + ENTRA, 0.36, 0.1]]),
	whooshTo(487, 0.35, 0.35, 0.8, 0, {panFrom: 0.2, panTo: -0.6}),
	// ---- Séries: data cards from behind the phone (left), "+19%" from the left edge
	...(['carga', 'repetições', 'séries'] as const).flatMap((w, i): Cue[] => [
		['swish', W(8, w) - 2, 0.2, -0.4],
		['pop', W(8, w) - 1 + ATRAS - 1, 0.32, -0.4, {f0: 680 + i * 40, f1: 190 + i * 10}],
	]),
	['click', W(8, 'veja') - 4, 0.3, 0.2],
	whooshTo(W(8, 'veja') + 4, 0.28, 0.3, 0.8, -0.5),
	['scribble', W(8, 'gráfico') - 1, 0.24, 0, {dur: 0.95}],
	...entra(W(8, 'exercício'), -0.5, ['slam', W(8, 'exercício') + ENTRA, 0.32, -0.3]),
	['chime', W(8, 'exercício') + 3 + ENTRA, 0.42, -0.2],
	// ---- flip to Financeiro, then FINANCEIRO meets from both edges
	whooshTo(578, 0.6, 0.45, 0.8),
	...titulo(585, 0.48),
	['swish', 599, 0.24, 0],
	...entra(603, -0.5),
	['typing', W(9, 'você') + 2, 0.08, 0.3, {to: W(9, 'real') + 2, step: 2}],
	...[0, 1, 2].map((i): Cue => ['pop', W(9, 'cada') - 8 + i * 4 + ATRAS - 1, 0.3, -0.4, {f0: 600 + i * 80, f1: 180}]),
	...[0, 1, 2].map((i): Cue => ['swish', W(9, 'cada') - 8 + i * 4 - 1, 0.16, -0.4]),
	whooshTo(632, 0.24, 0.3, 0.8, 0, {panFrom: 0, panTo: -0.6}),
	whooshTo(642, 0.22, 0.35, 0.8, -0.3),
	// ---- Transações: rows from the right edge, cards from behind the phone (right)
	...entra(W(10, 'entrada') - 1, 0.5, ['coin', W(10, 'entrada') - 1 + ENTRA, 0.42, 0.35]),
	...entra(W(10, 'saída') - 1, 0.5, ['pop', W(10, 'saída') - 1 + ENTRA, 0.34, 0.35, {f0: 420, f1: 120}]),
	['swish', W(10, 'bancos') - 2, 0.36, 0.3],
	['swish', W(10, 'cartões') - 2, 0.36, 0.4],
	whooshTo(708, 0.32, 0.35, 0.8, 0, {panFrom: 0, panTo: 0.6}),
	// ---- Despesas
	...entra(W(11, 'despesa') - 3, -0.4),
	['click', W(11, 'fixa') - 1, 0.42, -0.3],
	['click', W(11, 'pontual') - 1, 0.42, 0.3],
	['swish', W(11, 'pontual'), 0.3, 0.3, {dur: 0.18}],
	['swish', W(11, 'cronograma') - 4, 0.28, -0.4],
	...[0, 1, 2, 3, 4].map((i): Cue => ['tick', W(11, 'cronograma') + 1 + i * 3, 0.18, -0.4]),
	['swish', W(11, 'categoria') - 2, 0.28, -0.4],
	['shimmer', W(11, 'categoria'), 0.24, -0.3, {dur: 0.7}],
	whooshTo(791, 0.32, 0.35, 0.8, 0, {panFrom: 0, panTo: -0.5}),
	// ---- final words from alternating edges, "um app só." rises from behind the phone, zoom through the screen
	...(
		[
			['Hábitos', -0.5],
			['treino', 0.5],
			['dinheiro', -0.5],
		] as const
	).flatMap(([w, pan], i): Cue[] => [['swish', W(12, w) - 2, 0.18, pan], ['slam', W(12, w) - 1 + ENTRA, 0.28 + i * 0.03, pan * 0.3]]),
	['swish', W(12, 'Um') - 1, 0.18, 0],
	['pop', W(12, 'Um') + ATRAS - 1, 0.3, 0, {f0: 500, f1: 140}],
	whooshTo(846, 0.5, 0.5, 0.9, 0, {f0: 200, f1: 7000}),
	['boom', SEC.cta, 0.25, 0, {dur: 1.0}],
	['shimmer', SEC.cta, 0.15, 0, {dur: 1.2}],
	// ---- CTA: button and "link na bio" rise from the bottom edge
	['swish', 850, 0.2, 0],
	['pop', 851 + ENTRA, 0.38, 0, {f0: 520, f1: 150, dur: 0.16}],
	['click', 860, 0.34, 0, {freq: 1800}],
	['chime', 861, 0.2, 0, {n1: 1318.5, n2: 1975.5}],
	['swish', W(13, 'Link') - 2, 0.12, 0, {dur: 0.2}],
	['pop', W(13, 'Link') - 1 + ENTRA, 0.22, 0, {f0: 760, f1: 220}],
	['shimmer', SEC.finalHit, 0.3, 0, {dur: 1.0}],
];
