import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows, Environment, OrbitControls } from '@react-three/drei';
import { Fretboard } from './Fretboard';
import { NoteMarkers } from './NoteMarkers';
import { BOARD_CENTER_X } from '../data/fretboardLayout';

export function GuitarScene() {
  return (
    <Canvas
      camera={{ position: [BOARD_CENTER_X, 5, 0.01], fov: 50 }}
      dpr={[1, 2]}
    >
      <color attach="background" args={['#080c18']} />

      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 8, 3]} intensity={1} />
      <directionalLight position={[-3, 5, -2]} intensity={0.25} />

      <Suspense fallback={null}>
        <Fretboard />
        <NoteMarkers />
        <Environment preset="city" />
      </Suspense>

      <ContactShadows
        position={[BOARD_CENTER_X, -0.15, 0]}
        scale={14}
        blur={3}
        opacity={0.35}
        color="#010203"
      />

      <OrbitControls
        target={[BOARD_CENTER_X, 0, 0]}
        enablePan={false}
        minPolarAngle={0.0}
        maxPolarAngle={Math.PI / 2}
        minDistance={3}
        maxDistance={12}
      />
    </Canvas>
  );
}
