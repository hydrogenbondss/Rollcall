import React, { useRef, useState, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Html } from '@react-three/drei'
import * as THREE from 'three'

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
    <group ref={groupRef} position={[0, layer.y, 0]} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[layer.radius, layer.radius, layer.thickness, 64]} />
        <meshStandardMaterial color={layer.color} roughness={0.85} metalness={0.05} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[layer.radius * 0.985, 0.012, 6, 64]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={hovered ? 0.25 : 0.08} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.42, 0.42, layer.thickness + 0.01, 32, 1, true]} />
        <meshBasicMaterial color="#111111" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>
      <Html position={[layer.radius + 0.6, 0, 0]} center style={{ pointerEvents: 'none' }}>
        <div style={{ opacity: hovered ? 1 : 0.85 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '20px', height: '1px', backgroundColor: '#c28223' }} />
            <div style={{ padding: '6px 12px', borderRadius: '6px', backgroundColor: 'rgba(13,13,13,0.9)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#c28223', fontFamily: 'monospace', fontSize: '10px', fontWeight: 'bold' }}>{layer.id}</span>
                <span style={{ color: '#f0ece8', fontFamily: 'monospace', fontSize: '11px', fontWeight: 'bold' }}>{layer.label}</span>
              </div>
              <p style={{ color: '#888', fontSize: '9px', marginTop: '2px', whiteSpace: 'nowrap' }}>{layer.material}</p>
            </div>
          </div>
        </div>
      </Html>
    </group>
  )
}

function CoreTube() {
  const ref = useRef<THREE.Group>(null)
  useFrame((state) => { if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.25 })
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
      {layerData.map((layer, i) => <PaperLayer key={layer.id} layer={layer} index={i} />)}
      <CoreTube />
      <OrbitControls enableZoom enablePan={false} minDistance={5} maxDistance={14} autoRotate autoRotateSpeed={0.4} enableDamping dampingFactor={0.08} />
    </>
  )
}

export default function ExplodedToiletPaper3D() {
  return (
    <div style={{ width: '100%', height: '480px', position: 'relative', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.04)', background: '#0a0a0a' }}>
      <Suspense fallback={<div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>Loading 3D Model...</div>}>
        <Canvas camera={{ position: [6, 5, 7], fov: 42 }} style={{ background: '#0a0a0a' }}>
          <Scene />
        </Canvas>
      </Suspense>
      <div style={{ position: 'absolute', bottom: '12px', left: 0, right: 0, textAlign: 'center', pointerEvents: 'none' }}>
        <p style={{ fontFamily: 'monospace', fontSize: '8px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.4em' }}>
          Drag to orbit · Scroll to zoom · Auto-rotating
        </p>
      </div>
    </div>
  )
}
