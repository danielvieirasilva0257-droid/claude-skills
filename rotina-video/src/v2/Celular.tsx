import React, {useEffect, useLayoutEffect, useMemo, useState} from 'react';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, cancelRender, continueRender, delayRender, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {useThree} from '@react-three/fiber';
import * as THREE from 'three';
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js';
import {CAM, PH, SCR, Pose, phonePose} from './rig';

// 3D phone layer (React Three Fiber), rendered alone with a transparent background as a PNG sequence
// and composited in the 2D video. Generic phone (no Apple likeness). Screen = JPEG sequence of the Tela composition.

export const TELA_FIRST = 182;
export const TELA_LAST = 850;
const telaFile = (i: number) => staticFile(`v2/tela/element-${String(i).padStart(3, '0')}.jpeg`);

const roundedRectShape = (w: number, h: number, r: number) => {
	const s = new THREE.Shape();
	const x = -w / 2;
	const y = -h / 2;
	s.moveTo(x + r, y);
	s.lineTo(x + w - r, y);
	s.quadraticCurveTo(x + w, y, x + w, y + r);
	s.lineTo(x + w, y + h - r);
	s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
	s.lineTo(x + r, y + h);
	s.quadraticCurveTo(x, y + h, x, y + h - r);
	s.lineTo(x, y + r);
	s.quadraticCurveTo(x, y, x + r, y);
	return s;
};
// ShapeGeometry UVs are raw shape coords -> remap to 0..1 so the screen texture fills the rounded rect
const planeWithUV = (w: number, h: number, r: number) => {
	const g = new THREE.ShapeGeometry(roundedRectShape(w, h, r), 24);
	const pos = g.attributes.position as THREE.BufferAttribute;
	const uv = g.attributes.uv as THREE.BufferAttribute;
	for (let i = 0; i < pos.count; i++) uv.setXY(i, (pos.getX(i) + w / 2) / w, (pos.getY(i) + h / 2) / h);
	uv.needsUpdate = true;
	return g;
};
const bodyGeometry = () => {
	const {W, H, D, CORNER, BEVEL} = PH;
	const g = new THREE.ExtrudeGeometry(roundedRectShape(W - 2 * BEVEL, H - 2 * BEVEL, CORNER - BEVEL), {
		depth: D - 2 * BEVEL,
		bevelEnabled: true,
		bevelThickness: BEVEL,
		bevelSize: BEVEL,
		bevelSegments: 8,
		curveSegments: 32,
	});
	g.center();
	return g;
};

// Placeholder MUST have the same size as the real frames (WebGL2 immutable texture storage)
const makeSwapTexture = () => {
	const c = document.createElement('canvas');
	c.width = SCR.TEX_W;
	c.height = SCR.TEX_H;
	const t = new THREE.Texture(c);
	t.colorSpace = THREE.SRGBColorSpace;
	t.anisotropy = 8;
	t.needsUpdate = true;
	return t;
};

const promises = new Map<number, Promise<HTMLImageElement>>();
const decoded = new Map<number, HTMLImageElement>();
const load = (i: number) => {
	let p = promises.get(i);
	if (!p) {
		const img = new Image();
		img.src = telaFile(i);
		p = img.decode().then(() => {
			decoded.set(i, img);
			return img;
		});
		promises.set(i, p);
	}
	return p;
};

const ScreenMesh: React.FC<{frame: number}> = ({frame}) => {
	const idx = Math.max(TELA_FIRST, Math.min(TELA_LAST, frame));
	const advance = useThree((st) => st.advance);
	const [texture] = useState(makeSwapTexture);
	const geo = useMemo(() => planeWithUV(SCR.W, SCR.H, SCR.R), []);
	const island = useMemo(() => planeWithUV(0.17, 0.05, 0.025), []);
	useLayoutEffect(() => {
		for (let k = 1; k <= 4; k++) if (idx + k <= TELA_LAST) load(idx + k).catch(() => undefined);
		for (const key of Array.from(promises.keys()))
			if (key < idx || key > idx + 4) {
				promises.delete(key);
				decoded.delete(key);
			}
		const hit = decoded.get(idx);
		if (hit) {
			texture.image = hit;
			texture.needsUpdate = true;
			return;
		}
		let cancelled = false;
		const h = delayRender('tela frame ' + idx);
		load(idx)
			.then((img) => {
				if (cancelled) return;
				texture.image = img;
				texture.needsUpdate = true;
				advance(performance.now());
				continueRender(h);
			})
			.catch((e) => cancelRender(e));
		return () => {
			cancelled = true;
			continueRender(h);
		};
	}, [idx, texture, advance]);
	return (
		<group position={[0, 0, PH.D / 2 + 0.001]}>
			<mesh geometry={geo}>
				<meshBasicMaterial map={texture} toneMapped={false} />
			</mesh>
			{/* glass: catches the environment reflections */}
			<mesh geometry={geo} position={[0, 0, 0.0008]}>
				<meshPhysicalMaterial color="#000000" roughness={0.04} metalness={0} clearcoat={1} clearcoatRoughness={0.02} transparent opacity={0.08} />
			</mesh>
			<mesh geometry={island} position={[0, SCR.H / 2 - 0.055, 0.0012]}>
				<meshBasicMaterial color="#000000" />
			</mesh>
		</group>
	);
};

const Phone: React.FC<{frame: number}> = ({frame}) => {
	const body = useMemo(bodyGeometry, []);
	const {W, H, D} = PH;
	return (
		<group>
			<mesh geometry={body}>
				<meshPhysicalMaterial attach="material-0" color="#121216" roughness={0.18} metalness={0.25} clearcoat={1} clearcoatRoughness={0.06} />
				<meshPhysicalMaterial attach="material-1" color="#8e8f96" roughness={0.26} metalness={1} clearcoat={0.5} clearcoatRoughness={0.1} />
			</mesh>
			<ScreenMesh frame={frame} />
			{/* camera plateau + lenses on the back */}
			<mesh position={[-W / 2 + 0.2, H / 2 - 0.2, -D / 2 - 0.008]}>
				<boxGeometry args={[0.3, 0.3, 0.02]} />
				<meshPhysicalMaterial color="#1a1a20" roughness={0.2} metalness={0.5} clearcoat={1} />
			</mesh>
			{[
				[-0.065, 0.065],
				[-0.065, -0.065],
				[0.065, 0],
			].map(([x, y], i) => (
				<mesh key={i} rotation={[Math.PI / 2, 0, 0]} position={[-W / 2 + 0.2 + x, H / 2 - 0.2 + y, -D / 2 - 0.028]}>
					<cylinderGeometry args={[0.052, 0.056, 0.022, 48]} />
					<meshPhysicalMaterial color="#050507" roughness={0.05} metalness={0.9} clearcoat={1} />
				</mesh>
			))}
			{/* side buttons */}
			<mesh position={[W / 2 + 0.004, 0.25, 0]}>
				<boxGeometry args={[0.012, 0.16, 0.022]} />
				<meshStandardMaterial color="#8e8f96" metalness={1} roughness={0.3} />
			</mesh>
			<mesh position={[-W / 2 - 0.004, 0.32, 0]}>
				<boxGeometry args={[0.012, 0.1, 0.022]} />
				<meshStandardMaterial color="#8e8f96" metalness={1} roughness={0.3} />
			</mesh>
			<mesh position={[-W / 2 - 0.004, 0.16, 0]}>
				<boxGeometry args={[0.012, 0.1, 0.022]} />
				<meshStandardMaterial color="#8e8f96" metalness={1} roughness={0.3} />
			</mesh>
		</group>
	);
};

// Studio reflections without downloading an HDRI
const Env: React.FC = () => {
	const {gl, scene} = useThree();
	useLayoutEffect(() => {
		const pmrem = new THREE.PMREMGenerator(gl);
		const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
		scene.environment = env;
		return () => {
			scene.environment = null;
			env.dispose();
			pmrem.dispose();
		};
	}, [gl, scene]);
	return null;
};

// Frame-0 fix (see research notes 3d_round2.md): hold a delayRender from the DOM tree and release it
// from the LAST child inside the canvas, after one more advance()
const FirstContentFrame: React.FC<{handle: number}> = ({handle}) => {
	const advance = useThree((st) => st.advance);
	useEffect(() => {
		advance(performance.now());
		continueRender(handle);
	}, [advance, handle]);
	return null;
};

const Scene: React.FC<{pose: Pose; frame: number}> = ({pose, frame}) => (
	<>
		<Env />
		<ambientLight intensity={0.15} />
		<directionalLight position={[2.5, 3.5, 5]} intensity={1.6} />
		{/* rim lights so the dark body reads on the black section too */}
		<directionalLight position={[-4, 2, -3]} intensity={2.2} color="#ffd9d0" />
		<directionalLight position={[4, -1, -3]} intensity={1.4} color="#ffffff" />
		{pose.visible ? (
			<group position={[pose.x, pose.y, pose.z]} rotation={new THREE.Euler(pose.rx, pose.ry, pose.rz, 'XYZ')}>
				<Phone frame={frame} />
			</group>
		) : null}
	</>
);

export const Celular: React.FC = () => {
	const frame = useCurrentFrame();
	const {width, height} = useVideoConfig();
	const pose = phonePose(frame);
	const [firstHandle] = useState(() => delayRender('first R3F content frame'));
	return (
		<AbsoluteFill>
			<ThreeCanvas width={width} height={height} gl={{antialias: true, alpha: true}} camera={{fov: CAM.fov, near: CAM.near, far: CAM.far, position: [0, 0, CAM.z]}}>
				<Scene pose={pose} frame={frame} />
				<FirstContentFrame handle={firstHandle} />
			</ThreeCanvas>
		</AbsoluteFill>
	);
};
