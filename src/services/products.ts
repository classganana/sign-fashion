import { cache } from "react";

import { mockProducts } from "@/data/mock-products";
import { loadPublishedCmsProducts } from "@/services/cms-product-repository";
import type { MockProduct } from "@/types/product";

function cloneProduct(p: MockProduct): MockProduct {
  try {
    return structuredClone(p);
  } catch {
    return JSON.parse(JSON.stringify(p)) as MockProduct;
  }
}

/** Deduped catalogue merge — codebase seeds + validated Mongo overlays published flag */
export async function mergeCatalogNow(): Promise<MockProduct[]> {
  const overlays = await loadPublishedCmsProducts();
  const bySlug = new Map(mockProducts.map((p) => [p.slug, cloneProduct(p)]));
  overlays.forEach((payload, slug) => bySlug.set(slug, payload));
  return Array.from(bySlug.values()).sort((a, b) => a.slug.localeCompare(b.slug));
}

export const getUnifiedCatalog = cache(mergeCatalogNow);

/** Deterministic codegen / sync surfaces without Mongo latency */
export function getStaticCatalog(): readonly MockProduct[] {
  return mockProducts;
}

export async function getAllPublishedSlugParams(): Promise<Array<{ slug: string }>> {
  const list = await mergeCatalogNow();
  return list.map((p) => ({ slug: p.slug }));
}

/** Prefer `getAllPublishedSlugParams` — mock-only enumeration for deterministic fallbacks */
export function getStaticProductSlugParams(): Array<{ slug: string }> {
  return mockProducts.map((p) => ({ slug: p.slug }));
}

export async function listPublishedProducts(filters?: {
  tag?: MockProduct["tag"];
}): Promise<MockProduct[]> {
  const list = await mergeCatalogNow();
  if (!filters?.tag) return list;
  return list.filter((p) => p.tag === filters.tag);
}

export async function getProductBySlug(slug: string): Promise<MockProduct | null> {
  const list = await mergeCatalogNow();
  return list.find((p) => p.slug === slug) ?? null;
}
