import { mergeHomepageSectionStackNow } from "@/services/homepage-configuration";
import { mergeCatalogNow } from "@/services/products";
import type {
  CategoryShowcaseSectionConfig,
  HomepageSectionResolved,
  ProductGridSectionConfig,
  ProductRailSectionConfig,
  ProductSliderSectionConfig,
} from "@/types/homepage";
import type { MockProduct } from "@/types/product";

function orderedProductsFromSlugs(slugs: string[], catalog: readonly MockProduct[]): MockProduct[] {
  const bySlug = new Map(catalog.map((p) => [p.slug, p]));
  return slugs
    .map((slug) => bySlug.get(slug))
    .filter((p): p is MockProduct => Boolean(p));
}

function resolveProductRail(
  section: ProductRailSectionConfig,
  catalog: readonly MockProduct[],
): HomepageSectionResolved {
  const slugSet =
    section.productSlugs?.length ?
      new Set(section.productSlugs)
    : new Set(catalog.filter((p) => p.tag).map((p) => p.slug));

  const picked = catalog.filter((p) => slugSet.has(p.slug));
  const ordered: MockProduct[] =
    section.productSlugs?.length ?
      section.productSlugs
        .map((slug) => picked.find((p) => p.slug === slug))
        .filter((p): p is MockProduct => Boolean(p))
    : picked;

  return {
    ...section,
    products: ordered.length ? ordered : [...catalog.slice(0, 4)],
  };
}

function resolveProductGrid(section: ProductGridSectionConfig, catalog: readonly MockProduct[]): HomepageSectionResolved {
  const ordered = orderedProductsFromSlugs(section.productSlugs, catalog);

  return {
    ...section,
    products: ordered.length ? ordered : [...catalog.slice(0, 4)],
  };
}

function resolveCategoryShowcase(
  section: CategoryShowcaseSectionConfig,
  catalog: readonly MockProduct[],
): HomepageSectionResolved {
  const ordered = orderedProductsFromSlugs(section.productSlugs, catalog);

  return {
    ...section,
    products: ordered.length ? ordered : [...catalog.slice(0, 4)],
  };
}

function resolveProductSlider(
  section: ProductSliderSectionConfig,
  catalog: readonly MockProduct[],
): HomepageSectionResolved {
  if (section.productSlugs?.length) {
    const ordered = orderedProductsFromSlugs(section.productSlugs, catalog);
    return {
      ...section,
      products: ordered.length ? ordered : [...catalog.slice(0, 6)],
    };
  }

  const trending = catalog.filter(
    (p) => p.tag === "bestseller" || p.tag === "new" || p.tag === "limited",
  );

  return {
    ...section,
    products:
      trending.length >= 4 ? [...trending] : [...catalog.slice(0, 6)],
  };
}

/** Merges homepage CMS stack + catalogue data */
export async function getHomepageSections(): Promise<HomepageSectionResolved[]> {
  const [catalog, configs] = await Promise.all([
    mergeCatalogNow(),
    mergeHomepageSectionStackNow(),
  ]);

  return configs.map((section): HomepageSectionResolved => {
    switch (section.type) {
      case "product-rail":
        return resolveProductRail(section, catalog);
      case "product-grid":
        return resolveProductGrid(section, catalog);
      case "category-showcase":
        return resolveCategoryShowcase(section, catalog);
      case "product-slider":
        return resolveProductSlider(section, catalog);
      default:
        return section as HomepageSectionResolved;
    }
  });
}
