import type { Metadata } from "next";

import { HomepageStudio } from "@/features/admin/cms/homepage-studio";
import type { HomepageSectionEnvelope } from "@/features/admin/cms/admin-cms-types";
import { mergeCollectionsCatalogNow } from "@/services/collections-catalog";
import { getHomepageSectionsDraftForAdmin } from "@/services/homepage-configuration";
import { mergeCatalogNow } from "@/services/products";

export const metadata: Metadata = {
  title: "Studio · Homepage",
};

export default async function AdminHomepagePage() {
  const [draft, catalogue, capsules] = await Promise.all([
    getHomepageSectionsDraftForAdmin(),
    mergeCatalogNow(),
    mergeCollectionsCatalogNow(),
  ]);

  const catalogLite = catalogue.map((p) => ({
    slug: p.slug,
    name: p.name,
    image: p.image,
  }));

  const capsuleLite = capsules.map((c) => ({
    slug: c.slug,
    title: c.title,
    heroImage: c.heroImage,
    heroAlt: c.heroAlt,
  }));

  return (
    <section className="space-y-8">
      <header className="max-w-3xl space-y-2">
        <p className="text-[0.7rem] uppercase tracking-[0.2em] text-rose-200/90">Storefront story</p>
        <h1 className="font-display text-white text-4xl font-medium tracking-tight">Homepage builder</h1>
        <p className="text-muted-foreground text-base leading-relaxed">
          Compose your flagship landing page visually — reorder blocks, toggle visibility, drop imagery, and wire products without touching structured files.
        </p>
      </header>

      <HomepageStudio initialSections={draft as HomepageSectionEnvelope[]} catalog={catalogLite} capsules={capsuleLite} />
    </section>
  );
}
