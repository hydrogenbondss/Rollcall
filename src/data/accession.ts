import { products, getRegion } from './products'

/**
 * Museum-style accession identifiers, e.g. RC-EA-JP-001.
 *   RC      — Roll Call
 *   EA      — region code (East / Southeast / South Asia)
 *   JP      — ISO 3166-1 alpha-2 country code
 *   001     — running sequence within that country
 *
 * IDs are derived from the data so they stay stable for a given collection
 * order and require no manual bookkeeping per specimen.
 */
const ISO2: Record<string, string> = {
  Japan: 'JP',
  'South Korea': 'KR',
  China: 'CN',
  'Hong Kong': 'HK',
  Taiwan: 'TW',
  Mongolia: 'MN',
  Singapore: 'SG',
  Malaysia: 'MY',
  Thailand: 'TH',
  Philippines: 'PH',
  Indonesia: 'ID',
  Vietnam: 'VN',
  Cambodia: 'KH',
  Laos: 'LA',
  Brunei: 'BN',
  Myanmar: 'MM',
  India: 'IN',
  Bangladesh: 'BD',
  Pakistan: 'PK',
  Nepal: 'NP',
  'Sri Lanka': 'LK',
}

const REGION_CODE: Record<string, string> = {
  'East Asia': 'EA',
  'Southeast Asia': 'SEA',
  'South Asia': 'SA',
}

const idMap: Record<string, string> = {}
const seq: Record<string, number> = {}

for (const p of products) {
  const cc = ISO2[p.country] ?? 'XX'
  const rc = REGION_CODE[getRegion(p.country) ?? ''] ?? 'XX'
  seq[cc] = (seq[cc] ?? 0) + 1
  idMap[p.id] = `RC-${rc}-${cc}-${String(seq[cc]).padStart(3, '0')}`
}

/** Returns the accession ID for a specimen id, e.g. "RC-EA-JP-001". */
export function accessionId(productId: string): string {
  return idMap[productId] ?? 'RC-XX-XX-000'
}
