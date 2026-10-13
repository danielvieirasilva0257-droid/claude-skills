import React from 'react';
import {Composition} from 'remotion';
import {Main, T} from './Main';
import {Explainer} from './explainer/Explainer';
import {SEC} from './explainer/timeline';
import {Tela} from './v2/Tela';
import {Celular} from './v2/Celular';
import {END} from './v2/tempo';
import {RotinaV2} from './v2/Video';
import {V3Tela, V4Tela} from './v3/Tela';
import {END as END3} from './v3/tempo';
import {RotinaV3} from './v3/Video';
import {RotinaV4} from './v4/Video';

export const Root: React.FC = () => (
	<>
		{/* v4 final: celular do Blender do v3 + visual papel e tinta do v2 (fundos por secao, Anton, Instrument Serif) */}
		<Composition id="RotinaV4" component={RotinaV4} durationInFrames={END3} fps={30} width={1080} height={1920} defaultProps={{audio: false, silhueta: false}} />
		{/* v4 (30 s): telas do app com a abertura clara (o resto igual ao v3) */}
		<Composition id="V4Tela" component={V4Tela} durationInFrames={END3} fps={30} width={1080} height={2309} defaultProps={{}} />
		{/* v3 (30 s): telas do app para a tela do celular do Blender (1080 x 2309 = area ativa do premium.py) */}
		<Composition id="V3Tela" component={V3Tela} durationInFrames={END3} fps={30} width={1080} height={2309} defaultProps={{}} />
		{/* v3 final: palco escuro + celular do Blender (public/v3/celular) + voz Leda 1,1x + trilha e efeitos */}
		<Composition id="RotinaV3" component={RotinaV3} durationInFrames={END3} fps={30} width={1080} height={1920} defaultProps={{audio: true, silhueta: false}} />
		{/* v2 (30 s): app screens for the 3D phone texture, the 3D phone layer (transparent) */}
		<Composition id="V2Tela" component={Tela} durationInFrames={END} fps={30} width={1080} height={2340} defaultProps={{}} />
		<Composition id="V2Celular" component={Celular} durationInFrames={END} fps={30} width={1080} height={1920} defaultProps={{}} />
		{/* v2 final video: 30 s, voice (Leda 1.6x) + original track + SFX */}
		<Composition id="RotinaV2" component={RotinaV2} durationInFrames={END} fps={30} width={1080} height={1920} defaultProps={{audio: true}} />
		{/* 60 s explainer with voiceover and music */}
		<Composition id="RotinaExplainer" component={Explainer} durationInFrames={SEC.end} fps={30} width={1080} height={1920} defaultProps={{}} />
		{/* 10 s silent teaser */}
		<Composition id="Rotina" component={Main} durationInFrames={T.end} fps={30} width={1080} height={1920} defaultProps={{}} />
	</>
);
