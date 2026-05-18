import type { MockProduct } from "@/types/product";

export type MockSizeAvailability = "in_stock" | "low" | "sold_out";

/** Placeholder sizing signal — replaces with CMS / IMS rows */
export function getMockSizeAvailability(
  sizes: readonly string[],
): Record<string, MockSizeAvailability> {
  const entries = sizes.map((s, idx) => {
    if (sizes.length >= 4 && idx === sizes.length - 1)
      return [s, "sold_out" as MockSizeAvailability];
    const mod = idx % 5;
    if (mod === 0) return [s, "low" as MockSizeAvailability];
    return [s, "in_stock" as MockSizeAvailability];
  });
  return Object.fromEntries(entries);
}

const COMPLEMENT_MAP: Partial<Record<MockProduct["discovery"]["categorySlug"], string[]>> = {
  tees: ["tailoring", "outerwear", "knitwear", "shirts"],
  knitwear: ["tees", "tailoring", "outerwear"],
  outerwear: ["tees", "knitwear", "tailoring"],
  tailoring: ["tees", "outerwear", "shirts"],
  shirts: ["tailoring", "outerwear", "tees"],
};

/** Cross-category layering without repeating the focal category */
export function getCompleteTheLook(
  product: MockProduct,
  catalog: readonly MockProduct[],
  limit = 3,
): MockProduct[] {
  const targets =
    COMPLEMENT_MAP[product.discovery.categorySlug] ?? ["tees", "tailoring", "outerwear"];
  const capsules = new Set(product.discovery.collections);
  const pool = catalog.filter(
    (p) =>
      p.slug !== product.slug &&
      targets.includes(p.discovery.categorySlug) &&
      p.discovery.collections.some((c) => capsules.has(c)),
  );
  if (pool.length < limit) {
    const widen = catalog.filter(
      (p) => p.slug !== product.slug && targets.includes(p.discovery.categorySlug),
    );
    widen.sort((a, b) => b.discovery.featuredRank - a.discovery.featuredRank);
    for (const item of widen) {
      if (pool.includes(item)) continue;
      pool.push(item);
      if (pool.length >= limit) break;
    }
  }
  return pool.slice(0, limit).sort((a, b) => b.discovery.trendingRank - a.discovery.trendingRank);
}

/** Same aisle, differentiated by colour cluster / silhouette notes */
export function getRelatedStyles(
  product: MockProduct,
  catalog: readonly MockProduct[],
  limit = 3,
): MockProduct[] {
  const pool = catalog.filter(
    (p) =>
      p.slug !== product.slug &&
      p.discovery.categorySlug === product.discovery.categorySlug &&
      !p.discovery.colors.some((c) => product.discovery.colors.includes(c)),
  );
  rankedByFeatured(pool);
  if (pool.length < limit) {
    const same = catalog.filter(
      (p) => p.slug !== product.slug && p.discovery.categorySlug === product.discovery.categorySlug,
    );
    rankedByFeatured(same);
    for (const item of same) {
      if (pool.includes(item)) continue;
      pool.push(item);
      if (pool.length >= limit) break;
    }
  }
  return pool.slice(0, limit);
}

function rankedByFeatured(items: MockProduct[]): void {
  items.sort((a, b) => b.discovery.featuredRank - a.discovery.featuredRank);
}

/** Trending-first picks that avoid repeating earlier PDP rails */
export function getYouMayAlsoLike(
  product: MockProduct,
  catalog: readonly MockProduct[],
  alreadyShown: ReadonlySet<string>,
  limit = 4,
): MockProduct[] {
  const ban = new Set(alreadyShown);
  ban.add(product.slug);
  const pool = catalog.filter((p) => !ban.has(p.slug));
  pool.sort((a, b) => b.discovery.trendingRank - a.discovery.trendingRank);
  return pool.slice(0, limit);
}
