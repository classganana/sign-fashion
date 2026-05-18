import type { Metadata } from "next";

import { MerchandisingStudio } from "@/features/admin/cms/merchandising-studio";
import { mergeCatalogNow } from "@/services/products";

export const metadata: Metadata = {
  title: "Studio · Spotlight",
};

export default async function AdminMerchandisingPage() {
  const catalogue = await mergeCatalogNow();
  const sorted = [...catalogue].sort((a, b) => {
    const fa = a.discovery.featuredRank ?? 0;
    const fb = b.discovery.featuredRank ?? 0;
    if (fa === fb) return b.discovery.trendingRank - a.discovery.trendingRank;
    return fb - fa;
  });

  const rows = sorted.map((p) => ({
    slug: p.slug,
    name: p.name,
    image: p.image,
    featuredRank: p.discovery.featuredRank,
    trendingRank: p.discovery.trendingRank,
    releasedAtMs: p.discovery.releasedAtMs,
  }));

  const remountKey = rows.map((r) => r.slug).join("|");

  return (
    <section className="space-y-8">
      <header className="max-w-3xl space-y-2">
        <p className="text-[0.7rem] uppercase tracking-[0.2em] text-amber-200/90">Signals</p>
        <h1 className="font-display text-white text-4xl font-medium tracking-tight">Spotlight lab</h1>
        <p className="text-muted-foreground text-base leading-relaxed">
          Glide through the assortment, nudge spotlight and momentum scores, then lock in placement without technical lift.
        </p>
      </header>
      <MerchandisingStudio key={remountKey} rows={rows} />
    </section>
  );
}
