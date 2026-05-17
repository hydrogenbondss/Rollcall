import { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ZoomIn, X, Layers, Droplets, Wind } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

interface Material {
  id: string
  name: string
  desc: string
  icon: typeof Layers
  color: string
  texture: string
  products: number
  countries: string[]
  properties: { label: string; value: string }[]
}

const materials: Material[] = [
  {
    id: 'virgin-pulp',
    name: 'Virgin Pulp',
    desc: 'Made from fresh wood fibers. Softest and strongest option. No recycled content. The premium standard across East Asia.',
    icon: Layers,
    color: '#c28223',
    texture: 'Smooth, consistent surface. Bright white. No visible fiber particles.',
    products: 31,
    countries: ['Japan', 'South Korea', 'Hong Kong', 'Singapore', 'Malaysia'],
    properties: [
      { label: 'Softness', value: 'Highest' },
      { label: 'Strength', value: 'High' },
      { label: 'Environmental', value: 'Lower (no recycled content)' },
      { label: 'Cost', value: 'Premium' },
      { label: 'Dissolvability', value: 'Moderate' },
    ],
  },
  {
    id: 'recycled',
    name: 'Recycled Fiber',
    desc: 'Made from post-consumer recycled paper. Rougher texture, off-white color. Growing category in eco-conscious markets.',
    icon: Wind,
    color: '#228b68',
    texture: 'Visible fiber specks. Slightly rough. Off-white or grey tint.',
    products: 6,
    countries: ['India', 'Taiwan', 'Australia'],
    properties: [
      { label: 'Softness', value: 'Moderate' },
      { label: 'Strength', value: 'Moderate' },
      { label: 'Environmental', value: 'Highest' },
      { label: 'Cost', value: 'Budget-friendly' },
      { label: 'Dissolvability', value: 'Fast' },
    ],
  },
  {
    id: 'bamboo',
    name: 'Bamboo Fiber',
    desc: 'Made from fast-growing bamboo. Naturally antimicrobial. Softer than recycled, more sustainable than virgin pulp.',
    icon: Droplets,
    color: '#8b7ec8',
    texture: 'Silky smooth. Slight natural sheen. Cream or pale green tint.',
    products: 4,
    countries: ['China', 'Vietnam', 'Thailand'],
    properties: [
      { label: 'Softness', value: 'High' },
      { label: 'Strength', value: 'High' },
      { label: 'Environmental', value: 'High' },
      { label: 'Cost', value: 'Mid-premium' },
      { label: 'Dissolvability', value: 'Moderate' },
    ],
  },
  {
    id: 'mixed',
    name: 'Mixed / Hybrid',
    desc: 'Blend of virgin and recycled fibers, sometimes with additives like lotion, aloe, or cotton extract.',
    icon: Layers,
    color: '#c4728e',
    texture: 'Variable. May have scent. Often quilted with lotion additives.',
    products: 2,
    countries: ['Japan', 'South Korea'],
    properties: [
      { label: 'Softness', value: 'Variable' },
      { label: 'Strength', value: 'Moderate' },
      { label: 'Environmental', value: 'Moderate' },
      { label: 'Cost', value: 'Variable' },
      { label: 'Dissolvability', value: 'Slow (additives)' },
    ],
  },
]

export default function MaterialExplorer() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [activeMaterial, setActiveMaterial] = useState<Material>(materials[0])
  const [zoomed, setZoomed] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const ctx = gsap.context(() => {
      gsap.fromTo(section.querySelectorAll('.mat-item'),
        { opacity: 0, y: 30 },
        { scrollTrigger: { trigger: section, start: 'top 80%', toggleActions: 'play none none none' },
          opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out' }
      )
    }, section)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="py-20 border-t border-white/[0.04]">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8">
        <div className="mat-item flex items-center gap-3 mb-3">
          <Layers className="w-4 h-4 text-[#c28223]" strokeWidth={1.5} />
          <p className="font-body text-[10px] uppercase tracking-[0.4em] text-[#888]">Material Explorer</p>
        </div>
        <h2 className="mat-item font-display text-4xl sm:text-5xl mb-4">What It Is Made Of</h2>
        <p className="mat-item font-body text-sm text-[#999] max-w-lg mb-12 leading-relaxed">
          Four material categories across the archive. Each has distinct properties, cost implications, 
          and environmental profile. Click any material to explore.
        </p>

        {/* Material tabs */}
        <div className="mat-item flex gap-2 mb-8 overflow-x-auto pb-2">
          {materials.map((m) => {
            const Icon = m.icon
            return (
              <button
                key={m.id}
                onClick={() => { setActiveMaterial(m); setZoomed(false) }}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-3 rounded-xl transition-all cursor-pointer ${
                  activeMaterial.id === m.id
                    ? 'bg-[#141414] border border-white/[0.08] text-[#f0ece8]'
                    : 'bg-transparent border border-transparent text-[#888] hover:text-[#f0ece8]'
                }`}
              >
                <Icon className="w-4 h-4" style={{ color: m.color }} strokeWidth={1.5} />
                <span className="font-body text-[13px]">{m.name}</span>
                <span className="font-mono text-[10px] text-[#888]">{m.products}</span>
              </button>
            )
          })}
        </div>

        {/* Detail panel */}
        <div className="mat-item grid lg:grid-cols-[1fr_1.2fr] gap-8">
          {/* Texture card (zoomable) */}
          <div className="relative">
            <div
              className={`bg-[#141414] rounded-2xl border border-white/[0.04] p-8 relative overflow-hidden transition-all duration-500 ${
                zoomed ? 'cursor-zoom-out fixed inset-4 z-[200] flex items-center justify-center' : 'cursor-zoom-in'
              }`}
              onClick={() => setZoomed(!zoomed)}
            >
              {!zoomed && (
                <div className="absolute top-4 right-4">
                  <ZoomIn className="w-4 h-4 text-[#888]" strokeWidth={1.5} />
                </div>
              )}
              {zoomed && (
                <button
                  onClick={(e) => { e.stopPropagation(); setZoomed(false) }}
                  className="absolute top-6 right-6 z-10 p-2 rounded-full bg-[#0d0d0d]/80 text-[#888] hover:text-[#f0ece8] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}

              {/* Texture simulation */}
              <div
                className={`rounded-xl mx-auto transition-all duration-500 ${
                  zoomed ? 'w-full max-w-2xl h-64' : 'w-full h-40'
                }`}
                style={{
                  backgroundColor: activeMaterial.id === 'recycled' ? '#c8c0b0' : '#e8e0d4',
                  backgroundImage: activeMaterial.id === 'virgin-pulp'
                    ? 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(200,190,170,0.1) 1px, rgba(200,190,170,0.1) 2px)'
                    : activeMaterial.id === 'recycled'
                    ? `radial-gradient(circle at 20% 30%, #b0a898 1px, transparent 1px),
                       radial-gradient(circle at 70% 60%, #a09888 1px, transparent 1px),
                       radial-gradient(circle at 40% 80%, #b8b0a0 1.5px, transparent 1.5px)`
                    : activeMaterial.id === 'bamboo'
                    ? 'repeating-linear-gradient(90deg, transparent, transparent 4px, rgba(180,200,160,0.15) 4px, rgba(180,200,160,0.15) 5px)'
                    : 'repeating-linear-gradient(45deg, transparent, transparent 6px, rgba(200,180,190,0.1) 6px, rgba(200,180,190,0.1) 8px)',
                  backgroundSize: activeMaterial.id === 'recycled' ? '40px 40px, 60px 60px, 50px 50px' : 'auto',
                }}
              >
                {/* Quilted pattern overlay for 3+ ply materials */}
                {(activeMaterial.id === 'virgin-pulp' || activeMaterial.id === 'mixed') && (
                  <div className="w-full h-full opacity-[0.08]" style={{
                    backgroundImage: `radial-gradient(circle, #000 1px, transparent 1px)`,
                    backgroundSize: '16px 16px',
                  }} />
                )}
              </div>

              <div className="mt-6 text-center">
                <p className="font-body text-[12px] text-[#888] italic">{activeMaterial.texture}</p>
                <p className="font-mono text-[9px] text-[#888] mt-3 uppercase tracking-wider">
                  {zoomed ? 'Click anywhere to close' : 'Click to zoom'}
                </p>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <h3 className="font-display text-2xl text-[#f0ece8] mb-2">{activeMaterial.name}</h3>
              <p className="font-body text-[13px] text-[#999] leading-relaxed">{activeMaterial.desc}</p>
            </div>

            <div className="space-y-0">
              {activeMaterial.properties.map((prop) => (
                <div key={prop.label} className="flex justify-between py-3 border-b border-white/[0.04]">
                  <span className="font-mono text-[11px] text-[#888]">{prop.label}</span>
                  <span className="font-body text-[12px] text-[#a09890]">{prop.value}</span>
                </div>
              ))}
            </div>

            <div>
              <p className="font-mono text-[10px] text-[#888] uppercase tracking-wider mb-2">Found in</p>
              <div className="flex flex-wrap gap-2">
                {activeMaterial.countries.map((c) => (
                  <span key={c} className="px-3 py-1.5 bg-[#141414] rounded-lg font-body text-[11px] text-[#999] border border-white/[0.04]">
                    {c}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <span className="font-mono text-[10px] text-[#888] uppercase tracking-wider">
                {activeMaterial.products} specimens in archive
              </span>
              <span className="w-1 h-1 rounded-full bg-[#555]" />
              <span className="font-mono text-[10px] text-[#888] uppercase tracking-wider">
                {Math.round((activeMaterial.products / 43) * 100)}% of collection
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
