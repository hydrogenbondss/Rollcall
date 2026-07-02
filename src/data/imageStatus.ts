/**
 * Image provenance & presentation.
 *
 * `brandImageIds` — specimens shown with genuine manufacturer product imagery
 * (sourced from the brand's own published material). Currently only Origami
 * Good Karma. Their detail page notes "Product imagery sourced".
 *
 * `illustrativeImageIds` — specimens shown with an illustrative reconstruction
 * researched from real packaging (see docs/specimen-visual-specs.json). Their
 * detail page carries the "illustrative reconstruction — not a photograph"
 * note so the archive stays honest about provenance.
 *
 * `framedImageIds` — PRESENTATION ONLY: images with a light background that the
 * collection grid mounts as framed prints instead of full-bleed, so they don't
 * break the dark vitrine wall. Orthogonal to provenance.
 *
 * Image loading is fail-safe: if a file is missing, the card keeps its
 * "documentation pending" placeholder instead of a broken image (ProductImage).
 */
export const brandImageIds = new Set<string>([
  'origami-karma',
])

export const illustrativeImageIds = new Set<string>([
  // Flagship
  'nepia-oshiri-celeb',
  'elleair-premium',
  // Batch 1
  'nepia-nepi-nepi',
  'scottie-toilet',
  'tempo-neutral',
  'vinda-ultra-strong',
  'kleenex-ultrasoft',
  'cellox-purify',
  // Batch 2
  'samjung-living',
  'tempo-applewood',
  'andrex-ultimate',
  'cloversoft-bamboo',
  'premier-sg',
  'cutie-soft',
  'royal-gold',
  'zilk-extra-soft',
  'sanica-ecolayers',
  'paseo-elegant',
  'pulppy-supreme',
  'hengan-premium',
  'bashundhara-pink',
  'rose-petal-pakistan',
  'joysoft-nepal',
  // Batch 3
  'samjung-greu',
  'andrex-family',
  'pursoft-unscented',
  'premier-malaysia',
  'tisyu-mega',
  'paseo-kingsize',
  'emos-classic',
  'premier-vn',
  'vinda-taiwan',
  'fresh-bangladesh',
  'eko-fresh-srilanka',
  'smile-myanmar',
  'lency-cambodia',
  'lency-laos',
  // Reclassified: staged mock-ups formerly mislabelled as verified photos
  'enevo-brunei',
  'khugjil-mongolia',
  'picok-ultra',
  'selpak-supersoft',
  'origami-luxuria',
])

/** Light-background images mounted as framed prints in the dark grid. */
export const framedImageIds = new Set<string>([
  'origami-karma',
  'enevo-brunei',
  'khugjil-mongolia',
  'picok-ultra',
])

export function hasFramedImage(id: string): boolean {
  return framedImageIds.has(id)
}

export function hasIllustrativeImage(id: string): boolean {
  return illustrativeImageIds.has(id)
}

/** Whether a specimen should attempt to show an image at all. */
export function hasSpecimenPhoto(id: string): boolean {
  return brandImageIds.has(id) || illustrativeImageIds.has(id)
}
