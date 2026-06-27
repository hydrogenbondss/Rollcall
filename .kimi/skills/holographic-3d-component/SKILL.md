# Holographic 3D Component

Use this skill when a project needs a visually impressive, performant 3D object with a holographic/iridescent look using React and Three.js.

## When to use

- The user asks for a "holographic", "iridescent", or "premium 3D" product visualization.
- The existing 3D asset looks flat or "fake" and needs material depth.
- You want a grant-worthy, museum-quality digital object without external model assets.

## Stack

- `@react-three/fiber` for the React/Three.js canvas.
- `@react-three/drei` for `<Environment>`, `<OrbitControls>`, `<Float>`.
- `three` for materials and geometry.

## Recipe

1. Wrap the canvas in a dark, radial-gradient container.
2. Build the object from basic geometries (`cylinderGeometry`, `ringGeometry`, `planeGeometry`).
3. Use `MeshPhysicalMaterial` with these properties for the holographic surface:
   - `iridescence: 1`
   - `iridescenceIOR: 1.3–1.5`
   - `iridescenceThicknessRange: [100, 500]`
   - `roughness: 0.2–0.4`
   - `metalness: 0.1–0.2`
   - `clearcoat: 0.8–1.0`
   - `sheen: 0.4–0.6`, `sheenColor: <accent color>`
4. Add a subtle particle field with `THREE.AdditiveBlending` for atmosphere.
5. Add a scanline or vignette overlay with CSS for the holographic UI feel.
6. Use `<Float>` and `useFrame` for gentle, deterministic motion.
7. Avoid `Math.random()` during render; use a seeded PRNG so positions are stable across strict React lint rules.

## Deterministic random helper

```ts
function makeSeededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}
```

## Accessibility

- Add an `aria-label` on the canvas container.
- Provide a text fallback inside `<Suspense>`.
- Respect `prefers-reduced-motion` by disabling auto-rotation when requested.

## Example reference

See `src/components/HolographicToiletPaper.tsx` in this repo for a complete implementation.
