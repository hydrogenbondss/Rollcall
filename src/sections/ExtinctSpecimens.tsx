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
    if (!section) return
    const ctx = gsap.context(() => {
      gsap.from('.extinct-header', {
        scrollTrigger: { trigger: section, start: 'top 75%' },
        opacity: 0, y: 40, duration: 1, ease: 'power3.out',
      })
      gsap.from('.extinct-card', {
        scrollTrigger: { trigger: '.extinct-grid', start: 'top 80%' },
        opacity: 0, y: 30, duration: 0.8, stagger: 0.15, ease: 'power3.out',
      })
    }, section)
    return () => ctx.revert()
  }, [])

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
            Products that left the market during our documentation period (2025–2026). 
            <strong className="text-[#c85a32]"> Extinct</strong> = manufacturer ceased operations, product no longer manufactured. 
            <strong className="text-[#c28223]"> Discontinued</strong> = reformulated, rebranded, or packaging retired by the manufacturer.
          </p>
        </div>

        {extinctProducts.length === 0 ? (
          <p className="font-body text-sm text-[#888] text-center py-16">
            No specimens currently marked as extinct or discontinued.
          </p>
        ) : (
          <div className="extinct-grid space-y-6">
            {extinctProducts.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="extinct-card group block bg-[#141414] border border-white/[0.04] rounded-2xl overflow-hidden hover:border-[#c85a32]/20 transition-all duration-500"
              >
                <div className="p-6 sm:p-8">
                  <div className="flex items-start gap-6">
                    {/* Product image */}
                    <div className="w-32 h-32 sm:w-40 sm:h-40 bg-[#e0e0e0] rounded-xl flex-shrink-0 overflow-hidden flex items-center justify-center">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain p-4 opacity-90 group-hover:opacity-100 group-hover:scale-[1.03] transition-all duration-500"
                        loading="lazy"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <span className={`inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          product.archivalStatus === 'extinct'
                            ? 'bg-[#8b2500]/15 text-[#c85a32] border border-[#8b2500]/20'
                            : 'bg-[#c28223]/10 text-[#c28223] border border-[#c28223]/15'
                        }`}>
                          {product.archivalStatus === 'extinct' && <AlertTriangle className="w-3 h-3" />}
                          {product.archivalStatus}
                        </span>
                        <span className="font-mono text-[10px] tracking-[0.2em] text-[#888]">{product.id.toUpperCase()}</span>
                        <span className="font-body text-[10px] text-[#888]">{product.country}</span>
                      </div>

                      <h3 className="font-display text-xl sm:text-2xl text-[#f0ece8] mb-2 group-hover:text-[#c85a32] transition-colors">
                        {product.brand} — {product.name}
                      </h3>

                      {product.collectorNote && (
                        <p className="font-body text-[13px] text-[#a09890] leading-relaxed italic mb-3">
                          &ldquo;{product.collectorNote}&rdquo;
                        </p>
                      )}

                      <div className="flex flex-wrap gap-4">
                        {product.acquisitionDate && (
                          <span className="font-mono text-[10px] text-[#999] flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> Acquired {product.acquisitionDate}
                          </span>
                        )}
                        {product.lastObserved && (
                          <span className="font-mono text-[10px] text-[#c85a32] flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> Last observed {product.lastObserved}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
