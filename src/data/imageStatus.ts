/**
 * Image provenance.
 *
 * `verifiedImageIds` — specimens with a genuine, verified product photograph.
 *
 * `illustrativeImageIds` — specimens shown with an AI render reconstructed from
 * researched real packaging (see docs/specimen-visual-specs.json). These are
 * presented as the specimen image but carry a small "illustrative
 * reconstruction" note on the detail page so the archive stays honest that they
 * are researched renders, not photographs.
 *
 * Everything else falls back to a "documentation pending" placeholder. Image
 * loading is fail-safe: if a render file has not been uploaded yet, the card
 * keeps its placeholder instead of showing a broken image (see ProductImage).
 */
export const verifiedImageIds = new Set<string>([
  'nepia-oshiri-celeb',
  'elleair-premium',
  'enevo-brunei',
  'khugjil-mongolia',
  'origami-karma',
  'origami-luxuria',
  'picok-ultra',
  'selpak-supersoft',
])

export const illustrativeImageIds = new Set<string>([
  'nepia-nepi-nepi',
  'scottie-toilet',
  'tempo-neutral',
  'vinda-ultra-strong',
  'kleenex-ultrasoft',
  'cellox-purify',
])

export function hasVerifiedImage(id: string): boolean {
  return verifiedImageIds.has(id)
}

export function hasIllustrativeImage(id: string): boolean {
  return illustrativeImageIds.has(id)
}

/** Whether a specimen should attempt to show an image (verified or render). */
export function hasSpecimenPhoto(id: string): boolean {
  return verifiedImageIds.has(id) || illustrativeImageIds.has(id)
}
