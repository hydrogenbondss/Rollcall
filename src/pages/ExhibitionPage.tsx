import { useEffect, useRef, useState, lazy, Suspense } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link } from 'react-router'
import { ArrowLeft, LayoutGrid, MapPin, Monitor, BookOpen, FileText, Users, Lightbulb } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const ExhibitionFloorPlan3D = lazy(() => import('../components/ExhibitionFloorPlan3D'))

const coreZones = [
  { 
    title: 'The Vitrine Wall', 
    blurb: 'Close encounters with individual specimens.',
    desc: 'A long wall lined with small museum-style vitrines. Each holds one physical specimen alongside a printed catalog card, allowing visitors to engage slowly and notice subtle patterns across the collection.',
    color: '#c28223' 
  },
  { 
    title: 'The Extinction Corner', 
    blurb: 'A quiet space for what no longer exists.',
    desc: 'A dimly lit area dedicated to discontinued or no-longer-produced packaging. The reduced atmosphere invites reflection on objects that have disappeared from circulation.',
    color: '#c85a32' 
  },
  { 
    title: 'The Submission Desk', 
    blurb: 'An open point for the archive to grow.',
    desc: 'A station where visitors can learn how to document and contribute new specimens. This keeps the project alive and participatory beyond any single presentation.',
    color: '#f0ece8' 
  },
]

const futureZones = [
  { 
    title: 'The Scatter Plot Floor', 
    blurb: 'Data experienced through movement.',
    desc: 'A large-scale floor projection where visitors could physically move through data visualizations and interact with different comparisons between specimens.',
    color: '#c4728e' 
  },
  { 
    title: 'The Essay Room', 
    blurb: 'The essay at architectural scale.',
    desc: 'A potential darkened space where the essay could be experienced through projected text and sound, creating a more immersive encounter with the writing.',
    color: '#228b68' 
  },
  { 
    title: 'The Map Wall', 
    blurb: 'Geography made visible.',
    desc: 'A large printed map of Asia with interactive elements, allowing visitors to explore the geographic origins and distribution of the collected specimens.',
    color: '#8b7ec8' 
  },
]

const zoneNavItems = [
  { label: 'Vitrine Wall', id: 'zone-vitrine', color: '#c28223' },
  { label: 'Extinction Corner', id: 'zone-extinct', color: '#c85a32' },
  { label: 'Submission Desk', id: 'zone-submit', color: '#f0ece8' },
  { label: 'Extended Vision', id: 'future-ideas', color: '#888' },
  { label: 'Realization', id: 'practical-info', color: '#888' },
]

export default function ExhibitionPage() {
  const pageRef = useRef<HTMLDivElement>(null)
  const [activeZone, setActiveZone] = useState<string>('zone-vitrine')

  useEffect(() => {
    const page = pageRef.current
    if (!page) return

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.ex-section').forEach((section) => {
        gsap.fromTo(section.querySelectorAll('.ex-item'),
          { opacity: 0, y: 30 },
          { scrollTrigger: { trigger: section, start: 'top 80%', toggleActions: 'play none none none' }, opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out' }
        )
      })
    }, page)

    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((entry) => { if (entry.isIntersecting) setActiveZone(entry.target.id) }) },
      { rootMargin: '-30% 0px -60% 0px' }
    )

    document.querySelectorAll('[data-zone-section]').forEach((el) => observer.observe(el))

    return () => { ctx.revert(); observer.disconnect() }
  }, [])

  const scrollToZone = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div ref={pageRef} className="min-h-screen bg-[#0d0d0d] text-[#f0ece8]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-[#0d0d0d]/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 group">
            <ArrowLeft className="w-4 h-4 text-[#888] group-hover:text-[#f0ece8] transition-colors" />
            <span className="font-display text-[15px] font-medium tracking-[0.15em] uppercase text-[#f0ece8]">Roll Call</span>
          </Link>
          <span className="font-mono text-[10px] text-[#888] uppercase tracking-wider hidden sm:block">Exhibition Vision</span>
        </div>
      </nav>

      {/* Sticky Zone Navigation */}
      <div className="fixed left-0 right-0 z-[101] bg-[#0d0d0d]/95 backdrop-blur-md border-b border-[#c28223]/10 top-16 shadow-lg shadow-black/20">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8 py-3">
          <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto no-scrollbar">
            <span className="font-mono text-[9px] text-[#888] uppercase tracking-wider shrink-0 mr-2 hidden sm:block">Sections</span>
            {zoneNavItems.map((item) => (
              <button key={item.id} onClick={() => scrollToZone(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all shrink-0 cursor-pointer ${activeZone === item.id ? 'bg-white/[0.06]' : 'hover:bg-white/[0.03]'}`}>
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: activeZone === item.id ? item.color : '#555' }} />
                <span className={`font-body text-[11px] hidden lg:block transition-colors ${activeZone === item.id ? 'text-[#f0ece8]' : 'text-[#888]'}`}>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="ex-section pt-32 pb-20 px-6 sm:px-8">
        <div className="max-w-[800px] mx-auto text-center">
          <p className="ex-item font-mono text-[10px] uppercase tracking-[0.5em] text-[#c28223] mb-6">Exhibition Vision</p>
          <h1 className="ex-item font-display text-6xl sm:text-7xl md:text-8xl tracking-tighter leading-[0.85] mb-8">The Exhibition</h1>
          <p className="ex-item font-body text-lg text-[#a09890] max-w-xl mx-auto leading-relaxed mb-12">
            A developing vision for bringing the digital archive into physical space through 
            a series of modular zones, designed to adapt to different venues and scales.
          </p>
          <div className="ex-item flex items-center justify-center gap-8 text-[#888]">
            <span className="font-mono text-[10px] uppercase tracking-wider">Open to Growth</span>
            <span className="w-1 h-1 rounded-full bg-[#555]" />
            <span className="font-mono text-[10px] uppercase tracking-wider">Developing Vision</span>
            <span className="w-1 h-1 rounded-full bg-[#555]" />
            <span className="font-mono text-[10px] uppercase tracking-wider">Growing Archive</span>
          </div>
        </div>
      </section>

      {/* Core Zones */}
      <section className="ex-section py-20 border-t border-white/[0.04]">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8">
          <div className="ex-item flex items-center gap-3 mb-3">
            <LayoutGrid className="w-4 h-4 text-[#c28223]" strokeWidth={1.5} />
            <p className="font-body text-[10px] uppercase tracking-[0.4em] text-[#888]">Core Vision</p>
          </div>
          <h2 className="ex-item font-display text-4xl sm:text-5xl mb-4">Core Zones</h2>
          <p className="ex-item font-body text-sm text-[#999] max-w-lg mb-16 leading-relaxed">
            The current vision focuses on three core zones that could form a meaningful first 
            physical presentation while remaining adaptable and open to future expansion.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {coreZones.map((zone, index) => (
              <div key={index} className="ex-item bg-[#141414] border border-white/[0.04] rounded-2xl p-6 hover:border-white/[0.08] transition-all group cursor-pointer">
                <div className="mb-3">
                  <h3 className="font-display text-xl text-[#f0ece8] mb-1 group-hover:text-[#c28223] transition-colors">
                    {zone.title}
                  </h3>
                  <p className="font-body text-[13px] text-[#c28223]">
                    {zone.blurb}
                  </p>
                </div>
                <p className="font-body text-[12px] text-[#999] leading-relaxed">
                  {zone.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Extended Vision */}
      <section id="future-ideas" data-zone-section className="ex-section py-20 border-t border-white/[0.04] scroll-mt-28">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8">
          <div className="ex-item flex items-center gap-3 mb-3">
            <Lightbulb className="w-4 h-4 text-[#c28223]" strokeWidth={1.5} />
            <p className="font-body text-[10px] uppercase tracking-[0.4em] text-[#888]">Extended Vision</p>
          </div>
          <h2 className="ex-item font-display text-4xl sm:text-5xl mb-4">Extended Vision</h2>
          <p className="ex-item font-body text-sm text-[#999] max-w-lg mb-12 leading-relaxed">
            In addition to the core presentation, several further directions remain conceptually possible. 
            These could be developed in future phases depending on available resources, venue partnerships, 
            and opportunities for collaboration.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {futureZones.map((zone, index) => (
              <div key={index} className="ex-item bg-[#141414] border border-white/[0.04] rounded-2xl p-6 hover:border-white/[0.08] transition-all">
                <div className="mb-3">
                  <h3 className="font-display text-xl text-[#f0ece8] mb-1">
                    {zone.title}
                  </h3>
                  <p className="font-body text-[13px] text-[#c28223]">
                    {zone.blurb}
                  </p>
                </div>
                <p className="font-body text-[12px] text-[#999] leading-relaxed">
                  {zone.desc}
                </p>
              </div>
            ))}
          </div>

          {/* 3D Floor Plan */}
          <div className="ex-item mt-12">
            <div className="flex items-center gap-3 mb-3">
              <MapPin className="w-4 h-4 text-[#c28223]" strokeWidth={1.5} />
              <p className="font-body text-[10px] uppercase tracking-[0.4em] text-[#888]">Spatial Thinking</p>
            </div>
            <h3 className="ex-item font-display text-3xl mb-4">Floor Plan Exploration</h3>
            <p className="ex-item font-body text-sm text-[#999] max-w-lg mb-6">
              An interactive 3D model exploring how different zones could be arranged within a single space.
            </p>
            <div className="hidden md:block ex-item" style={{ height: '450px' }}>
              <ErrorBoundary fallback={
                <div className="w-full h-full flex items-center justify-center bg-[#141414] rounded-2xl border border-white/[0.04]">
                  <p className="font-mono text-sm text-[#888]">Failed to load 3D model</p>
                </div>
              }>
                <Suspense fallback={
                  <div className="w-full h-full flex items-center justify-center bg-[#141414] rounded-2xl border border-white/[0.04]">
                    <p className="font-mono text-[10px] text-[#888] uppercase tracking-wider">Loading 3D Model...</p>
                  </div>
                }>
                  <ExhibitionFloorPlan3D />
                </Suspense>
              </ErrorBoundary>
            </div>
          </div>
        </div>
      </section>

      {/* Possible Realization */}
      <section id="practical-info" data-zone-section className="ex-section py-20 border-t border-white/[0.04] scroll-mt-28">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8">
          <div className="ex-item flex items-center gap-3 mb-3">
            <FileText className="w-4 h-4 text-[#c28223]" strokeWidth={1.5} />
            <p className="font-body text-[10px] uppercase tracking-[0.4em] text-[#888]">Project Details</p>
          </div>
          <h2 className="ex-item font-display text-4xl sm:text-5xl mb-4">Possible Realization</h2>
          <p className="ex-item font-body text-sm text-[#999] max-w-xl mb-12 leading-relaxed">
            A realistic breakdown of what it could take to move from a confirmed venue to a first public presentation.
          </p>

          {/* Keep your existing timeline content here if you want */}
        </div>
      </section>

      {/* Back to Archive CTA */}
      <section className="ex-section py-16 border-t border-white/[0.04]">
        <div className="max-w-[800px] mx-auto px-6 sm:px-8 text-center">
          <Link to="/" className="group inline-flex items-center gap-4 bg-[#141414] hover:bg-[#1a1a1a] border border-white/[0.06] hover:border-[#c28223]/30 rounded-2xl px-8 py-5 transition-all">
            <ArrowLeft className="w-5 h-5 text-[#c28223] group-hover:-translate-x-1 transition-transform" strokeWidth={1.5} />
            <div className="text-left">
              <p className="font-mono text-[9px] text-[#c28223] uppercase tracking-[0.3em]">Back to Archive</p>
              <p className="font-body text-[14px] text-[#f0ece8] mt-0.5">Browse 43 specimens · Explore the data · Read the essay</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/[0.04]">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-baseline gap-4">
              <span className="font-display text-[15px] font-medium tracking-[0.15em] uppercase text-[#f0ece8]">ROLL CALL</span>
              <span className="font-mono text-[9px] tracking-[0.2em] text-[#888] uppercase">Material Culture Archive</span>
            </div>
            <div className="flex items-center gap-6 text-[#888]">
              <span className="font-mono text-[10px] text-[#f0ece8]/40 tracking-wide">Jeffrey Nicholas Tse</span>
              <span className="w-px h-3 bg-white/10" />
              <span className="font-mono text-[10px] text-[#f0ece8]/40 tracking-wide">43 specimens</span>
              <span className="w-px h-3 bg-white/10" />
              <span className="font-mono text-[10px] text-[#f0ece8]/40 tracking-wide">21 countries</span>
              <span className="w-px h-3 bg-white/10" />
              <span className="font-mono text-[10px] text-[#f0ece8]/40 tracking-wide">Est. 2026</span>
            </div>
          </div>
          <p className="font-mono text-[10px] text-[#f0ece8]/20 text-center mt-8">This archive is a work in progress. It will remain incomplete by design.</p>
        </div>
      </footer>
    </div>
  )
}

// Error Boundary
class ErrorBoundary extends React.Component<{ children: React.ReactNode; fallback: React.ReactNode }> {
  state = { hasError: false }
  static getDerivedStateFromError() { return { hasError: true } }
  render() { return this.state.hasError ? this.props.fallback : this.props.children }
}
