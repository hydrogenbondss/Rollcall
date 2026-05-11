import { useMemo } from 'react'
import { brands } from '../data/products'

export default function BrandsMarquee() {
  const displayBrands = useMemo(() => {
    const shuffled = [...brands].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, 20)
  }, [])

  const content = displayBrands.map((brand) => (
    <span key={brand} className="font-body text-lg sm:text-xl font-medium text-white/[0.08] select-none mx-10">
      {brand}
    </span>
  ))

  return (
    <div className="w-full bg-[#0d0d0d] py-10 overflow-hidden">
      <div className="animate-marquee flex whitespace-nowrap">
        {content}
        {content}
        {content}
        {content}
      </div>
    </div>
  )
}
