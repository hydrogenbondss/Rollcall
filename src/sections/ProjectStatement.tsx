import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function ProjectStatement() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.ps-header', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        opacity: 0, y: 40, duration: 1, ease: 'power3.out',
      })
      gsap.from('.ps-body > *', {
        scrollTrigger: { trigger: '.ps-body', start: 'top 80%' },
        opacity: 0, y: 30, duration: 0.8, stagger: 0.12, ease: 'power3.out',
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="w-full bg-[#0d0d0d] py-28">
      <div className="max-w-[720px] mx-auto px-6 sm:px-8">
        <div className="ps-header mb-14">
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#c28223] mb-4">
            On this work
          </p>
          <h2 className="font-display text-5xl sm:text-6xl text-[#f0ece8] tracking-tight leading-[1.05]">
            The Softest<br />Index
          </h2>
        </div>

        <div className="ps-body space-y-8">
          <p className="font-serif-display text-lg sm:text-xl italic text-[#a09890] leading-relaxed">
            What does a society value? Look not at its monuments, but at what it chooses to make soft.
          </p>

          <div className="w-12 h-px bg-[#c28223]/20" />

          <p className="font-body text-[15px] text-[#a09890] leading-[1.85]">
            <strong className="text-[#f0ece8] font-medium">Roll Call</strong> treats toilet paper as a material witness. Across 21 countries in East, Southeast, and South Asia, 43 specimens have been catalogued — not as consumer goods, but as indexes of what each society can afford, what its plumbing will tolerate, and what it believes comfort should feel like.
          </p>

          <div className="bg-[#141414] border border-white/[0.04] rounded-2xl p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#c28223] mb-2">Why 43 specimens is enough</p>
            <p className="font-body text-[14px] text-[#a09890] leading-relaxed">
              Forty-three is not an exhaustive inventory; it is a proof of concept. The sample spans high-income economies, middle-income markets, and lower-income contexts across three regions. At this scale, clear patterns already emerge — GDP correlates with ply count, scented papers cluster in East Asia, and South Asia remains dominated by thin, infrastructure-compatible rolls. The archive demonstrates that a replicable methodology can generate cultural insight from a modest but geographically diverse sample.
            </p>
          </div>

          <p className="font-body text-[15px] text-[#a09890] leading-[1.85]">
            In Hong Kong, four-ply scented tissue is aspirational. A home stocked with Tempo signals membership in a class that has upgraded from necessity to preference. In Mumbai, one-ply is not poverty — it is physics. Victorian-era pipework makes thicker paper an act of plumbing suicide. The product available is the product the infrastructure permits.
          </p>

          <p className="font-body text-[15px] text-[#a09890] leading-[1.85]">
            This project was initiated in Hong Kong in 2026. It operates at the intersection of ethnographic observation, material culture studies, and editorial design. Each specimen carries a catalog number, provenance, material composition, and verification status. The archive is presented as both a permanent cultural record and an invitation — the collection is incomplete by design, awaiting contributions from field correspondents across the continent.
          </p>

          <p className="font-body text-[15px] text-[#a09890] leading-[1.85]">
            The accompanying essay, <em>One-Ply Realism</em>, examines South Asia's thinnest rolls as evidence of how infrastructure shapes intimacy. The data visualization maps price against thickness across three regions. The world chart documents an incomplete geography — a project still being unrolled.
          </p>

          <div className="w-12 h-px bg-[#c28223]/20" />

          <p className="font-body text-[15px] text-[#a09890] leading-[1.85]">
            The work asks a single question: if we preserve porcelain in museums, why not the paper that touched more human skin than any ceramic ever made?
          </p>

          <div className="pt-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#b0a89e] mb-2">Practices</p>
            <p className="font-body text-[13px] text-[#a09890]">
              Material Culture Research · Editorial Design · Data Visualization · Web Installation
            </p>
          </div>

          <div className="pt-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#b0a89e] mb-2">Origin</p>
            <p className="font-body text-[13px] text-[#a09890]">
              Hong Kong, 2026
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
