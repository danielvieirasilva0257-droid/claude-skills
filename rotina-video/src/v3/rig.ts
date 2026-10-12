import {E, kf, Key} from './theme';
import {W} from './tempo';
import {Pose, poseOk} from './camera';

// Coreografia do celular do Rotina v3 (vai para o Blender pelo poses.json; o 2D usa a mesma conta).
// Metros e radianos, eixos do Blender. Regras (Daniel + blender-ia):
//  - sempre reto ou inclinado para cima: rx entre -0,22 e -0,10 (nunca positivo), giro |rz| <= 0,5 (nunca de costas);
//  - luzes paradas, o celular gira: a varredura do reflexo vem do giro rz;
//  - 2 chaves por movimento, canais defasados de 4 a 8 quadros, chegada sem parar no meio;
//  - nada parado: deriva minima (0,3 grau, 5 px), nunca balanco visivel.

// mola "Apple" (zeta, response em s): 0 -> 1 com pequeno overshoot; usada nos planos-heroi
const apple = (f: number, at: number, zeta: number, resp: number) => {
	if (f <= at) return 0;
	const t = (f - at) / 30;
	const w0 = (2 * Math.PI) / resp;
	const wd = w0 * Math.sqrt(1 - zeta * zeta);
	return 1 - Math.exp(-zeta * w0 * t) * (Math.cos(wd * t) + ((zeta * w0) / wd) * Math.sin(wd * t));
};

// posicoes base
const HOOK = {x: 0.034, y: 0.04, z: -0.05};
const CENTER_REV = {x: 0.0, y: -0.02, z: -0.038};
const LEFT = {x: -0.034, y: 0.0, z: -0.03};
const RIGHT = {x: 0.034, y: 0.0, z: -0.03};

export const SEC = {
	entra: 2,
	procura: W(3, 'cada'),
	quarta: W(4, 'quarta'),
	revela: W(5, 'Rotina'),
	junta: W(5, 'junta'),
	habitos: W(6, 'Cada') - 6,
	metricas: W(7, 'dá') - 4,
	treino: W(8, 'Você') - 4,
	series: W(9, 'Anotou') - 4,
	financeiro: W(10, 'Entrou') - 6,
	despesas: W(11, 'Conta') - 6,
	segunda: W(12, 'Nem') - 4,
	cta: W(13, 'Baixe') - 6,
	fim: 900,
};

const track = (f: number, keys: Key[]) => kf(f, keys);

export const phonePose = (f: number): Pose => {
	const s = SEC;
	// ---------------- posicao (x, y, z): 2 chaves por movimento, curva "dolly" (sai e chega parado)
	const x = track(f, [
		[0, HOOK.x],
		[s.junta - 10, HOOK.x],
		[s.revela + 54, CENTER_REV.x, E.dolly],
		[s.habitos, CENTER_REV.x],
		[s.habitos + 24, LEFT.x, E.dolly],
		[s.treino, LEFT.x],
		[s.treino + 24, RIGHT.x, E.dolly],
		[s.financeiro, RIGHT.x],
		[s.financeiro + 24, LEFT.x, E.dolly],
		[s.despesas, LEFT.x],
		[s.despesas + 24, 0, E.dolly],
	]);
	const y = track(f, [
		[0, HOOK.y],
		[s.junta - 10, HOOK.y],
		[s.revela + 54, CENTER_REV.y, E.dolly],
		[s.habitos, CENTER_REV.y],
		[s.habitos + 24, LEFT.y, E.dolly],
		[W(6, 'soma'), LEFT.y],
		[W(6, 'foguinho') + 6, -0.03, E.dolly], // chega perto da chama da sequencia
		[s.metricas, -0.03],
		[s.metricas + 22, 0.0, E.dolly],
		[W(9, 'cai') - 4, 0.0],
		[W(9, 'gráfico') + 14, -0.03, E.dolly], // push-in no grafico
		[s.financeiro, -0.03],
		[s.financeiro + 24, 0.0, E.dolly],
		[s.despesas, 0.0],
		[s.despesas + 24, 0.012, E.dolly],
		[s.segunda + 20, -0.008, E.cam], // aproximacao lenta
		[s.cta - 4, -0.008],
		[s.cta + 40, -0.03, E.dolly],
		[s.fim, -0.036, E.cam],
	]);
	// entrada: sobe da borda de baixo com mola zeta 0,8 (pousa em ~22 q, ~2%)
	const enter = apple(f, s.entra, 0.8, 0.9);
	const zEntry = -0.26 + (HOOK.z + 0.26) * enter;
	let z = track(f, [
		[0, 0],
		[s.junta - 10, 0],
		[s.revela + 54, CENTER_REV.z - HOOK.z, E.dolly],
		[s.habitos, CENTER_REV.z - HOOK.z],
		[s.habitos + 24, LEFT.z - HOOK.z, E.dolly],
		[W(6, 'soma'), LEFT.z - HOOK.z],
		[W(6, 'foguinho') + 6, -0.045 - HOOK.z, E.dolly],
		[s.metricas, -0.045 - HOOK.z],
		[s.metricas + 22, LEFT.z - HOOK.z, E.dolly],
		[W(9, 'cai') - 4, LEFT.z - HOOK.z],
		[W(9, 'gráfico') + 14, -0.04 - HOOK.z, E.dolly],
		[s.financeiro, -0.04 - HOOK.z],
		[s.financeiro + 24, LEFT.z - HOOK.z, E.dolly],
		[s.despesas, LEFT.z - HOOK.z],
		[s.despesas + 24, -0.045 - HOOK.z, E.dolly],
		[s.cta - 4, -0.045 - HOOK.z],
		[s.cta + 40, -0.035 - HOOK.z, E.dolly],
	]);
	z += zEntry;

	// ---------------- inclinacao (sempre para cima)
	const rx = track(f, [
		[0, -0.1],
		[s.entra + 28, -0.14, E.out],
		[s.junta - 4, -0.12],
		[s.revela + 56, -0.19, E.dolly],
		[s.habitos + 30, -0.14, E.dolly],
		[W(9, 'cai') - 4, -0.14],
		[W(9, 'gráfico') + 16, -0.2, E.dolly],
		[s.financeiro + 30, -0.14, E.dolly],
		[s.despesas + 30, -0.12, E.dolly],
		[s.cta + 2, -0.12],
		[s.cta + 46, -0.21, E.dolly],
	]);

	// ---------------- giro (o reflexo varre o vidro). Defasado 6 q da posicao.
	let rz = track(f, [
		[0, 0.24],
		[s.entra + 38, 0.08, E.drift],
		[s.procura, 0.08],
		[s.procura + 18, -0.16, E.cam], // "como quem procura"
		[s.procura + 40, 0.15, E.cam],
		[s.quarta, 0.05, E.cam],
		[s.junta - 6, 0.05],
		[s.junta + 8, -0.4, E.cam], // preparacao (antecipacao) antes da revelacao
	]);
	// revelacao: mola zeta 0,85, response 2,1 s (varredura de ~24 q, passa ~1%)
	const rev = apple(f, s.junta + 8, 0.85, 2.1);
	if (f > s.junta + 8) rz = -0.4 + 0.4 * rev;
	// secoes: o celular encara o centro do quadro (terco esquerdo -> rz > 0; direito -> rz < 0)
	const secYaw = track(f, [
		[s.habitos + 6, 0],
		[s.habitos + 30, 0.2, E.dolly],
		[W(7, 'ver'), 0.2],
		[W(7, 'ver') + 20, 0.1, E.cam],
		[s.treino + 6, 0.1],
		[s.treino + 30, -0.2, E.dolly],
		[s.financeiro + 6, -0.2],
		[s.financeiro + 30, 0.2, E.dolly],
		[s.despesas + 6, 0.2],
		[s.despesas + 30, 0.04, E.dolly],
		[s.segunda, 0.04],
		[s.segunda + 30, -0.03, E.cam],
		[s.cta - 10, -0.03],
		[s.cta + 4, -0.3, E.cam], // preparacao do heroi final
	]);
	if (f > s.habitos + 6) rz = secYaw;
	if (f > s.cta + 4) rz = -0.3 + 0.3 * apple(f, s.cta + 4, 0.85, 1.8);

	// ---------------- deriva (nada parado; ~0,3 grau, ~5 px)
	const t = f / 30;
	const dx = 0.0005 * Math.sin(t * 0.9 + 1.3);
	const dz = 0.0008 * Math.sin(t * 1.1);
	const drz = 0.006 * Math.sin(t * 0.7 + 0.4);
	const drx = 0.004 * Math.sin(t * 0.8 + 2.1);
	const dry = 0.004 * Math.sin(t * 0.6 + 0.9);

	return {x: x + dx, y, z: z + dz, rx: rx + drx, ry: dry, rz: rz + drz, vis: true};
};

// QA da regra do Daniel em todos os quadros (rodado pelo exportar_poses.ts)
export const qaPoses = (n: number) => {
	const ruins: number[] = [];
	for (let f = 0; f < n; f++) {
		const p = phonePose(f);
		const q = poseOk(p);
		if (!q.normalUp || !q.topAway || p.rx > 0) ruins.push(f);
	}
	return ruins;
};
