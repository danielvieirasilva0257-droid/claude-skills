import {continueRender, delayRender, Easing, interpolate, spring, staticFile} from 'remotion';

// v2 look: "paper & ink" editorial. Warm paper, black ink, the app's red as the only accent.
export const P = {
	paper: '#EEE9DF',
	paperHi: '#F7F3EC',
	paperShade: '#D9D1C2',
	grid: 'rgba(17,17,17,0.07)',
	ink: '#111111',
	ink2: '#1C1C1C',
	mute: '#6F675E',
	red: '#CC0000',
	redHi: '#FF5A5A',
	redDeep: '#9E0000',
	white: '#FFFFFF',
	green: '#34D399',
};

// Fonts (SIL OFL, files and licenses in public/fonts/v2)
export const DISPLAY = 'Anton';
export const SERIF = 'Instrument Serif';
export const SANS = 'Inter Tight';

const FONTS: [string, string, FontFaceDescriptors][] = [
	[DISPLAY, 'Anton-Regular.ttf', {weight: '400'}],
	[SERIF, 'InstrumentSerif-Italic.ttf', {style: 'italic', weight: '400'}],
	[SERIF, 'InstrumentSerif-Regular.ttf', {style: 'normal', weight: '400'}],
	[SANS, 'InterTight-wght.ttf', {weight: '100 900'}],
];

if (typeof document !== 'undefined') {
	const handle = delayRender('Loading v2 fonts');
	Promise.all(
		FONTS.map(([family, file, desc]) => {
			const face = new FontFace(family, `url(${staticFile(`fonts/v2/${file}`)}) format('truetype')`, desc);
			document.fonts.add(face);
			return face.load();
		}),
	).then(() => continueRender(handle));
}

// Curves (After Effects equivalents)
export const ease = {
	out: Easing.bezier(0.16, 1, 0.3, 1), // expo out: arrivals with a long tail
	inOut: Easing.bezier(0.83, 0, 0.17, 1), // short decided camera moves, whips
	in: Easing.bezier(0.7, 0, 0.84, 0), // exits that accelerate
	ae: Easing.bezier(0.33, 0, 0.67, 1), // AE "easy ease"
	soft: Easing.bezier(0.45, 0, 0.55, 1),
	lin: (t: number) => t,
};

export const tw = (f: number, range: [number, number], out: [number, number], e: (t: number) => number = ease.out) =>
	interpolate(f, range, out, {easing: e, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

// Springs (zeta = damping / (2 * sqrt(stiffness * mass)))
export const SPR = {
	premium: {stiffness: 380, damping: 31}, // ~12 frames, ~1.5% overshoot
	soft: {stiffness: 80, damping: 14}, // cards
	pop: {stiffness: 200, damping: 15}, // badges, checks
	slam: {stiffness: 260, damping: 20}, // big type landing with a small bounce
	heavy: {stiffness: 120, damping: 18}, // the phone
};
export const sp = (f: number, at: number, config: {stiffness: number; damping: number; mass?: number} = SPR.premium) =>
	f < at ? 0 : spring({frame: f - at, fps: 30, config});

// AE-like keyframes: [frame, value, easing?]; the easing applies to the segment that ENDS at that key
export type Key = [number, number, ((t: number) => number)?];
export const kf = (f: number, keys: Key[]) => {
	if (f <= keys[0][0]) return keys[0][1];
	for (let i = 1; i < keys.length; i++) {
		const [f1, v1, e] = keys[i];
		const [f0, v0] = keys[i - 1];
		if (f <= f1) {
			if (f1 === f0) return v1;
			return interpolate(f, [f0, f1], [v0, v1], {easing: e ?? ease.ae});
		}
	}
	return keys[keys.length - 1][1];
};

// Slow continuous drift so nothing is ever 100% still
export const drift = (f: number, amp: number, period = 90, phase = 0) => amp * Math.sin(((f + phase) / period) * Math.PI * 2);
