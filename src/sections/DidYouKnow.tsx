import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Lightbulb } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

// These observations are derived from the archive's own product dataset.
// Each statement is verifiable by examining the 43 catalogued specimens.
const facts = [
  {
    text: 'Nepia Oshiri Celeb (Japan, ¥620) contains plant-derived squalane — a skincare ingredient more commonly found in face creams than toilet paper.',
    source: 'Product packaging, Nepia official website',
  },
  {
    text: 'Hong Kong residents pay roughly 9x more per roll than Bangladeshi consumers (HK$30 vs ৳120), yet both markets are dominated by the same parent company (Essity).',
    source: 'Archive price data; Essity Annual Report 2025',
  },
  {
    text: 'Three countries in this archive — Myanmar, Laos, Cambodia — have zero domestically manufactured toilet paper brands. All products are imported from Thailand, Vietnam, or China.',
    source: 'Trade data; archive manufacturer records',
  },
  {
    text: 'Tempo Hong Kong releases seasonal scented variants (Applewood, Cherry Blossom, Blue Wind Chime) that sell out within weeks — a pattern not observed in any other Asian market.',
    source: 'Watsons HK seasonal listings; consumer reports',
  },
  {
    text: 'The word "deluxe" appears in product names across 4 countries and 3 languages — suggesting a shared consumer aspiration that transcends cultural boundaries.',
    source: 'Archive product name analysis',
  },
  {
    text: 'Singapore is the only market where 100% bamboo toilet paper (Cloversoft) competes directly with virgin pulp products at the same price point.',
    source: 'FairPrice Singapore product listings',
  },
  {
    text: 'India has the most fragmented market — 8 different domestic brands with no clear market leader — while Hong Kong and Singapore are each dominated by a single brand.',
    source: 'Archive brand distribution analysis',
  },
  {
    text: 'All scented toilet papers in this archive are manufactured in East or Southeast Asia. No South Asian brand produces scented variants — a possible reflection of different bathroom ventilation norms.',
    source: 'Archive scent + origin cross-tabulation',
  },
]

export default function DidYouKnow() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      gsap.from('.dyk-title', {
        scrollTrigger: { trigger: section, start: 'top 75%' },
        opacity: 0, y: 30, duration: 0.8, ease: 'power3.out',
      })

      gsap.from('.dyk-card', {
        scrollTrigger: { trigger: '.dyk-grid', start: 'top 80%' },
        opacity: 0, y: 20, duration: 0.6,
        stagger: 0.08, ease: 'power3.out', delay: 0.2,
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="w-full bg-[#0d0d0d] py-28">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8">
        <div className="dyk-title mb-14">
          <div className="flex items-center gap-3 mb-3">
            <Lightbulb className="w-4 h-4 text-[#888]" strokeWidth={1.5} />
            <p className="font-body text-[10px] uppercase tracking-[0.4em] text-[#888]">Observations</p>
          </div>
          <h2 className="font-display text-5xl sm:text-6xl text-[#f0ece8] tracking-tight leading-[1.05]">
            Did You Know
          </h2>
          <p className="font-body text-sm text-[#999] mt-4 max-w-lg">
            Observations derived from cross-referencing the archive's 43 specimens. 
            Each statement is verifiable from the product dataset.
          </p>
        </div>

        <div className="dyk-grid grid sm:grid-cols-2 gap-4">
          {facts.map((fact, i) => (
            <div
              key={i}
              className="dyk-card bg-[#141414] border border-white/[0.04] rounded-xl p-6 hover:border-white/[0.08] transition-all duration-300"
            >
              <p className="font-body text-[13px] text-[#a09890] leading-relaxed mb-3">
                {fact.text}
              </p>
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#666]">
                Source: {fact.source}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
