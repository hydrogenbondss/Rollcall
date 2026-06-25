import React, { useRef, useState, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Html } from '@react-three/drei'
import * as THREE from 'three'

// Layer configuration - semi-exploded for better readability
const layerData = [
  { id: '01', label: '4-PLY', material: 'Virgin pulp with added lotion — soft, absorbent, mass-produced', color: '#e8d5b7', y: 1.6, radius: 2.6, thickness: 0.18 },
  { id: '02', label: '3-PLY', material: 'Bamboo fiber — naturally antimicrobial and fast-growing', color: '#d4c4a3', y: 0.9, radius: 2.35, thickness: 0.16 },
  { id: '03', label: '2-PLY', material: 'Recycled fiber — economical, lower-grade, widely used', color: '#c5b89a', y: 0.25, radius: 2.1, thickness: 0.14 },
  { id: '04', label: '1-PLY', material: 'Basic wood pulp — thin, economical, single-use standard', color: '#b8a87e', y: -0.35, radius: 1.85, thickness: 0.12 },
]

function PaperLayer({ layer, index }: { layer: typeof layerData[0]; index: number }) {
  const groupRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    groupRef.current.position.y = layer.y + Math.sin(t * 0.6 + index * 0.8) * 0.015
  })

  return (
    <group
      ref={groupRef}
      position={[0, layer.y, 0]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Main paper layer with thickness */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[layer.radius, layer.radius, layer.thickness, 64]} />
        <meshStandardMaterial
          color={layer.color}
          roughness={0.85}
          metalness={0.05}
        />
      </mesh>

      {/* Subtle edge highlight for definition */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[layer.radius * 0.985, 0.012, 6, 64]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={hovered ? 0.25 : 0.08} />
      </mesh>

      {/* Inner core hole */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.42, 0.42, layer.thickness + 0.01, 32, 1, true]} />
        <meshBasicMaterial color="#111111" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>

      {/* Label */}
      <Html position={[layer.radius + 0.6, 0, 0]} center style={{ pointerEvents: 'none' }}>
        <div
          className="transition-all duration-200"
          style={{
            opacity: hovered ? 1 : 0.85,
            transform: hovered ? 'scale(1.03)' : 'scale(1)',
          }}
        >
          <div className="flex items-center gap-2">
            <div className="w-5 h-px" style={{ backgroundColor: '#c28223' }} />
            <div className="px-3 py-1.5 rounded border bg-[#0d0d0d]/90 backdrop-blur-sm border-white/10">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold" style={{ color: '#c28223' }}>{layer.id}</span>
                <span className="font-mono text-[11px] font-bold tracking-wider text-[#f0ece8]">{layer.label}</span>
              </div>
              <p className="font-body text-[9px] text-[#888] mt-0.5 whitespace-nowrap">{layer.material}</p>
            </div>
          </div>
        </div>
      </Html>
    </group>
  )
}

function CoreTube() {
  const ref = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.y = state.clock.elapsedTime * 0.25
  })

  return (
    <group ref={ref} position={[0, -0.85, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <cylinderGeometry args={[0.45, 0.45, 0.55, 48]} />
        <meshStandardMaterial color="#a67c52" roughness={0.7} metalness={0.1} />
      </mesh>
    </group>
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[8, 12, 6]} intensity={1.1} castShadow />
      <pointLight position={[-6, 4, -4]} intensity={0.4} color="#fff8e7" />

      {layerData.map((layer, i) => (
        <PaperLayer key={layer.id} layer={layer} index={i} />
      ))}

      <CoreTube />

      <OrbitControls
        enableZoom={true}
        enablePan={false}
        minDistance={5}
        maxDistance={14}
        minPolarAngle={0.3}
        maxPolarAngle={Math.PI / 2.1}
        autoRotate
        autoRotateSpeed={0.4}
        enableDamping
        dampingFactor={0.08}
      />
    </>
  )
}

function ErrorFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-[#0d0d0d] rounded-2xl border border-white/[0.04]">
      <p className="font-mono text-sm text-[#888]">Failed to load 3D model</p>
    </div>
  )
}

export default function ExplodedToiletPaper3D() {
  return (
    <div className="w-full h-full min-h-[480px] relative rounded-2xl overflow-hidden border border-white/[0.04] bg-[#0a0a0a]">
      <ErrorBoundary fallback={<ErrorFallback />}>
        <Suspense fallback={
          <div className="w-full h-full flex items-center justify-center">
            <p className="font-mono text-[10px] text-[#888] uppercase tracking-wider">Loading 3D Model...</p>
          </div>
        }>
          <Canvas
            camera={{ position: [6, 5, 7], fov: 42 }}
            style={{ background: '#0a0a0a' }}
            gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
          >
            <Scene />
          </Canvas>
        </Suspense>
      </ErrorBoundary>

      <div className="absolute bottom-3 left-0 right-0 text-center pointer-events-none">
        <p className="font-mono text-[8px] text-[#555] uppercase tracking-[0.4em]">
          Drag to orbit · Scroll to zoom · Auto-rotating
        </p>
      </div>
    </div>
  )
}

// Simple Error Boundary
class ErrorBoundary extends React.Component<{ children: React.ReactNode; fallback: React.ReactNode }> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) return this.props.fallback
    return this.props.children
  }
}
