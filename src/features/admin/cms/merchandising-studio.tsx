"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type MerchRow = {
  slug: string;
  name: string;
  image?: string;
  featuredRank: number;
  trendingRank: number;
  releasedAtMs: number;
};

export function MerchandisingStudio({ rows }: { rows: MerchRow[] }) {
  const [drafts, setDrafts] = React.useState(rows);
  const [banner, setBanner] = React.useState<{ tone: "ok" | "err"; text: string } | null>(null);

  async function persistSlug(slug: string) {
    setBanner(null);
    const row = drafts.find((d) => d.slug === slug);
    if (!row) return;

    try {
      const resGet = await fetch(`/api/admin/products/${encodeURIComponent(slug)}`);
      const snapshot = await resGet.json();
      if (!snapshot?.values) {
        setBanner({ tone: "err", text: "Could not load piece details." });
        return;
      }
      const merged = {
        ...snapshot.values,
        discovery: {
          ...snapshot.values.discovery,
          featuredRank: row.featuredRank,
          trendingRank: row.trendingRank,
          releasedAtMs: row.releasedAtMs,
        },
      };

      const resSave = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payload: merged,
          isPublished: Boolean(snapshot.isPublished),
        }),
      });
      if (!resSave.ok) {
        const body = await resSave.json().catch(() => ({}));
        setBanner({ tone: "err", text: typeof body?.error === "string" ? body.error : "Could not save spotlight settings." });
        return;
      }
      setBanner({ tone: "ok", text: `Spotlight refreshed for ${row.name}.` });
    } catch {
      setBanner({ tone: "err", text: "Network issue — try again." });
    }
  }

  function update(slug: string, patch: Partial<MerchRow>) {
    setDrafts((prev) => prev.map((row) => (row.slug === slug ? { ...row, ...patch } : row)));
  }

  return (
    <div className="space-y-8">
      <p className="text-muted-foreground max-w-3xl text-base leading-relaxed">
        Guide how boldly each piece surfaces in curated storefront rails — spotlight and momentum stay editable here without reopening piece forms.
      </p>

      {banner && (
        <p className={banner.tone === "ok" ? "rounded-xl bg-emerald-500/15 px-4 py-3 text-sm text-emerald-100" : "rounded-xl bg-red-500/15 px-4 py-3 text-sm text-red-100"}>
          {banner.text}
        </p>
      )}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {drafts.map((row) => (
          <article key={row.slug} className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-5 shadow-xl shadow-black/40">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40">
              {row.image ?
                <Image src={row.image} alt="" width={400} height={500} className="aspect-[4/5] w-full object-cover" sizes="(max-width:768px) 100vw, 33vw" />
              : <div className="text-muted-foreground flex aspect-[4/5] items-center justify-center text-xs uppercase">Awaiting asset</div>}
            </div>
            <div>
              <p className="font-display text-xl text-white">{row.name}</p>
              <p className="text-muted-foreground font-mono text-xs">{row.slug}</p>
            </div>
            <label className="space-y-2 text-xs uppercase tracking-wide text-zinc-400">
              Spotlight priority
              <Input
                type="number"
                className="border-border bg-background h-11 rounded-xl border px-3 text-base text-white"
                value={row.featuredRank}
                onChange={(e) => update(row.slug, { featuredRank: Number(e.target.value) })}
              />
            </label>
            <label className="space-y-2 text-xs uppercase tracking-wide text-zinc-400">
              Momentum score
              <Input
                type="number"
                className="border-border bg-background h-11 rounded-xl border px-3 text-base text-white"
                value={row.trendingRank}
                onChange={(e) => update(row.slug, { trendingRank: Number(e.target.value) })}
              />
            </label>
            <label className="space-y-2 text-xs uppercase tracking-wide text-zinc-400">
              Freshness signal
              <Input
                type="number"
                className="border-border bg-background h-11 rounded-xl border px-3 text-base text-white"
                value={row.releasedAtMs}
                onChange={(e) => update(row.slug, { releasedAtMs: Number(e.target.value) })}
              />
              <span className="block normal-case font-sans text-[0.65rem] font-normal tracking-normal text-zinc-500">
                Higher numbers float nearer the top of “New” rails — align with launch timing from your calendar.
              </span>
            </label>
            <div className="mt-auto flex flex-wrap gap-2">
              <Button type="button" size="sm" onClick={() => void persistSlug(row.slug)}>
                Save spotlight
              </Button>
              <Link href={`/admin/products/${encodeURIComponent(row.slug)}`} className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
                Edit piece
              </Link>
            </div>
          </article>
        ))}
      </div>

      {!rows.length ?
        <div className="rounded-3xl border border-dashed border-white/15 px-10 py-16 text-center text-sm text-zinc-400">
          Catalogue is empty — seed pieces before tuning spotlight balances.
        </div>
      : null}
    </div>
  );
}
