// Poses da abertura do v5 para o Blender (blender/poses-v5.json). Para com erro se algum quadro ficar inclinado para baixo.
// Rode: npx esbuild src/v5/exportar_poses.ts --bundle --platform=node --outfile=out/exportar_poses_v5.js && node out/exportar_poses_v5.js > blender/poses-v5.json
import {CAM5} from './camera';
import {poseIntro, qaIntro} from './intro';
import {INTRO5} from './tempo5';

const ruins = qaIntro(INTRO5.some, INTRO5);
if (ruins.length) {
	console.error('quadros inclinados para baixo:', ruins.join(','));
	process.exit(1);
}
const frames = [];
for (let f = 0; f <= INTRO5.some + 1; f++) {
	const p = poseIntro(f, INTRO5);
	frames.push({f, x: p.x, y: p.y, z: p.z, rx: p.rx, ry: p.ry, rz: p.rz, vis: f <= INTRO5.some ? 1 : 0});
}
console.log(JSON.stringify({cam: CAM5, frames}));
console.error(`ok: ${frames.length} poses, nenhum quadro inclinado para baixo`);
