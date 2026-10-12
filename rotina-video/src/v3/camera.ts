// Camera fixa do Rotina v3, igual a do blender/v3_pose.py (projecao conferida: 0 px de diferenca).
// Mundo em metros, eixos do Blender: x direita, y profundidade (camera em -y olhando +y), z para cima.
// Celular em pe com a tela para -y. Pose: rx = inclinacao (<= 0: tela para cima, topo se afastando),
// ry = rolagem no plano, rz = giro no eixo vertical. Ordem Euler XYZ do Blender: R = Rz . Ry . Rx.
export const CAM = {d: 0.62, fovy: 24, w: 1080, h: 1920}; // ~85 mm em 35 mm (lente constante, blender-ia)
export const FOCAL = CAM.h / 2 / Math.tan(((CAM.fovy / 2) * Math.PI) / 180); // px

// medidas do celular do premium.py (m)
export const PH = {W: 0.0716, H: 0.149, D: 0.0082};
export const AX = PH.W / 2 - 0.0005 - 0.0013; // meia largura da area ativa
export const AY = PH.H / 2 - 0.0005 - 0.0013; // meia altura da area ativa (UI 1080 x 2309)
export const UI = {w: 1080, h: 2309};

export type Pose = {x: number; y: number; z: number; rx: number; ry: number; rz: number; vis: boolean};
type V3 = [number, number, number];

const rot = (p: Pose, v: V3): V3 => {
	// Rx, depois Ry, depois Rz (eixos do mundo)
	let [x, y, z] = v;
	let c = Math.cos(p.rx), s = Math.sin(p.rx);
	[y, z] = [y * c - z * s, y * s + z * c];
	c = Math.cos(p.ry); s = Math.sin(p.ry);
	[x, z] = [x * c + z * s, -x * s + z * c];
	c = Math.cos(p.rz); s = Math.sin(p.rz);
	[x, y] = [x * c - y * s, x * s + y * c];
	return [x, y, z];
};

// ponto local do corpo (tela no plano z = D/2, altura em +y) -> mundo
export const toWorld = (p: Pose, lx: number, ly: number, lz: number): V3 => {
	const [x, y, z] = rot(p, [lx, -lz, ly]); // corpo do premium.py esta girado 90 graus em X dentro do Produto
	return [p.x + x, p.y + y, p.z + z];
};

export const projectWorld = (w: V3) => {
	const depth = w[1] + CAM.d;
	return {x: CAM.w / 2 + (FOCAL * w[0]) / depth, y: CAM.h / 2 - (FOCAL * w[2]) / depth, depth};
};

// ponto da tela em coordenadas da UI (u, v de 0 a 1, origem no canto superior esquerdo) -> pixel do quadro
export const screenPoint = (p: Pose, u: number, v: number) => projectWorld(toWorld(p, (u - 0.5) * 2 * AX, (0.5 - v) * 2 * AY, PH.D / 2));

// os 4 cantos do corpo (para sombra e para saber onde o celular esta)
export const bodyQuad = (p: Pose) =>
	[
		[-PH.W / 2, PH.H / 2],
		[PH.W / 2, PH.H / 2],
		[PH.W / 2, -PH.H / 2],
		[-PH.W / 2, -PH.H / 2],
	].map(([lx, ly]) => projectWorld(toWorld(p, lx, ly, 0)));

export const bbox = (p: Pose, pad = 0) => {
	const q = bodyQuad(p);
	const xs = q.map((v) => v.x), ys = q.map((v) => v.y);
	return {x0: Math.min(...xs) - pad, y0: Math.min(...ys) - pad, x1: Math.max(...xs) + pad, y1: Math.max(...ys) + pad};
};

// Regra do Daniel: o celular nunca inclinado para baixo.
// tela (normal) com componente z >= 0 e topo do aparelho nunca vindo na direcao da camera.
export const poseOk = (p: Pose) => {
	const n = rot(p, [0, -1, 0]); // normal da tela no mundo
	const top = rot(p, [0, 0, 1]); // eixo longo (para o topo)
	return {normalUp: n[2] >= -1e-6, topAway: top[1] >= -1e-6, n, top};
};
