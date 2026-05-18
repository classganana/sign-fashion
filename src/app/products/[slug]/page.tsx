import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { site } from "@/config/site";
import { collectionsHostingProductSlug } from "@/lib/collections-utils";
import { ProductPdpView } from "@/features/products/product-pdp-view";
import { resolveGalleryForPdp } from "@/lib/product-gallery";
import { productImageSrc } from "@/lib/images";
import {
  getCompleteTheLook,
  getRelatedStyles,
  getYouMayAlsoLike,
  getMockSizeAvailability,
} from "@/services/pdp-merchandising";
import { getRelatedCollections } from "@/services/product-discovery";
import { getUnifiedCollections } from "@/services/collections-catalog";
import {
  getAllPublishedSlugParams,
  getProductBySlug,
  mergeCatalogNow,
} from "@/services/products";

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  return getAllPublishedSlugParams();
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product" };

  const ogImage = productImageSrc(product, 1600);

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      url: `${site.url.replace(/\/$/, "")}/products/${product.slug}`,
      siteName: site.name,
      images: [{ url: ogImage, alt: product.imageAlt, width: 1200, height: 1600 }],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description,
      images: [ogImage],
    },
  };
}

export default async function ProductDetailPage(props: Props) {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const [catalogue, capsuleDefinitions] = await Promise.all([
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

  return (
    <ProductPdpView
      dropsEyebrow={dropsEyebrow}
      product={product}
      catalogue={catalogue}
      resolvedGallery={resolvedGallery}
      sizeAvailability={sizeAvailability}
      relatedStyles={relatedStyles}
      completeTheLook={completeTheLook}
      youMayAlsoLike={youMayAlsoLike}
      relatedCollections={relatedCollections}
    />
  );
}
