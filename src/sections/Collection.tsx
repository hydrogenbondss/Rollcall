import { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import { Link } from 'react-router'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import type { Product } from '../data/products'
import { products, brands, countries, getRegion } from '../data/products'
import { usePaperRustle } from '../hooks/usePaperRustle'

type SortOption = 'popular' | 'price-asc' | 'price-desc' | 'ply-desc' | 'region'

const REGIONS = ['East Asia', 'Southeast Asia', 'South Asia'] as const

function getCatalogNumber(index: number): string {
  return `RCT.AS.${String(index + 1).padStart(4, '0')}`
}

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
  const catalogNo = getCatalogNumber(index)
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
          className="relative bg-[#141414] border border-white/[0.04] overflow-hidden transition-all duration-500"
          style={{
            borderColor: isHovered ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)',
            boxShadow: isHovered
              ? '0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.06)'
              : '0 4px 20px rgba(0,0,0,0.2)',
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

          {/* Vitrine frame */}
          <div className="relative aspect-[4/3] flex items-center justify-center bg-gradient-to-b from-white/[0.03] to-white/[0.01] overflow-hidden">
            {/* Museum-style inner shadow */}
            <div
              className="absolute inset-0 pointer-events-none z-20"
              style={{
                boxShadow: 'inset 0 0 40px rgba(0,0,0,0.3)',
              }}
            />

            {!imageLoaded && !imgError && (
              <div className="absolute inset-0 bg-white/[0.03]">
                <div className="absolute inset-0 backdrop-blur-xl" />
              </div>
            )}
            {!imgError && (
              <img
                src={product.image}
                alt={`${product.brand} ${product.name}`}
                className={`w-full h-full object-contain p-10 sm:p-14 transition-all duration-700 ${imageLoaded ? 'opacity-100' : 'opacity-0'} ${isHovered ? 'scale-[1.03]' : 'scale-100'}`}
                loading="lazy"
                onLoad={() => setImageLoaded(true)}
                onError={() => { setImgError(true); setImageLoaded(true) }}
              />
            )}
            {imgError && (
              <div className="absolute inset-0 flex items-center justify-center z-30">
                <span className="font-body text-[10px] uppercase tracking-widest text-[#555]">Specimen unavailable</span>
              </div>
            )}
          </div>

          <div className="border-t border-white/[0.04] bg-[#0d0d0d] px-5 py-4">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-[10px] tracking-[0.2em] text-[#555] uppercase">
                {catalogNo}
              </span>
              <span className="font-mono text-[10px] tracking-wider text-[#444]">
                {product.verified ? 'Verified' : 'Community'}
              </span>
            </div>

            <h3 className="font-display text-sm sm:text-base text-white/90 leading-snug mb-1">
              {highlightText(product.name, searchQuery)}
            </h3>
            <p className="font-body text-[11px] text-[#666] mb-3">
              {product.brand} · {product.country}
            </p>

            <div className="flex items-center gap-4 pt-3 border-t border-white/[0.04]">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-wider text-[#555]">Ply</p>
                <p className="font-display text-sm text-white/80">{product.ply}</p>
              </div>
              <div className="w-px h-6 bg-white/5" />
              <div>
                <p className="font-mono text-[9px] uppercase tracking-wider text-[#555]">Material</p>
                <p className="font-body text-[11px] text-[#888]">{product.material}</p>
              </div>
              <div className="w-px h-6 bg-white/5" />
              <div>
                <p className="font-mono text-[9px] uppercase tracking-wider text-[#555]">Origin</p>
                <p className="font-body text-[11px] text-[#888]">{product.city}</p>
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
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const [visibleSet, setVisibleSet] = useState<Set<number>>(new Set())

  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current)
    searchTimeout.current = setTimeout(() => setDebouncedSearch(search), 250)
  }, [search])

  useEffect(() => {
    setVisibleSet(new Set())
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
  }, [debouncedSearch, sort, filterBrand, filterCountry, filterRegion])

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
    <section id="collection" className="w-full bg-[#0d0d0d] py-28">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8">
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-4">
            <span className="font-mono text-[10px] tracking-[0.3em] text-[#555] uppercase">Gallery I</span>
            <span className="w-12 h-px bg-white/10" />
            <span className="font-mono text-[10px] tracking-wider text-[#555]">{filteredProducts.length} specimens</span>
          </div>
          <h2 className="font-display text-5xl sm:text-6xl md:text-7xl text-[#f0ece8] tracking-tight leading-[1.0] mb-6">
            The Collection
          </h2>
          <p className="font-body text-sm text-[#666] max-w-lg leading-relaxed">
            Each specimen has been photographed, catalogued, and verified. 
            Click any roll to view its full documentation.
          </p>
        </div>

        <div className="sticky top-16 z-30 bg-[#0d0d0d]/95 backdrop-blur-md py-5 mb-12 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
              <input type="text" placeholder="Search specimens..." value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 bg-white/5 border border-white/10 rounded-lg font-body text-[13px] focus:outline-none focus:border-[#b0a89e] text-white placeholder:text-[#555] backdrop-blur-sm transition-colors"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#555] hover:text-[#888]">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <button onClick={() => setShowFilters(!showFilters)}
              className={`p-2.5 rounded-lg border transition-colors ${showFilters ? 'bg-white text-[#0d0d0d] border-white' : 'border-white/10 text-[#888] hover:bg-white/5'}`}>
              <SlidersHorizontal className="w-4 h-4" />
            </button>
            <select value={sort} onChange={(e) => setSort(e.target.value as SortOption)}
              className="px-3 py-2.5 rounded-lg border border-white/10 bg-transparent font-body text-[13px] text-[#888] focus:outline-none cursor-pointer">
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
                className="px-3 py-1.5 rounded-lg border border-white/10 bg-transparent font-body text-[12px] text-[#888]">
                <option value="All">All regions</option>
                {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
              <select value={filterBrand} onChange={(e) => setFilterBrand(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-white/10 bg-transparent font-body text-[12px] text-[#888]">
                <option value="All">All brands</option>
                {brands.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
              <select value={filterCountry} onChange={(e) => setFilterCountry(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-white/10 bg-transparent font-body text-[12px] text-[#888]">
                <option value="All">All countries</option>
                {countries.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              {hasFilters && <button onClick={clearAll} className="font-body text-[11px] text-[#b0a89e] hover:text-[#f0ece8] transition-colors">Clear all</button>}
            </div>
          )}

          {!showFilters && hasFilters && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {filterRegion !== 'All' && (
                <span className="inline-flex items-center gap-1 font-body text-[11px] text-[#666] bg-white/5 px-2.5 py-1 rounded-full">
                  {filterRegion} <button onClick={() => setFilterRegion('All')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {filterBrand !== 'All' && (
                <span className="inline-flex items-center gap-1 font-body text-[11px] text-[#666] bg-white/5 px-2.5 py-1 rounded-full">
                  {filterBrand} <button onClick={() => setFilterBrand('All')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {filterCountry !== 'All' && (
                <span className="inline-flex items-center gap-1 font-body text-[11px] text-[#666] bg-white/5 px-2.5 py-1 rounded-full">
                  {filterCountry} <button onClick={() => setFilterCountry('All')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {search && (
                <span className="inline-flex items-center gap-1 font-body text-[11px] text-[#666] bg-white/5 px-2.5 py-1 rounded-full">
                  &quot;{search}&quot; <button onClick={() => setSearch('')}><X className="w-3 h-3" /></button>
                </span>
              )}
              <button onClick={clearAll} className="font-body text-[11px] text-[#b0a89e] hover:text-[#f0ece8] transition-colors">Clear all</button>
            </div>
          )}
        </div>

        {sort === 'region' && groupedByRegion ? (
          <div ref={gridRef} className="space-y-20">
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
                    <span className="font-mono text-[10px] text-[#555]">{regionProducts.length} specimens</span>
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
          <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product, i) => (
              <div key={product.id} data-index={i}>
                <SpecimenCard product={product} index={i} isVisible={visibleSet.has(i)} searchQuery={debouncedSearch} />
              </div>
            ))}
          </div>
        )}

        {filteredProducts.length === 0 && (
          <div className="text-center py-24">
            <p className="font-mono text-sm text-[#666]">No specimens found in this collection.</p>
            <button onClick={clearAll} className="mt-4 font-body text-sm text-[#8a8279] hover:text-[#f0ece8] transition-colors">Clear filters</button>
          </div>
        )}
      </div>
    </section>
  )
}
