import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {ArrowDown, BatteryCharging, Check, Download, Dumbbell, Flame, Footprints, Square, TrendingUp, Trophy, X} from 'lucide-react';
import {c, display as BARLOW_C} from '../theme';
import {DISPLAY, P, SANS, SERIF, drift, ease, kf, sp, tw} from './theme';
import {SEC, W} from './tempo';
import {phonePose, screenPoint} from './rig';
import {DirBlur, Pill, Slam, UiCard, lift} from './parts';
import {AppMark, Wordmark} from './Marca';
import {IRIS, Q_DOT} from './Gancho';

const clampF = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const sc = (f: number, u: number, v: number) => {
	const p = phonePose(f);
	return p.visible ? screenPoint(p, u, v) : {x: 540, y: 960, depth: 0};
};
// exit helper: progress 0..1 with ease-in starting at `at`
const out = (f: number, at: number, len = 9) => tw(f, [at, at + len], [0, 1], ease.in);

// ============================================================ S2: red reveal (behind the phone)
export const Revelacao: React.FC<{f: number}> = ({f}) => {
	if (f < SEC.drop - 2 || f > 200) return null;
	const pop = sp(f, SEC.drop, {stiffness: 220, damping: 14});
	const draw = tw(f, [SEC.drop + 2, SEC.drop + 16], [0, 1], ease.ae);
	const burst = tw(f, [182, 192], [0, 1], ease.in);
	const exit = out(f, 188, 10);
	const voce = W(3, 'você');
	const under = tw(f, [voce + 4, voce + 14], [0, 1], ease.out);
	return (
		<AbsoluteFill>
			<div style={{position: 'absolute', left: 540 - 125, top: 760 - 125, width: 250, height: 250, transform: `scale(${pop * (1 + 0.5 * burst)}) rotate(${(1 - pop) * -28}deg)`, opacity: 1 - burst}}>
				<AppMark size={250} bg={P.white} fg={P.red} draw={draw} />
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: 920, display: 'flex', justifyContent: 'center', transform: `translateY(${exit * 160}px)`, opacity: 1 - exit, filter: exit > 0 ? `blur(${exit * 14}px)` : undefined}}>
				<Wordmark
					size={230}
					color={P.white}
					letters={(i) => {
						const s = sp(f, W(3, 'app') + i * 2, {stiffness: 300, damping: 22});
						return {transform: `translateY(${(1 - s) * 120}px)`, opacity: Math.min(1, s * 1.6), filter: s < 0.8 ? `blur(${(1 - s) * 12}px)` : undefined};
					}}
				/>
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: 1170, display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `translateY(${exit * 200}px)`, opacity: 1 - exit}}>
				<Slam f={f} at={voce} size={128} font={SERIF} italic color={P.white}>
					você tem.
				</Slam>
				<svg width={420} height={40} style={{marginTop: -14}}>
					<path d="M 10 26 C 110 6, 220 36, 410 14" fill="none" stroke={P.white} strokeWidth={9} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - under} />
				</svg>
			</div>
		</AbsoluteFill>
	);
};

// ============================================================ big section titles (behind the phone)
const SectionTitle: React.FC<{
	f: number;
	at: number;
	text: string;
	size: number;
	color: string;
	top?: number;
	toHeaderAt?: number;
	headerScale?: number;
	exitAt: number;
	shiftX?: number;
}> = ({f, at, text, size, color, top = 420, toHeaderAt = 1e9, headerScale = 0.38, exitAt, shiftX = 0}) => {
	if (f < at - 1 || f > exitAt + 12) return null;
	const h = sp(f, toHeaderAt, SPRH);
	const s = 1 - (1 - headerScale) * h;
	const y = top + (275 - top) * h;
	const e = out(f, exitAt, 10);
	return (
		<div style={{position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center', transform: `translateX(${shiftX + drift(f, 6, 110)}px) scale(${s})`, transformOrigin: '50% 0%', opacity: 1 - e, filter: e > 0 ? `blur(${e * 16}px)` : undefined}}>
			<Slam f={f} at={at} size={size} color={color} tracking="0.01em">
				{text}
			</Slam>
		</div>
	);
};
const SPRH = {stiffness: 170, damping: 22};

export const Titulos: React.FC<{f: number}> = ({f}) => {
	const whip = tw(f, [326, 334], [0, 1], ease.in);
	return (
		<AbsoluteFill>
			<div style={{position: 'absolute', inset: 0, transform: `translateX(${-whip * 900}px)`}}>
				<SectionTitle f={f} at={196} text="HÁBITOS" size={300} color={P.ink} exitAt={330} shiftX={kf(f, [[262, 0], [282, -70]])} />
			</div>
			<SectionTitle f={f} at={340} text="TREINO" size={330} color={P.paperHi} toHeaderAt={W(6, 'monta')} exitAt={W(8, 'veja') - 2} />
			<SectionTitle f={f} at={580} text="FINANCEIRO" size={205} color={P.ink} toHeaderAt={630} headerScale={0.5} exitAt={786} />
		</AbsoluteFill>
	);
};

// ============================================================ lifted cards and kinetic words (in front of the phone)
const LiftBox: React.FC<{
	f: number;
	at: number;
	src: {x: number; y: number};
	x: number;
	y: number;
	w: number;
	exitAt: number;
	exitTo?: {x: number; y: number};
	rot?: number;
	children: React.ReactNode;
	cfg?: {stiffness: number; damping: number};
}> = ({f, at, src, x, y, w, exitAt, exitTo = {x: -900, y: 0}, rot = 0, children, cfg}) => {
	if (f < at) return null;
	const L = lift(f, at, {x: src.x - w / 2, y: src.y - 40}, {x, y}, cfg);
	const e = out(f, exitAt, 10);
	if (e >= 1) return null;
	const dx = drift(f, 5, 100, x) + exitTo.x * e;
	const dy = drift(f, 6, 120, y) + exitTo.y * e;
	const blurAmt = Math.min(28, (1 - Math.min(1, L.s)) * 30 + e * 30);
	return (
		<DirBlur id={`lb${at}-${x}`} amount={blurAmt} angle={exitTo.y !== 0 ? 90 : 0} style={{position: 'absolute', left: 0, top: 0}}>
			<div
				style={{
					position: 'absolute',
					left: L.x + dx,
					top: L.y + dy,
					width: w,
					transform: `scale(${L.scale}) rotate(${rot * L.s + drift(f, 0.6, 140, x)}deg)`,
					transformOrigin: '50% 50%',
					opacity: Math.min(1, L.s * 2),
				}}
			>
				{children}
			</div>
		</DirBlur>
	);
};

const Big: React.FC<{children: React.ReactNode; size: number; color?: string; style?: React.CSSProperties}> = ({children, size, color = P.ink, style}) => (
	<div style={{fontFamily: DISPLAY, fontSize: size, lineHeight: 1, color, ...style}}>{children}</div>
);
const Lbl: React.FC<{children: React.ReactNode; color?: string; size?: number}> = ({children, color = P.mute, size = 28}) => (
	<div style={{fontFamily: SANS, fontWeight: 700, fontSize: size, letterSpacing: '0.08em', textTransform: 'uppercase', color}}>{children}</div>
);

// ---------------- Hábitos
const Habitos: React.FC<{f: number}> = ({f}) => {
	if (f < 190 || f > 280) return null;
	const marque = W(4, 'Marque');
	const desm = W(4, 'desmarque');
	const seq = W(4, 'sequência');
	const count = f >= seq + 3 ? 13 : 12;
	const bump = sp(f, seq + 3, {stiffness: 220, damping: 12});
	return (
		<>
			<LiftBox f={f} at={marque} src={sc(marque, 0.2, 0.33)} x={56} y={770} w={430} exitAt={262} rot={-3}>
				<Pill size={44} style={{boxShadow: '0 20px 40px rgba(0,0,0,0.22)'}}>
					<span style={{width: 56, height: 56, borderRadius: 14, background: P.red, display: 'inline-flex', alignItems: 'center', justifyContent: 'center'}}>
						<Check size={38} strokeWidth={4} color="#fff" />
					</span>
					Marque
				</Pill>
			</LiftBox>
			<LiftBox f={f} at={desm} src={sc(desm, 0.2, 0.52)} x={90} y={890} w={470} exitAt={264} rot={2}>
				<Pill size={44} bg={P.paperHi} color={P.ink} style={{boxShadow: '0 20px 40px rgba(0,0,0,0.18)', border: `3px solid ${P.ink}`}}>
					<span style={{width: 56, height: 56, borderRadius: 14, border: `4px solid ${P.ink}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center'}}>
						<X size={34} strokeWidth={4} color={P.ink} />
					</span>
					Desmarque
				</Pill>
			</LiftBox>
			<LiftBox f={f} at={seq - 6} src={sc(seq - 6, 0.6, 0.17)} x={600} y={660} w={430} exitAt={266} exitTo={{x: 900, y: 0}} rot={-3}>
				<UiCard style={{padding: '26px 30px'}}>
					<div style={{fontFamily: BARLOW_C, fontWeight: 600, fontSize: 28, letterSpacing: '0.12em', color: c.muted}}>SEQUÊNCIA</div>
					<div style={{display: 'flex', alignItems: 'center', gap: 16}}>
						<Flame size={84} color={c.amber} fill={c.amber} style={{transform: `scale(${1 + 0.3 * Math.sin(Math.PI * Math.min(1, bump))})`}} />
						<span style={{fontFamily: BARLOW_C, fontWeight: 800, fontSize: 132, lineHeight: 1, color: c.amber, display: 'inline-block', transform: `translateY(${f >= seq + 3 ? (1 - Math.min(1, bump)) * 30 : 0}px)`}}>{count}</span>
						<span style={{fontFamily: 'Barlow', fontSize: 34, color: c.muted, lineHeight: 1.1}}>
							dias
							<br />
							seguidos
						</span>
					</div>
				</UiCard>
			</LiftBox>
		</>
	);
};

// ---------------- Métricas
const WEEK = [100, 80, 100, 60, 100, 80, 100];
const Metricas: React.FC<{f: number}> = ({f}) => {
	if (f < 266 || f > 336) return null;
	const at = W(5, 'gráficos') - 2;
	const sem = W(5, 'semana', 0);
	const whip = tw(f, [326, 334], [0, 1], ease.in);
	return (
		<div style={{position: 'absolute', inset: 0, transform: `translateX(${-whip * 1100}px)`}}>
			<LiftBox f={f} at={at} src={sc(at, 0.5, 0.42)} x={565} y={560} w={470} exitAt={1e9} rot={2}>
				<UiCard>
					<div style={{fontFamily: BARLOW_C, fontWeight: 600, fontSize: 28, letterSpacing: '0.12em', color: c.muted, marginBottom: 18}}>ESTA SEMANA</div>
					<div style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 230}}>
						{WEEK.map((v, i) => {
							const g = sp(f, sem - 6 + i * 3, {stiffness: 200, damping: 16});
							return (
								<div key={i} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10}}>
									<div style={{width: 40, height: 190, borderRadius: 12, background: '#1D1D1D', display: 'flex', alignItems: 'flex-end'}}>
										<div style={{width: '100%', height: `${v * Math.min(1.06, g)}%`, borderRadius: 12, background: v === 100 ? c.redHi : 'rgba(255,90,90,0.55)'}} />
									</div>
									<span style={{fontFamily: 'Barlow', fontWeight: 600, fontSize: 24, color: c.faint}}>{'STQQSSD'[i]}</span>
								</div>
							);
						})}
					</div>
				</UiCard>
			</LiftBox>
			<div style={{position: 'absolute', left: 566, top: 960}}>
				<Slam f={f} at={W(5, 'evoluiu') - 1} size={150} color={P.red}>
					+34 PTS
				</Slam>
			</div>
			<div style={{position: 'absolute', left: 572, top: 1128, opacity: tw(f, [W(5, 'evoluiu') + 3, W(5, 'evoluiu') + 10], [0, 1])}}>
				<Lbl>Conclusão em 12 semanas</Lbl>
			</div>
		</div>
	);
};

// ---------------- Treino: plano da semana (ink section, paper chips)
const DAYS = [
	['SEG', 'PEITO', c.redHi],
	['TER', 'COSTAS', c.blue],
	['QUA', 'PERNA', c.green],
	['QUI', 'OMBRO', c.amber],
	['SEX', 'BRAÇO', c.pink],
	['SÁB', 'CARDIO', c.orange],
	['DOM', '—', c.faint],
] as const;
const Plano: React.FC<{f: number}> = ({f}) => {
	if (f < 340 || f > 404) return null;
	const at0 = W(6, 'cada') - 4;
	const whole = W(6, 'inteira');
	const glow = tw(f, [whole - 2, whole + 4], [0, 1]);
	const br = tw(f, [W(6, 'semana') - 2, whole + 6], [0, 1], ease.ae);
	const ex = out(f, 393, 10);
	return (
		<div style={{position: 'absolute', inset: 0, transform: `translateY(${-ex * 700}px)`, opacity: 1 - ex}}>
			{DAYS.map(([d, m, col], i) => {
				const at = at0 + i * 3;
				const x = 58 + i * 138;
				return (
					<LiftBox key={d} f={f} at={at} src={sc(at, 0.12 + i * 0.127, 0.22)} x={x} y={440} w={128} exitAt={1e9} rot={i % 2 ? 2 : -2} cfg={{stiffness: 230, damping: 20}}>
						<div
							style={{
								height: 168,
								borderRadius: 22,
								background: P.paperHi,
								border: `4px solid ${glow > 0.5 ? col : 'transparent'}`,
								boxShadow: glow > 0 ? `0 0 ${30 * glow}px ${col}` : '0 18px 36px rgba(0,0,0,0.35)',
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								justifyContent: 'center',
								gap: 6,
							}}
						>
							<div style={{fontFamily: SANS, fontWeight: 800, fontSize: 26, letterSpacing: '0.06em', color: P.mute}}>{d}</div>
							<div style={{fontFamily: DISPLAY, fontSize: m.length > 5 ? 32 : 38, color: m === '—' ? P.mute : col === c.amber ? '#B7791F' : col}}>{m}</div>
						</div>
					</LiftBox>
				);
			})}
			<svg width={1080} height={120} style={{position: 'absolute', left: 0, top: 618}}>
				<path d="M 64 10 L 64 34 L 1016 34 L 1016 10" fill="none" stroke={P.paperHi} strokeWidth={6} strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - br} />
			</svg>
			<div style={{position: 'absolute', left: 0, right: 0, top: 668, display: 'flex', justifyContent: 'center', opacity: tw(f, [whole - 2, whole + 6], [0, 1])}}>
				<Pill size={34} bg={P.red} color={P.white}>
					Semana inteira
				</Pill>
			</div>
		</div>
	);
};

// ---------------- Treino: estilos (kinetic word stack)
const ESTILOS = [
	{w: 'força', t: 'FORÇA', col: '#FF5A5A', Icon: Flame},
	{w: 'hipertrofia', t: 'HIPERTROFIA', col: '#FB923C', Icon: Dumbbell},
	{w: 'resistência', t: 'RESISTÊNCIA', col: '#34D399', Icon: Footprints},
	{w: 'deload', t: 'DELOAD', col: '#60A5FA', Icon: BatteryCharging},
];
const Estilos: React.FC<{f: number}> = ({f}) => {
	if (f < W(7, 'Defina') - 2 || f > 490) return null;
	const ex = out(f, 476, 10);
	const ats = ESTILOS.map((e) => W(7, e.w));
	const cur = ats.filter((a) => f >= a).length - 1;
	return (
		<div style={{position: 'absolute', inset: 0, transform: `translateY(${-ex * 900}px)`, opacity: 1 - ex}}>
			<div style={{position: 'absolute', left: 0, right: 0, top: 392, display: 'flex', justifyContent: 'center', opacity: cur >= 0 ? 0.55 : 1}}>
				<Slam f={f} at={W(7, 'Defina')} size={86} font={SERIF} italic color={P.paperHi}>
					o estilo de cada semana
				</Slam>
			</div>
			{ESTILOS.map((e, i) => {
				const at = ats[i];
				const dim = cur > i ? 0.32 : 1;
				const pop = sp(f, at, {stiffness: 260, damping: 18});
				return (
					<div key={e.t} style={{position: 'absolute', left: 0, right: 0, top: 500 + i * 118, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 22, opacity: dim}}>
						{f >= at && <e.Icon size={84} color={e.col} strokeWidth={2.6} style={{transform: `scale(${pop}) rotate(${(1 - pop) * -40}deg)`}} />}
						<Slam f={f} at={at} size={124} color={e.col} from="right">
							{e.t}
						</Slam>
					</div>
				);
			})}
		</div>
	);
};

// ---------------- Treino: séries + gráfico
const DATA = [
	{w: 'carga', lbl: 'Carga', val: '82,5 kg'},
	{w: 'repetições', lbl: 'Repetições', val: '10'},
	{w: 'séries', lbl: 'Séries', val: '3'},
];
const PTS = [92, 93, 95, 95, 98, 101, 104, 107, 110];
const Series: React.FC<{f: number}> = ({f}) => {
	if (f < 480 || f > 580) return null;
	const veja = W(8, 'veja');
	const g0 = W(8, 'gráfico') - 1;
	const ev = W(8, 'evoluiu');
	const draw = tw(f, [g0, ev], [0, 1], ease.ae);
	const X0 = 90;
	const X1 = 990;
	const Y0 = 560;
	const Y1 = 330;
	const pts = PTS.map((v, i) => [X0 + (i / (PTS.length - 1)) * (X1 - X0), Y0 - ((v - 90) / 22) * (Y0 - Y1)]);
	const d = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
	const last = pts[pts.length - 1];
	const dot = sp(f, ev, {stiffness: 220, damping: 12});
	const flip = out(f, 568, 10);
	return (
		<>
			{DATA.map((dd, i) => {
				const at = W(8, dd.w) - 1;
				return (
					<LiftBox key={dd.w} f={f} at={at} src={sc(at, 0.45, 0.28)} x={56} y={470 + i * 170} w={400} exitAt={veja - 2 + i * 2} rot={[-3, 2, -2][i]}>
						<div style={{background: P.paperHi, borderRadius: 26, padding: '16px 28px 10px', boxShadow: '0 22px 44px rgba(0,0,0,0.4)'}}>
							<Lbl size={26}>{dd.lbl}</Lbl>
							<Big size={92}>{dd.val}</Big>
						</div>
					</LiftBox>
				);
			})}
			{f >= g0 - 2 && (
				<div style={{position: 'absolute', inset: 0, transform: `translateY(${flip * 600}px)`, opacity: 1 - flip}}>
					<svg width={1080} height={700} style={{position: 'absolute', left: 0, top: 0}}>
						<defs>
							<linearGradient id="v2area" x1="0" x2="0" y1="0" y2="1">
								<stop offset="0" stopColor={P.red} stopOpacity={0.55} />
								<stop offset="1" stopColor={P.red} stopOpacity={0} />
							</linearGradient>
							<clipPath id="v2areaclip">
								<rect x={0} y={0} width={X0 + (X1 - X0) * draw} height={700} />
							</clipPath>
						</defs>
						{[0, 1, 2].map((k) => (
							<line key={k} x1={X0} x2={X1} y1={Y1 + k * 115} y2={Y1 + k * 115} stroke="rgba(255,255,255,0.08)" strokeWidth={2} />
						))}
						<path d={d + ` L ${X1} ${Y0} L ${X0} ${Y0} Z`} fill="url(#v2area)" clipPath="url(#v2areaclip)" />
						<path d={d} fill="none" stroke={P.paperHi} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
						{f >= ev && <circle cx={last[0]} cy={last[1]} r={22 * dot} fill={P.red} stroke={P.paperHi} strokeWidth={6} />}
					</svg>
					<div style={{position: 'absolute', left: 560, top: 300, display: 'flex', alignItems: 'center', gap: 16}}>
						{f >= ev && <TrendingUp size={70} color={c.green} strokeWidth={3} style={{transform: `scale(${dot})`}} />}
						<Slam f={f} at={ev} size={120} color={c.green}>
							+19%
						</Slam>
					</div>
					<div style={{position: 'absolute', left: 90, top: 600, display: 'flex', gap: 12, alignItems: 'center', opacity: tw(f, [ev + 2, ev + 10], [0, 1])}}>
						<Trophy size={34} color={c.amber} />
						<Lbl color={P.paperHi}>Novo recorde · 110 kg</Lbl>
					</div>
				</div>
			)}
		</>
	);
};

// ---------------- Financeiro: saldo + para onde vai cada real
const FLOW = [
	{name: 'Moradia', pct: '48%', col: c.purple},
	{name: 'Mercado', pct: '19%', col: '#65A30D'},
	{name: 'Saúde', pct: '14%', col: '#059669'},
];
const Saldo: React.FC<{f: number}> = ({f}) => {
	if (f < 590 || f > 650) return null;
	const at = W(9, 'você') - 1;
	const k = tw(f, [at + 2, W(9, 'real') + 2], [0, 1], ease.out);
	const cada = W(9, 'cada');
	const ex = out(f, 637, 9);
	return (
		<div style={{position: 'absolute', inset: 0, transform: `translateY(${-ex * 600}px)`, opacity: 1 - ex}}>
			<LiftBox f={f} at={at} src={sc(at, 0.5, 0.3)} x={575} y={640} w={460} exitAt={1e9} rot={2}>
				<UiCard>
					<div style={{fontFamily: BARLOW_C, fontWeight: 600, fontSize: 28, letterSpacing: '0.12em', color: c.muted}}>SALDO DO MÊS</div>
					<div style={{fontFamily: BARLOW_C, fontWeight: 800, fontSize: 96, lineHeight: 1.05, fontVariantNumeric: 'tabular-nums'}}>R$ {Math.round(3240 * k).toLocaleString('pt-BR')}</div>
					<div style={{display: 'flex', gap: 20, marginTop: 8, fontFamily: 'Barlow', fontSize: 26, fontWeight: 600}}>
						<span style={{color: c.green}}>↑ R$ 6.550</span>
						<span style={{color: c.redHi}}>↓ R$ 3.310</span>
					</div>
				</UiCard>
			</LiftBox>
			<svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
				{FLOW.map((fl, i) => {
					const p = tw(f, [cada + i * 4, cada + i * 4 + 10], [0, 1], ease.out);
					const y = 690 + i * 120;
					return <path key={fl.name} d={`M 575 ${760} C 500 ${760}, 470 ${y + 34}, 400 ${y + 34}`} fill="none" stroke={P.ink} strokeWidth={4} strokeDasharray="10 10" strokeDashoffset={(1 - p) * 300} opacity={p} />;
				})}
			</svg>
			{FLOW.map((fl, i) => {
				const at2 = cada + 2 + i * 4;
				return (
					<LiftBox key={fl.name} f={f} at={at2} src={{x: 600, y: 760}} x={54} y={690 + i * 120} w={350} exitAt={1e9} rot={[-2, 1.5, -1][i]} cfg={{stiffness: 240, damping: 19}}>
						<Pill size={36} bg={P.paperHi} color={P.ink} style={{border: `3px solid ${P.ink}`, boxShadow: '0 14px 28px rgba(0,0,0,0.15)'}}>
							<span style={{width: 26, height: 26, borderRadius: 13, background: fl.col}} />
							{fl.name}
							<span style={{fontFamily: DISPLAY, fontWeight: 400, fontSize: 44, letterSpacing: 0}}>{fl.pct}</span>
						</Pill>
					</LiftBox>
				);
			})}
		</div>
	);
};

// ---------------- Financeiro: entradas, saídas, bancos e cartões
const Row: React.FC<{sign: '+' | '−'; value: string; desc: string; tag: string}> = ({sign, value, desc, tag}) => {
	const inn = sign === '+';
	return (
		<UiCard style={{padding: '20px 26px', display: 'flex', alignItems: 'center', gap: 20}}>
			<div style={{width: 74, height: 74, borderRadius: 20, background: inn ? c.greenBg : c.redBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: BARLOW_C, fontWeight: 800, fontSize: 56, color: inn ? c.green : c.redHi}}>
				{sign}
			</div>
			<div style={{flex: 1}}>
				<div style={{fontFamily: 'Barlow', fontWeight: 600, fontSize: 32}}>{desc}</div>
				<div style={{fontFamily: BARLOW_C, fontWeight: 600, fontSize: 24, letterSpacing: '0.1em', color: c.muted}}>{tag}</div>
			</div>
			<div style={{fontFamily: BARLOW_C, fontWeight: 800, fontSize: 52, color: inn ? c.green : c.redHi}}>{value}</div>
		</UiCard>
	);
};
const BankCard: React.FC<{name: string; digits: string; from: string; to: string}> = ({name, digits, from, to}) => (
	<div style={{width: 430, height: 270, borderRadius: 30, background: `linear-gradient(135deg, ${from}, ${to})`, boxShadow: '0 30px 60px rgba(0,0,0,0.35)', padding: 30, position: 'relative', color: '#fff', overflow: 'hidden'}}>
		<div style={{position: 'absolute', right: -60, top: -80, width: 260, height: 260, borderRadius: 130, background: 'rgba(255,255,255,0.08)'}} />
		<div style={{width: 70, height: 52, borderRadius: 10, background: 'linear-gradient(135deg, #E9C46A, #B8860B)'}} />
		<div style={{position: 'absolute', left: 30, bottom: 70, fontFamily: SANS, fontWeight: 600, fontSize: 34, letterSpacing: '0.12em'}}>•••• {digits}</div>
		<div style={{position: 'absolute', left: 30, bottom: 28, fontFamily: SANS, fontWeight: 800, fontSize: 24, letterSpacing: '0.1em', opacity: 0.85}}>{name}</div>
	</div>
);
const Transacoes: React.FC<{f: number}> = ({f}) => {
	if (f < 636 || f > 716) return null;
	const ent = W(10, 'entrada') - 1;
	const sai = W(10, 'saída') - 1;
	const ban = W(10, 'bancos') - 1;
	const car = W(10, 'cartões') - 1;
	const ex = out(f, 702, 10);
	return (
		<div style={{position: 'absolute', inset: 0, transform: `translateX(${ex * 1000}px)`, opacity: 1 - ex}}>
			<LiftBox f={f} at={ent} src={sc(ent, 0.5, 0.45)} x={548} y={470} w={500} exitAt={1e9} rot={-2}>
				<Row sign="+" value="R$ 4.800" desc="Salário" tag="ENTRADA · PIX" />
			</LiftBox>
			<LiftBox f={f} at={sai} src={sc(sai, 0.5, 0.55)} x={548} y={610} w={500} exitAt={1e9} rot={1.5}>
				<Row sign="−" value="R$ 420" desc="Mercado do mês" tag="SAÍDA · CRÉDITO" />
			</LiftBox>
			<LiftBox f={f} at={ban} src={{x: 420, y: 900}} x={580} y={780} w={430} exitAt={1e9} rot={-8} cfg={{stiffness: 160, damping: 17}}>
				<BankCard name="CONTA CORRENTE" digits="4821" from="#6D28D9" to="#1E1B4B" />
			</LiftBox>
			<LiftBox f={f} at={car} src={{x: 420, y: 980}} x={612} y={850} w={430} exitAt={1e9} rot={5} cfg={{stiffness: 160, damping: 17}}>
				<BankCard name="CARTÃO DE CRÉDITO" digits="9173" from="#CC0000" to="#2B0000" />
			</LiftBox>
		</div>
	);
};

// ---------------- Financeiro: fixa x pontual, cronograma, categorias
const DOTS = [2, 5, 12, 15, 26];
const DONUT = [
	{name: 'Moradia', v: 48, col: c.purple},
	{name: 'Mercado', v: 19, col: '#A3E635'},
	{name: 'Saúde & Fitness', v: 14, col: c.green},
	{name: 'Alimentação', v: 11, col: c.orange},
	{name: 'Lazer', v: 8, col: c.pink},
];
const Despesas: React.FC<{f: number}> = ({f}) => {
	if (f < 708 || f > 800) return null;
	const at = W(11, 'despesa') - 3;
	const fixa = W(11, 'fixa') - 1;
	const pont = W(11, 'pontual') - 1;
	const knob = sp(f, pont, {stiffness: 650, damping: 40, mass: 0.5});
	const press = (t: number) => (f >= t && f < t + 10 ? 1 - 0.035 * Math.sin((Math.PI * (f - t)) / 10) : 1);
	const cro = W(11, 'cronograma') - 3;
	const cat = W(11, 'categoria') - 3;
	const calOut = out(f, cat - 2, 8);
	const ex = out(f, 786, 9);
	const R = 104;
	const C = 2 * Math.PI * R;
	const grow = tw(f, [cat + 1, cat + 16], [0, 1], ease.ae);
	let acc = 0;
	return (
		<div style={{position: 'absolute', inset: 0, transform: `translateY(${-ex * 700}px)`, opacity: 1 - ex}}>
			<LiftBox f={f} at={at} src={sc(at, 0.5, 0.18)} x={90} y={390} w={900} exitAt={1e9} rot={0}>
				<div style={{transform: `scale(${press(fixa) * press(pont)})`, position: 'relative', height: 150, borderRadius: 75, background: P.paperHi, border: `5px solid ${P.ink}`, boxShadow: '0 24px 48px rgba(0,0,0,0.18)', display: 'flex', overflow: 'hidden'}}>
					<div style={{position: 'absolute', top: 10, bottom: 10, left: 10 + knob * (445 - 10), width: 435, borderRadius: 65, background: P.red, boxShadow: '0 8px 20px rgba(204,0,0,0.35)'}} />
					{['FIXA', 'PONTUAL'].map((t, i) => (
						<div key={t} style={{position: 'relative', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: DISPLAY, fontSize: 76, color: (i === 0 ? 1 - knob : knob) > 0.5 ? P.white : P.ink}}>
							{t}
						</div>
					))}
				</div>
			</LiftBox>
			{f >= cro && calOut < 1 && (
				<div style={{position: 'absolute', inset: 0, transform: `translateX(${-calOut * 700}px)`, opacity: 1 - calOut}}>
					<LiftBox f={f} at={cro} src={sc(cro, 0.5, 0.5)} x={64} y={590} w={460} exitAt={1e9} rot={-2}>
						<UiCard style={{padding: 26}}>
							<div style={{fontFamily: BARLOW_C, fontWeight: 700, fontSize: 34, letterSpacing: '0.1em', marginBottom: 12}}>OUTUBRO</div>
							<div style={{display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6}}>
								{Array.from({length: 31}).map((_, i) => {
									const day = i + 1;
									const has = DOTS.indexOf(day);
									const pp = has >= 0 ? sp(f, cro + 4 + has * 3, {stiffness: 260, damping: 15}) : 0;
									return (
										<div key={i} style={{height: 46, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', fontFamily: 'Barlow', fontWeight: 600, fontSize: 22, color: has >= 0 ? '#fff' : c.faint, background: has >= 0 ? `rgba(204,0,0,${0.85 * Math.min(1, pp)})` : '#1D1D1D'}}>
											{day}
										</div>
									);
								})}
							</div>
						</UiCard>
					</LiftBox>
				</div>
			)}
			{f >= cat && (
				<LiftBox f={f} at={cat} src={sc(cat, 0.3, 0.75)} x={64} y={600} w={470} exitAt={1e9} rot={2}>
					<UiCard style={{padding: 26, display: 'flex', alignItems: 'center', gap: 18}}>
						<svg width={240} height={240} style={{transform: 'rotate(-90deg)', flexShrink: 0}}>
							<circle cx={120} cy={120} r={R} fill="none" stroke="#2A2A2A" strokeWidth={34} />
							{DONUT.map((d) => {
								const len = (d.v / 100) * C * grow;
								const off = acc * grow;
								acc += (d.v / 100) * C;
								return <circle key={d.name} cx={120} cy={120} r={R} fill="none" stroke={d.col} strokeWidth={34} strokeDasharray={`${Math.max(0, len - 4)} ${C}`} strokeDashoffset={-off} />;
							})}
						</svg>
						<div>
							{DONUT.slice(0, 3).map((d, i) => (
								<div key={d.name} style={{display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, opacity: tw(f, [cat + 4 + i * 3, cat + 10 + i * 3], [0, 1])}}>
									<span style={{width: 16, height: 16, borderRadius: 8, background: d.col}} />
									<span style={{fontFamily: 'Barlow', fontSize: 24, color: c.muted}}>{d.name.split(' ')[0]}</span>
									<span style={{fontFamily: BARLOW_C, fontWeight: 800, fontSize: 30}}>{d.v}%</span>
								</div>
							))}
						</div>
					</UiCard>
				</LiftBox>
			)}
		</div>
	);
};

export const Overlays: React.FC<{f: number}> = ({f}) => (
	<AbsoluteFill>
		<Habitos f={f} />
		<Metricas f={f} />
		<Plano f={f} />
		<Estilos f={f} />
		<Series f={f} />
		<Saldo f={f} />
		<Transacoes f={f} />
		<Despesas f={f} />
	</AbsoluteFill>
);

// ============================================================ S6: "Hábitos, treino e dinheiro. Um app só."
export const Fechamento: React.FC<{f: number}> = ({f}) => {
	if (f < 790 || f > 846) return null;
	const um = W(12, 'Um');
	const target = sc(um + 4, 0.5, 0.45);
	const col = tw(f, [um - 1, um + 8], [0, 1], ease.in);
	const zoom = tw(f, [837, 846], [0, 1], ease.in);
	const words: [string, number][] = [
		['HÁBITOS', W(12, 'Hábitos')],
		['TREINO', W(12, 'treino')],
		['DINHEIRO', W(12, 'dinheiro')],
	];
	return (
		<AbsoluteFill>
			{words.map(([t, at], i) => {
				const top = 290 + i * 150;
				const dx = (target.x - 540) * col;
				const dy = (target.y - (top + 75)) * col;
				return (
					<div key={t} style={{position: 'absolute', left: 0, right: 0, top, display: 'flex', justifyContent: 'center', transform: `translate(${dx}px, ${dy}px) scale(${1 - 0.85 * col})`, opacity: 1 - col * 0.9, filter: col > 0 ? `blur(${col * 10}px)` : undefined}}>
						<Slam f={f} at={at - 1} size={150} color={i === 2 ? P.red : P.ink}>
							{t}
						</Slam>
					</div>
				);
			})}
			<div style={{position: 'absolute', left: 0, right: 0, top: 330, display: 'flex', justifyContent: 'center', transform: `scale(${1 + 1.6 * zoom})`, opacity: 1 - zoom}}>
				<Slam f={f} at={W(12, 'app') - 1} size={150} font={SERIF} italic color={P.ink}>
					um app só.
				</Slam>
			</div>
		</AbsoluteFill>
	);
};

// ============================================================ S7: end card (red) with the CTA
export const CTA: React.FC<{f: number}> = ({f}) => {
	if (f < SEC.cta) return null;
	const s = sp(f, SEC.cta, {stiffness: 150, damping: 20});
	// start = where the splash logo was on the phone screen at f846 (the zoom ends there)
	const markSize = interpolate(s, [0, 1], [417, 230]);
	const markY = interpolate(s, [0, 1], [826, 450]);
	const wmSize = interpolate(s, [0, 1], [222, 168]);
	const wmY = interpolate(s, [0, 1], [1200, 640]);
	const btn = sp(f, W(13, 'Baixe') + 5, {stiffness: 220, damping: 15});
	const pressAt = W(13, 'agora');
	const press = sp(f, pressAt, {stiffness: 500, damping: 20});
	const pressScale = f >= pressAt ? 1 - 0.06 * Math.sin(Math.PI * Math.min(1, press)) * Math.exp(-(f - pressAt) / 10) : 1;
	const ripple = tw(f, [pressAt, pressAt + 18], [0, 1], ease.out);
	const link = W(13, 'Link') - 1;
	const hit = SEC.finalHit;
	const pulse = f >= hit ? 1 + 0.07 * Math.exp(-(f - hit) / 5) * Math.cos((f - hit) / 2.2) : 1;
	const flash = f >= hit ? Math.exp(-(f - hit) / 3) * 0.3 : 0;
	const spin = (f - SEC.cta) * 6 * (f >= hit ? 1.6 : 1);
	return (
		<AbsoluteFill>
			<div style={{position: 'absolute', left: 540 - markSize / 2, top: markY - markSize / 2 + drift(f, 4, 80), transform: `scale(${pulse})`}}>
				<AppMark size={markSize} bg={P.white} fg={P.red} />
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: wmY - wmSize * 0.46, display: 'flex', justifyContent: 'center', transform: `scale(${pulse})`}}>
				<Wordmark size={wmSize} color={P.white} />
			</div>
			{f >= W(13, 'Baixe') + 5 && (
				<div style={{position: 'absolute', left: 540 - 380, top: 840, width: 760, height: 160, transform: `scale(${btn * pressScale})`}}>
					{/* spinning gradient ring (button-animation recipe), drawn as a rotating conic gradient behind the pill */}
					<div style={{position: 'absolute', inset: -10, borderRadius: 90, overflow: 'hidden'}}>
						<div style={{position: 'absolute', left: '50%', top: '50%', width: 1000, height: 1000, marginLeft: -500, marginTop: -500, background: 'conic-gradient(from 0deg, rgba(255,255,255,0) 0deg, rgba(255,255,255,0.95) 70deg, rgba(255,180,180,0.9) 120deg, rgba(255,255,255,0) 180deg, rgba(255,255,255,0) 360deg)', transform: `rotate(${spin}deg)`}} />
					</div>
					<div style={{position: 'absolute', inset: 0, borderRadius: 80, background: P.white, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 26, boxShadow: '0 30px 60px rgba(80,0,0,0.35)', overflow: 'hidden'}}>
						{f >= pressAt && <div style={{position: 'absolute', left: 380 - 400 * ripple, top: 80 - 400 * ripple, width: 800 * ripple, height: 800 * ripple, borderRadius: '50%', background: `rgba(204,0,0,${0.18 * (1 - ripple)})`}} />}
						<Download size={70} color={P.red} strokeWidth={3} />
						<span style={{fontFamily: DISPLAY, fontSize: 96, color: P.ink, letterSpacing: '0.01em'}}>BAIXE AGORA</span>
					</div>
				</div>
			)}
			{f >= link && (
				<div style={{position: 'absolute', left: 0, right: 0, top: 1060, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 18, opacity: Math.min(1, sp(f, link) * 1.5), transform: `translateY(${(1 - sp(f, link)) * 40}px)`}}>
					<span style={{fontFamily: SANS, fontWeight: 800, fontSize: 58, letterSpacing: '0.1em', color: P.white}}>LINK NA BIO</span>
					<ArrowDown size={60} color={P.white} strokeWidth={3.2} style={{transform: `translateY(${Math.abs(Math.sin((f - link) / 4.5)) * 16}px)`}} />
				</div>
			)}
			<AbsoluteFill style={{background: '#fff', opacity: flash, pointerEvents: 'none'}} />
		</AbsoluteFill>
	);
};

// ============================================================ backgrounds (paper / red / ink / paper / red)
export const Fundo: React.FC<{f: number}> = ({f}) => {
	// red iris from the "?" dot
	const irisR = interpolate(f, [IRIS.start, IRIS.end], [Q_DOT.r, 2300], {...clampF, easing: ease.in});
	// paper opens again from the phone center (as it bursts out of the logo)
	const ph = sc(Math.max(188, Math.min(200, f)), 0.5, 0.5);
	const paperR = interpolate(f, [187, 200], [0, 2300], {...clampF, easing: ease.in});
	// ink wipe during the whip (right -> left), paper wipe during the flip (top -> bottom)
	const ink = tw(f, [329, 340], [0, 1], ease.inOut);
	const paper2 = tw(f, [571, 582], [0, 1], ease.inOut);
	return (
		<AbsoluteFill style={{background: P.paper}}>
			{f >= IRIS.start && f < 202 && (
				<AbsoluteFill style={{background: P.red, clipPath: f >= IRIS.end ? undefined : `circle(${irisR}px at ${Q_DOT.x}px ${Q_DOT.y}px)`}} />
			)}
			{f >= 187 && f < 202 && <AbsoluteFill style={{background: P.paper, clipPath: `circle(${paperR}px at ${ph.x}px ${ph.y}px)`}} />}
			{f >= 329 && f < 584 && (
				<AbsoluteFill style={{background: P.ink, clipPath: f >= 340 ? undefined : `polygon(${1080 - ink * 1500}px 0, 1080px 0, 1080px 1920px, ${1080 - ink * 1500 + 260}px 1920px)`}} />
			)}
			{f >= 571 && f < 584 && <AbsoluteFill style={{background: P.paper, clipPath: `polygon(0 0, 1080px 0, 1080px ${paper2 * 2300 - 300}px, 0 ${paper2 * 2300}px)`}} />}
			{f >= SEC.cta && <AbsoluteFill style={{background: P.red}} />}
		</AbsoluteFill>
	);
};

export const isInk = (f: number) => f >= 336 && f < 578;
export const isRed = (f: number) => (f >= IRIS.end && f < 190) || f >= SEC.cta;
