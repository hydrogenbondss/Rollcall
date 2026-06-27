import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Html } from '@react-three/drei'
import * as THREE from 'three'

// Zone definitions with positions
const zones = [
  { id: '01', name: 'Vitrine Wall', color: '#c28223', pos: [-4, 0, -3], size: [6, 0.1, 0.3], labelPos: [-4, 1.5, -3] },
  { id: '02', name: 'Scatter Floor', color: '#c4728e', pos: [3, -0.45, -2], size: [3, 0.05, 3], labelPos: [3, 0.3, -2] },
  { id: '03', name: 'Extinction', color: '#c85a32', pos: [-5, -0.3, 2], size: [2, 0.1, 2], labelPos: [-5, 0.8, 2] },
  { id: '04', name: 'Essay Room', color: '#228b68', pos: [4, -0.3, 3], size: [3, 0.1, 2.5], labelPos: [4, 0.8, 3] },
  { id: '05', name: 'Map Wall', color: '#8b7ec8', pos: [0, 0, -5], size: [8, 0.1, 0.3], labelPos: [0, 1.5, -5] },
  { id: '06', name: 'Submission', color: '#f0ece8', pos: [5, -0.4, 0], size: [1.5, 0.05, 1], labelPos: [5, 0.3, 0] },
]

function Room() {
  return (
    <group>
      {/* Floor */}
      <mesh position={[0, -0.5, 0]} receiveShadow>
        <boxGeometry args={[16, 0.1, 14]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
      </mesh>

      {/* Floor grid lines */}
      <gridHelper args={[16, 16, '#333', '#222']} position={[0, -0.44, 0]} />

      {/* Walls */}
      <mesh position={[0, 1.5, -7]}>
        <boxGeometry args={[16, 3, 0.2]} />
        <meshStandardMaterial color="#0f0f0f" roughness={0.95} />
      </mesh>
      <mesh position={[-8, 1.5, 0]}>
        <boxGeometry args={[0.2, 3, 14]} />
        <meshStandardMaterial color="#0f0f0f" roughness={0.95} />
      </mesh>
      <mesh position={[8, 1.5, 0]}>
        <boxGeometry args={[0.2, 3, 14]} />
        <meshStandardMaterial color="#0f0f0f" roughness={0.95} />
      </mesh>
      <mesh position={[0, 1.5, 7]}>
        <boxGeometry args={[16, 3, 0.2]} />
        <meshStandardMaterial color="#0f0f0f" roughness={0.95} />
      </mesh>
    </group>
  )
}

function ZoneDisplay({ zone, isHovered, onHover }: { zone: typeof zones[0]; isHovered: boolean; onHover: (h: boolean) => void }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (meshRef.current) {
      const targetScale = isHovered ? 1.05 : 1
      meshRef.current.scale.lerp(
        new THREE.Vector3(targetScale, 1, targetScale),
        0.1
      )
    }
  })

  return (
    <group>
      <mesh
        ref={meshRef}
        position={zone.pos as [number, number, number]}
        castShadow
        receiveShadow
        onPointerOver={() => onHover(true)}
        onPointerOut={() => onHover(false)}
      >
        <boxGeometry args={zone.size as [number, number, number]} />
        <meshStandardMaterial
          color={zone.color}
          roughness={0.6}
          metalness={0.1}
          emissive={zone.color}
          emissiveIntensity={isHovered ? 0.15 : 0.02}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Label */}
      <Html position={zone.labelPos as [number, number, number]} center>
        <div
          className={`font-mono text-[10px] px-2 py-1 rounded transition-all whitespace-nowrap pointer-events-none ${
            isHovered
              ? 'bg-[#c28223]/20 text-[#f0ece8] scale-110'
              : 'bg-[#0d0d0d]/60 text-[#888]'
          }`}
          style={{ backdropFilter: 'blur(4px)' }}
        >
          <span className="text-[#c28223]">Z{zone.id}</span> {zone.name}
        </div>
      </Html>
    </group>
  )
}

function Lighting() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[8, 10, 6]} intensity={1.0} castShadow shadow-mapSize={[2048, 2048]} />
      <pointLight position={[0, 4, 0]} intensity={0.4} color="#c28223" distance={12} />
      <pointLight position={[-4, 2, -3]} intensity={0.2} color="#fff" distance={8} />
    </>
  )
}

function FloorPlanScene() {
  const [hoveredZone, setHoveredZone] = useState<string | null>(null)

  return (
    <>
      <Room />
      {zones.map((zone) => (
        <ZoneDisplay
          key={zone.id}
          zone={zone}
          isHovered={hoveredZone === zone.id}
          onHover={(h) => setHoveredZone(h ? zone.id : null)}
        />
      ))}
      <Lighting />
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        minDistance={8}
        maxDistance={25}
        minPolarAngle={0.2}
        maxPolarAngle={Math.PI / 2.5}
        autoRotate
        autoRotateSpeed={0.5}
        dampingFactor={0.05}
        enableDamping
      />
    </>
  )
}

export default function ExhibitionFloorPlan3D() {
  return (
    <div className="w-full h-full min-h-[450px] relative rounded-2xl overflow-hidden border border-white/[0.04]">
      <Canvas
        camera={{ position: [12, 10, 12], fov: 35 }}
        shadows
        gl={{ antialias: true, alpha: true }}
        style={{ background: '#0d0d0d' }}
      >
        <FloorPlanScene />
      </Canvas>

      {/* Overlay legend */}
      <div className="absolute bottom-4 left-4 flex flex-wrap gap-3">
        {zones.map((zone) => (
          <div key={zone.id} className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-sm"
              style={{ backgroundColor: zone.color }}
            />
            <span className="font-mono text-[9px] text-[#888] tracking-wider">
              Z{zone.id} {zone.name}
            </span>
          </div>
        ))}
      </div>

      <div className="absolute top-4 right-4 pointer-events-none">
        <p className="font-mono text-[9px] text-[#888] uppercase tracking-[0.3em]">
          Drag to orbit · Auto-rotating
        </p>
      </div>
    </div>
  )
}
