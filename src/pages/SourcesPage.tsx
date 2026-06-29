import { useEffect, useRef } from 'react'
import { Link } from 'react-router'
import { ArrowLeft, BookMarked } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Footer from '../sections/Footer'

gsap.registerPlugin(ScrollTrigger)

const primarySources = [
  { category: 'Manufacturer & Retailer Listings', items: [
    'Nepia official product catalogue (nepia.co.jp)',
    'Elleair / Daio Paper product listings',
    'Scottie by Nippon Paper Group',
    'Samjung Greu / Living Creamy Soft product pages',
    'Tempo Hong Kong (Watsons, ParknShop, Wellcome listings)',
    'Andrex UK and Hong Kong distributor listings',
    'PurSoft, Cloversoft, Kleenex, Premier — Singapore FairPrice / Lazada / Shopee listings',
  ]},
  { category: 'Field Documentation', items: [
    'In-market photography and packaging documentation, Hong Kong, 2026',
    'Contributor submissions with location, date, and packaging metadata',
  ]},
  { category: 'Economic Data', items: [
    'World Bank Open Data — GDP per capita (current US$), latest available year',
    'HKD/USD approximate conversion rate of 7.8 used for price comparison charts',
  ]},
]

const notes = [
  'Prices are recorded at the time of documentation and reflect single-unit or standard-pack retail pricing. They should be treated as snapshots, not live market data.',
  'Seasonal scents and limited releases are noted where confirmed by manufacturer or retailer channels. Unconfirmed seasonal variants are marked as reported.',
  'Manufacturing origin is taken from packaging text or brand correspondence. Some products list multiple possible origins; these are recorded as reported.',
  'Verification status is shown on each specimen card. "Verified" means the product, price, and specifications were confirmed against at least one primary source. "Community" means the brand and market are confirmed, but full product-level verification was limited by access.',
]

export default function SourcesPage() {
  const pageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    const page = pageRef.current
    if (!page) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.source-item').forEach((item) => {
        gsap.fromTo(item,
          { opacity: 0, y: 20 },
          { scrollTrigger: { trigger: item, start: 'top 85%' }, opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
        )
      })
    }, page)
    return () => ctx.revert()
  }, [])

  return (
    <div className="min-h-screen bg-[#0d0d0d]" ref={pageRef}>
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-[#0d0d0d]/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 group">
            <ArrowLeft className="w-4 h-4 text-[#b6b0a6] group-hover:text-[#f0ece8] transition-colors" />
            <span className="font-display text-[15px] font-medium tracking-[0.15em] uppercase text-[#f0ece8]">Roll Call</span>
          </Link>
          <span className="font-mono text-[10px] text-[#b6b0a6] uppercase tracking-wider hidden sm:block">Sources</span>
        </div>
      </nav>

      <article className="max-w-[720px] mx-auto px-6 sm:px-8 pt-28 pb-20">
        <header className="mb-16 source-item">
          <div className="flex items-center gap-3 mb-4">
            <BookMarked className="w-4 h-4 text-[#c28223]" strokeWidth={1.5} />
          </div>
          <h1 className="font-display text-4xl sm:text-5xl text-[#f0ece8] mb-4 leading-[0.95]">
            Sources & Methodology Notes
          </h1>
          <p className="font-serif-display text-lg text-[#b6b0a6] italic">
            The archive is only as credible as its sources. This page documents how the data was gathered, what remains unconfirmed, and where the limits are.
          </p>
        </header>

        {primarySources.map((group) => (
          <section key={group.category} className="mb-12 source-item">
            <h2 className="font-display text-xl text-[#f0ece8] mb-4">{group.category}</h2>
            <ul className="space-y-3">
              {group.items.map((item) => (
                <li key={item} className="flex items-start gap-3 font-body text-[14px] text-[#b0a99d] leading-relaxed">
                  <span className="w-1 h-1 rounded-full bg-[#c28223] mt-2.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>
        ))}

        <section className="mb-12 source-item">
          <h2 className="font-display text-xl text-[#f0ece8] mb-4">Important Caveats</h2>
          <div className="space-y-4 bg-[#141414] border border-white/[0.04] rounded-2xl p-6">
            {notes.map((note) => (
              <p key={note} className="font-body text-[14px] text-[#b0a99d] leading-relaxed">
                {note}
              </p>
            ))}
          </div>
        </section>

        <footer className="mt-16 pt-8 border-t border-white/[0.04] source-item">
          <p className="font-mono text-[10px] text-[#b6b0a6] uppercase tracking-wider mb-2">
            Found an error?
          </p>
          <Link to="/about" className="font-body text-sm text-[#c28223] hover:text-[#f0ece8] transition-colors">
            Submit a correction via the correspondence form &rarr;
          </Link>
        </footer>
      </article>

      <Footer />
    </div>
  )
}
