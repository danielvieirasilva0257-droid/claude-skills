import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {AppMark} from '../v2/Marca';
import {C, F, FD} from './theme';

// Tela de bloqueio do celular da abertura do v5 (textura do Blender, 1080 x 2309 = area ativa do premium.py).
// Papel de parede em gradiente (pedido do Daniel), relogio e o widget do Rotina,
// que depois salta para fora do celular em 2D (o mesmo componente, maior).

export const UI5 = {w: 390, h: 834};
const S = 1080 / UI5.w;

export type WidgetDados = {rotulo: string; meta: string; valor: string; progresso: number};

// widget do Rotina (mesmo desenho na tela de bloqueio e no 2D)
export const Widget5: React.FC<{d: WidgetDados; escala?: number; prog?: number}> = ({d, escala = 1, prog}) => {
	const k = escala;
	const p = prog ?? d.progresso;
	return (
		<div style={{width: 350 * k, boxSizing: 'border-box', borderRadius: 22 * k, padding: `${14 * k}px ${16 * k}px ${16 * k}px`, background: 'rgba(24,22,26,0.78)', border: `${Math.max(1, 0.8 * k)}px solid rgba(255,255,255,0.08)`, fontFamily: F, color: C.text, boxShadow: k > 1.5 ? '0 40px 90px rgba(0,0,0,0.6), 0 10px 30px rgba(0,0,0,0.4)' : undefined}}>
			<div style={{display: 'flex', alignItems: 'center', gap: 8 * k}}>
				<AppMark size={20 * k} bg={C.redFill} fg="#fff" />
				<span style={{fontWeight: 600, fontSize: 13.5 * k}}>{d.rotulo}</span>
				<span style={{marginLeft: 'auto', fontWeight: 500, fontSize: 11 * k, color: 'rgba(245,245,247,0.55)'}}>{d.meta}</span>
			</div>
			<div style={{fontFamily: FD, fontWeight: 800, fontSize: 40 * k, lineHeight: 1.05, marginTop: 6 * k, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap'}}>{d.valor}</div>
			<div style={{height: 5 * k, borderRadius: 3 * k, background: 'rgba(255,255,255,0.12)', marginTop: 10 * k, overflow: 'hidden'}}>
				<div style={{width: `${p * 100}%`, height: '100%', borderRadius: 3 * k, background: C.red}} />
			</div>
		</div>
	);
};

// papel de parede em gradiente (o Daniel gosta): escuro no topo (relogio e widget legiveis),
// vermelho da marca no meio e ambar embaixo, com uma luz suave e granulacao fina
const Gradiente: React.FC = () => (
	<>
		<div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #0B0709 0%, #1A0608 26%, #5A0A10 52%, #B3121B 72%, #E8461E 88%, #F59E0B 100%)'}} />
		<div style={{position: 'absolute', inset: 0, background: 'radial-gradient(90% 45% at 18% 78%, rgba(255,120,60,0.55) 0%, rgba(255,120,60,0) 70%)'}} />
		<div style={{position: 'absolute', inset: 0, background: 'radial-gradient(80% 40% at 88% 62%, rgba(255,40,60,0.45) 0%, rgba(255,40,60,0) 70%)'}} />
		<div style={{position: 'absolute', inset: 0, background: 'radial-gradient(120% 50% at 50% 0%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 70%)'}} />
		<svg width={UI5.w} height={UI5.h} style={{position: 'absolute', inset: 0, mixBlendMode: 'overlay', opacity: 0.18}}>
			<filter id="t5grao">
				<feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves={2} seed={3} stitchTiles="stitch" />
				<feColorMatrix type="saturate" values="0" />
			</filter>
			<rect width="100%" height="100%" filter="url(#t5grao)" />
		</svg>
	</>
);

export const Bloqueio5: React.FC<{data: string; hora: string; widget: WidgetDados; notifs?: {app: string; msg: string; quando: string}[]}> = ({data, hora, widget, notifs = []}) => (
	<div style={{position: 'relative', width: UI5.w, height: UI5.h, overflow: 'hidden', background: '#0B0709', fontFamily: F}}>
		<Gradiente />
		<div style={{position: 'absolute', left: 0, right: 0, top: 60, textAlign: 'center', color: C.text}}>
			<div style={{fontWeight: 600, fontSize: 17, color: 'rgba(245,245,247,0.82)'}}>{data}</div>
			<div style={{fontFamily: FD, fontWeight: 600, fontSize: 104, lineHeight: 1.0, letterSpacing: '0.01em', marginTop: 2}}>{hora}</div>
		</div>
		{/* widget no centro do terco de cima (v ~ 0,27: e o ponto que a camera do Blender centraliza no avanco) */}
		<div style={{position: 'absolute', left: 20, top: 196}}>
			<Widget5 d={widget} />
		</div>
		<div style={{position: 'absolute', left: 14, right: 14, top: 330, display: 'flex', flexDirection: 'column', gap: 8}}>
			{notifs.map((n) => (
				<div key={n.msg} style={{height: 64, borderRadius: 20, background: 'rgba(30,28,32,0.72)', border: '0.8px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 11, padding: '0 13px'}}>
					<AppMark size={34} bg={C.redFill} fg="#fff" />
					<div style={{flex: 1, minWidth: 0, color: C.text}}>
						<div style={{display: 'flex', justifyContent: 'space-between', fontSize: 13.5, fontWeight: 600}}>
							<span>{n.app}</span>
							<span style={{fontWeight: 500, fontSize: 11.5, color: 'rgba(245,245,247,0.5)'}}>{n.quando}</span>
						</div>
						<div style={{fontSize: 13, fontWeight: 500, color: 'rgba(245,245,247,0.78)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{n.msg}</div>
					</div>
				</div>
			))}
		</div>
		<div style={{position: 'absolute', left: (UI5.w - 134) / 2, bottom: 9, width: 134, height: 5, borderRadius: 3, background: 'rgba(245,245,247,0.6)'}} />
	</div>
);

// composicao da textura (1080 x 2309); o conteudo e definido em Cenas5 (DADOS_TELA)
export const TelaV5: React.FC<{data: string; hora: string; widget: WidgetDados; notifs?: {app: string; msg: string; quando: string}[]}> = (props) => {
	useCurrentFrame();
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<div style={{position: 'absolute', left: 0, top: 0, width: UI5.w, height: UI5.h, transform: `scale(${S})`, transformOrigin: '0 0'}}>
				<Bloqueio5 {...props} />
			</div>
		</AbsoluteFill>
	);
};
