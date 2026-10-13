import React from 'react';
import {AbsoluteFill, Audio, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {P, ease, tw} from '../v2/theme';
import {Grain, Grid, Vignette} from '../v2/parts';
import {bodyQuad, screenPoint} from '../v3/camera';
import {phonePose} from '../v3/rig';
import {IRIS_LEN, T, WIPE_LEN, caixa, centro, fundoEm, mix} from './base';
import {Cenas4} from './Cenas';

// Rotina v4 (30 s, 1080 x 1920): o celular do Blender do v3 + o visual "papel e tinta" do v2.
// Camadas (regra 3 do editor): fundo -> grade -> textos e cartoes -> sombra -> celular -> vinheta/granulacao.

export const MIX_V4 = 'v4/rotina-v4-mix.wav';
const pad4 = (n: number) => String(n).padStart(4, '0');
const clampF = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// quadros refeitos no Blender com a abertura clara (o resto e o PNG do v3)
const REFEITO = (f: number) => (f >= 254 && f <= 290) || f >= 801;

// ---------------------------------------------------------------- fundos: formas solidas crescendo (sem conteudo dentro)
export const Fundo4: React.FC<{f: number}> = ({f}) => {
	const iris = (at: number) => interpolate(f, [at, at + IRIS_LEN], [0, 2300], {...clampF, easing: ease.in});
	const cR = centro(T.redIn);
	const cP = centro(T.paperIn);
	const cE = centro(T.redEnd);
	const ink = tw(f, [T.inkIn, T.inkIn + WIPE_LEN], [0, 1], ease.inOut);
	const pap = tw(f, [T.paper2In, T.paper2In + WIPE_LEN], [0, 1], ease.inOut);
	const xi = ink * 1500;
	const xp = 1080 - pap * 1500;
	return (
		<AbsoluteFill style={{background: P.paper}}>
			{f >= T.redIn && f < T.paperIn + IRIS_LEN && (
				<AbsoluteFill style={{background: P.red, clipPath: f >= T.redIn + IRIS_LEN ? undefined : `circle(${iris(T.redIn).toFixed(1)}px at ${cR.x.toFixed(1)}px ${cR.y.toFixed(1)}px)`}} />
			)}
			{f >= T.paperIn && f < T.paperIn + IRIS_LEN && <AbsoluteFill style={{background: P.paper, clipPath: `circle(${iris(T.paperIn).toFixed(1)}px at ${cP.x.toFixed(1)}px ${cP.y.toFixed(1)}px)`}} />}
			{f >= T.inkIn && f < T.paper2In + WIPE_LEN && (
				<AbsoluteFill style={{background: P.ink, clipPath: f >= T.inkIn + WIPE_LEN ? undefined : `polygon(0 0, ${xi.toFixed(1)}px 0, ${(xi - 260).toFixed(1)}px 1920px, 0 1920px)`}} />
			)}
			{f >= T.paper2In && f < T.paper2In + WIPE_LEN && (
				<AbsoluteFill style={{background: P.paper, clipPath: `polygon(${xp.toFixed(1)}px 0, 1080px 0, 1080px 1920px, ${(xp + 260).toFixed(1)}px 1920px)`}} />
			)}
			{f >= T.redEnd && (
				<AbsoluteFill style={{background: P.red, clipPath: f >= T.redEnd + IRIS_LEN ? undefined : `circle(${iris(T.redEnd).toFixed(1)}px at ${cE.x.toFixed(1)}px ${cE.y.toFixed(1)}px)`}} />
			)}
		</AbsoluteFill>
	);
};

// grade editorial do v2: some no vermelho
const Grade: React.FC<{f: number}> = ({f}) => {
	const vermelho = Math.max(
		tw(f, [T.redIn + 2, T.redIn + IRIS_LEN], [0, 1]) * (1 - tw(f, [T.paperIn + 2, T.paperIn + IRIS_LEN], [0, 1])),
		tw(f, [T.redEnd + 2, T.redEnd + IRIS_LEN], [0, 1]),
	);
	const tinta = fundoEm(f) === 'ink';
	return <Grid f={f} color={tinta ? 'rgba(255,255,255,0.05)' : P.grid} opacity={1 - vermelho} />;
};

// brilho vermelho atras do celular na secao de tinta (v2)
const Brilho: React.FC<{f: number}> = ({f}) => {
	const o = tw(f, [T.inkIn + 2, T.inkIn + 12], [0, 1]) * (1 - tw(f, [T.paper2In, T.paper2In + 8], [0, 1]));
	if (o <= 0) return null;
	const c = screenPoint(phonePose(f), 0.5, 0.45);
	return <AbsoluteFill style={{opacity: o, background: `radial-gradient(circle at ${c.x.toFixed(1)}px ${c.y.toFixed(1)}px, rgba(204,0,0,0.42) 0px, rgba(204,0,0,0.12) 380px, rgba(204,0,0,0) 660px)`}} />;
};

// quanto do quadro ja e vermelho / tinta (rampas das transicoes, para nada mudar de uma vez)
const vermelhoEm = (f: number) =>
	Math.max(tw(f, [T.redIn, T.redIn + IRIS_LEN], [0, 1]) * (1 - tw(f, [T.paperIn, T.paperIn + IRIS_LEN], [0, 1])), tw(f, [T.redEnd, T.redEnd + IRIS_LEN], [0, 1]));
const tintaEm = (f: number) => tw(f, [T.inkIn, T.inkIn + WIPE_LEN], [0, 1]) * (1 - tw(f, [T.paper2In, T.paper2In + WIPE_LEN], [0, 1]));

// sombra do celular no papel e no vermelho (some na tinta)
const Sombra: React.FC<{f: number}> = ({f}) => {
	if (caixa(f).y0 > 2000) return null;
	const naTinta = tintaEm(f);
	const v = vermelhoEm(f);
	const vermelho = v > 0.5;
	const o = (0.3 + 0.1 * v) * (1 - naTinta);
	if (o <= 0.01) return null;
	const pts = bodyQuad(phonePose(f))
		.map((v) => `${(v.x + 30).toFixed(1)},${(v.y + 58).toFixed(1)}`)
		.join(' ');
	return (
		<svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, opacity: o}}>
			<filter id="v4sombra" x="-30%" y="-30%" width="160%" height="160%">
				<feGaussianBlur stdDeviation="34" />
			</filter>
			<polygon points={pts} fill={vermelho ? mix('#2A1A10', '#3A0000', v) : '#2A1A10'} filter="url(#v4sombra)" />
		</svg>
	);
};

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

export const RotinaV4: React.FC<{audio?: boolean; silhueta?: boolean}> = ({audio = true, silhueta = false}) => {
	const f = useCurrentFrame();
	const escuro = Math.max(vermelhoEm(f), tintaEm(f));
	const hit = 862;
	const flash = f >= hit ? Math.exp(-(f - hit) / 3) * 0.22 : 0;
	return (
		<AbsoluteFill style={{background: P.paper}}>
			<Fundo4 f={f} />
			<Grade f={f} />
			<Brilho f={f} />
			<Cenas4 f={f} />
			<Sombra f={f} />
			{/* o Blender (--borda) nao grava os quadros sem celular (0 a 4, y0 > 2000) */}
			{silhueta ? (
				<Silhueta f={f} />
			) : caixa(f).y0 > 2000 ? null : (
				<Img src={staticFile(`${REFEITO(f) ? 'v4' : 'v3'}/celular/c_${pad4(f)}.png`)} style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920}} />
			)}
			<Vignette amt={0.14 + 0.14 * escuro} />
			<Grain f={f} />
			<AbsoluteFill style={{background: '#fff', opacity: flash, pointerEvents: 'none'}} />
			{audio ? <Audio src={staticFile(MIX_V4)} /> : null}
		</AbsoluteFill>
	);
};
