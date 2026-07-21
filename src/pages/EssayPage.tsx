import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { ArrowLeft, BookOpen } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Footer from '../sections/Footer'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { accessionId } from '../data/accession'

gsap.registerPlugin(ScrollTrigger)

type EssayBlock =
  | { type: 'p'; text: string }
  | { type: 'figure'; src: string; alt: string; caption: string; to: string }
  | { type: 'pullquote'; text: string }

const blocks: EssayBlock[] = [
  { type: 'p', text: `This archive spans three distinct regions of Asia — East, Southeast, and South — each with its own relationship to the roll. Japan obsesses over softness — squalane-infused, moisturising premium rolls. Singapore experiments with bamboo sustainability. Hong Kong has turned the soft, finely branded roll into lifestyle signalling. But nowhere is the gap between comfort and infrastructure more visible than in South Asia.` },
  { type: 'figure', src: './images/nepia-oshiri-celeb-render.webp', alt: 'Nepia Oshiri Celeb premium toilet roll packaging', caption: `${accessionId('nepia-oshiri-celeb')} · Nepia Oshiri Celeb — squalane-infused 2-ply, Tokyo. Illustrative reconstruction.`, to: '/product/nepia-oshiri-celeb' },
  { type: 'p', text: `In much of India, Bangladesh, and Pakistan, thin economy-ply rolls remain the everyday default — not by choice, but by necessity. Plumbing systems in older buildings cannot handle thicker paper. The product is a technical compromise between human comfort and Victorian-era pipe diameter. In these markets, premium three-ply remains the aspirational exception, not the everyday norm.` },
  { type: 'p', text: `Indian brand Origami has built a business around this constraint. Their "Luxuria" line — marketed with imagery of balance and intention¹ — manages to make three-ply feel like a conscious lifestyle choice rather than an infrastructural luxury.` },
  { type: 'figure', src: './images/origami-luxuria-render.webp', alt: 'Origami Luxuria toilet tissue packaging', caption: `${accessionId('origami-luxuria')} · Origami Luxuria — 3-ply as a conscious lifestyle choice, Mumbai. Illustrative reconstruction.`, to: '/product/origami-luxuria' },
  { type: 'p', text: `At some high-end hotels in Mumbai, guests find three-ply imported tissue. Where the plumbing has been retrofitted to accommodate it, this small fact — that luxury in South Asia sometimes means a toilet that can handle toilet paper — reveals how deeply infrastructure shapes even our most intimate routines.²` },
  { type: 'p', text: `Selpak, the Turkish brand, has found surprising traction in Indian cities. Its three-ply rolls are positioned as an affordable upgrade for the growing middle class on e-commerce platforms such as BigBasket and Blinkit.³` },
  { type: 'p', text: `And then there is the environmental paradox. Origami's "Good Karma" line — 100% recycled, unbleached, three-ply — is one of the most genuinely sustainable toilet papers on the continent. It is also one of the least comfortable. The eco-conscious South Asian consumer faces a choice their Japanese counterpart never has to make: save the planet, or save your skin.` },
  { type: 'figure', src: './images/origami-karma-real.webp', alt: 'Origami Good Karma recycled toilet tissue packaging', caption: `${accessionId('origami-karma')} · Origami Good Karma — 100% recycled, unbleached. Sustainability at the cost of comfort.`, to: '/product/origami-karma' },
  { type: 'p', text: `What is striking about this archive is not the products themselves, but the system they index. Each roll tells you about water pressure, pipe diameter, purchasing power, and cultural aspiration. The Japanese product with added squalane is not just soft — it is a signal that your plumbing can handle anything. The Bangladeshi two-ply is not just cheap — it is an adaptation to infrastructure that has not changed in a century.` },
  { type: 'pullquote', text: 'Toilet paper is infrastructure made tactile.' },
  { type: 'p', text: `Every sheet is a negotiation between comfort and cost, between what we want and what our pipes can handle. The archive records not products, but the invisible systems that shape daily life.` },
  { type: 'p', text: `In Hong Kong, where this archive was initiated, the contrast is particularly sharp. Public housing estates are reported to stock one-ply recycled paper, while luxury apartments in Mid-Levels offer soft multi-ply rolls imported from Japan, marketed with delicate packaging and "hotel quality" promises.⁴ Same city, different plumbing.` },
  { type: 'p', text: `The question this archive keeps returning to is simple: who gets to be comfortable? Not in theory, but in the specific, intimate moment when comfort is needed. The answer, indexed across the whole archive, is that comfort is infrastructure. And infrastructure is politics.` },
]

const footnotes = [
  { id: 1, text: 'Packaging and marketing imagery described from field documentation and retail photography; interpretation is the author\'s.' },
  { id: 2, text: 'Based on reported observations from hotel visits and industry accounts; specific retrofitting details have not been independently verified.' },
  { id: 3, text: 'Pricing and positioning observed on e-commerce listings at the time of documentation; market conditions change.' },
  { id: 4, text: 'Public housing procurement reported through informal correspondence; no official government tender was reviewed for this essay.' },
]

// Catalogue figure with a mounted-print treatment (framed on the charcoal
// panel so light-background imagery sits quietly in the dark page). Fail-safe:
// if the image file is missing or fails, the whole figure is omitted rather
// than showing a broken frame.
function EssayFigure({ src, alt, caption, to }: { src: string; alt: string; caption: string; to: string }) {
  const [failed, setFailed] = useState(false)
  if (failed) return null
  return (
    <figure className="essay-item my-12">
      <Link to={to} className="group block">
        <div
          className="rounded-2xl overflow-hidden border border-white/[0.05] flex items-center justify-center py-10"
          style={{ background: 'radial-gradient(115% 100% at 50% 0%, #1b1b1d 0%, #0c0c0d 78%)' }}
        >
          <img
            src={src}
            alt={alt}
            loading="lazy"
            onError={() => setFailed(true)}
            className="max-h-[300px] w-auto max-w-[62%] object-contain rounded-lg ring-1 ring-white/10 shadow-2xl group-hover:scale-[1.02] transition-transform duration-500"
          />
        </div>
      </Link>
      <figcaption className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#b6b0a6] mt-3 leading-relaxed">
        {caption}
      </figcaption>
    </figure>
  )
}

export default function EssayPage() {
  const pageRef = useRef<HTMLDivElement>(null)
  useDocumentTitle('One-Ply Realism — Roll Call', 'An essay on toilet paper as material culture and infrastructure across Asia.')

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
            <ArrowLeft className="w-4 h-4 text-[#b6b0a6] group-hover:text-[#f0ece8] transition-colors" />
            <span className="font-display text-[15px] font-medium tracking-[0.15em] uppercase text-[#f0ece8]">Roll Call</span>
          </Link>
          <span className="font-mono text-[10px] text-[#b6b0a6] uppercase tracking-wider hidden sm:block">Essay</span>
        </div>
      </nav>

      {/* Essay */}
      <article className="max-w-[720px] mx-auto px-6 sm:px-8 pt-28 pb-20">
        <header className="mb-16 essay-item">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-4 h-4 text-[#c28223]" strokeWidth={1.5} />
            <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#c28223]">Critical essay</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl text-[#f0ece8] mb-4 leading-[0.95]">
            One-Ply Realism
          </h1>
          <p className="font-serif-display text-lg text-[#b6b0a6] italic mb-6">
            On toilet paper as material culture and infrastructure.
          </p>
          <div className="flex items-center gap-4 text-[#b6b0a6]">
            <span className="font-mono text-[10px] uppercase tracking-wider">Jeffrey Nicholas Tse</span>
            <span className="w-1 h-1 rounded-full bg-[#555]" />
            <span className="font-mono text-[10px] uppercase tracking-wider">Hong Kong, 2026</span>
          </div>
        </header>

        {blocks.map((b, i) => {
          if (b.type === 'pullquote') {
            return (
              <blockquote key={i} className="essay-item my-14 border-l-2 border-[#c28223]/50 pl-6 sm:pl-8">
                <p className="font-serif-display text-2xl sm:text-3xl italic text-[#f0ece8] leading-snug">
                  {b.text}
                </p>
              </blockquote>
            )
          }
          if (b.type === 'figure') {
            return <EssayFigure key={i} {...b} />
          }
          return (
            <p
              key={i}
              className="essay-item font-body text-[15px] text-[#b0a99d] leading-[1.8] mb-8"
            >
              {b.text}
            </p>
          )
        })}

        {/* Footnotes */}
        <footer className="mt-16 pt-8 border-t border-white/[0.04] essay-item">
          <p className="font-mono text-[10px] text-[#b6b0a6] uppercase tracking-wider mb-4">
            Notes
          </p>
          <ol className="space-y-3">
            {footnotes.map((fn) => (
              <li key={fn.id} id={`fn-${fn.id}`} className="flex items-start gap-3">
                <sup className="font-mono text-[10px] text-[#c28223] mt-0.5">{fn.id}</sup>
                <p className="font-body text-[12px] text-[#b6b0a6] leading-relaxed">{fn.text}</p>
              </li>
            ))}
          </ol>
        </footer>

        <div className="mt-16 pt-8 border-t border-white/[0.04] essay-item">
          <p className="font-mono text-[10px] text-[#b6b0a6] uppercase tracking-wider mb-3">
            This essay accompanies the Roll Call archive
          </p>
          <p className="font-body text-[14px] text-[#b6b0a6] leading-relaxed max-w-[520px] mb-6">
            It is the critical spine of the project — reading catalogued specimens as evidence about infrastructure, class, and what societies choose to make soft.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link to="/collection" className="font-body text-sm text-[#c28223] hover:text-[#f0ece8] transition-colors">
              Browse the collection &rarr;
            </Link>
            <Link to="/about" className="font-body text-sm text-[#b6b0a6] hover:text-[#f0ece8] transition-colors">
              About the project
            </Link>
            <Link to="/grant" className="font-body text-sm text-[#b6b0a6] hover:text-[#f0ece8] transition-colors">
              Grant summary
            </Link>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  )
}
