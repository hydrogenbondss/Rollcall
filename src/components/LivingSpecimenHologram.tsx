import { useMemo, useRef, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

/**
 * The Living Specimen — a single archived toilet-roll rendered as a luminous
 * point-cloud "hologram": thousands of glowing particles trace the object's
 * surface, floating above a projection cone on a dark stage. Drag to orbit.
 */

// Soft circular glow sprite so each particle blooms (fakes bloom without postprocessing).
function makeGlowTexture() {
  const size = 64
  const c = document.createElement('canvas')
  c.width = c.height = size
  const ctx = c.getContext('2d')!
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.25, 'rgba(200,235,255,0.85)')
  g.addColorStop(0.55, 'rgba(130,180,255,0.35)')
  g.addColorStop(1, 'rgba(130,180,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  const tex = new THREE.CanvasTexture(c)
  tex.needsUpdate = true
  return tex
}

const OUTER = 2.0
const INNER = 0.72
const HEIGHT = 2.7

// cyan (bottom) -> white (middle) -> violet (top), matching a holographic display
const COL_LOW = new THREE.Color('#5fd6ff')
const COL_MID = new THREE.Color('#eaf6ff')
const COL_HIGH = new THREE.Color('#9b8cff')

function buildCloud() {
  const pos: number[] = []
  const col: number[] = []
  const tmp = new THREE.Color()

  const push = (x: number, y: number, z: number) => {
    // gentle jitter for an organic, shimmering particle feel
    pos.push(x + (Math.sin(x * 12.9 + y * 7.3) * 0.5) * 0.03,
             y + (Math.sin(y * 9.1 + z * 4.7) * 0.5) * 0.03,
             z + (Math.sin(z * 11.3 + x * 5.1) * 0.5) * 0.03)
    const t = (y / HEIGHT) + 0.5 // 0 bottom -> 1 top
    if (t < 0.5) tmp.copy(COL_LOW).lerp(COL_MID, t * 2)
    else tmp.copy(COL_MID).lerp(COL_HIGH, (t - 0.5) * 2)
    col.push(tmp.r, tmp.g, tmp.b)
  }

  const RINGS = 120
  const ROWS = 46
  // outer + inner cylindrical walls
  for (let i = 0; i < RINGS; i++) {
    const a = (i / RINGS) * Math.PI * 2
    const cx = Math.cos(a), sz = Math.sin(a)
    for (let j = 0; j <= ROWS; j++) {
      const y = -HEIGHT / 2 + (j / ROWS) * HEIGHT
      push(cx * OUTER, y, sz * OUTER)
      push(cx * INNER, y, sz * INNER)
    }
  }
  // top & bottom annulus caps
  const CAP_R = 26, CAP_A = 90
  for (let i = 0; i < CAP_A; i++) {
    const a = (i / CAP_A) * Math.PI * 2
    const cx = Math.cos(a), sz = Math.sin(a)
    for (let r = 0; r <= CAP_R; r++) {
      const rad = INNER + (r / CAP_R) * (OUTER - INNER)
      push(cx * rad, HEIGHT / 2, sz * rad)
      push(cx * rad, -HEIGHT / 2, sz * rad)
    }
  }
  return {
    positions: new Float32Array(pos),
    colors: new Float32Array(col),
  }
}

function Roll() {
  const group = useRef<THREE.Group>(null)
  const mat = useRef<THREE.PointsMaterial>(null)
  const glow = useMemo(makeGlowTexture, [])
  const { positions, colors } = useMemo(buildCloud, [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (group.current) {
      group.current.rotation.y = t * 0.18
      group.current.position.y = Math.sin(t * 0.6) * 0.06
    }
    if (mat.current) mat.current.size = 0.052 + Math.sin(t * 1.6) * 0.006 // subtle shimmer
  })

  return (
    <group ref={group}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          ref={mat}
          map={glow}
          vertexColors
          size={0.052}
          sizeAttenuation
          transparent
          depthWrite={false}
          opacity={0.95}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  )
}

// Projection cone + emitter base, like a holographic projector beam.
function Projector() {
  const coneMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        uniforms: { uColor: { value: new THREE.Color('#5fd6ff') } },
        vertexShader: `varying float vY; void main(){ vY = uv.y; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
        fragmentShader: `uniform vec3 uColor; varying float vY; void main(){ float a = pow(vY, 1.6) * 0.16; gl_FragColor = vec4(uColor, a); }`,
      }),
    []
  )
  return (
    <group position={[0, -1.55, 0]}>
      {/* beam: narrow at emitter (bottom), widening up toward the specimen */}
      <mesh material={coneMat} position={[0, 0.9, 0]}>
        <coneGeometry args={[OUTER * 1.05, 1.8, 64, 1, true]} />
      </mesh>
      {/* emitter glow disk + ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.5, 48]} />
        <meshBasicMaterial color="#bfeaff" transparent opacity={0.5} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.5, 0.62, 48]} />
        <meshBasicMaterial color="#5fd6ff" transparent opacity={0.35} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  )
}

function Scene() {
  return (
    <>
      <Roll />
      <Projector />
      <OrbitControls
        enableZoom
        enablePan={false}
        minDistance={5}
        maxDistance={13}
        autoRotate
        autoRotateSpeed={0.35}
        enableDamping
        dampingFactor={0.08}
        target={[0, 0, 0]}
      />
    </>
  )
}

export default function LivingSpecimenHologram() {
  return (
    <div
      style={{
        width: '100%',
        height: '480px',
        position: 'relative',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.06)',
        background: 'radial-gradient(120% 90% at 50% 35%, #0b1622 0%, #060608 70%)',
      }}
    >
      <Suspense fallback={<div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5fd6ff', fontFamily: 'monospace', fontSize: '11px' }}>Initialising projection…</div>}>
        <Canvas camera={{ position: [5.5, 2.5, 7], fov: 42 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
          <Scene />
        </Canvas>
      </Suspense>
      <div style={{ position: 'absolute', bottom: '12px', left: 0, right: 0, textAlign: 'center', pointerEvents: 'none' }}>
        <p style={{ fontFamily: 'monospace', fontSize: '8px', color: '#4a6a82', textTransform: 'uppercase', letterSpacing: '0.4em' }}>
          Specimen 001 · Volumetric projection · Drag to orbit
        </p>
      </div>
    </div>
  )
}
