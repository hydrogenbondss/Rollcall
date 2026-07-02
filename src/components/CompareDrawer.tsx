import { useEffect } from 'react'
import type { LucideIcon } from 'lucide-react'
import { X, Star, MapPin, Layers, Ruler, Droplets, Factory, ShoppingBag, ArrowRight, Plus } from 'lucide-react'
import { useCompare } from '../contexts/CompareContext'
import { useCurrency } from '../contexts/CurrencyContext'
import { useLanguage } from '../contexts/LanguageContext'
import { Link } from 'react-router'
import type { Product } from '../data/products'

export default function CompareDrawer() {
  const { compareList, removeFromCompare, clearCompare, isOpen, setIsOpen } = useCompare()
  const { formatPrice } = useCurrency()
  const { t } = useLanguage()

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, setIsOpen])

  if (!isOpen || compareList.length === 0) return null

  const needsMore = compareList.length < 2

  type SpecKey = 'ply' | 'thickness' | 'scent' | 'material' | 'manufacturedIn' | 'availableIn' | 'priceUSD'
  type SpecValue = Product[SpecKey]

  const specs: { key: SpecKey; label: string; icon: LucideIcon; format: (v: SpecValue) => string }[] = [
    { key: 'ply', label: t('plyCount'), icon: Layers, format: (v) => `${v as number}-Ply` },
    { key: 'thickness', label: t('thickness'), icon: Ruler, format: (v) => String(v) },
    { key: 'scent', label: t('scent'), icon: Droplets, format: (v) => String(v) },
    { key: 'material', label: t('material'), icon: Factory, format: (v) => String(v) },
    { key: 'manufacturedIn', label: t('manufactured'), icon: MapPin, format: (v) => String(v) },
    { key: 'availableIn', label: t('availableIn'), icon: ShoppingBag, format: (v) => Array.isArray(v) ? v.join(', ') : String(v) },
    { key: 'priceUSD', label: t('price'), icon: Star, format: (v) => formatPrice(v as number) },
  ]

  return (
    <div className="fixed inset-0 z-[200] flex justify-end">
      <div className="absolute inset-0 bg-black/30" onClick={() => setIsOpen(false)} aria-hidden="true" />
      <div role="dialog" aria-modal="true" aria-labelledby="compare-title" className="relative w-full max-w-[900px] bg-white h-full overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-[#e5e5e5] px-6 py-4 flex items-center justify-between z-10">
          <h2 id="compare-title" className="font-display text-xl font-bold text-[#1A1A1A]">{t('compareProducts')}</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={clearCompare}
              className="font-body text-sm text-[#6B6B6B] hover:text-red-500 transition-colors"
            >
              {t('clearAll')}
            </button>
            <button onClick={() => setIsOpen(false)} aria-label="Close comparison" className="p-2 hover:bg-[#f5f5f5] rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="px-6 pt-4">
          {needsMore && (
            <div className="bg-[#f5f2ef] rounded-xl p-4 mb-4 flex items-start gap-3">
              <Plus className="w-4 h-4 text-[#c28223] mt-0.5 shrink-0" />
              <div>
                <p className="font-body text-sm text-[#1A1A1A]">Add one more product</p>
                <p className="font-body text-[11px] text-[#6B6B6B] mt-0.5">Compare works best with 2 or more rolls. Open another specimen and press Compare on its page.</p>
              </div>
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="overflow-x-auto -mx-6 px-6">
          <div style={{ minWidth: `${110 + compareList.length * 130}px` }}>
          {/* Product headers */}
          <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: `110px repeat(${compareList.length}, minmax(120px, 1fr))` }}>
            <div />
            {compareList.map((p) => (
              <div key={p.id} className="text-center">
                <div className="aspect-[3/4] rounded-xl overflow-hidden bg-[#f5f5f5] mb-3">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                </div>
                <p className="font-body text-xs uppercase tracking-wide text-[#6B6B6B]">{p.brand}</p>
                <p className="font-body text-sm font-semibold text-[#1A1A1A] line-clamp-2 mb-2">{p.name}</p>
                <Link
                  to={`/product/${p.id}`}
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center gap-1 font-body text-xs text-[#1A1A1A] hover:underline"
                >
                  View <ArrowRight className="w-3 h-3" />
                </Link>
                <button
                  onClick={() => removeFromCompare(p.id)}
                  className="block mx-auto mt-2 font-body text-[10px] text-red-400 hover:text-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Spec rows */}
          {specs.map((spec) => (
            <div
              key={spec.key}
              className="grid gap-4 border-t border-[#e5e5e5] py-3"
              style={{ gridTemplateColumns: `110px repeat(${compareList.length}, minmax(120px, 1fr))` }}
            >
              <div className="flex items-center gap-2 text-[#6B6B6B]">
                <spec.icon className="w-4 h-4" strokeWidth={1.5} />
                <span className="font-body text-sm font-medium">{spec.label}</span>
              </div>
              {compareList.map((p) => {
                const val = p[spec.key]
                return (
                  <div key={p.id} className="font-body text-sm text-[#1A1A1A] text-center">
                    {spec.format(val)}
                  </div>
                )
              })}
            </div>
          ))}
          </div>
          </div>

        </div>
      </div>
    </div>
  )
}
