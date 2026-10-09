// Dump the SFX cue list (src/v2/sons.ts) to JSON for the Python mixer.
// Run: npx esbuild audio/v2/exportar_sons.ts --bundle --platform=node --outfile=out/exportar_sons.js && node out/exportar_sons.js > audio/v2/sons.json
import {SFX} from '../../src/v2/sons';

console.log(JSON.stringify(SFX.map(([name, frame, gain, pan, opts]) => ({name, frame, gain, pan, ...(opts ?? {})})), null, 1));
