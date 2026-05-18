import type * as z from "zod";

import { mockProducts } from "@/data/mock-products";
import { cmsProductPayloadSchema } from "@/lib/schemas/cms-product";
import { findProductContentBySlug } from "@/services/cms-product-repository";
import { getProductBySlug } from "@/services/products";

export type AdminProductEditorModel = z.infer<typeof cmsProductPayloadSchema>;

export function draftProductBlueprint(slug: string): AdminProductEditorModel {
  const seed = mockProducts[0];
  if (!seed)
    throw new Error("Seed catalogue missing — add mock products before using the admin.");

  const base = structuredClone(seed) as unknown as AdminProductEditorModel;
  base.slug = slug;
  base.id = slug.replace(/[^\w.-]+/g, "-").replace(/^-+|-+$/g, "") || "draft-sku";

  const parsed = cmsProductPayloadSchema.safeParse(base);
  if (parsed.success) return parsed.data;
  throw new Error("Blueprint product failed CMS schema — update mock seeds.");
}

/** Resolves hydrated JSON for the CMS form: CMS drafts override validated storefront rows */
export async function loadAdminProductEditorModel(slug: string): Promise<{
  values: AdminProductEditorModel;
  isPublished: boolean;
  persistedInMongo: boolean;
  warning?: string;
}> {
  const cms = await findProductContentBySlug(slug);
  if (cms) {
    const parsed = cmsProductPayloadSchema.safeParse(cms.payload);
    if (parsed.success && parsed.data.slug === slug) {
      return {
        values: parsed.data,
        isPublished: cms.isPublished,
        persistedInMongo: true,
      };
    }

    const storefront = (await getProductBySlug(slug)) ?? draftProductBlueprint(slug);
    const merged = cmsProductPayloadSchema.safeParse({
      ...storefront,
      ...(typeof cms.payload === "object" && cms.payload !== null ? cms.payload : {}),
      slug,
    });
    const coerced = cmsProductPayloadSchema.safeParse(storefront);

    return {
      values:
        merged.success ? merged.data
        : coerced.success ? coerced.data
        : draftProductBlueprint(slug),
      isPublished: cms.isPublished,
      persistedInMongo: true,
      warning: merged.success ? undefined : "Stored payload is invalid — showing merged fallback. Fix validation errors.",
    };
  }

  const catalog = await getProductBySlug(slug);
  if (catalog) {
    const parsed = cmsProductPayloadSchema.safeParse(catalog);
    return {
      values: parsed.success ? parsed.data : draftProductBlueprint(slug),
      isPublished: false,
      persistedInMongo: false,
      warning: parsed.success ? undefined : "Storefront seed failed CMS schema coercion.",
    };
  }

  return {
    values: draftProductBlueprint(slug),
    isPublished: false,
    persistedInMongo: false,
  };
}
