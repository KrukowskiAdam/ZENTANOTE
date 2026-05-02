import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { ContactShadows, Environment, Float, OrbitControls } from '@react-three/drei'
import { useSceneStore } from '../store/useSceneStore'

const AccentTorus = () => {
  const pulse = useSceneStore((state) => state.pulse)

  return (
    <Float
      floatIntensity={pulse ? 1.4 : 0.2}
      rotationIntensity={pulse ? 0.65 : 0.1}
      speed={pulse ? 1.15 : 0.4}
    >
      <mesh>
        <torusKnotGeometry args={[0.7, 0.22, 256, 16]} />
        <meshStandardMaterial
          color={pulse ? '#80ffe8' : '#f8c6ff'}
          metalness={0.5}
          roughness={0.15}
        />
      </mesh>
    </Float>
  )
}

export const HeroScene = () => {
  return (
    <Canvas
      camera={{ position: [2.2, 1.6, 3.8], fov: 45 }}
      dpr={[1, 2]}
      className="hero-canvas"
    >
      <color attach="background" args={['#03050a']} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[4, 3, 2]} intensity={1.15} />

      <Suspense fallback={null}>
        <AccentTorus />
        <Environment preset="studio" />
      </Suspense>

      <ContactShadows
        position={[0, -1.35, 0]}
        scale={8}
        blur={3.5}
        opacity={0.5}
        color="#010203"
      />

      <OrbitControls enablePan={false} enableZoom={false} />
    </Canvas>
  )
}

export default HeroScene
