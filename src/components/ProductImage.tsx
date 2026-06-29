import { memo, useState } from 'react'
import { getFlagEmoji } from '../data/products'
import { hasSpecimenPhoto } from '../data/imageStatus'
import type { Product } from '../data/products'

const GENERIC_IMAGES = new Set([
  './images/hero-roll-1.jpg', './images/hero-roll-2.jpg', './images/hero-roll-3.jpg',
  './images/hero-roll-4.jpg', './images/hero-roll-5.jpg', './images/hero-roll-6.jpg',
])

// Dark, moody tints for each brand — ensures white text is readable
const BRAND_TINTS: Record<string, string> = {
  'Tempo': 'bg-[#2a2438]', 'Vinda': 'bg-[#1e2a3a]', 'Kleenex': 'bg-[#2e1e2e]',
  'Scott': 'bg-[#1a2e28]', 'Nepia': 'bg-[#2e261e]', 'Charmin': 'bg-[#2e1e1e]',
  'Andrex': 'bg-[#1e1e30]', 'Royale': 'bg-[#1e2e1e]', 'Purex': 'bg-[#2a1e2e]',
  'Presto': 'bg-[#2e2a1e]', 'Origami': 'bg-[#1e2e38]', 'Bella': 'bg-[#2e1e28]',
  'Paseo': 'bg-[#2e2e1e]', 'Tessa': 'bg-[#1e2e1e]', 'Selpak': 'bg-[#1e2e2e]',
  'Fine': 'bg-[#1e2430]', 'Softex': 'bg-[#2e2820]', 'Cellox': 'bg-[#1e2830]',
  'Living': 'bg-[#2e2a1e]', 'NTPM': 'bg-[#1e2a2e]', 'Cottony': 'bg-[#2e2e1e]',
}

function getTint(brand: string): string {
  return BRAND_TINTS[brand] || 'bg-[#1a1a2e]'
}

interface ProductImageProps {
  product: Product
  className?: string
  aspectRatio?: 'square' | 'portrait' | 'auto'
  showLabel?: boolean
  /** Called if the image file fails to load (e.g. a render not yet uploaded). */
  onPhotoError?: () => void
}

const ProductImage = memo(function ProductImage({
  product, className = '', aspectRatio = 'portrait', showLabel = true, onPhotoError,
}: ProductImageProps) {
  // Show the stored image only for verified photos or researched renders. If the
  // file 404s (e.g. a render hasn't been uploaded yet), fall back to the archive
  // placeholder so nothing renders broken. Everything else stays a placeholder.
  const [errored, setErrored] = useState(false)
  const isGeneric = GENERIC_IMAGES.has(product.image)
  const showPhoto = !isGeneric && hasSpecimenPhoto(product.id) && !errored
  const aspectClass = aspectRatio === 'square' ? 'aspect-square' : aspectRatio === 'portrait' ? 'aspect-[4/5]' : ''

  if (showPhoto) {
    return (
      <div className={`${aspectClass} w-full overflow-hidden bg-[#1a1a1a] ${className}`}>
        <img
          src={product.image}
          alt={`${product.brand} ${product.name}`}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={() => { setErrored(true); onPhotoError?.() }}
        />
      </div>
    )
  }

  // Dark archive card — intentional, museum-like
  return (
    <div className={`${aspectClass} w-full ${getTint(product.brand)} flex flex-col items-center justify-center px-6 text-center relative overflow-hidden ${className}`}>
      {/* Subtle texture dots */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
        backgroundSize: '24px 24px',
      }} />
      
      {/* Corner accent line */}
      <div className="absolute top-4 left-4 w-6 h-[1px] bg-white/20" />
      <div className="absolute bottom-4 right-4 w-6 h-[1px] bg-white/20" />
      
      {showLabel && (
        <div className="relative z-10 flex flex-col items-center">
          {/* Brand */}
          <p className="font-body text-[10px] uppercase tracking-[0.3em] text-white/50 mb-4">
            {product.brand}
          </p>
          
          {/* Product name — bolder */}
          <p className="font-body text-[15px] font-medium text-white/85 leading-snug line-clamp-3 mb-6 max-w-[85%]">
            {product.name}
          </p>
          
          {/* Meta row */}
          <div className="flex items-center gap-3 text-white/40">
            <span className="text-lg leading-none">{getFlagEmoji(product.country)}</span>
            <span className="w-[1px] h-3 bg-white/15" />
            <span className="font-body text-[10px] uppercase tracking-widest">{product.ply}-ply</span>
          </div>
          
          {/* Honest provenance indicator */}
          <div className="mt-6 px-3 py-1 rounded-full border border-white/10">
            <p className="font-body text-[9px] uppercase tracking-[0.2em] text-white/30">
              Documentation pending
            </p>
          </div>
        </div>
      )}
    </div>
  )
})

export default ProductImage
export { GENERIC_IMAGES }
