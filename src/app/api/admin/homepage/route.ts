import { homepageSectionsFileSchema } from "@/lib/schemas/cms-layout";
import { CMS_KEYS } from "@/models/cms-kv-model";
import { cmsKvWrite } from "@/services/cms-kv-repository";
import { getHomepageSectionsDraftForAdmin } from "@/services/homepage-configuration";
import { requireAdminRoute } from "@/server/admin/route-guards";
import { revalidatePrimaryStorefrontRoutes } from "@/server/admin/revalidation";
import * as z from "zod";

export async function GET(request: Request) {
  const blocked = requireAdminRoute(request);
  if (blocked) return blocked;
  const draft = await getHomepageSectionsDraftForAdmin();
  return Response.json({ sections: draft });
}

const patchSchema = z.object({
  sections: z.unknown(),
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

  const parsedPayload = patchSchema.safeParse(body);
  if (!parsedPayload.success)
    return Response.json({ error: "Expected { sections }" }, { status: 400 });

  const sectionsParsed = homepageSectionsFileSchema.safeParse(parsedPayload.data.sections);
  if (!sectionsParsed.success) {
    return Response.json({ error: "Homepage validation failed", issues: sectionsParsed.error.issues }, { status: 400 });
  }

  const outcome = await cmsKvWrite(CMS_KEYS.homepageSections, sectionsParsed.data);
  if (!outcome.ok) return Response.json({ error: "KV write refused — configure Mongo" }, { status: 503 });

  revalidatePrimaryStorefrontRoutes();
  return Response.json({ ok: true });
}
