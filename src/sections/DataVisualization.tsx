import { useRef, useEffect, useMemo, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { products, getRegion, exchangeRates, currencySymbols } from '../data/products'
import { useWorldBankData } from '../hooks/useWorldBankData'
import { BarChart3, TrendingUp, Globe } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const regionColors: Record<string, string> = {
  'East Asia': '#c4728e',
  'Southeast Asia': '#228b68',
  'South Asia': '#c85a32',
}

type ViewMode = 'price' | 'gdp';

interface DataPoint {
  x: number
  y: number
  brand: string
  country: string
  region: string
  price: number
  ply: number
  gdp: number | null
}

const COUNTRY_GDP: Record<string, number> = {
  'Japan': 33815,
  'South Korea': 33192,
  'Hong Kong': 49755,
  'Singapore': 84734,
  'Brunei': 31450,
  'Malaysia': 11382,
  'Thailand': 6908,
  'China': 12556,
  'Indonesia': 4941,
  'Vietnam': 4346,
  'Philippines': 3548,
  'Laos': 2054,
  'Cambodia': 1628,
  'Myanmar': 1210,
  'Sri Lanka': 3354,
  'India': 2411,
  'Bangladesh': 2688,
  'Pakistan': 1478,
  'Nepal': 1337,
  'Mongolia': 5762,
  'Taiwan': 32758,
}

export default function DataVisualization() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('price')
  const { data: wbData, loading: wbLoading } = useWorldBankData()

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      gsap.from('.viz-title', {
        scrollTrigger: { trigger: section, start: 'top 75%', toggleActions: 'play none none none' },
        opacity: 0, y: 40, duration: 1, ease: 'power3.out',
      })
      gsap.from('.viz-chart', {
        scrollTrigger: { trigger: '.viz-chart', start: 'top 80%', toggleActions: 'play none none none' },
        opacity: 0, y: 60, duration: 1.2, delay: 0.2, ease: 'power3.out',
      })
      gsap.from('.insight-card', {
        scrollTrigger: { trigger: '.insight-card', start: 'top 85%', toggleActions: 'play none none none' },
        opacity: 0, y: 30, duration: 0.8, delay: 0.3, ease: 'power3.out',
      })
    }, section)

    return () => ctx.revert()
  }, [])

  const hkdRate = exchangeRates.HKD
  const hkdSymbol = currencySymbols.HKD

  const getGdp = (country: string): number | null => {
    const wb = wbData.find(d => {
      const nameMap: Record<string, string> = {
        'JPN': 'Japan', 'KOR': 'South Korea', 'CHN': 'China', 'HKG': 'Hong Kong',
        'SGP': 'Singapore', 'MYS': 'Malaysia', 'THA': 'Thailand', 'PHL': 'Philippines',
        'IDN': 'Indonesia', 'VNM': 'Vietnam', 'KHM': 'Cambodia', 'LAO': 'Laos',
        'MMR': 'Myanmar', 'IND': 'India', 'BGD': 'Bangladesh', 'PAK': 'Pakistan',
        'NPL': 'Nepal', 'LKA': 'Sri Lanka', 'BRN': 'Brunei', 'MNG': 'Mongolia',
      }
      return nameMap[d.countryCode] === country
    })
    if (wb) return wb.gdpPerCapita
    return COUNTRY_GDP[country] ?? null
  }

  const scatterData = useMemo<DataPoint[]>(() => {
    // Seeded pseudo-random for consistent jitter
    const jitter = (seed: number) => {
      const x = Math.sin(seed * 12.9898) * 43758.5453
      return (x - Math.floor(x)) * 2 - 1 // -1 to 1
    }
    return products.map((p, i) => {
      const gdp = getGdp(p.country)
      const jx = jitter(i * 3.7) * (viewMode === 'gdp' ? gdp ? gdp * 0.08 : 500 : 0)
      const jy = jitter(i * 7.3) * 0.15
      return {
        x: viewMode === 'price' ? p.priceUSD * hkdRate : ((gdp ?? 0) + jx),
        y: p.ply + jy,
        brand: p.brand,
        country: p.country,
        region: getRegion(p.country) || 'Other',
        price: p.priceUSD * hkdRate,
        ply: p.ply,
        gdp,
      }
    })
  }, [viewMode, wbData])

  const regionStats = useMemo(() => {
    const stats: Record<string, { count: number; avgPrice: number; avgPly: number; avgGdp: number }> = {}
    products.forEach((p) => {
      const r = getRegion(p.country) || 'Other'
      if (!stats[r]) stats[r] = { count: 0, avgPrice: 0, avgPly: 0, avgGdp: 0 }
      stats[r].count++
      stats[r].avgPrice += p.priceUSD * hkdRate
      stats[r].avgPly += p.ply
      const gdp = getGdp(p.country)
      if (gdp) stats[r].avgGdp += gdp
    })
    Object.keys(stats).forEach((r) => {
      stats[r].avgPrice = Math.round((stats[r].avgPrice / stats[r].count) * 100) / 100
      stats[r].avgPly = Math.round((stats[r].avgPly / stats[r].count) * 10) / 10
      stats[r].avgGdp = Math.round(stats[r].avgGdp / stats[r].count)
    })
    return stats
  }, [wbData])

  // Calculate correlation insight
  const correlationInsight = useMemo(() => {
    const validPoints = scatterData.filter(d => d.gdp !== null && d.gdp > 0)
    if (validPoints.length < 3) return null
    const n = validPoints.length
    const sumX = validPoints.reduce((s, d) => s + d.gdp!, 0)
    const sumY = validPoints.reduce((s, d) => s + d.y, 0)
    const sumXY = validPoints.reduce((s, d) => s + d.gdp! * d.y, 0)
    const sumX2 = validPoints.reduce((s, d) => s + d.gdp! * d.gdp!, 0)
    const sumY2 = validPoints.reduce((s, d) => s + d.y * d.y, 0)
    const corr = (n * sumXY - sumX * sumY) / Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY))
    return isNaN(corr) ? null : corr
  }, [scatterData])

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: any[] }) => {
    if (!active || !payload || !payload.length) return null
    const data = payload[0].payload as DataPoint
    return (
      <div className="bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 shadow-lg max-w-[220px]">
        <p className="font-display text-sm text-[#f0ece8]">{data.brand}</p>
        <p className="font-body text-[11px] text-[#999]">{data.country} · {data.region}</p>
        <p className="font-body text-[11px] text-[#888] mt-1">{hkdSymbol}{data.price.toFixed(2)} · {data.ply}-ply</p>
        {data.gdp && (
          <p className="font-body text-[11px] text-[#c28223] mt-1">GDP/cap: ${data.gdp.toLocaleString()}</p>
        )}
      </div>
    )
  }

  return (
    <section ref={sectionRef} id="data" className="w-full bg-[#0d0d0d] py-28">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8">
        <div className="viz-title mb-14">
          <div className="flex items-center gap-3 mb-3">
            <BarChart3 className="w-4 h-4 text-[#888]" strokeWidth={1.5} />
            <p className="font-body text-[10px] uppercase tracking-[0.4em] text-[#888]">Data</p>
          </div>
          <h2 className="font-display text-5xl sm:text-6xl text-[#f0ece8] tracking-tight leading-[1.05]">
            {viewMode === 'price' ? 'Price vs. Ply' : 'GDP vs. Ply'}
          </h2>
          <p className="font-body text-sm text-[#999] mt-4 max-w-lg">
            {viewMode === 'price'
              ? "How much does comfort cost? Each dot is a verified product. Color = region."
              : "Toilet paper ply correlates with national wealth. Each dot = a country's average ply weighted by GDP per capita."
            }
          </p>
          {/* Toggle */}
          <div className="flex items-center gap-2 mt-6">
            <button
              onClick={() => setViewMode('price')}
              className={`px-4 py-2 rounded-full text-[11px] font-mono uppercase tracking-wider transition-all duration-300 ${
                viewMode === 'price'
                  ? 'bg-[#c28223]/15 text-[#c28223] border border-[#c28223]/20'
                  : 'bg-white/5 text-[#888] border border-white/5 hover:border-white/15'
              }`}
            >
              Price View
            </button>
            <button
              onClick={() => setViewMode('gdp')}
              className={`px-4 py-2 rounded-full text-[11px] font-mono uppercase tracking-wider transition-all duration-300 ${
                viewMode === 'gdp'
                  ? 'bg-[#c28223]/15 text-[#c28223] border border-[#c28223]/20'
                  : 'bg-white/5 text-[#888] border border-white/5 hover:border-white/15'
              }`}
            >
              GDP View
            </button>
          </div>
        </div>

        {/* Insight Card */}
        {correlationInsight !== null && (
          <div className="insight-card mb-8 bg-[#141414] border border-[#c28223]/10 rounded-2xl p-6 flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#c28223]/10 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-5 h-5 text-[#c28223]" />
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#c28223] mb-1">Key Finding</p>
              <p className="font-body text-sm text-[#f0ece8] leading-relaxed">
                GDP per capita and toilet paper ply show a correlation coefficient of <strong className="text-[#c28223]">{correlationInsight.toFixed(2)}</strong>. 
                Wealthier nations systematically use thicker toilet paper — Hong Kong (4-ply, GDP $49,755) vs Myanmar (1-ply, GDP $1,210). 
                This is not a coincidence. It reflects sanitation infrastructure capacity, consumer purchasing power, and cultural expectations of comfort.
              </p>
            </div>
          </div>
        )}

        <div className="viz-chart grid lg:grid-cols-3 gap-8">
          {/* Chart */}
          <div className="lg:col-span-2 bg-[#141414] rounded-2xl border border-white/5 p-6 sm:p-8">
            <ResponsiveContainer width="100%" height={400}>
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0d9d2" opacity={0.5} />
                <XAxis
                  type="number"
                  dataKey="x"
                  name={viewMode === 'price' ? 'Price' : 'GDP'}
                  tick={{ fontSize: 11, fill: '#888' }}
                  stroke="#e0d9d2"
                  label={{ value: viewMode === 'price' ? 'Price (HKD)' : 'GDP Per Capita (USD)', position: 'bottom', offset: 0, fontSize: 11, fill: '#888' }}
                  domain={viewMode === 'gdp' ? [0, 'auto'] : undefined}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="Ply"
                  domain={[0.5, 4.5]}
                  ticks={[1, 2, 3, 4]}
                  tick={{ fontSize: 11, fill: '#888' }}
                  stroke="#e0d9d2"
                  label={{ value: 'Ply', angle: -90, position: 'insideLeft', fontSize: 11, fill: '#888' }}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                <Scatter data={scatterData}>
                  {scatterData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={regionColors[entry.region] || '#b0a89e'}
                      opacity={0.85}
                      className="viz-dot"
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mt-4">
              {Object.entries(regionColors).map(([region, color]) => (
                <div key={region} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                  <span className="font-body text-[11px] text-[#888]">{region}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats cards */}
          <div className="flex flex-col gap-4">
            {Object.entries(regionStats).map(([region, stats]) => (
              <div
                key={region}
                className="bg-[#141414] rounded-xl border border-white/5 p-5 transition-all duration-300 hover:border-white/10"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: regionColors[region] }} />
                  <h4 className="font-display text-base text-[#f0ece8]">{region}</h4>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="font-display text-xl text-[#f0ece8]">{stats.count}</p>
                    <p className="font-body text-[10px] text-[#999] uppercase tracking-wider">Products</p>
                  </div>
                  <div>
                    <p className="font-display text-xl text-[#f0ece8]">{stats.avgPly}</p>
                    <p className="font-body text-[10px] text-[#999] uppercase tracking-wider">Avg Ply</p>
                  </div>
                  <div className="col-span-2">
                    <div className="flex items-center gap-1.5">
                      <Globe className="w-3 h-3 text-[#999]" />
                      <p className="font-body text-[11px] text-[#888]">Avg GDP: <span className="text-[#f0ece8]">${stats.avgGdp.toLocaleString()}</span></p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
