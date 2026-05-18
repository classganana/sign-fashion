import { deleteProductContent } from "@/services/cms-product-repository";
import { loadAdminProductEditorModel } from "@/services/cms-product-admin";
import { requireAdminRoute } from "@/server/admin/route-guards";
import { revalidatePrimaryStorefrontRoutes } from "@/server/admin/revalidation";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  const denied = requireAdminRoute(request);
  if (denied) return denied;

  const { slug } = await context.params;
  const decoded = decodeURIComponent(slug);
  const state = await loadAdminProductEditorModel(decoded);

  return Response.json(state);
}

export async function DELETE(request: Request, context: RouteContext) {
  const denied = requireAdminRoute(request);
  if (denied) return denied;

  const { slug } = await context.params;
  const decoded = decodeURIComponent(slug);

  try {
    await deleteProductContent(decoded);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Mongo unavailable";
    return Response.json({ error: message }, { status: 503 });
  }

  revalidatePrimaryStorefrontRoutes();
  return Response.json({ ok: true });
}
