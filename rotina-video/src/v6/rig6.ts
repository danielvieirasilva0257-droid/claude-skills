import {FOCAL, Pose, poseOk, screenPoint} from '../v3/camera';
import {FIM_CELULAR, T6, TRECHOS, Trecho} from './plano6';

// Coreografia do celular do v6 (vai para o Blender pelo poses-v6.json; o 2D usa a mesma conta).
// P: pose de exibicao (tela de frente, levemente para cima, frase no terco de cima do quadro).
// N: mergulho: a camera chega perto do elemento da tela (ele fica no centro) e o celular desfoca no 2D.
// Regra do Daniel: sempre reto ou inclinado para cima (rx <= 0, topo nunca vindo para a camera).

type Alvo = {x: number; y: number; z: number; rx: number; ry: number; rz: number};

const apple = (f: number, at: number, zeta: number, resp: number) => {
	if (f <= at) return 0;
	const t = (f - at) / 30;
	const w0 = (2 * Math.PI) / resp;
	const wd = w0 * Math.sqrt(1 - zeta * zeta);
	return 1 - Math.exp(-zeta * w0 * t) * (Math.cos(wd * t) + ((zeta * w0) / wd) * Math.sin(wd * t));
};
const dolly = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const mix = (a: Alvo, b: Alvo, k: number): Alvo => ({x: lerp(a.x, b.x, k), y: lerp(a.y, b.y, k), z: lerp(a.z, b.z, k), rx: lerp(a.rx, b.rx, k), ry: lerp(a.ry, b.ry, k), rz: lerp(a.rz, b.rz, k)});

// pose de exibicao: centro um pouco abaixo do meio do quadro (a frase fica em cima)
const P0: Alvo = {x: 0, y: 0.02, z: -0.021, rx: -0.14, ry: 0, rz: 0.1};
// mergulho: perto da camera, quase de frente
const N_Y = -0.24;
const N_ROT = {rx: -0.06, ry: 0, rz: 0.0};
const ALVO_TELA = {x: 540, y: 960}; // onde o elemento em foco fica no quadro

// acha x e z para o ponto (u, v) da tela cair em ALVO_TELA
const mergulho = (u: number, v: number): Alvo => {
	let x = 0;
	let z = 0;
	for (let i = 0; i < 6; i++) {
		const q = screenPoint({x, y: N_Y, z, ...N_ROT, vis: true}, u, v);
		x += ((ALVO_TELA.x - q.x) * q.depth) / FOCAL;
		z += ((q.y - ALVO_TELA.y) * q.depth) / FOCAL;
	}
	return {x, y: N_Y, z, ...N_ROT};
};
const alvoDe = (t: Trecho): Alvo => (t.modo === 'N' && t.foco ? mergulho(t.foco.u, t.foco.v) : {...P0, rz: t.giro ?? P0.rz});

// chegada: vem de cima girando, pousa com mola (como o v5)
const A: Alvo = {x: 0.06, y: 1.1, z: 0.32, rx: -0.3, ry: 0.28, rz: 1.1};

export const trechoEm = (f: number) => {
	let i = 0;
	for (let k = 0; k < TRECHOS.length; k++) if (f >= TRECHOS[k].de) i = k;
	return i;
};

export const poseV6 = (f: number): Pose => {
	const i = trechoEm(f);
	const cur = TRECHOS[i];
	let q: Alvo;
	if (i === 0) {
		const kp = Math.min(1.02, apple(f, 0, 0.82, 1.4));
		const kr = Math.min(1.02, apple(f, 3, 0.86, 1.5));
		const b = alvoDe(cur);
		q = {x: lerp(A.x, b.x, kp), y: lerp(A.y, b.y, kp), z: lerp(A.z, b.z, kp), rx: lerp(A.rx, b.rx, kr), ry: lerp(A.ry, b.ry, kr), rz: lerp(A.rz, b.rz, kr)};
	} else {
		const a = alvoDe(TRECHOS[i - 1]);
		const b = alvoDe(cur);
		q = mix(a, b, dolly((f - cur.de) / (cur.dur ?? 14)));
	}
	// saida: desce pela borda de baixo, acelerando (tela continua para cima)
	const s = Math.max(0, Math.min(1, (f - T6.fora) / (FIM_CELULAR - T6.fora)));
	q.z -= 0.42 * s * s;
	q.rx -= 0.1 * s;
	// deriva minima (nada parado)
	const t = f / 30;
	return {
		x: q.x + 0.0006 * Math.sin(t * 0.9 + 1.3),
		y: q.y,
		z: q.z + 0.0008 * Math.sin(t * 1.1),
		rx: Math.min(-0.02, q.rx + 0.004 * Math.sin(t * 0.8 + 2.1)),
		ry: q.ry + 0.004 * Math.sin(t * 0.6 + 0.9),
		rz: q.rz + 0.006 * Math.sin(t * 0.7 + 0.4),
		vis: f <= FIM_CELULAR,
	};
};

// desfoque do celular no 2D (0 a 1): sobe no fim do mergulho, cai no comeco da volta
export const desfoque = (f: number) => {
	const i = trechoEm(f);
	const cur = TRECHOS[i];
	const d = cur.dur ?? 14;
	if (cur.modo === 'N') return dolly((f - (cur.de + d * 0.4)) / (d * 0.6 + 2));
	if (i > 0 && TRECHOS[i - 1].modo === 'N') return 1 - dolly((f - cur.de) / (d * 0.6));
	return 0;
};

export const qaV6 = (n: number) => {
	const ruins: number[] = [];
	for (let f = 0; f < n; f++) {
		const p = poseV6(f);
		const o = poseOk(p);
		if (!o.normalUp || !o.topAway || p.rx > 0) ruins.push(f);
	}
	return ruins;
};
