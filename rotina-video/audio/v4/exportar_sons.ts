// Dump the SFX cue list (src/v4/sons.ts) to JSON for the Python mixer (trilha-e-mixagem/mixar_com_efeitos.py).
// Run: npx esbuild audio/v4/exportar_sons.ts --bundle --platform=node --outfile=out/exportar_sons_v4.js && node out/exportar_sons_v4.js > audio/v4/sons.json
import {SFX} from '../../src/v4/sons';

console.log(JSON.stringify(SFX.map(([name, frame, gain, pan, opts]) => ({name, frame, gain, pan, ...(opts ?? {})})), null, 1));
