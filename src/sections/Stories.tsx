import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const paragraphs = [
  `This archive spans three distinct regions of Asia — East, Southeast, and South — each with its own relationship to the roll. Japan obsesses over four-ply hotel luxury. Singapore experiments with bamboo sustainability. Hong Kong has turned scented paper into lifestyle signaling. But nowhere is the gap between comfort and infrastructure more visible than in South Asia.`,
  `In much of India, Bangladesh, and Pakistan, one-ply remains the standard. Not by choice, but by necessity. Plumbing systems in older buildings cannot handle thicker paper. The product is a technical compromise between human comfort and Victorian-era pipe diameter.`,
  `Indian brand Origami has built a business around this constraint. Their "Luxuria" line — marketed with Buddhist-adjacent imagery of balance and intention — manages to make three-ply feel like a conscious lifestyle choice rather than an infrastructural luxury.`,
  `At the Oberoi Mumbai, guests find three-ply imported tissue. The hotel's plumbing was retrofitted to accommodate it. This small fact — that luxury in South Asia sometimes means a toilet that can handle toilet paper — reveals how deeply infrastructure shapes even our most intimate routines.`,
  `Selpak, the Turkish brand with the elephant mascot, has found surprising traction in Indian cities. Its three-ply rolls sell at a premium on BigBasket and Blinkit, positioned as an affordable upgrade for the growing middle class.`,
  `And then there is the environmental paradox. Origami's "Good Karma" line — 100% recycled, unbleached, two-ply — is one of the most genuinely sustainable toilet papers on the continent. It is also one of the least comfortable. The eco-conscious South Asian consumer faces a choice their Japanese counterpart never has to make: save the planet, or save your skin.`,
]

export default function Stories() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.essay-header', {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.essay-header',
          start: 'top 80%',
        },
      })

      // Word-by-word reveal
      document.querySelectorAll('.word-para').forEach((para) => {
        const words = para.querySelectorAll('.word')
        gsap.from(words, {
          opacity: 0.1,
          duration: 0.3,
          stagger: 0.02,
          ease: 'none',
          scrollTrigger: {
            trigger: para,
            start: 'top 75%',
            end: 'top 35%',
            scrub: 1,
          },
        })
      })

      gsap.from('.essay-cite', {
        opacity: 0,
        y: 20,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.essay-cite',
          start: 'top 85%',
        },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const renderWords = (text: string) => {
    return text.split(' ').map((word, i) => (
      <span key={i} className="word inline" style={{ opacity: 0.15 }}>
        {word}{' '}
      </span>
    ))
  }

  return (
    <section ref={sectionRef} id="stories" className="w-full bg-[#0d0d0d] text-white relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-[0.03] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #c28223 0%, transparent 70%)' }} />

      <div className="max-w-[720px] mx-auto px-6 sm:px-8 pt-32 pb-20">
        <div className="essay-header">
          <div className="flex items-center gap-4 mb-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.5em] text-white/25">Wall Text</p>
            <span className="w-8 h-px bg-white/10" />
            <p className="font-mono text-[10px] text-white/25">One Region</p>
          </div>

          <h2 className="font-display text-5xl sm:text-6xl md:text-7xl tracking-tight leading-[1.05] mb-8">
            One-Ply<br />Realism
          </h2>

          <p className="font-serif-display text-xl sm:text-2xl italic text-white/40 leading-relaxed mb-20 max-w-lg">
            What South Asia's thinnest rolls reveal about infrastructure, class, and the quiet compromises of daily life.
          </p>
        </div>
      </div>

      <div className="max-w-[720px] mx-auto px-6 sm:px-8 pb-32 space-y-24">
        {paragraphs.map((text, i) => (
          <div key={i} className="word-para">
            <p className="font-body text-lg sm:text-xl text-white/70 leading-[1.9]">
              {renderWords(text)}
            </p>
          </div>
        ))}

        <div className="essay-cite pt-8 border-t border-white/10">
          <p className="font-mono text-[10px] text-white/25 leading-relaxed">
            Referenced specimens: Origami Luxuria, Selpak Super Soft, Bashundhara Pink, Fresh Gold (Bangladesh), JoySoft (Nepal), Eko Fresh (Sri Lanka), Rose Petal (Pakistan). All documentation available in the collection.
          </p>
        </div>
      </div>
    </section>
  )
}
