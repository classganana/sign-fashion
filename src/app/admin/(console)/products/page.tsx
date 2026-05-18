import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { listProductContents } from "@/services/cms-product-repository";
import { mergeCatalogNow } from "@/services/products";

export const metadata: Metadata = {
  title: "Studio · Catalogue",
};

export default async function AdminProductsPage() {
  const [catalog, cmsRows] = await Promise.all([mergeCatalogNow(), listProductContents()]);
  const cmsMap = new Map(cmsRows.map((row) => [row.slug, row]));
  const catalogBySlug = new Map(catalog.map((p) => [p.slug, p]));

  const slugs = new Set<string>();
  catalog.forEach((p) => slugs.add(p.slug));
  cmsRows.forEach((row) => slugs.add(row.slug));

  const rows = [...slugs].sort((a, b) => a.localeCompare(b)).map((slug) => {
    const cmsRow = cmsMap.get(slug);
    const cat = catalogBySlug.get(slug);
    let name = cat?.name;
    if (!name && cmsRow && typeof cmsRow.payload === "object" && cmsRow.payload !== null) {
      const maybe = (cmsRow.payload as { name?: unknown }).name;
      if (typeof maybe === "string" && maybe.trim()) name = maybe.trim();
    }
    if (!name) name = slug;

    const thumb = cat?.image;

    return {
      slug,
      name,
      onStorefront: Boolean(cat),
      cms: cmsRow,
      thumb,
      imageAlt: cat?.imageAlt ?? name,
    };
  });

  return (
    <section className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-xl space-y-2">
          <p className="text-[0.7rem] uppercase tracking-[0.2em] text-zinc-500">Assortment</p>
          <h1 className="font-display text-white text-4xl font-medium tracking-tight">Catalogue</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Browse every piece, see what shoppers can see today, and open the editor without touching technical structure.
          </p>
        </div>
        <Link
          className="inline-flex items-center rounded-full border border-white/20 bg-white/[0.06] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white/[0.12]"
          href="/admin/products/new"
        >
          Add piece
        </Link>
      </div>

      {rows.length === 0 ?
        <div className="border-border rounded-3xl border border-dashed bg-white/[0.02] px-8 py-16 text-center">
          <p className="font-display text-white text-xl tracking-tight">No pieces yet</p>
          <p className="text-muted-foreground mx-auto mt-2 max-w-md text-sm leading-relaxed">
            Start with a new piece — imagery, sizing, and storytelling all live in one guided layout.
          </p>
          <Link
            className="mt-6 inline-flex rounded-full border border-emerald-500/40 px-5 py-2 text-sm text-emerald-200 hover:bg-emerald-500/10"
            href="/admin/products/new"
          >
            Create first piece
          </Link>
        </div>
      : <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {rows.map((row) => (
            <li
              key={row.slug}
              className="border-border group flex flex-col overflow-hidden rounded-3xl border bg-gradient-to-b from-white/[0.07] to-transparent transition hover:border-white/20"
            >
              <div className="bg-zinc-900/80 relative aspect-[4/5] overflow-hidden">
                {row.thumb ?
                  <Image
                    alt={row.imageAlt}
                    className="object-cover transition duration-500 group-hover:scale-[1.02]"
                    fill
                    sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
                    src={row.thumb}
                  />
                : <div className="text-muted-foreground flex h-full items-center justify-center p-6 text-center text-xs uppercase tracking-wide">
                    No hero image yet
                  </div>
                }
              </div>
              <div className="flex flex-1 flex-col gap-3 p-5">
                <div>
                  <p className="font-medium text-white leading-snug">{row.name}</p>
                  <p className="text-muted-foreground mt-1 font-mono text-[0.65rem] tracking-tight">{row.slug}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span
                    className={
                      row.onStorefront ? "rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[0.65rem] text-emerald-200" :
                        "rounded-full bg-zinc-800 px-2.5 py-0.5 text-[0.65rem] text-zinc-400"
                    }
                  >
                    {row.onStorefront ? "On storefront" : "Not live yet"}
                  </span>
                  {row.cms ?
                    row.cms.isPublished ?
                      <span className="rounded-full bg-sky-500/15 px-2.5 py-0.5 text-[0.65rem] text-sky-200">Published</span>
                    : <span className="rounded-full bg-amber-500/15 px-2.5 py-0.5 text-[0.65rem] text-amber-200">Draft saved</span>
                  : <span className="rounded-full bg-zinc-800 px-2.5 py-0.5 text-[0.65rem] text-zinc-500">Library only</span>}
                </div>
                <div className="mt-auto flex items-center justify-between gap-3 pt-1">
                  <Link
                    className="text-sm font-medium text-white underline-offset-4 hover:underline"
                    href={`/admin/products/${encodeURIComponent(row.slug)}`}
                  >
                    Open studio
                  </Link>
                  {row.onStorefront ?
                    <Link
                      className="text-muted-foreground text-xs uppercase tracking-wide hover:text-white"
                      href={`/products/${encodeURIComponent(row.slug)}`}
                    >
                      View live
                    </Link>
                  : null}
                </div>
              </div>
            </li>
          ))}
        </ul>
      }
    </section>
  );
}
