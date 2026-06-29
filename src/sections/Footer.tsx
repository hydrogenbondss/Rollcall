import { Link } from 'react-router'
import { Send, BookMarked } from 'lucide-react'
import { specimenCount, countryCount } from '../data/stats'

export default function Footer() {
  return (
    <footer className="w-full bg-[#050505] relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />

      <div className="max-w-[1200px] mx-auto px-6 sm:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-16">
          <div>
            <h3 className="font-display text-2xl text-[#f0ece8]/90 tracking-[0.12em] uppercase leading-[1.1] mb-4">
              ROLL CALL
            </h3>
            <p className="font-body text-[15px] text-[#f0ece8]/60 leading-relaxed mb-2 max-w-sm">
              A material culture archive documenting toilet paper specimens from {countryCount} countries across contemporary Asia. Initiated in Hong Kong, 2026.
            </p>
            <p className="font-body text-[13px] text-[#b6b0a6] leading-relaxed mb-6 max-w-sm">
              By Jeffrey Nicholas Tse
            </p>
            <Link to="/about" className="flex items-center gap-2 text-[#b6b0a6] hover:text-[#f0ece8] transition-colors group mb-3">
              <Send className="w-3.5 h-3.5 group-hover:text-[#c28223]" />
              <p className="font-mono text-[11px]">
                Contact &amp; submissions
              </p>
            </Link>
            <Link to="/sources" className="flex items-center gap-2 text-[#b6b0a6] hover:text-[#f0ece8] transition-colors group">
              <BookMarked className="w-3.5 h-3.5 group-hover:text-[#c28223]" />
              <p className="font-mono text-[11px]">
                Sources & methodology
              </p>
            </Link>
          </div>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#f0ece8]/50 mb-4">Correspondence</p>
            <p className="font-body text-[13px] text-[#f0ece8]/60 leading-relaxed mb-4">
              The archive welcomes contributions from field correspondents, cultural institutions, and curators interested in material culture. Exhibition proposals and academic inquiries are actively considered.
            </p>
            <div className="flex items-center gap-6">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-wider text-[#f0ece8]/60 mb-1">Project</p>
                <p className="font-mono text-[11px] text-[#f0ece8]/60">Est. 2026</p>
              </div>
              <div>
                <p className="font-mono text-[9px] uppercase tracking-wider text-[#f0ece8]/60 mb-1">Origin</p>
                <p className="font-mono text-[11px] text-[#f0ece8]/60">Hong Kong</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 sm:px-8">
        <div className="h-px bg-white/5" />
      </div>

      <div className="max-w-[1200px] mx-auto px-6 sm:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <span className="font-mono text-[10px] text-[#f0ece8]/60 tracking-wide">{specimenCount} specimens</span>
            <span className="w-px h-3 bg-white/10" />
            <span className="font-mono text-[10px] text-[#f0ece8]/60 tracking-wide">{countryCount} countries</span>
            <span className="w-px h-3 bg-white/10" />
            <span className="font-mono text-[10px] text-[#f0ece8]/60 tracking-wide">2026</span>
          </div>
          <p className="font-mono text-[10px] text-[#f0ece8]/55">
            This archive is a work in progress
          </p>
        </div>
      </div>
    </footer>
  )
}
