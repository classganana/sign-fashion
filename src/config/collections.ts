/** Curated capsules — aligns with editorial grid deeplinks until CMS replaces this. */

export type CollectionTone = "mono" | "ember" | "midnight";

export type CollectionConfig = {
  slug: string;
  title: string;
  description: string;
  heroImage: string;
  heroAlt: string;
  /** Secondary editorial frame for stitched storytelling layouts */
  storyImage?: string;
  storyImageAlt?: string;
  /** Two short beats for PDP / capsule essays */
  storyBeats?: [string, string];
  tone: CollectionTone;
  productSlugs: string[];
};

export const collections: CollectionConfig[] = [
  {
    slug: "monochrome-pulse",
    title: "Monochrome pulse",
    description:
      "High-contrast layers for city nights — sculpted outerwear over fluid jersey bases stitched for Bombay sodium light.",
    tone: "mono",
    heroImage:
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1600&q=80",
    heroAlt: "Monochrome layered outfit editorial",
    storyImage:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1600&q=80",
    storyImageAlt: "Black tee sculpted under directional light",
    storyBeats: [
      "Contrast is kinetic — sculpted wool against molten jerseys keeps movement legible.",
      "Every SKU is calibrated for midnight commutes yet dissolves politely into daylight coffees.",
    ],
    productSlugs: [
      "sign-merino-crew-ivory",
      "sign-tailored-trouser-charcoal",
      "sign-knitted-vest-graphite",
    ],
  },
  {
    slug: "soft-structure",
    title: "Soft structure",
    description:
      "Knitted calm with tailoring that holds its shape — the Bonkers-tailored interplay without loud motifs.",
    tone: "ember",
    heroImage:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1600&q=80",
    heroAlt: "Soft structured tailoring editorial",
    storyImage:
      "https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=1600&q=80",
    storyImageAlt: "Oat shirting softly folded daylight",
    storyBeats: [
      "Quiet warmth — pigments dusted rather than punched so layering reads editorial, not collegiate.",
      "Pairings favour cropped outerwear silhouettes borrowed from tailoring blocks, softened for tactile street rotation.",
    ],
    productSlugs: ["sign-tailored-trouser-charcoal", "sign-oversized-shirt-oat"],
  },
  {
    slug: "after-hours",
    title: "After hours",
    description: "Minimal pieces amplified under amber light — Urban Monkey poise minus graphic hysteria.",
    tone: "midnight",
    heroImage:
      "https://images.unsplash.com/photo-1496747611179-843222e1a57b?auto=format&fit=crop&w=1600&q=80",
    heroAlt: "After hours fashion portrait under warm light",
    storyImage:
      "https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=1600&q=80",
    storyImageAlt: "Stone jacket sculptural detail",
    storyBeats: [
      "Outer shells tuned for nightclub spill without losing daylight civility.",
      "Every drop hinges on tonal hardware choreography — understated until flash hits.",
    ],
    productSlugs: ["sign-field-jacket-stone", "sign-merino-crew-ivory"],
  },
];

export function collectionsContainingProductSlug(productSlug: string): CollectionConfig[] {
  return collections.filter((c) => c.productSlugs.includes(productSlug));
}
