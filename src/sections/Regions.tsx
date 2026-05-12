import { useRef, useEffect, useMemo } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { products, getRegion } from '../data/products'
import { Globe } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const regionConfigs = [
  {
    name: 'East Asia',
    countries: 'Japan · South Korea · China · Hong Kong · Taiwan · Mongolia',
    signature: '4-ply hotel luxury',
    insight: 'The most ply-obsessed region. Japanese hotels compete on thickness. Hong Kong has turned scented rolls into a lifestyle statement.',
    color: '#c4728e',
  },
  {
    name: 'Southeast Asia',
    countries: 'Singapore · Malaysia · Thailand · Philippines · Indonesia · Vietnam · Cambodia · Laos · Brunei · Myanmar',
    signature: 'Bamboo innovation',
    insight: 'The most environmentally experimental. Singapore\'s Cloversoft pioneered bamboo tissue. Indonesia\'s Paseo uses plantation pulp at scale.',
    color: '#228b68',
  },
  {
    name: 'South Asia',
    countries: 'India · Bangladesh · Pakistan · Nepal · Sri Lanka',
    signature: 'Infrastructure realism',
    insight: 'The most constrained by plumbing. One-ply remains standard in much of the region. Luxury here means a toilet that can handle three-ply.',
    color: '#c85a32',
  },
]

export default function Regions() {
  const sectionRef = useRef<HTMLDivElement>(null)

  const stats = useMemo(() => {
    const result: Record<string, { count: number; avgPly: number }> = {}
    regionConfigs.forEach((r) => {
      result[r.name] = { count: 0, avgPly: 0 }
    })

    products.forEach((p) => {
      const region = getRegion(p.country)
      if (region && result[region]) {
        result[region].count++
        result[region].avgPly += p.ply
      }
    })

    Object.keys(result).forEach((r) => {
      if (result[r].count > 0) {
        result[r].avgPly = Math.round((result[r].avgPly / result[r].count) * 10) / 10
      }
    })

    return result
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      document.querySelectorAll('.region-card').forEach((card, i) => {
        gsap.from(card, {
          x: i === 0 ? -60 : i === 2 ? 60 : 0,
          y: 40,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="regions" className="w-full bg-[#0d0d0d] py-28">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8">
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-3">
            <Globe className="w-4 h-4 text-[#888]" strokeWidth={1.5} />
            <p className="font-body text-[10px] uppercase tracking-[0.4em] text-[#888]">Geography</p>
          </div>
          <h2 className="font-display text-5xl sm:text-6xl text-[#f0ece8] tracking-tight leading-[1.05]">
            Three Regions,<br />
            <span className="text-[#888]">Three Relationships.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {regionConfigs.map((region) => {
            const regionStats = stats[region.name] || { count: 0, avgPly: 0 }
            return (
              <div
                key={region.name}
                className="region-card relative rounded-2xl p-8 border border-white/5 overflow-hidden bg-[#141414]"
              >
                {/* Accent line */}
                <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: region.color }} />

                <p className="font-body text-[10px] uppercase tracking-[0.3em] text-[#888] mb-2">
                  {regionStats.count} products
                </p>
                <h3 className="font-display text-2xl text-[#f0ece8] mb-3">
                  {region.name}
                </h3>
                <p className="font-body text-[11px] text-[#888] leading-relaxed mb-6">
                  {region.countries}
                </p>

                <div className="space-y-4">
                  <div>
                    <p className="font-body text-[10px] uppercase tracking-wider text-[#888] mb-1">Signature</p>
                    <p className="font-body text-sm font-medium text-[#f0ece8]">{region.signature}</p>
                  </div>
                  <div>
                    <p className="font-body text-[10px] uppercase tracking-wider text-[#888] mb-1">Average Ply</p>
                    <p className="font-display text-2xl text-[#f0ece8]">{regionStats.avgPly}</p>
                  </div>
                  <div>
                    <p className="font-body text-[10px] uppercase tracking-wider text-[#888] mb-1">Insight</p>
                    <p className="font-body text-sm text-[#a09890] leading-relaxed">{region.insight}</p>
                  </div>
                </div>

                {/* Subtle glow */}
                <div
                  className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full opacity-[0.08] pointer-events-none"
                  style={{ background: `radial-gradient(circle, ${region.color} 0%, transparent 70%)` }}
                />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
