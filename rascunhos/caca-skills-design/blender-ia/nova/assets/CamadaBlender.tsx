// Skill blender-ia (claude-skills). Camada de quadros PNG do Blender dentro do Remotion.
// Mesmo padrao do Rotina v2 (sequencia PNG com <Img> entre as camadas 2D).
// Os PNGs ficam em public/<pasta>/<prefixo>0001.png ... (fora do Git; gere de novo pelo script).
import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';

export const CamadaBlender: React.FC<{
	pasta: string; // ex.: 'blender/plano1'
	total: number; // numero de quadros renderizados
	prefixo?: string; // ex.: 'phone_'
	inicioBlender?: number; // primeiro quadro do Blender (padrao 1)
}> = ({pasta, total, prefixo = 'phone_', inicioBlender = 1}) => {
	const f = Math.min(useCurrentFrame(), total - 1); // segura o ultimo quadro
	const n = String(f + inicioBlender).padStart(4, '0'); // Blender numera com 4 digitos
	return (
		<AbsoluteFill>
			<Img src={staticFile(`${pasta}/${prefixo}${n}.png`)} style={{width: '100%', height: '100%'}} />
		</AbsoluteFill>
	);
};

// Caixa 2D do celular por quadro (gerada pelo produto.py em <prefixo>caixas.json), em pixels de 1080x1920.
// Uso: import caixas from '../public/blender/plano1/phone_caixas.json';
//      const c = caixaNoQuadro(caixas, frame); // ancora um texto que sai de tras do celular
export type Caixa = {f: number; x0: number; y0: number; x1: number; y1: number};
export const caixaNoQuadro = (caixas: Caixa[], frame: number): Caixa =>
	caixas[Math.max(0, Math.min(frame, caixas.length - 1))];

// Ordem das camadas (regras do editor):
// <AbsoluteFill>
//   <Fundo />                                                     1. fundo (Remotion)
//   <Sequence from={60} durationInFrames={90}>
//     <CamadaBlender pasta="blender/plano1-sombra" total={90} />  2. sombra (render --so_sombra)
//   </Sequence>
//   <Textos />                                                    3. textos e cartoes (Remotion)
//   <Sequence from={60} durationInFrames={90}>
//     <CamadaBlender pasta="blender/plano1" total={90} />         4. celular por cima
//   </Sequence>
// </AbsoluteFill>
