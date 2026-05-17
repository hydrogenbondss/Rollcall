import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Calendar, MapPin, ExternalLink, ArrowRight } from 'lucide-react'
import { Link } from 'react-router'

gsap.registerPlugin(ScrollTrigger)

const exhibitions = [
  {
    status: 'proposed',
    title: 'Roll Call: Material Culture of Everyday Asia',
    venue: 'Proposed Gallery Installation',
    location: 'Hong Kong',
    year: '2026',
    description: 'Physical exhibition proposal featuring printed specimen cards, data visualizations, and the complete archive as an interactive installation. Designed for gallery or library space with public programming potential.',
  },
]

const press = [
  {
    status: 'upcoming',
    title: 'One-Ply Realism: What Toilet Paper Reveals About Asian Infrastructure',
    publication: 'Long-form Essay · Roll Call Archive',
    date: '2026',
  },
]

export default function Exhibition() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.exhibit-header', {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        opacity: 0, y: 40, duration: 1, ease: 'power3.out',
      })
      gsap.from('.exhibit-item', {
        scrollTrigger: { trigger: '.exhibit-list', start: 'top 80%' },
        opacity: 0, y: 30, duration: 0.8, stagger: 0.15, ease: 'power3.out',
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="w-full bg-[#0d0d0d] py-28">
      <div className="max-w-[720px] mx-auto px-6 sm:px-8">
        <div className="exhibit-header mb-14">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-4 h-4 text-[#888]" strokeWidth={1.5} />
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#888]">Exhibition & Publication</p>
          </div>
          <h2 className="font-display text-5xl sm:text-6xl text-[#f0ece8] tracking-tight leading-[1.05]">
            Where to See<br />This Work
          </h2>
          <p className="font-body text-sm text-[#999] mt-4 max-w-md leading-relaxed">
            Exhibition history and published research. This section documents the project's physical presence and critical reception.
          </p>
        </div>

        {/* Exhibitions */}
        <div className="exhibit-list mb-16">
          <h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#888] mb-6">Exhibitions</h3>

          {exhibitions.map((exhibit, i) => (
            <div key={i} className="exhibit-item border border-white/[0.04] rounded-xl p-6 sm:p-8 mb-4 bg-[#141414]">
              <div className="flex items-center gap-3 mb-4">
                <span className={`font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  exhibit.status === 'proposed'
                    ? 'bg-[#c28223]/10 text-[#c28223]'
                    : exhibit.status === 'upcoming'
                    ? 'bg-[#228b68]/10 text-[#228b68]'
                    : 'bg-white/5 text-[#888] border border-white/10'
                }`}>
                  {exhibit.status}
                </span>
                <span className="font-mono text-[10px] text-[#888]">{exhibit.year}</span>
              </div>

              <h4 className="font-display text-xl sm:text-2xl text-[#f0ece8] mb-2">
                {exhibit.title}
              </h4>

              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-3.5 h-3.5 text-[#b0a89e]" />
                <span className="font-body text-[13px] text-[#888]">{exhibit.venue} · {exhibit.location}</span>
              </div>

              <p className="font-body text-[13px] text-[#999] leading-relaxed mb-5">
                {exhibit.description}
              </p>
              <Link
                to="/exhibition"
                className="inline-flex items-center gap-2 font-body text-[12px] text-[#c28223] hover:text-[#f0ece8] transition-colors group/link"
              >
                View full exhibition plan
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1" />
              </Link>
            </div>
          ))}
        </div>

        {/* Press / Publications */}
        <div>
          <h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#888] mb-6">Publications</h3>

          {press.map((item, i) => (
            <div key={i} className="exhibit-item flex items-start gap-4 border border-white/[0.04] rounded-xl p-5 bg-[#141414]">
              <ExternalLink className="w-4 h-4 text-[#b0a89e] mt-0.5 shrink-0" />
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#c28223]/10 text-[#c28223]">
                    {item.status}
                  </span>
                  <span className="font-mono text-[10px] text-[#888]">{item.date}</span>
                </div>
                <p className="font-body text-sm font-medium text-[#f0ece8] mb-0.5">
                  {item.title}
                </p>
                <p className="font-body text-[11px] text-[#999]">{item.publication}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Call for exhibition */}
        <div className="mt-12 pt-8 border-t border-white/5">
          <p className="font-body text-[13px] text-[#999] leading-relaxed">
            This project is designed for physical exhibition — as printed specimen cards, large-format data visualizations, an interactive world map, and the complete digital archive accessible via on-site terminals. The physical installation transforms the web archive into a gallery experience suitable for museums, libraries, cultural centres, or arts festivals.
          </p>
          <p className="font-body text-[13px] text-[#999] leading-relaxed mt-4">
            Curators and cultural institutions interested in hosting this work are invited to contact the project directly.
          </p>
        </div>
      </div>
    </section>
  )
}
