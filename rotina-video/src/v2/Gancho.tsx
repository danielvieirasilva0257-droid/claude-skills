import React from 'react';
import {AbsoluteFill, interpolate, random} from 'remotion';
import {Check} from 'lucide-react';
import {DISPLAY, P, SANS, SERIF, ease, kf, sp, tw} from './theme';
import {W} from './tempo';
import {Entra, Pill, textMetrics, textWidth} from './parts';

// S1 (f0-f164): the hook. A frantic spreadsheet whose cells become the headline, crammed into a phone,
// then it falls apart on "sob controle?". The red dot of the "?" opens the reveal.
// Rules: nothing overlaps; every word comes from outside the frame; nothing is cut by a mask.

export const IRIS = {start: 155, end: 164};

// question block: "TUDO SOB" / "CONTROLE?" right-aligned, coming from the right edge
const Q = {size: 176, line1Top: 296, line2Top: 476, right1: 968, right2: 856};
export const questionDot = () => {
	const wc = textWidth('CONTROLE', Q.size);
	const {baseline, cap} = textMetrics(Q.size);
	const scale = cap / 240; // the "?" glyph is 240 units tall in its viewBox
	const left = Q.right2 + 10; // the "?" starts right after the word
	return {
		x: left + 70 * scale,
		y: Q.line2Top + baseline - (241 - 222) * scale,
		r: 19 * scale,
		scale,
		wc,
		baseline,
		left,
	};
};

const COLS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const HEAD = ['Data', 'Treino', 'Carga', 'Hábito', 'Feito?', 'Gasto', 'Categoria', 'Saldo'];
const CW = 178;
const RH = 66;
const ROWS = 34;
const SHEET_W = 84 + CW * COLS.length;
const SHEET_H = RH * (ROWS + 1);

const TREINOS = ['Peito', 'Costas', 'Perna', 'Ombro', 'Braço', 'Cardio', 'Descanso'];
const HABITOS = ['Água 3L', 'Ler 10 pág', 'Meditar', 'Dieta', 'Dormir 23h', 'Treinar'];
const CATS = ['Mercado', 'Delivery', 'Aluguel', 'Gasolina', 'Lazer', 'Academia', 'Internet'];

const cell = (r: number, c: number, f: number): {t: string; color?: string; bold?: boolean} => {
	const seed = `${r}-${c}`;
	const flick = Math.floor(f / 4 + random(seed) * 7); // some cells keep changing (chaos)
	const live = random('live' + seed) < 0.22;
	const k = live ? flick : 0;
	if (r === 0) return {t: HEAD[c], bold: true};
	switch (c) {
		case 0:
			return {t: `${String(((r + 2) % 28) + 1).padStart(2, '0')}/10`};
		case 1:
			return {t: TREINOS[(r + k) % TREINOS.length]};
		case 2:
			return random('err' + seed + k) < 0.08 ? {t: '#REF!', color: '#C62828', bold: true} : {t: `${60 + ((r * 7 + k * 3) % 45)},5 kg`};
		case 3:
			return {t: HABITOS[(r * 3 + k) % HABITOS.length]};
		case 4:
			return random('ok' + seed + k) < 0.55 ? {t: '✓', color: '#1E7145', bold: true} : {t: '✗', color: '#C62828', bold: true};
		case 5:
			return random('w' + seed + k) < 0.1 ? {t: '########', color: '#555'} : {t: `R$ ${(15 + ((r * 37 + k * 13) % 480)).toLocaleString('pt-BR')}`};
		case 6:
			return {t: CATS[(r * 5 + k) % CATS.length]};
		default:
			return random('f' + seed) < 0.2 ? {t: '=SOMA(F2:F' + (r + 1) + ')', color: '#1E7145'} : {t: `R$ ${(2400 - r * 61 - k * 7).toLocaleString('pt-BR')}`};
	}
};

const Sheet: React.FC<{f: number}> = ({f}) => {
	const sel = Math.floor(f / 3);
	const sr = 1 + Math.floor(random('sr' + sel) * 14);
	const sc = Math.floor(random('sc' + sel) * COLS.length);
	return (
		<div style={{position: 'relative', width: SHEET_W, height: SHEET_H, background: '#FCFCFA', fontFamily: SANS, fontSize: 27, color: '#262626'}}>
			<div style={{position: 'absolute', left: 0, top: -54, width: SHEET_W, height: 54, background: '#EFEFEC', borderBottom: '2px solid #C9C9C4', display: 'flex'}}>
				<div style={{width: 84}} />
				{COLS.map((l) => (
					<div key={l} style={{width: CW, textAlign: 'center', lineHeight: '54px', color: '#777', fontWeight: 600, borderLeft: '1px solid #D5D5D0'}}>
						{l}
					</div>
				))}
			</div>
			{Array.from({length: ROWS + 1}).map((_, r) => (
				<div key={r} style={{position: 'absolute', left: 0, top: r * RH, height: RH, width: SHEET_W, display: 'flex', borderBottom: '1px solid #DCDCD7', background: r === 0 ? '#F4F4F1' : undefined}}>
					<div style={{width: 84, textAlign: 'center', lineHeight: `${RH}px`, color: '#888', background: '#EFEFEC', borderRight: '2px solid #C9C9C4', fontSize: 24}}>{r + 1}</div>
					{COLS.map((_, c) => {
						const v = cell(r, c, f);
						return (
							<div
								key={c}
								style={{
									width: CW,
									padding: '0 12px',
									lineHeight: `${RH}px`,
									borderLeft: '1px solid #DCDCD7',
									whiteSpace: 'nowrap',
									overflow: 'hidden',
									color: v.color,
									fontWeight: v.bold ? 700 : 500,
									textAlign: c === 4 ? 'center' : 'left',
								}}
							>
								{v.t}
							</div>
						);
					})}
				</div>
			))}
			<div style={{position: 'absolute', left: 84 + sc * CW - 2, top: sr * RH - 2, width: CW + 4, height: RH + 4, border: '5px solid #1E7145', boxShadow: '0 0 0 2px #fff'}} />
		</div>
	);
};

// headline "stickers": ink type on opaque paper labels; they come in from the left edge (they live on the phone screen)
const STICKER = {pad: 24, size: 140};
const Sticker: React.FC<{f: number; at: number; rot: number; x: number; y: number; id: string; children: React.ReactNode; w: number}> = ({
	f,
	at,
	rot,
	x,
	y,
	id,
	children,
	w,
}) => (
	<Entra f={f} at={at} from="left" x={x} y={y} w={w} h={STICKER.size + 20} id={id}>
		<div style={{display: 'inline-block', transform: `rotate(${rot}deg)`, transformOrigin: '0 50%'}}>
			<div style={{background: P.paperHi, padding: `4px ${STICKER.pad}px 0`, boxShadow: '0 18px 40px rgba(0,0,0,0.18)', border: '3px solid #1E7145'}}>{children}</div>
		</div>
	</Entra>
);

// pieces of the sheet that break loose and FALL out of the frame (never upward, never over the words)
const Debris: React.FC<{f: number; from: number; box: {x: number; y: number; w: number; h: number}}> = ({f, from, box}) => {
	if (f < from) return null;
	return (
		<>
			{Array.from({length: 22}).map((_, i) => {
				const t = (f - from - random('d0' + i) * 5) / 30;
				if (t < 0) return null;
				const x0 = box.x + random('dx' + i) * box.w;
				const y0 = box.y + 40 + random('dy' + i) * (box.h - 80);
				const vx = (random('vx' + i) - 0.5) * 900;
				const vy = random('vy' + i) * 350;
				const x = x0 + vx * t;
				const y = y0 + vy * t + 2600 * t * t;
				const rot = (random('r' + i) - 0.5) * 540 * t;
				const w = 90 + random('w' + i) * 100;
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: x,
							top: y,
							width: w,
							height: 46,
							background: '#FCFCFA',
							border: '2px solid #CFCFCA',
							fontFamily: SANS,
							fontSize: 20,
							lineHeight: '42px',
							padding: '0 8px',
							overflow: 'hidden',
							whiteSpace: 'nowrap',
							color: i % 5 === 0 ? '#C62828' : '#333',
							transform: `rotate(${rot}deg)`,
							boxShadow: '0 10px 20px rgba(0,0,0,0.12)',
						}}
					>
						{cell(1 + (i % 12), i % 8, 0).t}
					</div>
				);
			})}
		</>
	);
};

const CheckChip: React.FC<{label: string}> = ({label}) => (
	<Pill size={40} style={{boxShadow: '0 20px 40px rgba(0,0,0,0.25)'}}>
		<span style={{width: 52, height: 52, borderRadius: 26, background: P.red, display: 'inline-flex', alignItems: 'center', justifyContent: 'center'}}>
			<Check size={34} strokeWidth={4} color="#fff" />
		</span>
		{label}
	</Pill>
);
const chipW = (label: string) => 52 + 16 + textWidth(label.toUpperCase(), 40, SANS, false, 800) + label.length * 2.4 + 56 + 10;

// the phone of the hook (resting rect; b = bezel thickness) and the camera pull-back that reveals it
const PHONE = {x: 400, y: 700, w: 280, h: 580, b: 13, r: 52};
const PULL = {z0: 4.7}; // zoom at which the phone SCREEN covers the whole frame (254*4.7 > 1080)

export const Gancho: React.FC<{f: number}> = ({f}) => {
	if (f > IRIS.end + 1) return null;
	const celular = W(1, 'no');
	const mas = W(2, 'Mas');
	const tudo = W(2, 'tudo');
	const controle = W(2, 'controle');
	// camera pull-back on "no celular?": the hook was a phone screen all along. The screen (sheet + stickers) shrinks
	// from covering the frame to a small phone; the bezel comes in from outside the frame and always sits exactly on
	// the screen edge, so no edge of the content is ever a naked cut (editor's rule).
	const pullStart = celular - 4;
	const pullEnd = celular + 12;
	const k = kf(f, [
		[pullStart, 0],
		[pullEnd, 1, ease.soft],
	]);
	const Z = Math.pow(PULL.z0, 1 - k); // log zoom: constant perceived speed (soft ease: 12-16% per frame at most)
	const cx = PHONE.x + PHONE.w / 2;
	const cy = PHONE.y + PHONE.h / 2;
	const body = {x: cx - (PHONE.w / 2) * Z, y: cy - (PHONE.h / 2) * Z, w: PHONE.w * Z, h: PHONE.h * Z};
	const lip = (PHONE.b - 2) * Z; // the screen tucks 2 px under the bezel
	const scr = {x: body.x + lip, y: body.y + lip, w: body.w - 2 * lip, h: body.h - 2 * lip, r: (PHONE.r - PHONE.b + 2) * Z};
	const camY = interpolate(f, [0, celular], [40, -520], {extrapolateRight: 'clamp'});
	const camX = interpolate(f, [0, celular], [-40, -170], {extrapolateRight: 'clamp'});
	const rx = 24 * (1 - k);
	const rz = -8 * (1 - k);
	const sheetScale = 1.12 + 0.04 * (Math.min(f, pullEnd) / 60);
	const shake = f >= mas ? Math.sin(f * 2.7) * 7 * tw(f, [mas, mas + 6], [0, 1]) : 0;
	const settle = tw(f, [pullEnd - 6, pullEnd + 4], [0, 1], ease.inOut);
	const float = `translate(${shake}px, ${Math.sin(f / 9) * 6 * settle}px) rotate(${Math.sin(f / 14) * 1.2 * settle}deg)`;
	const sheetGone = tw(f, [tudo, tudo + 6], [0, 1]);
	// while the headline is up, the sheet becomes a soft background (blurred, lighter)
	const bgSoft = tw(f, [W(1, 'sua') - 4, W(1, 'sua') + 4], [0, 1]) * (1 - tw(f, [celular - 6, celular + 2], [0, 1]));
	const push = tw(f, [controle + 6, IRIS.start + 2], [1, 1.06], ease.ae);
	const qd = questionDot();
	const w1 = textWidth('SUA ROTINA', STICKER.size) + 2 * STICKER.pad + 6;
	const w2 = textWidth('NUMA PLANILHA', STICKER.size) + 2 * STICKER.pad + 6;
	const w3 = textWidth('DE ', STICKER.size) + textWidth('Excel', 176, SERIF, true) + 2 * STICKER.pad + 26;
	const wcel = textWidth('NO CELULAR?', 150);
	const wtudo = textWidth('TUDO SOB', Q.size);
	return (
		<AbsoluteFill style={{transformOrigin: `${qd.x}px ${qd.y}px`, transform: `scale(${push})`}}>
			{/* texts live BELOW the phone (wallpaper -> texts -> phone) */}
			{/* "no celular?" drops in from the top edge while the camera pulls back */}
			<Entra f={f} at={celular + 2} from="top" x={540 - wcel / 2} y={300} w={wcel} h={160} exitAt={mas - 2} exitTo="top" id="cel">
				<div style={{fontFamily: DISPLAY, fontSize: 150, lineHeight: 1, color: P.ink, whiteSpace: 'nowrap'}}>
					NO CELULAR<span style={{color: P.red}}>?</span>
				</div>
			</Entra>
			{/* what you already have: from the edges, above the phone */}
			<Entra f={f} at={W(2, 'treinos')} from="left" x={65} y={478} w={chipW('Treinos montados')} h={92} exitAt={mas} exitTo="left" id="ch1">
				<CheckChip label="Treinos montados" />
			</Entra>
			<Entra f={f} at={W(2, 'faturou') - 3} from="right" x={1015 - chipW('Quanto faturou')} y={588} w={chipW('Quanto faturou')} h={92} exitAt={mas + 2} exitTo="right" id="ch2">
				<CheckChip label="Quanto faturou" />
			</Entra>
			{/* the phone: screen (the spreadsheet + its stickers) and bezel move as one object */}
			<AbsoluteFill style={{opacity: 1 - sheetGone, transform: float, transformOrigin: `${cx}px ${cy}px`}}>
				<div style={{position: 'absolute', left: scr.x, top: scr.y, width: scr.w, height: scr.h, borderRadius: scr.r, overflow: 'hidden', background: '#F1F1EE'}}>
					{/* screen content in frame coordinates, scaled about the phone center (identity while it covers the frame) */}
					<div style={{position: 'absolute', left: -scr.x, top: -scr.y, width: 1080, height: 1920, transformOrigin: `${cx}px ${cy}px`, transform: `scale(${Z / PULL.z0})`}}>
						<div style={{position: 'absolute', left: -600, top: -900, width: 2280, height: 3720, background: '#F1F1EE'}} />
						<div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, perspective: 1700, perspectiveOrigin: '50% 40%', filter: bgSoft > 0.01 ? `blur(${(bgSoft * 5).toFixed(1)}px)` : undefined, opacity: 1 - 0.35 * bgSoft}}>
							<div style={{position: 'absolute', left: 540 - SHEET_W / 2, top: 200, width: SHEET_W, height: SHEET_H, transformOrigin: '0 0', transform: `translate(${camX}px, ${camY}px) rotateX(${rx}deg) rotateZ(${rz}deg) scale(${sheetScale})`}}>
								<Sheet f={f} />
							</div>
						</div>
						{/* headline stickers: in from the left edge; they stay on the screen and shrink with it */}
						<Sticker f={f} at={W(1, 'sua')} rot={-2.5} x={70} y={300} w={w1} id="st1">
							<div style={{fontFamily: DISPLAY, fontSize: STICKER.size, lineHeight: 1.02, color: P.ink, whiteSpace: 'nowrap'}}>SUA ROTINA</div>
						</Sticker>
						<Sticker f={f} at={W(1, 'numa')} rot={1.5} x={100} y={490} w={w2} id="st2">
							<div style={{fontFamily: DISPLAY, fontSize: STICKER.size, lineHeight: 1.02, color: P.ink, whiteSpace: 'nowrap'}}>NUMA PLANILHA</div>
						</Sticker>
						<Sticker f={f} at={W(1, 'de')} rot={-1.5} x={80} y={680} w={w3} id="st3">
							<div style={{display: 'flex', alignItems: 'baseline', gap: 26, whiteSpace: 'nowrap'}}>
								<span style={{fontFamily: DISPLAY, fontSize: STICKER.size, lineHeight: 1.02, color: P.ink}}>DE</span>
								<span style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: 176, lineHeight: 0.9, color: '#1E7145'}}>Excel</span>
							</div>
						</Sticker>
					</div>
				</div>
				{/* bezel: drawn on the screen edge; while zoomed in it lies outside the frame */}
				<div
					style={{
						position: 'absolute',
						left: body.x,
						top: body.y,
						width: body.w,
						height: body.h,
						borderRadius: PHONE.r * Z,
						border: `${PHONE.b * Z}px solid ${P.ink}`,
						boxSizing: 'border-box',
						boxShadow: k > 0.05 ? `0 ${40 * k}px ${80 * k}px rgba(0,0,0,${0.22 * k})` : undefined,
					}}
				>
					<div style={{position: 'absolute', left: '50%', top: 12 * Z, width: 80 * Z, height: 22 * Z, marginLeft: -40 * Z, borderRadius: 11 * Z, background: P.ink}} />
				</div>
			</AbsoluteFill>
			<Debris f={f} from={tudo} box={PHONE} />
			{/* the question: from the right edge; it leaves through the left edge as the red dot opens the reveal */}
			<Entra f={f} at={tudo} from="right" x={Q.right1 - wtudo} y={Q.line1Top} w={wtudo} h={Q.size} exitAt={IRIS.start + 1} exitTo="left" exitLen={7} id="q1">
				<div style={{fontFamily: DISPLAY, fontSize: Q.size, lineHeight: 1, color: P.ink, whiteSpace: 'nowrap'}}>TUDO SOB</div>
			</Entra>
			<Entra f={f} at={controle} from="right" x={Q.right2 - qd.wc} y={Q.line2Top} w={qd.wc + 120} h={Q.size} exitAt={IRIS.start + 2} exitTo="left" exitLen={7} id="q2">
				<div style={{position: 'relative', width: qd.wc + 120, height: Q.size}}>
					<div style={{position: 'absolute', left: 0, top: 0, fontFamily: DISPLAY, fontSize: Q.size, lineHeight: 1, color: P.ink, whiteSpace: 'nowrap'}}>CONTROLE</div>
					<QuestionMark f={f} left={qd.wc + 10} baseline={qd.baseline} scale={qd.scale} />
				</div>
			</Entra>
		</AbsoluteFill>
	);
};

// red "?" drawn as a hook + a dot (so the dot position is known exactly); its bottom sits on the text baseline
const QuestionMark: React.FC<{f: number; left: number; baseline: number; scale: number}> = ({f, left, baseline, scale}) => {
	const pulse = 1 + 0.25 * tw(f, [IRIS.start - 8, IRIS.start], [0, 1], ease.ae);
	const w = 140 * scale;
	const h = 260 * scale;
	return (
		<svg width={w} height={h} viewBox="0 0 140 260" style={{position: 'absolute', left, top: baseline - 241 * scale, overflow: 'visible'}}>
			<path d="M 26 66 C 26 18 114 10 114 64 C 114 104 70 108 70 150 L 70 170" fill="none" stroke={P.red} strokeWidth={34} strokeLinecap="round" />
			{f < IRIS.start + 2 && <circle cx={70} cy={222} r={19 * pulse} fill={P.red} />}
		</svg>
	);
};

// sp is re-exported for scenes that time things to the hook
export {sp};
