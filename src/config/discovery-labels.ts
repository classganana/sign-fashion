/** Centralised facet display labels — aligns with scalable CMS payloads */
export const DISCOVERY_CATEGORY_LABELS: Record<string, string> = {
  tees: "Tees & jersey",
  knitwear: "Knitwear",
  outerwear: "Outerwear",
  shirts: "Shirts",
  tailoring: "Trousers & tailoring",
};

export const DISCOVERY_COLOR_LABELS: Record<string, string> = {
  ivory: "Ivory",
  charcoal: "Charcoal",
  oat: "Oat",
  stone: "Stone",
  graphite: "Graphite",
  black: "Black",
  grey: "Pebble grey",
  ash: "Ash",
  ink: "Washed ink",
  milk: "Milk white",
};

export const DISCOVERY_FIT_LABELS: Record<string, string> = {
  relaxed: "Relaxed",
  oversized: "Oversized",
  structured: "Structured",
  tailored: "Tailored",
};

/** Merchandising tag chips */
export const DISCOVERY_MERCH_TAG_LABELS: Record<string, string> = {
  layering: "Layering",
  "premium-basic": "Premium essentials",
  everyday: "Everyday rotation",
  evening: "Evening-ready",
  structure: "Structure",
  utility: "Utility",
  "street-core": "Street core",
};

export function labelForSlugMap(map: Record<string, string>, slug: string): string {
  return map[slug] ?? slug.replace(/-/g, " ");
}
