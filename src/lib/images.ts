/**
 * Central image helpers — Cloudinary-ready, Unsplash-normalized.
 * PDP and cards resolve through `productImageSrc` for consistent optimisation.
 */

import type { MockProduct, ProductGallerySlide } from "@/types/product";

const cloudinaryCloud =
  typeof process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME === "string"
    ? process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME.trim()
    : "";

type TransformOpts = {
  width: number;
  quality?: number | "auto";
};

export function cloudinaryImageUrl(publicId: string, opts: TransformOpts): string {
  const q = opts.quality ?? "auto";
  const w = opts.width;
  if (!cloudinaryCloud) return "";
  const id = publicId.replace(/^\/+/, "");
  return `https://res.cloudinary.com/${cloudinaryCloud}/image/upload/c_limit,w_${w},q_${q},f_auto/${id.split("/").map(encodeURIComponent).join("/")}`;
}

/** Resolve gallery slide or hero image for `<Image src={...}>` */
export function gallerySlideSrc(
  slide: Pick<ProductGallerySlide, "url" | "cloudinaryPublicId">,
  width = 1400,
): string {
  return productImageSrc(slide, width);
}

export function productImageSrc(
  product: Pick<MockProduct, "image" | "cloudinaryPublicId"> | Pick<ProductGallerySlide, "url" | "cloudinaryPublicId">,
  width = 1400,
): string {
  const imageUrl = "image" in product ? product.image : product.url;
  const cloudId =
    "cloudinaryPublicId" in product ?
      product.cloudinaryPublicId
    : undefined;
  if (cloudId && cloudinaryCloud) {
    const cdn = cloudinaryImageUrl(cloudId, {
      width: Math.min(width, 1600),
    });
    if (cdn) return cdn;
  }
  return normalizeRemoteImageUrl(imageUrl, width);
}

/** Any remote marketing image — normalises Unsplash query params when applicable */
export function optimizeRemoteImageUrl(url: string, width = 1600): string {
  return normalizeRemoteImageUrl(url, width);
}

function normalizeRemoteImageUrl(url: string, width: number): string {
  if (!url.startsWith("https://images.unsplash.com/")) return url;
  try {
    const parsed = new URL(url);
    parsed.searchParams.set("w", String(Math.min(width, 2000)));
    parsed.searchParams.set("q", "75");
    parsed.searchParams.set("auto", "format");
    return parsed.toString();
  } catch {
    return url;
  }
}

/** Standard `sizes` hints for PDP hero */
export const imageSizes = {
  pdpHero: "(max-width: 1024px) 100vw, 54vw",
  /** Full-bleed mobile gallery track */
  pdpGallerySwipe: "(max-width: 1024px) 92vw, 42vw",
  pdpGalleryThumb: "72px",
  cardGrid: "(max-width: 768px) 50vw, 33vw",
  cardRail: "(max-width: 768px) 74vw, 38vw",
  cartThumb: "144px",
  collectionHero: "100vw",
} as const;
