import {TEMPOS5 as T} from './Cenas5';
import {INTRO5, W5} from './tempo5';

// Efeitos sonoros do v5 (30 fps), presos aos mesmos quadros da animacao (Cenas5.tsx).
// Exportado por audio/v5/exportar_sons.ts e sintetizado + mixado por trilha-e-mixagem/mixar_com_efeitos.py.
// Como no modelo: poucos efeitos e baixos (a trilha ja marca as viradas); whoosh com o PICO no quadro de pouso.
// [nome, quadro, ganho, pan, opcoes]
export type Cue = [string, number, number, number, Record<string, number>?];

const whooshTo = (land: number, gain: number, dur = 0.45, peak = 0.75, pan = 0, opts: Record<string, number> = {}): Cue => [
	'whoosh',
	land - Math.round(dur * peak * 30),
	gain,
	pan,
	{dur, peak, ...opts},
];
// digitacao: um clique por letra, alternando um pouco o tom
const digita = (ini: number, fim: number, n: number, gain = 0.07): Cue[] =>
	Array.from({length: n}, (_, i) => ['click', Math.round(ini + ((fim - ini) * i) / Math.max(1, n - 1)), gain, 0.1 * ((i % 3) - 1), {freq: 3000 + 400 * (i % 2)}] as Cue);
// numero contando: cliques subindo de tom
const conta = (ini: number, fim: number, n: number, gain = 0.05): Cue[] =>
	Array.from({length: n}, (_, i) => ['click', Math.round(ini + ((fim - ini) * i) / (n - 1)), gain, 0, {freq: 1800 + (1600 * i) / (n - 1)}] as Cue);
const pan = (a: number, b: number, g = 0.07): Cue => whooshTo(b, g, 0.25, 0.7, 0, {f0: 900, f1: 2600});

const A = T.app;
export const SFX: Cue[] = [
	// ================= GANCHO: o celular chega, a camera avanca, a notificacao salta
	whooshTo(24, 0.3, 0.7, 0.7, 0, {f0: 200, f1: 1800, panFrom: -0.4, panTo: 0}),
	['thump', 26, 0.14, 0],
	whooshTo(INTRO5.salta + 4, 0.12, 0.6, 0.8, 0, {f0: 300, f1: 1400}),
	['chime', T.salta + 1, 0.08, 0, {n1: 1760, n2: 2349.3, gap: 0.05, dur: 0.35}],
	['pop', T.salta + 4, 0.18, 0, {f0: 820, f1: 260}],
	whooshTo(T.saiAviso + 6, 0.08, 0.3, 0.7, 0, {f0: 2400, f1: 600}),
	['pop', W5(1, 'quanto', 1) + 4, 0.12, 0.1, {f0: 1200, f1: 700, dur: 0.08}],
	['pop', W5(1, 'sobra') + 3, 0.16, 0, {f0: 520, f1: 180}],
	// ================= LISTA: entra de baixo e rola secao por secao
	['swish', T.entraLista - 7, 0.1, 0],
	whooshTo(T.entraLista + 8, 0.2, 0.45, 0.7, 0, {f0: 250, f1: 2200}),
	...T.secoes.slice(1).flatMap((at): Cue[] => [whooshTo(at + 5, 0.14, 0.3, 0.7, 0, {f0: 600, f1: 2600}), ['tick', at + 8, 0.1, 0.2]]),
	whooshTo(T.saiLista + 6, 0.18, 0.35, 0.7, 0, {f0: 400, f1: 3000}),
	// ================= RESUMO: chega de baixo, a barra cresce, a sobra acende
	['thump', T.resumo + 8, 0.12, 0],
	...conta(W5(3, 'isso'), W5(3, 'isso') + 12, 5, 0.05),
	['shimmer', T.acende, 0.1, 0, {dur: 0.9}],
	['pop', T.acende + 1, 0.14, 0, {f0: 900, f1: 400, dur: 0.1}],
	// ================= O CARTAO VIRA O ICONE, O ICONE VIRA A MARCA
	whooshTo(T.logo - 1, 0.18, 0.4, 0.8, 0, {f0: 2600, f1: 300}),
	['pop', T.logo, 0.2, 0, {f0: 640, f1: 170}],
	['swish', T.logo + 6, 0.1, 0.2],
	whooshTo(T.logoSai + 8, 0.22, 0.4, 0.8, 0, {f0: 300, f1: 3200}),
	// ================= APP: digita, aperta, alterna; a camera passeia
	['thump', A.entra + 4, 0.1, 0],
	...digita(A.digita1, A.digita1 + 8, 7),
	pan(A.valor1 - 3, A.valor1 + 1),
	...digita(A.valor1, A.valor1 + 6, 5),
	['click', A.aperta1, 0.22, 0, {freq: 2000}],
	['pop', A.aperta1 + 2, 0.16, 0, {f0: 760, f1: 300}],
	pan(A.aperta1 + 1, A.aperta1 + 4, 0.06),
	pan(A.alterna - 5, A.alterna + 1),
	['click', A.alterna - 2, 0.18, 0.2, {freq: 2200}],
	['swish', A.alterna, 0.08, 0.3],
	...digita(A.digita2, A.digita2 + 4, 4),
	pan(A.digita2 - 1, A.digita2 + 2, 0.05),
	...digita(A.valor2, A.valor2 + 2, 3),
	['click', A.aperta2, 0.22, 0, {freq: 2000}],
	['pop', A.aperta2 + 2, 0.16, 0, {f0: 640, f1: 260}],
	whooshTo(A.sai + 6, 0.18, 0.35, 0.7, 0, {f0: 400, f1: 3000}),
	// ================= RESULTADO: o numero conta
	['thump', T.resultado.at + 10, 0.1, 0],
	...conta(T.resultado.conta, T.resultado.ate - 4, 8),
	['shimmer', T.resultado.acende, 0.09, 0, {dur: 0.8}],
	['pop', T.resultado.detalhe + 2, 0.12, -0.2, {f0: 1100, f1: 600, dur: 0.08}],
	['pop', T.resultado.detalhe + 5, 0.12, 0.2, {f0: 980, f1: 540, dur: 0.08}],
	whooshTo(T.resultado.sai + 6, 0.16, 0.35, 0.7, 0, {f0: 400, f1: 3000}),
	// ================= TREINO E HABITOS
	['pop', W5(5, 'treino') + 2, 0.14, -0.2, {f0: 560, f1: 180}],
	['pop', W5(5, 'hábitos') + 2, 0.14, 0.2, {f0: 620, f1: 200}],
	whooshTo(T.b5Sai + 5, 0.22, 0.35, 0.7, 0, {panFrom: 0, panTo: -1.2, f0: 1500, f1: 400}),
	// ================= CTA: botao pela direita, cursor clica em "agora"
	whooshTo(T.cta.entra + 7, 0.24, 0.35, 0.75, 0, {panFrom: 1.2, panTo: 0, f0: 400, f1: 2400}),
	['swish', T.cta.clica - 12, 0.06, 0.5],
	['click', T.cta.clica, 0.3, 0.2, {freq: 2200}],
	['pop', T.cta.clica + 1, 0.18, 0.2, {f0: 700, f1: 220}],
	['swish', T.cta.sai, 0.1, 0],
	// ================= FINAL: a marca
	['pop', T.fim.at + 2, 0.18, 0, {f0: 600, f1: 160}],
	['swish', T.fim.at + 8, 0.1, 0.2],
	['shimmer', T.fim.batida, 0.11, 0, {dur: 1.4}],
	['swish', T.fim.sub, 0.06, 0],
];
