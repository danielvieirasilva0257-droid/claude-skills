import React from 'react';
import {AbsoluteFill, interpolate, random} from 'remotion';
import {Check} from 'lucide-react';
import {DISPLAY, P, SANS, SERIF, ease, kf, sp, tw} from './theme';
import {W} from './tempo';
import {Pill, Slam} from './parts';

// S1 (f0-f164): the hook. A frantic spreadsheet; its cells become the headline, it gets crammed into a phone,
// then everything falls apart on "sob controle?". The red dot of the "?" opens the reveal.

export const Q_DOT = {x: 884, y: 1140, r: 12}; // center of the red dot of "?" (origin of the iris)
export const IRIS = {start: 155, end: 164};

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
	// frantic selection box jumping around
	const sel = Math.floor(f / 3);
	const sr = 1 + Math.floor(random('sr' + sel) * 14);
	const sc = Math.floor(random('sc' + sel) * COLS.length);
	return (
		<div style={{position: 'relative', width: SHEET_W, height: SHEET_H, background: '#FCFCFA', fontFamily: SANS, fontSize: 27, color: '#262626'}}>
			{/* column letters */}
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

// the headline is built from "cells": ink type on paper stickers
const Sticker: React.FC<{f: number; at: number; exitAt: number; rot: number; children: React.ReactNode; x: number; y: number}> = ({f, at, exitAt, rot, children, x, y}) => {
	if (f < at - 1) return null;
	const s = sp(f, at, {stiffness: 320, damping: 22});
	const e = tw(f, [exitAt, exitAt + 8], [0, 1], ease.in);
	if (e >= 1) return null;
	return (
		<div
			style={{
				position: 'absolute',
				left: x,
				top: y,
				transformOrigin: '0% 50%',
				transform: `translate(${-e * 260}px, ${(1 - s) * 60}px) rotate(${rot * s}deg) scale(${0.6 + 0.4 * s})`,
				opacity: Math.min(1, s * 2) * (1 - e),
				filter: e > 0 || s < 0.7 ? `blur(${(e * 16 + (1 - s) * 10).toFixed(1)}px)` : undefined,
			}}
		>
			<div style={{background: P.paperHi, padding: '6px 26px 0', boxShadow: '0 18px 40px rgba(0,0,0,0.18)', border: '3px solid #1E7145'}}>{children}</div>
		</div>
	);
};

const CheckChip: React.FC<{f: number; at: number; exitAt: number; x: number; y: number; label: string; rot: number}> = ({f, at, exitAt, x, y, label, rot}) => {
	if (f < at - 1) return null;
	const s = sp(f, at, {stiffness: 260, damping: 18});
	const e = tw(f, [exitAt, exitAt + 10], [0, 1], ease.in);
	const tick = sp(f, at + 4, {stiffness: 220, damping: 13});
	return (
		<div
			style={{
				position: 'absolute',
				left: x,
				top: y,
				transform: `translateY(${(1 - s) * 80 + e * 500}px) rotate(${rot + e * 25}deg) scale(${0.7 + 0.3 * s})`,
				opacity: Math.min(1, s * 1.8) * (1 - e),
			}}
		>
			<Pill size={46} style={{boxShadow: '0 22px 44px rgba(0,0,0,0.25)'}}>
				<span style={{width: 58, height: 58, borderRadius: 29, background: P.red, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${tick})`}}>
					<Check size={38} strokeWidth={4} color="#fff" />
				</span>
				{label}
			</Pill>
		</div>
	);
};

// pieces of the sheet that break loose on "Mas está tudo sob controle?"
const Debris: React.FC<{f: number; from: number; box: {x: number; y: number; w: number; h: number}}> = ({f, from, box}) => {
	if (f < from) return null;
	return (
		<>
			{Array.from({length: 26}).map((_, i) => {
				const t = (f - from - random('d0' + i) * 6) / 30;
				if (t < 0) return null;
				const x0 = box.x + random('dx' + i) * box.w;
				const y0 = box.y + random('dy' + i) * box.h;
				const vx = (random('vx' + i) - 0.5) * 1400;
				const vy = -300 - random('vy' + i) * 700;
				const x = x0 + vx * t;
				const y = y0 + vy * t + 2200 * t * t;
				const rot = (random('r' + i) - 0.5) * 720 * t;
				const w = 90 + random('w' + i) * 110;
				const label = cell(1 + (i % 12), i % 8, 0).t;
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: x,
							top: y,
							width: w,
							height: 50,
							background: '#FCFCFA',
							border: '2px solid #CFCFCA',
							fontFamily: SANS,
							fontSize: 22,
							lineHeight: '46px',
							padding: '0 8px',
							overflow: 'hidden',
							whiteSpace: 'nowrap',
							color: i % 5 === 0 ? '#C62828' : '#333',
							transform: `rotate(${rot}deg)`,
							boxShadow: '0 10px 20px rgba(0,0,0,0.12)',
						}}
					>
						{label}
					</div>
				);
			})}
		</>
	);
};

export const Gancho: React.FC<{f: number}> = ({f}) => {
	if (f > IRIS.end + 1) return null;
	const celular = W(1, 'no');
	const mas = W(2, 'Mas');
	// sheet: full-frame 3D -> crammed into a phone outline on "no celular?"
	const k = kf(f, [
		[celular - 4, 0],
		[celular + 10, 1, ease.inOut],
	]);
	const PHONE = {x: 380, y: 640, w: 320, h: 660};
	const camY = interpolate(f, [0, celular], [40, -520], {extrapolateRight: 'clamp'});
	const camX = interpolate(f, [0, celular], [-40, -170], {extrapolateRight: 'clamp'});
	const rx = 24 * (1 - k);
	const rz = -8 * (1 - k);
	const sheetScale = 1.12 + 0.04 * (f / 60) - (1.12 - 0.3) * k;
	const shake = f >= mas ? Math.sin(f * 2.7) * 7 * tw(f, [mas, mas + 6], [0, 1]) : 0;
	const clip = {
		top: PHONE.y * k + 14 * k,
		left: PHONE.x * k + 14 * k,
		right: (1080 - PHONE.x - PHONE.w) * k + 14 * k,
		bottom: (1920 - PHONE.y - PHONE.h) * k + 14 * k,
		r: 46 * k,
	};
	const explode = W(2, 'tudo');
	const sheetGone = tw(f, [explode, explode + 6], [0, 1]);
	// push-in toward the "?" before the iris
	const push = tw(f, [W(2, 'controle') + 4, IRIS.start + 2], [1, 1.07], ease.ae);
	const headExit = celular - 2;
	return (
		<AbsoluteFill style={{transformOrigin: `${Q_DOT.x}px ${Q_DOT.y}px`, transform: `scale(${push})`}}>
			{/* spreadsheet */}
			<AbsoluteFill style={{clipPath: `inset(${clip.top}px ${clip.right}px ${clip.bottom}px ${clip.left}px round ${clip.r}px)`, opacity: 1 - sheetGone, transform: k > 0.5 ? `translate(${shake}px, ${Math.sin(f / 9) * 6}px) rotate(${Math.sin(f / 14) * 1.2}deg) scale(${1 + 0.012 * Math.sin(f / 11)})` : `translateX(${shake}px)`, transformOrigin: `${PHONE.x + PHONE.w / 2}px ${PHONE.y + PHONE.h / 2}px`}}>
				<AbsoluteFill style={{background: '#F1F1EE'}} />
				<div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, perspective: 1700, perspectiveOrigin: '50% 40%'}}>
					<div
						style={{
							position: 'absolute',
							left: k > 0.5 ? PHONE.x + 18 : 540 - SHEET_W / 2,
							top: k > 0.5 ? PHONE.y + 60 : 200,
							width: SHEET_W,
							height: SHEET_H,
							transformOrigin: '0 0',
							transform:
								k > 0.5
									? `scale(${0.3}) translate(${-60 * (1 - k)}px, ${camY * 0.2}px)`
									: `translate(${camX}px, ${camY}px) rotateX(${rx}deg) rotateZ(${rz}deg) scale(${sheetScale})`,
						}}
					>
						<Sheet f={f} />
					</div>
				</div>
			</AbsoluteFill>
			{/* phone outline drawn around the crammed sheet */}
			{k > 0.02 && (
				<div
					style={{
						position: 'absolute',
						left: PHONE.x,
						top: PHONE.y,
						width: PHONE.w,
						height: PHONE.h,
						borderRadius: 58,
						border: `${14 * k}px solid ${P.ink}`,
						opacity: Math.min(1, k * 1.5) * (1 - sheetGone),
						transform: `translate(${shake}px, ${Math.sin(f / 9) * 6}px) rotate(${Math.sin(f / 14) * 1.2}deg) scale(${1.25 - 0.25 * k + 0.012 * Math.sin(f / 11)})`,
						boxShadow: '0 40px 80px rgba(0,0,0,0.25)',
					}}
				>
					<div style={{position: 'absolute', left: '50%', top: 14, width: 86, height: 24, marginLeft: -43, borderRadius: 12, background: P.ink}} />
				</div>
			)}
			<Debris f={f} from={explode} box={{x: PHONE.x, y: PHONE.y, w: PHONE.w, h: PHONE.h}} />
			{/* headline built from cells */}
			<Sticker f={f} at={W(1, 'sua')} exitAt={headExit} rot={-2.5} x={70} y={300}>
				<div style={{fontFamily: DISPLAY, fontSize: 150, lineHeight: 1.02, color: P.ink}}>SUA ROTINA</div>
			</Sticker>
			<Sticker f={f} at={W(1, 'numa')} exitAt={headExit + 2} rot={1.5} x={110} y={490}>
				<div style={{fontFamily: DISPLAY, fontSize: 150, lineHeight: 1.02, color: P.ink}}>NUMA PLANILHA</div>
			</Sticker>
			<Sticker f={f} at={W(1, 'de')} exitAt={headExit + 4} rot={-1.5} x={90} y={680}>
				<div style={{display: 'flex', alignItems: 'baseline', gap: 26}}>
					<span style={{fontFamily: DISPLAY, fontSize: 150, lineHeight: 1.02, color: P.ink}}>DE</span>
					<span style={{fontFamily: SERIF, fontStyle: 'italic', fontSize: 190, lineHeight: 0.9, color: '#1E7145'}}>Excel</span>
				</div>
			</Sticker>
			{/* "no celular?" */}
			<div style={{position: 'absolute', left: 0, right: 0, top: 300, display: 'flex', justifyContent: 'center'}}>
				<Slam f={f} at={celular} size={168} exitAt={W(2, 'Seus') - 3}>
					NO CELULAR<span style={{color: P.red}}>?</span>
				</Slam>
			</div>
			{/* what you already have under control */}
			<CheckChip f={f} at={W(2, 'treinos')} exitAt={mas + 2} x={70} y={350} label="Treinos montados" rot={-3} />
			<CheckChip f={f} at={W(2, 'faturou') - 3} exitAt={mas + 5} x={250} y={470} label="Quanto faturou" rot={2.5} />
			{/* the question */}
			<div style={{position: 'absolute', right: 120, top: 760, textAlign: 'right'}}>
				<Slam f={f} at={explode} size={200} from="right">
					TUDO SOB
				</Slam>
			</div>
			<div style={{position: 'absolute', right: 1080 - 832, top: 975, textAlign: 'right'}}>
				<Slam f={f} at={W(2, 'controle')} size={200} from="right">
					CONTROLE
				</Slam>
			</div>
			<QuestionMark f={f} at={W(2, 'controle') + 4} />
		</AbsoluteFill>
	);
};

// red "?" drawn as a hook + a dot, so the dot position is known exactly
const QuestionMark: React.FC<{f: number; at: number}> = ({f, at}) => {
	if (f < at) return null;
	const s = sp(f, at, {stiffness: 240, damping: 14});
	const pulse = 1 + 0.25 * tw(f, [IRIS.start - 8, IRIS.start], [0, 1], ease.ae);
	return (
		<svg width={84} height={156} viewBox="0 0 140 260" style={{position: 'absolute', left: Q_DOT.x - 42, top: Q_DOT.y - 133, overflow: 'visible', transform: `scale(${s})`, transformOrigin: '42px 133px'}}>
			<path d="M 26 66 C 26 18 114 10 114 64 C 114 104 70 108 70 150 L 70 170" fill="none" stroke={P.red} strokeWidth={34} strokeLinecap="round" />
			<circle cx={70} cy={222} r={(Q_DOT.r / 0.6) * pulse} fill={P.red} />
		</svg>
	);
};
