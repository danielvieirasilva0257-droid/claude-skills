import {W} from './tempo';
import {SEC} from './rig';

// Efeitos sonoros do v3 (30 fps), presos nas MESMAS palavras da animacao (Cenas.tsx, Tela.tsx, rig.ts).
// Exportado por audio/v3/exportar_sons.ts e sintetizado + mixado por trilha-e-mixagem/mixar_com_efeitos.py.
// Regra (MAPA-SKILLS): swish 1 quadro antes da entrada, impacto no pouso; whoosh com o PICO no quadro de pouso.
// Pouco som em cada coisa: o texto leva swish; so as palavras vermelhas levam "slam"; toques do app levam "click".
// [nome, quadro, ganho, pan, opcoes]
export type Cue = [string, number, number, number, Record<string, number>?];

const whooshTo = (land: number, gain: number, dur = 0.45, peak = 0.75, pan = 0, opts: Record<string, number> = {}): Cue => [
	'whoosh',
	land - Math.round(dur * peak * 30),
	gain,
	pan,
	{dur, peak, ...opts},
];

// pousos (Cenas.tsx): Titulo entra em 16 q com E.out (pousa visualmente em ~+6); M.atras pousa em ~+9
const POUSO_TIT = 6;
const POUSO_ATRAS = 9;
const ESQ = -0.5;
const DIR = 0.5;

// titulo que entra pela borda: swish do lado dele (+ impacto se for palavra vermelha)
const titulo = (at: number, lado: number, forte = false, gain = 0.24): Cue[] => [
	['swish', at - 1, gain, lado],
	...(forte ? ([['slam', at + POUSO_TIT, 0.34, lado * 0.3]] as Cue[]) : []),
];
// cartao/selo que sai de tras do celular: swish curto + pop no pouso (tom sobe a cada um)
const deTras = (at: number, lado: number, f0 = 620, gain = 0.26): Cue[] => [
	['swish', at - 1, gain * 0.7, lado * 0.6],
	['pop', at + POUSO_ATRAS, gain, lado * 0.4, {f0, f1: f0 * 0.26}],
];
// grupo saindo pela borda: um whoosh so, puxado para o lado da saida
const saida = (at: number, lado: number, gain = 0.2): Cue => whooshTo(at + 5, gain, 0.32, 0.7, 0, {panFrom: 0, panTo: lado * 1.4, f0: 1500, f1: 400});
const toque = (at: number, gain = 0.26, pan = 0): Cue => ['click', at, gain, pan, {freq: 2600}];

export const SFX: Cue[] = [
	// ---- abertura: o celular sobe do pe do quadro (mola de z -0,26) e pousa inclinado para cima
	whooshTo(SEC.entra + 10, 0.36, 0.6, 0.7, 0, {f0: 220, f1: 1600}),
	['thump', SEC.entra + 13, 0.28, 0],
	...titulo(W(1, 'Segunda') - 2, ESQ),
	...titulo(W(1, 'eu'), ESQ, false, 0.16),
	// ---- os 3 selos saem de tras do celular, viram icones de app e se espalham
	...deTras(W(2, 'Dieta'), -1, 560),
	...deTras(W(2, 'academia'), -1, 640),
	...deTras(W(2, 'dinheiro'), -1, 720),
	['tick', W(3, 'Aí') + 4, 0.22, -0.3],
	['tick', W(3, 'Aí') + 7, 0.2, 0.3],
	['tick', W(3, 'Aí') + 10, 0.18, -0.2],
	whooshTo(W(3, 'fica') + 6, 0.22, 0.35, 0.6, 0, {panFrom: 0, panTo: -0.7, f0: 600, f1: 3000}),
	whooshTo(W(3, 'fica') + 7, 0.22, 0.35, 0.6, 0, {panFrom: 0, panTo: 0.7, f0: 700, f1: 3400}),
	whooshTo(SEC.procura + 8, 0.12, 0.5, 0.5, 0, {f0: 300, f1: 900}),
	...titulo(W(3, 'diferente') - 2, ESQ, false, 0.2),
	// ---- quarta: os icones fogem pelas bordas e QUARTA entra vermelha
	saida(W(4, 'quarta') - 2, -1, 0.24),
	...titulo(W(4, 'quarta') - 2, DIR, true),
	...titulo(W(4, 'perdeu') - 4, DIR, false, 0.16),
	// tela de bloqueio: data/hora rolam em "quarta" e 3 notificacoes caem (Tela.tsx, Bloqueio)
	['tick', W(4, 'quarta') + 4, 0.14, 0.2],
	['chime', W(4, 'você') + 1, 0.1, 0.15, {n1: 1760, n2: 2349.3, gap: 0.05, dur: 0.35}],
	['chime', W(4, 'perdeu') + 1, 0.1, 0.15, {n1: 1760, n2: 2349.3, gap: 0.05, dur: 0.35}],
	['chime', W(4, 'conta') + 1, 0.11, 0.15, {n1: 1760, n2: 2349.3, gap: 0.05, dur: 0.35}],
	// ---- revelacao (virada da trilha em "junta"): os icones voltam para tras do celular, a tela liga e ele gira
	['pop', W(5, 'junta') + 2, 0.24, -0.3, {f0: 380, f1: 100, dur: 0.14}],
	['pop', W(5, 'as') + 2, 0.24, 0.3, {f0: 420, f1: 110, dur: 0.14}],
	['pop', W(5, 'três') + 2, 0.26, -0.2, {f0: 460, f1: 120, dur: 0.14}],
	whooshTo(SEC.junta + 18, 0.4, 0.7, 0.55, 0, {f0: 200, f1: 2400, panFrom: -0.4, panTo: 0.4}),
	['shimmer', W(5, 'junta') + 6, 0.16, 0, {dur: 1.0}],
	['swish', W(5, 'mesmo') - 7, 0.22, 0],
	['slam', W(5, 'mesmo') - 6 + POUSO_ATRAS, 0.36, 0],
	// ---- habitos: 4 toques, o foguinho soma um
	toque(W(6, 'cumprido') - 1),
	toque(W(6, 'soma'), 0.24),
	toque(W(6, 'um'), 0.24),
	toque(W(6, 'no'), 0.24),
	['pop', W(6, 'foguinho') + 2, 0.38, 0.2, {f0: 900, f1: 230}],
	['chime', W(6, 'foguinho') + 2 + POUSO_ATRAS, 0.2, 0.25, {dur: 0.8}],
	['swish', W(7, 'E') - 2, 0.14, 0.3],
	// ---- metricas: barras crescem; a quarta vazada; FUROU vermelho
	['swish', W(7, 'dá') - 1, 0.12, 0.4],
	['clicks', W(7, 'ver') - 2, 0.09, 0, {to: W(7, 'ver') + 12, step: 2}],
	...titulo(W(7, 'furou') - 2, DIR, true),
	// ---- treino
	toque(W(8, 'Você') - 5, 0.24),
	['swish', W(8, 'Você') - 3, 0.12, 0.4],
	...titulo(W(8, 'semana') - 2, ESQ),
	toque(W(8, 'segunda'), 0.18),
	...deTras(W(8, 'segunda'), -1, 600),
	toque(W(8, 'terça'), 0.18),
	...deTras(W(8, 'terça'), -1, 680),
	saida(W(9, 'Anotou') - 4, -1),
	['swish', W(9, 'Anotou') - 5, 0.12, 0.4],
	// ---- series: digita peso e repeticao, salva, o grafico desenha
	['typing', W(9, 'peso'), 0.12, 0, {to: W(9, 'peso') + 10, step: 2}],
	...deTras(W(9, 'peso'), -1, 600, 0.22),
	['typing', W(9, 'repetição'), 0.12, 0, {to: W(9, 'repetição') + 4, step: 2}],
	...deTras(W(9, 'repetição'), -1, 680, 0.22),
	toque(W(9, 'cai')),
	['chime', W(9, 'cai') + 12, 0.24, 0, {dur: 0.9}],
	['scribble', W(9, 'gráfico'), 0.18, 0.1, {dur: 0.5}],
	...deTras(W(9, 'gráfico'), -1, 780, 0.24),
	saida(W(10, 'Entrou') - 10, -1),
	// ---- financeiro: entra salario (moeda), sai PIX, o saldo acompanha
	toque(W(10, 'Entrou') - 7, 0.24),
	['swish', W(10, 'Entrou') - 5, 0.12, 0.4],
	['swish', W(10, 'salário') - 1, 0.18, 0.3],
	['coin', W(10, 'salário') + POUSO_ATRAS, 0.26, 0.4],
	...deTras(W(10, 'PIX'), 1, 520, 0.22),
	...titulo(W(10, 'saldo') - 2, DIR, true),
	['shimmer', W(10, 'acompanha'), 0.12, 0, {dur: 0.8}],
	saida(W(11, 'Conta') - 10, 1),
	// ---- despesas: Fixa (toque), Pontual (seletor de mola), rosca desenha
	['swish', W(11, 'Conta') - 7, 0.12, 0.4],
	...titulo(W(11, 'fixa') - 2, ESQ),
	toque(W(11, 'fixa'), 0.24),
	toque(W(11, 'pontual') - 1, 0.26),
	...titulo(W(11, 'pontual') - 2, DIR, true),
	['scribble', W(11, 'outro'), 0.14, 0, {dur: 0.6}],
	// ---- fechamento: volta para os habitos, SEGUNDA riscada, LINK NA BIO
	toque(W(12, 'Nem') - 4, 0.24),
	['swish', W(12, 'Nem') - 3, 0.14, -0.4],
	...titulo(W(12, 'segunda') - 4, ESQ),
	['scribble', W(12, 'segunda') + 8, 0.26, -0.2, {dur: 0.4}],
	whooshTo(SEC.cta + 14, 0.34, 0.6, 0.6, 0, {f0: 250, f1: 2200, panFrom: 0.3, panTo: -0.3}),
	['pop', W(13, 'Rotina') - 8, 0.24, 0, {f0: 420, f1: 110, dur: 0.16}],
	...titulo(W(13, 'Baixe') + 6, ESQ),
	...titulo(W(13, 'agora') - 2, DIR, true),
	['swish', W(13, 'Link') - 4, 0.2, 0],
	['pop', W(13, 'Link') - 3 + POUSO_ATRAS, 0.3, 0, {f0: 700, f1: 180}],
	toque(W(13, 'bio') + 2, 0.32),
];
