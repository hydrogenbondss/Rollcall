/**
 * Image provenance. Only these specimens currently have a genuine, verified
 * product photograph. Every other specimen's stored image was found to be
 * AI-generated or suspect during the image audit (see docs/IMAGE_AUDIT.md) and
 * is shown as a "documentation pending" placeholder until a real photo is
 * sourced. As real images are added, append the specimen id here.
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

export function hasVerifiedImage(id: string): boolean {
  return verifiedImageIds.has(id)
}
