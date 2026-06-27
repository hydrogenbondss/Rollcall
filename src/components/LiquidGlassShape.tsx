import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import * as THREE from 'three'

// A smooth torus — evocative of rolled paper without being literal
function GlassRing() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime
    // Slow elegant rotation
    meshRef.current.rotation.y = t * 0.04
    meshRef.current.rotation.x = Math.sin(t * 0.03) * 0.15
    // Subtle breathing
    const s = 1 + Math.sin(t * 0.5) * 0.015
    meshRef.current.scale.set(s, s, s)
  })

  return (
    <mesh ref={meshRef}>
      <torusGeometry args={[1.6, 0.55, 64, 128]} />
      <meshPhysicalMaterial
        color="#e8e0d4"
        metalness={0.0}
        roughness={0.0}
        transmission={0.95}
        thickness={3}
        ior={1.5}
        dispersion={0.6}
        clearcoat={1.0}
        clearcoatRoughness={0.0}
        envMapIntensity={2}
        transparent
        opacity={0.95}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

// Inner glow core
function InnerGlow() {
  const ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    ref.current.rotation.y = -t * 0.02
    const p = 0.85 + Math.sin(t * 0.7) * 0.08
    ref.current.scale.set(p, p, p)
  })

  return (
    <mesh ref={ref}>
      <torusGeometry args={[1.6, 0.35, 48, 96]} />
      <meshPhysicalMaterial
        color="#c28223"
        metalness={0.1}
        roughness={0.2}
        transmission={0.7}
        thickness={1.5}
        ior={1.3}
        emissive="#c28223"
        emissiveIntensity={0.15}
        transparent
        opacity={0.4}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

// Scene setup
function Scene() {
  return (
    <>
      {/* Main glass ring */}
      <GlassRing />

      {/* Inner warm glow layer */}
      <InnerGlow />

      {/* Lighting — dramatic three-point with warm accent */}
      <ambientLight intensity={0.2} />

      {/* Key light — warm from upper right */}
      <pointLight position={[5, 4, 5]} intensity={3} color="#fff5e8" distance={20} decay={2} />

      {/* Fill light — cool from lower left */}
      <pointLight position={[-4, -3, 4]} intensity={1.5} color="#e8e8f5" distance={15} decay={2} />

      {/* Rim light — amber from behind */}
      <pointLight position={[0, 2, -6]} intensity={2} color="#c28223" distance={12} decay={2} />

      {/* Subtle ground reflection */}
      <pointLight position={[0, -4, 2]} intensity={0.5} color="#c28223" distance={8} decay={2} />

      <Environment preset="city" />
    </>
  )
}

export default function LiquidGlassShape() {
  return (
    <div className="w-full h-full min-h-[300px] md:min-h-[400px] relative">
      <Canvas
        camera={{ position: [0, 1, 5.5], fov: 40 }}
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.3,
          powerPreference: 'low-power',
        }}
        dpr={[1, 1.5]}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>
    </div>
  )
}
