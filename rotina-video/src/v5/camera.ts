import {AX, AY, PH, Pose, toWorld} from '../v3/camera';

// Camera do v5 (horizontal 1920 x 1080), mesma lente do v3 (fov vertical de 24 graus, a 0,62 m).
// O blender/v3_pose.py le w e h do poses.json e renderiza nesse formato.
export const CAM5 = {d: 0.62, fovy: 24, w: 1920, h: 1080};
export const FOCAL5 = CAM5.h / 2 / Math.tan(((CAM5.fovy / 2) * Math.PI) / 180);

export const project5 = (w: [number, number, number]) => {
	const depth = w[1] + CAM5.d;
	return {x: CAM5.w / 2 + (FOCAL5 * w[0]) / depth, y: CAM5.h / 2 - (FOCAL5 * w[2]) / depth, depth};
};
// ponto da tela (u, v de 0 a 1, origem no canto superior esquerdo da UI) -> pixel do quadro
export const tela5 = (p: Pose, u: number, v: number) => project5(toWorld(p, (u - 0.5) * 2 * AX, (0.5 - v) * 2 * AY, PH.D / 2));
export const corpo5 = (p: Pose) =>
	[
		[-PH.W / 2, PH.H / 2],
		[PH.W / 2, PH.H / 2],
		[PH.W / 2, -PH.H / 2],
		[-PH.W / 2, -PH.H / 2],
	].map(([lx, ly]) => project5(toWorld(p, lx, ly, 0)));
export const caixa5 = (p: Pose) => {
	const q = corpo5(p);
	const xs = q.map((v) => v.x);
	const ys = q.map((v) => v.y);
	return {x0: Math.min(...xs), y0: Math.min(...ys), x1: Math.max(...xs), y1: Math.max(...ys)};
};
