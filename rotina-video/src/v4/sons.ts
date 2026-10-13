import {W} from '../v3/tempo';
import {SEC} from '../v3/rig';
import {T} from './base';

// Efeitos sonoros do v4 (30 fps), presos aos mesmos quadros da animacao (Cenas.tsx e Video.tsx do v4).
// Exportado por audio/v4/exportar_sons.ts e sintetizado + mixado por trilha-e-mixagem/mixar_com_efeitos.py.
// Pousos: Entra +7, Atras +9, titulo dividido (as metades se encontram) +9. Whoosh com o PICO no quadro de pouso.
// [nome, quadro, ganho, pan, opcoes]
export type Cue = [string, number, number, number, Record<string, number>?];

const whooshTo = (land: number, gain: number, dur = 0.45, peak = 0.75, pan = 0, opts: Record<string, number> = {}): Cue => [
	'whoosh',
	land - Math.round(dur * peak * 30),
	gain,
	pan,
	{dur, peak, ...opts},
];
// titulo gigante dividido: uma metade de cada borda + o impacto quando se encontram (mais baixo se cair em inicio de palavra)
const dividida = (at: number, gain = 0.34): Cue[] => [
	whooshTo(at + 6, gain * 0.5, 0.3, 0.8, 0, {panFrom: -0.8, panTo: -0.1}),
	whooshTo(at + 6, gain * 0.5, 0.3, 0.8, 0, {panFrom: 0.8, panTo: 0.1}),
	['slam', at + 9, gain, 0],
];
// entra pela borda: swish do lado dela (+ pouso opcional)
const entra = (at: number, pan: number, gain = 0.22, pouso?: Cue): Cue[] => [['swish', at - 1, gain, pan], ...(pouso ? [pouso] : [])];
// sai de tras do celular: swish curto + pop no pouso
const atras = (at: number, pan: number, f0 = 620, gain = 0.26): Cue[] => [
	['swish', at - 1, gain * 0.7, pan * 0.6],
	['pop', at + 9, gain, pan * 0.4, {f0, f1: f0 * 0.26}],
];
// grupo saindo pela borda
const saida = (at: number, lado: number, gain = 0.2): Cue => whooshTo(at + 5, gain, 0.32, 0.7, 0, {panFrom: 0, panTo: lado * 1.4, f0: 1500, f1: 400});
const toque = (at: number, gain = 0.24, pan = 0): Cue => ['click', at, gain, pan, {freq: 2600}];

export const SFX: Cue[] = [
	// ================= GANCHO (papel)
	...dividida(-2, 0.3),
	whooshTo(SEC.entra + 10, 0.32, 0.6, 0.7, 0.2, {f0: 220, f1: 1600}), // o celular sobe da borda de baixo
	['thump', SEC.entra + 13, 0.24, 0.2],
	...entra(W(1, 'eu'), 0.5, 0.2),
	// adesivos pela borda esquerda (pop no pouso, tom subindo)
	...entra(W(2, 'Dieta') - 1, -0.5, 0.24, ['pop', W(2, 'Dieta') + 6, 0.3, -0.3, {f0: 520, f1: 150}]),
	...entra(W(2, 'academia') - 1, -0.5, 0.24, ['pop', W(2, 'academia') + 6, 0.3, -0.25, {f0: 600, f1: 160}]),
	...entra(W(2, 'dinheiro') - 2, -0.5, 0.24, ['pop', W(2, 'dinheiro') + 5, 0.3, -0.2, {f0: 680, f1: 170}]),
	// viram 3 apps, se espalham, ganham notificacao
	['tick', W(3, 'Aí') + 3, 0.2, -0.3],
	['tick', W(3, 'Aí') + 5, 0.2, -0.1],
	['tick', W(3, 'Aí') + 7, 0.2, -0.2],
	whooshTo(W(3, 'fica') + 8, 0.2, 0.35, 0.6, 0, {panFrom: -0.6, panTo: -0.2, f0: 700, f1: 3200}),
	['pop', W(3, 'num') + 2, 0.22, -0.4, {f0: 1400, f1: 900, dur: 0.08}],
	['pop', W(3, 'app') + 2, 0.22, -0.2, {f0: 1500, f1: 950, dur: 0.08}],
	['pop', W(3, 'diferente') + 2, 0.24, -0.3, {f0: 1600, f1: 1000, dur: 0.08}],
	...dividida(W(3, 'diferente') - 2, 0.26),
	// QUARTA: data e hora rolam no celular, 3 notificacoes caem; os apps caem para fora do quadro
	saida(W(4, 'Na') - 5, -1, 0.14),
	...dividida(W(4, 'quarta') - 2, 0.28),
	['tick', W(4, 'quarta') + 4, 0.14, 0.4],
	...entra(W(4, 'você'), -0.5, 0.12),
	['chime', W(4, 'você') + 1, 0.07, 0.3, {n1: 1760, n2: 2349.3, gap: 0.05, dur: 0.35}],
	['chime', W(4, 'perdeu') + 1, 0.07, 0.3, {n1: 1760, n2: 2349.3, gap: 0.05, dur: 0.35}],
	['chime', W(4, 'conta') + 1, 0.07, 0.3, {n1: 1760, n2: 2349.3, gap: 0.05, dur: 0.35}],
	['whoosh', W(4, 'perdeu') + 2, 0.1, -0.5, {dur: 0.5, peak: 0.4, f0: 2600, f1: 300}],
	['whoosh', W(4, 'perdeu') + 6, 0.09, -0.2, {dur: 0.5, peak: 0.4, f0: 2400, f1: 280}],
	saida(T.redIn - 9, -1, 0.2),
	// ================= REVELACAO (vermelho de tras do celular na virada)
	whooshTo(W(5, 'junta'), 0.38, 0.6, 0.8, 0, {f0: 200, f1: 2400}),
	['boom', W(5, 'junta'), 0.26, 0, {dur: 1.0}],
	['pop', W(5, 'junta') + 2, 0.22, -0.3, {f0: 380, f1: 100, dur: 0.14}],
	['pop', W(5, 'as') + 2, 0.22, 0.1, {f0: 420, f1: 110, dur: 0.14}],
	['pop', W(5, 'três') + 2, 0.24, 0.3, {f0: 460, f1: 120, dur: 0.14}],
	['shimmer', W(5, 'junta') + 6, 0.14, 0, {dur: 1.0}],
	['swish', W(5, 'mesmo') - 7, 0.22, 0],
	['slam', W(5, 'mesmo') - 6 + 9, 0.34, 0],
	...entra(W(5, 'no'), -0.5, 0.18),
	whooshTo(T.paperIn + 6, 0.26, 0.45, 0.7, 0, {f0: 300, f1: 2600}),
	// ================= HABITOS (papel)
	...dividida(W(6, 'Cada'), 0.3),
	...atras(W(6, 'cumprido') - 1, 0.5, 640),
	toque(W(6, 'cumprido') - 1, 0.2),
	toque(W(6, 'soma'), 0.18),
	toque(W(6, 'um'), 0.18),
	toque(W(6, 'no'), 0.18),
	...atras(W(6, 'soma') - 2, 0.5, 560),
	['pop', W(6, 'foguinho') + 2, 0.36, 0.3, {f0: 900, f1: 230}],
	['chime', W(6, 'foguinho') + 4, 0.18, 0.35, {dur: 0.8}],
	saida(W(7, 'E') - 3, 1, 0.18),
	...atras(W(7, 'dá') - 1, 0.5, 600),
	['clicks', W(7, 'ver') - 6, 0.08, 0.4, {to: W(7, 'ver') + 12, step: 2}],
	['pop', W(7, 'furou'), 0.3, 0.4, {f0: 700, f1: 200}],
	...entra(W(7, 'furou') - 2, 0.5, 0.2, ['slam', W(7, 'furou') + 5, 0.36, 0.3]),
	// ================= TREINO (tinta varre da esquerda)
	whooshTo(T.inkIn + 7, 0.36, 0.5, 0.6, 0, {panFrom: -0.9, panTo: 0.9, f0: 250, f1: 2000}),
	toque(W(8, 'Você') - 5, 0.2),
	...dividida(W(8, 'Você'), 0.3),
	['swish', W(8, 'semana') - 3, 0.14, 0],
	...entra(W(8, 'semana'), -0.5, 0.22, ['thump', W(8, 'semana') + 7, 0.22, -0.3]),
	['pop', W(8, 'segunda') + 1, 0.28, -0.6, {f0: 820, f1: 260}],
	['pop', W(8, 'terça') + 1, 0.28, -0.4, {f0: 900, f1: 280}],
	saida(W(9, 'Anotou') - 4, -1, 0.18),
	['typing', W(9, 'peso'), 0.1, 0.3, {to: W(9, 'peso') + 10, step: 2}],
	...atras(W(9, 'peso') - 1, -0.5, 600, 0.22),
	['typing', W(9, 'repetição'), 0.1, 0.3, {to: W(9, 'repetição') + 4, step: 2}],
	...atras(W(9, 'repetição') - 1, -0.5, 680, 0.22),
	toque(W(9, 'cai'), 0.22, 0.3),
	saida(W(9, 'cai') + 2, -1, 0.14),
	whooshTo(W(9, 'gráfico') + 6, 0.24, 0.75, 0.9, 0, {panFrom: -0.7, panTo: 0.7, f0: 300, f1: 2200}),
	['chime', W(9, 'cai') + 12, 0.2, 0.3, {dur: 0.9}],
	['pop', W(9, 'gráfico') + 6, 0.3, 0.6, {f0: 1000, f1: 300}],
	...entra(W(9, 'gráfico'), -0.5, 0.2),
	// ================= FINANCEIRO (papel varre da direita)
	whooshTo(T.paper2In + 7, 0.34, 0.5, 0.6, 0, {panFrom: 0.9, panTo: -0.9, f0: 250, f1: 2000}),
	toque(W(10, 'Entrou') - 7, 0.2),
	...dividida(W(10, 'Entrou'), 0.28),
	['swish', W(10, 'salário') + 4, 0.12, 0],
	...atras(W(10, 'salário') - 1, 0.5, 700),
	['coin', W(10, 'salário') + 9, 0.24, 0.4],
	...atras(W(10, 'PIX') - 1, 0.5, 480, 0.22),
	...entra(W(10, 'saldo') - 2, 0.5, 0.16),
	['typing', W(10, 'saldo'), 0.09, 0.4, {to: W(10, 'saldo') + 14, step: 2}],
	['thump', W(10, 'saldo') + 7, 0.2, 0.4],
	['scribble', W(10, 'acompanha') - 4, 0.18, 0.4, {dur: 0.35}],
	saida(W(11, 'Conta') - 10, 1, 0.2),
	...entra(W(11, 'Conta') - 3, -0.5, 0.22, ['thump', W(11, 'Conta') + 4, 0.22, -0.2]),
	toque(W(11, 'fixa'), 0.26, -0.3),
	...entra(W(11, 'de'), -0.5, 0.14),
	toque(W(11, 'pontual') - 1, 0.28, 0.3),
	['pop', W(11, 'pontual') + 3, 0.22, 0.3, {f0: 760, f1: 240}],
	...entra(W(11, 'do'), 0.5, 0.14),
	['scribble', W(11, 'outro'), 0.12, 0, {dur: 0.5}],
	saida(W(12, 'Nem') - 6, -1, 0.2),
	// ================= FECHAMENTO
	toque(W(12, 'Nem') - 4, 0.2),
	...entra(W(12, 'Nem'), -0.5, 0.18),
	...entra(W(12, 'segunda') - 4, 0.5, 0.22, ['slam', W(12, 'segunda') + 3, 0.3, 0.3]),
	['scribble', W(12, 'segunda') + 4, 0.26, 0.2, {dur: 0.4}],
	// ================= CTA (vermelho de tras do celular)
	whooshTo(T.redEnd + 6, 0.32, 0.5, 0.7, 0, {f0: 220, f1: 2400}),
	['boom', T.redEnd + 4, 0.2, 0, {dur: 0.8}],
	whooshTo(W(13, 'Baixe') + 7, 0.26, 0.4, 0.8, 0, {f0: 2400, f1: 400}),
	['thump', W(13, 'Baixe') + 8, 0.26, 0],
	['shimmer', W(13, 'Rotina') - 6, 0.12, 0, {dur: 0.8}],
	toque(W(13, 'agora'), 0.34),
	['pop', W(13, 'agora') + 3, 0.26, 0, {f0: 520, f1: 160}],
	['swish', W(13, 'Link') - 2, 0.2, 0],
	['pop', W(13, 'Link') - 1 + 9, 0.26, 0, {f0: 700, f1: 180}],
	['shimmer', 862, 0.1, 0, {dur: 1.0}],
];
