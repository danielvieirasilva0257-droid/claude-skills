import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Landmark} from 'lucide-react';
import {C, F, FD} from './theme';

// Tela de bloqueio do celular da abertura do v5 (textura do Blender, 1080 x 2309 = area ativa do premium.py).
// Papel de parede em gradiente (pedido do Daniel), relogio e a notificacao do salario,
// que depois salta para fora do celular em 2D (o mesmo componente, maior).

export const UI5 = {w: 390, h: 834};
const S = 1080 / UI5.w;

// notificacao do banco na tela de bloqueio (generica, sem marca: nao afirma nenhuma funcao do Rotina).
// O mesmo desenho e usado no 2D quando ela salta para fora do celular (escala maior).
export type AvisoDados = {app: string; titulo: string; valor: string; quando: string};
export const AVISO_UI = {x: 20, y: 196, w: 350, h: 118}; // posicao e tamanho na tela (pontos da UI 390 x 834)

// opaco (0..1): fundo fica solido quando ela salta do celular (nao deixa ver o que esta atras)
export const Aviso5: React.FC<{d: AvisoDados; escala?: number; opaco?: number}> = ({d, escala = 1, opaco = 0}) => {
	const k = escala;
	return (
		<div style={{width: AVISO_UI.w * k, height: AVISO_UI.h * k, boxSizing: 'border-box', borderRadius: 24 * k, padding: `${13 * k}px ${16 * k}px`, background: `rgba(26,22,24,${(0.8 + 0.2 * opaco).toFixed(3)})`, border: `${Math.max(1, 0.8 * k)}px solid rgba(255,255,255,0.09)`, fontFamily: F, color: C.text, boxShadow: k > 1.5 ? '0 40px 90px rgba(0,0,0,0.6), 0 10px 30px rgba(0,0,0,0.4)' : undefined}}>
			<div style={{display: 'flex', alignItems: 'center', gap: 9 * k}}>
				<div style={{width: 24 * k, height: 24 * k, borderRadius: 7 * k, background: '#3A3A3F', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
					<Landmark size={15 * k} color="#F5F5F7" strokeWidth={2.2} />
				</div>
				<span style={{fontWeight: 600, fontSize: 14 * k, color: 'rgba(245,245,247,0.85)'}}>{d.app}</span>
				<span style={{marginLeft: 'auto', fontWeight: 500, fontSize: 12 * k, color: 'rgba(245,245,247,0.5)'}}>{d.quando}</span>
			</div>
			<div style={{fontWeight: 600, fontSize: 15 * k, marginTop: 8 * k, color: 'rgba(245,245,247,0.9)'}}>{d.titulo}</div>
			<div style={{fontFamily: FD, fontWeight: 800, fontSize: 40 * k, lineHeight: 1.05, marginTop: 1 * k, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap'}}>{d.valor}</div>
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

export const Bloqueio5: React.FC<{data: string; hora: string; aviso: AvisoDados}> = ({data, hora, aviso}) => (
	<div style={{position: 'relative', width: UI5.w, height: UI5.h, overflow: 'hidden', background: '#0B0709', fontFamily: F}}>
		<Gradiente />
		<div style={{position: 'absolute', left: 0, right: 0, top: 60, textAlign: 'center', color: C.text}}>
			<div style={{fontWeight: 600, fontSize: 17, color: 'rgba(245,245,247,0.82)'}}>{data}</div>
			<div style={{fontFamily: FD, fontWeight: 600, fontSize: 104, lineHeight: 1.0, letterSpacing: '0.01em', marginTop: 2}}>{hora}</div>
		</div>
		{/* notificacao no terco de cima (a camera do Blender centraliza esse ponto no avanco) */}
		<div style={{position: 'absolute', left: AVISO_UI.x, top: AVISO_UI.y}}>
			<Aviso5 d={aviso} />
		</div>
		<div style={{position: 'absolute', left: (UI5.w - 134) / 2, bottom: 9, width: 134, height: 5, borderRadius: 3, background: 'rgba(245,245,247,0.6)'}} />
	</div>
);

// composicao da textura (1080 x 2309); o conteudo e definido em Cenas5 (DADOS_TELA)
export const TelaV5: React.FC<{data: string; hora: string; aviso: AvisoDados}> = (props) => {
	useCurrentFrame();
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<div style={{position: 'absolute', left: 0, top: 0, width: UI5.w, height: UI5.h, transform: `scale(${S})`, transformOrigin: '0 0'}}>
				<Bloqueio5 {...props} />
			</div>
		</AbsoluteFill>
	);
};
