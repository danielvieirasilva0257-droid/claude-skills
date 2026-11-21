// Float PCM [-1, 1] -> 16-bit mono WAV bytes, so the phone's player can play
// each sentence the voice model generates. Pure function, tested in Jest.

export function wavPcm16(amostras: Float32Array, taxa: number): Uint8Array {
  const dados = amostras.length * 2;
  const bytes = new Uint8Array(44 + dados);
  const v = new DataView(bytes.buffer);
  const texto = (pos: number, s: string) => { for (let i = 0; i < s.length; i++) v.setUint8(pos + i, s.charCodeAt(i)); };
  texto(0, 'RIFF');
  v.setUint32(4, 36 + dados, true);
  texto(8, 'WAVE');
  texto(12, 'fmt ');
  v.setUint32(16, 16, true);        // fmt chunk size
  v.setUint16(20, 1, true);         // PCM
  v.setUint16(22, 1, true);         // mono
  v.setUint32(24, taxa, true);
  v.setUint32(28, taxa * 2, true);  // byte rate
  v.setUint16(32, 2, true);         // block align
  v.setUint16(34, 16, true);        // bits per sample
  texto(36, 'data');
  v.setUint32(40, dados, true);
  for (let i = 0; i < amostras.length; i++) {
    const s = Math.max(-1, Math.min(1, amostras[i] ?? 0));
    v.setInt16(44 + i * 2, s < 0 ? Math.round(s * 0x8000) : Math.round(s * 0x7fff), true);
  }
  return bytes;
}
