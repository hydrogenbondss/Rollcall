import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { AlertTriangle, Calendar, Skull } from 'lucide-react'
import { products } from '../data/products'
import { Link } from 'react-router'

gsap.registerPlugin(ScrollTrigger)

export default function ExtinctSpecimens() {
  const sectionRef = useRef<HTMLDivElement>(null)

  const extinctProducts = products.filter(
    (p) => p.archivalStatus === 'extinct' || p.archivalStatus === 'discontinued'
  )

  useEffect(() => {
    const section = sectionRef.current
    if (!section || extinctProducts.length === 0) return
    const ctx = gsap.context(() => {
      gsap.from('.extinct-header', { scrollTrigger: { trigger: section, start: 'top 75%' }, opacity: 0, y: 40, duration: 1, ease: 'power3.out' })
      gsap.from('.extinct-card', { scrollTrigger: { trigger: '.extinct-grid', start: 'top 80%' }, opacity: 0, y: 30, duration: 0.8, stagger: 0.15, ease: 'power3.out' })
    }, section)
    return () => ctx.revert()
  }, [extinctProducts.length])

  if (extinctProducts.length === 0) return null

  return (
    <section ref={sectionRef} className="w-full bg-[#0a0a0a] py-28">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8">
        <div className="extinct-header mb-14">
          <div className="flex items-center gap-3 mb-3">
            <Skull className="w-4 h-4 text-[#c85a32]" strokeWidth={1.5} />
            <p className="font-body text-[10px] uppercase tracking-[0.4em] text-[#c85a32]">Lost to Time</p>
          </div>
          <h2 className="font-display text-5xl sm:text-6xl text-[#f0ece8] tracking-tight leading-[1.05] mb-4">
            Extinct Specimens
          </h2>
          <p className="font-body text-sm text-[#999] max-w-2xl leading-relaxed">
            Specimens marked as <strong className="text-[#c85a32]">extinct</strong> (manufacturer ceased, product discontinued, no longer in circulation) 
            or <strong className="text-[#c28223]">discontinued</strong> (reformulated, rebranded, or packaging retired) as of 2026. 
            These are the products that left the market during our documentation period.
          </p>
        </div>

        <div className="extinct-grid space-y-6">
          {extinctProducts.map((product) => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="extinct-card group block bg-[#141414] border border-white/[0.04] rounded-2xl overflow-hidden hover:border-[#c85a32]/20 transition-all duration-500"
            >
              <div className="grid md:grid-cols-[200px_1fr] gap-0">
                {/* Real product image */}
                <div className="relative h-48 md:h-auto bg-[#e0e0e0] overflow-hidden flex-shrink-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain p-6 opacity-90 group-hover:opacity-100 group-hover:scale-[1.02] transition-all duration-500"
                    loading="lazy"
                  />
                  {/* Status overlay */}
                  <div className="absolute top-4 left-4">
                    <span className={`inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-full ${
                      product.archivalStatus === 'extinct'
                        ? 'bg-[#8b2500]/80 text-white border border-[#8b2500]'
                        : 'bg-[#c28223]/80 text-white border border-[#c28223]'
                    }`}>
                      {product.archivalStatus === 'extinct' ? (
                        <AlertTriangle className="w-3 h-3" />
                      ) : null}
                      {product.archivalStatus}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-[10px] tracking-[0.2em] text-[#888]">{product.id.toUpperCase()}</span>
                    <span className="w-1 h-1 rounded-full bg-[#555]" />
                    <span className="font-body text-[10px] text-[#888]">{product.country}</span>
                  </div>
                  <h3 className="font-display text-2xl text-[#f0ece8] mb-2 group-hover:text-[#c85a32] transition-colors">
                    {product.brand} — {product.name}
                  </h3>
                  {product.collectorNote && (
                    <p className="font-body text-[13px] text-[#a09890] leading-relaxed italic mb-4 max-w-xl">
                      &ldquo;{product.collectorNote}&rdquo;
                    </p>
                  )}
                  <div className="flex flex-wrap gap-4">
                    {product.acquisitionDate && (
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 text-[#999]" />
                        <span className="font-mono text-[10px] text-[#999]">Acquired {product.acquisitionDate}</span>
                      </div>
                    )}
                    {product.lastObserved && (
                      <div className="flex items-center gap-1.5">
                        <AlertTriangle className="w-3 h-3 text-[#c85a32]" />
                        <span className="font-mono text-[10px] text-[#c85a32]">Last observed {product.lastObserved}</span>
                      </div>
                    )}
                    {product.rarity && (
                      <span className="font-mono text-[10px] text-[#888] capitalize">Rarity: {product.rarity}</span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
