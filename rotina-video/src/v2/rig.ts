import * as THREE from 'three';
import {SPR, drift, ease, kf, sp} from './theme';

// Shared phone rig: the 3D layer (Celular.tsx) and the 2D overlays (shadows, cards that leave the screen)
// read the same transform for every frame, so they always line up.

// Phone model (1 unit = 100 mm, iPhone-like proportions, generic design)
export const PH = {W: 0.716, H: 1.466, D: 0.0825, CORNER: 0.105, BEVEL: 0.03};
export const SCR = {H: 1.4, W: (1.4 * 1080) / 2340, R: 0.085, TEX_W: 1080, TEX_H: 2340};

// Camera: fixed, looking at the origin
export const CAM = {fov: 30, z: 4.5, near: 0.1, far: 60, w: 1080, h: 1920};
export const PX = CAM.h / (2 * CAM.z * Math.tan(((CAM.fov / 2) * Math.PI) / 180)); // pixels per unit at z = 0 (~796)
const wx = (px: number) => (px - CAM.w / 2) / PX;
const wy = (py: number) => (CAM.h / 2 - py) / PX;

export type Pose = {x: number; y: number; z: number; rx: number; ry: number; rz: number; visible: boolean};

// Poses in screen pixels (center of the phone at z = 0) for readability
const POSES = {
	logo: {x: 540, y: 760},
	habitos: {x: 600, y: 1130, rx: 0.08, ry: -0.32, rz: 0.035},
	metricas: {x: 400, y: 1150, rx: 0.06, ry: 0.3, rz: -0.03},
	treino: {x: 540, y: 1180, rx: 0.1, ry: -0.22, rz: 0.02},
	estilos: {x: 540, y: 1440, rx: 0.32, ry: 0.0, rz: 0},
	series: {x: 650, y: 1150, rx: 0.08, ry: -0.3, rz: 0.03},
	financeiro: {x: 520, y: 1170, rx: 0.08, ry: 0.25, rz: -0.02},
	transacoes: {x: 420, y: 1180, rx: 0.07, ry: 0.3, rz: -0.03},
	despesas: {x: 620, y: 1200, rx: 0.08, ry: -0.26, rz: 0.03},
	final: {x: 540, y: 1150, rx: 0.05, ry: 0.0, rz: 0},
};

const TAU = Math.PI * 2;

export const phonePose = (f: number): Pose => {
	if (f < 182 || f > 847) return {x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0, visible: false};
	const p = POSES;
	// entrance from the logo: one heavy spring for everything (lands ~f204, small overshoot)
	const e = sp(f, 182, {stiffness: 110, damping: 17});
	const mix = (a: number, b: number) => a + (b - a) * e;

	// helper: premium spring between two poses starting at frame `at`
	const go = (at: number, cfg = SPR.premium) => sp(f, at, cfg);

	let x = mix(p.logo.x, p.habitos.x);
	let y = mix(p.logo.y, p.habitos.y);
	let z = mix(-9, 0);
	let rx = mix(0.55, p.habitos.rx);
	let ry = mix(-5.4, p.habitos.ry);
	let rz = mix(-0.35, p.habitos.rz);

	const blend = (k: number, to: {x: number; y: number; rx: number; ry: number; rz: number}) => {
		x += (to.x - x) * k;
		y += (to.y - y) * k;
		rx += (to.rx - rx) * k;
		ry += (to.ry - ry) * k;
		rz += (to.rz - rz) * k;
	};

	// Hábitos -> Métricas
	blend(go(264, SPR.soft), p.metricas);
	// Métricas -> Treino: whip spin of a full turn (+ the pose change), lands on the bar (f340-342)
	if (f >= 326) {
		const t = kf(f, [
			[326, 0],
			[342, 1, ease.inOut],
		]);
		x = p.metricas.x + (p.treino.x - p.metricas.x) * t;
		y = p.metricas.y + (p.treino.y - p.metricas.y) * t;
		rx = p.metricas.rx + (p.treino.rx - p.metricas.rx) * t;
		rz = p.metricas.rz + (p.treino.rz - p.metricas.rz) * t;
		ry = p.metricas.ry + (p.treino.ry - TAU - p.metricas.ry) * t;
	}
	// Treino -> Estilos -> Séries
	if (f >= 390) blend(go(390, SPR.soft), {...p.estilos, ry: p.estilos.ry - TAU});
	if (f >= 474) blend(go(474, SPR.soft), {...p.series, ry: p.series.ry - TAU});
	// Séries -> Financeiro: forward flip around X, lands on the bar (f580-586)
	if (f >= 568) {
		const t = kf(f, [
			[568, 0],
			[586, 1, ease.inOut],
		]);
		x = p.series.x + (p.financeiro.x - p.series.x) * t;
		y = p.series.y + (p.financeiro.y - p.series.y) * t;
		ry = p.series.ry - TAU + (p.financeiro.ry - p.series.ry) * t;
		rz = p.series.rz + (p.financeiro.rz - p.series.rz) * t;
		rx = p.series.rx + (p.financeiro.rx + TAU - p.series.rx) * t;
	}
	if (f >= 628) blend(go(628, SPR.soft), {...p.transacoes, ry: p.transacoes.ry - TAU, rx: p.transacoes.rx + TAU});
	if (f >= 702) blend(go(702, SPR.soft), {...p.despesas, ry: p.despesas.ry - TAU, rx: p.despesas.rx + TAU});
	if (f >= 786) blend(go(786, SPR.soft), {...p.final, ry: p.final.ry - TAU, rx: p.final.rx + TAU});

	// z: slow push-ins inside sections, dips during the whip/flip
	z += kf(f, [
		[204, 0],
		[264, 0.16],
		[326, 0.3],
		[334, -0.9, ease.out],
		[342, 0, ease.in],
		[390, 0.18],
		[404, -0.75],
		[474, -0.62],
		[490, 0.0],
		[568, 0.22],
		[577, -0.85, ease.out],
		[586, 0, ease.in],
		[628, 0.15],
		[702, 0.2],
		[786, 0.22],
		[800, 0.05],
		[832, 0.3],
	]);

	// zoom through the screen (f832-847): face the camera, center, fly into the glass
	if (f >= 832) {
		const t = kf(f, [
			[832, 0],
			[847, 1, ease.in],
		]);
		const c = kf(f, [
			[832, 0],
			[840, 1, ease.out],
		]);
		x += (540 - x) * c;
		y += (960 - y) * c;
		rx += (TAU - rx) * c;
		ry += (-TAU - ry) * c;
		rz += (0 - rz) * c;
		z = 0.3 + (2.75 - 0.3) * t;
	}

	// never still: tiny float and sway (fades out during the zoom)
	const still = f >= 832 ? 0 : 1;
	y += drift(f, 7, 96) * still;
	ry += drift(f, 0.035, 120, 17) * still;
	rx += drift(f, 0.015, 140, 40) * still;

	return {x: wx(x), y: wy(y), z, rx, ry, rz, visible: true};
};

// ---------- projection (same camera as the 3D layer) ----------
const camera = new THREE.PerspectiveCamera(CAM.fov, CAM.w / CAM.h, CAM.near, CAM.far);
camera.position.set(0, 0, CAM.z);
camera.lookAt(0, 0, 0);
camera.updateMatrixWorld();
camera.updateProjectionMatrix();

export const phoneMatrix = (pose: Pose) => {
	const m = new THREE.Matrix4();
	m.compose(
		new THREE.Vector3(pose.x, pose.y, pose.z),
		new THREE.Quaternion().setFromEuler(new THREE.Euler(pose.rx, pose.ry, pose.rz, 'XYZ')),
		new THREE.Vector3(1, 1, 1),
	);
	return m;
};

// Project a point given in phone-local units to frame pixels
export const project = (pose: Pose, lx: number, ly: number, lz = 0) => {
	const v = new THREE.Vector3(lx, ly, lz).applyMatrix4(phoneMatrix(pose)).project(camera);
	return {x: ((v.x + 1) / 2) * CAM.w, y: ((1 - v.y) / 2) * CAM.h, depth: v.z};
};

// Screen point from texture coordinates (u, v in 0..1, origin top-left) to frame pixels
export const screenPoint = (pose: Pose, u: number, v: number) =>
	project(pose, (u - 0.5) * SCR.W, (0.5 - v) * SCR.H, PH.D / 2 + 0.002);

// The 4 body corners (for the paper shadow)
export const bodyQuad = (pose: Pose) =>
	[
		[-PH.W / 2, PH.H / 2],
		[PH.W / 2, PH.H / 2],
		[PH.W / 2, -PH.H / 2],
		[-PH.W / 2, -PH.H / 2],
	].map(([lx, ly]) => project(pose, lx, ly, 0));

// Is the screen facing the camera? (normal . view direction)
export const facing = (pose: Pose) => {
	const n = new THREE.Vector3(0, 0, 1).applyQuaternion(new THREE.Quaternion().setFromEuler(new THREE.Euler(pose.rx, pose.ry, pose.rz, 'XYZ')));
	const toCam = new THREE.Vector3(-pose.x, -pose.y, CAM.z - pose.z).normalize();
	return n.dot(toCam);
};

// Angular speed (rad/frame) and screen-space speed (px/frame) for motion blur
export const phoneSpeed = (f: number) => {
	const a = phonePose(f - 1);
	const b = phonePose(f);
	if (!a.visible || !b.visible) return {ang: 0, px: 0, dir: 0};
	const ang = Math.abs(b.ry - a.ry) + Math.abs(b.rx - a.rx);
	const pa = project(a, 0, 0);
	const pb = project(b, 0, 0);
	return {ang, px: Math.hypot(pb.x - pa.x, pb.y - pa.y), dir: Math.atan2(pb.y - pa.y, pb.x - pa.x)};
};
