import { useState, useEffect, useRef, lazy, Suspense } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link, useNavigate } from 'react-router'
import { ArrowRight, Dices, LayoutGrid, FileText, BookOpen, MapPin } from 'lucide-react'
import MatrixLanding from '../components/MatrixLanding'
import Navigation from '../components/Navigation'
import ExplodedToiletPaper from '../components/ExplodedToiletPaper'

const ExplodedToiletPaper3D = lazy(() => import('../components/ExplodedToiletPaper3D'))
import Footer from '../sections/Footer'
import { products } from '../data/products'

gsap.registerPlugin(ScrollTrigger)

const pages = [
  {
    to: '/collection',
    num: '01',
    title: 'Collection',
    desc: '43 specimens across 21 Asian countries. Browse, filter, and explore the archive.',
    icon: LayoutGrid,
    color: '#c28223',
    stat: '43 specimens',
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
      gsap.to('.number-roll', {
        innerText: 43,
        duration: reduced ? 0.5 : 2.5,
        snap: { innerText: 1 },
        ease: 'power2.out',
        scrollTrigger: { trigger: '.number-roll', start: 'top 85%' },
      })
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
        {/* Hero */}
        <section className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
          <div className="mb-10">
            <div className="flex items-center justify-center gap-4">
              <span className="w-12 h-px bg-[#c28223]/40" />
              <p className="font-mono text-[10px] uppercase tracking-[0.5em] text-[#c28223]/60">2026 &middot; Material Culture Archive</p>
              <span className="w-12 h-px bg-[#c28223]/40" />
            </div>
          </div>

          <h1 className="font-display text-[18vw] sm:text-[14vw] md:text-[11vw] lg:text-[9vw] text-[#f0ece8] leading-[0.78] uppercase" style={{ letterSpacing: '-0.05em' }}>
            ROLL<br />CALL
          </h1>

          <div className="flex items-center justify-center gap-3 my-10">
            <span className="number-roll font-display text-5xl sm:text-6xl text-[#c28223]">0</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#888] mt-4">verified specimens</span>
          </div>

          <p className="font-serif-display text-base sm:text-lg italic text-[#999] max-w-md mb-8">
            What does a society value? Look not at its monuments, but at what it chooses to make soft.
          </p>

          {/* Two CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/collection" className="group inline-flex items-center gap-3 px-6 py-3 bg-[#c28223] hover:bg-[#d49a3f] rounded-2xl transition-all">
              <span className="font-body text-sm text-[#0d0d0d] font-medium">Browse Collection</span>
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

        {/* Where it stands today (bridging line) */}
        <section className="max-w-[800px] mx-auto px-6 sm:px-8 pt-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#c28223] mb-2">
            Where it stands today
          </p>
        </section>

        {/* Current Stage */}
        <section className="max-w-[800px] mx-auto px-6 sm:px-8 pb-16 border-t border-white/[0.04]">
          <div className="max-w-[720px]">
            <p className="font-body text-[15px] leading-relaxed text-[#999]">
              ROLL CALL currently exists as a living digital archive. Physical specimens from across Asia have been collected, photographed, and catalogued, accompanied by critical writing. The project is actively growing through ongoing research and documentation. Physical presentations remain a longer-term vision and will be developed according to available resources, venue partnerships, and collaboration opportunities.
            </p>
          </div>
        </section>

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

        {/* Exploded Material Anatomy */}
        <section className="max-w-[1100px] mx-auto px-6 sm:px-8 py-16 border-t border-white/[0.04]">
          <div className="flex items-center gap-3 mb-3">
            <svg className="w-4 h-4 text-[#00ff9d]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="4" y="4" width="16" height="16" rx="2" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="12" y1="4" x2="12" y2="20" />
            </svg>
            <p className="font-body text-[10px] uppercase tracking-[0.4em] text-[#888]">Material Anatomy</p>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl mb-4">Exploded View</h2>
          <p className="font-body text-sm text-[#999] max-w-lg mb-8 leading-relaxed">
            A toilet paper roll deconstructed. Each layer separated, labeled, and identified by material composition and ply count.
          </p>

          <div className="hidden md:block" style={{ height: '500px' }}>
            <ErrorBoundary fallback={
              <div className="w-full h-full flex items-center justify-center bg-[#141414] rounded-2xl border border-white/[0.04]">
                <p className="font-mono text-sm text-[#888]">Failed to load 3D model</p>
              </div>
            }>
              <Suspense fallback={
                <div className="w-full h-full flex items-center justify-center bg-[#141414]/30 rounded-2xl border border-white/[0.04]">
                  <p className="font-mono text-[10px] text-[#888] uppercase tracking-wider">Loading 3D Model...</p>
                </div>
              }>
                <ExplodedToiletPaper3D />
              </Suspense>
            </ErrorBoundary>
          </div>

          <div className="md:hidden">
            <ExplodedToiletPaper />
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

// Error Boundary
class ErrorBoundary extends React.Component<{ children: React.ReactNode; fallback: React.ReactNode }> {
  state = { hasError: false }
  static getDerivedStateFromError() { return { hasError: true } }
  render() { return this.state.hasError ? this.props.fallback : this.props.children }
}
