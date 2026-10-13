import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Dumbbell, Flame, Footprints, ListChecks, Wallet} from 'lucide-react';
import {C, Frase, Fundo5, Grao5} from './theme';
import {Lista, Resumo, Topo} from './blocos';
import {Logo, SeloDia} from './pecas';

// Quadro de estilo do v5 (so para conferir fontes, cores e pecas; nao entra no video)
export const EstiloV5: React.FC = () => {
	const f = useCurrentFrame() + 60;
	return (
		<AbsoluteFill>
			<Fundo5 f={f} />
			<div style={{position: 'absolute', left: 0, top: -330}}>
				<Frase
					f={f}
					id="e1"
					size={64}
					y={540}
					palavras={[
						{t: 'Você', at: 0},
						{t: 'planeja', at: 2},
						{t: 'força', at: 4, titulo: true, icone: Flame, cor: C.red},
						{t: 'e', at: 6},
						{t: 'hipertrofia', at: 8, titulo: true, icone: Dumbbell, cor: C.orange},
					]}
				/>
			</div>
			<div style={{position: 'absolute', left: 80, top: 330}}>
				<Topo esquerda="Semana · 13 a 19 out" rotulo="cumpriu" valor="13 de 20" w={860} />
			</div>
			<div style={{position: 'absolute', left: 0, top: 0}}>
				<Lista
					f={f}
					x={80}
					topo={410}
					secoes={[
						{
							titulo: 'Treino',
							icone: Dumbbell,
							cor: C.orange,
							total: '3 de 4',
							at: 0,
							itens: [
								{selo: <SeloDia dia="13" mes="SEG" />, titulo: 'Peito', sub: 'Supino reto · 3 x 10', valor: '82,5 kg'},
								{selo: <SeloDia dia="14" mes="TER" />, titulo: 'Costas', sub: 'Remada curvada · 4 x 8', valor: '70 kg'},
							],
						},
					]}
				/>
			</div>
			<div style={{position: 'absolute', left: 1020, top: 330}}>
				<Resumo f={f} at={0} acende={10} linhas={[{rotulo: 'Planejado na semana', valor: '20 metas'}, {rotulo: 'Cumprido', valor: '13'}]} segmentos={[13, 4, 2, 1]} titulo="Sua semana" grande="65,0%" w={820} />
			</div>
			<div style={{position: 'absolute', left: 1040, top: 70}}>
				<Logo f={f} at={0} size={110} />
			</div>
			<div style={{position: 'absolute', left: 90, top: 930, display: 'flex', gap: 40, alignItems: 'center'}}>
				{[ListChecks, Flame, Dumbbell, Footprints, Wallet].map((I, i) => (
					<I key={i} size={56} color={[C.red, C.amber, C.orange, C.green, C.purple][i]} strokeWidth={2.2} />
				))}
			</div>
			<Grao5 f={f} />
		</AbsoluteFill>
	);
};
