import { useRef, useEffect, useMemo } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MapPin } from 'lucide-react'
import { products, getRegion, getRegionColor } from '../data/products'

gsap.registerPlugin(ScrollTrigger)

const countryPositions: Record<string, { x: number; y: number; label: string }> = {
  Japan: { x: 88, y: 28, label: 'JP' },
  'South Korea': { x: 82, y: 32, label: 'KR' },
  China: { x: 70, y: 35, label: 'CN' },
  'Hong Kong': { x: 74, y: 42, label: 'HK' },
  Taiwan: { x: 78, y: 40, label: 'TW' },
  Mongolia: { x: 68, y: 22, label: 'MN' },
  Singapore: { x: 62, y: 62, label: 'SG' },
  Malaysia: { x: 60, y: 58, label: 'MY' },
  Thailand: { x: 58, y: 50, label: 'TH' },
  Philippines: { x: 76, y: 52, label: 'PH' },
  Indonesia: { x: 56, y: 68, label: 'ID' },
  Vietnam: { x: 62, y: 48, label: 'VN' },
  Cambodia: { x: 60, y: 52, label: 'KH' },
  Laos: { x: 60, y: 45, label: 'LA' },
  Brunei: { x: 64, y: 60, label: 'BN' },
  Myanmar: { x: 56, y: 44, label: 'MM' },
  India: { x: 42, y: 48, label: 'IN' },
  Bangladesh: { x: 48, y: 44, label: 'BD' },
  Pakistan: { x: 38, y: 40, label: 'PK' },
  Nepal: { x: 44, y: 38, label: 'NP' },
  'Sri Lanka': { x: 46, y: 58, label: 'LK' },
}

export default function WorldMap() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<SVGSVGElement>(null)

  const countryData = useMemo(() => {
    const data: Record<string, { count: number; region: string; color: string }> = {}
    products.forEach((p) => {
      if (!data[p.country]) {
        data[p.country] = { count: 0, region: getRegion(p.country) || 'Other', color: getRegionColor(p.country) }
      }
      data[p.country].count++
    })
    return data
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      gsap.from('.map-title', {
        scrollTrigger: { trigger: section, start: 'top 75%' },
        opacity: 0, y: 40, duration: 1, ease: 'power3.out',
      })

      gsap.from('.map-dot', {
        scrollTrigger: { trigger: mapRef.current, start: 'top 80%' },
        scale: 0,
        opacity: 0,
        duration: 0.6,
        stagger: 0.04,
        ease: 'back.out(1.7)',
        delay: 0.3,
      })

      gsap.from('.map-label', {
        scrollTrigger: { trigger: mapRef.current, start: 'top 80%' },
        opacity: 0,
        y: 10,
        duration: 0.4,
        stagger: 0.04,
        delay: 0.6,
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="map" className="w-full bg-[#0d0d0d] py-28">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8">
        <div className="map-title mb-14">
          <div className="flex items-center gap-3 mb-3">
            <MapPin className="w-4 h-4 text-[#888]" strokeWidth={1.5} />
            <p className="font-body text-[10px] uppercase tracking-[0.4em] text-[#888]">Coverage</p>
          </div>
          <h2 className="font-display text-5xl sm:text-6xl text-[#f0ece8] tracking-tight leading-[1.05]">
            The Map
          </h2>
          <p className="font-body text-sm text-[#888] mt-4 max-w-md">
            21 countries. Each dot represents a country in our archive. Size = number of products. Color = region.
          </p>
        </div>

        <div className="relative bg-[#141414] rounded-2xl border border-white/5 overflow-hidden">
          <svg ref={mapRef} viewBox="0 0 100 80" className="w-full h-auto" preserveAspectRatio="xMidYMid meet" style={{ color: '#8a8279' }}>
            {/* Subtle grid */}
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.1" />
              </pattern>
            </defs>
            <rect width="100" height="80" fill="url(#grid)" />

            {/* Asia continent outline — visible at proper opacity */}
            <path
              d="M 20 70 Q 25 60 30 55 Q 35 50 40 48 Q 45 45 50 40 Q 55 35 60 30 Q 65 25 70 20 Q 75 18 80 20 Q 85 22 88 28 Q 90 32 88 38 Q 86 42 82 45 Q 80 48 78 50 Q 76 52 76 55 Q 76 60 72 65 Q 68 70 62 72 Q 56 74 50 72 Q 44 70 38 68 Q 32 66 28 68 Q 24 70 20 70 Z"
              fill="rgba(240,236,232,0.06)"
              stroke="rgba(240,236,232,0.1)"
              strokeWidth="0.15"
            />

            {/* Country dots */}
            {Object.entries(countryPositions).map(([country, pos]) => {
              const data = countryData[country]
              if (!data) return null
              const radius = Math.max(1.2, Math.min(3, data.count * 0.8))
              return (
                <g key={country}>
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={radius}
                    fill={data.color}
                    opacity={0.9}
                    className="map-dot"
                  />
                  <text
                    x={pos.x}
                    y={pos.y + radius + 2.5}
                    textAnchor="middle"
                    className="map-label"
                    fill="#8a8279"
                    style={{ fontSize: '2.5px', fontFamily: 'monospace' }}
                  >
                    {pos.label}
                  </text>
                </g>
              )
            })}

            {/* Region legend */}
            <g transform="translate(5, 5)">
              {[
                { color: '#c4728e', label: 'East Asia' },
                { color: '#228b68', label: 'Southeast Asia' },
                { color: '#c85a32', label: 'South Asia' },
              ].map((item, i) => (
                <g key={item.label} transform={`translate(0, ${i * 4})`}>
                  <circle cx="1.5" cy="1.5" r="1.2" fill={item.color} opacity={0.85} />
                  <text x="4" y="2" fill="#8a8279" style={{ fontSize: '2.5px' }}>{item.label}</text>
                </g>
              ))}
            </g>
          </svg>
        </div>
      </div>
    </section>
  )
}
