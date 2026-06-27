import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import * as THREE from 'three'

// Procedural toilet paper texture generator
function createPaperTexture(): THREE.CanvasTexture {
  const size = 1024
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!

  // Base white
  ctx.fillStyle = '#f5f2ed'
  ctx.fillRect(0, 0, size, size)

  // Subtle paper fiber noise
  for (let i = 0; i < 30000; i++) {
    const x = Math.random() * size
    const y = Math.random() * size
    const opacity = Math.random() * 0.06
    ctx.fillStyle = `rgba(180, 175, 168, ${opacity})`
    ctx.fillRect(x, y, 1 + Math.random() * 2, 1)
  }

  // Quilted diamond pattern (common on premium TP)
  const diamondSize = 32
  ctx.strokeStyle = 'rgba(200, 195, 186, 0.25)'
  ctx.lineWidth = 0.8

  for (let row = -2; row < size / diamondSize + 2; row++) {
    for (let col = -2; col < size / diamondSize + 2; col++) {
      const cx = col * diamondSize + (row % 2 === 0 ? 0 : diamondSize / 2)
      const cy = row * (diamondSize * 0.866)

      ctx.beginPath()
      ctx.moveTo(cx, cy - diamondSize * 0.433)
      ctx.lineTo(cx + diamondSize * 0.5, cy)
      ctx.lineTo(cx, cy + diamondSize * 0.433)
      ctx.lineTo(cx - diamondSize * 0.5, cy)
      ctx.closePath()
      ctx.stroke()
    }
  }

  // Subtle edge shadow (paper roll edge)
  const gradient = ctx.createRadialGradient(
    size / 2, size / 2, size * 0.35,
    size / 2, size / 2, size * 0.5
  )
  gradient.addColorStop(0, 'rgba(0,0,0,0)')
  gradient.addColorStop(1, 'rgba(160, 155, 148, 0.12)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(4, 1)
  return texture
}

// Inner cardboard tube texture
function createTubeTexture(): THREE.CanvasTexture {
  const size = 512
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!

  ctx.fillStyle = '#c4a97d'
  ctx.fillRect(0, 0, size, size)

  // Cardboard fiber pattern
  for (let i = 0; i < 8000; i++) {
    const x = Math.random() * size
    const y = Math.random() * size
    const opacity = Math.random() * 0.08
    ctx.fillStyle = `rgba(100, 80, 50, ${opacity})`
    ctx.fillRect(x, y, 2 + Math.random() * 3, 0.5)
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  return texture
}

function ToiletPaperRoll() {
  const groupRef = useRef<THREE.Group>(null)
  const rollRef = useRef<THREE.Mesh>(null)

  const paperTexture = useMemo(() => createPaperTexture(), [])
  const tubeTexture = useMemo(() => createTubeTexture(), [])

  const paperMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    map: paperTexture,
    roughness: 0.85,
    metalness: 0.0,
    bumpMap: paperTexture,
    bumpScale: 0.002,
  }), [paperTexture])

  const tubeMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    map: tubeTexture,
    roughness: 0.95,
    metalness: 0.0,
    color: '#c4a97d',
  }), [tubeTexture])

  // Scroll-driven rotation
  useFrame((_, delta) => {
    if (groupRef.current) {
      // Base slow rotation + scroll-driven speed
      groupRef.current.rotation.y += delta * 0.15
      groupRef.current.rotation.x = Math.sin(Date.now() * 0.0003) * 0.08
    }
    if (rollRef.current) {
      rollRef.current.rotation.y += delta * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      {/* Main paper cylinder */}
      <mesh
        ref={rollRef}
        material={paperMaterial}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[1.2, 1.2, 2.2, 64, 1, true]} />
      </mesh>

      {/* Top cap */}
      <mesh position={[0, 1.1, 0]} rotation={[Math.PI / 2, 0, 0]} material={paperMaterial}>
        <ringGeometry args={[0.45, 1.2, 64]} />
      </mesh>

      {/* Bottom cap */}
      <mesh position={[0, -1.1, 0]} rotation={[Math.PI / 2, 0, 0]} material={paperMaterial}>
        <ringGeometry args={[0.45, 1.2, 64]} />
      </mesh>

      {/* Inner cardboard tube */}
      <mesh material={tubeMaterial} castShadow>
        <cylinderGeometry args={[0.45, 0.45, 2.2, 32, 1, true]} />
      </mesh>

      {/* Loose paper tail */}
      <mesh position={[0, -1.5, 0.9]} rotation={[0.3, 0, 0]} material={paperMaterial}>
        <planeGeometry args={[1.8, 0.6, 8, 4]} />
      </mesh>

      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-3, -2, 4]} intensity={0.3} color="#c28223" />
      <pointLight position={[0, 0, 3]} intensity={0.5} />
    </group>
  )
}

export default function ToiletPaper3D() {
  return (
    <div className="w-full h-full min-h-[400px] relative">
      <Canvas
        camera={{ position: [3, 1.5, 4], fov: 35 }}
        shadows
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ToiletPaperRoll />
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={3}
          maxDistance={8}
          autoRotate={false}
          dampingFactor={0.05}
          enableDamping
        />
        <Environment preset="studio" />
      </Canvas>

      {/* Caption */}
      <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
        <p className="font-mono text-[9px] text-[#888] uppercase tracking-[0.3em]">
          Drag to orbit · Scroll to zoom
        </p>
      </div>
    </div>
  )
}
