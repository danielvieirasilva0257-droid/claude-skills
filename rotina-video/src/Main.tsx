import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {CameraMotionBlur} from '@remotion/motion-blur';
import {Dumbbell, ListChecks, Wallet} from 'lucide-react';
import {body, c, display, easeIn, easeInOut, tween} from './theme';
import {Phone, PHONE_W, SCREEN_W} from './Phone';
import {Habits} from './screens/Habits';
import {Workout} from './screens/Workout';
import {Finance} from './screens/Finance';
import {Caption} from './scenes/Caption';

// Timeline (30 fps, 300 frames = 10 s)
export const T = {
	phoneIn: [36, 70] as [number, number],
	habits: 50, // caption start
	whip1: [116, 130] as [number, number],
	workout: 126,
	whip2: [190, 204] as [number, number],
	finance: 200,
	// screens start building a bit before they are on screen, so a whip never reveals an empty screen
	habitsScreen: 42,
	workoutScreen: 110,
	financeScreen: 184,
	outro: 256,
	end: 300,
};

export const Main: React.FC = () => (
	<AbsoluteFill style={{background: c.bg}}>
		{/* background sits outside the blur: it barely moves, and stacking blur samples on a dark gradient causes banding */}
		<Background />
		<CameraMotionBlur shutterAngle={200} samples={10}>
			<Scene />
		</CameraMotionBlur>
		<Grain />
	</AbsoluteFill>
);

// Film grain on top (outside the blur so it stays crisp); also hides gradient banding
const Grain: React.FC = () => {
	const f = useCurrentFrame();
	return (
		<AbsoluteFill style={{opacity: 0.09, mixBlendMode: 'overlay', pointerEvents: 'none'}}>
			<svg width="100%" height="100%">
				<filter id="grain">
					<feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={f % 12} stitchTiles="stitch" />
					<feColorMatrix type="saturate" values="0" />
				</filter>
				<rect width="100%" height="100%" filter="url(#grain)" />
			</svg>
		</AbsoluteFill>
	);
};

const Scene: React.FC = () => {
	const f = useCurrentFrame();
	return (
		<AbsoluteFill style={{overflow: 'hidden'}}>
			<Intro f={f} />
			{f >= T.habits && f < T.workout + 2 && (
				<Caption
					f={f - T.habits}
					out={T.whip1[0] - T.habits - 4}
					index="01"
					title="Hábitos"
					subtitle="Marque o dia e mantenha a sequência."
					chips={['Checklist diário', 'Sequência', 'Semana']}
				/>
			)}
			{f >= T.workout && f < T.finance + 2 && (
				<Caption
					f={f - T.workout}
					out={T.whip2[0] - T.workout - 4}
					index="02"
					title="Treinos"
					subtitle="O app diz quando subir a carga."
					chips={['Treino', 'Planejar', 'Progresso', 'Cardio']}
				/>
			)}
			{f >= T.finance && f < T.outro + 12 && (
				<Caption
					f={f - T.finance}
					out={T.outro - T.finance - 2}
					index="03"
					title="Financeiro"
					subtitle="Cada real no lugar certo."
					chips={['Transações', 'Cartões', 'Rendas', 'Investimentos']}
				/>
			)}
			<PhoneRig f={f} />
			<Outro f={f} />
		</AbsoluteFill>
	);
};

const Background: React.FC = () => {
	const f = useCurrentFrame();
	const gx = interpolate(f, [0, 300], [30, 70]);
	const gy = interpolate(f, [0, 300], [62, 48]);
	return (
		<AbsoluteFill>
			<AbsoluteFill
				style={{
					background: `radial-gradient(circle at ${gx}% ${gy}%, rgba(204,0,0,0.42) 0%, rgba(204,0,0,0.08) 32%, rgba(8,8,8,0) 60%)`,
				}}
			/>
			<AbsoluteFill
				style={{
					opacity: 0.05,
					backgroundImage:
						'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
					backgroundSize: '90px 90px',
					backgroundPosition: `0 ${-f * 0.6}px`,
				}}
			/>
			<AbsoluteFill style={{background: 'radial-gradient(circle at 50% 50%, transparent 55%, rgba(0,0,0,0.7) 100%)'}} />
		</AbsoluteFill>
	);
};

const Wordmark: React.FC<{f: number; size: number}> = ({f, size}) => {
	const {fps} = useVideoConfig();
	return (
		<div style={{display: 'flex', fontFamily: display, fontWeight: 800, fontSize: size, lineHeight: 0.9, letterSpacing: '0.02em'}}>
			{'ROTINA'.split('').map((ch, i) => {
				const s = spring({frame: f - i * 2.5, fps, config: {damping: 13, stiffness: 140, mass: 0.8}});
				return (
					<span
						key={i}
						style={{
							display: 'inline-block',
							color: i === 0 ? c.redHi : c.text,
							opacity: Math.min(1, s * 1.6),
							transform: `translateY(${(1 - s) * size * 0.7}px) scale(${0.6 + 0.4 * s})`,
							filter: `blur(${Math.max(0, (1 - s) * 20)}px)`,
						}}
					>
						{ch}
					</span>
				);
			})}
		</div>
	);
};

const Intro: React.FC<{f: number}> = ({f}) => {
	if (f > 60) return null;
	const exit = tween(f, [34, 50], [0, 1], easeIn);
	return (
		<AbsoluteFill
			style={{
				alignItems: 'center',
				justifyContent: 'center',
				opacity: 1 - exit,
				transform: `translateY(${-420 * exit}px) scale(${1 - 0.25 * exit})`,
				filter: `blur(${exit * 18}px)`,
			}}
		>
			<Wordmark f={f} size={260} />
			<div style={{height: 6, width: tween(f, [10, 30], [0, 460]), background: c.red, borderRadius: 3, marginTop: 18}} />
			<div
				style={{
					fontFamily: body,
					fontSize: 46,
					fontWeight: 500,
					color: c.muted,
					marginTop: 30,
					opacity: tween(f, [14, 26], [0, 1]),
					transform: `translateY(${tween(f, [14, 30], [30, 0])}px)`,
				}}
			>
				Hábitos, treino e dinheiro. Num só app.
			</div>
		</AbsoluteFill>
	);
};

const PhoneRig: React.FC<{f: number}> = ({f}) => {
	if (f < T.phoneIn[0]) return null;

	// fly in from below with a 3D tilt
	const inP = tween(f, T.phoneIn, [0, 1]);
	// whip pans between screens
	const w1 = tween(f, T.whip1, [0, 1], easeInOut);
	const w2 = tween(f, T.whip2, [0, 1], easeInOut);
	const slide = (w1 + w2) * SCREEN_W;
	// punch-out (scale dip) during each whip
	const punch = 1 - 0.07 * Math.sin(Math.PI * w1) - 0.07 * Math.sin(Math.PI * w2);
	// slow parallax drift + quick counter-swing on whips
	const rotY = interpolate(
		f,
		[T.phoneIn[1], T.whip1[0], T.whip1[1], T.whip2[0], T.whip2[1], T.outro, T.outro + 24],
		[-7, 5, -7, 5, -7, 2, 0],
		{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
	);
	// outro: phone settles lower and smaller under the wordmark
	const o = tween(f, [T.outro, T.outro + 26], [0, 1], easeInOut);

	const y = (1 - inP) * 1500 + o * 220;
	const scale = (0.82 + 0.18 * inP) * punch * (1 - 0.22 * o);

	return (
		<AbsoluteFill style={{perspective: 2400}}>
			<div
				style={{
					position: 'absolute',
					left: (1080 - PHONE_W) / 2,
					top: 680,
					transform: `translateY(${y}px) rotateX(${(1 - inP) * 32}deg) rotateZ(${(1 - inP) * -10}deg) rotateY(${rotY}deg) scale(${scale})`,
					transformOrigin: '50% 30%',
				}}
			>
				<Phone>
					<div style={{display: 'flex', width: SCREEN_W * 3, transform: `translateX(${-slide}px)`}}>
						<Habits f={f - T.habitsScreen} />
						<Workout f={f - T.workoutScreen} />
						<Finance f={f - T.financeScreen} />
					</div>
				</Phone>
			</div>
		</AbsoluteFill>
	);
};

const Outro: React.FC<{f: number}> = ({f}) => {
	if (f < T.outro + 4) return null;
	const l = f - (T.outro + 4);
	const items = [
		{label: 'Hábitos', Icon: ListChecks},
		{label: 'Treinos', Icon: Dumbbell},
		{label: 'Financeiro', Icon: Wallet},
	];
	return (
		<AbsoluteFill style={{alignItems: 'center', paddingTop: 170}}>
			<Wordmark f={l} size={200} />
			<div
				style={{
					fontFamily: body,
					fontSize: 44,
					fontWeight: 500,
					color: c.muted,
					marginTop: 22,
					opacity: tween(l, [8, 18], [0, 1]),
					transform: `translateY(${tween(l, [8, 22], [24, 0])}px)`,
				}}
			>
				Sua rotina inteira em um só app.
			</div>
			<div style={{display: 'flex', gap: 16, marginTop: 34}}>
				{items.map(({label, Icon}, i) => {
					const d = 12 + i * 3;
					return (
						<div
							key={label}
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: 10,
								padding: '12px 24px',
								borderRadius: 40,
								background: c.redBg,
								border: `2px solid ${c.red}`,
								fontFamily: body,
								fontSize: 30,
								fontWeight: 600,
								color: c.text,
								opacity: tween(l, [d, d + 8], [0, 1]),
								transform: `scale(${tween(l, [d, d + 14], [0.5, 1])})`,
							}}
						>
							<Icon size={30} color={c.redHi} />
							{label}
						</div>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};
