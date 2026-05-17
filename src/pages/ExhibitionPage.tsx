import { useEffect, useRef, useState, lazy, Suspense } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link } from 'react-router'
import { ArrowLeft, LayoutGrid, MapPin, Monitor, BookOpen, FileText, Users, Lightbulb } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const ExhibitionFloorPlan3D = lazy(() => import('../components/ExhibitionFloorPlan3D'))

const zones = [
  { num: '01', title: 'The Vitrine Wall', desc: '43 glass display boxes mounted on a long dark wall. Each contains one physical product specimen with a printed catalog card.', color: '#c28223' },
  { num: '02', title: 'The Scatter Plot Floor', desc: 'A large projected data visualization on the floor. Visitors toggle between Price vs Ply and GDP vs Ply. Touchable dots reveal product details.', color: '#c4728e' },
  { num: '03', title: 'The Extinction Corner', desc: 'Two larger vitrines with dimmer lighting. Contains final known packaging of extinct and discontinued products. Red LED accent.', color: '#c85a32' },
  { num: '04', title: 'The Essay Room', desc: 'A darkened room with "One-Ply Realism" projected word-by-word onto a wall. Ambient sound shifts as paragraphs appear.', color: '#228b68' },
  { num: '05', title: 'The Map Wall', desc: 'Large-scale printed map of Asia with colored specimen dots. Touchscreen overlay: tap a country to see all products from that nation.', color: '#8b7ec8' },
  { num: '06', title: 'The Submission Desk', desc: 'An iPad with the open submission form. A sign reads: "The next specimen could come from you." Guidelines in Chinese and English.', color: '#f0ece8' },
]

const zoneNavItems = [
  { num: '01', label: 'Vitrine', id: 'zone-01', color: '#c28223' },
  { num: '02', label: 'Scatter', id: 'zone-02', color: '#c4728e' },
  { num: '03', label: 'Extinct', id: 'zone-03', color: '#c85a32' },
  { num: '04', label: 'Essay', id: 'zone-04', color: '#228b68' },
  { num: '05', label: 'Map', id: 'zone-05', color: '#8b7ec8' },
  { num: '06', label: 'Submit', id: 'zone-06', color: '#f0ece8' },
  { num: 'FL', label: 'Floor Plan', id: 'floor-plan', color: '#888' },
  { num: 'PR', label: 'Production', id: 'practical-info', color: '#888' },
]

export default function ExhibitionPage() {
  const pageRef = useRef<HTMLDivElement>(null)
  const [activeZone, setActiveZone] = useState<string>('zone-01')

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
          <span className="font-mono text-[10px] text-[#888] uppercase tracking-wider hidden sm:block">Exhibition Proposal</span>
        </div>
      </nav>

      {/* Sticky Zone Navigation */}
      <div className="fixed left-0 right-0 z-[101] bg-[#0d0d0d]/95 backdrop-blur-md border-b border-[#c28223]/10 top-16 shadow-lg shadow-black/20">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8 py-3">
          <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto no-scrollbar">
            <span className="font-mono text-[9px] text-[#888] uppercase tracking-wider shrink-0 mr-2 hidden sm:block">Zones</span>
            {zoneNavItems.map((item) => (
              <button key={item.id} onClick={() => scrollToZone(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all shrink-0 cursor-pointer ${activeZone === item.id ? 'bg-white/[0.06]' : 'hover:bg-white/[0.03]'}`}>
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: activeZone === item.id ? item.color : '#555' }} />
                <span className={`font-mono text-[9px] tracking-wider shrink-0 transition-colors ${activeZone === item.id ? 'text-[#f0ece8]' : 'text-[#888]'}`}>{item.num}</span>
                <span className={`font-body text-[11px] hidden lg:block transition-colors ${activeZone === item.id ? 'text-[#f0ece8]' : 'text-[#888]'}`}>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="ex-section pt-32 pb-20 px-6 sm:px-8">
        <div className="max-w-[800px] mx-auto text-center">
          <p className="ex-item font-mono text-[10px] uppercase tracking-[0.5em] text-[#c28223] mb-6">Exhibition Proposal</p>
          <h1 className="ex-item font-display text-6xl sm:text-7xl md:text-8xl tracking-tighter leading-[0.85] mb-8">The Exhibition</h1>
          <p className="ex-item font-body text-lg text-[#a09890] max-w-xl mx-auto leading-relaxed mb-12">
            Translating 43 digital specimens into a physical gallery experience. Six modular zones that can adapt to venues of varying sizes.
          </p>
          <div className="ex-item flex items-center justify-center gap-8 text-[#888]">
            <span className="font-mono text-[10px] uppercase tracking-wider">6 Zones</span>
            <span className="w-1 h-1 rounded-full bg-[#555]" />
            <span className="font-mono text-[10px] uppercase tracking-wider">Flexible Sizing</span>
            <span className="w-1 h-1 rounded-full bg-[#555]" />
            <span className="font-mono text-[10px] uppercase tracking-wider">43 Specimens</span>
          </div>
        </div>
      </section>

      {/* Zone Overview */}
      <section className="ex-section py-20 border-t border-white/[0.04]">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8">
          <div className="ex-item flex items-center gap-3 mb-3">
            <LayoutGrid className="w-4 h-4 text-[#c28223]" strokeWidth={1.5} />
            <p className="font-body text-[10px] uppercase tracking-[0.4em] text-[#888]">Overview</p>
          </div>
          <h2 className="ex-item font-display text-4xl sm:text-5xl mb-4">Six Zones</h2>
          <p className="ex-item font-body text-sm text-[#999] max-w-lg mb-16">
            The visitor moves from dark corridors of individual specimens to illuminated rooms of collective data, ending at an open desk where the archive grows.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {zones.map((zone) => (
              <div key={zone.num} className="ex-item bg-[#141414] border border-white/[0.04] rounded-2xl p-6 hover:border-white/[0.08] transition-all group cursor-pointer" onClick={() => scrollToZone(`zone-${zone.num}`)}>
                <div className="flex items-start justify-between mb-4">
                  <span className="font-mono text-[10px] text-[#888] tracking-wider">{zone.num}</span>
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: zone.color }} />
                </div>
                <h3 className="font-display text-xl text-[#f0ece8] mb-3 group-hover:text-[#c28223] transition-colors">{zone.title}</h3>
                <p className="font-body text-[12px] text-[#999] leading-relaxed">{zone.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3D Floor Plan */}
      <section id="floor-plan" data-zone-section className="ex-section py-20 border-t border-white/[0.04] scroll-mt-28">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8">
          <div className="ex-item flex items-center gap-3 mb-3">
            <MapPin className="w-4 h-4 text-[#c28223]" strokeWidth={1.5} />
            <p className="font-body text-[10px] uppercase tracking-[0.4em] text-[#888]">Interactive Model</p>
          </div>
          <h2 className="ex-item font-display text-4xl sm:text-5xl mb-4">Floor Plan</h2>
          <p className="ex-item font-body text-sm text-[#999] max-w-lg mb-12">
            A bird's-eye view of the proposed gallery layout. Six zones positioned within a single open space. Drag to orbit, scroll to zoom.
          </p>

          {/* 3D Floor Plan — desktop only, lazy loaded */}
          <div className="hidden md:block ex-item" style={{ height: '500px' }}>
            <Suspense fallback={
              <div className="w-full h-full bg-[#141414] rounded-2xl border border-white/[0.04] flex items-center justify-center">
                <p className="font-mono text-[10px] text-[#888] uppercase tracking-wider">Loading 3D Floor Plan...</p>
              </div>
            }>
              <ExhibitionFloorPlan3D />
            </Suspense>
          </div>

          <p className="ex-item font-body text-[11px] text-[#888] mt-4 text-center">
            Not to scale. Zone dimensions are approximate and will be adapted to the specific venue.
          </p>
        </div>
      </section>

      {/* Zone 01: Vitrine Wall */}
      <section id="zone-01" data-zone-section className="ex-section py-20 border-t border-white/[0.04] scroll-mt-28">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8">
          <div className="ex-item flex items-center gap-3 mb-3">
            <LayoutGrid className="w-4 h-4 text-[#c28223]" strokeWidth={1.5} />
            <p className="font-body text-[10px] uppercase tracking-[0.4em] text-[#888]">Zone 01</p>
          </div>
          <h2 className="ex-item font-display text-4xl sm:text-5xl mb-4">The Vitrine Wall</h2>
          <p className="ex-item font-body text-sm text-[#999] max-w-2xl mb-8 leading-relaxed">
            43 small museum vitrines — each 15cm × 15cm × 20cm — mounted in a single continuous row on a matte black wall. Inside each: one physical product specimen displayed on an acrylic stand with a printed catalog card below.
          </p>

          {/* Mockup Image */}
          <div className="ex-item mb-10 rounded-2xl overflow-hidden border border-white/[0.04]">
            <img src="./exhibit-vitrine-wall.jpg" alt="The Vitrine Wall" className="w-full aspect-video object-cover" />
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="ex-item bg-[#141414] rounded-2xl border border-white/[0.04] p-6">
              <h3 className="font-display text-lg text-[#f0ece8] mb-4">Catalog Card Design</h3>
              <div className="space-y-3 font-mono text-[11px] text-[#a09890]">
                <div className="flex justify-between"><span className="text-[#888]">RC-EA-JP-26-4-01</span><span>Nepia</span></div>
                <div className="flex justify-between"><span className="text-[#888]">Origin</span><span>Japan</span></div>
                <div className="flex justify-between"><span className="text-[#888]">Ply</span><span>4</span></div>
                <div className="flex justify-between"><span className="text-[#888]">Price</span><span>HK$32.76</span></div>
                <div className="w-full h-px bg-white/5 my-3" />
                <div className="flex justify-between"><span className="text-[#888]">Status</span><span className="text-[#228b68]">Verified</span></div>
              </div>
            </div>
            <div className="ex-item space-y-4">
              <div className="bg-[#141414] rounded-2xl border border-white/[0.04] p-6">
                <h3 className="font-display text-lg text-[#f0ece8] mb-3">Vitrine Specs</h3>
                <div className="space-y-2 font-body text-[12px] text-[#999]">
                  <p>Glass: UV-filtering museum glass, 4mm</p>
                  <p>Frame: Matte black aluminum, 1cm profile</p>
                  <p>Lighting: Individual warm LED (2700K) from above</p>
                  <p>Spacing: 10cm between vitrines, 120cm from floor</p>
                </div>
              </div>
            </div>
          </div>

          {/* Catalog system explanation */}
          <div className="ex-item mt-8 bg-[#141414] rounded-2xl border border-white/[0.04] p-6 sm:p-8">
            <p className="font-mono text-[10px] text-[#c28223] uppercase tracking-wider mb-6">Catalog Numbering System</p>

            {/* Example */}
            <p className="font-mono text-[10px] text-[#888] uppercase tracking-wider mb-2">Example</p>
            <p className="font-mono text-lg text-[#f0ece8] mb-1">RC-EA-JP-26-4-01</p>
            <p className="font-body text-[12px] text-[#888] mb-6">Nepia Premium Soft — 4-ply — Japan</p>

            {/* Decoded table */}
            <div className="space-y-0 font-mono text-[11px]">
              {[
                { code: 'RC', meaning: 'Project', desc: 'Roll Call' },
                { code: 'EA', meaning: 'Region', desc: 'East Asia' },
                { code: 'JP', meaning: 'Country', desc: 'Japan (ISO code)' },
                { code: '26', meaning: 'Year', desc: '2026' },
                { code: '4', meaning: 'Ply', desc: '4 layers' },
                { code: '01', meaning: 'No.', desc: 'Sequence' },
              ].map((row) => (
                <div key={row.code} className="flex items-center gap-4 py-2.5 border-b border-white/[0.03]">
                  <span className="text-[#f0ece8] font-semibold w-8">{row.code}</span>
                  <span className="text-[#c28223] w-16">{row.meaning}</span>
                  <span className="text-[#888]">{row.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Zone 02: Scatter Plot */}
      <section id="zone-02" data-zone-section className="ex-section py-20 border-t border-white/[0.04] scroll-mt-28">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              {/* Mockup Image */}
              <div className="ex-item mb-6 rounded-2xl overflow-hidden border border-white/[0.04]">
                <img src="./exhibit-scatter-floor.jpg" alt="The Scatter Plot Floor" className="w-full aspect-video object-cover" />
              </div>
              <div className="ex-item flex items-center gap-3 mb-3">
                <Monitor className="w-4 h-4 text-[#c4728e]" strokeWidth={1.5} />
                <p className="font-body text-[10px] uppercase tracking-[0.4em] text-[#888]">Zone 02</p>
              </div>
              <h2 className="ex-item font-display text-3xl sm:text-4xl mb-4">The Scatter Plot Floor</h2>
              <p className="ex-item font-body text-sm text-[#999] leading-relaxed mb-6">
                The data visualization from the website projected at floor scale (3m × 2m). Visitors walk around the projection. Two foot pedals toggle between Price vs Ply and GDP vs Ply views.
              </p>
              <div className="ex-item bg-[#141414] rounded-2xl border border-white/[0.04] p-5">
                <p className="font-mono text-[10px] text-[#c28223] uppercase tracking-wider mb-2">Key Finding</p>
                <p className="font-body text-[13px] text-[#f0ece8] leading-relaxed">
                  GDP per capita and toilet paper ply show a correlation of 0.34. Wealthier nations systematically use thicker paper.
                </p>
              </div>
            </div>
            <div>
              {/* Mockup Image */}
              <div className="ex-item mb-6 rounded-2xl overflow-hidden border border-white/[0.04]">
                <img src="./exhibit-extinction.jpg" alt="The Extinction Corner" className="w-full aspect-video object-cover" />
              </div>
              <div className="ex-item flex items-center gap-3 mb-3">
                <Lightbulb className="w-4 h-4 text-[#c85a32]" strokeWidth={1.5} />
                <p className="font-body text-[10px] uppercase tracking-[0.4em] text-[#888]">Zone 03</p>
              </div>
              <h2 className="ex-item font-display text-3xl sm:text-4xl mb-4">The Extinction Corner</h2>
              <p className="ex-item font-body text-sm text-[#999] leading-relaxed mb-6">
                Two larger vitrines with dimmer lighting. Each contains the final known packaging of an extinct or discontinued product. Red LED strips at the base create a memorial atmosphere.
              </p>
              <div className="ex-item space-y-3">
                <div className="bg-[#141414] rounded-xl border border-[#c85a32]/10 p-4">
                  <p className="font-mono text-[9px] text-[#c85a32] uppercase tracking-wider mb-1">Extinct</p>
                  <p className="font-body text-[12px] text-[#f0ece8]">Myanmar Yangon International — Manufacturer ceased operations 2026</p>
                </div>
                <div className="bg-[#141414] rounded-xl border border-[#c28223]/10 p-4">
                  <p className="font-mono text-[9px] text-[#c28223] uppercase tracking-wider mb-1">Discontinued</p>
                  <p className="font-body text-[12px] text-[#f0ece8]">Andrex Family Soft — Reformulated by Kimberly-Clark, March 2026</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Zone 04: Essay */}
      <section id="zone-04" data-zone-section className="ex-section py-20 border-t border-white/[0.04] scroll-mt-28">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              {/* Mockup Image */}
              <div className="ex-item mb-6 rounded-2xl overflow-hidden border border-white/[0.04]">
                <img src="./exhibit-essay-room.jpg" alt="The Essay Room" className="w-full aspect-video object-cover" />
              </div>
              <div className="ex-item flex items-center gap-3 mb-3">
                <BookOpen className="w-4 h-4 text-[#228b68]" strokeWidth={1.5} />
                <p className="font-body text-[10px] uppercase tracking-[0.4em] text-[#888]">Zone 04</p>
              </div>
              <h2 className="ex-item font-display text-3xl sm:text-4xl mb-4">The Essay Room</h2>
              <p className="ex-item font-body text-sm text-[#999] leading-relaxed">
                A darkened room seating 8-12 visitors. The essay "One-Ply Realism" is projected word-by-word onto the far wall — the same scroll-reveal animation from the website, but at architectural scale. A single row of low benches faces the projection.
              </p>
            </div>
            <div>
              {/* Mockup Image */}
              <div className="ex-item mb-6 rounded-2xl overflow-hidden border border-white/[0.04]">
                <img src="./exhibit-map-wall.jpg" alt="The Map Wall" className="w-full aspect-video object-cover" />
              </div>
              <div className="ex-item flex items-center gap-3 mb-3">
                <MapPin className="w-4 h-4 text-[#8b7ec8]" strokeWidth={1.5} />
                <p className="font-body text-[10px] uppercase tracking-[0.4em] text-[#888]">Zone 05</p>
              </div>
              <h2 className="ex-item font-display text-3xl sm:text-4xl mb-4">The Map Wall</h2>
              <p className="ex-item font-body text-sm text-[#999] leading-relaxed">
                A large-scale printed map of Asia (2m × 1.5m) on a lightbox wall. Colored dots mark each specimen's origin. A touchscreen overlay allows visitors to tap any country and see all products from that nation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Zone 06: Submission */}
      <section id="zone-06" data-zone-section className="ex-section py-20 border-t border-white/[0.04] scroll-mt-28">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8">
          {/* Mockup Image */}
          <div className="ex-item mb-8 rounded-2xl overflow-hidden border border-white/[0.04]">
            <img src="./exhibit-submission-desk.jpg" alt="The Submission Desk" className="w-full aspect-video object-cover" />
          </div>
          <div className="ex-item flex items-center gap-3 mb-3">
            <Users className="w-4 h-4 text-[#f0ece8]" strokeWidth={1.5} />
            <p className="font-body text-[10px] uppercase tracking-[0.4em] text-[#888]">Zone 06</p>
          </div>
          <h2 className="ex-item font-display text-4xl sm:text-5xl mb-4">The Submission Desk</h2>
          <p className="ex-item font-body text-sm text-[#999] max-w-2xl mb-12 leading-relaxed">
            The archive's growth point. An iPad displays the open submission form. Printed guidelines in Chinese and English explain how to document a specimen.
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            {['Photograph', 'Document', 'Submit'].map((step, i) => (
              <div key={i} className="ex-item bg-[#141414] rounded-2xl border border-white/[0.04] p-6">
                <span className="font-mono text-[10px] text-[#c28223] tracking-wider">Step {i + 1}</span>
                <h3 className="font-display text-lg text-[#f0ece8] mt-2 mb-3">{step}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What This Exhibition Is */}
      <section className="ex-section py-20 border-t border-white/[0.04]">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8">
          <div className="ex-item flex items-center gap-3 mb-3">
            <FileText className="w-4 h-4 text-[#c28223]" strokeWidth={1.5} />
            <p className="font-body text-[10px] uppercase tracking-[0.4em] text-[#888]">About</p>
          </div>
          <h2 className="ex-item font-display text-4xl sm:text-5xl mb-4">What This Exhibition Is</h2>
          <p className="ex-item font-body text-sm text-[#999] max-w-xl mb-4 leading-relaxed">
            Not a claim about what toilet paper means. Just 43 objects, their data, and the patterns that emerge when you look at them together.
          </p>
          <p className="ex-item font-body text-[12px] text-[#888] max-w-xl mb-12 leading-relaxed italic">
            Jeffrey Nicholas Tse is a Hong Kong-based interdisciplinary artist and researcher whose work examines systems of preservation, mediated identity, and cultural memory. Moving across archival practice, digital interfaces, writing, and interactive media, his projects investigate how value is assigned through classification, repetition, and observation.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { title: 'Community Participation', desc: 'The open submission model invites visitors to contribute specimens from their travels. The archive grows through collective observation.', icon: Users },
              { title: 'Cross-Cultural Comparison', desc: '43 products from 21 Asian countries surface patterns in pricing, materials, and design invisible when you only see your own supermarket shelf.', icon: MapPin },
              { title: 'Education', desc: 'Design students analyze packaging decisions. Cultural studies students compare how different markets present the same functional product.', icon: BookOpen },
              { title: 'Hong Kong Origin', desc: 'Conceived and built in Hong Kong. The city is the archive\'s starting point — a place where products from across Asia are available and comparable.', icon: LayoutGrid },
            ].map((item) => (
              <div key={item.title} className="ex-item bg-[#141414] rounded-2xl border border-white/[0.04] p-6 hover:border-white/[0.08] transition-all">
                <item.icon className="w-5 h-5 text-[#c28223] mb-3" strokeWidth={1.5} />
                <h3 className="font-display text-lg text-[#f0ece8] mb-2">{item.title}</h3>
                <p className="font-body text-[12px] text-[#999] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Production Timeline */}
      <section id="practical-info" data-zone-section className="ex-section py-20 border-t border-white/[0.04] scroll-mt-28">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8">
          <div className="ex-item flex items-center gap-3 mb-3">
            <FileText className="w-4 h-4 text-[#c28223]" strokeWidth={1.5} />
            <p className="font-body text-[10px] uppercase tracking-[0.4em] text-[#888]">Project Details</p>
          </div>
          <h2 className="ex-item font-display text-4xl sm:text-5xl mb-4">Production Timeline</h2>
          <p className="ex-item font-body text-sm text-[#999] max-w-xl mb-12 leading-relaxed">
            A realistic breakdown of what it takes to go from a confirmed venue to opening day.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="ex-item bg-[#141414] rounded-2xl border border-white/[0.04] p-6">
              <h3 className="font-mono text-[10px] uppercase tracking-wider text-[#888] mb-2">Artist / Curator</h3>
              <p className="font-display text-lg text-[#f0ece8]">Jeffrey Nicholas Tse</p>
              <p className="font-body text-[12px] text-[#999] mt-2 leading-relaxed">Hong Kong-based interdisciplinary artist and researcher examining preservation, identity, and cultural memory.</p>
            </div>
            <div className="ex-item bg-[#141414] rounded-2xl border border-white/[0.04] p-6">
              <h3 className="font-mono text-[10px] uppercase tracking-wider text-[#888] mb-2">Budget</h3>
              <p className="font-display text-lg text-[#f0ece8]">To Be Determined</p>
              <p className="font-body text-[12px] text-[#999] mt-2 leading-relaxed">Costs depend on venue and scale. A minimal version is achievable on a modest budget.</p>
            </div>
            <div className="ex-item bg-[#141414] rounded-2xl border border-white/[0.04] p-6">
              <h3 className="font-mono text-[10px] uppercase tracking-wider text-[#888] mb-2">Venue</h3>
              <p className="font-display text-lg text-[#f0ece8]">Seeking Partners</p>
              <p className="font-body text-[12px] text-[#999] mt-2 leading-relaxed">Open to Hong Kong galleries, cultural centres, libraries, or arts festivals.</p>
            </div>
            <div className="ex-item bg-[#141414] rounded-2xl border border-white/[0.04] p-6">
              <h3 className="font-mono text-[10px] uppercase tracking-wider text-[#888] mb-2">Estimated Total</h3>
              <p className="font-display text-lg text-[#f0ece8]">3-5 Months</p>
              <p className="font-body text-[12px] text-[#999] mt-2 leading-relaxed">From confirmed venue to opening day.</p>
            </div>
          </div>

          <div className="ex-item space-y-4">
            {[
              { phase: 'Phase 1', title: 'Sourcing Physical Specimens', weeks: '8-12 weeks', desc: 'The longest phase. 43 products from 21 countries need to be physically acquired. For countries with products available in Hong Kong — shop locally. For harder-to-source countries — rely on online orders, traveller networks, or printed facsimiles as fallback.' },
              { phase: 'Phase 2', title: 'Fabrication & Printing', weeks: '4-5 weeks', desc: 'Order acrylic display boxes from a Hong Kong fabricator. Print catalog cards on archival cardstock. Print large-format map, signage, and submission forms. Source a short-throw projector. All vendors are local.' },
              { phase: 'Phase 3', title: 'Installation', weeks: '1-2 weeks', desc: 'Gallery setup: mount vitrines, install projector, arrange seating, set up Map Wall and Submission Desk. Test everything. Soft opening before public launch.' },
            ].map((item) => (
              <div key={item.phase} className="bg-[#141414] rounded-2xl border border-white/[0.04] p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="shrink-0">
                    <span className="font-mono text-[10px] text-[#c28223] tracking-wider">{item.phase}</span>
                    <span className="font-mono text-[10px] text-[#888] tracking-wider ml-3">{item.weeks}</span>
                  </div>
                  <div>
                    <h4 className="font-display text-xl text-[#f0ece8] mb-2">{item.title}</h4>
                    <p className="font-body text-[13px] text-[#999] leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
            <div className="bg-[#c28223]/5 rounded-2xl border border-[#c28223]/10 p-6 sm:p-8">
              <p className="font-mono text-[10px] text-[#c28223] uppercase tracking-wider mb-2">Note on Specimens</p>
              <p className="font-body text-[13px] text-[#f0ece8]/80 leading-relaxed">
                Not all 43 specimens need to be physical packaging. Where original packaging cannot be sourced, a high-resolution print mounted on foam board serves as a valid archival surrogate. This is common practice in design museums.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Back to Archive CTA */}
      <section className="ex-section py-16 border-t border-white/[0.04]">
        <div className="max-w-[800px] mx-auto px-6 sm:px-8 text-center">
          <Link
            to="/"
            className="group inline-flex items-center gap-4 bg-[#141414] hover:bg-[#1a1a1a] border border-white/[0.06] hover:border-[#c28223]/30 rounded-2xl px-8 py-5 transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-[#c28223] group-hover:-translate-x-1 transition-transform" strokeWidth={1.5} />
            <div className="text-left">
              <p className="font-mono text-[9px] text-[#c28223] uppercase tracking-[0.3em]">Back to Archive</p>
              <p className="font-body text-[14px] text-[#f0ece8] mt-0.5">Browse 43 specimens · Explore the data · Read the essay</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="ex-section py-20 border-t border-white/[0.04]">
        <div className="max-w-[800px] mx-auto px-6 sm:px-8 text-center">
          <p className="ex-item font-mono text-[10px] uppercase tracking-[0.5em] text-[#c28223] mb-4">Open for Collaboration</p>
          <h2 className="ex-item font-display text-3xl sm:text-4xl mb-6">This exhibition needs a home</h2>
          <p className="ex-item font-body text-sm text-[#999] max-w-lg mx-auto mb-8 leading-relaxed">
            Seeking a Hong Kong gallery or cultural institution to host the inaugural presentation. The exhibition is designed to be lightweight, modular, and adaptable.
          </p>
          <div className="ex-item flex items-center justify-center gap-6 text-[#888]">
            <span className="font-mono text-[10px] uppercase tracking-wider">Roll Call · 2026</span>
            <span className="w-1 h-1 rounded-full bg-[#555]" />
            <span className="font-mono text-[10px] uppercase tracking-wider">Hong Kong</span>
            <span className="w-1 h-1 rounded-full bg-[#555]" />
            <span className="font-mono text-[10px] uppercase tracking-wider">Open for Venues</span>
          </div>
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
