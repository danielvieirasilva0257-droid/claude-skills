import React from 'react';
import {AbsoluteFill, Audio, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {CameraMotionBlur} from '@remotion/motion-blur';
import {Banknote, Check, CreditCard, Dumbbell, Flame, TrendingUp} from 'lucide-react';
import {body, c, display, easeIn, easeOut, tween} from '../theme';
import {Phone} from '../Phone';
import {kf, s, SEC, VO, wordAt} from './timeline';
import {AppIcon, PhoneRig, Pose, ScreenStack} from './Rig';
import {Badge, Headline, PopOut} from './Headline';
import {Spreadsheet} from './screens/Spreadsheet';
import {HabitsList} from './screens/HabitsList';
import {HabitsStats} from './screens/HabitsStats';
import {WeekPlan} from './screens/WeekPlan';
import {StylesScreen} from './screens/Styles';
import {LogSets} from './screens/LogSets';
import {FinOverview} from './screens/FinOverview';
import {Transactions} from './screens/Transactions';
import {Expenses} from './screens/Expenses';

const CENTER_Y = 1190;

// ---------- screen schedule (global frames) ----------
const AT = {
	habitsList: s(11.7),
	habitsStats: s(16.8),
	week: SEC.treino,
	styles: s(25.9),
	log: s(30.8),
	fin: SEC.fin,
	tx: s(39.5),
	exp: s(44.4),
};
const STYLE_PICKS: [number, number][] = [
	[wordAt(6, 'força') - AT.styles, 0],
	[wordAt(6, 'hipertrofia') - AT.styles, 1],
	[wordAt(6, 'resistência') - AT.styles, 2],
	[wordAt(6, 'deload') - AT.styles, 5],
];
const TX_FILTER: [number, number] = [wordAt(9, 'entrada') - AT.tx, wordAt(9, 'saída') - AT.tx];

const SHOTS = [
	{at: 0, local0: 0, render: (f: number) => <Spreadsheet f={f} glitchAt={88} />},
	{at: AT.habitsList, local0: s(11.9), render: (f: number) => <HabitsList f={f} />, enter: 'cut' as const},
	{at: AT.habitsStats, local0: AT.habitsStats, render: (f: number) => <HabitsStats f={f} />, enter: 'slide' as const},
	{at: AT.week, local0: AT.week, render: (f: number) => <WeekPlan f={f} />, enter: 'cut' as const},
	{at: AT.styles, local0: AT.styles, render: (f: number) => <StylesScreen f={f} picks={STYLE_PICKS} />, enter: 'slide' as const},
	{at: AT.log, local0: AT.log, render: (f: number) => <LogSets f={f} />, enter: 'slide' as const},
	{at: AT.fin, local0: AT.fin, render: (f: number) => <FinOverview f={f} />, enter: 'cut' as const},
	{at: AT.tx, local0: AT.tx, render: (f: number) => <Transactions f={f} filterAt={TX_FILTER} />, enter: 'slide' as const},
	{at: AT.exp, local0: AT.exp, render: (f: number) => <Expenses f={f} />, enter: 'slide' as const},
];

// ---------- camera / phone animation (AE-style keyframes) ----------
const mainPose = (f: number): Pose => {
	const scale = kf(f, [
		[0, 1.3],
		[s(3.8), 1.45],
		[s(11.2), 0.7],
		[s(12.2), 1.0, easeOut],
		[s(13.6), 1.0],
		[s(14.3), 1.26],
		[s(16.5), 1.26],
		[s(17.0), 1.0],
		[s(18.4), 1.1],
		[s(21.3), 1.1],
		[s(22.0), 0.84],
		[s(22.7), 1.0],
		[s(23.7), 1.0],
		[s(24.3), 1.24],
		[s(25.7), 1.24],
		[s(26.1), 1.0],
		[s(30.6), 1.04],
		[s(31.1), 1.2],
		[s(33.2), 1.2],
		[s(33.9), 1.06],
		[s(35.4), 1.06],
		[s(36.0), 0.84],
		[s(36.7), 1.0],
		[s(39.2), 1.06],
		[s(39.7), 1.0],
		[s(44.2), 1.0],
		[s(45.4), 1.22],
		[s(47.2), 1.22],
		[s(47.9), 1.04],
		[s(50.0), 1.04],
		[s(50.8), 0.66],
	]);
	const flightY = kf(f, [
		[0, -60],
		[s(3.8), 0],
		[s(4.4), 1900, easeIn],
		[s(11.2), 1700],
		[s(12.2), 0, easeOut],
		[s(50.0), 0],
		[s(50.8), -70],
		[s(54.2), -70],
		[s(55.0), 1900, easeIn],
	]);
	const spin = kf(f, [
		[s(21.4), 0],
		[s(22.6), 360],
		[s(35.4), 360],
		[s(36.6), 720],
	]);
	const ry = kf(f, [
		[0, -24],
		[s(3.8), -12],
		[s(11.2), 40],
		[s(12.2), -12, easeOut],
		[s(16.6), 8],
		[s(17.0), -8],
		[s(21.3), 10],
		[s(22.6), -10],
		[s(25.8), 9],
		[s(26.2), -8],
		[s(30.7), 8],
		[s(31.1), -8],
		[s(35.3), 8],
		[s(36.6), -10],
		[s(39.4), 8],
		[s(39.8), -8],
		[s(44.2), 8],
		[s(44.6), -8],
		[s(50.0), 6],
		[s(50.8), 0],
	]);
	const rx = kf(f, [
		[0, 16],
		[s(3.8), 10],
		[s(4.4), 55, easeIn],
		[s(11.2), 38],
		[s(12.2), 7, easeOut],
		[s(50.0), 7],
		[s(50.8), 3],
	]);
	const rz = kf(f, [
		[0, 5],
		[s(3.8), 2],
		[s(4.4), -28, easeIn],
		[s(11.2), -14],
		[s(12.2), 0, easeOut],
		[s(21.4), 0],
		[s(22.0), -6],
		[s(22.6), 0],
		[s(35.4), 0],
		[s(36.0), 6],
		[s(36.6), 0],
	]);
	// zooming in also pushes the phone down so its upper half stays in frame, under the captions
	return {x: 0, y: flightY + (scale - 1) * 470, scale, rx, ry: ry + spin, rz};
};

export const Explainer: React.FC = () => (
	<AbsoluteFill style={{background: c.bg}}>
		<Background />
		<CameraMotionBlur shutterAngle={190} samples={8}>
			<Scene />
		</CameraMotionBlur>
		<Flash />
		<Grain />
		<Audio src={staticFile('soundtrack.wav')} />
	</AbsoluteFill>
);

const Scene: React.FC = () => {
	const f = useCurrentFrame();
	const phoneVisible = (f < s(4.6) || f > s(11.1)) && f < s(55.2);
	return (
		<AbsoluteFill style={{overflow: 'hidden', perspective: 2600, perspectiveOrigin: '50% 55%'}}>
			{phoneVisible && (
				<PhoneRig pose={mainPose(f)} centerY={CENTER_Y} screen={<ScreenStack f={f} shots={SHOTS} />} overlays={<Overlays f={f} />} />
			)}
			<OutroPhones f={f} />
			<Captions f={f} />
			<HookText f={f} />
			<LogoReveal f={f} />
			<FinalLogo f={f} />
		</AbsoluteFill>
	);
};

// ---------- floating pop-outs on the main phone ----------
const Overlays: React.FC<{f: number}> = ({f}) => (
	<>
		<PopOut f={f} from={s(13.0)} to={s(16.4)} x={500} y={330} z={200}>
			<Badge color={c.amber}>
				<Flame size={40} fill={c.amber} /> 12 dias
			</Badge>
		</PopOut>
		<PopOut f={f} from={s(18.6)} to={s(21.0)} x={40} y={720} z={220}>
			<Badge color={c.green}>
				<TrendingUp size={40} /> +34 pts
			</Badge>
		</PopOut>
		<PopOut f={f} from={s(33.0)} to={s(35.3)} x={510} y={560} z={220}>
			<Badge color={c.green}>
				<Check size={40} strokeWidth={3} /> +2,5 kg
			</Badge>
		</PopOut>
		{/* banks and cards fly out of the phone when they are mentioned */}
		<PopOut f={f} from={wordAt(9, 'bancos') - 4} to={s(44.1)} x={-30} y={300} z={260}>
			<Badge color={c.purple}>
				<Banknote size={40} /> 2 bancos
			</Badge>
		</PopOut>
		<PopOut f={f} from={wordAt(9, 'cartões') - 4} to={s(44.1)} x={470} y={760} z={300}>
			<CreditCardArt name="Nubank" last="4831" grad="linear-gradient(135deg,#7C3AED 0%,#4C1D95 55%,#2E1065 100%)" />
		</PopOut>
		<PopOut f={f} from={wordAt(9, 'cartões') + 4} to={s(44.1)} x={110} y={900} z={240}>
			<CreditCardArt name="Inter" last="2266" grad="linear-gradient(135deg,#F97316 0%,#C2410C 55%,#7C2D12 100%)" />
		</PopOut>
		<PopOut f={f} from={wordAt(10, 'fixas') - 2} to={s(49.6)} x={20} y={180} z={220}>
			<Badge color={c.purple}>Fixa</Badge>
		</PopOut>
		<PopOut f={f} from={wordAt(10, 'pontuais') - 2} to={s(49.6)} x={540} y={180} z={220}>
			<Badge color={c.blue}>Pontual</Badge>
		</PopOut>
	</>
);

const CreditCardArt: React.FC<{name: string; last: string; grad: string}> = ({name, last, grad}) => (
	<div
		style={{
			width: 330,
			height: 205,
			borderRadius: 24,
			padding: 24,
			background: grad,
			boxShadow: '0 30px 70px rgba(0,0,0,0.6)',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'space-between',
			fontFamily: body,
			color: '#fff',
		}}
	>
		<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 700, fontSize: 26}}>
			{name}
			<CreditCard size={34} />
		</div>
		<div>
			<div style={{width: 46, height: 34, borderRadius: 7, background: 'linear-gradient(135deg,#f5d77a,#b8913a)', marginBottom: 12}} />
			<div style={{fontSize: 24, letterSpacing: '0.12em', opacity: 0.9}}>•••• •••• •••• {last}</div>
		</div>
	</div>
);

// ---------- captions ----------
const Captions: React.FC<{f: number}> = ({f}) => (
	<>
		<Headline f={f} text="Planilhas de Excel no celular?" from={s(0.5)} to={s(3.3)} out={s(3.8)} accent={{excel: '#21C26B'}} size={112} />
		<Headline
			f={f}
			kicker="01 · Hábitos"
			text="Marque e desmarque seus afazeres"
			from={wordAt(3, 'marque')}
			to={s(VO[3].start + VO[3].dur)}
			out={s(16.6)}
			accent={{desmarque: c.redHi}}
		/>
		<Headline f={f} text="Métricas e evolução completas" from={s(17.0)} to={s(20.4)} out={s(21.3)} accent={{evolução: c.green}} />
		<Headline f={f} kicker="02 · Treino" text="Treino do dia e plano semanal" from={s(22.3)} to={s(25.6)} out={s(25.8)} accent={{semanal: c.redHi}} />
		<Headline
			f={f}
			text="Escolha o estilo da semana"
			from={s(26.0)}
			to={wordAt(6, 'força') - 4}
			out={s(30.7)}
			chips={[
				{label: 'Força', at: wordAt(6, 'força'), color: '#FF5A5A'},
				{label: 'Hipertrofia', at: wordAt(6, 'hipertrofia'), color: '#FB923C'},
				{label: 'Resistência', at: wordAt(6, 'resistência'), color: '#34D399'},
				{label: 'Deload', at: wordAt(6, 'deload'), color: '#60A5FA'},
			]}
		/>
		<Headline f={f} text="Carga, repetições, séries e evolução" from={s(31.0)} to={s(35.0)} out={s(35.5)} accent={{evolução: c.green}} />
		<Headline f={f} kicker="03 · Financeiro" text="Controle total na sua mão" from={s(36.6)} to={s(39.0)} out={s(39.4)} accent={{total: c.redHi}} />
		<Headline
			f={f}
			text="Cada entrada. Cada saída."
			from={wordAt(9, 'cada')}
			to={wordAt(9, 'seus')}
			out={s(44.2)}
			accent={{entrada: c.green, saída: c.redHi}}
			chips={[
				{label: 'Bancos', at: wordAt(9, 'bancos'), color: c.purple},
				{label: 'Cartões', at: wordAt(9, 'cartões'), color: c.orange},
				{label: 'Despesas', at: wordAt(9, 'despesas'), color: c.redHi},
			]}
		/>
		<Headline
			f={f}
			text="Despesas fixas ou pontuais"
			from={wordAt(10, 'despesas')}
			to={wordAt(10, 'pontuais') + 6}
			out={s(49.7)}
			accent={{fixas: c.purple, pontuais: c.blue}}
			chips={[
				{label: 'Cronograma completo', at: wordAt(10, 'cronograma'), color: c.amber},
				{label: 'Gastos por categoria', at: wordAt(10, 'categoria') - 6, color: c.green},
			]}
		/>
		<Headline f={f} text="Tudo em um só lugar" from={wordAt(11, 'tudo')} to={s(53.8)} out={s(54.3)} top={150} />
	</>
);

// ---------- hook: kinetic typography (4.1 s – 10 s) ----------
const HookText: React.FC<{f: number}> = ({f}) => {
	const {fps} = useVideoConfig();
	if (f < s(4.0) || f > SEC.drop + 2) return null;
	const mas = wordAt(1, 'mas');
	const ctrl = wordAt(1, 'controle');
	const rowsOut = tween(f, [mas - 8, mas + 2], [0, 1], easeIn);
	const rows = [
		{label: 'Treinos montados', Icon: Dumbbell, at: wordAt(1, 'treinos'), check: wordAt(1, 'montados') + 6},
		{label: 'Sabe quanto faturou', Icon: Banknote, at: wordAt(1, 'sabe'), check: wordAt(1, 'faturou') + 8},
	];
	const shake = f >= ctrl ? (random(`sk${f}`) - 0.5) * 18 * tween(f, [ctrl, ctrl + 20], [1, 0.25]) : 0;
	const ctrlS = spring({frame: f - ctrl, fps, config: {damping: 9, stiffness: 160}});
	return (
		<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
			<div style={{display: 'flex', flexDirection: 'column', gap: 30, opacity: 1 - rowsOut, transform: `translateY(${-160 * rowsOut}px)`, filter: `blur(${16 * rowsOut}px)`}}>
				{rows.map(({label, Icon, at, check}) => {
					const inP = tween(f, [at - 4, at + 12], [0, 1]);
					const ck = spring({frame: f - check, fps, config: {damping: 10, stiffness: 200}});
					return (
						<div
							key={label}
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: 30,
								padding: '30px 40px',
								borderRadius: 34,
								background: c.s2,
								border: `2px solid ${c.border}`,
								opacity: inP,
								transform: `translateX(${(1 - inP) * -200}px) rotateY(${(1 - inP) * 30}deg)`,
								filter: `blur(${(1 - inP) * 14}px)`,
							}}
						>
							<div style={{width: 96, height: 96, borderRadius: 26, background: c.redBg, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
								<Icon size={52} color={c.redHi} />
							</div>
							<span style={{fontFamily: display, fontSize: 82, fontWeight: 800, textTransform: 'uppercase', color: c.text}}>{label}</span>
							<div style={{width: 74, height: 74, borderRadius: 37, background: c.green, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${ck})`, opacity: f >= check ? 1 : 0}}>
								<Check size={46} strokeWidth={3.4} color="#06210f" />
							</div>
						</div>
					);
				})}
			</div>
			{f >= mas - 4 && (
				<div style={{position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `translateX(${shake}px)`}}>
					<div
						style={{
							fontFamily: display,
							fontSize: 84,
							fontWeight: 700,
							color: c.muted,
							textTransform: 'uppercase',
							opacity: tween(f, [mas - 4, mas + 6], [0, 1]),
							transform: `translateY(${tween(f, [mas - 4, mas + 12], [50, 0])}px)`,
							filter: `blur(${tween(f, [mas - 4, mas + 8], [12, 0])}px)`,
						}}
					>
						Mas você realmente tem
					</div>
					<div
						style={{
							fontFamily: display,
							fontSize: 250,
							fontWeight: 800,
							lineHeight: 0.95,
							color: c.redHi,
							textTransform: 'uppercase',
							opacity: f >= ctrl - 2 ? 1 : 0,
							transform: `scale(${0.6 + 0.4 * ctrlS})`,
							textShadow: `${-6 * (1 - ctrlS) - 3}px 0 0 rgba(0,255,255,0.45), ${6 * (1 - ctrlS) + 3}px 0 0 rgba(255,0,80,0.5)`,
						}}
					>
						Controle?
					</div>
				</div>
			)}
		</AbsoluteFill>
	);
};

// ---------- logo reveal on the drop (10 s) ----------
const Wordmark: React.FC<{f: number; size: number}> = ({f, size}) => {
	const {fps} = useVideoConfig();
	return (
		<div style={{display: 'flex', fontFamily: display, fontWeight: 800, fontSize: size, lineHeight: 0.9, letterSpacing: '0.03em'}}>
			{'ROTINA'.split('').map((ch, i) => {
				const sp = spring({frame: f - 4 - i * 2, fps, config: {damping: 12, stiffness: 160, mass: 0.7}});
				return (
					<span key={i} style={{display: 'inline-block', opacity: Math.min(1, sp * 1.6), transform: `translateY(${(1 - sp) * size * 0.7}px)`, filter: `blur(${Math.max(0, (1 - sp) * 18)}px)`}}>
						{ch}
					</span>
				);
			})}
		</div>
	);
};

const LogoReveal: React.FC<{f: number}> = ({f}) => {
	const {fps} = useVideoConfig();
	const l = f - SEC.drop;
	if (l < 0 || l > s(2.4)) return null;
	const icon = spring({frame: l, fps, config: {damping: 11, stiffness: 140}});
	const exit = tween(l, [s(1.3), s(1.9)], [0, 1], easeIn);
	return (
		<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: 1 - exit, transform: `translateY(${-700 * exit}px) scale(${1 - 0.4 * exit})`, filter: `blur(${exit * 16}px)`}}>
			<AppIcon size={260} style={{transform: `scale(${icon}) rotate(${(1 - icon) * -90}deg)`}} />
			<div style={{marginTop: 50, color: c.text}}>
				<Wordmark f={l} size={210} />
			</div>
			<div style={{fontFamily: body, fontSize: 44, fontWeight: 500, color: c.muted, marginTop: 24, opacity: tween(l, [14, 24], [0, 1])}}>
				Treino · Finanças · Hábitos
			</div>
		</AbsoluteFill>
	);
};

// ---------- outro: three phones (50 s) + final logo (54.5 s) ----------
const OutroPhones: React.FC<{f: number}> = ({f}) => {
	if (f < s(49.9) || f > s(55.2)) return null;
	const inP = tween(f, [s(50.0), s(50.9)], [0, 1], easeOut);
	const drop = tween(f, [s(54.2), s(55.0)], [0, 1], easeIn);
	const side = [
		{dir: -1, label: 'Hábitos', at: wordAt(11, 'hábitos'), screen: <HabitsStats f={200} />},
		{dir: 1, label: 'Treino', at: wordAt(11, 'treino'), screen: <LogSets f={200} />},
	];
	return (
		<>
			{side.map(({dir, label, at, screen}) => (
				<div
					key={label}
					style={{
						position: 'absolute',
						left: 540 - 280,
						top: CENTER_Y - 590,
						transform: `translate3d(${dir * interpolate(inP, [0, 1], [900, 330])}px, ${-40 + drop * 1900}px, -260px) rotateY(${dir * -26}deg) scale(0.62)`,
					}}
				>
					<Phone>{screen}</Phone>
				</div>
			))}
			{[...side, {dir: 0, label: 'Finanças', at: wordAt(11, 'finanças')}].map(({dir, label, at}) => (
				<div
					key={label}
					style={{
						position: 'absolute',
						left: 540 + dir * 330 - 150,
						width: 300,
						top: 520,
						textAlign: 'center',
						fontFamily: display,
						fontSize: 64,
						fontWeight: 800,
						textTransform: 'uppercase',
						color: dir === 0 ? c.redHi : c.text,
						opacity: tween(f, [at - 3, at + 5], [0, 1]) * (1 - drop),
						transform: `translateY(${tween(f, [at - 3, at + 12], [40, 0]) - drop * 200}px)`,
						filter: `blur(${tween(f, [at - 3, at + 8], [12, 0])}px)`,
					}}
				>
					{label}
				</div>
			))}
		</>
	);
};

const FinalLogo: React.FC<{f: number}> = ({f}) => {
	const {fps} = useVideoConfig();
	const l = f - s(54.5);
	if (l < 0) return null;
	const icon = spring({frame: l, fps, config: {damping: 12, stiffness: 140}});
	const hit = f - SEC.finalHit;
	const pulse = hit >= 0 ? 1 + 0.08 * Math.exp(-hit / 6) * Math.cos(hit / 2) : 1;
	const fade = tween(f, [s(59.3), s(60)], [0, 1]);
	return (
		<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: 1 - fade}}>
			<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `scale(${pulse})`}}>
				<AppIcon size={240} style={{transform: `scale(${icon}) rotate(${(1 - icon) * 90}deg)`}} />
				<div style={{marginTop: 46, color: c.text}}>
					<Wordmark f={l} size={200} />
				</div>
				<div
					style={{
						fontFamily: body,
						fontSize: 52,
						fontWeight: 600,
						color: c.text,
						marginTop: 26,
						opacity: tween(l, [s(0.7), s(1.0)], [0, 1]),
						transform: `translateY(${tween(l, [s(0.7), s(1.1)], [30, 0])}px)`,
					}}
				>
					Sua vida <span style={{color: c.redHi}}>no controle.</span>
				</div>
			</div>
		</AbsoluteFill>
	);
};

// ---------- finishing layers ----------
const Background: React.FC = () => {
	const f = useCurrentFrame();
	const gx = interpolate(f, [0, s(60)], [30, 70]);
	const gy = interpolate(f, [0, s(60)], [64, 46]);
	const drop = f >= SEC.drop ? 1 : tween(f, [0, SEC.drop], [0.45, 0.7]);
	return (
		<AbsoluteFill>
			<AbsoluteFill style={{background: `radial-gradient(circle at ${gx}% ${gy}%, rgba(204,0,0,${0.42 * drop}) 0%, rgba(204,0,0,${0.08 * drop}) 34%, rgba(8,8,8,0) 62%)`}} />
			<AbsoluteFill
				style={{
					opacity: 0.05,
					backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
					backgroundSize: '90px 90px',
					backgroundPosition: `0 ${-f * 0.6}px`,
				}}
			/>
			<AbsoluteFill style={{background: 'radial-gradient(circle at 50% 50%, transparent 55%, rgba(0,0,0,0.7) 100%)'}} />
		</AbsoluteFill>
	);
};

// white flash on the drop and on each section hit
const Flash: React.FC = () => {
	const f = useCurrentFrame();
	const hits: [number, number][] = [
		[SEC.drop, 0.85],
		[SEC.treino, 0.25],
		[SEC.fin, 0.25],
		[SEC.finalHit, 0.35],
	];
	const o = hits.reduce((acc, [at, amt]) => Math.max(acc, f >= at ? amt * Math.max(0, 1 - (f - at) / 8) : 0), 0);
	return <AbsoluteFill style={{background: '#fff', opacity: o, pointerEvents: 'none'}} />;
};

const Grain: React.FC = () => {
	const f = useCurrentFrame();
	return (
		<AbsoluteFill style={{opacity: 0.09, mixBlendMode: 'overlay', pointerEvents: 'none'}}>
			<svg width="100%" height="100%">
				<filter id="grain2">
					<feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={f % 12} stitchTiles="stitch" />
					<feColorMatrix type="saturate" values="0" />
				</filter>
				<rect width="100%" height="100%" filter="url(#grain2)" />
			</svg>
		</AbsoluteFill>
	);
};
