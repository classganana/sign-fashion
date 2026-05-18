import type { HomepageSectionConfig } from "@/types/homepage";

const HERO_IMG =
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=2400&q=75";

/** Minimal valid starter blocks — merged into KV via visual CMS */
export function createBlankHomepageSection(type: HomepageSectionConfig["type"], nonce: string): HomepageSectionConfig {
  const id = `${type}-${nonce}`;
  switch (type) {
    case "hero":
      return {
        id,
        type: "hero",
        eyebrow: "New drop",
        title: "Your headline here",
        subtitle: "Supporting line about this banner.",
        image: HERO_IMG,
        imageAlt: "Campaign banner",
        primaryCta: { label: "Shop now", href: "/products" },
        secondaryCta: { label: "Explore capsules", href: "/collections" },
      };
    case "product-grid":
      return {
        id,
        type: "product-grid",
        eyebrow: "Just landed",
        headline: "Featured pieces",
        subline: "Curate products below.",
        productSlugs: [],
        cta: { label: "View all", href: "/products" },
      };
    case "product-slider":
      return {
        id,
        type: "product-slider",
        eyebrow: "Trending",
        headline: "Moving fast",
        subline: "Select products for this rail.",
        productSlugs: [],
      };
    case "product-rail":
      return {
        id,
        type: "product-rail",
        headline: "Edit rail headline",
        subline: "",
        productSlugs: [],
      };
    case "category-showcase":
      return {
        id,
        type: "category-showcase",
        eyebrow: "Spotlight",
        headline: "Category story",
        subline: "",
        productSlugs: [],
        cta: { label: "Shop", href: "/products" },
      };
    case "collections-featured":
      return {
        id,
        type: "collections-featured",
        eyebrow: "Capsules",
        headline: "Featured collections",
        subline: "",
        items: [],
      };
    case "editorial-grid":
      return {
        id,
        type: "editorial-grid",
        headline: "Editorial picks",
        subline: "",
        items: [],
      };
    case "brand-story":
      return {
        id,
        type: "brand-story",
        eyebrow: "Our story",
        headline: "Craft & calm",
        body: ["First paragraph.", "Second paragraph."],
        image: HERO_IMG,
        imageAlt: "Brand imagery",
        cta: { label: "Discover", href: "/about" },
      };
    case "social-gallery":
      return {
        id,
        type: "social-gallery",
        headline: "On the street",
        subline: "",
        username: "signfashion",
        posts: [],
      };
    case "statement":
      return {
        id,
        type: "statement",
        quote: "Your signature quote.",
        attribution: "",
      };
    case "newsletter":
      return {
        id,
        type: "newsletter",
        headline: "Stay close.",
        subline: "Announcements without spam.",
      };
    default: {
      const _exhaustive: never = type;
      void _exhaustive;
      throw new Error("Unknown homepage section type");
    }
  }
}

export const HOMEPAGE_SECTION_TYPE_OPTIONS: { value: HomepageSectionConfig["type"]; label: string }[] = [
  { value: "hero", label: "Hero banner" },
  { value: "product-grid", label: "Product grid" },
  { value: "product-slider", label: "Product slider" },
  { value: "product-rail", label: "Product rail" },
  { value: "category-showcase", label: "Category spotlight" },
  { value: "collections-featured", label: "Featured collections" },
  { value: "editorial-grid", label: "Editorial grid" },
  { value: "brand-story", label: "Brand story" },
  { value: "social-gallery", label: "Social gallery" },
  { value: "statement", label: "Statement quote" },
  { value: "newsletter", label: "Newsletter signup" },
];
