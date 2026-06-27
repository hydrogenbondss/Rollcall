import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, Float } from '@react-three/drei'
import * as THREE from 'three'

// Deterministic linear congruential generator for stable procedural textures.
function makeSeededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

// Procedural paper fiber texture
function createPaperTexture(): THREE.CanvasTexture {
  const size = 1024
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  const rand = makeSeededRandom(987654321)

  // Warm off-white base
  ctx.fillStyle = '#f4f1ec'
  ctx.fillRect(0, 0, size, size)

  // Fine fiber noise
  for (let i = 0; i < 40000; i++) {
    const x = rand() * size
    const y = rand() * size
    const alpha = rand() * 0.05
    ctx.fillStyle = `rgba(160, 150, 140, ${alpha})`
    ctx.fillRect(x, y, 1 + rand() * 2, 0.6)
  }

  // Quilted diamond emboss pattern
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

  // Soft edge shadow
  const grad = ctx.createRadialGradient(size / 2, size / 2, size * 0.3, size / 2, size / 2, size * 0.5)
  grad.addColorStop(0, 'rgba(0,0,0,0)')
  grad.addColorStop(1, 'rgba(140, 130, 120, 0.1)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, size, size)

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(3, 1)
  texture.anisotropy = 8
  return texture
}

function HolographicRoll() {
  const groupRef = useRef<THREE.Group>(null)
  const paperTexture = useMemo(() => createPaperTexture(), [])

  // Iridescent holographic paper material
  const paperMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      map: paperTexture,
      color: '#ffffff',
      roughness: 0.35,
      metalness: 0.15,
      iridescence: 1,
      iridescenceIOR: 1.4,
      iridescenceThicknessRange: [120, 450],
      clearcoat: 0.8,
      clearcoatRoughness: 0.1,
      reflectivity: 0.6,
      sheen: 0.5,
      sheenColor: '#c28223',
      side: THREE.DoubleSide,
    })
  }, [paperTexture])

  const tubeMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#bfa07a',
      roughness: 0.85,
      metalness: 0,
      bumpMap: paperTexture,
      bumpScale: 0.005,
    })
  }, [paperTexture])

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    groupRef.current.rotation.y = t * 0.12
    groupRef.current.rotation.z = Math.sin(t * 0.2) * 0.03
    groupRef.current.position.y = Math.sin(t * 0.6) * 0.08
  })

  return (
    <group ref={groupRef}>
      {/* Main paper cylinder */}
      <mesh material={paperMaterial} castShadow receiveShadow>
        <cylinderGeometry args={[1.35, 1.35, 2.4, 96, 1, true]} />
      </mesh>

      {/* Top ring */}
      <mesh position={[0, 1.2, 0]} rotation={[Math.PI / 2, 0, 0]} material={paperMaterial}>
        <ringGeometry args={[0.5, 1.35, 96]} />
      </mesh>

      {/* Bottom ring */}
      <mesh position={[0, -1.2, 0]} rotation={[Math.PI / 2, 0, 0]} material={paperMaterial}>
        <ringGeometry args={[0.5, 1.35, 96]} />
      </mesh>

      {/* Inner cardboard tube */}
      <mesh material={tubeMaterial} castShadow>
        <cylinderGeometry args={[0.5, 0.5, 2.42, 64, 1, true]} />
      </mesh>

      {/* Loose tail with subtle curl */}
      <mesh position={[0, -1.65, 1.05]} rotation={[0.25, 0, 0]} material={paperMaterial}>
        <planeGeometry args={[2, 0.7, 16, 4]} />
      </mesh>

      {/* Holographic rim light accent — warm amber glow */}
      <pointLight position={[0, 0, 2.5]} intensity={0.8} color="#c28223" distance={8} decay={2} />
    </group>
  )
}

function HolographicParticles() {
  const pointsRef = useRef<THREE.Points>(null)
  const particleCount = 120

  // Deterministic pseudo-random generator so particle positions are stable
  // across renders (keeps React Compiler / strict-mode lint happy).
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
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
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

function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 6, 4]} intensity={1.2} castShadow shadow-mapSize={[2048, 2048]} />
      <directionalLight position={[-4, -2, 5]} intensity={0.5} color="#e8e8f5" />
      <pointLight position={[-3, 3, -3]} intensity={0.6} color="#fff5e8" distance={15} decay={2} />

      <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.4}>
        <HolographicRoll />
      </Float>

      <HolographicParticles />
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
  return (
    <div
      className="w-full relative rounded-2xl overflow-hidden border border-white/[0.04]"
      style={{ height: '520px', background: 'radial-gradient(ellipse at center, #161616 0%, #0a0a0a 100%)' }}
    >
      {/* Holographic scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-10 opacity-[0.04]"
        style={{
          backgroundImage: 'linear-gradient(transparent 50%, rgba(194,130,35,0.15) 50%)',
          backgroundSize: '100% 4px',
        }}
      />

      <Canvas
        camera={{ position: [4.5, 2, 5.5], fov: 38 }}
        shadows
        gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
        dpr={[1, 1.5]}
      >
        <Scene />
      </Canvas>

      <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none z-10">
        <p className="font-mono text-[9px] text-[#888] uppercase tracking-[0.3em]">
          Holographic material study · Drag to orbit
        </p>
      </div>
    </div>
  )
}
