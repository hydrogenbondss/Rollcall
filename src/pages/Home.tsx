import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link, useNavigate } from 'react-router'
import { ArrowRight, Dices, LayoutGrid, FileText, BookOpen, MapPin } from 'lucide-react'
import MatrixLanding from '../components/MatrixLanding'
import Navigation from '../components/Navigation'
import Footer from '../sections/Footer'
import WhyToiletPaper from '../sections/WhyToiletPaper'
import { products } from '../data/products'
import { specimenCount, countryCount } from '../data/stats'

gsap.registerPlugin(ScrollTrigger)

const pages = [
  {
    to: '/collection',
    num: '01',
    title: 'Collection',
    desc: `${specimenCount} archived specimens across ${countryCount} Asian countries. Browse, filter, and explore the archive.`,
    icon: LayoutGrid,
    color: '#c28223',
    stat: 'The Archive',
  },
  {
    to: '/exhibition',
    num: '02',
    title: 'Exhibition',
    desc: 'A developing vision for bringing the digital archive into physical space through modular zones.',
    icon: MapPin,
    color: '#228b68',
    stat: 'Vision',
  },
  {
    to: '/about',
    num: '03',
    title: 'About',
    desc: 'Project statement, methodology, data visualisation, and the story behind the archive.',
    icon: FileText,
    color: '#c4728e',
    stat: 'Data + Methodology',
  },
  {
    to: '/essay',
    num: '04',
    title: 'Essay',
    desc: '"One-Ply Realism" — a long-form essay on toilet paper as material culture and infrastructure.',
    icon: BookOpen,
    color: '#8b7ec8',
    stat: 'One-Ply Realism',
  },
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

          <p className="hero-item font-body text-[15px] sm:text-base text-[#999] max-w-[560px] mt-8 leading-relaxed">
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
              <p className="font-mono text-[10px] uppercase tracking-wider text-[#888] mt-2">Archived Specimens</p>
            </div>
            <div>
              <p className="font-display text-4xl sm:text-5xl text-[#f0ece8]">{countryCount}</p>
              <p className="font-mono text-[10px] uppercase tracking-wider text-[#888] mt-2">Countries</p>
            </div>
            <div>
              <p className="font-display text-4xl sm:text-5xl text-[#f0ece8]">3</p>
              <p className="font-mono text-[10px] uppercase tracking-wider text-[#888] mt-2">Regions</p>
            </div>
            <div>
              <p className="font-display text-4xl sm:text-5xl text-[#c28223]">∞</p>
              <p className="font-mono text-[10px] uppercase tracking-wider text-[#888] mt-2">Growing Archive</p>
            </div>
          </div>
          <p className="font-body text-[14px] leading-relaxed text-[#999] max-w-[640px] mt-10">
            The first edition of Roll Call documents {specimenCount} verified specimens collected across {countryCount} Asian
            countries. Rather than a complete survey, this initial collection establishes the foundation of an
            archive intended to expand over time through continued research and public contribution.
          </p>
        </section>

        {/* Why toilet paper */}
        <WhyToiletPaper />

        {/* Navigation Cards */}
        <section className="nav-cards max-w-[1000px] mx-auto px-6 sm:px-8 pb-12">
          <div className="grid sm:grid-cols-2 gap-4">
            {pages.map((page) => (
              <Link
                key={page.to}
                to={page.to}
                className="nav-card group bg-[#141414] border border-white/[0.04] rounded-2xl p-6 hover:border-white/[0.08] transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <page.icon className="w-5 h-5" style={{ color: page.color }} strokeWidth={1.5} />
                  <span className="font-mono text-[10px] text-[#888] tracking-wider">{page.num}</span>
                </div>
                <h2 className="font-display text-xl text-[#f0ece8] mb-2 group-hover:text-[#c28223] transition-colors">{page.title}</h2>
                <p className="font-body text-[13px] text-[#999] leading-relaxed mb-4">{page.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-[#888] uppercase tracking-wider">{page.stat}</span>
                  <ArrowRight className="w-4 h-4 text-[#888] group-hover:text-[#c28223] group-hover:translate-x-1 transition-all" strokeWidth={1.5} />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* The Living Specimen — teaser pointing to the Exhibition */}
        <section className="max-w-[1000px] mx-auto px-6 sm:px-8 py-16 border-t border-white/[0.04]">
          <div className="bg-[#141414] border border-white/[0.04] rounded-2xl p-8 sm:p-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="max-w-[520px]">
              <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#c28223] mb-3">The Living Specimen</p>
              <h2 className="font-display text-3xl sm:text-4xl text-[#f0ece8] mb-3 leading-tight">An ordinary object, dissected like an artefact</h2>
              <p className="font-body text-sm text-[#999] leading-relaxed">
                The centrepiece of the exhibition: a single specimen enlarged into a volumetric model that
                slowly separates to reveal the layers, materials, and metadata hidden inside everyday packaging.
              </p>
            </div>
            <Link to="/exhibition" className="group inline-flex items-center gap-3 px-6 py-3 bg-[#0d0d0d] border border-white/[0.08] hover:border-[#c28223]/40 rounded-2xl transition-all shrink-0">
              <span className="font-body text-sm text-[#f0ece8]">See the Exhibition</span>
              <ArrowRight className="w-4 h-4 text-[#c28223] group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
            </Link>
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
              <p className="font-mono text-[9px] text-[#888] uppercase tracking-wider">Artist / Researcher / Hong Kong</p>
            </div>
          </div>
          <p className="font-body text-[13px] text-[#999] leading-relaxed italic">
            Jeffrey Nicholas Tse is a Hong Kong-based interdisciplinary artist and researcher whose work examines systems of preservation, mediated identity, and cultural memory. Moving across archival practice, digital interfaces, writing, and interactive media, his projects investigate how value is assigned through classification, repetition, and observation.
          </p>
        </section>

        <Footer />
      </main>
    </div>
  )
}
