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

export const SFX: Cue[] = [
	// ---- hook: frantic spreadsheet
	['glitch', 0, 0.45, 0],
	['typing', 2, 0.16, 0, {to: 56, step: 2}],
	['pop', W(1, 'sua'), 0.3, -0.2, {f0: 520, f1: 150}],
	['pop', W(1, 'numa'), 0.3, 0.1, {f0: 560, f1: 160}],
	['pop', W(1, 'de'), 0.3, -0.1, {f0: 600, f1: 170}],
	whooshTo(W(1, 'no') + 10, 0.45, 0.45, 0.7),
	['slam', W(1, 'no'), 0.35, 0],
	['chime', W(2, 'treinos') + 4, 0.3, -0.25],
	['chime', W(2, 'faturou') + 1, 0.3, 0.25],
	['glitch', W(2, 'Mas'), 0.4, 0],
	['clicks', W(2, 'Mas') + 4, 0.18, 0, {to: W(2, 'controle') + 6, step: 2}],
	whooshTo(W(2, 'tudo'), 0.32, 0.25, 0.85, 0.5),
	['slam', W(2, 'tudo'), 0.4, 0],
	whooshTo(W(2, 'controle'), 0.35, 0.25, 0.85, 0.5),
	['slam', W(2, 'controle'), 0.45, 0],
	['pop', W(2, 'controle') + 4, 0.4, 0.3, {f0: 900, f1: 220}],
	whooshTo(164, 0.5, 0.35, 0.85),
	// ---- reveal
	['pop', SEC.drop, 0.45, 0, {f0: 420, f1: 110, dur: 0.18}],
	['shimmer', SEC.drop + 3, 0.22, 0, {dur: 1.0}],
	['typing', W(3, 'app'), 0.12, 0, {to: W(3, 'app') + 12, step: 2}],
	['scribble', W(3, 'você') + 4, 0.22, 0.2, {dur: 0.32}],
	// ---- phone bursts out, Hábitos
	whooshTo(200, 0.6, 0.6, 0.75, 0, {panFrom: -0.3, panTo: 0.1}),
	['thump', 202, 0.4, 0],
	['slam', 196, 0.45, 0],
	['pop', W(4, 'Marque'), 0.32, -0.4, {f0: 700, f1: 200}],
	['pop', W(4, 'desmarque'), 0.32, -0.35, {f0: 640, f1: 180}],
	...H_TAPS.map((t, i): Cue => ['click', t, 0.28, 0.1, {freq: 2200 + i * 120}]),
	['swish', W(4, 'sequência') - 6, 0.3, 0.4],
	['chime', W(4, 'sequência') + 3, 0.4, 0.35, {n1: 1568, n2: 2349}],
	whooshTo(270, 0.28, 0.35, 0.8, -0.3),
	// ---- Métricas
	['swish', W(5, 'gráficos') - 2, 0.3, 0.4],
	...Array.from({length: 7}).map((_, i): Cue => ['tick', W(5, 'semana', 0) - 6 + i * 3, 0.16, 0.3]),
	['slam', W(5, 'evoluiu') - 1, 0.5, 0.2],
	['chime', W(5, 'evoluiu') + 1, 0.22, 0.2],
	// ---- whip to Treino (right -> left, like the ink wipe)
	whooshTo(340, 0.7, 0.5, 0.8, 0, {panFrom: 0.6, panTo: -0.6}),
	['slam', 340, 0.55, 0],
	['swish', W(6, 'monta'), 0.22, 0],
	...Array.from({length: 7}).map((_, i): Cue => ['pop', W(6, 'cada') - 4 + i * 3, 0.2, -0.6 + i * 0.2, {f0: 600 + i * 70, f1: 200}]),
	['shimmer', W(6, 'inteira') - 2, 0.28, 0, {dur: 0.9}],
	whooshTo(400, 0.3, 0.35, 0.8),
	['swish', W(7, 'Defina'), 0.2, 0],
	...(['força', 'hipertrofia', 'resistência', 'deload'] as const).flatMap((w): Cue[] => [whooshTo(W(7, w), 0.2, 0.22, 0.85, 0.5), ['slam', W(7, w), 0.36, 0.1]]),
	whooshTo(484, 0.35, 0.35, 0.8),
	// ---- Séries
	['pop', W(8, 'carga') - 1, 0.34, -0.4, {f0: 680, f1: 190}],
	['pop', W(8, 'repetições') - 1, 0.34, -0.4, {f0: 720, f1: 200}],
	['pop', W(8, 'séries') - 1, 0.34, -0.4, {f0: 760, f1: 210}],
	['click', W(8, 'veja') - 4, 0.3, 0.2],
	whooshTo(W(8, 'veja') + 6, 0.28, 0.3, 0.8, -0.5),
	['scribble', W(8, 'gráfico') - 1, 0.24, 0, {dur: 0.95}],
	['chime', W(8, 'evoluiu'), 0.42, 0.3],
	['slam', W(8, 'evoluiu'), 0.32, 0.3],
	// ---- flip to Financeiro
	whooshTo(580, 0.6, 0.45, 0.8),
	['slam', 580, 0.52, 0],
	['swish', W(9, 'você') - 1, 0.3, 0.4],
	['typing', W(9, 'você') + 2, 0.08, 0.3, {to: W(9, 'real') + 2, step: 2}],
	...[0, 1, 2].map((i): Cue => ['pop', W(9, 'cada') + 2 + i * 4, 0.3, -0.4, {f0: 600 + i * 80, f1: 180}]),
	['scribble', W(9, 'cada'), 0.16, -0.2, {dur: 0.5}],
	['swish', 630, 0.2, 0],
	whooshTo(642, 0.25, 0.35, 0.8, -0.3),
	['coin', W(10, 'entrada') - 1, 0.42, 0.35],
	['pop', W(10, 'saída') - 1, 0.34, 0.35, {f0: 420, f1: 120}],
	['swish', W(10, 'bancos') - 1, 0.4, 0.3],
	['swish', W(10, 'cartões') - 1, 0.4, 0.4],
	whooshTo(710, 0.32, 0.35, 0.8, 0.5),
	// ---- Despesas
	['swish', W(11, 'despesa') - 3, 0.3, 0],
	['click', W(11, 'fixa') - 1, 0.42, -0.3],
	['click', W(11, 'pontual') - 1, 0.42, 0.3],
	['swish', W(11, 'pontual'), 0.3, 0.3, {dur: 0.18}],
	['swish', W(11, 'cronograma') - 3, 0.28, -0.4],
	...[0, 1, 2, 3, 4].map((i): Cue => ['tick', W(11, 'cronograma') + 1 + i * 3, 0.18, -0.4]),
	['swish', W(11, 'categoria') - 3, 0.28, -0.4],
	['shimmer', W(11, 'categoria'), 0.24, -0.3, {dur: 0.7}],
	whooshTo(795, 0.32, 0.35, 0.8),
	// ---- final words + zoom through the screen
	['slam', W(12, 'Hábitos') - 1, 0.34, 0],
	['slam', W(12, 'treino') - 1, 0.36, 0],
	['slam', W(12, 'dinheiro') - 1, 0.42, 0],
	whooshTo(834, 0.38, 0.3, 0.8),
	['pop', W(12, 'app') - 1, 0.3, 0, {f0: 500, f1: 140}],
	whooshTo(846, 0.5, 0.5, 0.9, 0, {f0: 200, f1: 7000}),
	['boom', SEC.cta, 0.32, 0, {dur: 1.0}],
	['shimmer', SEC.cta, 0.15, 0, {dur: 1.2}],
	// ---- CTA
	['pop', W(13, 'Baixe') + 5, 0.45, 0, {f0: 520, f1: 150, dur: 0.16}],
	['click', W(13, 'agora'), 0.4, 0, {freq: 1800}],
	['chime', W(13, 'agora') + 1, 0.2, 0, {n1: 1318.5, n2: 1975.5}],
	['pop', W(13, 'Link') - 1, 0.22, 0, {f0: 760, f1: 220}],
	['swish', W(13, 'Link'), 0.12, 0, {dur: 0.2}],
	['shimmer', SEC.finalHit, 0.3, 0, {dur: 1.0}],
];
