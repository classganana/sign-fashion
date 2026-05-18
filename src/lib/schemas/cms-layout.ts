import * as z from "zod";

/** Structural guard — section discriminant preserved for renderer; `.passthrough()` keeps payload fields stable. */
export const homepageSectionEnvelopeSchema = z
  .object({
    id: z.string().min(1),
    type: z.string().min(1),
    disabled: z.boolean().optional(),
    sortOrder: z.number().optional(),
  })
  .passthrough();

export const homepageSectionsFileSchema = z.array(homepageSectionEnvelopeSchema);

const collectionTone = z.enum(["mono", "ember", "midnight"]);

export const collectionConfigSchema = z.object({
  slug: z.string().min(2).regex(/^[\w-]+$/),
  title: z.string().min(1),
  description: z.string().min(1),
  heroImage: z.string().url(),
  heroAlt: z.string().min(1),
  storyImage: z.string().url().optional(),
  storyImageAlt: z.string().optional(),
  storyBeats: z.tuple([z.string(), z.string()]).optional(),
  tone: collectionTone,
  productSlugs: z.array(z.string().min(1)),
});

export const collectionsBundleSchema = z.array(collectionConfigSchema);
