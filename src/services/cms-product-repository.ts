import { cmsProductPayloadSchema } from "@/lib/schemas/cms-product";
import { connectDb } from "@/lib/mongodb";
import { getProductContentModel } from "@/models/product-content-model";
import type { MockProduct } from "@/types/product";

export type ProductContentRow = {
  slug: string;
  payload: unknown;
  isPublished: boolean;
  updatedAt?: Date;
};

export async function findProductContentBySlug(slug: string): Promise<ProductContentRow | null> {
  if (!process.env.MONGODB_URI) return null;
  const conn = await connectDb();
  if (!conn) return null;
  const doc = await getProductContentModel()
    .findOne({ slug })
    .lean<{ slug: string; payload: unknown; isPublished?: boolean; updatedAt?: Date } | null>()
    .exec();
  if (!doc) return null;
  return {
    slug: doc.slug,
    payload: doc.payload,
    isPublished: Boolean(doc.isPublished),
    updatedAt: doc.updatedAt,
  };
}

export async function listProductContents(): Promise<ProductContentRow[]> {
  if (!process.env.MONGODB_URI) return [];
  const conn = await connectDb();
  if (!conn) return [];
  const docs = await getProductContentModel()
    .find()
    .sort({ updatedAt: -1 })
    .lean<{ slug: string; payload: unknown; isPublished?: boolean; updatedAt?: Date }[]>()
    .exec();
  return docs.map((d) => ({
    slug: d.slug,
    payload: d.payload,
    isPublished: Boolean(d.isPublished),
    updatedAt: d.updatedAt,
  }));
}

export async function upsertProductContent(slug: string, payload: unknown, isPublished: boolean): Promise<void> {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is not configured");
  const conn = await connectDb();
  if (!conn) throw new Error("Mongo connection unavailable");
  await getProductContentModel().findOneAndUpdate(
    { slug },
    {
      slug,
      payload,
      isPublished,
    },
    { upsert: true, new: true },
  );
}

export async function deleteProductContent(slug: string): Promise<void> {
  await connectDb();
  await getProductContentModel().deleteOne({ slug });
}

/** Published CMS overlays — keyed by slug */
export async function loadPublishedCmsProducts(): Promise<Map<string, MockProduct>> {
  const uri = process.env.MONGODB_URI;
  const map = new Map<string, MockProduct>();
  if (!uri) return map;
  try {
    await connectDb();
    const rows = await getProductContentModel()
      .find({ isPublished: true })
      .lean<{ slug: string; payload: unknown }[]>()
      .exec();

    for (const row of rows) {
      const parsed = cmsProductPayloadSchema.safeParse(row.payload);
      if (parsed.success && parsed.data.slug === row.slug)
        map.set(row.slug, parsed.data as MockProduct);
    }
  } catch {
    /* mongo offline → empty overlay */
  }
  return map;
}
