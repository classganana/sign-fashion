import type { Metadata } from "next";

import { AdminProductEditor } from "@/features/admin/admin-product-editor";
import { mergeCollectionsCatalogNow } from "@/services/collections-catalog";
import { draftProductBlueprint } from "@/services/cms-product-admin";

export const metadata: Metadata = {
  title: "Studio · New piece",
};

export default async function AdminProductNewPage() {
  const blueprint = draftProductBlueprint("new-sign-sku");
  const capsules = await mergeCollectionsCatalogNow();
  const capsuleActions = capsules.map((c) => ({ slug: c.slug, title: c.title }));

  return (
    <section className="space-y-8">
      <header className="max-w-3xl space-y-2">
        <p className="text-[0.7rem] uppercase tracking-[0.2em] text-zinc-500">Creation</p>
        <h1 className="font-display text-white text-4xl font-medium tracking-tight">New piece</h1>
        <p className="text-muted-foreground text-base leading-relaxed">
          Launch a silhouette with imagery, capsule mapping, and storytelling tuned for PDP romance.
        </p>
      </header>
      <AdminProductEditor
        key={blueprint.slug}
        routeSlug={blueprint.slug}
        initialPayload={blueprint}
        initialPublished={false}
        capsules={capsuleActions}
      />
    </section>
  );
}
