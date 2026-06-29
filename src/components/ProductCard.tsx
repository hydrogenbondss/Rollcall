import { memo, useState, useRef, useCallback } from 'react'
import { Link } from 'react-router'
import { Plus, Check } from 'lucide-react'
import type { Product } from '../data/products'
import { getRegionColor } from '../data/products'
import { useCurrency } from '../contexts/CurrencyContext'
import { useCompare } from '../contexts/CompareContext'

interface ProductCardProps {
  product: Product
  index: number
  isVisible?: boolean
  searchQuery?: string
}

const ProductCard = memo(function ProductCard({ product, index, isVisible = true, searchQuery = '' }: ProductCardProps) {
  const { formatPrice } = useCurrency()
  const { isComparing, addToCompare, removeFromCompare, setIsOpen } = useCompare()
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imgError, setImgError] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [tapped, setTapped] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const comparing = isComparing(product.id)

  // Highlight search terms in text
  const highlightText = (text: string, query: string) => {
    if (!query) return text
    const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'))
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase()
        ? <mark key={i} className="bg-[#c28223]/20 text-inherit rounded px-0.5">{part}</mark>
        : part
    )
  }

  // 3D tilt on mouse move
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    cardRef.current.style.transform = `translateY(-8px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg) scale(1.02)`
  }, [])

  const handleMouseLeave = useCallback(() => {
    setHovered(false)
    if (cardRef.current) {
      cardRef.current.style.transform = ''
    }
  }, [])

  const handleCompare = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (comparing) {
      removeFromCompare(product.id)
    } else {
      addToCompare(product)
      setIsOpen(true)
    }
  }, [comparing, product, addToCompare, removeFromCompare, setIsOpen])

  const handleTap = useCallback(() => {
    if (window.innerWidth < 1024) {
      setTapped((t) => !t)
    }
  }, [])

  const showOverlay = hovered || tapped
  const regionColor = getRegionColor(product.country)

  return (
    <div
      ref={cardRef}
      data-index={index}
      data-cursor="view"
      data-cursor-label="View"
      className={`group ${isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-5'}`}
      style={{
        animationDelay: `${Math.min(index * 0.04, 0.5)}s`,
        perspective: '800px',
        transition: 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
        transformStyle: 'preserve-3d',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Link to={`/product/${product.id}`} className="block" onClick={handleTap}>
        <div
          className="relative rounded-2xl overflow-hidden border border-white/[0.04]"
          style={{
            background: hovered
              ? 'linear-gradient(135deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.65) 100%)'
              : 'linear-gradient(135deg, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.35) 100%)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: hovered
              ? '0 25px 50px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.3)'
              : '0 8px 20px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.2)',
            transition: 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          {/* Region accent bar */}
          <div className="absolute top-0 left-0 right-0 h-[2px] z-10" style={{ backgroundColor: regionColor, opacity: 0.7 }} />

          {/* Verification badge */}
          <div className="absolute top-3 right-3 z-20">
            <span className={`flex items-center gap-1 font-mono text-[9px] uppercase tracking-wider px-2 py-1 rounded-full border ${product.verified ? 'bg-[#228b68]/15 text-[#228b68] border-[#228b68]/20' : 'bg-[#c85a32]/15 text-[#c85a32] border-[#c85a32]/20'}`}>
              <span className={`w-1 h-1 rounded-full ${product.verified ? 'bg-[#228b68]' : 'bg-[#c85a32]'}`} />
              {product.verified ? 'Verified' : 'Community'}
            </span>
          </div>

          {/* Image */}
          <div className="relative aspect-square overflow-hidden bg-white/5">
            {/* Blur placeholder */}
            <div
              className={`absolute inset-0 bg-[#f5f0e8] transition-opacity duration-700 ${imageLoaded && !imgError ? 'opacity-0' : 'opacity-100'}`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#e8e2d9]/30 to-[#f0ece8]/10 animate-pulse" />
              <div className="absolute inset-0 backdrop-blur-xl" />
            </div>
            {!imgError && (
              <img
                src={product.image}
                alt={`${product.brand} ${product.name}`}
                className={`absolute inset-0 w-full h-full object-contain p-5 sm:p-8 transition-all duration-700 ${imageLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-sm'} ${hovered ? 'scale-105' : 'scale-100'}`}
                loading="lazy"
                onLoad={() => setImageLoaded(true)}
                onError={() => { setImgError(true); setImageLoaded(true) }}
              />
            )}
            {imgError && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#f5f0e8]/80 z-10">
                <div className="text-center">
                  <span className="font-body text-[10px] uppercase tracking-wider text-[#b6b0a6] block mb-1">Image unavailable</span>
                  <span className="font-body text-[9px] text-[#c4bdb5]">{product.brand}</span>
                </div>
              </div>
            )}

            {/* Specimen data overlay */}
            <div
              className="absolute inset-x-0 bottom-0 p-4 transition-all duration-500"
              style={{
                opacity: showOverlay ? 1 : 0,
                transform: showOverlay ? 'translateY(0)' : 'translateY(10px)',
                background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)',
                pointerEvents: 'none',
              }}
            >
              <div className="flex items-center justify-between text-white/90">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-body text-[10px] uppercase tracking-wider bg-white/15 px-2 py-0.5 rounded">{product.ply}-ply</span>
                  <span className="font-body text-[10px] text-white/70 max-w-[120px] truncate">{product.material}</span>
                </div>
                <span className={`font-body text-[9px] uppercase tracking-wider px-2 py-0.5 rounded ${product.verified ? 'bg-white/20 text-white/80' : 'bg-white/10 text-white/50'}`}>
                  {product.verified ? 'Verified' : 'Community'}
                </span>
              </div>
            </div>
          </div>

          {/* Badges */}
          {product.badges && product.badges.length > 0 && (
            <div className="px-4 pt-2 flex flex-wrap gap-1">
              {product.badges.map((badge) => {
                const badgeStyles: Record<string, string> = {
                  'Thickest': 'bg-[#c4728e]/10 text-[#c4728e]/20',
                  'Most Luxurious': 'bg-[#c28223]/10 text-[#c28223]/20',
                  'Most Rolls': 'bg-[#228b68]/10 text-[#228b68]/20',
                  'Eco Choice': 'bg-[#228b68]/10 text-[#228b68]/20',
                  'Best Value': 'bg-[#c28223]/10 text-[#c28223]/20',
                  'Softest': 'bg-[#c4728e]/10 text-[#c4728e]/20',
                  'Editor Pick': 'bg-[#888]/10 text-[#b6b0a6]',
                  'Premium': 'bg-[#c28223]/10 text-[#c28223]/20',
                  'Most Popular': 'bg-[#c85a32]/10 text-[#c85a32]/20',
                  'Regional Pick': 'bg-[#c85a32]/10 text-[#c85a32]/20',
                }
                return (
                  <span
                    key={badge}
                    className={`font-body text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full font-medium ${badgeStyles[badge] || 'bg-white/5 text-[#b6b0a6]'}`}
                  >
                    {badge}
                  </span>
                )
              })}
            </div>
          )}

          {/* Info */}
          <div className="p-4 pt-2">
            <div className="flex items-center justify-between mb-2">
              <p className="font-body text-[9px] uppercase tracking-[0.25em] text-[#b0a99d]">
                {highlightText(product.brand, searchQuery)}
              </p>
              <p className="font-body text-[9px] text-[#b6b0a6]">
                {product.country}
              </p>
            </div>
            <h3 className="font-body text-[12px] font-medium text-[#f0ece8] leading-snug line-clamp-2 mb-3">
              {highlightText(product.name, searchQuery)}
            </h3>
            <div className="flex items-center justify-between">
              <p className="font-display text-[15px] text-[#f0ece8]">
                {formatPrice(product.priceUSD)}
              </p>
              {/* Compare button */}
              <button
                onClick={handleCompare}
                className={`flex items-center gap-1 font-body text-[10px] px-2.5 py-1.5 rounded-full border transition-all duration-300 ${
                  comparing
                    ? 'bg-[#f0ece8] text-[#0d0d0d] border-[#f0ece8]'
                    : 'bg-transparent text-[#b6b0a6] border-white/10 hover:border-white/30'
                }`}
                aria-label={comparing ? 'Remove from compare' : 'Add to compare'}
              >
                {comparing ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                {comparing ? 'Added' : 'Compare'}
              </button>
            </div>
          </div>

          {/* Glass edge highlight */}
          <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.05) 100%)',
          }} />
        </div>
      </Link>
    </div>
  )
})

export default ProductCard
