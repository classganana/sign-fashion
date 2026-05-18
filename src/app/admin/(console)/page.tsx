import type { Metadata } from "next";
import Link from "next/link";

import { Heading } from "@/components/ui/heading";
import { buildAdminDashboardPayload } from "@/server/admin/dashboard-data";

export const metadata: Metadata = {
  title: "Studio · Overview",
};

export default async function AdminDashboardPage() {
  const dash = await buildAdminDashboardPayload();

  return (
    <div className="space-y-10">
      <div className="space-y-3 max-w-2xl">
        <p className="text-[0.7rem] uppercase tracking-[0.2em] text-zinc-500">Today</p>
        <Heading as="h1" level="display" className="text-white text-4xl font-medium tracking-tight">
          Your studio at a glance
        </Heading>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Numbers reflect what shoppers experience on the site: the merged catalogue and the capsules wired to navigation. Drafts stay private
          until you publish from each editor.
        </p>
      </div>

      <dl className="grid gap-4 md:grid-cols-3">
        <MetricTile label="Pieces live" value={dash.totalSkus} hint="Visible in the storefront catalogue" />
        <MetricTile label="Capsules active" value={dash.collectionCount} hint="Editorial drops linked across the site" />
        <MetricTile label="Low-stock markers" value={dash.lowStockPrepCount} hint="Internal prep · not shown to shoppers yet" />
      </dl>

      <dl className="grid gap-4 md:grid-cols-2">
        <MetricTileNullable
          label="Draft saves"
          value={dash.cmsDrafts}
          fallback="Draft sync paused · check database connection in environment"
        />
        <MetricTileNullable
          label="Published updates"
          value={dash.cmsPublishedDocs}
          fallback="Publishing connects fresh content to the live storefront"
        />
      </dl>

      <section className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <p className="text-[0.7rem] uppercase tracking-[0.2em] text-zinc-500">Featured capsules</p>
          <div className="border-border divide-y divide-white/5 rounded-3xl border bg-white/[0.03] p-5 text-sm">
            {dash.featuredCapsules.length ?
              dash.featuredCapsules.map((cap) => (
                <div key={cap.slug} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-white">{cap.title}</p>
                    <p className="text-muted-foreground truncate font-mono text-xs">{cap.slug}</p>
                  </div>
                  <Link className="shrink-0 text-xs font-medium uppercase tracking-wide text-emerald-300 hover:underline" href={`/collections/${cap.slug}`}>
                    View live
                  </Link>
                </div>
              ))
            : <p className="text-muted-foreground py-6 text-center text-sm">No capsules surfaced yet — open Capsules to craft a drop.</p>}
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-[0.7rem] uppercase tracking-[0.2em] text-zinc-500">Recently updated</p>
          <div className="border-border divide-y divide-white/5 rounded-3xl border bg-white/[0.03]">
            {dash.recentlyTouched.length ?
              dash.recentlyTouched.map((row) => (
                <div key={row.slug + row.updatedAtIso} className="flex items-center gap-4 px-4 py-3 text-sm">
                  <div className="min-w-0 flex-1">
                    <Link className="font-medium text-white hover:underline" href={`/admin/products/${encodeURIComponent(row.slug)}`}>
                      {row.label}
                    </Link>
                    <p className="text-muted-foreground text-xs">{row.updatedAtIso ?? "Time unavailable"}</p>
                  </div>
                  <span className="text-[0.65rem] uppercase tracking-wide text-zinc-500">{row.source}</span>
                </div>
              ))
            : <p className="text-muted-foreground px-4 py-8 text-center text-sm">Nothing touched recently.</p>}
          </div>
        </div>
      </section>
    </div>
  );
}

function MetricTile({ label, value, hint }: { label: string; value: number; hint: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.08] to-transparent p-6">
      <dt className="text-xs uppercase tracking-wide text-zinc-400">{label}</dt>
      <dd className="mt-3 tabular-nums text-3xl text-white">{value}</dd>
      <p className="text-muted-foreground mt-2 text-xs leading-relaxed">{hint}</p>
    </div>
  );
}

function MetricTileNullable({ label, value, fallback }: { label: string; value: number | null; fallback: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-white/10 p-6">
      <dt className="text-xs uppercase tracking-wide text-zinc-400">{label}</dt>
      <dd className="mt-3 tabular-nums text-3xl text-white">{value ?? "–"}</dd>
      <p className="text-muted-foreground mt-2 text-xs leading-relaxed">{fallback}</p>
    </div>
  );
}
