import {Easing, interpolate, spring} from 'remotion';
export {body, display} from '../theme'; // Barlow / Barlow Condensed (fontes do app, carregadas em ../theme)

// Rotina v3: "palco escuro" da marca (DESIGN do video no MAPA-SKILLS, parte 2.1).
// Um acento so: #CC0000 para preencher, #FF5A5A para a palavra que a voz diz. Nada de #000 puro.
export const K = {
	bg: '#080808',
	halo: '#141414',
	s1: '#101010',
	s2: '#151515',
	s3: '#1D1D1D',
	line: '#262626',
	text: '#F5F5F7',
	text2: '#A3A3A3',
	red: '#CC0000',
	redHi: '#FF5A5A',
};

// Curvas (cubic-bezier, iguais no Blender e no Remotion)
export const E = {
	out: Easing.bezier(0.16, 1, 0.3, 1), // titulo/cartao chegando (expo-out)
	pull: Easing.bezier(0.52, 0.01, 0, 1), // "puxada de foco" (premium com peso)
	snap: Easing.bezier(0.72, 0, 0.12, 1), // encaixe
	ui: Easing.bezier(0.23, 1, 0.32, 1), // UI dentro da tela do app
	uiMove: Easing.bezier(0.77, 0, 0.175, 1), // mover algo que ja esta na tela
	press: Easing.bezier(0.25, 0.46, 0.45, 0.94), // toque
	exit: Easing.bezier(0.7, 0, 0.84, 0), // saida acelerando
	cam: Easing.bezier(0.33, 0, 0.67, 1), // easy ease (camera, deriva)
	whip: Easing.bezier(0.83, 0, 0.17, 1),
	drift: Easing.bezier(0.3, 0.15, 0.2, 1), // entra no corte ja andando
	dolly: Easing.bezier(0.65, 0, 0.35, 1), // sai e chega parado
	lin: (t: number) => t,
};

export const tw = (f: number, range: [number, number], out: [number, number], e: (t: number) => number = E.out) =>
	interpolate(f, range, out, {easing: e, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

// Molas por funcao (nunca a padrao {100,10})
export const M = {
	texto: {stiffness: 300, damping: 26}, // texto entrando da borda (pousa em ~7 q)
	metades: {stiffness: 320, damping: 38}, // titulo dividido, sem passar do ponto
	atras: {stiffness: 170, damping: 20}, // cartao saindo de tras do celular (~9 q, ~2%)
	ui: {stiffness: 380, damping: 31}, // chegada premium de UI
	painel: {stiffness: 80, damping: 14},
	seletor: {stiffness: 650, damping: 40, mass: 0.5}, // destaque deslizante
	aba: {stiffness: 400, damping: 50, mass: 3}, // troca de aba dentro da tela
	pop: {stiffness: 400, damping: 28}, // check, chama: ~4%
};
export const sp = (f: number, at: number, config: {stiffness: number; damping: number; mass?: number} = M.ui) =>
	f < at ? 0 : spring({frame: f - at, fps: 30, config});

// Chaves estilo After Effects: [quadro, valor, curva do trecho que TERMINA nesta chave]
export type Key = [number, number, ((t: number) => number)?];
export const kf = (f: number, keys: Key[]) => {
	if (f <= keys[0][0]) return keys[0][1];
	for (let i = 1; i < keys.length; i++) {
		const [f1, v1, e] = keys[i];
		const [f0, v0] = keys[i - 1];
		if (f <= f1) return f1 === f0 ? v1 : interpolate(f, [f0, f1], [v0, v1], {easing: e ?? E.cam});
	}
	return keys[keys.length - 1][1];
};

export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
