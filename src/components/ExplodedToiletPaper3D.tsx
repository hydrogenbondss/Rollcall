import { useRef, useMemo, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Html, Grid } from '@react-three/drei'
import * as THREE from 'three'

// ─── Layer Data ───
const layerData = [
  { id: '01', label: '4-PLY', material: 'Virgin Pulp + Lotion', color: '#00ff9d', y: 1.2, rx: 2.6, rz: 2.6, desc: 'Embossed quilt pattern' },
  { id: '02', label: '3-PLY', material: 'Bamboo Fiber', color: '#00d4ff', y: 0.7, rx: 2.3, rz: 2.3, desc: 'Naturally antimicrobial' },
  { id: '03', label: '2-PLY', material: 'Recycled Fiber', color: '#a78bfa', y: 0.3, rx: 2.0, rz: 2.0, desc: 'Eco-conscious markets' },
  { id: '04', label: '1-PLY', material: 'Wood Pulp', color: '#fbbf24', y: -0.1, rx: 1.7, rz: 1.7, desc: 'Budget standard' },
]

// ─── Glowing Edge Material ───
function createGlowMaterial(color: string) {
  return new THREE.MeshBasicMaterial({
    color: new THREE.Color(color),
    transparent: true,
    opacity: 0.6,
    side: THREE.DoubleSide,
  })
}

// ─── Single Paper Layer (flat disc) ───
interface PaperLayerProps {
  layer: typeof layerData[0]
  index: number
}

function PaperLayer({ layer, index }: PaperLayerProps) {
  const groupRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)

  // Animate subtle floating
  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    groupRef.current.position.y = layer.y + Math.sin(t * 0.8 + index * 0.5) * 0.02
  })

  const glowColor = useMemo(() => new THREE.Color(layer.color), [layer.color])

  return (
    <group
      ref={groupRef}
      position={[0, layer.y, 0]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Main paper disc - very thin */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <cylinderGeometry args={[layer.rx, layer.rz, 0.04, 64]} />
        <meshStandardMaterial
          color="#e8e0d4"
          roughness={0.9}
          metalness={0.0}
          transparent
          opacity={hovered ? 0.25 : 0.12}
        />
      </mesh>

      {/* Glowing rim */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[layer.rx * 0.98, 0.025, 8, 64]} />
        <meshBasicMaterial
          color={glowColor}
          transparent
          opacity={hovered ? 0.9 : 0.5}
        />
      </mesh>

      {/* Inner hollow rim (core hole) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.4, 0.02, 8, 32]} />
        <meshBasicMaterial
          color={glowColor}
          transparent
          opacity={hovered ? 0.6 : 0.3}
        />
      </mesh>

      {/* Cross-section line (vertical edge visualization) */}
      <mesh position={[layer.rx + 0.02, 0, 0]}>
        <boxGeometry args={[0.015, 0.06, 0.015]} />
        <meshBasicMaterial color={glowColor} transparent opacity={0.7} />
      </mesh>

      {/* HTML Label */}
      <Html position={[layer.rx + 0.5, 0, 0]} center style={{ pointerEvents: 'none' }}>
        <div
          className="transition-all duration-300"
          style={{
            opacity: hovered ? 1 : 0.75,
            transform: hovered ? 'scale(1.05)' : 'scale(1)',
          }}
        >
          <div className="flex items-center gap-2">
            {/* Connecting line */}
            <div className="w-6 h-px shrink-0" style={{ backgroundColor: layer.color }} />
            <div
              className="px-2.5 py-1.5 rounded border"
              style={{
                borderColor: hovered ? `${layer.color}60` : `${layer.color}25`,
                backgroundColor: hovered ? `${layer.color}12` : 'rgba(13,13,13,0.85)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-[9px] font-bold" style={{ color: layer.color }}>{layer.id}</span>
                <span className="font-mono text-[10px] font-bold tracking-wider text-[#f0ece8]">{layer.label}</span>
              </div>
              <p className="font-body text-[9px] text-[#888] mt-0.5 whitespace-nowrap">{layer.material}</p>
              <p className="font-mono text-[7px] mt-0.5" style={{ color: `${layer.color}80` }}>{layer.desc}</p>
            </div>
          </div>
        </div>
      </Html>
    </group>
  )
}

// ─── Core Tube ───
function CoreTube() {
  const ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.y = state.clock.elapsedTime * 0.3
  })

  return (
    <group position={[0, -0.55, 0]}>
      {/* Outer rim */}
      <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.42, 0.03, 8, 32]} />
        <meshBasicMaterial color="#c4a97d" transparent opacity={0.5} />
      </mesh>
      {/* Side wall */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.42, 0.42, 0.35, 32, 1, true]} />
        <meshBasicMaterial color="#c4a97d" transparent opacity={0.15} side={THREE.DoubleSide} />
      </mesh>
      {/* Label */}
      <Html position={[0.7, 0, 0]} center style={{ pointerEvents: 'none' }}>
        <div className="flex items-center gap-2">
          <div className="w-4 h-px bg-[#c4a97d]/40" />
          <div className="px-2 py-1 rounded border border-[#c4a97d]/20 bg-[#0d0d0d]/85">
            <span className="font-mono text-[9px] font-bold text-[#c4a97d]">05</span>
            <span className="font-mono text-[9px] text-[#f0ece8] ml-1.5">CORE</span>
            <p className="font-body text-[8px] text-[#888]">Cardboard Tube</p>
          </div>
        </div>
      </Html>
    </group>
  )
}

// ─── Floating Particles ───
function Particles() {
  const ref = useRef<THREE.Points>(null)

  const positions = useMemo(() => {
    const pts = new Float32Array(60 * 3)
    for (let i = 0; i < 60; i++) {
      pts[i * 3] = (Math.random() - 0.5) * 8
      pts[i * 3 + 1] = (Math.random() - 0.5) * 4
      pts[i * 3 + 2] = (Math.random() - 0.5) * 8
    }
    return pts
  }, [])

  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.y = state.clock.elapsedTime * 0.02
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={60}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial color="#00ff9d" size={0.02} transparent opacity={0.4} />
    </points>
  )
}

// ─── Scene ───
function Scene() {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[0, 2, 0]} intensity={0.5} color="#00ff9d" distance={8} />

      {/* Grid floor */}
      <Grid
        position={[0, -1.2, 0]}
        args={[16, 16]}
        cellSize={0.5}
        cellThickness={0.5}
        cellColor="#00ff9d15"
        sectionSize={2}
        sectionThickness={1}
        sectionColor="#00ff9d08"
        fadeDistance={12}
        fadeStrength={1}
        infiniteGrid
      />

      {/* Paper layers */}
      {layerData.map((layer, i) => (
        <PaperLayer key={layer.id} layer={layer} index={i} />
      ))}

      {/* Core */}
      <CoreTube />

      {/* Particles */}
      <Particles />

      {/* Orbit controls */}
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        minDistance={4}
        maxDistance={10}
        minPolarAngle={0.2}
        maxPolarAngle={Math.PI / 2.2}
        autoRotate
        autoRotateSpeed={0.6}
        dampingFactor={0.05}
        enableDamping
      />
    </>
  )
}

// ─── Main Export ───
export default function ExplodedToiletPaper3D() {
  return (
    <div className="w-full h-full min-h-[450px] relative rounded-2xl overflow-hidden border border-white/[0.04]">
      <Canvas
        camera={{ position: [5, 4, 6], fov: 38 }}
        shadows
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
        style={{ background: '#0a0a0a' }}
      >
        <Scene />
      </Canvas>

      {/* Corner brackets */}
      <div className="absolute top-3 left-3 w-5 h-5 border-l-2 border-t-2 border-[#00ff9d]/20 pointer-events-none" />
      <div className="absolute top-3 right-3 w-5 h-5 border-r-2 border-t-2 border-[#00ff9d]/20 pointer-events-none" />
      <div className="absolute bottom-10 left-3 w-5 h-5 border-l-2 border-b-2 border-[#00ff9d]/20 pointer-events-none" />
      <div className="absolute bottom-10 right-3 w-5 h-5 border-r-2 border-b-2 border-[#00ff9d]/20 pointer-events-none" />

      {/* Caption */}
      <div className="absolute bottom-3 left-0 right-0 text-center pointer-events-none">
        <p className="font-mono text-[8px] text-[#555] uppercase tracking-[0.4em]">
          Drag to orbit · Scroll to zoom · Auto-rotating
        </p>
      </div>

      {/* Top-left label */}
      <div className="absolute top-3 left-10 pointer-events-none">
        <p className="font-mono text-[8px] text-[#00ff9d]/40 uppercase tracking-wider">Holographic View</p>
      </div>
    </div>
  )
}
