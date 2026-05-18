import type { Metadata } from "next";

import { AdminContentHelp } from "@/features/admin/admin-content-help";
import { AdminMediaLab } from "@/features/admin/admin-media-lab";

export const metadata: Metadata = {
  title: "Studio · Media",
};

export default function AdminMediaPage() {
  return (
    <section className="space-y-8">
      <header className="max-w-2xl space-y-2">
        <p className="text-[0.7rem] uppercase tracking-[0.2em] text-zinc-500">Asset library</p>
        <h1 className="font-display text-white text-4xl font-medium tracking-tight">Imagery</h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Upload once, reuse across homepage blocks, capsules, and product galleries. You only work with previews and references — nothing
          infrastructural appears in the workflow.
        </p>
      </header>
      <AdminContentHelp
        title="How your team uses this"
        bullets={[
          "Drop a file or choose an image — we handle the secure handoff in the background.",
          "Copy the asset reference when you need to paste it into a banner, story image, or PDP field.",
          "The same reference can power multiple placements; change the file at the source to update everywhere it is used.",
        ]}
      />
      <AdminMediaLab />
    </section>
  );
}
