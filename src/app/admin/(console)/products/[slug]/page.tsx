import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AdminProductEditor } from "@/features/admin/admin-product-editor";
import { mergeCollectionsCatalogNow } from "@/services/collections-catalog";
import { loadAdminProductEditorModel } from "@/services/cms-product-admin";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return { title: `Studio · ${decodeURIComponent(slug)}` };
}

export default async function AdminProductEditorPage({ params }: PageProps) {
  const { slug } = await params;
  const decoded = decodeURIComponent(slug);
  if (!decoded) notFound();

  const [state, capsules] = await Promise.all([loadAdminProductEditorModel(decoded), mergeCollectionsCatalogNow()]);
  const capsuleActions = capsules.map((c) => ({ slug: c.slug, title: c.title }));

  return (
    <section className="space-y-8">
      <header className="max-w-3xl space-y-2">
        <p className="text-[0.7rem] uppercase tracking-[0.2em] text-zinc-500">Piece studio</p>
        <h1 className="font-display text-white text-4xl font-medium tracking-tight">{state.values.name}</h1>
        <p className="text-muted-foreground font-mono text-sm">{decoded}</p>
      </header>
      <AdminProductEditor
        key={decoded}
        routeSlug={decoded}
        initialPayload={state.values}
        initialPublished={state.isPublished}
        warning={state.warning}
        capsules={capsuleActions}
      />
    </section>
  );
}
