import voz from './voz.json';

// Tempos do v5 (30 fps): tudo sai do voz.json (voz Leda a 1,0x, pausas entre falas de 0,5 s, como no modelo).
export const FPS = 30;
export const END5 = 672; // 22,4 s (a trilha tem a mesma duracao)

type Word = {word: string; start: number; end: number};
type Line = {n: number; text: string; start: number; end: number; words: Word[]};
export const LINES5 = (voz as unknown as {lines: Line[]}).lines;

const norm = (s: string) => s.toLowerCase().replace(/[.,!?;:]/g, '');
const find = (ln: number, word: string, nth = 0) => {
	const ws = LINES5[ln - 1].words.filter((w) => norm(w.word) === norm(word));
	if (!ws[nth]) throw new Error(`palavra nao encontrada: fala ${ln} "${word}" #${nth}`);
	return ws[nth];
};
export const W5 = (ln: number, word: string, nth = 0) => Math.round(find(ln, word, nth).start * FPS);
export const WE5 = (ln: number, word: string, nth = 0) => Math.round(find(ln, word, nth).end * FPS);
export const LINE5 = (ln: number) => ({start: Math.round(LINES5[ln - 1].start * FPS), end: Math.round(LINES5[ln - 1].end * FPS)});

// abertura do celular (Blender): pousa, a camera avanca ate a notificacao, que salta para fora
export const INTRO5 = {pousa: 30, avanca: 34, salta: 50, some: 72};
