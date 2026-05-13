import { forwardRef } from 'react'
import { type Product } from '../data/products'

interface SpecimenCardProps {
  product: Product
}

const SpecimenCard = forwardRef<HTMLDivElement, SpecimenCardProps>(({ product }, ref) => {
  return (
    <div
      ref={ref}
      className="specimen-print-card bg-white text-black p-8 w-[600px]"
      style={{ fontFamily: 'system-ui, sans-serif' }}
    >
      {/* Header */}
      <div className="border-b-2 border-black pb-4 mb-6 flex items-start justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500">Material Culture Archive</p>
          <h1 className="text-2xl font-bold tracking-tight mt-1">ROLL CALL</h1>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-wider text-gray-500">Catalog No.</p>
          <p className="text-lg font-mono font-bold">{product.id.toUpperCase()}</p>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-[200px_1fr] gap-6">
        {/* Image placeholder area */}
        <div className="bg-gray-100 h-[200px] flex items-center justify-center border border-gray-200">
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">Specimen Image</p>
            <p className="text-xs text-gray-500 font-mono">{product.image.split('/').pop()}</p>
          </div>
        </div>

        {/* Data */}
        <div className="space-y-3">
          <div>
            <p className="text-[9px] uppercase tracking-[0.25em] text-gray-400">Brand</p>
            <p className="text-base font-semibold">{product.brand}</p>
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-[0.25em] text-gray-400">Product</p>
            <p className="text-sm">{product.name}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[9px] uppercase tracking-[0.25em] text-gray-400">Origin</p>
              <p className="text-sm">{product.country} · {product.city}</p>
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-[0.25em] text-gray-400">Ply</p>
              <p className="text-sm font-semibold">{product.ply}-ply</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[9px] uppercase tracking-[0.25em] text-gray-400">Material</p>
              <p className="text-sm">{product.material}</p>
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-[0.25em] text-gray-400">Scent</p>
              <p className="text-sm">{product.scent}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[9px] uppercase tracking-[0.25em] text-gray-400">Price (Local)</p>
              <p className="text-sm">{product.localPrice}</p>
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-[0.25em] text-gray-400">Category</p>
              <p className="text-sm">{product.category}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 my-6 pt-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-[9px] uppercase tracking-[0.25em] text-gray-400">Manufacturer</p>
            <p className="text-xs mt-0.5">{product.manufacturer}</p>
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-[0.25em] text-gray-400">Made In</p>
            <p className="text-xs mt-0.5">{product.manufacturedIn}</p>
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-[0.25em] text-gray-400">Verification</p>
            <p className="text-xs mt-0.5">{product.verified ? 'Verified' : 'Community'}</p>
          </div>
        </div>
      </div>

      {/* Notes */}
      {product.notes && (
        <div className="bg-gray-50 p-4 rounded border border-gray-100">
          <p className="text-[9px] uppercase tracking-[0.25em] text-gray-400 mb-1">Archival Notes</p>
          <p className="text-xs leading-relaxed text-gray-700">{product.notes}</p>
        </div>
      )}

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between text-gray-400">
        <p className="text-[9px] font-mono">rollcall.asia · Material Culture of Contemporary Asia</p>
        <p className="text-[9px] font-mono">Est. 2026 · Hong Kong</p>
      </div>
    </div>
  )
})

SpecimenCard.displayName = 'SpecimenCard'
export default SpecimenCard
