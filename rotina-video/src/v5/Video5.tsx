import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {Fundo5, Grao5} from './theme';
import {Celular5, CenasAbaixo, CenasAcima} from './Cenas5';

// Rotina v5 (22,4 s, 1920 x 1080), no estilo do video-modelo do Daniel.
// Camadas (regra 3 do editor): fundo -> textos e cartoes -> celular do Blender -> notificacao que salta dele -> granulacao.

export const MIX_V5 = 'v5/rotina-v5-mix.wav';

export const RotinaV5: React.FC<{audio?: boolean}> = ({audio = false}) => {
	const f = useCurrentFrame();
	return (
		<AbsoluteFill style={{background: '#0A0A0E', overflow: 'hidden'}}>
			<Fundo5 f={f} />
			<CenasAbaixo f={f} />
			<Celular5 f={f} />
			<CenasAcima f={f} />
			<Grao5 f={f} />
			{audio ? <Audio src={staticFile(MIX_V5)} /> : null}
		</AbsoluteFill>
	);
};
