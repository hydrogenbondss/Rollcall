import { useCompare } from '../contexts/CompareContext'
import { ArrowUpRight } from 'lucide-react'

export default function CompareIndicator() {
  const { compareList, setIsOpen, isOpen } = useCompare()

  if (compareList.length === 0 || isOpen) return null

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-fade-in-up">
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-3 px-5 py-3 rounded-full bg-[#f0ece8] text-[#1a1614] shadow-lg hover:shadow-xl transition-shadow font-body text-sm group"
      >
        <div className="flex -space-x-2">
          {compareList.slice(0, 3).map((p, i) => (
            <div
              key={p.id}
              className="w-6 h-6 rounded-full bg-white/20 border-2 border-[#1a1614] overflow-hidden flex items-center justify-center"
              style={{ zIndex: 3 - i }}
            >
              <span className="text-[7px] font-medium">{p.brand[0]}</span>
            </div>
          ))}
        </div>
        <span>{compareList.length} in compare</span>
        <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </button>
    </div>
  )
}
