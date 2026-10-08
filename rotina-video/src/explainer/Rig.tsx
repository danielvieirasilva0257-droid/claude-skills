import React from 'react';
import {Phone, PHONE_H, PHONE_W, SCREEN_W} from '../Phone';
import {c, display} from '../theme';
import {easyEase} from './timeline';

export type Pose = {x: number; y: number; scale: number; rx: number; ry: number; rz: number};

// A phone in 3D space with a front (screen) and a back plate, so it can spin 360°.
// `overlays` are positioned in phone coordinates (560×1180) and can float in front via translateZ.
export const PhoneRig: React.FC<{
	pose: Pose;
	centerY: number;
	screen: React.ReactNode;
	overlays?: React.ReactNode;
}> = ({pose, centerY, screen, overlays}) => (
	<div
		style={{
			position: 'absolute',
			left: 540 - PHONE_W / 2,
			top: centerY - PHONE_H / 2,
			width: PHONE_W,
			height: PHONE_H,
			transformStyle: 'preserve-3d',
			transform: `translate3d(${pose.x}px, ${pose.y}px, 0) rotateX(${pose.rx}deg) rotateY(${pose.ry}deg) rotateZ(${pose.rz}deg) scale(${pose.scale})`,
		}}
	>
		<div style={{position: 'absolute', inset: 0, backfaceVisibility: 'hidden'}}>
			<Phone>{screen}</Phone>
		</div>
		<PhoneBack />
		{overlays}
	</div>
);

const PhoneBack: React.FC = () => (
	<div
		style={{
			position: 'absolute',
			inset: 0,
			transform: 'rotateY(180deg)',
			backfaceVisibility: 'hidden',
			borderRadius: 86,
			background: 'linear-gradient(150deg, #2a2a2a 0%, #121212 45%, #1e1e1e 100%)',
			boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.08), 0 60px 120px rgba(0,0,0,0.7)',
		}}
	>
		<div
			style={{
				position: 'absolute',
				left: 40,
				top: 40,
				width: 210,
				height: 210,
				borderRadius: 60,
				background: '#1a1a1a',
				boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.06)',
			}}
		>
			{[
				[30, 30],
				[110, 30],
				[30, 110],
			].map(([x, y], i) => (
				<div key={i} style={{position: 'absolute', left: x, top: y, width: 70, height: 70, borderRadius: 35, background: '#050505', boxShadow: '0 0 0 6px #262626'}} />
			))}
		</div>
		<div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
			<AppIcon size={150} />
		</div>
	</div>
);

export const AppIcon: React.FC<{size: number; style?: React.CSSProperties}> = ({size, style}) => (
	<div
		style={{
			width: size,
			height: size,
			borderRadius: size * 0.27,
			background: 'linear-gradient(145deg, #FF5A5A 0%, #CC0000 60%, #8F0000 100%)',
			boxShadow: `0 ${size * 0.12}px ${size * 0.4}px rgba(204,0,0,0.45), inset 0 2px 0 rgba(255,255,255,0.25)`,
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			fontFamily: display,
			fontWeight: 800,
			fontSize: size * 0.68,
			color: c.text,
			lineHeight: 1,
			...style,
		}}
	>
		R
	</div>
);

type Shot = {at: number; local0: number; render: (f: number) => React.ReactNode; enter?: 'slide' | 'cut'};

// Picks the current screen; 'slide' entries push the previous screen out to the left over 12 frames
export const ScreenStack: React.FC<{f: number; shots: Shot[]}> = ({f, shots}) => {
	let idx = 0;
	shots.forEach((sh, i) => {
		if (f >= sh.at) idx = i;
	});
	const cur = shots[idx];
	const prev = shots[idx - 1];
	const p = cur.enter === 'slide' && prev ? Math.min(1, Math.max(0, (f - cur.at) / 12)) : 1;
	const e = easyEase(p);
	return (
		<div style={{position: 'relative', width: SCREEN_W, height: '100%'}}>
			{p < 1 && prev && (
				<div style={{position: 'absolute', inset: 0, transform: `translateX(${-e * SCREEN_W}px)`}}>{prev.render(f - prev.local0)}</div>
			)}
			<div style={{position: 'absolute', inset: 0, transform: `translateX(${(1 - e) * SCREEN_W}px)`}}>{cur.render(f - cur.local0)}</div>
		</div>
	);
};
