import { useRef, useEffect } from 'react';
import { Text, Billboard } from '@react-three/drei';
import type * as THREE from 'three';
import gsap from 'gsap';
import { useGuitarStore } from '../store/useGuitarStore';
import { stringZ, noteX } from '../data/fretboardLayout';

const DEGREE_COLORS: Record<string, string> = {
  '1':  '#e53e3e',
  '2':  '#63b3ed',
  '3':  '#38a169',
  '♭3': '#2f855a',
  '4':  '#4fd1c5',
  '5':  '#3182ce',
  '♭5': '#805ad5',
  '6':  '#d69e2e',
  '7':  '#ecc94b',
  '9':  '#90cdf4',
  '11': '#76e4f7',
  '13': '#f6e05e',
  '♭7': '#ed8936',
  '♭9': '#f687b3',
  '♯9': '#f56565',
  '♯11': '#9f7aea',
  '♭13': '#ed64a6',
  '♭♭7': '#b7791f',
};

function degreeDisplay(degree: string): string {
  return degree.replaceAll('♭', 'b').replaceAll('♯', '#');
}

export function NoteMarkers() {
  const positions = useGuitarStore((s) => s.positions);
  const root = useGuitarStore((s) => s.root);
  const chordType = useGuitarStore((s) => s.chordType);
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!groupRef.current) return;
    const children = Array.from(groupRef.current.children);

    const sorted = children.slice().sort((a, b) => a.position.x - b.position.x);

    sorted.forEach((child) => child.scale.set(0, 0, 0));

    const tweens = sorted.map((child, i) =>
      gsap.to(child.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.5,
        delay: i * 0.018,
        ease: 'back.out(1.7)',
      }),
    );

    return () => {
      tweens.forEach((tw) => tw.kill());
    };
  }, [root, chordType]);

  return (
    <group ref={groupRef}>
      {positions.map((pos) => {
        const color = DEGREE_COLORS[pos.degree] ?? '#ffffff';
        return (
          <group
            key={`${pos.stringIndex}-${pos.fret}`}
            position={[noteX(pos.fret), 0.09, stringZ(pos.stringIndex)]}
          >
            <mesh>
              <sphereGeometry args={[0.08, 20, 20]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={0.3}
              />
            </mesh>

            <Billboard>
              <Text
                position={[0, 0.15, 0]}
                fontSize={0.09}
                color="#ffffff"
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.005}
                outlineColor="#000000"
              >
                {degreeDisplay(pos.degree)}
              </Text>
            </Billboard>
          </group>
        );
      })}
    </group>
  );
}
