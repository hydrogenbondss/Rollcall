import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link, useNavigate } from 'react-router'
import { ArrowRight, Dices, LayoutGrid, MapPin, Layers } from 'lucide-react'
import Navigation from '../components/Navigation'
import Footer from '../sections/Footer'
import WhyToiletPaper from '../sections/WhyToiletPaper'
import { products } from '../data/products'
import { specimenCount, countryCount, regionCount, verifiedCount } from '../data/stats'
import { accessionId } from '../data/accession'

gsap.registerPlugin(ScrollTrigger)

// A hand-picked, region-diverse row of visually strong charcoal renders —
// the archive's own objects, surfaced on the front page.
const stripIds = [
  'nepia-oshiri-celeb', 'samjung-living', 'tempo-applewood', 'andrex-ultimate',
  'pursoft-unscented', 'cellox-purify', 'tisyu-mega', 'bashundhara-pink',
]
const stripSpecimens = stripIds
  .map((id) => products.find((p) => p.id === id))
  .filter((p): p is NonNullable<typeof p> => Boolean(p))

const components = [
  {
    to: '/collection',
    num: 'I',
    title: 'The Archive Wall',
    desc: `The complete collection of ${specimenCount} catalogued specimens, read as a single archival system.`,
    icon: LayoutGrid,
    color: '#c28223',
  },
  {
    to: '/exhibition?zone=zone-living',
    num: 'II',
    title: 'The Living Specimen',
    desc: 'The centrepiece: one specimen enlarged into a rotating, dissected model that reveals what is hidden inside everyday packaging.',
    icon: Layers,
    color: '#c4728e',
  },
  {
    to: '/exhibition?zone=zone-extinct',
    num: 'III',
    title: 'The Extinction Corner',
    desc: 'A quieter space reserved for packaging that leaves circulation, as the archive documents discontinuations over time.',
    icon: MapPin,
    color: '#c85a32',
  },
]

const secondaryLinks = [
  { to: '/exhibition', label: 'The Exhibition' },
  { to: '/about', label: 'About' },
  { to: '/essay', label: 'Essay' },
  { to: '/sources', label: 'Sources' },
]

export default function HomeContent() {
  const heroRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ctx = gsap.context(() => {
      gsap.fromTo('.hero-item',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: reduced ? 0.3 : 0.9, stagger: 0.12, ease: 'power3.out' }
      )
      gsap.fromTo('.nav-card',
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: '.nav-cards', start: 'top 80%' },
        }
      )
    }, heroRef)
    return () => ctx.revert()
  }, [])

  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      <Navigation />

      <main ref={heroRef}>
        {/* Hero — brand first, one question, one sentence, one CTA group */}
        <section className="relative min-h-[88vh] flex flex-col items-center justify-center px-6 text-center overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              background:
                'radial-gradient(ellipse 80% 55% at 50% 35%, rgba(194,130,35,0.07) 0%, transparent 62%), radial-gradient(ellipse 50% 40% at 70% 80%, rgba(196,114,142,0.04) 0%, transparent 55%)',
            }}
            aria-hidden="true"
          />

          <div className="hero-item relative mb-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.5em] text-[#c28223]/70">
              Est. 2026 &middot; Material Culture Archive
            </p>
          </div>

          <h1
            className="hero-item relative font-display text-[18vw] sm:text-[14vw] md:text-[110px] lg:text-[128px] text-[#f0ece8] leading-[0.82] tracking-tighter uppercase"
            style={{ letterSpacing: '-0.04em' }}
          >
            Roll<br className="sm:hidden" /> Call
          </h1>

          <p className="hero-item relative font-serif-display text-lg sm:text-xl italic text-[#b0a99d] max-w-lg mt-10 leading-relaxed">
            What deserves to be archived?
          </p>

          <p className="hero-item relative font-body text-[15px] sm:text-base text-[#b6b0a6] max-w-[520px] mt-6 leading-relaxed">
            An evolving archive of everyday packaging across Asia — beginning with toilet paper as material culture, infrastructure, and class.
          </p>

          <div className="hero-item relative flex flex-wrap items-center justify-center gap-4 mt-12">
            <Link to="/collection" className="group inline-flex items-center gap-3 px-6 py-3 bg-[#c28223] hover:bg-[#d49a3f] rounded-2xl transition-all">
              <span className="font-body text-sm text-[#0d0d0d] font-medium">Enter the Archive</span>
              <ArrowRight className="w-4 h-4 text-[#0d0d0d] group-hover:translate-x-1 transition-transform" strokeWidth={2} />
            </Link>
            <Link to="/essay" className="group inline-flex items-center gap-3 px-6 py-3 bg-[#141414] border border-white/[0.06] hover:border-[#c28223]/30 rounded-2xl transition-all">
              <span className="font-body text-sm text-[#f0ece8]">Read the Essay</span>
              <ArrowRight className="w-4 h-4 text-[#c28223] group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
            </Link>
            <button
              onClick={() => {
                const p = products[Math.floor(Math.random() * products.length)]
                navigate(`/product/${p.id}`)
              }}
              className="group inline-flex items-center gap-2 px-4 py-3 text-[#b6b0a6] hover:text-[#f0ece8] transition-colors cursor-pointer"
              aria-label="Open a random specimen"
            >
              <Dices className="w-4 h-4" strokeWidth={1.5} />
              <span className="font-body text-[13px]">Random</span>
            </button>
          </div>
        </section>

        {/* Specimen strip — the archive's objects, on the front page */}
        <section className="py-14 border-t border-white/[0.04] overflow-hidden">
          <div className="max-w-[1100px] mx-auto px-6 sm:px-8 flex items-baseline justify-between mb-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#c28223]">From the archive</p>
            <Link to="/collection" className="font-body text-[12px] text-[#b6b0a6] hover:text-[#f0ece8] transition-colors">All {specimenCount} specimens &rarr;</Link>
          </div>
          <div className="flex gap-4 overflow-x-auto px-6 sm:px-8 pb-4 snap-x [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {stripSpecimens.map((s) => (
              <Link
                key={s.id}
                to={`/product/${s.id}`}
                className="group shrink-0 w-[150px] sm:w-[170px] snap-start"
              >
                <div
                  className="aspect-[3/4] rounded-xl overflow-hidden border border-white/[0.05] group-hover:border-white/[0.14] transition-colors"
                  style={{ background: 'radial-gradient(115% 100% at 50% 0%, #1b1b1d 0%, #0c0c0d 78%)' }}
                >
                  <img
                    src={s.image}
                    alt={`${s.brand} — ${s.name}`}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  />
                </div>
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#b6b0a6] mt-2.5">{accessionId(s.id)}</p>
                <p className="font-body text-[12px] text-[#f0ece8] leading-snug mt-0.5 line-clamp-1">{s.brand}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Current Collection — a snapshot of a growing archive */}
        <section className="max-w-[1000px] mx-auto px-6 sm:px-8 py-16 border-t border-white/[0.04]">
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#c28223] mb-8">
            Current Collection
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-8 gap-x-6">
            <div>
              <p className="font-display text-4xl sm:text-5xl text-[#f0ece8]">{specimenCount}</p>
              <p className="font-mono text-[10px] uppercase tracking-wider text-[#b6b0a6] mt-2">Archived Specimens</p>
            </div>
            <div>
              <p className="font-display text-4xl sm:text-5xl text-[#f0ece8]">{countryCount}</p>
              <p className="font-mono text-[10px] uppercase tracking-wider text-[#b6b0a6] mt-2">Countries</p>
            </div>
            <div>
              <p className="font-display text-4xl sm:text-5xl text-[#f0ece8]">{regionCount}</p>
              <p className="font-mono text-[10px] uppercase tracking-wider text-[#b6b0a6] mt-2">Regions</p>
            </div>
            <div>
              <p className="font-display text-4xl sm:text-5xl text-[#f0ece8]">∞</p>
              <p className="font-mono text-[10px] uppercase tracking-wider text-[#b6b0a6] mt-2">Growing Archive</p>
            </div>
          </div>
          <p className="font-body text-[14px] leading-relaxed text-[#b6b0a6] max-w-[640px] mt-10">
            The first edition of Roll Call documents {specimenCount} specimens across {countryCount} Asian
            countries — {verifiedCount} verified against primary sources, the rest community-sourced. Rather than a
            complete survey, this initial collection establishes the foundation of an archive intended to expand
            over time through continued research and public contribution.
          </p>
        </section>

        {/* Why toilet paper */}
        <WhyToiletPaper />

        {/* Critical writing — make the essay impossible to miss on a skim */}
        <section className="max-w-[900px] mx-auto px-6 sm:px-8 py-20 border-t border-white/[0.04]">
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#c28223] mb-5">
            Critical writing
          </p>
          <h2 className="font-display text-3xl sm:text-4xl text-[#f0ece8] tracking-tight leading-[1.05] mb-6 max-w-[18ch]">
            One-Ply Realism
          </h2>
          <p className="font-serif-display text-lg sm:text-xl italic text-[#b0a99d] max-w-[34rem] leading-relaxed mb-8">
            Toilet paper is infrastructure made tactile.
          </p>
          <p className="font-body text-[15px] text-[#b6b0a6] leading-relaxed max-w-[560px] mb-10">
            The project&rsquo;s critical essay reads everyday rolls as indexes of pipe diameter, purchasing power, and cultural aspiration — arguing that comfort is infrastructure, and infrastructure is politics.
          </p>
          <Link
            to="/essay"
            className="group inline-flex items-center gap-3 font-body text-sm text-[#c28223] hover:text-[#f0ece8] transition-colors"
          >
            Read the full essay
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
          </Link>
        </section>

        {/* The exhibition, in three parts */}
        <section className="nav-cards max-w-[1100px] mx-auto px-6 sm:px-8 py-16 border-t border-white/[0.04]">
          <div className="flex items-center gap-3 mb-8">
            <span className="w-8 h-px bg-white/15" />
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#c28223]">The exhibition, in three parts</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {components.map((c) => (
              <Link
                key={c.title}
                to={c.to}
                className="nav-card group bg-[#141414] border border-white/[0.04] rounded-2xl p-6 hover:border-white/[0.08] transition-all flex flex-col"
              >
                <div className="flex items-start justify-between mb-4">
                  <c.icon className="w-5 h-5" style={{ color: c.color }} strokeWidth={1.5} />
                  <span className="font-mono text-[10px] text-[#b6b0a6] tracking-[0.25em]">{c.num}</span>
                </div>
                <h2 className="font-display text-xl text-[#f0ece8] mb-2 group-hover:text-[#c28223] transition-colors">{c.title}</h2>
                <p className="font-body text-[13px] text-[#b6b0a6] leading-relaxed mb-6 flex-1">{c.desc}</p>
                <ArrowRight className="w-4 h-4 text-[#b6b0a6] group-hover:text-[#c28223] group-hover:translate-x-1 transition-all" strokeWidth={1.5} />
              </Link>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-8">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#b6b0a6]">Also</span>
            {secondaryLinks.map((l) => (
              <Link key={l.to} to={l.to} className="font-body text-[13px] text-[#b6b0a6] hover:text-[#f0ece8] transition-colors">{l.label}</Link>
            ))}
          </div>
        </section>

        {/* Bio strip */}
        <section className="max-w-[800px] mx-auto px-6 sm:px-8 py-16 border-t border-white/[0.04]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-[#c28223]/20 flex items-center justify-center">
              <span className="font-display text-[11px] text-[#c28223]">JT</span>
            </div>
            <div>
              <p className="font-display text-sm text-[#f0ece8]">Jeffrey Nicholas Tse</p>
              <p className="font-mono text-[9px] text-[#b6b0a6] uppercase tracking-wider">Artist / Researcher / Hong Kong</p>
            </div>
          </div>
          <p className="font-body text-[13px] text-[#b6b0a6] leading-relaxed italic">
            Jeffrey Nicholas Tse is a Hong Kong-based interdisciplinary artist and researcher whose work examines systems of preservation, mediated identity, and cultural memory. Moving across archival practice, digital interfaces, writing, and interactive media, his projects investigate how value is assigned through classification, repetition, and observation.
          </p>
        </section>

        <Footer />
      </main>
    </div>
  )
}
