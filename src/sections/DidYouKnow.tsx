import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Lightbulb } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const observations = [
  "Japan's Nepia Oshiri Celeb contains squalane — a face cream ingredient — at ¥620 per pack. Skin care-grade tissue.",
  "Hong Kong residents pay roughly 9x more per roll than Bangladeshi consumers, yet both markets are dominated by the same parent company (Essity).",
  "Myanmar, Laos, and Cambodia have zero domestically manufactured toilet paper brands. All products are imported from Thailand, Vietnam, or China.",
  "Tempo Hong Kong releases seasonal scented variants — Applewood, Cherry Blossom, Blue Wind Chime — that sell out within weeks each year.",
  "The word 'deluxe' appears in product names across 4 countries and 3 languages, suggesting a shared consumer aspiration.",
  "Singapore is the only market where 100% bamboo toilet paper competes directly with virgin pulp products at the same price.",
  "India has the most fragmented market — 8 different domestic brands with no clear leader — while Hong Kong and Singapore are each dominated by a single brand.",
  "All scented toilet papers in the archive are manufactured in East or Southeast Asia. No South Asian brand produces scented variants.",
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
        opacity: 0, y: 20, duration: 0.6, stagger: 0.08, ease: 'power3.out', delay: 0.2,
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
            Patterns
          </h2>
          <p className="font-body text-sm text-[#999] mt-4 max-w-lg">
            Things that emerged while cataloguing 43 toilet paper specimens across 21 Asian countries.
          </p>
        </div>

        <div className="dyk-grid grid sm:grid-cols-2 gap-4">
          {observations.map((text, i) => (
            <div key={i} className="dyk-card bg-[#141414] border border-white/[0.04] rounded-xl p-6 hover:border-white/[0.08] transition-all">
              <p className="font-body text-[13px] text-[#a09890] leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
