import React from 'react';
import {AbsoluteFill, Audio, Img, staticFile, useCurrentFrame} from 'remotion';
import {P, tw} from './theme';
import {SEC} from './tempo';
import {bodyQuad, phonePose, screenPoint} from './rig';
import {DirBlur, Grain, Grid, Vignette} from './parts';
import {Gancho} from './Gancho';
import {CTA, Fechamento, Fundo, Overlays, Revelacao, Titulos, isInk, isRed} from './Cenas';

// Rotina v2 (30 s, 1080x1920): paper-and-ink editorial look + a real 3D phone (pre-rendered PNG layer)

export const MIX_FILE = 'v2/rotina-v2-mix.wav';

const PhoneShadow: React.FC<{f: number}> = ({f}) => {
	const p = phonePose(f);
	if (!p.visible || isInk(f) || f >= 832) return null;
	const q = bodyQuad(p);
	const o = tw(f, [188, 202], [0, 1]);
	const pts = q.map((v) => `${(v.x + 34).toFixed(1)},${(v.y + 58).toFixed(1)}`).join(' ');
	return (
		<svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, opacity: 0.3 * o}}>
			<filter id="v2shadow" x="-30%" y="-30%" width="160%" height="160%">
				<feGaussianBlur stdDeviation="34" />
			</filter>
			<polygon points={pts} fill="#2A1A10" filter="url(#v2shadow)" />
		</svg>
	);
};

const PhoneGlow: React.FC<{f: number}> = ({f}) => {
	if (!isInk(f)) return null;
	const p = phonePose(f);
	if (!p.visible) return null;
	const c = screenPoint(p, 0.5, 0.45);
	const o = tw(f, [336, 346], [0, 1]) * (1 - tw(f, [570, 578], [0, 1]));
	return <AbsoluteFill style={{opacity: o, background: `radial-gradient(circle at ${c.x}px ${c.y}px, rgba(204,0,0,0.42) 0px, rgba(204,0,0,0.12) 380px, rgba(204,0,0,0) 640px)`}} />;
};

const PhoneLayer: React.FC<{f: number}> = ({f}) => {
	const b = phonePose(f);
	if (!b.visible) return null;
	const a = phonePose(f - 1);
	const dry = a.visible ? Math.abs(b.ry - a.ry) : 0;
	const drx = a.visible ? Math.abs(b.rx - a.rx) : 0;
	const amount = Math.min(34, (dry + drx) * 20);
	return (
		<DirBlur id="v2phoneblur" amount={amount} angle={drx > dry ? 90 : 0} style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920}}>
			<Img src={staticFile(`v2/celular/element-${String(f).padStart(3, '0')}.png`)} style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920}} />
		</DirBlur>
	);
};

export const RotinaV2: React.FC<{audio?: boolean}> = ({audio = true}) => {
	const f = useCurrentFrame();
	const ink = isInk(f);
	return (
		<AbsoluteFill style={{background: P.paper}}>
			<Fundo f={f} />
			{!isRed(f) && f >= 190 && <Grid f={f} color={ink ? 'rgba(255,255,255,0.05)' : P.grid} />}
			<Gancho f={f} />
			<Revelacao f={f} />
			<Titulos f={f} />
			<PhoneShadow f={f} />
			<PhoneGlow f={f} />
			<PhoneLayer f={f} />
			<Overlays f={f} />
			<Fechamento f={f} />
			<CTA f={f} />
			<Vignette amt={ink || f >= SEC.cta ? 0.28 : 0.14} />
			<Grain f={f} />
			{audio ? <Audio src={staticFile(MIX_FILE)} /> : null}
		</AbsoluteFill>
	);
};
