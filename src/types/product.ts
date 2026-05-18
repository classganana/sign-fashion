/** Rich PDP fields aligned with scalable commerce/CMS payloads */
export type ProductDetails = {
  fit: string;
  fabric: string;
  washCare: string;
  styleNotes: string;
  deliveryNotes: string;
  /** Short editorial capsule (storytelling hero) — optional until CMS attaches long-form */
  editorialLead?: string;
  packagingStory?: string;
  /** Subtle reassurance copy near commerce */
  returnsComfort?: string;
  secureCheckoutHint?: string;
  /** Badge-style fabric signal beside technical fabric copy */
  fabricSignal?: string;
};

/** PDP gallery slides — resolves through `productImageSrc` helpers */
export type ProductGallerySlide = {
  url: string;
  alt: string;
  cloudinaryPublicId?: string;
};

/** URL + filter engine faceting — persists to Mongo/CMS later */
export type ProductDiscoveryProfile = {
  categorySlug: string;
  sizes: readonly string[];
  colors: readonly string[];
  fits: readonly string[];
  /** Capsule memberships for collection filter chips */
  collections: readonly string[];
  /** Merchandising tags (tees / layering / etc.) */
  tags: readonly string[];
  /** Higher sorts first under “Featured” */
  featuredRank: number;
  /** Mock trending score until analytics exist */
  trendingRank: number;
  /** Placement in “Newest” */
  releasedAtMs: number;
};

export type MockProduct = {
  id: string;
  slug: string;
  name: string;
  /** Short selling paragraph shown above the fold */
  description: string;
  priceCents: number;
  currency: "INR";
  discovery: ProductDiscoveryProfile;
  /** Primary hero image URL (HTTPS). Prefer Unsplash/direct URL today; migrate to derived URLs via `Cloudinary.` */
  image: string;
  imageAlt: string;
  /** When set + `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, PDP/cards optimize via Cloudinary transforms */
  cloudinaryPublicId?: string;
  /** Ordered PDP gallery; omit to fall back to hero only */
  gallery?: readonly ProductGallerySlide[];
  tag?: "new" | "limited" | "bestseller";
  details: ProductDetails;
  /** Admin preview for IMS thresholds — storefront ignores until stock service connects */
  lowStockThresholdUnits?: number;
};

export type ProductDocument = {
  _id: string;
  slug: string;
  name: string;
  description: string;
  details: ProductDetails;
  discovery?: ProductDiscoveryProfile;
  priceCents: number;
  currency: "INR";
  images: string[];
  cloudinaryPublicIds?: string[];
  collectionSlugs: string[];
  tags: string[];
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
};
