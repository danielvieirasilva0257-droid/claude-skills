// Gera o poses.json do Blender (uma pose por quadro) e confere a regra "nunca inclinado para baixo".
// Uso: npx esbuild src/v3/exportar_poses.ts --bundle --platform=node --outfile=out/exportar_poses.js && node out/exportar_poses.js > blender/poses-v3.json
import {CAM} from './camera';
import {phonePose, qaPoses} from './rig';
import {END} from './tempo';

const frames = [];
for (let f = 0; f < END; f++) {
	const p = phonePose(f);
	frames.push({f, x: +p.x.toFixed(6), y: +p.y.toFixed(6), z: +p.z.toFixed(6), rx: +p.rx.toFixed(6), ry: +p.ry.toFixed(6), rz: +p.rz.toFixed(6), vis: p.vis ? 1 : 0});
}
const ruins = qaPoses(END);
if (ruins.length) {
	console.error(`ERRO: celular inclinado para baixo em ${ruins.length} quadros: ${ruins.slice(0, 20).join(', ')}`);
	process.exit(1);
}
console.error(`ok: ${frames.length} poses, nenhum quadro inclinado para baixo`);
process.stdout.write(JSON.stringify({cam: {d: CAM.d, fovy: CAM.fovy}, frames}));
