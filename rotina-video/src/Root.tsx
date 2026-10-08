import React from 'react';
import {Composition} from 'remotion';
import {Main, T} from './Main';
import {Explainer} from './explainer/Explainer';
import {SEC} from './explainer/timeline';

export const Root: React.FC = () => (
	<>
		{/* 60 s explainer with voiceover and music */}
		<Composition id="RotinaExplainer" component={Explainer} durationInFrames={SEC.end} fps={30} width={1080} height={1920} defaultProps={{}} />
		{/* 10 s silent teaser */}
		<Composition id="Rotina" component={Main} durationInFrames={T.end} fps={30} width={1080} height={1920} defaultProps={{}} />
	</>
);
