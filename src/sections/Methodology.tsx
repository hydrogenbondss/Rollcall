import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MapPin, Layers, FileCheck } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const stats = [
  { label: 'Verified', value: '30', icon: FileCheck, desc: 'Confirmed through manufacturer documentation, retailer listings, or direct field photography' },
  { label: 'Community', value: '13', icon: MapPin, desc: 'Confirmed market presence with real brand names; awaiting deeper verification' },
  { label: 'Total', value: '43', icon: Layers, desc: 'Specimens catalogued with consistent metadata schema across all entries' },
]

export default function Methodology() {
  const sectionRef = useRef<HTMLDivElement>(null)

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
          <p className="font-body text-sm text-[#a09890] mt-4 max-w-md leading-relaxed">
            A research methodology built on transparency. The archive discloses what it knows, what it suspects, and what it cannot confirm.
          </p>
        </div>

        <div className="method-stats grid sm:grid-cols-3 gap-6 mb-16">
          {stats.map((stat) => (
            <div key={stat.label} className="method-stat bg-[#141414] border border-white/[0.04] rounded-xl p-6">
              <stat.icon className="w-5 h-5 text-[#c28223] mb-4" strokeWidth={1.5} />
              <p className="font-display text-3xl text-[#f0ece8] mb-1">{stat.value}</p>
              <p className="font-body text-[11px] uppercase tracking-wider text-[#888] mb-2">{stat.label}</p>
              <p className="font-body text-[11px] text-[#888] leading-relaxed">{stat.desc}</p>
            </div>
          ))}
        </div>

        <div className="method-body space-y-6 font-body text-[15px] text-[#a09890] leading-[1.85]">
          <p>
            <strong className="text-[#f0ece8] font-medium">Verified</strong> — 30 specimens confirmed through manufacturer websites, official retailer listings (Watsons Hong Kong, FairPrice Singapore, Amazon Japan, NTPM Malaysia, Lotus's Thailand), and direct brand correspondence. Photography sourced from official channels or independently photographed in situ. These meet the archive's standard of documentary evidence.
          </p>

          <p>
            <strong className="text-[#f0ece8] font-medium">Community</strong> — 13 specimens where the market is confirmed and brand names verified as real registered entities. Detailed product-level verification was limited by market access in emerging economies. The archive actively welcomes corrections from field correspondents.
          </p>

          <p>
            Each entry carries a consistent metadata schema: catalog number (RCT.AS.XXXX), provenance (city, country), material composition, ply count, price at point of documentation, scent profile, manufacturing origin, retail availability, hotel presence, and environmental claims. This allows cross-referenced analysis across regions, price points, and material categories.
          </p>

          <p>
            Price is treated not as commercial information but as a socioeconomic indicator. The same three-ply roll costs $0.18 in Dhaka and $5.90 in Hong Kong. That $5.72 differential encodes infrastructure quality, import tariffs, purchasing power, and supply chain complexity. The archive documents these differentials because they tell a story the product itself cannot.
          </p>

          <p>
            The methodology follows ethnographic research practices and museum cataloguing standards. Verification status is visible on every specimen card. Source limitations are disclosed without euphemism. Cultural research is only as credible as its honesty about what it cannot confirm.
          </p>
        </div>
      </div>
    </section>
  )
}
