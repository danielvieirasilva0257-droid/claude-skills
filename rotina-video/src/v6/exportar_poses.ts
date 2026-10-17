// Poses do v6 para o Blender (blender/poses-v6.json). Para com erro se algum quadro ficar inclinado para baixo.
// Rode: npx esbuild src/v6/exportar_poses.ts --bundle --platform=node --outfile=out/exportar_poses_v6.js && node out/exportar_poses_v6.js > blender/poses-v6.json
import {CAM} from '../v3/camera';
import {FIM_CELULAR} from './plano6';
import {desfoque, poseV6, qaV6} from './rig6';

const N = FIM_CELULAR + 1;
const ruins = qaV6(N);
if (ruins.length) {
	console.error(`ERRO: celular inclinado para baixo em ${ruins.length} quadros: ${ruins.slice(0, 20).join(', ')}`);
	process.exit(1);
}
const frames = [];
for (let f = 0; f < N; f++) {
	const p = poseV6(f);
	frames.push({f, x: +p.x.toFixed(6), y: +p.y.toFixed(6), z: +p.z.toFixed(6), rx: +p.rx.toFixed(6), ry: +p.ry.toFixed(6), rz: +p.rz.toFixed(6), vis: p.vis ? 1 : 0, borrado: +desfoque(f).toFixed(3)});
}
console.error(`ok: ${frames.length} poses, nenhum quadro inclinado para baixo; desfocados: ${frames.filter((q) => q.borrado >= 0.6).length}`);
process.stdout.write(JSON.stringify({cam: {d: CAM.d, fovy: CAM.fovy, w: CAM.w, h: CAM.h}, frames}));
