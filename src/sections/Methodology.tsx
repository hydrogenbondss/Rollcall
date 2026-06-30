import { useRef, useEffect, useMemo } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MapPin, Layers, FileCheck } from 'lucide-react'
import { products } from '../data/products'
import { verifiedCount, communityCount } from '../data/stats'

gsap.registerPlugin(ScrollTrigger)

function useStats() {
  return useMemo(() => {
    const verified = products.filter((p) => p.verified).length
    const community = products.filter((p) => !p.verified).length
    return [
      { label: 'Verified', value: String(verified), icon: FileCheck, desc: 'Brand, manufacturer, and country of origin confirmed against manufacturer websites and official retailer listings. Some product-level specifics are editorial or drawn from field observation.' },
      { label: 'Community', value: String(community), icon: MapPin, desc: 'Brand names verified as real registered companies. Product details sourced from local market visits, contributor submissions, and regional e-commerce platforms.' },
      { label: 'Total', value: String(products.length), icon: Layers, desc: 'All specimens catalogued with the same metadata schema: provenance, material, ply, price, scent, manufacturing origin, and retail availability.' },
    ]
  }, [])
}

export default function Methodology() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const stats = useStats()

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.method-header', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        opacity: 0, y: 40, duration: 1, ease: 'power3.out',
      })
      gsap.from('.method-stat', {
        scrollTrigger: { trigger: '.method-stats', start: 'top 80%' },
        opacity: 0, y: 30, duration: 0.8, stagger: 0.15, ease: 'power3.out',
      })
      gsap.from('.method-body > *', {
        scrollTrigger: { trigger: '.method-body', start: 'top 85%' },
        opacity: 0, y: 20, duration: 0.6, stagger: 0.1, ease: 'power3.out',
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="methodology" className="w-full bg-[#0d0d0d] py-28">
      <div className="max-w-[720px] mx-auto px-6 sm:px-8">
        <div className="method-header mb-14">
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#c28223] mb-4">
            How this was made
          </p>
          <h2 className="font-display text-5xl sm:text-6xl text-[#f0ece8] tracking-tight leading-[1.05]">
            Field Notes
          </h2>
          <p className="font-body text-sm text-[#b0a99d] mt-4 max-w-md leading-relaxed">
            A research methodology built on transparency. The archive discloses what it knows, what it suspects, and what it cannot confirm.
          </p>
        </div>

        <div className="method-stats grid sm:grid-cols-3 gap-6 mb-16">
          {stats.map((stat) => (
            <div key={stat.label} className="method-stat bg-[#141414] border border-white/[0.04] rounded-xl p-6">
              <stat.icon className="w-5 h-5 text-[#c28223] mb-4" strokeWidth={1.5} />
              <p className="font-display text-3xl text-[#f0ece8] mb-1">{stat.value}</p>
              <p className="font-body text-[11px] uppercase tracking-wider text-[#b6b0a6] mb-2">{stat.label}</p>
              <p className="font-body text-[11px] text-[#b6b0a6] leading-relaxed">{stat.desc}</p>
            </div>
          ))}
        </div>

        <div className="method-body space-y-6 font-body text-[15px] text-[#b0a99d] leading-[1.85]">
          <p>
            <strong className="text-[#f0ece8] font-medium">Verified</strong> — {verifiedCount} specimens whose brand, manufacturer, and country of origin are confirmed against manufacturer websites and official retailer listings (Watsons Hong Kong, FairPrice Singapore, NTPM Malaysia, Lotus&apos;s Thailand). Product imagery is sourced from official manufacturer channels and in-market field documentation. Some product-level specifics — seasonal scents, hotel placement, exact local pricing — are editorial or drawn from field observation rather than independently confirmed.
          </p>

          <p>
            <strong className="text-[#f0ece8] font-medium">Community</strong> — {communityCount} specimens where the market is confirmed and brand names verified as real registered entities. Detailed product-level verification was limited by market access in emerging economies. The archive actively welcomes corrections from field correspondents.
          </p>

          <p>
            Each entry carries a consistent metadata schema: an accession number (RC-REGION-COUNTRY-SEQ, e.g. RC-EA-JP-001), provenance (city, country), material composition, ply count, price at point of documentation, scent profile, manufacturing origin, retail availability, hotel presence, and environmental claims. The accession number encodes region, country, and sequence — allowing cross-referenced analysis without opening the card.
          </p>

          <p>
            Price is treated not as commercial information but as a socioeconomic indicator. A basic roll sells for well under a dollar in Dhaka and several dollars in Hong Kong — an order-of-magnitude gap for what is functionally the same object. That differential encodes infrastructure quality, import tariffs, purchasing power, and supply chain complexity. The archive documents these differentials because they tell a story the product itself cannot.
          </p>

          <p>
            The methodology follows ethnographic research practices and museum cataloguing standards. Verification status is visible on every specimen card. Source limitations are disclosed without euphemism. Cultural research is only as credible as its honesty about what it cannot confirm.
          </p>
        </div>
      </div>
    </section>
  )
}
