import { useRef, useEffect, useMemo } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { products, getRegion } from '../data/products'
import { BarChart3 } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const regionColors: Record<string, string> = {
  'East Asia': '#c4728e',
  'Southeast Asia': '#228b68',
  'South Asia': '#c85a32',
}

interface DataPoint {
  x: number
  y: number
  brand: string
  country: string
  region: string
  price: number
  ply: number
}

export default function DataVisualization() {
  const sectionRef = useRef<HTMLDivElement>(null)

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
    }, section)

    return () => ctx.revert()
  }, [])

  const scatterData = useMemo<DataPoint[]>(() => {
    return products.map((p) => ({
      x: p.priceUSD,
      y: p.ply,
      brand: p.brand,
      country: p.country,
      region: getRegion(p.country) || 'Other',
      price: p.priceUSD,
      ply: p.ply,
    }))
  }, [])

  const regionStats = useMemo(() => {
    const stats: Record<string, { count: number; avgPrice: number; avgPly: number }> = {}
    products.forEach((p) => {
      const r = getRegion(p.country) || 'Other'
      if (!stats[r]) stats[r] = { count: 0, avgPrice: 0, avgPly: 0 }
      stats[r].count++
      stats[r].avgPrice += p.priceUSD
      stats[r].avgPly += p.ply
    })
    Object.keys(stats).forEach((r) => {
      stats[r].avgPrice = Math.round((stats[r].avgPrice / stats[r].count) * 100) / 100
      stats[r].avgPly = Math.round((stats[r].avgPly / stats[r].count) * 10) / 10
    })
    return stats
  }, [])

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: any[] }) => {
    if (!active || !payload || !payload.length) return null
    const data = payload[0].payload as DataPoint
    return (
      <div className="bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 shadow-lg">
        <p className="font-display text-sm text-[#f0ece8]">{data.brand}</p>
        <p className="font-body text-[11px] text-[#999]">{data.country} · {data.region}</p>
        <p className="font-body text-[11px] text-[#888] mt-1">${data.price} · {data.ply}-ply</p>
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
            Price vs. Ply
          </h2>
          <p className="font-body text-sm text-[#999] mt-4 max-w-md">
            How much does comfort cost? Each dot is a verified product. Color = region.
          </p>
        </div>

        <div className="viz-chart grid lg:grid-cols-3 gap-8">
          {/* Chart */}
          <div className="lg:col-span-2 bg-[#141414] rounded-2xl border border-white/5 p-6 sm:p-8">
            <ResponsiveContainer width="100%" height={400}>
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0d9d2" opacity={0.5} />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="Price"
                  unit=" USD"
                  tick={{ fontSize: 11, fill: '#888' }}
                  stroke="#e0d9d2"
                  label={{ value: 'Price (USD)', position: 'bottom', offset: 0, fontSize: 11, fill: '#888' }}
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
                    <Cell key={`cell-${index}`} fill={regionColors[entry.region] || '#b0a89e'} opacity={0.85} />
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
                className="bg-[#141414] rounded-xl border border-white/5 p-5"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: regionColors[region] }} />
                  <h4 className="font-display text-base text-[#f0ece8]">{region}</h4>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <p className="font-display text-xl text-[#f0ece8]">{stats.count}</p>
                    <p className="font-body text-[10px] text-[#999] uppercase tracking-wider">Products</p>
                  </div>
                  <div>
                    <p className="font-display text-xl text-[#f0ece8]">${stats.avgPrice}</p>
                    <p className="font-body text-[10px] text-[#999] uppercase tracking-wider">Avg Price</p>
                  </div>
                  <div>
                    <p className="font-display text-xl text-[#f0ece8]">{stats.avgPly}</p>
                    <p className="font-body text-[10px] text-[#999] uppercase tracking-wider">Avg Ply</p>
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
