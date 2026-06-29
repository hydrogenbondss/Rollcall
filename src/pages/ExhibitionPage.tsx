import { useEffect, useRef, Suspense, lazy } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link, useSearchParams } from 'react-router'
import { ArrowLeft, FileText, MapPin } from 'lucide-react'
import { specimenCount, countryCount } from '../data/stats'
import { products } from '../data/products'

// The Living Specimen reflects the archive's flagship specimen.
const featuredSpecimen = products.find((p) => p.id === 'nepia-oshiri-celeb') ?? products[0]

gsap.registerPlugin(ScrollTrigger)

import ExhibitionFloorPlan2D from '../components/ExhibitionFloorPlan2D'
const LivingSpecimen = lazy(() => import('../components/LivingSpecimenHologram'))

const futureZones = [
  {
    title: 'The Essay Room',
    blurb: 'The writing at architectural scale.',
    desc: 'A darkened space where the essay could be experienced through projected text and sound, creating a more immersive encounter with the archive’s critical voice.',
  },
  {
    title: 'The Map Wall',
    blurb: 'Geography made visible.',
    desc: 'A large printed map of Asia with interactive elements, allowing visitors to trace the geographic origins and distribution of the collected specimens.',
  },
  {
    title: 'The Submission Desk',
    blurb: 'An open point for the archive to grow.',
    desc: 'A station where visitors learn how to document and contribute new specimens, keeping the project participatory beyond any single presentation.',
  },
]

function RenderPlaceholder({ label, tint }: { label: string; tint: string }) {
  return (
    <div
      className="relative w-full rounded-2xl border border-white/[0.06] overflow-hidden flex items-center justify-center"
      style={{
        height: 360,
        background: `radial-gradient(120% 120% at 50% 0%, ${tint}22 0%, #0a0a0a 60%)`,
      }}
    >
      <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '22px 22px' }} />
      <div className="text-center px-6">
        <div className="w-12 h-px mx-auto mb-4" style={{ backgroundColor: tint }} />
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#a8a29a]">Render · {label}</p>
      </div>
    </div>
  )
}

export default function ExhibitionPage() {
  const pageRef = useRef<HTMLDivElement>(null)
  const [searchParams] = useSearchParams()

  // Deep-link: /exhibition?zone=zone-living scrolls to that component on arrival.
  useEffect(() => {
    const zone = searchParams.get('zone')
    if (!zone) return
    const t = setTimeout(() => {
      document.getElementById(zone)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 500)
    return () => clearTimeout(t)
  }, [searchParams])

  useEffect(() => {
    const page = pageRef.current
    if (!page) return

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.ex-section').forEach((section) => {
        gsap.fromTo(section.querySelectorAll('.ex-item'),
          { opacity: 0, y: 30 },
          { scrollTrigger: { trigger: section, start: 'top 85%', toggleActions: 'play none none none' }, opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out' }
        )
      })
    }, page)

    return () => { ctx.revert() }
  }, [])

  return (
    <div ref={pageRef} className="min-h-screen bg-[#0d0d0d] text-[#f0ece8]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-[#0d0d0d]/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 group">
            <ArrowLeft className="w-4 h-4 text-[#a8a29a] group-hover:text-[#f0ece8] transition-colors" />
            <span className="font-display text-[15px] font-medium tracking-[0.15em] uppercase text-[#f0ece8]">Roll Call</span>
          </Link>
          <span className="font-mono text-[10px] text-[#a8a29a] uppercase tracking-wider hidden sm:block">The Exhibition</span>
        </div>
      </nav>

      {/* Hero */}
      <section className="ex-section pt-28 pb-20 px-6 sm:px-8">
        <div className="max-w-[820px] mx-auto text-center">
          <p className="ex-item font-mono text-[10px] uppercase tracking-[0.5em] text-[#c28223] mb-6">Exhibition Proposal</p>
          <h1 className="ex-item font-display text-6xl sm:text-7xl md:text-8xl tracking-tighter leading-[0.85] mb-8">The Exhibition</h1>
          <p className="ex-item font-body text-lg text-[#a09890] max-w-xl mx-auto leading-relaxed mb-12">
            The exhibition translates a growing digital archive into physical space, inviting visitors to
            reconsider the cultural significance of everyday objects through observation, preservation, and documentation.
          </p>
          <div className="ex-item flex items-center justify-center gap-6 text-[#a8a29a]">
            <span className="font-mono text-[10px] uppercase tracking-wider">Observation</span>
            <span className="w-1 h-1 rounded-full bg-[#555]" />
            <span className="font-mono text-[10px] uppercase tracking-wider">Preservation</span>
            <span className="w-1 h-1 rounded-full bg-[#555]" />
            <span className="font-mono text-[10px] uppercase tracking-wider">Documentation</span>
          </div>
        </div>
      </section>

      {/* The Experience */}
      <section id="experience" data-zone-section className="ex-section py-20 border-t border-white/[0.04] scroll-mt-28">
        <div className="max-w-[820px] mx-auto px-6 sm:px-8">
          <p className="ex-item font-mono text-[10px] uppercase tracking-[0.4em] text-[#c28223] mb-4">01 · The Experience</p>
          <h2 className="ex-item font-display text-4xl sm:text-5xl mb-8">How visitors move through the work</h2>
          <p className="ex-item font-body text-[16px] text-[#a09890] leading-[1.85] max-w-[640px]">
            Visitors enter through <span className="text-[#f0ece8]">The Archive Wall</span>, a quiet field of
            individually framed specimens to be read slowly. At the centre, <span className="text-[#f0ece8]">The Living
            Specimen</span> enlarges a single object into a rotating, dissected model. The journey ends at
            <span className="text-[#f0ece8]"> The Extinction Corner</span> — objects that have already disappeared from
            circulation. The route moves from the everyday, to the examined, to the lost.
          </p>
        </div>
      </section>

      {/* Zone 1 — The Archive Wall */}
      <section id="zone-archive" data-zone-section className="ex-section py-20 border-t border-white/[0.04] scroll-mt-28">
        <div className="max-w-[1100px] mx-auto px-6 sm:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <div className="ex-item order-2 lg:order-1">
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#c28223] mb-4">02 · Zone One</p>
            <h2 className="font-display text-4xl sm:text-5xl mb-5">The Archive Wall</h2>
            <p className="font-body text-[15px] text-[#a09890] leading-[1.85] mb-4">
              A long wall lined with small museum-style vitrines. Each holds one physical specimen alongside a
              printed accession card, letting visitors engage slowly and notice subtle patterns across the collection.
            </p>
            <p className="font-body text-[13px] text-[#a8a29a] leading-relaxed">
              The physical collection — the everyday object presented with the attention usually reserved for artefacts.
            </p>
          </div>
          <div className="ex-item order-1 lg:order-2">
            <RenderPlaceholder label="The Archive Wall" tint="#c28223" />
          </div>
        </div>
      </section>

      {/* Zone 2 — The Living Specimen (page hero) */}
      <section id="zone-living" data-zone-section className="ex-section py-24 border-t border-white/[0.04] scroll-mt-28 bg-gradient-to-b from-[#c4728e]/[0.04] to-transparent">
        <div className="max-w-[1100px] mx-auto px-6 sm:px-8">
          <div className="ex-item text-center max-w-[720px] mx-auto mb-12">
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#c4728e] mb-4">03 · The Signature Installation</p>
            <h2 className="font-display text-5xl sm:text-6xl mb-6 leading-[0.95]">The Living Specimen</h2>
            <p className="font-body text-[16px] text-[#a09890] leading-[1.85]">
              A single archived specimen is presented as a volumetric digital object. As it slowly rotates, its
              physical components separate to reveal the layers, materials, and metadata normally hidden within an
              everyday object. By enlarging and dissecting the specimen, the installation invites visitors to examine
              an ordinary consumer product with the same attention typically reserved for museum artefacts.
            </p>
          </div>

          <div className="ex-item" style={{ height: 480 }}>
            <Suspense fallback={
              <div className="w-full h-full flex items-center justify-center bg-[#0a0a0a] rounded-2xl border border-white/[0.04]">
                <p className="font-mono text-[10px] text-[#a8a29a] uppercase tracking-wider">Loading the specimen…</p>
              </div>
            }>
              <LivingSpecimen specimen={featuredSpecimen} />
            </Suspense>
          </div>

          <p className="ex-item font-body text-[13px] text-[#a8a29a] leading-relaxed max-w-[640px] mx-auto text-center mt-8">
            Like an anatomical model in a science museum, the installation exists not for spectacle but to reveal the
            hidden structure, materials, and information that make an ordinary object worthy of archival study. The
            object on display always reflects the current featured specimen — the archive is alive, and so is its centrepiece.
          </p>
        </div>
      </section>

      {/* Zone 3 — The Extinction Corner */}
      <section id="zone-extinct" data-zone-section className="ex-section py-20 border-t border-white/[0.04] scroll-mt-28">
        <div className="max-w-[1100px] mx-auto px-6 sm:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <div className="ex-item">
            <RenderPlaceholder label="The Extinction Corner" tint="#c85a32" />
          </div>
          <div className="ex-item">
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#c85a32] mb-4">04 · Zone Three</p>
            <h2 className="font-display text-4xl sm:text-5xl mb-5">The Extinction Corner</h2>
            <p className="font-body text-[15px] text-[#a09890] leading-[1.85] mb-4">
              A dimly lit wall dedicated to discontinued or no-longer-produced packaging. The reduced atmosphere
              invites reflection on objects that have quietly disappeared from circulation.
            </p>
            <p className="font-body text-[13px] text-[#a8a29a] leading-relaxed">
              What an archive chooses to keep is also a record of what the world has already let go.
            </p>
          </div>
        </div>
      </section>

      {/* Future Development */}
      <section id="future-ideas" data-zone-section className="ex-section py-20 border-t border-white/[0.04] scroll-mt-28">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8">
          <p className="ex-item font-mono text-[10px] uppercase tracking-[0.4em] text-[#a8a29a] mb-4">05 · Future Development</p>
          <h2 className="ex-item font-display text-4xl sm:text-5xl mb-4">Future Development</h2>
          <p className="ex-item font-body text-sm text-[#a8a29a] max-w-lg mb-12 leading-relaxed">
            Beyond the core route, several directions remain conceptually possible. These could be developed in future
            phases depending on available resources, venue partnerships, and opportunities for collaboration.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {futureZones.map((zone) => (
              <div key={zone.title} className="ex-item bg-[#141414] border border-white/[0.04] rounded-2xl p-6 hover:border-white/[0.08] transition-all">
                <h3 className="font-display text-xl text-[#f0ece8] mb-1">{zone.title}</h3>
                <p className="font-body text-[13px] text-[#c28223] mb-3">{zone.blurb}</p>
                <p className="font-body text-[12px] text-[#a8a29a] leading-relaxed">{zone.desc}</p>
              </div>
            ))}
          </div>

          {/* Floor Plan */}
          <div className="ex-item mt-14">
            <div className="flex items-center gap-3 mb-3">
              <MapPin className="w-4 h-4 text-[#c28223]" strokeWidth={1.5} />
              <p className="font-body text-[10px] uppercase tracking-[0.4em] text-[#a8a29a]">Spatial Thinking</p>
            </div>
            <h3 className="ex-item font-display text-3xl mb-4">Floor Plan</h3>
            <p className="ex-item font-body text-sm text-[#a8a29a] max-w-lg mb-6">
              A proposed layout moving visitors from the Archive Wall, through the Living Specimen, to the Extinction Corner.
            </p>
            <div className="ex-item">
              <ExhibitionFloorPlan2D />
            </div>
          </div>
        </div>
      </section>

      {/* Possible Realization */}
      <section id="practical-info" data-zone-section className="ex-section py-20 border-t border-white/[0.04] scroll-mt-28">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8">
          <div className="ex-item flex items-center gap-3 mb-3">
            <FileText className="w-4 h-4 text-[#c28223]" strokeWidth={1.5} />
            <p className="font-body text-[10px] uppercase tracking-[0.4em] text-[#a8a29a]">Project Details</p>
          </div>
          <h2 className="ex-item font-display text-4xl sm:text-5xl mb-4">Possible Realization</h2>
          <p className="ex-item font-body text-sm text-[#a8a29a] max-w-xl mb-12 leading-relaxed">
            A realistic breakdown of what it could take to move from a confirmed venue to a first public presentation.
            Figures are provisional and scale with venue partnership.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              { title: 'Space', value: '60–120 m²', desc: 'Minimum viable footprint for the core route: Archive Wall, Living Specimen, and Extinction Corner. Future-development elements require additional square footage or adjacent screening.' },
              { title: 'Timeline', value: '4–6 months', desc: 'From confirmed venue to opening: 6–8 weeks design and fabrication, 4–6 weeks installation and lighting, 2–4 weeks preview and iteration.' },
              { title: 'Budget tier', value: 'HK$180k–420k', desc: 'Covers vitrine fabrication, printed accession cards, the Living Specimen projection, lighting, insurance, shipping of specimens, and a modest artist fee.' },
            ].map((item) => (
              <div key={item.title} className="ex-item bg-[#141414] border border-white/[0.04] rounded-2xl p-6">
                <p className="font-mono text-[10px] uppercase tracking-wider text-[#a8a29a] mb-2">{item.title}</p>
                <p className="font-display text-3xl text-[#f0ece8] mb-3">{item.value}</p>
                <p className="font-body text-[12px] text-[#a8a29a] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="ex-item bg-[#141414] border border-white/[0.04] rounded-2xl p-6 sm:p-8">
            <h3 className="font-display text-xl text-[#f0ece8] mb-6">Deliverables for a first presentation</h3>
            <div className="grid sm:grid-cols-2 gap-x-12 gap-y-4">
              {[
                '15–20 physical specimens in museum-style vitrines',
                'Printed accession cards matching the digital archive schema',
                'The Living Specimen: a projected, rotating dissected model',
                'Annotated Asia map locating all documented countries',
                'Submission desk with contributor guidelines and photography kit',
                'Extinction Corner lighting and discontinued-specimen display',
              ].map((d) => (
                <div key={d} className="flex items-start gap-3">
                  <span className="w-1 h-1 rounded-full bg-[#c28223] mt-2 shrink-0" />
                  <p className="font-body text-[13px] text-[#a09890] leading-relaxed">{d}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="ex-item font-body text-[12px] text-[#a8a29a] mt-6 leading-relaxed max-w-2xl">
            This section is intentionally provisional. A realized exhibition depends on the venue, audience, and funding
            context. The core principle is adaptability: the same archive can scale from a single vitrine wall in a
            library to a multi-room museum installation.
          </p>
        </div>
      </section>

      {/* Back to Archive CTA */}
      <section className="ex-section py-16 border-t border-white/[0.04]">
        <div className="max-w-[800px] mx-auto px-6 sm:px-8 text-center">
          <Link to="/collection" className="group inline-flex items-center gap-4 bg-[#141414] hover:bg-[#1a1a1a] border border-white/[0.06] hover:border-[#c28223]/30 rounded-2xl px-8 py-5 transition-all">
            <ArrowLeft className="w-5 h-5 text-[#c28223] group-hover:-translate-x-1 transition-transform" strokeWidth={1.5} />
            <div className="text-left">
              <p className="font-mono text-[9px] text-[#c28223] uppercase tracking-[0.3em]">Back to the Archive</p>
              <p className="font-body text-[14px] text-[#f0ece8] mt-0.5">Browse the collection · Explore the data · Read the essay</p>
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
              <span className="font-mono text-[9px] tracking-[0.2em] text-[#a8a29a] uppercase">Material Culture Archive</span>
            </div>
            <div className="flex items-center gap-6 text-[#a8a29a]">
              <span className="font-mono text-[10px] text-[#f0ece8]/60 tracking-wide">Jeffrey Nicholas Tse</span>
              <span className="w-px h-3 bg-white/10" />
              <span className="font-mono text-[10px] text-[#f0ece8]/60 tracking-wide">{specimenCount} specimens</span>
              <span className="w-px h-3 bg-white/10" />
              <span className="font-mono text-[10px] text-[#f0ece8]/60 tracking-wide">{countryCount} countries</span>
              <span className="w-px h-3 bg-white/10" />
              <span className="font-mono text-[10px] text-[#f0ece8]/60 tracking-wide">Est. 2026</span>
            </div>
          </div>
          <p className="font-mono text-[10px] text-[#f0ece8]/55 text-center mt-8">This archive is a work in progress. It will remain incomplete by design.</p>
        </div>
      </footer>
    </div>
  )
}
