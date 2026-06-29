import { useRef, useEffect, useMemo, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MapPin } from 'lucide-react'
import { products, getRegion, getRegionColor } from '../data/products'
import { countryCount } from '../data/stats'

gsap.registerPlugin(ScrollTrigger)

const countryPositions: Record<string, { x: number; y: number }> = {
  Japan: { x: 88, y: 28 },
  'South Korea': { x: 84, y: 32 },
  China: { x: 72, y: 34 },
  'Hong Kong': { x: 76, y: 42 },
  Taiwan: { x: 80, y: 40 },
  Mongolia: { x: 70, y: 20 },
  Singapore: { x: 62, y: 62 },
  Malaysia: { x: 60, y: 58 },
  Thailand: { x: 58, y: 50 },
  Philippines: { x: 78, y: 52 },
  Indonesia: { x: 56, y: 68 },
  Vietnam: { x: 62, y: 48 },
  Cambodia: { x: 60, y: 52 },
  Laos: { x: 60, y: 45 },
  Brunei: { x: 64, y: 60 },
  Myanmar: { x: 56, y: 44 },
  India: { x: 44, y: 48 },
  Bangladesh: { x: 48, y: 44 },
  Pakistan: { x: 40, y: 40 },
  Nepal: { x: 46, y: 38 },
  'Sri Lanka': { x: 46, y: 58 },
}

const regionColors: Record<string, string> = {
  'East Asia': '#c4728e',
  'Southeast Asia': '#228b68',
  'South Asia': '#c85a32',
}

export default function WorldMap() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null)

  const countryData = useMemo(() => {
    const data: Record<string, { count: number; region: string; color: string; brands: string[]; totalPly: number }> = {}
    products.forEach((p) => {
      if (!data[p.country]) {
        data[p.country] = { count: 0, region: getRegion(p.country) || 'Other', color: getRegionColor(p.country), brands: [], totalPly: 0 }
      }
      data[p.country].count++
      data[p.country].brands.push(p.brand)
      data[p.country].totalPly += p.ply
    })
    return data
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const ctx = gsap.context(() => {
      gsap.from('.map-title', { scrollTrigger: { trigger: section, start: 'top 75%' }, opacity: 0, y: 40, duration: 1, ease: 'power3.out' })
      gsap.from('.map-dot', { scrollTrigger: { trigger: section, start: 'top 80%' }, scale: 0, opacity: 0, duration: 0.6, stagger: 0.04, ease: 'back.out(1.7)', delay: 0.3 })
    }, section)
    return () => ctx.revert()
  }, [])

  const getTooltipData = (country: string) => {
    const d = countryData[country]
    if (!d) return null
    const brandCounts: Record<string, number> = {}
    d.brands.forEach(b => { brandCounts[b] = (brandCounts[b] || 0) + 1 })
    const topBrand = Object.entries(brandCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || ''
    return { country, count: d.count, region: d.region, color: d.color, topBrand, avgPly: Math.round((d.totalPly / d.count) * 10) / 10 }
  }

  return (
    <section ref={sectionRef} id="map" className="w-full bg-[#0d0d0d] py-16">
      <div className="max-w-[860px] mx-auto px-6 sm:px-8">
        <div className="map-title mb-8">
          <div className="flex items-center gap-3 mb-3">
            <MapPin className="w-4 h-4 text-[#888]" strokeWidth={1.5} />
            <p className="font-body text-[10px] uppercase tracking-[0.4em] text-[#888]">Coverage · supporting reference</p>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl text-[#f0ece8] tracking-tight leading-[1.05]">Where the archive reaches</h2>
          <p className="font-body text-[13px] text-[#999] mt-3 max-w-md">
            {countryCount} countries. Each dot marks a country in the archive; positions are approximate relative coordinates. The map supports the collection — it is not the collection.
          </p>
        </div>

        <div className="relative bg-[#141414] rounded-2xl border border-white/5 overflow-hidden p-5 sm:p-6">
          {/* Tooltip */}
          {hoveredCountry && (() => {
            const d = getTooltipData(hoveredCountry)
            const pos = countryPositions[hoveredCountry]
            if (!d || !pos) return null
            return (
              <div className="absolute z-10 pointer-events-none bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 shadow-2xl"
                style={{ left: `${pos.x}%`, top: `${pos.y - 8}%`, transform: 'translate(-50%, -100%)' }}>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="font-display text-sm text-[#f0ece8]">{d.country}</span>
                  <span className="font-mono text-[9px] text-[#888] uppercase">{d.region}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] text-[#999]"><strong className="text-[#f0ece8]">{d.count}</strong> specimen{d.count > 1 ? 's' : ''}</span>
                  <span className="font-mono text-[10px] text-[#999]">Avg <strong className="text-[#f0ece8]">{d.avgPly}</strong>-ply</span>
                </div>
                <p className="font-body text-[10px] text-[#888] mt-0.5">Top: {d.topBrand}</p>
              </div>
            )
          })()}

          <svg viewBox="34 12 60 60" className="w-full h-auto" style={{ maxHeight: 360 }}>
            {/* Grid */}
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.1" />
              </pattern>
            </defs>
            <rect width="100" height="70" fill="url(#grid)" />

            {/* Longitude/latitude guide lines */}
            <line x1="20" y1="0" x2="20" y2="70" stroke="rgba(255,255,255,0.04)" strokeWidth="0.05" strokeDasharray="1 1" />
            <line x1="40" y1="0" x2="40" y2="70" stroke="rgba(255,255,255,0.04)" strokeWidth="0.05" strokeDasharray="1 1" />
            <line x1="60" y1="0" x2="60" y2="70" stroke="rgba(255,255,255,0.04)" strokeWidth="0.05" strokeDasharray="1 1" />
            <line x1="80" y1="0" x2="80" y2="70" stroke="rgba(255,255,255,0.04)" strokeWidth="0.05" strokeDasharray="1 1" />
            <line x1="0" y1="20" x2="100" y2="20" stroke="rgba(255,255,255,0.04)" strokeWidth="0.05" strokeDasharray="1 1" />
            <line x1="0" y1="40" x2="100" y2="40" stroke="rgba(255,255,255,0.04)" strokeWidth="0.05" strokeDasharray="1 1" />
            <line x1="0" y1="60" x2="100" y2="60" stroke="rgba(255,255,255,0.04)" strokeWidth="0.05" strokeDasharray="1 1" />

            {/* Dots */}
            {Object.entries(countryPositions).map(([country, pos]) => {
              const data = countryData[country]
              if (!data) return null
              const radius = Math.max(1.5, Math.min(3.5, data.count * 0.9))
              const isHovered = hoveredCountry === country
              return (
                <g key={country} className="cursor-pointer"
                  onMouseEnter={() => setHoveredCountry(country)}
                  onMouseLeave={() => setHoveredCountry(null)}>
                  {/* Large invisible hit area */}
                  <circle cx={pos.x} cy={pos.y} r={radius + 4} fill="transparent" />
                  {/* Visible dot */}
                  <circle cx={pos.x} cy={pos.y} r={isHovered ? radius * 1.3 : radius}
                    fill={data.color} opacity={isHovered ? 1 : 0.9}
                    stroke={isHovered ? 'rgba(255,255,255,0.3)' : 'none'} strokeWidth="0.2" />
                  {/* Country code only on hover — avoids an overlapping always-on label blob */}
                  {isHovered && (
                    <text x={pos.x} y={pos.y + radius + 3} textAnchor="middle" fill="#c4bdb5" fontSize="2.6" fontFamily="monospace">{country.substring(0, 3).toUpperCase()}</text>
                  )}
                </g>
              )
            })}
          </svg>

          {/* Legend below map */}
          <div className="flex items-center justify-center gap-8 mt-4 pt-4 border-t border-white/5">
            {Object.entries(regionColors).map(([region, color]) => (
              <div key={region} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                <span className="font-body text-[12px] text-[#a09890]">{region}</span>
                <span className="font-mono text-[10px] text-[#666]">({Object.values(countryData).filter(d => d.region === region).length} countries)</span>
              </div>
            ))}
            <div className="flex items-center gap-2 ml-4">
              <div className="w-2 h-2 rounded-full bg-[#555]" />
              <span className="font-mono text-[10px] text-[#666]">Dot size = specimen count</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
