import { describe, it, expect } from 'vitest'
import { products, getRegion, getRegionColor, getFlagEmoji } from '../src/data/products'

describe('product data invariants', () => {
  it('has the expected archive counts', () => {
    expect(products.length).toBe(43)
    const countries = new Set(products.map((p) => p.country))
    expect(countries.size).toBe(21)
  })

  it('classifies regions correctly', () => {
    expect(getRegion('Japan')).toBe('East Asia')
    expect(getRegion('Singapore')).toBe('Southeast Asia')
    expect(getRegion('India')).toBe('South Asia')
    expect(getRegionColor('Japan')).toBe('#c4728e')
    expect(getRegionColor('Singapore')).toBe('#228b68')
    expect(getRegionColor('India')).toBe('#c85a32')
  })

  it('returns flag emojis or a fallback', () => {
    expect(getFlagEmoji('Japan')).toBe('🇯🇵')
    expect(getFlagEmoji('Unknownland')).toBe('🌏')
  })

  it('has required fields on every product', () => {
    for (const p of products) {
      expect(p.id).toBeDefined()
      expect(p.brand).toBeDefined()
      expect(p.name).toBeDefined()
      expect(p.country).toBeDefined()
      expect(typeof p.ply).toBe('number')
      expect(typeof p.priceUSD).toBe('number')
      expect(p.material).toBeDefined()
    }
  })

  it('does not claim Myanmar has zero domestic manufacturers', () => {
    const myanmarDomestic = products.filter(
      (p) => p.country === 'Myanmar' && p.manufacturedIn === 'Myanmar'
    )
    expect(myanmarDomestic.length).toBeGreaterThan(0)
  })

  it('includes scented products in South Asia', () => {
    const southAsianScented = products.filter(
      (p) =>
        ['India', 'Bangladesh', 'Pakistan', 'Nepal', 'Sri Lanka'].includes(p.country) &&
        p.scent &&
        !p.scent.toLowerCase().startsWith('unscented')
    )
    expect(southAsianScented.length).toBeGreaterThan(0)
  })
})
