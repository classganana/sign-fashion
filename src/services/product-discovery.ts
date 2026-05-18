import { collections as defaultCollections } from "@/config/collections";
import type { CollectionConfig } from "@/config/collections";
import {
  DISCOVERY_CATEGORY_LABELS,
  DISCOVERY_COLOR_LABELS,
  DISCOVERY_FIT_LABELS,
  DISCOVERY_MERCH_TAG_LABELS,
  labelForSlugMap,
} from "@/config/discovery-labels";
import type {
  ParsedDiscoveryParams,
  DiscoverySortOption,
} from "@/types/discovery";
import type { MockProduct } from "@/types/product";

import { DEFAULT_SORT } from "@/lib/discovery-url";

function hasFacetOverlap(selected: readonly string[], values: readonly string[]): boolean {
  if (!selected.length) return true;
  const available = new Set(values.map((v) => v.toLowerCase()));
  return selected.some((s) => available.has(s.toLowerCase()));
}

function matchesSearch(product: MockProduct, q: string): boolean {
  const t = q.trim().toLowerCase();
  if (!t.length) return true;
  const blob = `${product.name} ${product.slug} ${product.description}`.toLowerCase();
  const tokens = t.split(/\s+/).filter(Boolean);
  return tokens.every((tok) => blob.includes(tok));
}

/** Apply filters suitable for SSR — swap internals for aggregation pipelines later */
export function filterProductsByDiscovery(
  catalog: readonly MockProduct[],
  params: ParsedDiscoveryParams,
): MockProduct[] {
  const minCents =
    params.minPriceRupee !== null ? Math.max(0, params.minPriceRupee) * 100 : null;
  const maxCents =
    params.maxPriceRupee !== null ? Math.max(0, params.maxPriceRupee) * 100 : null;

  return [...catalog].filter((p) => {
    if (!matchesSearch(p, params.q)) return false;

    const { discovery } = p;

    if (!hasFacetOverlap(params.categories, [discovery.categorySlug])) return false;
    if (!hasFacetOverlap(params.sizes, discovery.sizes)) return false;
    if (!hasFacetOverlap(params.colors, discovery.colors)) return false;
    if (!hasFacetOverlap(params.fits, discovery.fits)) return false;
    if (!hasFacetOverlap(params.collections, discovery.collections)) return false;
    if (!hasFacetOverlap(params.discoveryTags, discovery.tags)) return false;

    if (
      params.campaigns.length &&
      (!p.tag || !params.campaigns.includes(p.tag))
    ) {
      return false;
    }

    if (minCents !== null && p.priceCents < minCents) return false;
    if (maxCents !== null && p.priceCents > maxCents) return false;

    return true;
  });
}

export function sortProductsForDiscovery(
  products: MockProduct[],
  sort: DiscoverySortOption,
): MockProduct[] {
  const ranked = [...products];
  ranked.sort((a, b) => {
    switch (sort) {
      case "price-asc":
        return (
          a.priceCents - b.priceCents || a.slug.localeCompare(b.slug)
        );
      case "price-desc":
        return (
          b.priceCents - a.priceCents || a.slug.localeCompare(b.slug)
        );
      case "newest":
        return (
          b.discovery.releasedAtMs - a.discovery.releasedAtMs ||
          a.slug.localeCompare(b.slug)
        );
      case "trending":
        return (
          b.discovery.trendingRank - a.discovery.trendingRank ||
          a.slug.localeCompare(b.slug)
        );
      case "featured":
      default:
        return (
          b.discovery.featuredRank - a.discovery.featuredRank ||
          a.slug.localeCompare(b.slug)
        );
    }
  });
  return ranked;
}

/** Facet counts derived from catalogue — deterministic option ordering */
export function buildDiscoveryFacetBuckets(
  catalog: readonly MockProduct[],
  capsuleDefinitions: readonly CollectionConfig[] = defaultCollections,
): {
  categories: { value: string; label: string; count: number }[];
  sizes: { value: string; label: string; count: number }[];
  colors: { value: string; label: string; count: number }[];
  fits: { value: string; label: string; count: number }[];
  merchTags: { value: string; label: string; count: number }[];
  collections: { value: string; label: string; count: number }[];
} {
  type Counter = Record<string, number>;
  const cat: Counter = {};
  const sz: Counter = {};
  const col: Counter = {};
  const fits: Counter = {};
  const merch: Counter = {};

  for (const p of catalog) {
    const { discovery } = p;
    cat[discovery.categorySlug] = (cat[discovery.categorySlug] ?? 0) + 1;
    for (const s of discovery.sizes) sz[s] = (sz[s] ?? 0) + 1;
    for (const c of discovery.colors) col[c] = (col[c] ?? 0) + 1;
    for (const f of discovery.fits) fits[f] = (fits[f] ?? 0) + 1;
    for (const t of discovery.tags) merch[t] = (merch[t] ?? 0) + 1;
  }

  const toRows = (
    counter: Counter,
    labels: Record<string, string>,
  ): { value: string; label: string; count: number }[] =>
    Object.entries(counter)
      .map(([value, count]) => ({
        value,
        label: labelForSlugMap(labels, value),
        count,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));

  const collectionCounts: Counter = {};
  for (const p of catalog) {
    for (const c of p.discovery.collections) {
      collectionCounts[c] = (collectionCounts[c] ?? 0) + 1;
    }
  }

  const collections = capsuleDefinitions.map((colDef) => ({
    value: colDef.slug,
    label: colDef.title,
    count: collectionCounts[colDef.slug] ?? 0,
  }));

  return {
    categories: toRows(cat, DISCOVERY_CATEGORY_LABELS),
    sizes: Object.entries(sz)
      .map(([value, count]) => ({ value, label: value, count }))
      .sort(sortAlphaSizes),
    colors: toRows(col, DISCOVERY_COLOR_LABELS),
    fits: toRows(fits, DISCOVERY_FIT_LABELS),
    merchTags: toRows(merch, DISCOVERY_MERCH_TAG_LABELS),
    collections,
  };
}

/** Numeric waist vs alpha sizes — simple heuristic ordering */
function sortAlphaSizes(
  a: { value: string; count: number },
  b: { value: string; count: number },
): number {
  const na = Number.parseInt(a.value, 10);
  const nb = Number.parseInt(b.value, 10);
  if (Number.isFinite(na) && Number.isFinite(nb)) return na - nb;
  if (Number.isFinite(na)) return -1;
  if (Number.isFinite(nb)) return 1;
  const rank = ["XS", "S", "M", "L", "XL", "XXL"];
  const ia = rank.indexOf(a.value);
  const ib = rank.indexOf(b.value);
  if (ia >= 0 && ib >= 0) return ia - ib;
  if (ia >= 0) return -1;
  if (ib >= 0) return 1;
  return a.value.localeCompare(b.value);
}

export function buildDiscoveryListing(
  catalog: readonly MockProduct[],
  params: ParsedDiscoveryParams,
  options?: { capsuleDefinitions?: readonly CollectionConfig[] },
): {
  filtered: MockProduct[];
  facets: ReturnType<typeof buildDiscoveryFacetBuckets>;
  activeParams: ParsedDiscoveryParams;
  sortApplied: DiscoverySortOption;
  hasActiveFilters: boolean;
} {
  const capsules = options?.capsuleDefinitions ?? defaultCollections;
  const facets = buildDiscoveryFacetBuckets(catalog, capsules);
  const filtered = sortProductsForDiscovery(
    filterProductsByDiscovery(catalog, params),
    params.sort,
  );

  const hasActiveFilters =
    params.categories.length > 0 ||
    params.sizes.length > 0 ||
    params.colors.length > 0 ||
    params.fits.length > 0 ||
    params.collections.length > 0 ||
    params.discoveryTags.length > 0 ||
    params.campaigns.length > 0 ||
    params.minPriceRupee !== null ||
    params.maxPriceRupee !== null ||
    !!params.q.trim() ||
    params.sort !== DEFAULT_SORT;

  return {
    filtered,
    facets,
    activeParams: params,
    sortApplied: params.sort,
    hasActiveFilters,
  };
}

/** Lightweight recommendation surface until collaborative filtering exists */
export function getRecommendedProducts(
  product: MockProduct,
  catalog: readonly MockProduct[],
  limit = 4,
): MockProduct[] {
  const pool = [...catalog].filter((p) => p.slug !== product.slug);
  const sameCategory = pool.filter((p) => p.discovery.categorySlug === product.discovery.categorySlug);
  rankedByFeatured(sameCategory);
  const chosen = [...sameCategory];
  if (chosen.length < limit) {
    const rest = pool.filter((p) => !chosen.includes(p));
    rankedByFeatured(rest);
    chosen.push(...rest.slice(0, limit - chosen.length));
  }
  return chosen.slice(0, limit);
}

function rankedByFeatured(items: MockProduct[]): void {
  items.sort((a, b) => b.discovery.featuredRank - a.discovery.featuredRank);
}

export function getTrendingProducts(
  catalog: readonly MockProduct[],
  limit = 4,
): MockProduct[] {
  return sortProductsForDiscovery([...catalog], "trending").slice(0, limit);
}

/** Jaccard overlap on SKU membership */
export function getRelatedCollections(
  collectionSlug: string,
  definitions: readonly CollectionConfig[],
  limit = 3,
): { slug: string; title: string; score: number; sharedCount: number }[] {
  const target = definitions.find((c) => c.slug === collectionSlug);
  if (!target) return [];
  const ta = new Set(target.productSlugs);
  const rows = definitions
    .filter((c) => c.slug !== collectionSlug)
    .map((c) => {
      const tb = new Set(c.productSlugs);
      let inter = 0;
      for (const s of tb) if (ta.has(s)) inter += 1;
      const union = ta.size + tb.size - inter || 1;
      return {
        slug: c.slug,
        title: c.title,
        score: inter / union,
        sharedCount: inter,
      };
    })
    .filter((r) => r.sharedCount > 0)
    .sort((a, b) => b.score - a.score || b.sharedCount - a.sharedCount);
  return rows.slice(0, limit);
}

export type DiscoveryFacetBuckets = ReturnType<typeof buildDiscoveryFacetBuckets>;

export type CatalogueSearchHit = Pick<
  MockProduct,
  "slug" | "name" | "priceCents" | "currency" | "image" | "imageAlt"
> & { categorySlug: string };

export function searchCatalogueLocally(
  catalog: readonly MockProduct[],
  q: string,
  limit = 8,
): CatalogueSearchHit[] {
  const t = q.trim();
  if (!t.length) return [];
  return catalog
    .filter((p) => matchesSearch(p, t))
    .slice(0, limit)
    .map((p) => ({
      slug: p.slug,
      name: p.name,
      priceCents: p.priceCents,
      currency: p.currency,
      image: p.image,
      imageAlt: p.imageAlt,
      categorySlug: p.discovery.categorySlug,
    }));
}
