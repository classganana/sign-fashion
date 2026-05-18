import type { MetadataRoute } from "next";
import { mergeCollectionsCatalogNow } from "@/services/collections-catalog";
import { site } from "@/config/site";
import { mergeCatalogNow } from "@/services/products";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = site.url.replace(/\/$/, "");
  const now = new Date();

  const staticUrls: MetadataRoute.Sitemap = [
    "",
    "/products",
    "/collections",
    "/cart",
    "/checkout",
    "/auth/login",
    "/about",
    "/careers",
    "/privacy",
    "/terms",
    "/support/shipping",
    "/support/returns",
    "/support/contact",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
  }));

  const [productsList, capsuleRows] = await Promise.all([
    mergeCatalogNow(),
    mergeCollectionsCatalogNow(),
  ]);
  const products = productsList.map((p) => ({
    url: `${base}/products/${p.slug}`,
    lastModified: now,
  }));

  const collectionRoutes = capsuleRows.map((c) => ({
    url: `${base}/collections/${c.slug}`,
    lastModified: now,
  }));

  return [...staticUrls, ...products, ...collectionRoutes];
}
