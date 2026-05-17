import { useRef, useState } from 'react'
import { Link } from 'react-router'
import { products } from '../data/products'
import { ArrowRight } from 'lucide-react'

interface TiltCardProps {
  product: typeof products[0]
  catalogNo: string
  index: number
}

function TiltCard({ product, catalogNo, index }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg)')
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return

    const rect = card.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height

    const rotateX = (y - 0.5) * -15
    const rotateY = (x - 0.5) * 15

    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`)
    setGlare({ x: x * 100, y: y * 100, opacity: 0.08 })
  }

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)')
    setGlare({ x: 50, y: 50, opacity: 0 })
  }

  const regionColor =
    product.category === 'East Asia' ? '#c28223' :
    product.category === 'Southeast Asia' ? '#228b68' :
    '#c85a32'

  return (
    <Link to={`/product/${product.id}`}>
      <div
        ref={cardRef}
        className="group relative bg-[#141414] rounded-2xl border border-white/[0.04] overflow-hidden cursor-pointer transition-shadow duration-300 hover:shadow-2xl"
        style={{
          transform,
          transition: 'transform 0.15s ease-out, box-shadow 0.3s ease',
          transformStyle: 'preserve-3d',
          boxShadow: glare.opacity > 0 ? `0 20px 40px rgba(0,0,0,0.3)` : 'none',
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Glare overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-10 rounded-2xl"
          style={{
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,${glare.opacity}), transparent 60%)`,
            transition: 'background 0.1s ease-out',
          }}
        />

        {/* Image */}
        <div className="aspect-square bg-[#e8e4df] relative overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Region color bar */}
          <div
            className="absolute top-0 left-0 right-0 h-0.5"
            style={{ backgroundColor: regionColor }}
          />
        </div>

        {/* Content */}
        <div className="p-4 relative" style={{ transform: 'translateZ(20px)' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[9px] text-[#888] tracking-wider">{catalogNo}</span>
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: regionColor }}
            />
          </div>
          <h3 className="font-display text-sm text-[#f0ece8] leading-tight mb-1 group-hover:text-[#c28223] transition-colors">
            {product.name}
          </h3>
          <p className="font-body text-[11px] text-[#888]">
            {product.brand} · {product.country}
          </p>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.04]">
            <span className="font-mono text-[10px] text-[#888]">{product.ply}-Ply</span>
            <ArrowRight className="w-3 h-3 text-[#888] group-hover:text-[#c28223] group-hover:translate-x-1 transition-all" strokeWidth={1.5} />
          </div>
        </div>

        {/* Holographic edge effect */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            boxShadow: 'inset 0 0 0 1px rgba(194,130,35,0.1), inset 0 0 20px rgba(194,130,35,0.03)',
          }}
        />
      </div>
    </Link>
  )
}

interface SpecimenCardTiltProps {
  count?: number
}

export default function SpecimenCardTilt({ count = 6 }: SpecimenCardTiltProps) {
  // Get a random selection of products
  const selectedProducts = products.slice(0, count)

  // Region codes
  const REGION_CODES: Record<string, string> = {
    'East Asia': 'EA',
    'Southeast Asia': 'SEA',
    'South Asia': 'SA',
  }
  const COUNTRY_CODES: Record<string, string> = {
    'Japan': 'JP', 'South Korea': 'KR', 'China': 'CN', 'Hong Kong': 'HK',
    'Taiwan': 'TW', 'Singapore': 'SG', 'Malaysia': 'MY', 'Thailand': 'TH',
    'Philippines': 'PH', 'Indonesia': 'ID', 'Vietnam': 'VN', 'Brunei': 'BN',
    'Myanmar': 'MM', 'Cambodia': 'KH', 'Laos': 'LA', 'India': 'IN',
    'Bangladesh': 'BD', 'Sri Lanka': 'LK', 'Nepal': 'NP',
  }

  const getCatalogNumber = (product: typeof products[0], index: number) => {
    const regionCode = REGION_CODES[product.category] || 'XX'
    const countryCode = COUNTRY_CODES[product.country] || product.country.slice(0, 2).toUpperCase()
    return `RC-${regionCode}-${countryCode}-26-${product.ply}-${String(index + 1).padStart(2, '0')}`
  }

  return (
    <section className="py-20 border-t border-white/[0.04]">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8">
        <div className="flex items-center gap-3 mb-3">
          <svg className="w-4 h-4 text-[#c28223]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M3 9h18M9 3v18" />
          </svg>
          <p className="font-body text-[10px] uppercase tracking-[0.4em] text-[#888]">Interactive Collection</p>
        </div>
        <h2 className="font-display text-4xl sm:text-5xl mb-4">Handle With Care</h2>
        <p className="font-body text-sm text-[#999] max-w-lg mb-12 leading-relaxed">
          Move your cursor over the cards. Each specimen responds to your touch — 
          a small reminder that these are physical objects, not just data points.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {selectedProducts.map((product, i) => (
            <TiltCard
              key={product.id}
              product={product}
              catalogNo={getCatalogNumber(product, i)}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
