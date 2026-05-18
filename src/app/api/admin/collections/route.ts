import { collectionsBundleSchema } from "@/lib/schemas/cms-layout";
import { CMS_KEYS } from "@/models/cms-kv-model";
import { getCollectionsDraftForAdmin } from "@/services/collections-catalog";
import { cmsKvWrite } from "@/services/cms-kv-repository";
import { requireAdminRoute } from "@/server/admin/route-guards";
import { revalidatePrimaryStorefrontRoutes } from "@/server/admin/revalidation";
import * as z from "zod";

export async function GET(request: Request) {
  const blocked = requireAdminRoute(request);
  if (blocked) return blocked;
  const draft = await getCollectionsDraftForAdmin();
  return Response.json({ collections: draft });
}

const patchSchema = z.object({
  collections: z.unknown(),
});

export async function PATCH(request: Request) {
  const blocked = requireAdminRoute(request);
  if (blocked) return blocked;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const envelope = patchSchema.safeParse(body);
  if (!envelope.success)
    return Response.json({ error: "Expected { collections }" }, { status: 400 });

  const parsed = collectionsBundleSchema.safeParse(envelope.data.collections);
  if (!parsed.success) {
    return Response.json({ error: "Collections validation failed", issues: parsed.error.issues }, { status: 400 });
  }

  const outcome = await cmsKvWrite(CMS_KEYS.collectionsBundle, parsed.data);
  if (!outcome.ok) return Response.json({ error: "KV write refused — configure Mongo" }, { status: 503 });

  revalidatePrimaryStorefrontRoutes();
  return Response.json({ ok: true });
}
