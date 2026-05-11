import { Mail, ArrowUpRight } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="w-full bg-[#050505] relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />

      <div className="max-w-[1200px] mx-auto px-6 sm:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-16">
          <div>
            <h3 className="font-display text-3xl text-[#f0ece8]/90 tracking-tight leading-[1.1] mb-4">
              Roll Call
            </h3>
            <p className="font-body text-[15px] text-[#f0ece8]/40 leading-relaxed mb-6 max-w-sm">
              A material culture archive documenting toilet paper specimens from 21 countries across contemporary Asia. Initiated in Hong Kong, 2026.
            </p>
            <a
              href="mailto:hello@rollcall.asia"
              className="group inline-flex items-center gap-2 font-body text-sm px-6 py-3 rounded-full border border-white/15 text-[#f0ece8]/60 hover:text-[#f0ece8] hover:border-white/40 hover:bg-white/5 transition-all duration-300"
            >
              <Mail className="w-4 h-4" />
              hello@rollcall.asia
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#f0ece8]/25 mb-4">Correspondence</p>
            <p className="font-body text-[13px] text-[#f0ece8]/40 leading-relaxed mb-4">
              The archive welcomes contributions from field correspondents, cultural institutions, and curators interested in material culture. Exhibition proposals and academic inquiries are actively considered.
            </p>
            <div className="flex items-center gap-6">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-wider text-[#f0ece8]/20 mb-1">Project</p>
                <p className="font-mono text-[11px] text-[#f0ece8]/50">RCT.AS.2026</p>
              </div>
              <div>
                <p className="font-mono text-[9px] uppercase tracking-wider text-[#f0ece8]/20 mb-1">Origin</p>
                <p className="font-mono text-[11px] text-[#f0ece8]/50">Hong Kong</p>
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
            <span className="font-mono text-[10px] text-[#f0ece8]/20 tracking-wide">43 specimens</span>
            <span className="w-px h-3 bg-white/10" />
            <span className="font-mono text-[10px] text-[#f0ece8]/20 tracking-wide">21 countries</span>
            <span className="w-px h-3 bg-white/10" />
            <span className="font-mono text-[10px] text-[#f0ece8]/20 tracking-wide">2026</span>
          </div>
          <p className="font-mono text-[10px] text-[#f0ece8]/15">
            This archive is a work in progress
          </p>
        </div>
      </div>
    </footer>
  )
}
