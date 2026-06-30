import { Link } from 'react-router'
import { Package, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-8">
          <Package className="w-10 h-10 text-[#b6b0a6]" strokeWidth={1.5} />
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#b6b0a6] mb-4">404</p>
        <h1 className="font-display text-4xl sm:text-5xl text-[#f0ece8] tracking-tight leading-[1.05] mb-4">
          Specimen Not Found
        </h1>
        <p className="font-body text-[15px] text-[#b6b0a6] leading-relaxed mb-10">
          This catalogue number may have been removed, or the reference is incorrect.
          Every specimen in our archive is documented — browse the collection to find it.
        </p>
        <Link
          to="/collection"
          className="inline-flex items-center gap-2 font-body text-sm px-8 py-4 rounded-full bg-[#f0ece8] text-[#0d0d0d] hover:opacity-80 transition-opacity"
        >
          <ArrowLeft className="w-4 h-4" />Return to Collection
        </Link>
      </div>
    </div>
  )
}
