import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link, useNavigate } from 'react-router'
import { ArrowRight, Dices, LayoutGrid, MapPin, Layers } from 'lucide-react'
import MatrixLanding from '../components/MatrixLanding'
import Navigation from '../components/Navigation'
import Footer from '../sections/Footer'
import WhyToiletPaper from '../sections/WhyToiletPaper'
import { products } from '../data/products'
import { specimenCount, countryCount } from '../data/stats'

gsap.registerPlugin(ScrollTrigger)

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
    title: 'Living Specimen',
    desc: 'The centrepiece: one specimen enlarged into a rotating, dissected model that reveals what is hidden inside everyday packaging.',
    icon: Layers,
    color: '#c4728e',
  },
  {
    to: '/exhibition?zone=zone-extinct',
    num: 'III',
    title: 'The Extinction Corner',
    desc: 'A quieter space for discontinued packaging — objects that have already disappeared from circulation.',
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

export default function Home() {
  const [entered, setEntered] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('rollcall-entered') === 'true'
    }
    return false
  })
  const heroRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!entered) return
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
  }, [entered])

  const handleEnter = () => {
    setEntered(true)
    sessionStorage.setItem('rollcall-entered', 'true')
  }

  if (!entered) {
    return <MatrixLanding onEnter={handleEnter} />
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      <Navigation />

      <main ref={heroRef}>
        {/* Hero — idea first */}
        <section className="min-h-[82vh] flex flex-col items-center justify-center px-6 text-center">
          <div className="hero-item mb-10">
            <div className="flex items-center justify-center gap-4">
              <span className="w-12 h-px bg-[#c28223]/40" />
              <p className="font-mono text-[10px] uppercase tracking-[0.5em] text-[#c28223]/60">Est. 2026 &middot; Material Culture Archive</p>
              <span className="w-12 h-px bg-[#c28223]/40" />
            </div>
          </div>

          <h1 className="hero-item font-display text-[10vw] sm:text-[8vw] md:text-[64px] lg:text-[76px] text-[#f0ece8] leading-[1.02] tracking-tight max-w-[14ch]">
            What deserves<br className="hidden sm:block" /> to be archived?
          </h1>

          <p className="hero-item font-serif-display text-lg sm:text-xl italic text-[#a09890] max-w-xl mt-8 leading-relaxed">
            When does an everyday object stop being disposable and become cultural heritage?
          </p>

          <p className="hero-item font-body text-[15px] sm:text-base text-[#a8a29a] max-w-[560px] mt-8 leading-relaxed">
            <span className="text-[#f0ece8]">Roll Call</span> is an evolving archive documenting everyday
            consumer packaging across Asia — beginning with the most universal object of all.
          </p>

          {/* Two CTAs */}
          <div className="hero-item flex flex-wrap items-center justify-center gap-4 mt-12">
            <Link to="/collection" className="group inline-flex items-center gap-3 px-6 py-3 bg-[#c28223] hover:bg-[#d49a3f] rounded-2xl transition-all">
              <span className="font-body text-sm text-[#0d0d0d] font-medium">Enter the Archive</span>
              <ArrowRight className="w-4 h-4 text-[#0d0d0d] group-hover:translate-x-1 transition-transform" strokeWidth={2} />
            </Link>
            <button
              onClick={() => {
                const p = products[Math.floor(Math.random() * products.length)]
                navigate(`/product/${p.id}`)
              }}
              className="group inline-flex items-center gap-3 px-6 py-3 bg-[#141414] border border-white/[0.06] hover:border-[#c28223]/30 rounded-2xl transition-all cursor-pointer"
            >
              <Dices className="w-4 h-4 text-[#c28223]" strokeWidth={1.5} />
              <span className="font-body text-sm text-[#f0ece8]">Random Specimen</span>
            </button>
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
              <p className="font-mono text-[10px] uppercase tracking-wider text-[#a8a29a] mt-2">Archived Specimens</p>
            </div>
            <div>
              <p className="font-display text-4xl sm:text-5xl text-[#f0ece8]">{countryCount}</p>
              <p className="font-mono text-[10px] uppercase tracking-wider text-[#a8a29a] mt-2">Countries</p>
            </div>
            <div>
              <p className="font-display text-4xl sm:text-5xl text-[#f0ece8]">3</p>
              <p className="font-mono text-[10px] uppercase tracking-wider text-[#a8a29a] mt-2">Regions</p>
            </div>
            <div>
              <p className="font-display text-4xl sm:text-5xl text-[#c28223]">∞</p>
              <p className="font-mono text-[10px] uppercase tracking-wider text-[#a8a29a] mt-2">Growing Archive</p>
            </div>
          </div>
          <p className="font-body text-[14px] leading-relaxed text-[#a8a29a] max-w-[640px] mt-10">
            The first edition of Roll Call documents {specimenCount} verified specimens collected across {countryCount} Asian
            countries. Rather than a complete survey, this initial collection establishes the foundation of an
            archive intended to expand over time through continued research and public contribution.
          </p>
        </section>

        {/* Why toilet paper */}
        <WhyToiletPaper />

        {/* The exhibition, in three parts */}
        <section className="nav-cards max-w-[1100px] mx-auto px-6 sm:px-8 py-16 border-t border-white/[0.04]">
          <div className="flex items-center gap-3 mb-8">
            <span className="w-8 h-px bg-[#c28223]/40" />
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
                  <span className="font-mono text-[10px] text-[#a8a29a] tracking-[0.25em]">{c.num}</span>
                </div>
                <h2 className="font-display text-xl text-[#f0ece8] mb-2 group-hover:text-[#c28223] transition-colors">{c.title}</h2>
                <p className="font-body text-[13px] text-[#a8a29a] leading-relaxed mb-6 flex-1">{c.desc}</p>
                <ArrowRight className="w-4 h-4 text-[#a8a29a] group-hover:text-[#c28223] group-hover:translate-x-1 transition-all" strokeWidth={1.5} />
              </Link>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-8">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#a8a29a]">Also</span>
            {secondaryLinks.map((l) => (
              <Link key={l.to} to={l.to} className="font-body text-[13px] text-[#a8a29a] hover:text-[#f0ece8] transition-colors">{l.label}</Link>
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
              <p className="font-mono text-[9px] text-[#a8a29a] uppercase tracking-wider">Artist / Researcher / Hong Kong</p>
            </div>
          </div>
          <p className="font-body text-[13px] text-[#a8a29a] leading-relaxed italic">
            Jeffrey Nicholas Tse is a Hong Kong-based interdisciplinary artist and researcher whose work examines systems of preservation, mediated identity, and cultural memory. Moving across archival practice, digital interfaces, writing, and interactive media, his projects investigate how value is assigned through classification, repetition, and observation.
          </p>
        </section>

        <Footer />
      </main>
    </div>
  )
}
