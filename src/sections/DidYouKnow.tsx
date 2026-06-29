import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Lightbulb } from 'lucide-react'
import { specimenCount, countryCount } from '../data/stats'

gsap.registerPlugin(ScrollTrigger)

const observations = [
  "Japan's Nepia Oshiri Celeb contains squalane — a face cream ingredient — at ¥620 per pack. Skin care-grade tissue.",
  "Hong Kong residents pay roughly 5x more per roll on average than Bangladeshi consumers in this archive.",
  "Myanmar has a domestically manufactured brand, Yangon International, while Cambodia and Laos in this archive rely on imported products.",
  "Tempo Hong Kong releases seasonal scented variants — Applewood, Cherry Blossom, Blue Wind Chime — alongside its year-round neutral line.",
  "The word 'Deluxe' appears in product names across Singapore, Vietnam, and Taiwan, suggesting a shared marketing vocabulary.",
  "Singapore has the most brand-diverse archive entries in Southeast Asia, with four distinct brands: PurSoft, Cloversoft, Kleenex, and Premier.",
  "India has the least fragmented brand landscape in the archive, with just two domestic brands: Origami and Selpak.",
  "South Asian brands do produce scented toilet paper. Fresh Gold (Bangladesh) is rose-scented year-round; Rose Petal (Pakistan) offers rose and sandalwood.",
]

export default function DidYouKnow() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const ctx = gsap.context(() => {
      gsap.fromTo('.dyk-title',
        { opacity: 0, y: 30 },
        { scrollTrigger: { trigger: section, start: 'top 80%', toggleActions: 'play none none none' },
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      )
      const cards = section.querySelectorAll('.dyk-card')
      cards.forEach((card, i) => {
        gsap.fromTo(card,
          { opacity: 0, y: 20 },
          { scrollTrigger: { trigger: card, start: 'top 90%', toggleActions: 'play none none none' },
            opacity: 1, y: 0, duration: 0.5, delay: i * 0.06, ease: 'power3.out' }
        )
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
            Things that emerged while cataloguing {specimenCount} toilet paper specimens across {countryCount} Asian countries.
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
