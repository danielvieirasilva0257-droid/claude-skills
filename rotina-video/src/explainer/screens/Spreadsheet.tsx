import React from 'react';
import {random} from 'remotion';
import {body, tween} from '../../theme';
import {SCREEN_H} from '../../Phone';

// The "before": a cramped Excel sheet on a phone. Selection jumps around; at `glitchAt` errors appear and cells shake.
const COLS = ['Data', 'Treino', 'Carga', 'Gasto', 'Categ.', 'Hábito'];
const ROWS = 24;
const W = [52, 66, 50, 62, 58, 54];

const cell = (r: number, col: number) => {
	const k = random(`cell-${r}-${col}`);
	switch (col) {
		case 0:
			return `${String(1 + (r % 30)).padStart(2, '0')}/10`;
		case 1:
			return ['Peito', 'Costas', 'Perna', 'Ombro', 'Braço', '—'][Math.floor(k * 6)];
		case 2:
			return `${Math.round(40 + k * 80)}kg`;
		case 3:
			return `-${Math.round(12 + k * 300)},00`;
		case 4:
			return ['Mercado', 'iFood', 'Uber', 'Lazer', 'Casa'][Math.floor(k * 5)];
		default:
			return k > 0.5 ? 'OK' : '';
	}
};

export const Spreadsheet: React.FC<{f: number; glitchAt: number}> = ({f, glitchAt}) => {
	const g = f - glitchAt;
	const sel = Math.floor(f / 5);
	const selR = 2 + Math.floor(random(`sr${sel}`) * 18);
	const selC = Math.floor(random(`sc${sel}`) * 6);
	const scroll = tween(f, [0, 120], [0, 160]);
	return (
		<div style={{width: 390, height: SCREEN_H, background: '#fff', fontFamily: body, color: '#222', overflow: 'hidden'}}>
			<div style={{height: 50}} />
			<div style={{background: '#107C41', color: '#fff', padding: '8px 12px', fontSize: 13, fontWeight: 600}}>
				Planilha_rotina_FINAL(3).xlsx
			</div>
			<div style={{display: 'flex', gap: 8, padding: '6px 10px', fontSize: 11, borderBottom: '1px solid #ccc', background: '#f3f3f3'}}>
				<b style={{color: '#107C41'}}>fx</b>
				<span>=SOMA(D2:D31)-PROCV(B4;Treinos!A:C;3;0)</span>
			</div>
			<div style={{position: 'relative', transform: `translateY(${-scroll}px)`}}>
				<div style={{display: 'flex', background: '#e8e8e8', fontSize: 11, fontWeight: 700}}>
					<div style={{width: 26}} />
					{COLS.map((h, i) => (
						<div key={h} style={{width: W[i], padding: '4px 3px', borderRight: '1px solid #ccc'}}>
							{h}
						</div>
					))}
				</div>
				{Array.from({length: ROWS}).map((_, r) => {
					const shake = g > 0 ? (random(`sh${r}-${f}`) - 0.5) * Math.min(14, g * 2) : 0;
					return (
						<div key={r} style={{display: 'flex', fontSize: 10.5, borderBottom: '1px solid #e2e2e2', transform: `translateX(${shake}px)`}}>
							<div style={{width: 26, background: '#e8e8e8', textAlign: 'center', padding: '4px 0', color: '#666'}}>{r + 2}</div>
							{COLS.map((_, col) => {
								const err = g > 0 && random(`e${r}-${col}`) < Math.min(0.5, g / 30);
								const isSel = r === selR && col === selC && g < 0;
								return (
									<div
										key={col}
										style={{
											width: W[col],
											padding: '4px 3px',
											borderRight: '1px solid #e2e2e2',
											whiteSpace: 'nowrap',
											overflow: 'hidden',
											color: err ? '#C00' : col === 3 ? '#B00' : '#222',
											fontWeight: err ? 700 : 400,
											background: err ? '#FDE2E2' : r % 2 ? '#fafafa' : '#fff',
											outline: isSel ? '2px solid #107C41' : 'none',
											outlineOffset: -2,
										}}
									>
										{err ? (random(`t${r}${col}`) > 0.5 ? '#REF!' : '#N/D') : cell(r, col)}
									</div>
								);
							})}
						</div>
					);
				})}
			</div>
		</div>
	);
};
