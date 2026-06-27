import { useMemo } from 'react'
import { brands } from '../data/products'

// Fisher-Yates shuffle with a deterministic seed so the marquee order is
// stable across renders and satisfies strict React Compiler lint rules.
function seededShuffle<T>(items: T[], seed: number): T[] {
  const arr = [...items]
  let s = seed
  for (let i = arr.length - 1; i > 0; i--) {
    s = (s * 16807) % 2147483647
    const j = s % (i + 1)
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export default function BrandsMarquee() {
  const displayBrands = useMemo(() => {
    const shuffled = seededShuffle(brands, 135792468)
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
