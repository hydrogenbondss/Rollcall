import { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const plyData = [
  {
    count: 1,
    label: 'One-Ply',
    desc: 'A single thin sheet. Common in budget markets and developing economies.',
    countries: 'Myanmar, Bangladesh, Cambodia, Laos',
    price: '$0.08 – $0.18 / roll',
    feel: 'Translucent. Slightly rough. You can see light through it.',
    color: '#d4c8b8',
    layerColor: '#e8dfd4',
    gap: 0,
  },
  {
    count: 2,
    label: 'Two-Ply',
    desc: 'Two bonded layers. The global standard for mid-range products.',
    countries: 'Philippines, Malaysia, India, Sri Lanka',
    price: '$0.25 – $0.75 / roll',
    feel: 'Substantial. No transparency. The most common construction worldwide.',
    color: '#c4b8a8',
    layerColor: '#ddd4c8',
    gap: 0.15,
  },
  {
    count: 3,
    label: 'Three-Ply',
    desc: 'Three bonded layers with quilted embossing. Premium positioning.',
    countries: 'Thailand, Vietnam, Singapore, Taiwan, Hong Kong',
    price: '$0.80 – $2.50 / roll',
    feel: 'Cushioned. Quilted pattern pressed between layers. Noticeably thicker.',
    color: '#b4a898',
    layerColor: '#d2c8b8',
    gap: 0.12,
  },
  {
    count: 4,
    label: 'Four-Ply',
    desc: 'Maximum thickness. Often includes lotion or fragrance. Top-tier.',
    countries: 'Japan, South Korea, China',
    price: '$2.80 – $5.90 / roll',
    feel: 'Dense. Soft. Approaches fabric-like hand-feel. The luxury end of the category.',
    color: '#a49888',
    layerColor: '#c8bda8',
    gap: 0.10,
  },
]

export default function PlyCrossSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [activePly, setActivePly] = useState(2)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        section.querySelectorAll('.ply-item'),
        { opacity: 0, y: 30 },
        {
          scrollTrigger: { trigger: section, start: 'top 80%', toggleActions: 'play none none none' },
          opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out',
        }
      )
    }, section)

    return () => ctx.revert()
  }, [])

  const active = plyData[activePly - 1]

  return (
    <section ref={sectionRef} className="py-20 border-t border-white/[0.04]">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8">
        <div className="ply-item flex items-center gap-3 mb-3">
          <svg className="w-4 h-4 text-[#c28223]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="4" y="4" width="16" height="16" rx="2" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="12" y1="4" x2="12" y2="20" />
          </svg>
          <p className="font-body text-[10px] uppercase tracking-[0.4em] text-[#888]">Material Anatomy</p>
        </div>
        <h2 className="ply-item font-display text-4xl sm:text-5xl mb-4">What Ply Actually Means</h2>
        <p className="ply-item font-body text-sm text-[#999] max-w-lg mb-12 leading-relaxed">
          The number of bonded paper layers. Each additional ply changes cost, opacity, and perceived quality. 
          This is the simplest way to segment the toilet paper market globally.
        </p>

        {/* Ply selector tabs */}
        <div className="ply-item flex gap-2 mb-12 overflow-x-auto pb-2">
          {plyData.map((p) => (
            <button
              key={p.count}
              onClick={() => setActivePly(p.count)}
              className={`flex-shrink-0 px-5 py-3 rounded-xl font-mono text-sm tracking-wider transition-all cursor-pointer ${
                activePly === p.count
                  ? 'bg-[#c28223]/10 border border-[#c28223]/30 text-[#f0ece8]'
                  : 'bg-[#141414] border border-white/[0.04] text-[#888] hover:text-[#f0ece8] hover:border-white/[0.08]'
              }`}
            >
              {p.count}-Ply
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12">
          {/* 3D Cross-section visualization */}
          <div className="ply-item">
            <div className="bg-[#141414] rounded-2xl border border-white/[0.04] p-8 relative overflow-hidden">
              <p className="font-mono text-[10px] text-[#888] uppercase tracking-wider mb-6">Cross-section view</p>

              {/* Paper layers */}
              <div className="flex flex-col items-center gap-0">
                {/* Top edge (rolled) */}
                <div className="w-48 h-4 rounded-t-full border border-white/10 bg-[#1a1a1a]" />

                {/* Layers */}
                <div className="relative w-48" style={{ height: `${active.count * 28 + 20}px` }}>
                  {Array.from({ length: active.count }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute left-0 right-0 h-6 rounded-sm border-l-2 border-r-2 transition-all duration-500"
                      style={{
                        top: `${10 + i * 26}px`,
                        backgroundColor: active.layerColor,
                        borderColor: active.color,
                        opacity: 0.7 + (i * 0.08),
                        transform: `translateX(${i % 2 === 0 ? 0 : active.gap * 10}px)`,
                      }}
                    >
                      {/* Fiber texture overlay */}
                      <div className="absolute inset-0 opacity-20" style={{
                        backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.05) 2px, rgba(0,0,0,0.05) 3px)`,
                      }} />
                      {/* Embossing pattern for 3+ ply */}
                      {active.count >= 3 && (
                        <div className="absolute inset-0 opacity-10" style={{
                          backgroundImage: `radial-gradient(circle, #000 1px, transparent 1px)`,
                          backgroundSize: '8px 8px',
                        }} />
                      )}
                    </div>
                  ))}

                  {/* Bond lines between layers */}
                  {Array.from({ length: active.count - 1 }).map((_, i) => (
                    <div
                      key={`bond-${i}`}
                      className="absolute left-1 right-1 h-px transition-all duration-500"
                      style={{
                        top: `${36 + i * 26}px`,
                        backgroundColor: active.color,
                        opacity: 0.5,
                      }}
                    />
                  ))}
                </div>

                {/* Bottom edge */}
                <div className="w-48 h-4 rounded-b-full border border-white/10 bg-[#1a1a1a]" />
              </div>

              {/* Measurement indicator */}
              <div className="mt-8 flex items-center justify-center gap-3">
                <div className="h-px w-16 bg-[#c28223]/30" />
                <span className="font-mono text-[10px] text-[#888] tracking-wider">
                  {active.count} {active.count === 1 ? 'layer' : 'layers'} · ~{active.count * 0.15}mm thick
                </span>
                <div className="h-px w-16 bg-[#c28223]/30" />
              </div>
            </div>
          </div>

          {/* Info panel */}
          <div className="ply-item space-y-6">
            <div>
              <h3 className="font-display text-2xl text-[#f0ece8] mb-2">{active.label}</h3>
              <p className="font-body text-[13px] text-[#999] leading-relaxed">{active.desc}</p>
            </div>

            <div className="space-y-4 font-mono text-[11px]">
              <div className="flex justify-between py-3 border-b border-white/[0.04]">
                <span className="text-[#888]">Common in</span>
                <span className="text-[#a09890] max-w-[250px] text-right">{active.countries}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-white/[0.04]">
                <span className="text-[#888]">Price range</span>
                <span className="text-[#a09890]">{active.price}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-white/[0.04]">
                <span className="text-[#888]">Hand feel</span>
                <span className="text-[#a09890] max-w-[250px] text-right">{active.feel}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-white/[0.04]">
                <span className="text-[#888]">Global share</span>
                <span className="text-[#a09890]">
                  {active.count === 1 ? '~18%' : active.count === 2 ? '~42%' : active.count === 3 ? '~32%' : '~8%'}
                </span>
              </div>
            </div>

            {/* Visual comparison bar */}
            <div className="pt-4">
              <p className="font-mono text-[10px] text-[#888] uppercase tracking-wider mb-3">Thickness comparison</p>
              <div className="flex items-end gap-4 h-24">
                {plyData.map((p) => (
                  <div key={p.count} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full rounded-t-sm transition-all duration-500"
                      style={{
                        height: `${p.count * 20 + 10}px`,
                        backgroundColor: p.color,
                        opacity: activePly === p.count ? 1 : 0.3,
                      }}
                    />
                    <span className={`font-mono text-[9px] tracking-wider ${activePly === p.count ? 'text-[#f0ece8]' : 'text-[#888]'}`}>
                      {p.count}P
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
