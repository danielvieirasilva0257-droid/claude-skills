import React from 'react';
import {Composition} from 'remotion';
import {Main, T} from './Main';
import {Explainer} from './explainer/Explainer';
import {SEC} from './explainer/timeline';
import {Tela} from './v2/Tela';
import {Celular} from './v2/Celular';
import {END} from './v2/tempo';
import {RotinaV2} from './v2/Video';

export const Root: React.FC = () => (
	<>
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
