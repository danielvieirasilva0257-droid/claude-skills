import {continueRender, delayRender, Easing, interpolate, staticFile} from 'remotion';

// Same design tokens as the Rotina app
export const c = {
	bg: '#080808',
	s1: '#101010',
	s2: '#151515',
	s3: '#1D1D1D',
	border: '#262626',
	track: '#2A2A2A',
	text: '#FFFFFF',
	muted: '#A3A3A3',
	faint: '#808080',
	red: '#CC0000',
	redHi: '#FF5A5A',
	redBg: 'rgba(204,0,0,0.14)',
	green: '#34D399',
	greenBg: 'rgba(52,211,153,0.12)',
	amber: '#FBBF24',
	amberBg: 'rgba(251,191,36,0.12)',
	blue: '#60A5FA',
	purple: '#A78BFA',
	pink: '#F472B6',
	orange: '#FB923C',
};

// Fonts are bundled in public/fonts so rendering works offline
export const body = 'Barlow';
export const display = 'Barlow Condensed';

const FONTS: [string, string, string][] = [
	[body, '400', 'barlow-latin-400-normal'],
	[body, '500', 'barlow-latin-500-normal'],
	[body, '600', 'barlow-latin-600-normal'],
	[body, '700', 'barlow-latin-700-normal'],
	[display, '600', 'barlow-condensed-latin-600-normal'],
	[display, '700', 'barlow-condensed-latin-700-normal'],
	[display, '800', 'barlow-condensed-latin-800-normal'],
];

if (typeof document !== 'undefined') {
	const handle = delayRender('Loading fonts');
	Promise.all(
		FONTS.map(([family, weight, file]) => {
			const face = new FontFace(family, `url(${staticFile(`fonts/${file}.woff2`)}) format('woff2')`, {weight});
			document.fonts.add(face);
			return face.load();
		}),
	).then(() => continueRender(handle));
}

// After Effects-style easing curves
export const easeOut = Easing.bezier(0.16, 1, 0.3, 1); // "expo out"
export const easeInOut = Easing.bezier(0.83, 0, 0.17, 1); // strong ease in-out for whip moves
export const easeIn = Easing.bezier(0.7, 0, 0.84, 0);

export const tween = (
	frame: number,
	range: [number, number],
	out: [number, number],
	easing: (t: number) => number = easeOut,
) =>
	interpolate(frame, range, out, {
		easing,
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

export const brl = (v: number) =>
	'R$ ' + Math.round(v).toLocaleString('pt-BR');
