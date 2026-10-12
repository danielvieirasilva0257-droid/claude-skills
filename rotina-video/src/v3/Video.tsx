import React from 'react';
import {AbsoluteFill, Audio, Img, staticFile, useCurrentFrame} from 'remotion';
import {Cenas, Fundo} from './Cenas';
import {phonePose} from './rig';
import {bbox, bodyQuad, screenPoint} from './camera';

// Rotina v3 (30 s, 1080 x 1920): palco escuro da marca + celular premium renderizado no Blender (PNG com alfa).
// Ordem das camadas (regra 3 do editor): fundo -> textos e cartoes -> celular -> granulacao/vinheta.

export const MIX_V3 = 'v3/rotina-v3-mix.wav';

const pad4 = (n: number) => String(n).padStart(4, '0');

// rascunho: silhueta do celular (mesma conta do Blender) com a tela em cinza, para conferir a composicao
const Silhueta: React.FC<{f: number}> = ({f}) => {
	const p = phonePose(f);
	const q = bodyQuad(p).map((v) => `${v.x.toFixed(1)},${v.y.toFixed(1)}`).join(' ');
	const t = [screenPoint(p, 0, 0), screenPoint(p, 1, 0), screenPoint(p, 1, 1), screenPoint(p, 0, 1)].map((v) => `${v.x.toFixed(1)},${v.y.toFixed(1)}`).join(' ');
	return (
		<svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
			<polygon points={q} fill="#3A3A40" stroke="#8A8A92" strokeWidth={5} strokeLinejoin="round" />
			<polygon points={t} fill="#18181C" />
		</svg>
	);
};

const Grao: React.FC<{f: number}> = ({f}) => (
	<AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'overlay', opacity: 0.07}}>
		<svg width="100%" height="100%">
			<filter id="v3grain">
				<feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={f % 12} stitchTiles="stitch" />
				<feColorMatrix type="saturate" values="0" />
			</filter>
			<rect width="100%" height="100%" filter="url(#v3grain)" />
		</svg>
	</AbsoluteFill>
);

export const RotinaV3: React.FC<{audio?: boolean; silhueta?: boolean}> = ({audio = true, silhueta = false}) => {
	const f = useCurrentFrame();
	return (
		<AbsoluteFill style={{background: '#080808'}}>
			<Fundo f={f} />
			<Cenas f={f} />
			{/* o Blender (--borda) nao grava os quadros sem celular (0 a 4, y0 > 2000) */}
			{silhueta ? <Silhueta f={f} /> : bbox(phonePose(f)).y0 > 2000 ? null : <Img src={staticFile(`v3/celular/c_${pad4(f)}.png`)} style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920}} />}
			<Grao f={f} />
			<AbsoluteFill style={{pointerEvents: 'none', background: 'radial-gradient(ellipse at 50% 46%, rgba(0,0,0,0) 58%, rgba(0,0,0,0.22) 100%)'}} />
			{audio ? <Audio src={staticFile(MIX_V3)} /> : null}
		</AbsoluteFill>
	);
};
