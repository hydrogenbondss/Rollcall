import { useRef, useEffect } from 'react'
import { Link } from 'react-router'
import { ArrowLeft, LayoutGrid } from 'lucide-react'
import Collection from '../sections/Collection'
import Footer from '../sections/Footer'

export default function CollectionPage() {
  const topRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen bg-[#0d0d0d]" ref={topRef}>
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-[#0d0d0d]/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 group">
            <ArrowLeft className="w-4 h-4 text-[#888] group-hover:text-[#f0ece8] transition-colors" />
            <span className="font-display text-[15px] font-medium tracking-[0.15em] uppercase text-[#f0ece8]">Roll Call</span>
          </Link>
          <span className="font-mono text-[10px] text-[#888] uppercase tracking-wider hidden sm:block">Collection</span>
        </div>
      </nav>

      {/* Header */}
      <header className="pt-32 pb-12 px-6 sm:px-8 max-w-[1200px] mx-auto">
        <div className="flex items-center gap-3 mb-3">
          <LayoutGrid className="w-4 h-4 text-[#c28223]" strokeWidth={1.5} />
          <p className="font-body text-[10px] uppercase tracking-[0.4em] text-[#888]">01</p>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl text-[#f0ece8] mb-4">The Collection</h1>
        <p className="font-body text-sm text-[#999] max-w-lg leading-relaxed">
          43 specimens from 21 countries. Filter by region, country, brand, or search by name. Click any specimen for full details.
        </p>
      </header>

      <Collection />
      <Footer />
    </div>
  )
}
