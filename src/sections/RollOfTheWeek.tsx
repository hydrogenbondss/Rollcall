import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link } from 'react-router'
import { Crown, ArrowUpRight, MapPin, Layers } from 'lucide-react'
import { products, getRegion } from '../data/products'
import { useCurrency } from '../contexts/CurrencyContext'

gsap.registerPlugin(ScrollTrigger)

// Rotate weekly based on a simple hash of the current week
function getRollOfTheWeek() {
  const now = new Date()
  const week = Math.floor(now.getTime() / (7 * 24 * 60 * 60 * 1000))
  const index = week % products.length
  return products[index]
}

export default function RollOfTheWeek() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { formatPrice } = useCurrency()
  const roll = getRollOfTheWeek()
  const region = getRegion(roll.country)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      gsap.from('.rotw-content', {
        scrollTrigger: { trigger: section, start: 'top 70%' },
        opacity: 0, y: 50, duration: 1.2, ease: 'power3.out',
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="w-full bg-[#0d0d0d] py-28">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8">
        <div className="rotw-content">
          <div className="flex items-center gap-2 mb-3">
            <Crown className="w-4 h-4 text-[#c28223]" strokeWidth={1.5} />
            <p className="font-body text-[10px] uppercase tracking-[0.4em] text-[#c28223]">Roll of the Week</p>
          </div>

          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* Image */}
            <Link to={`/product/${roll.id}`} className="group relative rounded-2xl overflow-hidden border border-white/5 bg-[#141414]">
              <div className="aspect-square overflow-hidden">
                <img
                  src={roll.image}
                  alt={`${roll.brand} ${roll.name}`}
                  className="w-full h-full object-contain p-8 sm:p-12 transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.05) 100%)',
              }} />
            </Link>

            {/* Info */}
            <div>
              <p className="font-body text-[10px] uppercase tracking-[0.4em] text-[#555] mb-3">
                {roll.brand} · {roll.country}
              </p>
              <h2 className="font-display text-3xl sm:text-4xl text-[#f0ece8] tracking-tight leading-[1.1] mb-4">
                {roll.name}
              </h2>
              <p className="font-body text-[15px] text-[#666] leading-relaxed mb-6">
                This week&apos;s spotlighted roll from our archive of 43 verified products.
                {region && (
                  <>
                    {' '}{region} representative — {roll.ply}-ply {roll.material.toLowerCase()} construction.
                  </>
                )}
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#b0a89e]" strokeWidth={1.5} />
                  <span className="font-body text-[13px] text-[#888]">{roll.city}, {roll.country}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#b0a89e]" strokeWidth={1.5} />
                  <span className="font-body text-[13px] text-[#888]">{roll.ply}-ply · {roll.material}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Link
                  to={`/product/${roll.id}`}
                  className="inline-flex items-center gap-2 font-body text-sm px-6 py-3 rounded-full bg-[#f0ece8] text-white hover:opacity-80 transition-opacity"
                >
                  View Specimen <ArrowUpRight className="w-4 h-4" />
                </Link>
                <span className="font-display text-xl text-[#f0ece8]">{formatPrice(roll.priceUSD)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
