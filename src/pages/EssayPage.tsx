import { useEffect, useRef } from 'react'
import { Link } from 'react-router'
import { ArrowLeft, BookOpen } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Footer from '../sections/Footer'

gsap.registerPlugin(ScrollTrigger)

const paragraphs = [
  `This archive spans three distinct regions of Asia — East, Southeast, and South — each with its own relationship to the roll. Japan obsesses over four-ply hotel luxury. Singapore experiments with bamboo sustainability. Hong Kong has turned scented paper into lifestyle signaling. But nowhere is the gap between comfort and infrastructure more visible than in South Asia.`,
  `In much of India, Bangladesh, and Pakistan, one-ply remains the standard. Not by choice, but by necessity. Plumbing systems in older buildings cannot handle thicker paper. The product is a technical compromise between human comfort and Victorian-era pipe diameter.`,
  `Indian brand Origami has built a business around this constraint. Their "Luxuria" line — marketed with imagery of balance and intention¹ — manages to make three-ply feel like a conscious lifestyle choice rather than an infrastructural luxury.`,
  `At some high-end hotels in Mumbai, guests find three-ply imported tissue. Where the plumbing has been retrofitted to accommodate it, this small fact — that luxury in South Asia sometimes means a toilet that can handle toilet paper — reveals how deeply infrastructure shapes even our most intimate routines.²`,
  `Selpak, the Turkish brand with the elephant mascot, has found surprising traction in Indian cities. Its three-ply rolls are positioned as an affordable upgrade for the growing middle class on e-commerce platforms such as BigBasket and Blinkit.³`,
  `And then there is the environmental paradox. Origami's "Good Karma" line — 100% recycled, unbleached, two-ply — is one of the most genuinely sustainable toilet papers on the continent. It is also one of the least comfortable. The eco-conscious South Asian consumer faces a choice their Japanese counterpart never has to make: save the planet, or save your skin.`,
  `What is striking about this archive is not the products themselves, but the system they index. Each roll tells you about water pressure, pipe diameter, purchasing power, and cultural aspiration. The Japanese product with added squalane is not just soft — it is a signal that your plumbing can handle anything. The Bangladeshi one-ply is not just cheap — it is an adaptation to infrastructure that has not changed in a century.`,
  `Toilet paper is infrastructure made tactile. Every sheet is a negotiation between comfort and cost, between what we want and what our pipes can handle. The archive records not products, but the invisible systems that shape daily life.`,
  `In Hong Kong, where this archive was initiated, the contrast is particularly sharp. Public housing estates are reported to stock one-ply recycled paper, while luxury apartments in Mid-Levels offer four-ply imported from Japan, marketed with cherry blossom imagery and "hotel quality" promises.⁴ Same city, different plumbing.`,
  `The question this archive keeps returning to is simple: who gets to be comfortable? Not in theory, but in the specific, intimate moment when comfort is needed. The answer, indexed across the whole archive, is that comfort is infrastructure. And infrastructure is politics.`,
]

const footnotes = [
  { id: 1, text: 'Packaging and marketing imagery described from field documentation and retail photography; interpretation is the author\'s.' },
  { id: 2, text: 'Based on reported observations from hotel visits and industry accounts; specific retrofitting details have not been independently verified.' },
  { id: 3, text: 'Pricing and positioning observed on e-commerce listings at the time of documentation; market conditions change.' },
  { id: 4, text: 'Public housing procurement reported through informal correspondence; no official government tender was reviewed for this essay.' },
]

export default function EssayPage() {
  const pageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    const page = pageRef.current
    if (!page) return

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.essay-item').forEach((item) => {
        gsap.fromTo(item,
          { opacity: 0, y: 20 },
          {
            scrollTrigger: { trigger: item, start: 'top 85%' },
            opacity: 1, y: 0, duration: 0.6, ease: 'power3.out',
          }
        )
      })
    }, page)

    return () => ctx.revert()
  }, [])

  return (
    <div className="min-h-screen bg-[#0d0d0d]" ref={pageRef}>
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-[#0d0d0d]/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 group">
            <ArrowLeft className="w-4 h-4 text-[#888] group-hover:text-[#f0ece8] transition-colors" />
            <span className="font-display text-[15px] font-medium tracking-[0.15em] uppercase text-[#f0ece8]">Roll Call</span>
          </Link>
          <span className="font-mono text-[10px] text-[#888] uppercase tracking-wider hidden sm:block">Essay</span>
        </div>
      </nav>

      {/* Essay */}
      <article className="max-w-[720px] mx-auto px-6 sm:px-8 pt-32 pb-20">
        <header className="mb-16 essay-item">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-4 h-4 text-[#8b7ec8]" strokeWidth={1.5} />
            <p className="font-body text-[10px] uppercase tracking-[0.4em] text-[#888]">04</p>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl text-[#f0ece8] mb-4 leading-[0.95]">
            One-Ply Realism
          </h1>
          <p className="font-serif-display text-lg text-[#888] italic mb-6">
            On toilet paper as material culture and infrastructure.
          </p>
          <div className="flex items-center gap-4 text-[#888]">
            <span className="font-mono text-[10px] uppercase tracking-wider">Jeffrey Nicholas Tse</span>
            <span className="w-1 h-1 rounded-full bg-[#555]" />
            <span className="font-mono text-[10px] uppercase tracking-wider">Hong Kong, 2026</span>
          </div>
        </header>

        {paragraphs.map((p, i) => (
          <p
            key={i}
            className="essay-item font-body text-[15px] text-[#a09890] leading-[1.8] mb-8"
          >
            {p}
          </p>
        ))}

        {/* Footnotes */}
        <footer className="mt-16 pt-8 border-t border-white/[0.04] essay-item">
          <p className="font-mono text-[10px] text-[#888] uppercase tracking-wider mb-4">
            Notes
          </p>
          <ol className="space-y-3">
            {footnotes.map((fn) => (
              <li key={fn.id} id={`fn-${fn.id}`} className="flex items-start gap-3">
                <sup className="font-mono text-[10px] text-[#c28223] mt-0.5">{fn.id}</sup>
                <p className="font-body text-[12px] text-[#888] leading-relaxed">{fn.text}</p>
              </li>
            ))}
          </ol>
        </footer>

        <div className="mt-16 pt-8 border-t border-white/[0.04] essay-item">
          <p className="essay-item font-mono text-[10px] text-[#888] uppercase tracking-wider mb-2">
            This essay accompanies the Roll Call archive
          </p>
          <Link to="/collection" className="essay-item font-body text-sm text-[#c28223] hover:text-[#f0ece8] transition-colors">
            Browse the collection &rarr;
          </Link>
        </div>
      </article>

      <Footer />
    </div>
  )
}
