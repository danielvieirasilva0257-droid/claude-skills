import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {Grao5} from '../v5/theme';
import {Fundo6} from './base6';
import {Celular6, CenasAbaixo, CenasAcima} from './Cenas6';

// Rotina v6 (38,3 s, 1080 x 1920): treino + checklists + financeiro, no estilo do v5, com o celular do Blender
// alternando entre a tela em foco e os elementos que sobem com ele desfocado atras.
// Camadas (regra 3 do editor): fundo -> frases e CTA -> celular -> elementos que sobem da tela -> granulacao.

export const MIX_V6 = 'v6/rotina-v6-mix.wav';

export const RotinaV6: React.FC<{audio?: boolean; silhueta?: boolean}> = ({audio = false, silhueta = false}) => {
	const f = useCurrentFrame();
	return (
		<AbsoluteFill style={{background: '#0A0A0E', overflow: 'hidden'}}>
			<Fundo6 f={f} />
			<CenasAbaixo f={f} />
			<Celular6 f={f} silhueta={silhueta} />
			<CenasAcima f={f} />
			<Grao5 f={f} />
			{audio ? <Audio src={staticFile(MIX_V6)} /> : null}
		</AbsoluteFill>
	);
};
