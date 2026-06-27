import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link } from 'react-router'
import { Star, ArrowRight } from 'lucide-react'
import { products, getRegion, getRegionColor } from '../data/products'
import { useCurrency } from '../contexts/CurrencyContext'

gsap.registerPlugin(ScrollTrigger)

const featuredIds = ['paseo-kingsize', 'andrex-ultimate', 'nepia-oshiri-celeb', 'cellox-purify', 'premier-sg']

export default function FeaturedRolls() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const { formatPrice } = useCurrency()

  const featured = products.filter((p) => featuredIds.includes(p.id))

  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return

    const ctx = gsap.context(() => {
      gsap.from('.featured-title', {
        scrollTrigger: { trigger: section, start: 'top 75%' },
        opacity: 0, y: 40, duration: 1, ease: 'power3.out',
      })

      // Horizontal scroll animation
      const totalWidth = track.scrollWidth - track.clientWidth
      if (totalWidth > 0) {
        gsap.to(track, {
          x: -totalWidth,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top 20%',
            end: () => `+=${totalWidth}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
          },
        })
      }
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="w-full bg-[#050505] py-28 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8 mb-12">
        <div className="featured-title flex items-end justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-4 h-4 text-[#c28223]" strokeWidth={1.5} />
              <p className="font-body text-[10px] uppercase tracking-[0.4em] text-white/30">Curated</p>
            </div>
            <h2 className="font-display text-5xl sm:text-6xl text-white/90 tracking-tight leading-[1.05]">
              Featured Rolls
            </h2>
            <p className="font-body text-sm text-white/40 mt-4 max-w-md">
              Five products that represent the extremes of the archive — luxury, innovation, and cultural significance.
            </p>
          </div>
          <Link
            to="/collection"
            className="hidden sm:flex items-center gap-2 font-body text-sm text-white/40 hover:text-white/70 transition-colors"
          >
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <div ref={trackRef} className="flex gap-6 pl-6 sm:pl-[max(1.5rem,calc((100vw-1200px)/2+1.5rem))] pr-24 will-change-transform">
        {featured.map((product) => {
          const region = getRegion(product.country) || ''
          const color = getRegionColor(product.country)
          return (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="group flex-shrink-0 w-[320px] sm:w-[380px]"
            >
              <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm">
                <div className="absolute top-0 left-0 right-0 h-[2px] z-10" style={{ backgroundColor: color, opacity: 0.7 }} />
                <div className="aspect-[4/3] overflow-hidden bg-white/5">
                  <img
                    src={product.image}
                    alt={`${product.brand} ${product.name}`}
                    className="w-full h-full object-contain p-8 transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-body text-[9px] uppercase tracking-[0.25em] text-white/40">{product.brand}</p>
                    <p className="font-body text-[9px] text-white/30">{product.country}</p>
                  </div>
                  <h3 className="font-body text-[13px] font-medium text-white/80 leading-snug line-clamp-2 mb-3">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <p className="font-display text-[15px] text-white/90">{formatPrice(product.priceUSD)}</p>
                    <span className="font-body text-[10px] text-white/40 bg-white/10 px-2 py-1 rounded">{product.ply}-ply</span>
                  </div>
                  <p className="font-body text-[10px] text-white/25 mt-2">{region}</p>
                </div>
                <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.02) 100%)',
                }} />
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
