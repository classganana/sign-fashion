import type { CollectionConfig } from "@/config/collections";

export function collectionsHostingProductSlug(
  definitions: readonly CollectionConfig[],
  productSlug: string,
): CollectionConfig[] {
  return definitions.filter((c) => c.productSlugs.includes(productSlug));
}
