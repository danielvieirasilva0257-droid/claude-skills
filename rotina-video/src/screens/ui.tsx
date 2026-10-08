import React from 'react';
import {Dumbbell, ListChecks, Settings, Wallet} from 'lucide-react';
import {body, c, display, tween} from '../theme';
import {SCREEN_H} from '../Phone';

// Building blocks copied from the Rotina app's look (cards, pills, labels, bottom tabs)

export const Screen: React.FC<{children: React.ReactNode; tab: number}> = ({children, tab}) => (
	<div
		style={{
			width: 390,
			height: SCREEN_H,
			background: c.bg,
			color: c.text,
			fontFamily: body,
			position: 'relative',
			overflow: 'hidden',
		}}
	>
		<div style={{padding: '58px 18px 0'}}>{children}</div>
		<BottomTabs active={tab} />
	</div>
);

export const Header: React.FC<{kicker: string; title: string; f: number}> = ({kicker, title, f}) => (
	<div
		style={{
			marginBottom: 14,
			opacity: tween(f, [0, 12], [0, 1]),
			transform: `translateY(${tween(f, [0, 16], [14, 0])}px)`,
		}}
	>
		<div
			style={{
				fontFamily: display,
				fontSize: 13,
				fontWeight: 600,
				color: c.muted,
				textTransform: 'uppercase',
				letterSpacing: '0.12em',
			}}
		>
			{kicker}
		</div>
		<div
			style={{
				fontFamily: display,
				fontSize: 34,
				fontWeight: 700,
				textTransform: 'uppercase',
				lineHeight: 1.05,
			}}
		>
			{title}
		</div>
	</div>
);

export const Pills: React.FC<{items: string[]; active: number; f: number}> = ({items, active, f}) => (
	<div style={{display: 'flex', gap: 7, marginBottom: 14, overflow: 'hidden'}}>
		{items.map((it, i) => {
			const on = i === active;
			return (
				<div
					key={it}
					style={{
						flexShrink: 0,
						height: 34,
						padding: '0 13px',
						borderRadius: 17,
						display: 'flex',
						alignItems: 'center',
						fontSize: 13,
						fontWeight: on ? 600 : 500,
						border: `1px solid ${on ? c.red : c.border}`,
						background: on ? c.redBg : 'transparent',
						color: on ? c.text : c.muted,
						opacity: tween(f, [3 + i * 2, 13 + i * 2], [0, 1]),
						transform: `translateX(${tween(f, [3 + i * 2, 17 + i * 2], [24, 0])}px)`,
					}}
				>
					{it}
				</div>
			);
		})}
	</div>
);

export const Card: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
	<div
		style={{
			background: c.s2,
			border: `1px solid ${c.border}`,
			borderRadius: 14,
			padding: 14,
			...style,
		}}
	>
		{children}
	</div>
);

export const Label: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
	<div
		style={{
			fontFamily: display,
			fontSize: 12,
			fontWeight: 600,
			color: c.muted,
			textTransform: 'uppercase',
			letterSpacing: '0.1em',
			...style,
		}}
	>
		{children}
	</div>
);

// Entrance used for every block inside a screen: rise + fade, staggered by `delay`
export const rise = (f: number, delay: number): React.CSSProperties => ({
	opacity: tween(f, [delay, delay + 10], [0, 1]),
	transform: `translateY(${tween(f, [delay, delay + 18], [26, 0])}px)`,
});

const TABS = [
	{label: 'Hábitos', Icon: ListChecks},
	{label: 'Treinos', Icon: Dumbbell},
	{label: 'Financeiro', Icon: Wallet},
	{label: 'Ajustes', Icon: Settings},
];

const BottomTabs: React.FC<{active: number}> = ({active}) => (
	<div
		style={{
			position: 'absolute',
			left: 0,
			right: 0,
			bottom: 0,
			height: 84,
			paddingBottom: 22,
			background: 'rgba(8,8,8,0.96)',
			borderTop: `1px solid ${c.border}`,
			display: 'flex',
		}}
	>
		{TABS.map(({label, Icon}, i) => {
			const on = i === active;
			return (
				<div
					key={label}
					style={{
						flex: 1,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
						gap: 4,
						color: on ? c.redHi : c.faint,
						fontSize: 11,
						fontWeight: on ? 700 : 500,
					}}
				>
					<Icon size={22} strokeWidth={on ? 2.4 : 2} />
					{label}
				</div>
			);
		})}
	</div>
);
