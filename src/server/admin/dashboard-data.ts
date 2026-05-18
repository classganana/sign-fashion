import { connectDb } from "@/lib/mongodb";
import { getProductContentModel } from "@/models/product-content-model";
import { mergeCollectionsCatalogNow } from "@/services/collections-catalog";
import { listProductContents } from "@/services/cms-product-repository";
import { mergeCatalogNow } from "@/services/products";

export type AdminRecentRow = {
  slug: string;
  label: string;
  updatedAtIso?: string;
  source: "cms" | "seed";
};

export type AdminDashboardPayload = {
  totalSkus: number;
  collectionCount: number;
  cmsDrafts: number | null;
  cmsPublishedDocs: number | null;
  lowStockPrepCount: number;
  recentlyTouched: AdminRecentRow[];
  featuredCapsules: { slug: string; title: string }[];
};

/** Aggregates truthful operational primitives — avoids invented analytics graphs */
export async function buildAdminDashboardPayload(): Promise<AdminDashboardPayload> {
  const catalogue = await mergeCatalogNow();
  const capsules = await mergeCollectionsCatalogNow();

  const lowStockPrepCount = catalogue.filter(
    (p) => typeof p.lowStockThresholdUnits === "number" && p.lowStockThresholdUnits >= 0,
  ).length;

  let cmsDrafts: number | null = null;
  let cmsPublishedDocs: number | null = null;
  let mongoRecent: AdminRecentRow[] = [];

  if (process.env.MONGODB_URI) {
    try {
      await connectDb();
      const model = getProductContentModel();
      const [draftCount, publishCount] = await Promise.all([
        model.countDocuments({ isPublished: false }),
        model.countDocuments({ isPublished: true }),
      ]);
      cmsDrafts = draftCount;
      cmsPublishedDocs = publishCount;

      mongoRecent = (await listProductContents()).slice(0, 8).map((row) => {
        const slug = row.slug;
        const labelCandidate = (row.payload as { name?: string } | undefined)?.name;
        return {
          slug,
          label: typeof labelCandidate === "string" && labelCandidate.trim().length ?
            labelCandidate
          : slug,
          updatedAtIso: row.updatedAt ? row.updatedAt.toISOString() : undefined,
          source: "cms" as const,
        };
      });
    } catch {
      cmsDrafts = null;
      cmsPublishedDocs = null;
    }
  }

  const recentlyTouched =
    mongoRecent.length ?
      mongoRecent
    : catalogue.slice(0, 8).map((p) => ({
        slug: p.slug,
        label: p.name,
        updatedAtIso: undefined,
        source: "seed" as const,
      }));

  const featuredCapsules = capsules.slice(0, 3).map((c) => ({
    slug: c.slug,
    title: c.title,
  }));

  return {
    totalSkus: catalogue.length,
    collectionCount: capsules.length,
    cmsDrafts,
    cmsPublishedDocs,
    lowStockPrepCount,
    recentlyTouched,
    featuredCapsules,
  };
}
