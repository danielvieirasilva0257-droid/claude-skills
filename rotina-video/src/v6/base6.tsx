import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Borrao5, C, Frase, Palavra} from '../v5/theme';

// Rotina v6 (vertical 1080 x 1920): o mesmo visual do v5 (fundo escuro com luzes, interface do app grande,
// frases palavra por palavra), com o celular do Blender varias vezes: tela em foco <-> elemento que sobe com o celular desfocado.

export const LARG6 = 1080;
export const ALT6 = 1920;

// fundo: quase preto + mancha vermelha (alto, esquerda) e ambar (baixo, direita) que derivam devagar
export const Fundo6: React.FC<{f: number}> = ({f}) => {
	const t = f / 30;
	const ax = -180 + 60 * Math.sin(t * 0.21);
	const ay = -160 + 70 * Math.cos(t * 0.17);
	const bx = 1260 + 60 * Math.sin(t * 0.19 + 1.3);
	const by = 2080 + 70 * Math.cos(t * 0.23 + 0.4);
	return (
		<AbsoluteFill style={{background: C.bg}}>
			<AbsoluteFill style={{background: `radial-gradient(circle 1250px at ${ax}px ${ay}px, rgba(214,24,30,0.78) 0%, rgba(160,14,20,0.40) 36%, rgba(10,10,14,0) 74%)`}} />
			<AbsoluteFill style={{background: `radial-gradient(circle 1150px at ${bx}px ${by}px, rgba(245,140,20,0.66) 0%, rgba(205,95,12,0.28) 38%, rgba(10,10,14,0) 76%)`}} />
			<AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.45) 100%)'}} />
		</AbsoluteFill>
	);
};

export const Borrao6: React.FC<{id: string; dx: number; dy: number; children: React.ReactNode; k?: number; max?: number}> = (p) => <Borrao5 {...p} w={LARG6} h={ALT6} />;

// frase em varias linhas (cada linha se monta palavra por palavra e se recentraliza sozinha)
// y = centro da primeira linha; passo = distancia entre linhas
export const Frase6: React.FC<{f: number; linhas: Palavra[][]; size: number; y: number; passo?: number; sai?: number; id: string}> = ({f, linhas, size, y, passo, sai, id}) => (
	<>
		{linhas.map((l, i) => (
			<Frase key={i} f={f} id={`${id}-${i}`} palavras={l} size={size} y={y + i * (passo ?? size * 1.22)} sai={sai} cx={LARG6 / 2} fw={LARG6} fh={ALT6} />
		))}
	</>
);
