import type { Metadata } from "next";

import { CollectionsStudio } from "@/features/admin/cms/collections-studio";
import { getCollectionsDraftForAdmin } from "@/services/collections-catalog";
import { mergeCatalogNow } from "@/services/products";

export const metadata: Metadata = {
  title: "Studio · Capsules",
};

export default async function AdminCollectionsPage() {
  const [draft, catalogue] = await Promise.all([getCollectionsDraftForAdmin(), mergeCatalogNow()]);
  const catalogLite = catalogue.map((p) => ({ slug: p.slug, name: p.name, image: p.image }));

  return (
    <section className="space-y-8">
      <header className="max-w-3xl space-y-2">
        <p className="text-[0.7rem] uppercase tracking-[0.2em] text-rose-200/90">Campaign drops</p>
        <h1 className="font-display text-white text-4xl font-medium tracking-tight">Capsule studio</h1>
        <p className="text-muted-foreground text-base leading-relaxed">
          Shape each capsule like an editorial launch — hero art, storytelling beats, tonal mood, and the exact assortment shoppers explore together.
        </p>
      </header>

      <CollectionsStudio initialCollections={draft} catalog={catalogLite} />
    </section>
  );
}
