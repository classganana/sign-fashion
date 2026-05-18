import * as z from "zod";

const gallerySlideSchema = z.object({
  url: z.string().url(),
  alt: z.string().min(1),
  cloudinaryPublicId: z.string().optional(),
});

const detailsSchema = z.object({
  fit: z.string().min(1),
  fabric: z.string().min(1),
  washCare: z.string().min(1),
  styleNotes: z.string().min(1),
  deliveryNotes: z.string().min(1),
  editorialLead: z.string().optional(),
  packagingStory: z.string().optional(),
  returnsComfort: z.string().optional(),
  secureCheckoutHint: z.string().optional(),
  fabricSignal: z.string().optional(),
});

export const discoveryProfileSchema = z.object({
  categorySlug: z.string().min(1),
  sizes: z.array(z.string().min(1)),
  colors: z.array(z.string().min(1)),
  fits: z.array(z.string().min(1)),
  collections: z.array(z.string().min(1)),
  tags: z.array(z.string().min(1)),
  featuredRank: z.number().int(),
  trendingRank: z.number().int(),
  releasedAtMs: z.number().int(),
});

export const cmsProductPayloadSchema = z.object({
  id: z.string().min(1),
  slug: z
    .string()
    .min(2)
    .regex(/^[\w.-]+$/, "Slug URL-safe chars only"),
  name: z.string().min(1),
  description: z.string().min(1),
  priceCents: z.number().int().positive(),
  currency: z.literal("INR"),
  discovery: discoveryProfileSchema,
  image: z.string().url(),
  imageAlt: z.string().min(1),
  cloudinaryPublicId: z.string().optional(),
  gallery: z.array(gallerySlideSchema).optional(),
  tag: z.enum(["new", "limited", "bestseller"]).optional(),
  details: detailsSchema,
  /** Operational — storefront ignores until IMS ships */
  lowStockThresholdUnits: z.number().int().min(0).optional(),
});
