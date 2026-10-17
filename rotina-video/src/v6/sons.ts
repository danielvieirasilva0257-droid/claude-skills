import {T6, TRECHOS} from './plano6';

// Efeitos sonoros do v6 (30 fps), presos aos mesmos quadros da animacao (plano6.ts).
// Exportado por audio/v6/exportar_sons.ts e sintetizado + mixado por trilha-e-mixagem/mixar_com_efeitos.py.
// Como no v5: poucos efeitos e baixos; whoosh com o PICO no quadro de pouso. Cada mergulho tem um whoosh que chega,
// cada elemento que sobe tem um pop, cada saida um whoosh curto para cima.
// [nome, quadro, ganho, pan, opcoes]
export type Cue = [string, number, number, number, Record<string, number>?];

const whooshTo = (land: number, gain: number, dur = 0.45, peak = 0.75, pan = 0, opts: Record<string, number> = {}): Cue => [
	'whoosh',
	land - Math.round(dur * peak * 30),
	gain,
	pan,
	{dur, peak, ...opts},
];
const toque = (at: number, gain = 0.12, pan = 0.1): Cue => ['click', at, gain, pan, {freq: 2600}];
const pop = (at: number, f0 = 760, gain = 0.15, pan = 0): Cue => ['pop', at, gain, pan, {f0, f1: f0 * 0.32}];
const conta = (ini: number, fim: number, n: number, gain = 0.045): Cue[] =>
	Array.from({length: n}, (_, i) => ['click', Math.round(ini + ((fim - ini) * i) / (n - 1)), gain, 0, {freq: 1800 + (1600 * i) / (n - 1)}] as Cue);
const digita = (ats: number[], gain = 0.07): Cue[] => ats.map((a, i) => ['click', a, gain, 0.1 * ((i % 3) - 1), {freq: 3000 + 400 * (i % 2)}] as Cue);
const sobe = (at: number, gain = 0.1): Cue => whooshTo(at + 6, gain, 0.3, 0.7, 0, {f0: 600, f1: 3200});

// mergulhos (N) e voltas (P): whoosh grave chegando / whoosh claro saindo
const camera: Cue[] = TRECHOS.slice(1).map((t) =>
	t.modo === 'N' ? whooshTo(t.de + (t.dur ?? 16), 0.13, 0.55, 0.85, 0, {f0: 260, f1: 1500}) : whooshTo(t.de + (t.dur ?? 14) - 2, 0.09, 0.4, 0.7, 0, {f0: 1800, f1: 500}),
);

export const SFX: Cue[] = [
	// ================= gancho: o celular chega, a camera mergulha, "?? kg" sobe
	whooshTo(24, 0.28, 0.7, 0.7, 0, {f0: 200, f1: 1800, panFrom: 0.4, panTo: 0}),
	['thump', 26, 0.14, 0],
	...camera,
	['chime', T6.pop1, 0.07, 0, {n1: 1760, n2: 2349.3, gap: 0.05, dur: 0.35}],
	pop(T6.pop1 + 2, 820, 0.16),
	sobe(T6.p1 - 6),
	// ================= estilos por semana: 4 cartoes, tom subindo
	...T6.semanas.map((a, i) => pop(a + 1, 560 + 90 * i, 0.15, -0.2 + 0.13 * i)),
	sobe(T6.p2 - 8, 0.12),
	// ================= checklist do treino (toques na tela) e o toque no estilo
	...T6.checks.flatMap((a, i): Cue[] => [toque(a, 0.1, 0.15), pop(a + 3, 1100 + 80 * i, 0.07, 0.15)]),
	toque(T6.tocaEstilo, 0.12),
	['swish', T6.tela3, 0.06, 0.3],
	// ================= series e repeticoes
	pop(T6.popSeries + 1, 700, 0.14),
	toque(T6.maisSerie - 1, 0.16),
	['tick', T6.maisSerie + 1, 0.1, 0.1],
	pop(T6.popReps + 1, 640, 0.14),
	toque(T6.maisReps - 1, 0.16),
	['tick', T6.maisReps + 1, 0.1, -0.1],
	sobe(T6.p3 - 6),
	// ================= fechou doze: digita as repeticoes; o app manda subir a carga
	...digita([T6.doze - 9, T6.doze - 8, T6.doze - 4, T6.doze - 3, T6.doze + 1, T6.doze + 2]),
	['chime', T6.popAviso, 0.07, 0.2, {n1: 1318.5, n2: 1975.5, gap: 0.06, dur: 0.5}],
	pop(T6.popAviso + 2, 900, 0.14),
	// ================= recorde e 1RM (a trilha tem um impacto no "recorde")
	toque(T6.popRecorde - 6, 0.14),
	['coin', T6.popRecorde + 1, 0.1, 0],
	['shimmer', T6.popRecorde + 2, 0.1, 0, {dur: 1.0}],
	sobe(T6.popRM - 8, 0.08),
	pop(T6.popRM + 1, 600, 0.14),
	...conta(T6.popRM + 3, T6.popRM + 26, 9),
	sobe(T6.p4 - 7, 0.12),
	// ================= grafico semana a semana, mes a mes
	pop(T6.popGrafico + 1, 680, 0.14),
	['scribble', T6.popGrafico + 3, 0.08, 0, {dur: 0.6}],
	toque(T6.meses - 3, 0.14),
	['scribble', T6.meses + 1, 0.06, 0.1, {dur: 0.4}],
	pop(T6.meses + 11, 1000, 0.1),
	sobe(T6.tela6 - 4, 0.1),
	// ================= meta de cardio: o anel enche, "faltam 30 min"
	pop(T6.popCardio + 1, 720, 0.14),
	...conta(T6.popCardio + 3, T6.falta - 4, 8, 0.04),
	pop(T6.falta + 1, 520, 0.16),
	sobe(T6.p5 - 6),
	// ================= habitos: o outro checklist, a sequencia sobe
	...T6.habTaps.flatMap((a, i): Cue[] => [toque(a, 0.1, -0.15), pop(a + 3, 1100 + 80 * i, 0.07, -0.15)]),
	pop(T6.popSeq + 1, 700, 0.14),
	['tick', T6.sobe + 1, 0.12, 0],
	['shimmer', T6.sobe + 2, 0.09, 0, {dur: 0.9}],
	sobe(T6.p6 - 6),
	// ================= financeiro: entra, sai, sobra
	pop(T6.popEntra + 1, 820, 0.15, -0.2),
	pop(T6.popSai + 1, 600, 0.15, 0.2),
	pop(T6.popSobra + 1, 700, 0.15),
	...conta(T6.popSobra + 3, T6.popSobra + 15, 6),
	sobe(T6.p7 - 6, 0.12),
	// ================= tudo num app so: toques nas abas e o celular sai por baixo
	...T6.abas.slice(0, 2).map((a) => toque(a, 0.12, 0)),
	whooshTo(T6.fora + 12, 0.2, 0.4, 0.75, 0, {f0: 1600, f1: 300}),
	// ================= CTA: botao pela direita, cursor clica em "agora"
	whooshTo(T6.cta + 7, 0.24, 0.35, 0.75, 0, {panFrom: 1.2, panTo: 0, f0: 400, f1: 2400}),
	['swish', T6.clica - 12, 0.06, 0.5],
	['click', T6.clica, 0.3, 0.2, {freq: 2200}],
	pop(T6.clica + 1, 700, 0.18, 0.2),
	['swish', T6.ctaSai, 0.1, 0],
	// ================= marca
	pop(T6.logo + 2, 600, 0.18),
	['swish', T6.logo + 8, 0.1, 0.2],
	['shimmer', T6.batida, 0.11, 0, {dur: 1.4}],
	['swish', T6.bio, 0.06, 0],
];
