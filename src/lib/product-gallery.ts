import { gallerySlideSrc } from "@/lib/images";
import type { MockProduct, ProductGallerySlide } from "@/types/product";

export function normalizeProductGallery(product: MockProduct): ProductGallerySlide[] {
  const from = product.gallery?.length ? [...product.gallery] : [];
  if (!from.length) {
    return [
      {
        url: product.image,
        alt: product.imageAlt,
        cloudinaryPublicId: product.cloudinaryPublicId,
      },
    ];
  }
  return from;
}

export type ResolvedGallerySlide = {
  srcFull: string;
  srcCard: string;
  alt: string;
};

export function resolveGalleryForPdp(
  product: MockProduct,
): ResolvedGallerySlide[] {
  return normalizeProductGallery(product).map((slide) => ({
    alt: slide.alt,
    srcFull: gallerySlideSrc(slide, 1600),
    srcCard: gallerySlideSrc(slide, 880),
  }));
}
