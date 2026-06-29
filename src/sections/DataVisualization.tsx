import { useRef, useEffect, useMemo, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { products, getRegion } from '../data/products'
import { BarChart3, TrendingUp } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const regionColors: Record<string, string> = {
  'East Asia': '#c4728e',
  'Southeast Asia': '#228b68',
  'South Asia': '#c85a32',
}

const COUNTRY_GDP: Record<string, number> = {
  'Japan': 33815, 'South Korea': 33192, 'Hong Kong': 49755, 'Singapore': 84734,
  'Brunei': 31450, 'Malaysia': 11382, 'Thailand': 6908, 'China': 12556,
  'Indonesia': 4941, 'Vietnam': 4346, 'Philippines': 3548, 'Laos': 2054,
  'Cambodia': 1628, 'Myanmar': 1210, 'Sri Lanka': 3354, 'India': 2411,
  'Bangladesh': 2688, 'Pakistan': 1478, 'Nepal': 1337, 'Mongolia': 5762,
  'Taiwan': 32758,
}

type ViewMode = 'price' | 'gdp'

export default function DataVisualization() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('price')
  const [tooltip, setTooltip] = useState<{x: number, y: number, product: typeof products[0], gdp: number | null} | null>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const ctx = gsap.context(() => {
      // fromTo (not from) with a guaranteed opacity:1 end state + once, so the
      // chart can never be stranded invisible if the trigger is re-evaluated.
      gsap.fromTo('.viz-title', { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: section, start: 'top 90%', once: true },
      })
      gsap.fromTo('.viz-chart', { opacity: 0, y: 60 }, {
        opacity: 1, y: 0, duration: 1.2, delay: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: '.viz-chart', start: 'top 90%', once: true },
      })
      ScrollTrigger.refresh()
    }, section)
    return () => ctx.revert()
  }, [])

  const hkdRate = 7.8

  // Chart dimensions
  const chartWidth = 600
  const chartHeight = 400
  const padding = { top: 30, right: 30, bottom: 50, left: 50 }
  const plotWidth = chartWidth - padding.left - padding.right
  const plotHeight = chartHeight - padding.top - padding.bottom

  // Get X value based on view mode
  const getX = (p: typeof products[0]) => {
    if (viewMode === 'price') return p.priceUSD * hkdRate
    return COUNTRY_GDP[p.country] || 0
  }

  // Min/max for scaling
  const xValues = products.map(getX)
  const xMin = Math.min(...xValues) * 0.8
  const xMax = Math.max(...xValues) * 1.1
  const yMin = 0.5
  const yMax = 4.5

  // Scale functions
  const scaleX = (v: number) => padding.left + ((v - xMin) / (xMax - xMin)) * plotWidth
  const scaleY = (v: number) => padding.top + plotHeight - ((v - yMin) / (yMax - yMin)) * plotHeight

  // Grid lines
  const xTicks = viewMode === 'price'
    ? [0, 50, 100, 150, 200]
    : [0, 10000, 20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000]
  const yTicks = [1, 2, 3, 4]

  // Correlation
  const gdpValues = products.map(p => COUNTRY_GDP[p.country] || 0).filter(g => g > 0)
  const plyValues = products.map(p => p.ply)
  const n = gdpValues.length
  const avgGdp = gdpValues.reduce((a, b) => a + b, 0) / n
  const avgPly = plyValues.reduce((a, b) => a + b, 0) / n
  const num = gdpValues.reduce((s, g, i) => s + (g - avgGdp) * (plyValues[i] - avgPly), 0)
  const den = Math.sqrt(gdpValues.reduce((s, g) => s + (g - avgGdp) ** 2, 0) * plyValues.reduce((s, p) => s + (p - avgPly) ** 2, 0))
  const correlation = den > 0 ? num / den : 0

  const regionStats = useMemo(() => {
    const stats: Record<string, { count: number; avgPrice: number; avgPly: number; avgGdp: number }> = {}
    products.forEach((p) => {
      const r = getRegion(p.country) || 'Other'
      if (!stats[r]) stats[r] = { count: 0, avgPrice: 0, avgPly: 0, avgGdp: 0 }
      stats[r].count++
      stats[r].avgPrice += p.priceUSD * hkdRate
      stats[r].avgPly += p.ply
      const gdp = COUNTRY_GDP[p.country]
      if (gdp) stats[r].avgGdp += gdp
    })
    Object.keys(stats).forEach((r) => {
      stats[r].avgPrice = Math.round((stats[r].avgPrice / stats[r].count) * 100) / 100
      stats[r].avgPly = Math.round((stats[r].avgPly / stats[r].count) * 10) / 10
      stats[r].avgGdp = Math.round(stats[r].avgGdp / stats[r].count)
    })
    return stats
  }, [])

  return (
    <section ref={sectionRef} id="data" className="w-full bg-[#0d0d0d] py-28">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8">
        <div className="viz-title mb-14">
          <div className="flex items-center gap-3 mb-3">
            <BarChart3 className="w-4 h-4 text-[#a8a29a]" strokeWidth={1.5} />
            <p className="font-body text-[10px] uppercase tracking-[0.4em] text-[#a8a29a]">Data</p>
          </div>
          <h2 className="font-display text-5xl sm:text-6xl text-[#f0ece8] tracking-tight leading-[1.05]">
            {viewMode === 'price' ? 'Price vs. Ply' : 'GDP vs. Ply'}
          </h2>
          <p className="font-body text-sm text-[#a8a29a] mt-4 max-w-lg">
            {viewMode === 'price'
              ? "How much does comfort cost? Each dot is a verified product. Color = region. X-axis = price in HKD."
              : "Wealthier nations use thicker paper. Each dot = one product positioned by its country's GDP per capita. X-axis = USD."
            }
          </p>
          <div className="flex items-center gap-2 mt-6">
            <button onClick={() => setViewMode('price')} className={`px-4 py-2 rounded-full text-[11px] font-mono uppercase tracking-wider transition-all ${viewMode === 'price' ? 'bg-[#c28223]/15 text-[#c28223] border border-[#c28223]/20' : 'bg-white/5 text-[#a8a29a] border border-white/5 hover:border-white/15'}`}>Price View</button>
            <button onClick={() => setViewMode('gdp')} className={`px-4 py-2 rounded-full text-[11px] font-mono uppercase tracking-wider transition-all ${viewMode === 'gdp' ? 'bg-[#c28223]/15 text-[#c28223] border border-[#c28223]/20' : 'bg-white/5 text-[#a8a29a] border border-white/5 hover:border-white/15'}`}>GDP View</button>
          </div>
        </div>

        {viewMode === 'gdp' && (
          <div className="insight-card mb-8 bg-[#141414] border border-[#c28223]/10 rounded-2xl p-6 flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#c28223]/10 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-5 h-5 text-[#c28223]" />
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#c28223] mb-1">Key Finding</p>
              <p className="font-body text-sm text-[#f0ece8] leading-relaxed">
                GDP per capita and toilet paper ply show a correlation of <strong className="text-[#c28223]">{correlation.toFixed(2)}</strong>.
                {" "}Wealthier nations systematically use thicker, softer toilet paper — Singapore (4-ply, GDP $84,734) vs Myanmar (1-ply, GDP $1,210).
              </p>
            </div>
          </div>
        )}

        <div className="viz-chart grid lg:grid-cols-3 gap-8">
          {/* SVG Chart */}
          <div className="lg:col-span-2 bg-[#141414] rounded-2xl border border-white/5 p-6 sm:p-8 relative">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto" style={{ maxHeight: 450 }}>
              {/* Grid */}
              {xTicks.map(t => (
                <line key={`xgrid-${t}`} x1={scaleX(t)} y1={padding.top} x2={scaleX(t)} y2={padding.top + plotHeight} stroke="rgba(255,255,255,0.05)" strokeDasharray="3,3" />
              ))}
              {yTicks.map(t => (
                <line key={`ygrid-${t}`} x1={padding.left} y1={scaleY(t)} x2={padding.left + plotWidth} y2={scaleY(t)} stroke="rgba(255,255,255,0.05)" strokeDasharray="3,3" />
              ))}
              {/* Axes */}
              <line x1={padding.left} y1={padding.top + plotHeight} x2={padding.left + plotWidth} y2={padding.top + plotHeight} stroke="rgba(255,255,255,0.15)" />
              <line x1={padding.left} y1={padding.top} x2={padding.left} y2={padding.top + plotHeight} stroke="rgba(255,255,255,0.15)" />
              {/* X ticks */}
              {xTicks.filter(t => t >= xMin && t <= xMax).map(t => (
                <g key={`xtick-${t}`}>
                  <text x={scaleX(t)} y={padding.top + plotHeight + 20} textAnchor="middle" fill="#888" fontSize="10" fontFamily="monospace">
                    {viewMode === 'price' ? (t === 0 ? '0' : `${t}`) : t >= 1000 ? `${(t / 1000).toFixed(0)}k` : `${t}`}
                  </text>
                </g>
              ))}
              {/* Y ticks */}
              {yTicks.map(t => (
                <g key={`ytick-${t}`}>
                  <text x={padding.left - 12} y={scaleY(t) + 4} textAnchor="end" fill="#888" fontSize="10" fontFamily="monospace">{t}</text>
                </g>
              ))}
              {/* Axis labels */}
              <text x={padding.left + plotWidth / 2} y={chartHeight - 8} textAnchor="middle" fill="#888" fontSize="11" fontFamily="monospace">
                {viewMode === 'price' ? 'Price (HKD)' : 'GDP Per Capita (USD)'}
              </text>
              <text x={15} y={padding.top + plotHeight / 2} textAnchor="middle" fill="#888" fontSize="11" fontFamily="monospace" transform={`rotate(-90, 15, ${padding.top + plotHeight / 2})`}>Ply</text>

              {/* Dots */}
              {products.map((p, i) => {
                const x = getX(p)
                const y = p.ply
                const region = getRegion(p.country) || 'Other'
                const color = regionColors[region] || '#888'
                const gdp = COUNTRY_GDP[p.country] || null
                // Jitter for GDP view
                const jx = viewMode === 'gdp' ? (Math.sin(i * 12.9898) * 43758.5453 % 1 - 0.5) * 30 : 0
                const jy = viewMode === 'gdp' ? (Math.cos(i * 7.3) * 100 % 1 - 0.5) * 0.15 : 0

                return (
                  <circle
                    key={p.id}
                    cx={scaleX(x + jx)}
                    cy={scaleY(y + jy)}
                    r={6}
                    fill={color}
                    opacity={0.85}
                    className="cursor-pointer transition-all duration-200"
                    onMouseEnter={() => setTooltip({ x: scaleX(x + jx), y: scaleY(y + jy), product: p, gdp })}
                    onMouseLeave={() => setTooltip(null)}
                    style={{ filter: tooltip?.product.id === p.id ? 'brightness(1.4)' : 'none' }}
                  />
                )
              })}
            </svg>

            {/* HTML Tooltip */}
            {tooltip && (
              <div className="absolute z-10 pointer-events-none" style={{
                left: `${(tooltip.x / chartWidth) * 100}%`,
                top: `${(tooltip.y / chartHeight) * 100}%`,
                transform: 'translate(-50%, -130%)',
              }}>
                <div className="bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 shadow-2xl whitespace-nowrap">
                  <p className="font-display text-sm text-[#f0ece8]">{tooltip.product.brand}</p>
                  <p className="font-body text-[11px] text-[#a8a29a]">{tooltip.product.country} · {tooltip.product.ply}-ply</p>
                  <p className="font-body text-[11px] text-[#a8a29a] mt-0.5">HK${(tooltip.product.priceUSD * hkdRate).toFixed(2)}</p>
                  {tooltip.gdp && (
                    <p className="font-body text-[11px] text-[#c28223] mt-0.5">GDP: ${tooltip.gdp.toLocaleString()}</p>
                  )}
                </div>
              </div>
            )}

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mt-2">
              {Object.entries(regionColors).map(([region, color]) => (
                <div key={region} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                  <span className="font-body text-[11px] text-[#a8a29a]">{region}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-col gap-4">
            {Object.entries(regionStats).map(([region, stats]) => (
              <div key={region} className="bg-[#141414] rounded-xl border border-white/5 p-5 hover:border-white/10 transition-all">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: regionColors[region] }} />
                  <h4 className="font-display text-base text-[#f0ece8]">{region}</h4>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><p className="font-display text-xl text-[#f0ece8]">{stats.count}</p><p className="font-body text-[10px] text-[#a8a29a] uppercase tracking-wider">Products</p></div>
                  <div><p className="font-display text-xl text-[#f0ece8]">{stats.avgPly}</p><p className="font-body text-[10px] text-[#a8a29a] uppercase tracking-wider">Avg Ply</p></div>
                  {viewMode === 'gdp' && (
                    <div className="col-span-2"><p className="font-body text-[11px] text-[#a8a29a]">Avg GDP: <span className="text-[#f0ece8]">${stats.avgGdp.toLocaleString()}</span></p></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
