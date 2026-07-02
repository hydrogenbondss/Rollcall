import { useEffect, useRef } from 'react'
import { Link } from 'react-router'
import { ArrowLeft, Printer, FileText, MapPin, BarChart3, Calendar, DollarSign, Send } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { specimenCount, countryCount, verifiedCount, communityCount } from '../data/stats'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

gsap.registerPlugin(ScrollTrigger)

export default function GrantSummaryPage() {
  const pageRef = useRef<HTMLDivElement>(null)
  useDocumentTitle('Grant Summary — Roll Call', 'Project summary for exhibition and grant review: scope, methodology, budget, and timeline.')

  useEffect(() => {
    window.scrollTo(0, 0)
    const page = pageRef.current
    if (!page) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.grant-item').forEach((item) => {
        gsap.fromTo(item,
          { opacity: 0, y: 20 },
          { scrollTrigger: { trigger: item, start: 'top 85%' }, opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
        )
      })
    }, page)
    return () => ctx.revert()
  }, [])

  const handlePrint = () => window.print()

  return (
    <div className="min-h-screen bg-white text-[#1a1a1a]" ref={pageRef}>
      {/* Nav — hidden when printing */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-white/95 backdrop-blur-md border-b border-black/5 print:hidden">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 group">
            <ArrowLeft className="w-4 h-4 text-[#4a4a4a] group-hover:text-[#1a1a1a] transition-colors" />
            <span className="font-display text-[15px] font-medium tracking-[0.15em] uppercase text-[#1a1a1a]">Roll Call</span>
          </Link>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-white rounded-full font-mono text-[10px] uppercase tracking-wider hover:bg-[#333] transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            Save as PDF
          </button>
        </div>
      </nav>

      <article className="max-w-[800px] mx-auto px-8 sm:px-12 pt-28 pb-20 print:pt-8 print:pb-8">
        {/* Header */}
        <header className="mb-12 grant-item border-b border-black/10 pb-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#4a4a4a] mb-3">Grant Summary · 2026</p>
          <h1 className="font-display text-5xl sm:text-6xl tracking-tight leading-[0.95] mb-4">
            ROLL CALL
          </h1>
          <p className="font-serif-display text-xl italic text-[#555] max-w-lg">
            A material culture archive documenting toilet paper specimens from {countryCount} countries across contemporary Asia.
          </p>
        </header>

        {/* At a glance */}
        <section className="mb-12 grant-item">
          <h2 className="font-display text-lg uppercase tracking-wider mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            At a glance
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Specimens', value: String(specimenCount) },
              { label: 'Countries', value: String(countryCount) },
              { label: 'Regions', value: '3' },
              { label: 'Verified / Community', value: `${verifiedCount} / ${communityCount}` },
            ].map((s) => (
              <div key={s.label} className="border border-black/10 rounded-xl p-4">
                <p className="font-display text-3xl">{s.value}</p>
                <p className="font-mono text-[9px] uppercase tracking-wider text-[#4a4a4a]">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Why this matters */}
        <section className="mb-12 grant-item">
          <h2 className="font-display text-lg uppercase tracking-wider mb-4">Why this project matters</h2>
          <p className="font-body text-[15px] leading-relaxed text-[#4a4a4a] mb-4">
            Toilet paper is the most intimate mass-produced object on earth. It is also an index of infrastructure: a society's pipe diameter, water pressure, purchasing power, and cultural aspiration are all compressed into a few plies.
          </p>
          <p className="font-body text-[15px] leading-relaxed text-[#4a4a4a]">
            <strong>ROLL CALL</strong> treats this ordinary object with the seriousness usually reserved for ceramics or textiles. By cataloguing specimens across East, Southeast, and South Asia, the project reveals how comfort is distributed — and who gets to be comfortable.
          </p>
        </section>

        {/* A first edition, not a final count */}
        <section className="mb-12 grant-item bg-[#fafafa] border border-black/5 rounded-2xl p-6">
          <h2 className="font-display text-lg uppercase tracking-wider mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            A first edition, not a final count
          </h2>
          <p className="font-body text-[15px] leading-relaxed text-[#4a4a4a] mb-4">
            The first edition documents {specimenCount} specimens across {countryCount} countries and three regions — {verifiedCount} verified against primary sources, the rest community-sourced — a proof of concept rather than an exhaustive inventory. The sample covers high-income economies (Japan, Singapore, Hong Kong), middle-income markets (Malaysia, Thailand, China), and lower-income contexts (Bangladesh, Nepal, Myanmar). It represents the archive at a specific moment in time and will continue to grow.
          </p>
          <p className="font-body text-[15px] leading-relaxed text-[#4a4a4a]">
            At this scale, clear patterns already emerge: GDP correlates with ply count and softness; the archive's one additive-enhanced paper — a squalane-infused Japanese roll — sits at the East Asian premium pole; South Asia's everyday market remains defined by thin, infrastructure-compatible rolls. The archive demonstrates that a replicable methodology can generate cultural insight from a modest but geographically diverse sample.
          </p>
        </section>

        {/* Key findings */}
        <section className="mb-12 grant-item">
          <h2 className="font-display text-lg uppercase tracking-wider mb-4">Key findings</h2>
          <ul className="space-y-3">
            {[
              'Hong Kong consumers pay roughly 5x more per pack than Bangladeshi consumers in this archive.',
              'East Asian products dominate the premium segment: softer multi-ply rolls, refined packaging, and the archive\'s only additive-enhanced paper.',
              'South Asian everyday rolls split between 2-ply economy packs and 3-ply aspirational lines, reflecting older plumbing infrastructure.',
              'Sustainability claims (bamboo, recycled pulp) appear across all income tiers but trade off against comfort.',
              'Frontier markets in this archive — Myanmar, Cambodia, Laos — are served by imported or OEM-produced brands rather than domestic manufacture.',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 font-body text-[15px] text-[#4a4a4a] leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c28223] mt-2.5 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Exhibition plan */}
        <section className="mb-12 grant-item">
          <h2 className="font-display text-lg uppercase tracking-wider mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Exhibition plan
          </h2>
          <p className="font-body text-[15px] leading-relaxed text-[#4a4a4a] mb-4">
            The first physical presentation proposes a three-part route — the Archive Wall, the Living Specimen, and the Extinction Corner — housed in 60–120 m². Future-development elements (the Essay Room, Map Wall, and Submission Desk) are planned for a second phase.
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { label: 'Space', value: '60–120 m²' },
              { label: 'Timeline', value: '4–6 months' },
              { label: 'Budget', value: 'HK$180k–420k' },
            ].map((s) => (
              <div key={s.label} className="border border-black/10 rounded-xl p-4">
                <p className="font-display text-2xl">{s.value}</p>
                <p className="font-mono text-[9px] uppercase tracking-wider text-[#4a4a4a]">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Use of funds */}
        <section className="mb-12 grant-item">
          <h2 className="font-display text-lg uppercase tracking-wider mb-4 flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Use of funds
          </h2>
          <div className="space-y-2">
            {[
              { item: 'Vitrine fabrication & catalogue cards', pct: '35%' },
              { item: 'Shipping, insurance & installation', pct: '25%' },
              { item: 'Artist fee & research travel', pct: '20%' },
              { item: 'Floor graphics, print & projection hire', pct: '15%' },
              { item: 'Contingency', pct: '5%' },
            ].map((row) => (
              <div key={row.item} className="flex items-center justify-between border-b border-black/5 py-2">
                <span className="font-body text-[14px] text-[#4a4a4a]">{row.item}</span>
                <span className="font-mono text-[12px] text-[#c28223]">{row.pct}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Timeline */}
        <section className="mb-12 grant-item">
          <h2 className="font-display text-lg uppercase tracking-wider mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Proposed timeline
          </h2>
          <div className="space-y-3">
            {[
              { phase: 'Months 1–2', work: 'Venue confirmation, vitrine design, final specimen selection' },
              { phase: 'Months 3–4', work: 'Fabrication, print production, shipping of specimens' },
              { phase: 'Months 5–6', work: 'Installation, lighting, preview, public opening' },
            ].map((t) => (
              <div key={t.phase} className="flex items-start gap-4">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#c28223] w-24 shrink-0">{t.phase}</span>
                <span className="font-body text-[14px] text-[#4a4a4a]">{t.work}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section className="mb-12 grant-item bg-[#1a1a1a] text-white rounded-2xl p-8 print:bg-white print:text-[#1a1a1a] print:border print:border-black/10">
          <h2 className="font-display text-lg uppercase tracking-wider mb-4 flex items-center gap-2">
            <Send className="w-4 h-4" />
            Contact
          </h2>
          <p className="font-body text-[15px] leading-relaxed mb-4 opacity-90 print:opacity-100 print:text-[#4a4a4a]">
            For exhibition proposals, academic inquiries, and grant discussions, please use the correspondence form on the archive site.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-wider opacity-60 print:opacity-100 print:text-[#4a4a4a]">Project Lead</p>
              <p className="font-body text-[14px]">Jeffrey Nicholas Tse</p>
            </div>
            <div>
              <p className="font-mono text-[9px] uppercase tracking-wider opacity-60 print:opacity-100 print:text-[#4a4a4a]">Project Origin</p>
              <p className="font-body text-[14px]">Hong Kong, 2026</p>
            </div>
          </div>
          <Link
            to="/about"
            className="inline-flex items-center gap-2 font-body text-[12px] text-[#c28223] hover:text-[#f0ece8] transition-colors print:text-[#c28223]"
          >
            Open correspondence form
            <span className="w-4 h-px bg-current" />
          </Link>
        </section>

        <footer className="grant-item pt-8 border-t border-black/10 text-center print:hidden">
          <Link to="/" className="font-body text-sm text-[#c28223] hover:text-[#1a1a1a] transition-colors">
            Return to the archive &rarr;
          </Link>
        </footer>
      </article>
    </div>
  )
}
