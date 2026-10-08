import React from 'react';
import {BatteryFull, Signal, Wifi} from 'lucide-react';
import {body, c} from './theme';

export const PHONE_W = 560;
export const PHONE_H = 1180;
const BEZEL = 14;
// Screens are designed at iPhone logical width (390pt) and scaled to fit
export const SCREEN_W = 390;
export const SCREEN_SCALE = (PHONE_W - BEZEL * 2) / SCREEN_W;
export const SCREEN_H = (PHONE_H - BEZEL * 2) / SCREEN_SCALE;

export const Phone: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({
	children,
	style,
}) => (
	<div
		style={{
			width: PHONE_W,
			height: PHONE_H,
			borderRadius: 86,
			padding: BEZEL,
			background: 'linear-gradient(150deg, #3a3a3a 0%, #151515 30%, #0b0b0b 70%, #2c2c2c 100%)',
			boxShadow:
				'0 0 0 2px #050505, 0 60px 120px rgba(0,0,0,0.75), 0 0 90px rgba(204,0,0,0.18), inset 0 0 0 1px rgba(255,255,255,0.08)',
			...style,
		}}
	>
		<div
			style={{
				position: 'relative',
				width: '100%',
				height: '100%',
				borderRadius: 72,
				overflow: 'hidden',
				background: c.bg,
			}}
		>
			<div
				style={{
					width: SCREEN_W,
					height: SCREEN_H,
					transform: `scale(${SCREEN_SCALE})`,
					transformOrigin: 'top left',
					position: 'relative',
				}}
			>
				{children}
				<StatusBar />
			</div>
			{/* glass reflection */}
			<div
				style={{
					position: 'absolute',
					inset: 0,
					background: 'linear-gradient(115deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0) 38%)',
					pointerEvents: 'none',
				}}
			/>
		</div>
	</div>
);

const StatusBar: React.FC = () => (
	<div
		style={{
			position: 'absolute',
			top: 0,
			left: 0,
			right: 0,
			height: 50,
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'space-between',
			padding: '0 30px',
			fontFamily: body,
			fontSize: 15,
			fontWeight: 600,
			color: c.text,
		}}
	>
		<span>9:41</span>
		<div
			style={{
				position: 'absolute',
				left: '50%',
				top: 11,
				width: 120,
				height: 34,
				marginLeft: -60,
				borderRadius: 20,
				background: '#000',
			}}
		/>
		<span style={{display: 'flex', gap: 5, alignItems: 'center'}}>
			<Signal size={15} strokeWidth={2.6} />
			<Wifi size={15} strokeWidth={2.6} />
			<BatteryFull size={20} strokeWidth={2} />
		</span>
	</div>
);
