import { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Lightbulb, ChevronRight } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const facts = [
  {
    fact: 'The first documented use of toilet paper dates to 6th-century China, where it was mentioned by scholar Yan Zhitui.',
    source: 'Historical record',
  },
  {
    fact: 'The average person uses 57 sheets of toilet paper per day — approximately 20,805 sheets per year.',
    source: 'Industry statistics',
  },
  {
    fact: 'Japan produces the world\'s most ply-obsessed toilet paper, with some hotel-grade rolls reaching 4-ply and even 5-ply.',
    source: 'Roll Call archive',
  },
  {
    fact: 'Singapore\'s Cloversoft was the first major Asian brand to switch entirely to bamboo fiber, a move later copied by competitors.',
    source: 'Roll Call archive',
  },
  {
    fact: 'In many parts of South Asia, the plumbing infrastructure cannot handle more than 1-ply toilet paper, making luxury rolls a liability.',
    source: 'Roll Call field research',
  },
  {
    fact: 'The global toilet paper market is valued at over $100 billion, with Asia representing the fastest-growing segment.',
    source: 'Market research',
  },
]

export default function DidYouKnow() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [currentFact, setCurrentFact] = useState(0)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      gsap.from('.dyk-content', {
        scrollTrigger: { trigger: section, start: 'top 75%' },
        opacity: 0, y: 40, duration: 1, ease: 'power3.out',
      })
    }, section)

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFact((prev) => (prev + 1) % facts.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  const fact = facts[currentFact]

  return (
    <section ref={sectionRef} className="w-full bg-[#050505] py-20">
      <div className="max-w-[800px] mx-auto px-6 sm:px-8 dyk-content">
        <div className="flex items-center gap-3 mb-8">
          <Lightbulb className="w-4 h-4 text-[#c28223]" strokeWidth={1.5} />
          <p className="font-body text-[10px] uppercase tracking-[0.4em] text-white/30">Did You Know?</p>
        </div>

        <div className="relative overflow-hidden min-h-[120px]">
          <div
            key={currentFact}
            className="animate-fade-in-up"
          >
            <p className="font-display text-2xl sm:text-3xl text-white/90 leading-snug mb-4">
              {fact.fact}
            </p>
            <p className="font-body text-[11px] text-white/30 uppercase tracking-wider">
              {fact.source}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-8">
          {facts.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentFact(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === currentFact ? 'bg-[#c28223] w-6' : 'bg-white/20 hover:bg-white/40'
              }`}
              aria-label={`Fact ${i + 1}`}
            />
          ))}
          <button
            onClick={() => setCurrentFact((prev) => (prev + 1) % facts.length)}
            className="ml-2 p-1 text-white/30 hover:text-white/60 transition-colors"
            aria-label="Next fact"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  )
}
