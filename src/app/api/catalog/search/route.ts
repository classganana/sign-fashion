import type { NextRequest } from "next/server";
import { searchCatalogueLocally } from "@/services/product-discovery";
import { mergeCatalogNow } from "@/services/products";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") ?? "";
  if (!q.trim()) {
    return Response.json({ results: [] satisfies unknown[] }, { status: 200 });
  }

  const catalog = await mergeCatalogNow();
  const results = searchCatalogueLocally(catalog, q, 12);

  return Response.json({ results });
}
