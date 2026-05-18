import { cmsProductPayloadSchema } from "@/lib/schemas/cms-product";
import {
  listProductContents,
  upsertProductContent,
} from "@/services/cms-product-repository";
import { mergeCatalogNow } from "@/services/products";
import { requireAdminRoute } from "@/server/admin/route-guards";
import { revalidatePrimaryStorefrontRoutes } from "@/server/admin/revalidation";
import * as z from "zod";

const upsertSchema = z.object({
  isPublished: z.boolean(),
  payload: cmsProductPayloadSchema,
});

export async function GET(request: Request) {
  const denied = requireAdminRoute(request);
  if (denied) return denied;

  const catalogue = await mergeCatalogNow();
  const cmsRows = await listProductContents();
  const cmsMap = new Map(cmsRows.map((row) => [row.slug, row]));
  const slugs = new Set<string>();
  catalogue.forEach((product) => slugs.add(product.slug));
  cmsRows.forEach((row) => slugs.add(row.slug));

  const items = [...slugs]
    .sort((a, b) => a.localeCompare(b))
    .map((slug) => {
      const product = catalogue.find((candidate) => candidate.slug === slug);
      const cms = cmsMap.get(slug);

      const cmsNameCandidate =
        typeof cms?.payload === "object" && cms.payload !== null && "name" in cms.payload ?
          String((cms.payload as { name?: unknown }).name ?? "")
        : "";

      return {
        slug,
        name: product?.name ?? (cmsNameCandidate || slug),
        hasCmsRow: Boolean(cms),
        cmsPublished: cms?.isPublished ?? false,
        onStorefront: Boolean(product),
      };
    });

  return Response.json({ items });
}

export async function POST(request: Request) {
  const denied = requireAdminRoute(request);
  if (denied) return denied;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = upsertSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    await upsertProductContent(parsed.data.payload.slug, parsed.data.payload, parsed.data.isPublished);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Mongo unavailable";
    return Response.json({ error: message }, { status: 503 });
  }

  revalidatePrimaryStorefrontRoutes();

  return Response.json({ ok: true, slug: parsed.data.payload.slug });
}
