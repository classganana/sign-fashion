import type { MockProduct } from "./product";

export type HeroSectionConfig = {
  id: string;
  type: "hero";
  eyebrow?: string;
  title: string;
  subtitle?: string;
  image: string;
  imageAlt: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
};

export type EditorialGridItem = {
  title: string;
  caption?: string;
  href: string;
  image: string;
  imageAlt: string;
};

export type EditorialGridSectionConfig = {
  id: string;
  type: "editorial-grid";
  headline: string;
  subline?: string;
  items: EditorialGridItem[];
};

export type ProductRailSectionConfig = {
  id: string;
  type: "product-rail";
  headline: string;
  subline?: string;
  productSlugs?: string[];
};

/** Gridded product shelf (e.g. new arrivals). */
export type ProductGridSectionConfig = {
  id: string;
  type: "product-grid";
  eyebrow?: string;
  headline: string;
  subline?: string;
  productSlugs: string[];
  cta?: { label: string; href: string };
};

export type CollectionsFeaturedItem = {
  title: string;
  description?: string;
  href: string;
  image: string;
  imageAlt: string;
};

export type CollectionsFeaturedSectionConfig = {
  id: string;
  type: "collections-featured";
  eyebrow?: string;
  headline: string;
  subline?: string;
  items: CollectionsFeaturedItem[];
};

/** Split headline + horizontal product strip (e.g. category spotlight). */
export type CategoryShowcaseSectionConfig = {
  id: string;
  type: "category-showcase";
  eyebrow?: string;
  headline: string;
  subline?: string;
  productSlugs: string[];
  cta?: { label: string; href: string };
};

/** Horizontal scroll / slider rail for trending picks. */
export type ProductSliderSectionConfig = {
  id: string;
  type: "product-slider";
  eyebrow?: string;
  headline: string;
  subline?: string;
  productSlugs?: string[];
};

export type BrandStorySectionConfig = {
  id: string;
  type: "brand-story";
  eyebrow?: string;
  headline: string;
  body: string[];
  image: string;
  imageAlt: string;
  cta?: { label: string; href: string };
};

export type SocialGalleryPost = {
  image: string;
  imageAlt: string;
  href?: string;
};

export type SocialGallerySectionConfig = {
  id: string;
  type: "social-gallery";
  headline?: string;
  subline?: string;
  username: string;
  /** When omitted, hero link shows handle only — no outbound profile URL. */
  profileHref?: string;
  posts: SocialGalleryPost[];
};

export type StatementSectionConfig = {
  id: string;
  type: "statement";
  quote: string;
  attribution?: string;
};

export type NewsletterSectionConfig = {
  id: string;
  type: "newsletter";
  headline: string;
  subline?: string;
};

export type HomepageSectionConfig =
  | HeroSectionConfig
  | EditorialGridSectionConfig
  | ProductRailSectionConfig
  | ProductGridSectionConfig
  | CollectionsFeaturedSectionConfig
  | CategoryShowcaseSectionConfig
  | ProductSliderSectionConfig
  | BrandStorySectionConfig
  | SocialGallerySectionConfig
  | StatementSectionConfig
  | NewsletterSectionConfig;

export type ProductRailSectionResolved = Omit<
  ProductRailSectionConfig,
  "productSlugs"
> & {
  products: MockProduct[];
};

export type ProductGridSectionResolved = ProductGridSectionConfig & {
  products: MockProduct[];
};

export type CategoryShowcaseSectionResolved = CategoryShowcaseSectionConfig & {
  products: MockProduct[];
};

export type ProductSliderSectionResolved = Omit<
  ProductSliderSectionConfig,
  "productSlugs"
> & {
  products: MockProduct[];
};

export type HomepageSectionResolved =
  | HeroSectionConfig
  | EditorialGridSectionConfig
  | ProductRailSectionResolved
  | ProductGridSectionResolved
  | CollectionsFeaturedSectionConfig
  | CategoryShowcaseSectionResolved
  | ProductSliderSectionResolved
  | BrandStorySectionConfig
  | SocialGallerySectionConfig
  | StatementSectionConfig
  | NewsletterSectionConfig;
