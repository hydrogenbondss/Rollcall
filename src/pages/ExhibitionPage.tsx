import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link } from 'react-router'
import { ArrowLeft, LayoutGrid, MapPin, Monitor, BookOpen, FileText, Users, Lightbulb } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

export default function ExhibitionPage() {
  const pageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const page = pageRef.current
    if (!page) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.ex-section').forEach((section) => {
        gsap.fromTo(section.querySelectorAll('.ex-item'),
          { opacity: 0, y: 30 },
          {
            scrollTrigger: { trigger: section, start: 'top 80%', toggleActions: 'play none none none' },
            opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out',
          }
        )
      })
    }, page)
    return () => ctx.revert()
  }, [])

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

      {/* Hero */}
      <section className="ex-section pt-32 pb-20 px-6 sm:px-8">
        <div className="max-w-[800px] mx-auto text-center">
          <p className="ex-item font-mono text-[10px] uppercase tracking-[0.5em] text-[#c28223] mb-6">Hong Kong Arts Development Council · Grant Application</p>
          <h1 className="ex-item font-display text-6xl sm:text-7xl md:text-8xl tracking-tighter leading-[0.85] mb-8">
            The Exhibition
          </h1>
          <p className="ex-item font-body text-lg text-[#a09890] max-w-xl mx-auto leading-relaxed mb-12">
            A physical installation translating 43 digital specimens into a walkable archive. 
            Dark vitrines, interactive data floors, extinction memorials, and an open submission desk.
          </p>
          <div className="ex-item flex items-center justify-center gap-8 text-[#888]">
            <span className="font-mono text-[10px] uppercase tracking-wider">6 Zones</span>
            <span className="w-1 h-1 rounded-full bg-[#555]" />
            <span className="font-mono text-[10px] uppercase tracking-wider">~200 sqm</span>
            <span className="w-1 h-1 rounded-full bg-[#555]" />
            <span className="font-mono text-[10px] uppercase tracking-wider">43 Specimens</span>
          </div>
        </div>
      </section>

      {/* Exhibition Overview */}
      <section className="ex-section py-20 border-t border-white/[0.04]">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8">
          <div className="ex-item flex items-center gap-3 mb-3">
            <LayoutGrid className="w-4 h-4 text-[#c28223]" strokeWidth={1.5} />
            <p className="font-body text-[10px] uppercase tracking-[0.4em] text-[#888]">Floor Plan</p>
          </div>
          <h2 className="ex-item font-display text-4xl sm:text-5xl mb-4">Six Zones</h2>
          <p className="ex-item font-body text-sm text-[#999] max-w-lg mb-16">
            The visitor moves from dark corridors of individual specimens to illuminated rooms of collective data, 
            ending at an open desk where the archive grows.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { num: '01', title: 'The Vitrine Wall', desc: '43 glass display boxes mounted on a long dark wall. Each contains one physical product specimen with a printed catalog card.', color: '#c28223' },
              { num: '02', title: 'The Scatter Plot Floor', desc: 'A large projected data visualization on the floor. Visitors toggle between Price vs Ply and GDP vs Ply. Touchable dots reveal product details.', color: '#c4728e' },
              { num: '03', title: 'The Extinction Corner', desc: 'Two larger vitrines with dimmer lighting. Contains final known packaging of extinct and discontinued products. Red LED accent.', color: '#c85a32' },
              { num: '04', title: 'The Essay Room', desc: 'A darkened room with "One-Ply Realism" projected word-by-word onto a wall. Ambient sound shifts as paragraphs appear.', color: '#228b68' },
              { num: '05', title: 'The Map Wall', desc: 'Large-scale printed map of Asia with colored specimen dots. Touchscreen overlay: tap a country to see all products from that nation.', color: '#8b7ec8' },
              { num: '06', title: 'The Submission Desk', desc: 'An iPad with the open submission form. A sign reads: "The next specimen could come from you." Guidelines in Chinese and English.', color: '#f0ece8' },
            ].map((zone) => (
              <div key={zone.num} className="ex-item bg-[#141414] border border-white/[0.04] rounded-2xl p-6 hover:border-white/[0.08] transition-all group">
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

      {/* Zone 1: Vitrine Wall Detail */}
      <section className="ex-section py-20 border-t border-white/[0.04]">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8">
          <div className="ex-item flex items-center gap-3 mb-3">
            <LayoutGrid className="w-4 h-4 text-[#c28223]" strokeWidth={1.5} />
            <p className="font-body text-[10px] uppercase tracking-[0.4em] text-[#888]">Zone 01</p>
          </div>
          <h2 className="ex-item font-display text-4xl sm:text-5xl mb-4">The Vitrine Wall</h2>
          <p className="ex-item font-body text-sm text-[#999] max-w-2xl mb-12 leading-relaxed">
            The heart of the exhibition. 43 small museum vitrines — each 15cm × 15cm × 20cm — 
            mounted in a single continuous row on a matte black wall. Inside each: one physical product specimen 
            (actual toilet paper packaging sourced from the respective country), displayed on a small acrylic stand 
            with a printed catalog card below.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="ex-item bg-[#141414] rounded-2xl border border-white/[0.04] p-6">
              <h3 className="font-display text-lg text-[#f0ece8] mb-4">Catalog Card Design</h3>
              <div className="space-y-3 font-mono text-[11px] text-[#a09890]">
                <div className="flex justify-between"><span className="text-[#888]">RCT.AS.0001</span><span>Nepia</span></div>
                <div className="flex justify-between"><span className="text-[#888]">Origin</span><span>Japan</span></div>
                <div className="flex justify-between"><span className="text-[#888]">Ply</span><span>4</span></div>
                <div className="flex justify-between"><span className="text-[#888]">Material</span><span>Virgin Pulp + Squalane</span></div>
                <div className="flex justify-between"><span className="text-[#888]">Price</span><span>HK$32.76</span></div>
                <div className="w-full h-px bg-white/5 my-3" />
                <div className="flex justify-between"><span className="text-[#888]">Status</span><span className="text-[#228b68]">Verified</span></div>
                <div className="flex justify-between"><span className="text-[#888]">Acquired</span><span>2026-02-14</span></div>
              </div>
            </div>
            <div className="ex-item space-y-4">
              <div className="bg-[#141414] rounded-2xl border border-white/[0.04] p-6">
                <h3 className="font-display text-lg text-[#f0ece8] mb-3">Vitrine Specifications</h3>
                <div className="space-y-2 font-body text-[12px] text-[#999]">
                  <p>Glass: UV-filtering museum glass, 4mm thickness</p>
                  <p>Frame: Matte black aluminum, 1cm profile</p>
                  <p>Lighting: Individual warm LED (2700K) from above each vitrine</p>
                  <p>Mounting: French cleat system on matte black wall</p>
                  <p>Spacing: 10cm between vitrines, 120cm from floor</p>
                </div>
              </div>
              <div className="bg-[#141414] rounded-2xl border border-white/[0.04] p-6">
                <h3 className="font-display text-lg text-[#f0ece8] mb-3">Wall Layout</h3>
                <p className="font-body text-[12px] text-[#999] leading-relaxed">
                  Vitrines arranged chronologically by acquisition date (RCT.AS.0001 → RCT.AS.0043), 
                  not by country. This prevents regional clustering and encourages cross-cultural comparison. 
                  Color-coded LED strips below each vitrine indicate region: pink (East Asia), green (Southeast Asia), orange (South Asia).
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Zone 2-3: Data & Extinction */}
      <section className="ex-section py-20 border-t border-white/[0.04]">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <div className="ex-item flex items-center gap-3 mb-3">
                <Monitor className="w-4 h-4 text-[#c4728e]" strokeWidth={1.5} />
                <p className="font-body text-[10px] uppercase tracking-[0.4em] text-[#888]">Zone 02</p>
              </div>
              <h2 className="ex-item font-display text-3xl sm:text-4xl mb-4">The Scatter Plot Floor</h2>
              <p className="ex-item font-body text-sm text-[#999] leading-relaxed mb-6">
                The data visualization from the website projected at floor scale (3m × 2m). 
                Visitors walk around the projection. Two foot pedals toggle between Price vs Ply and GDP vs Ply views. 
                Each dot is a pressure-sensitive pad — stepping on it reveals the product name, country, and price 
                on a small screen at the edge of the projection.
              </p>
              <div className="ex-item bg-[#141414] rounded-2xl border border-white/[0.04] p-5">
                <p className="font-mono text-[10px] text-[#c28223] uppercase tracking-wider mb-2">Key Finding</p>
                <p className="font-body text-[13px] text-[#f0ece8] leading-relaxed">
                  GDP per capita and toilet paper ply show a correlation of 0.34. 
                  Wealthier nations systematically use thicker paper. 
                  Hong Kong (4-ply, GDP $49,755) vs Myanmar (1-ply, GDP $1,210).
                </p>
              </div>
            </div>

            <div>
              <div className="ex-item flex items-center gap-3 mb-3">
                <Lightbulb className="w-4 h-4 text-[#c85a32]" strokeWidth={1.5} />
                <p className="font-body text-[10px] uppercase tracking-[0.4em] text-[#888]">Zone 03</p>
              </div>
              <h2 className="ex-item font-display text-3xl sm:text-4xl mb-4">The Extinction Corner</h2>
              <p className="ex-item font-body text-sm text-[#999] leading-relaxed mb-6">
                Two larger vitrines (30cm × 30cm × 40cm) with intentionally dimmer lighting. 
                Each contains the final known packaging of an extinct or discontinued product. 
                A small screen displays the "last observed" date and the collector's note. 
                Red LED strips at the base of each vitrine create a subtle memorial atmosphere.
              </p>
              <div className="ex-item space-y-3">
                <div className="bg-[#141414] rounded-xl border border-[#8b2500]/10 p-4">
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

      {/* Zone 4-5: Essay & Map */}
      <section className="ex-section py-20 border-t border-white/[0.04]">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <div className="ex-item flex items-center gap-3 mb-3">
                <BookOpen className="w-4 h-4 text-[#228b68]" strokeWidth={1.5} />
                <p className="font-body text-[10px] uppercase tracking-[0.4em] text-[#888]">Zone 04</p>
              </div>
              <h2 className="ex-item font-display text-3xl sm:text-4xl mb-4">The Essay Room</h2>
              <p className="ex-item font-body text-sm text-[#999] leading-relaxed mb-6">
                A darkened room seating 8-12 visitors. The essay "One-Ply Realism" is projected word-by-word 
                onto the far wall — the same scroll-reveal animation from the website, but at architectural scale. 
                As each paragraph appears, the room's ambient sound shifts: from Mumbai street noise to Singapore 
                mall air conditioning to Yangon market silence. A single row of low benches faces the projection.
              </p>
            </div>

            <div>
              <div className="ex-item flex items-center gap-3 mb-3">
                <MapPin className="w-4 h-4 text-[#8b7ec8]" strokeWidth={1.5} />
                <p className="font-body text-[10px] uppercase tracking-[0.4em] text-[#888]">Zone 05</p>
              </div>
              <h2 className="ex-item font-display text-3xl sm:text-4xl mb-4">The Map Wall</h2>
              <p className="ex-item font-body text-sm text-[#999] leading-relaxed mb-6">
                A large-scale printed map of Asia (2m × 1.5m) mounted on a lightbox wall. 
                Colored dots mark each specimen's origin country — pink for East Asia, green for Southeast Asia, 
                orange for South Asia. A touchscreen overlay allows visitors to tap any country and see all 
                products from that nation, with thumbnail images and prices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Zone 6: Submission Desk */}
      <section className="ex-section py-20 border-t border-white/[0.04]">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8">
          <div className="ex-item flex items-center gap-3 mb-3">
            <Users className="w-4 h-4 text-[#f0ece8]" strokeWidth={1.5} />
            <p className="font-body text-[10px] uppercase tracking-[0.4em] text-[#888]">Zone 06</p>
          </div>
          <h2 className="ex-item font-display text-4xl sm:text-5xl mb-4">The Submission Desk</h2>
          <p className="ex-item font-body text-sm text-[#999] max-w-2xl mb-12 leading-relaxed">
            The archive's growth point. An iPad displays the open submission form. 
            Printed guidelines in Chinese and English explain how to document a specimen. 
            A small sign: "The next specimen could come from you." Submissions feed directly into the 
            database and appear on the website within 48 hours of verification.
          </p>

          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { title: 'Photograph', desc: 'Take clear photos of the packaging front, back, and side. Include the price tag if visible.' },
              { title: 'Document', desc: 'Note the brand, ply count, material, scent, country, city, and retailer. Be specific.' },
              { title: 'Submit', desc: 'Use the form on the iPad or scan the QR code to submit via your phone. Include your collector notes.' },
            ].map((step, i) => (
              <div key={i} className="ex-item bg-[#141414] rounded-2xl border border-white/[0.04] p-6">
                <span className="font-mono text-[10px] text-[#c28223] tracking-wider">Step {i + 1}</span>
                <h3 className="font-display text-lg text-[#f0ece8] mt-2 mb-3">{step.title}</h3>
                <p className="font-body text-[12px] text-[#999] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HKADC Alignment */}
      <section className="ex-section py-20 border-t border-white/[0.04]">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8">
          <div className="ex-item flex items-center gap-3 mb-3">
            <FileText className="w-4 h-4 text-[#c28223]" strokeWidth={1.5} />
            <p className="font-body text-[10px] uppercase tracking-[0.4em] text-[#888]">Grant Application</p>
          </div>
          <h2 className="ex-item font-display text-4xl sm:text-5xl mb-4">Why HKADC</h2>
          <p className="ex-item font-body text-sm text-[#999] max-w-lg mb-12">
            This project aligns with HKADC's mission in four specific ways.
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { title: 'Community Participation', desc: 'The open submission model invites Hong Kong residents and visitors to contribute specimens from their travels. The archive grows through community eyes, not just institutional research.', icon: Users },
              { title: 'Cross-Cultural Dialogue', desc: '43 products from 21 Asian countries in one exhibition surface shared and divergent cultural values — hygiene standards, class stratification, environmental priorities — through an everyday object.', icon: MapPin },
              { title: 'Educational Value', desc: 'Designed for school visits and university courses. Design students analyze specimen data; cultural studies students compare regional differences; the archive becomes a teaching tool.', icon: BookOpen },
              { title: 'Hong Kong Origin', desc: 'Conceived, researched, and launched in Hong Kong (2026). The city is positioned as the archive\'s research hub and exhibition origin point, not just another data point.', icon: LayoutGrid },
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

      {/* Technical Requirements */}
      <section className="ex-section py-20 border-t border-white/[0.04]">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8">
          <h2 className="ex-item font-display text-3xl sm:text-4xl mb-8">Technical Requirements</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="ex-item">
              <h3 className="font-mono text-[10px] uppercase tracking-wider text-[#888] mb-3">Space</h3>
              <p className="font-body text-[13px] text-[#a09890] leading-relaxed">~200 sqm gallery space. Dark walls (matte black or deep charcoal). Climate-controlled for paper specimen preservation (20°C, 50% humidity).</p>
            </div>
            <div className="ex-item">
              <h3 className="font-mono text-[10px] uppercase tracking-wider text-[#888] mb-3">Equipment</h3>
              <p className="font-body text-[13px] text-[#a09890] leading-relaxed">46 vitrines (43 standard + 3 large), 1 floor projector (4000+ lumens), 2 touchscreens, 1 iPad, LED lighting system, audio system for Essay Room.</p>
            </div>
            <div className="ex-item">
              <h3 className="font-mono text-[10px] uppercase tracking-wider text-[#888] mb-3">Duration</h3>
              <p className="font-body text-[13px] text-[#a09890] leading-relaxed">4-week exhibition run. 1-week installation, 1-week de-installation. Opening reception with curator talk and live submission demonstration.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="ex-section py-20 border-t border-white/[0.04]">
        <div className="max-w-[800px] mx-auto px-6 sm:px-8 text-center">
          <p className="ex-item font-mono text-[10px] uppercase tracking-[0.5em] text-[#c28223] mb-4">Pending Application</p>
          <h2 className="ex-item font-display text-3xl sm:text-4xl mb-6">This exhibition needs a home</h2>
          <p className="ex-item font-body text-sm text-[#999] max-w-lg mx-auto mb-8 leading-relaxed">
            We are seeking a Hong Kong gallery or cultural institution to host the inaugural presentation 
            of Roll Call. If you represent a venue and would like to discuss a collaboration, please get in touch.
          </p>
          <div className="ex-item flex items-center justify-center gap-6 text-[#888]">
            <span className="font-mono text-[10px] uppercase tracking-wider">Project: RCT.AS.2026</span>
            <span className="w-1 h-1 rounded-full bg-[#555]" />
            <span className="font-mono text-[10px] uppercase tracking-wider">Origin: Hong Kong</span>
            <span className="w-1 h-1 rounded-full bg-[#555]" />
            <span className="font-mono text-[10px] uppercase tracking-wider">Status: Seeking Venue</span>
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
              <span className="font-mono text-[10px] text-[#f0ece8]/40 tracking-wide">43 specimens</span>
              <span className="w-px h-3 bg-white/10" />
              <span className="font-mono text-[10px] text-[#f0ece8]/40 tracking-wide">21 countries</span>
              <span className="w-px h-3 bg-white/10" />
              <span className="font-mono text-[10px] text-[#f0ece8]/40 tracking-wide">Est. 2026</span>
            </div>
          </div>
          <p className="font-mono text-[10px] text-[#f0ece8]/20 text-center mt-8">
            This archive is a work in progress. It will remain incomplete by design.
          </p>
        </div>
      </footer>
    </div>
  )
}
