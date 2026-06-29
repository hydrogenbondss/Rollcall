import { products, countries } from './products'

/**
 * Live archive statistics, derived from the data so the site never hardcodes
 * a specimen count. When the collection grows, every figure updates with it.
 */
export const specimenCount = products.length
export const countryCount = countries.length
export const regionCount = 3
export const archiveYear = 2026

/** Verified vs. community-sourced split, derived from the data. */
export const verifiedCount = products.filter((p) => p.verified).length
export const communityCount = products.length - verifiedCount
