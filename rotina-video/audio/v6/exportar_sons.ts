// Dump the SFX cue list (src/v6/sons.ts) to JSON for the Python mixer (trilha-e-mixagem/mixar_com_efeitos.py).
// Run: npx esbuild audio/v6/exportar_sons.ts --bundle --platform=node --outfile=out/exportar_sons_v6.js && node out/exportar_sons_v6.js > audio/v6/sons.json
import {SFX} from '../../src/v6/sons';

console.log(JSON.stringify(SFX.map(([name, frame, gain, pan, opts]) => ({name, frame, gain, pan, ...(opts ?? {})})), null, 1));
