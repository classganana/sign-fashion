import { collections } from "@/config/collections";
import { site } from "@/config/site";
import type { HomepageSectionConfig } from "@/types/homepage";

const featuredCollectionItems = collections.map((c) => ({
  title: c.title,
  description: c.description,
  href: `/collections/${c.slug}`,
  image: c.heroImage,
  imageAlt: c.heroAlt,
}));

/**
 * Homepage section stack — reorder, disable, or replace entries for CMS payloads.
 */
export const defaultHomepageSections: HomepageSectionConfig[] = [
  {
    id: "hero-primary",
    type: "hero",
    eyebrow: "Winter city drop",
    title: "Engineered tees. Editorial edge.",
    subtitle:
      "Precision cuts, heavyweight jersey, oversized silhouettes — built for layering like high-end streetwear labels.",
    image:
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=2400&q=75",
    imageAlt: "Model in monochrome street outfit under urban light",
    primaryCta: { label: "Shop new arrivals", href: "/products?tag=new" },
    secondaryCta: { label: "Featured capsules", href: "/collections" },
  },
  {
    id: "new-arrivals",
    type: "product-grid",
    eyebrow: "Just landed",
    headline: "New arrivals",
    subline:
      "Introductory cuts for the season — texture-led jersey and sculpted layers with editorial restraint.",
    productSlugs: [
      "sign-heavy-tee-pebble",
      "sign-box-tee-void",
      "sign-longline-tee-ink",
      "sign-merino-crew-ivory",
      "sign-field-jacket-stone",
      "sign-studio-crew-milk",
    ],
    cta: { label: "View all new in", href: "/products?tag=new" },
  },
  {
    id: "featured-collections",
    type: "collections-featured",
    eyebrow: "Capsules",
    headline: "Featured collections",
    subline:
      "Three tonal worlds — monochrome tension, softened tailoring, midnight confidence.",
    items: featuredCollectionItems,
  },
  {
    id: "oversized-tees",
    type: "category-showcase",
    eyebrow: "Category spotlight",
    headline: "Oversized tees that hold structure.",
    subline:
      "Dropped shoulders, elongated hems, and dense cotton that keeps its silhouette — signatures of modern Indian street labels.",
    productSlugs: [
      "sign-box-tee-void",
      "sign-heavy-tee-pebble",
      "sign-pocket-tee-ash",
      "sign-longline-tee-ink",
      "sign-studio-crew-milk",
      "sign-oversized-shirt-oat",
    ],
    cta: { label: "Shop tees", href: "/products" },
  },
  {
    id: "trending-slider",
    type: "product-slider",
    eyebrow: "Moving fast",
    headline: "Trending now",
    subline:
      "Velocity edits from the rails — repeats on structure-first shapes that photograph clean in daylight or flash.",
    productSlugs: [
      "sign-pocket-tee-ash",
      "sign-tailored-trouser-charcoal",
      "sign-box-tee-void",
      "sign-knitted-vest-graphite",
      "sign-field-jacket-stone",
    ],
  },
  {
    id: "brand-story",
    type: "brand-story",
    eyebrow: "Sign Fashion",
    headline: "Calm rebellion. Serious craft.",
    body: [
      "We design around movement — tees that skim, trousers that articulate, jackets that soften noise without losing silhouette.",
      "Every drop is intentional: restrained palettes, obsessive fabric selection, construction that survives daily rotation. Minimal on the hanger, unmistakable on-body.",
      "This isn’t novelty merch — it’s a wardrobe blueprint for navigating cities with quiet confidence.",
    ],
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d?auto=format&fit=crop&w=1800&q=75",
    imageAlt: "Boutique interior with garments on wooden rails",
    cta: { label: "Read our story", href: "/about" },
  },
  {
    id: "social-gallery",
    type: "social-gallery",
    headline: "@signfashion on the street",
    subline:
      "A living moodboard — fit checks, backstage energy, tactile close-ups tagged by the community.",
    username: "signfashion",
    profileHref: site.social.instagram,
    posts: [
      {
        image:
          "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=75",
        imageAlt: "Street portrait layered outerwear",
        href: "/products/sign-field-jacket-stone",
      },
      {
        image:
          "https://images.unsplash.com/photo-1503342217505-b0a15ec32621?auto=format&fit=crop&w=600&q=75",
        imageAlt: "Urban minimal outfit mirrored wall",
      },
      {
        image:
          "https://images.unsplash.com/photo-1542293787938-4d273cbbafe4?auto=format&fit=crop&w=600&q=75",
        imageAlt: "Athletic sneaker and denim detail crop",
      },
      {
        image:
          "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=75",
        imageAlt: "Folded monochrome knit stack",
      },
      {
        image:
          "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=75",
        imageAlt: "Model walking city crosswalk tailoring",
      },
      {
        image:
          "https://images.unsplash.com/photo-1558171813-2c088f49d5d3?auto=format&fit=crop&w=600&q=75",
        imageAlt: "Fashion studio lighting silhouette",
      },
    ],
  },
  {
    id: "newsletter-end",
    type: "newsletter",
    headline: "First to know.",
    subline:
      "Private previews, replenishment pings, capsule codes — sparingly sent, deliberately crafted.",
  },
];
