import {Pose, poseOk} from '../v3/camera';

// Abertura do v5 (como no video-modelo): o celular vem de longe girando, pousa perto da camera
// com a tela levemente para cima, e a camera avanca ate o widget da tela de bloqueio, que salta para fora.
// Regra do Daniel: sempre reto ou inclinado para cima (rx <= 0, topo nunca vindo para a camera).
// Tempos em quadros (30 fps), definidos pela voz em tempo5.ts.

export type IntroT = {pousa: number; avanca: number; salta: number; some: number};

const apple = (f: number, at: number, zeta: number, resp: number) => {
	if (f <= at) return 0;
	const t = (f - at) / 30;
	const w0 = (2 * Math.PI) / resp;
	const wd = w0 * Math.sqrt(1 - zeta * zeta);
	return 1 - Math.exp(-zeta * w0 * t) * (Math.cos(wd * t) + ((zeta * w0) / wd) * Math.sin(wd * t));
};
const ease = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

// pose de chegada (pousada) e pose final do avanco (widget no centro do quadro)
const A = {x: -0.07, y: 1.35, z: -0.07, rx: -0.26, ry: 0.32, rz: 1.2};
const B = {x: 0.0, y: -0.2, z: -0.004, rx: -0.15, ry: 0.05, rz: 0.16};
const Cc = {x: 0.0, y: -0.385, z: -0.036, rx: -0.07, ry: 0.0, rz: 0.03};

export const poseIntro = (f: number, T: IntroT): Pose => {
	// 1) voo de chegada: posicao com mola amortecida; giro um pouco atrasado (sobreposicao de canais)
	const kp = Math.min(1.02, apple(f, 0, 0.82, 1.5));
	const kr = Math.min(1.02, apple(f, 3, 0.86, 1.6));
	let x = lerp(A.x, B.x, kp);
	let y = lerp(A.y, B.y, kp);
	let z = lerp(A.z, B.z, kp);
	let rx = lerp(A.rx, B.rx, kr);
	let ry = lerp(A.ry, B.ry, kr);
	let rz = lerp(A.rz, B.rz, kr);
	// 2) avanco da camera ate o widget (o celular chega mais perto e desce um pouco)
	const kc = ease((f - T.avanca) / (T.salta + 6 - T.avanca));
	x = lerp(x, Cc.x, kc);
	y = lerp(y, Cc.y, kc);
	z = lerp(z, Cc.z, kc);
	rx = lerp(rx, Cc.rx, kc);
	ry = lerp(ry, Cc.ry, kc);
	rz = lerp(rz, Cc.rz, kc);
	// deriva minima (nada parado)
	const t = f / 30;
	return {x: x + 0.0006 * Math.sin(t * 1.1), y, z: z + 0.0005 * Math.sin(t * 0.9 + 1), rx: Math.min(-0.02, rx + 0.004 * Math.sin(t * 0.8)), ry, rz: rz + 0.005 * Math.sin(t * 0.7), vis: f <= T.some};
};

export const qaIntro = (n: number, T: IntroT) => {
	const ruins: number[] = [];
	for (let f = 0; f <= n; f++) {
		const p = poseIntro(f, T);
		const q = poseOk(p);
		if (!q.normalUp || !q.topAway || p.rx > 0) ruins.push(f);
	}
	return ruins;
};
