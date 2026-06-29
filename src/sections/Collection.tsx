import { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import { Link } from 'react-router'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import type { Product } from '../data/products'
import { products, brands, countries, getRegion, getFlagEmoji } from '../data/products'
import { accessionId } from '../data/accession'
import { hasSpecimenPhoto, hasVerifiedImage } from '../data/imageStatus'
import { usePaperRustle } from '../hooks/usePaperRustle'

type SortOption = 'popular' | 'price-asc' | 'price-desc' | 'ply-desc' | 'region'

const REGIONS = ['East Asia', 'Southeast Asia', 'South Asia'] as const
const INITIAL_DISPLAY_COUNT = 12

interface SpecimenCardProps {
  product: Product
  index: number
  isVisible: boolean
  searchQuery: string
}

function SpecimenCard({ product, index, isVisible, searchQuery }: SpecimenCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imgError, setImgError] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const catalogNo = accessionId(product.id)
  const photo = hasSpecimenPhoto(product.id)
  // Real photographs are studio-shot on light backgrounds; show them as clean
  // full-bleed tiles. Renders carry their own charcoal background, so they
  // float in the dark vitrine.
  const framed = hasVerifiedImage(product.id)
  const playRustle = usePaperRustle()

  const handleMouseEnter = () => {
    setIsHovered(true)
    playRustle()
  }

  const highlightText = (text: string, query: string) => {
    if (!query) return text
    const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'))
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase()
        ? <mark key={i} className="bg-[#c28223]/20 text-inherit rounded px-0.5">{part}</mark>
        : part
    )
  }

  return (
    <div
      className={`group ${isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-8'}`}
      style={{ animationDelay: `${Math.min(index * 0.06, 0.6)}s` }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${product.id}`} className="block">
        <div
          className="specimen-card relative bg-[#141414] border border-white/[0.04] overflow-hidden"
          style={{
            borderColor: isHovered ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)',
          }}
        >
          {/* Subtle warm spotlight on hover */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-700 z-10"
            style={{
              background: 'radial-gradient(ellipse at 50% 30%, rgba(194,130,35,0.03) 0%, transparent 60%)',
              opacity: isHovered ? 1 : 0,
            }}
          />

          {/* Vitrine — consistent dark display case for every specimen */}
          <div
            className="relative aspect-[4/3] flex items-center justify-center overflow-hidden"
            style={{ background: 'radial-gradient(115% 100% at 50% 0%, #1b1b1d 0%, #0c0c0d 78%)' }}
          >
            {/* top spotlight + floor vignette */}
            <div className="absolute inset-x-0 top-0 h-2/3 pointer-events-none z-10" style={{ background: 'radial-gradient(55% 80% at 50% 0%, rgba(255,255,255,0.05) 0%, transparent 70%)' }} />
            <div className="absolute inset-0 pointer-events-none z-20" style={{ boxShadow: 'inset 0 -34px 50px rgba(0,0,0,0.5), inset 0 0 28px rgba(0,0,0,0.25)' }} />

            {photo && !imgError ? (
              <>
                {!imageLoaded && (
                  <div className="absolute inset-0 bg-white/[0.03]">
                    <div className="absolute inset-0 backdrop-blur-xl" />
                  </div>
                )}
                <img
                  src={product.image}
                  alt={`${product.brand} ${product.name}`}
                  className={`img-zoom ${imageLoaded ? 'opacity-100' : 'opacity-0'} ${framed ? 'h-[74%] aspect-square object-cover rounded-lg ring-1 ring-white/10 shadow-2xl' : 'w-full h-full object-contain p-7 sm:p-9'}`}
                  loading="lazy"
                  onLoad={() => setImageLoaded(true)}
                  onError={() => { setImgError(true); setImageLoaded(true) }}
                />
              </>
            ) : (
              // Honest placeholder: either the image audit found this specimen's
              // photo unverified, or its render has not been uploaded yet. The
              // onError above falls back here so nothing renders broken.
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                <div className="absolute top-4 left-4 w-6 h-px bg-white/15" />
                <div className="absolute bottom-4 right-4 w-6 h-px bg-white/15" />
                <span className="font-display text-[#f0ece8]/55 text-3xl mb-3">{getFlagEmoji(product.country)}</span>
                <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#f0ece8]/55">
                  Documentation pending
                </p>
              </div>
            )}
          </div>

          <div className="border-t border-white/[0.04] bg-[#0d0d0d] px-5 py-4">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-[10px] tracking-[0.2em] text-[#b6b0a6] uppercase">
                {catalogNo}
              </span>
              <span className="font-mono text-[10px] tracking-wider text-[#b6b0a6]">
                {product.verified ? 'Verified' : 'Community'}
              </span>
            </div>

            <h3 className="font-display text-sm sm:text-base text-white/90 leading-snug mb-1">
              {highlightText(product.name, searchQuery)}
            </h3>
            <p className="font-body text-[11px] text-[#b6b0a6] mb-3">
              {product.brand} · {product.country}
            </p>

            <div className="flex items-center gap-4 pt-3 border-t border-white/[0.04]">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-wider text-[#b6b0a6]">Ply</p>
                <p className="font-display text-sm text-white/80">{product.ply}</p>
              </div>
              <div className="w-px h-6 bg-white/5" />
              <div>
                <p className="font-mono text-[9px] uppercase tracking-wider text-[#b6b0a6]">Material</p>
                <p className="font-body text-[11px] text-[#b6b0a6]">{product.material}</p>
              </div>
              <div className="w-px h-6 bg-white/5" />
              <div>
                <p className="font-mono text-[9px] uppercase tracking-wider text-[#b6b0a6]">Origin</p>
                <p className="font-body text-[11px] text-[#b6b0a6]">{product.city}</p>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default function Collection() {
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortOption>('popular')
  const [filterBrand, setFilterBrand] = useState<string>('All')
  const [filterCountry, setFilterCountry] = useState<string>('All')
  const [filterRegion, setFilterRegion] = useState<string>('All')
  const [showFilters, setShowFilters] = useState(false)
  const [showAll, setShowAll] = useState(false)
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  // Seed the first row of cards as visible so the grid never paints as an empty
  // void if the IntersectionObserver is slow or doesn't fire.
  const [visibleSet, setVisibleSet] = useState<Set<number>>(
    () => new Set(Array.from({ length: INITIAL_DISPLAY_COUNT }, (_, i) => i))
  )

  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current)
    searchTimeout.current = setTimeout(() => setDebouncedSearch(search), 250)
  }, [search])

  const filterKey = `${debouncedSearch}|${sort}|${filterBrand}|${filterCountry}|${filterRegion}`

  useEffect(() => {
    const grid = gridRef.current
    if (!grid) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = parseInt((entry.target as HTMLElement).getAttribute('data-index') || '0', 10)
            setTimeout(() => setVisibleSet((prev) => new Set(prev).add(idx)), Math.min(idx * 60, 500))
          }
        })
      },
      { threshold: 0.05, rootMargin: '0px 0px -40px 0px' }
    )
    grid.querySelectorAll('[data-index]').forEach((card) => observer.observe(card))
    return () => observer.disconnect()
  }, [filterKey, showAll])

  const filteredProducts = useMemo(() => {
    let result = [...products]
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase()
      result = result.filter((p) =>
        p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) ||
        p.country.toLowerCase().includes(q)
      )
    }
    if (filterBrand !== 'All') result = result.filter((p) => p.brand === filterBrand)
    if (filterCountry !== 'All') result = result.filter((p) => p.country === filterCountry)
    if (filterRegion !== 'All') result = result.filter((p) => getRegion(p.country) === filterRegion)

    switch (sort) {
      case 'popular': result.sort((a, b) => (b.popular === a.popular ? 0 : b.popular ? 1 : -1)); break
      case 'price-asc': result.sort((a, b) => a.priceUSD - b.priceUSD); break
      case 'price-desc': result.sort((a, b) => b.priceUSD - a.priceUSD); break
      case 'ply-desc': result.sort((a, b) => b.ply - a.ply); break
      case 'region': result.sort((a, b) => getRegion(a.country).localeCompare(getRegion(b.country)) || a.priceUSD - b.priceUSD); break
    }
    return result
  }, [debouncedSearch, sort, filterBrand, filterCountry, filterRegion])

  const clearAll = useCallback(() => {
    setSearch('')
    setDebouncedSearch('')
    setFilterBrand('All')
    setFilterCountry('All')
    setFilterRegion('All')
    setSort('popular')
  }, [])

  const hasFilters = filterBrand !== 'All' || filterCountry !== 'All' || filterRegion !== 'All' || search
  const isFiltering = hasFilters || search

  // Show all when filtering, otherwise respect showAll toggle
  const displayProducts = isFiltering || showAll ? filteredProducts : filteredProducts.slice(0, INITIAL_DISPLAY_COUNT)
  const hasMore = filteredProducts.length > INITIAL_DISPLAY_COUNT && !isFiltering

  const groupedByRegion = useMemo(() => {
    if (sort !== 'region') return null
    const groups: Record<string, typeof products> = {}
    REGIONS.forEach((r) => groups[r] = [])
    filteredProducts.forEach((p) => {
      const region = getRegion(p.country)
      if (!groups[region]) groups[region] = []
      groups[region].push(p)
    })
    return groups
  }, [filteredProducts, sort])

  return (
    <section id="collection" className="w-full bg-[#0d0d0d] pt-6 pb-28">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8">
        <div className="sticky top-16 z-30 bg-[#0d0d0d]/95 backdrop-blur-md py-5 mb-12 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#b6b0a6]" />
              <input type="text" placeholder="Search specimens..." value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 bg-white/5 border border-white/10 rounded-lg font-body text-[13px] focus:outline-none focus:border-[#b0a89e] text-white placeholder:text-[#b6b0a6] backdrop-blur-sm transition-colors"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#b6b0a6] hover:text-[#b6b0a6]">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <button onClick={() => setShowFilters(!showFilters)}
              className={`p-2.5 rounded-lg border transition-colors ${showFilters ? 'bg-white text-[#0d0d0d] border-white' : 'border-white/10 text-[#b6b0a6] hover:bg-white/5'}`}>
              <SlidersHorizontal className="w-4 h-4" />
            </button>
            <select value={sort} onChange={(e) => setSort(e.target.value as SortOption)}
              className="px-3 py-2.5 rounded-lg border border-white/10 bg-transparent font-body text-[13px] text-[#b6b0a6] focus:outline-none cursor-pointer">
              <option value="popular">Popular</option>
              <option value="price-asc">Price ↑</option>
              <option value="price-desc">Price ↓</option>
              <option value="ply-desc">Ply</option>
              <option value="region">Region</option>
            </select>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap items-center gap-2">
              <select value={filterRegion} onChange={(e) => setFilterRegion(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-white/10 bg-transparent font-body text-[12px] text-[#b6b0a6]">
                <option value="All">All regions</option>
                {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
              <select value={filterBrand} onChange={(e) => setFilterBrand(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-white/10 bg-transparent font-body text-[12px] text-[#b6b0a6]">
                <option value="All">All brands</option>
                {brands.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
              <select value={filterCountry} onChange={(e) => setFilterCountry(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-white/10 bg-transparent font-body text-[12px] text-[#b6b0a6]">
                <option value="All">All countries</option>
                {countries.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              {hasFilters && <button onClick={clearAll} className="font-body text-[11px] text-[#b0a89e] hover:text-[#f0ece8] transition-colors">Clear all</button>}
            </div>
          )}

          {!showFilters && hasFilters && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {filterRegion !== 'All' && (
                <span className="inline-flex items-center gap-1 font-body text-[11px] text-[#b6b0a6] bg-white/5 px-2.5 py-1 rounded-full">
                  {filterRegion} <button onClick={() => setFilterRegion('All')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {filterBrand !== 'All' && (
                <span className="inline-flex items-center gap-1 font-body text-[11px] text-[#b6b0a6] bg-white/5 px-2.5 py-1 rounded-full">
                  {filterBrand} <button onClick={() => setFilterBrand('All')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {filterCountry !== 'All' && (
                <span className="inline-flex items-center gap-1 font-body text-[11px] text-[#b6b0a6] bg-white/5 px-2.5 py-1 rounded-full">
                  {filterCountry} <button onClick={() => setFilterCountry('All')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {search && (
                <span className="inline-flex items-center gap-1 font-body text-[11px] text-[#b6b0a6] bg-white/5 px-2.5 py-1 rounded-full">
                  &quot;{search}&quot; <button onClick={() => setSearch('')}><X className="w-3 h-3" /></button>
                </span>
              )}
              <button onClick={clearAll} className="font-body text-[11px] text-[#b0a89e] hover:text-[#f0ece8] transition-colors">Clear all</button>
            </div>
          )}
        </div>

        {sort === 'region' && groupedByRegion ? (
          <div ref={gridRef} key={filterKey} className="space-y-20">
            {REGIONS.map((region) => {
              const regionProducts = groupedByRegion[region] || []
              if (regionProducts.length === 0) return null
              const regionColors: Record<string, string> = {
                'East Asia': '#c4728e',
                'Southeast Asia': '#228b68',
                'South Asia': '#c85a32',
              }
              return (
                <div key={region}>
                  <div className="flex items-center gap-4 mb-8">
                    <span className="w-8 h-[1px]" style={{ backgroundColor: regionColors[region] }} />
                    <h3 className="font-display text-xl text-[#f0ece8]">{region}</h3>
                    <span className="font-mono text-[10px] text-[#b6b0a6]">{regionProducts.length} specimens</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {regionProducts.map((product, i) => (
                      <div key={product.id} data-index={i}>
                        <SpecimenCard product={product} index={i} isVisible={visibleSet.has(i)} searchQuery={debouncedSearch} />
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div ref={gridRef} key={filterKey} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayProducts.map((product, i) => (
              <div key={product.id} data-index={i}>
                <SpecimenCard product={product} index={i} isVisible={visibleSet.has(i)} searchQuery={debouncedSearch} />
              </div>
            ))}
          </div>
        )}

        {filteredProducts.length === 0 && (
          <div className="text-center py-24">
            <p className="font-mono text-sm text-[#b6b0a6]">No specimens found in this collection.</p>
            <button onClick={clearAll} className="mt-4 font-body text-sm text-[#b0a99d] hover:text-[#f0ece8] transition-colors">Clear filters</button>
          </div>
        )}

        {/* Show more / Show less toggle */}
        {hasMore && (
          <div className="text-center pt-10 pb-4">
            <button
              onClick={() => setShowAll(!showAll)}
              className="group inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-[#141414] border border-white/[0.06] hover:border-[#c28223]/30 transition-all cursor-pointer"
            >
              <span className="font-mono text-[10px] text-[#b6b0a6] group-hover:text-[#c28223] uppercase tracking-wider transition-colors">
                {showAll ? 'Show fewer' : 'Show the full archive'}
              </span>
              <svg className={`w-3 h-3 text-[#b6b0a6] group-hover:text-[#c28223] transition-all ${showAll ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
