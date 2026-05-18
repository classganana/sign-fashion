"""One-off patching script."""
from pathlib import Path

ROOT = Path("/Users/ayushdixit/Documents/Freelance Workspace/sign-fashion")

slug_page = ROOT / "src/app/products/[slug]/page.tsx"
txt = slug_page.read_text()
txt = txt.replace(
    'import { collectionsContainingProductSlug } from "@/config/collections";',
    'import { collectionsHostingProductSlug } from "@/lib/collections-utils";',
)
txt = txt.replace(
    'import { getProductBySlug, getStaticCatalog, getStaticProductSlugParams } from "@/services/products";',
    """import {
  getAllPublishedSlugParams,
  getProductBySlug,
  mergeCatalogNow,
} from "@/services/products";""",
)
if 'getUnifiedCollections' not in txt:
    txt = txt.replace(
        'import { getRelatedCollections } from "@/services/product-discovery";',
        """import { getRelatedCollections } from "@/services/product-discovery";
import { getUnifiedCollections } from "@/services/collections-catalog";""",
    )
txt = txt.replace("  return getStaticProductSlugParams();", "  return getAllPublishedSlugParams();")
old_block = '''  const catalogue = getStaticCatalog();
  const resolvedGallery = resolveGalleryForPdp(product);

  const sizeAvailability = getMockSizeAvailability(product.discovery.sizes);

  const relatedStyles = getRelatedStyles(product, catalogue);
  const taken = new Set<string>([product.slug]);
  relatedStyles.forEach((row) => taken.add(row.slug));

  const rawComplete = getCompleteTheLook(product, catalogue);
  const completeTheLook = rawComplete.filter((p) => !taken.has(p.slug));
  completeTheLook.forEach((p) => taken.add(p.slug));

  const youMayAlsoLike = getYouMayAlsoLike(product, catalogue, taken, 5);

  const primaryCapsules = collectionsContainingProductSlug(slug).sort((a, b) =>
    a.slug.localeCompare(b.slug),
  );
  const focal = primaryCapsules[0]?.slug ?? null;
  const relatedCollections =
    focal ? getRelatedCollections(focal).map(({ slug: s, title, sharedCount }) => ({
      slug: s,
      title,
      sharedCount,
    }))
  : [];
'''
new_block = '''  const [catalogue, capsuleDefinitions] = await Promise.all([
    mergeCatalogNow(),
    getUnifiedCollections(),
  ]);
  const resolvedGallery = resolveGalleryForPdp(product);

  const sizeAvailability = getMockSizeAvailability(product.discovery.sizes);

  const relatedStyles = getRelatedStyles(product, catalogue);
  const taken = new Set<string>([product.slug]);
  relatedStyles.forEach((row) => taken.add(row.slug));

  const rawComplete = getCompleteTheLook(product, catalogue);
  const completeTheLook = rawComplete.filter((p) => !taken.has(p.slug));
  completeTheLook.forEach((p) => taken.add(p.slug));

  const youMayAlsoLike = getYouMayAlsoLike(product, catalogue, taken, 5);

  const primaryCapsules = collectionsHostingProductSlug(capsuleDefinitions, slug).sort((a, b) =>
    a.slug.localeCompare(b.slug),
  );
  const dropsEyebrow = primaryCapsules.length ? primaryCapsules.map((c) => c.title).join(" · ") : null;
  const focal = primaryCapsules[0]?.slug ?? null;
  const relatedCollections =
    focal
      ? getRelatedCollections(focal, capsuleDefinitions).map(({ slug: s, title, sharedCount }) => ({
          slug: s,
          title,
          sharedCount,
        }))
      : [];
'''
if old_block not in txt:
    raise SystemExit("slug page block mismatch")
txt = txt.replace(old_block, new_block)
txt = txt.replace(
    "<ProductPdpView\n",
    "<ProductPdpView\n      dropsEyebrow={dropsEyebrow}\n",
    1,
)
slug_page.write_text(txt)

tr = ROOT / "src/features/product-discovery/products-trending-rail.tsx"
txt = tr.read_text()
txt = txt.replace(
    'import { getStaticCatalog } from "@/services/products";',
    'import { mergeCatalogNow } from "@/services/products";',
)
txt = txt.replace(
    "export function ProductsTrendingRail() {\n  const picks = getTrendingProducts(getStaticCatalog(), 4);",
    "export async function ProductsTrendingRail() {\n  const catalog = await mergeCatalogNow();\n  const picks = getTrendingProducts(catalog, 4);",
)
tr.write_text(txt)

ar = ROOT / "src/app/api/catalog/search/route.ts"
txt = ar.read_text()
txt = txt.replace(
    'import { getStaticCatalog } from "@/services/products";',
    'import { mergeCatalogNow } from "@/services/products";',
)
txt = txt.replace(
    "  const results = searchCatalogueLocally(getStaticCatalog(), q, 12);",
    "  const catalog = await mergeCatalogNow();\n  const results = searchCatalogueLocally(catalog, q, 12);",
)
ar.write_text(txt)

sm = ROOT / "src/app/sitemap.ts"
txt = sm.read_text()
txt = txt.replace(
    'import { collections } from "@/config/collections";',
    'import { mergeCollectionsCatalogNow } from "@/services/collections-catalog";',
)
txt = txt.replace(
    'import { getStaticCatalog } from "@/services/products";',
    'import { mergeCatalogNow } from "@/services/products";',
)
txt = txt.replace(
    "export default function sitemap(): MetadataRoute.Sitemap {",
    "export default async function sitemap(): Promise<MetadataRoute.Sitemap> {",
)
txt = txt.replace(
    "  const products = getStaticCatalog().map((p) => ({",
    """  const [productsList, capsuleRows] = await Promise.all([
    mergeCatalogNow(),
    mergeCollectionsCatalogNow(),
  ]);
  const products = productsList.map((p) => ({""",
)
txt = txt.replace(
    "  const collectionRoutes = collections.map((c) => ({",
    "  const collectionRoutes = capsuleRows.map((c) => ({",
)
sm.write_text(txt)

idx = ROOT / "src/app/collections/page.tsx"
txt = idx.read_text()
txt = txt.replace(
    'import { collections } from "@/config/collections";',
    'import { getUnifiedCollections } from "@/services/collections-catalog";',
)
txt = txt.replace(
    "export default function CollectionsIndexPage() {",
    """export default async function CollectionsIndexPage() {
  const capsuleRows = await getUnifiedCollections();""",
)
txt = txt.replace("{collections.map", "{capsuleRows.map")
idx.write_text(txt)

print("ok")
