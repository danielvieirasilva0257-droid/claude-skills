import React from 'react';
import {Composition} from 'remotion';
import {Main, T} from './Main';

export const Root: React.FC = () => (
	<Composition id="Rotina" component={Main} durationInFrames={T.end} fps={30} width={1080} height={1920} defaultProps={{}} />
);
