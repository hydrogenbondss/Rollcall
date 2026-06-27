import { useRef, useMemo, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, Html } from '@react-three/drei'
import * as THREE from 'three'

// Deterministic seeded random generator.
function makeSeededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

// Procedural embossed paper texture.
function createPaperTexture(): THREE.CanvasTexture {
  const size = 1024
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  const rand = makeSeededRandom(987654321)

  ctx.fillStyle = '#f4f1ec'
  ctx.fillRect(0, 0, size, size)

  for (let i = 0; i < 40000; i++) {
    const x = rand() * size
    const y = rand() * size
    const alpha = rand() * 0.05
    ctx.fillStyle = `rgba(160, 150, 140, ${alpha})`
    ctx.fillRect(x, y, 1 + rand() * 2, 0.6)
  }

  const d = 28
  ctx.strokeStyle = 'rgba(180, 170, 160, 0.18)'
  ctx.lineWidth = 0.6
  for (let row = -2; row < size / d + 2; row++) {
    for (let col = -2; col < size / d + 2; col++) {
      const cx = col * d + (row % 2 === 0 ? 0 : d / 2)
      const cy = row * (d * 0.866)
      ctx.beginPath()
      ctx.moveTo(cx, cy - d * 0.433)
      ctx.lineTo(cx + d * 0.5, cy)
      ctx.lineTo(cx, cy + d * 0.433)
      ctx.lineTo(cx - d * 0.5, cy)
      ctx.closePath()
      ctx.stroke()
    }
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(3, 1)
  texture.anisotropy = 8
  return texture
}

interface LayerProps {
  radius: number
  height: number
  yOffset: number
  color: string
  label: string
  exploded: boolean
  index: number
}

function PaperLayer({ radius, height, yOffset, color, label, exploded, index }: LayerProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const paperTexture = useMemo(() => createPaperTexture(), [])

  const material = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      map: paperTexture,
      color: '#ffffff',
      roughness: 0.35,
      metalness: 0.1,
      iridescence: 0.8,
      iridescenceIOR: 1.35,
      iridescenceThicknessRange: [120, 400],
      clearcoat: 0.7,
      clearcoatRoughness: 0.15,
      sheen: 0.4,
      sheenColor: color,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.92,
    })
  }, [paperTexture, color])

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime
    const targetY = exploded ? yOffset + index * 0.55 : yOffset
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.08)
    meshRef.current.rotation.y = t * 0.08 + index * 0.05
  })

  return (
    <group>
      <mesh ref={meshRef} material={material} castShadow receiveShadow>
        <cylinderGeometry args={[radius, radius, height, 96, 1, true]} />
      </mesh>
      {exploded && (
        <Html position={[radius + 0.35, yOffset + index * 0.55, 0]} center distanceFactor={6}>
          <div className="pointer-events-none whitespace-nowrap">
            <p className="font-mono text-[10px] text-[#c28223] uppercase tracking-wider">{label}</p>
          </div>
        </Html>
      )}
    </group>
  )
}

function CardboardTube({ exploded }: { exploded: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#bfa07a',
      roughness: 0.9,
      metalness: 0,
    })
  }, [])

  useFrame(() => {
    if (!meshRef.current) return
    const targetY = exploded ? -0.9 : 0
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.08)
  })

  return (
    <group>
      <mesh ref={meshRef} material={material} castShadow>
        <cylinderGeometry args={[0.42, 0.42, 2.45, 64, 1, true]} />
      </mesh>
      {exploded && (
        <Html position={[0.42 + 0.35, -0.9, 0]} center distanceFactor={6}>
          <div className="pointer-events-none whitespace-nowrap">
            <p className="font-mono text-[10px] text-[#c28223] uppercase tracking-wider">Cardboard core</p>
          </div>
        </Html>
      )}
    </group>
  )
}

function LooseSheet({ exploded }: { exploded: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const paperTexture = useMemo(() => createPaperTexture(), [])

  const material = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      map: paperTexture,
      color: '#ffffff',
      roughness: 0.4,
      metalness: 0.05,
      iridescence: 0.6,
      iridescenceIOR: 1.3,
      clearcoat: 0.5,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9,
    })
  }, [paperTexture])

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime
    const targetY = exploded ? -1.4 : -1.65
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.08)
    meshRef.current.rotation.x = 0.25 + Math.sin(t * 0.5) * 0.03
  })

  return (
    <mesh ref={meshRef} position={[0, -1.65, 1.05]} rotation={[0.25, 0, 0]} material={material}>
      <planeGeometry args={[2, 0.7, 16, 4]} />
    </mesh>
  )
}

function Particles() {
  const pointsRef = useRef<THREE.Points>(null)
  const particleCount = 120

  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3)
    let seed = 123456789
    const rand = () => {
      seed = (seed * 16807) % 2147483647
      return (seed - 1) / 2147483646
    }
    for (let i = 0; i < particleCount; i++) {
      const theta = rand() * Math.PI * 2
      const phi = Math.acos(2 * rand() - 1)
      const r = 2.5 + rand() * 2.5
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = r * Math.cos(phi)
    }
    return pos
  }, [])

  useFrame((state) => {
    if (!pointsRef.current) return
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.03
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#c28223"
        size={0.04}
        transparent
        opacity={0.35}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

function Scene({ exploded }: { exploded: boolean }) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 6, 4]} intensity={1.2} castShadow shadow-mapSize={[2048, 2048]} />
      <directionalLight position={[-4, -2, 5]} intensity={0.5} color="#e8e8f5" />
      <pointLight position={[-3, 3, -3]} intensity={0.6} color="#fff5e8" distance={15} decay={2} />
      <pointLight position={[0, 0, 2.5]} intensity={0.8} color="#c28223" distance={8} decay={2} />

      <PaperLayer radius={1.36} height={2.4} yOffset={0} color="#c28223" label="Outer embossed sheet" exploded={exploded} index={4} />
      <PaperLayer radius={1.24} height={2.38} yOffset={0} color="#d49a3f" label="Ply layer 4" exploded={exploded} index={3} />
      <PaperLayer radius={1.12} height={2.36} yOffset={0} color="#c28223" label="Ply layer 3" exploded={exploded} index={2} />
      <PaperLayer radius={1.0} height={2.34} yOffset={0} color="#d49a3f" label="Ply layer 2" exploded={exploded} index={1} />
      <PaperLayer radius={0.88} height={2.32} yOffset={0} color="#c28223" label="Ply layer 1" exploded={exploded} index={0} />
      <CardboardTube exploded={exploded} />
      <LooseSheet exploded={exploded} />

      <Particles />
      <Environment preset="studio" />
      <OrbitControls
        enableZoom
        enablePan={false}
        minDistance={4}
        maxDistance={10}
        autoRotate
        autoRotateSpeed={0.3}
        enableDamping
        dampingFactor={0.05}
      />
    </>
  )
}

export default function HolographicToiletPaper() {
  const [exploded, setExploded] = useState(false)

  return (
    <div
      className="w-full relative rounded-2xl overflow-hidden border border-white/[0.04]"
      style={{ height: '520px', background: 'radial-gradient(ellipse at center, #161616 0%, #0a0a0a 100%)' }}
    >
      <div
        className="absolute inset-0 pointer-events-none z-10 opacity-[0.04]"
        style={{
          backgroundImage: 'linear-gradient(transparent 50%, rgba(194,130,35,0.15) 50%)',
          backgroundSize: '100% 4px',
        }}
      />

      <button
        onClick={() => setExploded((v) => !v)}
        className="absolute top-4 right-4 z-20 px-4 py-2 rounded-full bg-[#141414]/80 border border-white/[0.08] hover:border-[#c28223]/30 text-[#f0ece8] font-mono text-[10px] uppercase tracking-wider transition-all"
      >
        {exploded ? 'Collapse layers' : 'Explode layers'}
      </button>

      <Canvas
        camera={{ position: [4.5, 2, 5.5], fov: 38 }}
        shadows
        gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
        dpr={[1, 1.5]}
      >
        <Scene exploded={exploded} />
      </Canvas>

      <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none z-10">
        <p className="font-mono text-[9px] text-[#888] uppercase tracking-[0.3em]">
          Layered material study · Drag to orbit · Click to explode
        </p>
      </div>
    </div>
  )
}
