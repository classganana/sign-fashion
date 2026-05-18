"use client";

import Image from "next/image";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type CatalogLiteItem = { slug: string; name: string; image?: string };

export function ProductSlugPicker({
  catalog,
  selectedSlugs,
  onChange,
  label,
  hint,
  emptyHint,
}: {
  catalog: CatalogLiteItem[];
  selectedSlugs: string[];
  onChange: (slugs: string[]) => void;
  label: string;
  hint?: string;
  emptyHint?: string;
}) {
  const [query, setQuery] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const filtered = catalog.filter((row) => {
    if (selectedSlugs.includes(row.slug)) return false;
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return row.slug.toLowerCase().includes(q) || row.name.toLowerCase().includes(q);
  });

  function move(idx: number, delta: number) {
    const j = idx + delta;
    if (j < 0 || j >= selectedSlugs.length) return;
    const next = [...selectedSlugs];
    const tmp = next[idx];
    next[idx] = next[j]!;
    next[j] = tmp!;
    onChange(next);
  }

  return (
    <div className="space-y-3">
      <div>
        <p className="text-muted-foreground text-[0.7rem] font-medium uppercase tracking-wide">{label}</p>
        {hint && <p className="text-muted-foreground/90 mt-0.5 text-xs">{hint}</p>}
      </div>

      {selectedSlugs.length === 0 ?
        <p className="text-muted-foreground rounded-lg border border-dashed border-white/10 px-4 py-6 text-center text-sm">
          {emptyHint ?? "No pieces selected yet."}
        </p>
      : <ul className="space-y-2">
          {selectedSlugs.map((slug, idx) => {
            const meta = catalog.find((c) => c.slug === slug);
            return (
              <li
                key={slug}
                className="border-border flex flex-wrap items-center gap-2 rounded-lg border bg-white/[0.03] px-3 py-2 text-sm"
              >
                {meta?.image ?
                  <Image src={meta.image} alt="" width={40} height={40} className="size-10 rounded-md object-cover" />
                : <span className="bg-muted size-10 rounded-md" />}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-zinc-100">{meta?.name ?? slug}</p>
                  <p className="text-muted-foreground truncate text-xs">{slug}</p>
                </div>
                <div className="flex gap-1">
                  <Button type="button" variant="outline" size="icon-xs" disabled={idx === 0} onClick={() => move(idx, -1)}>
                    ↑
                  </Button>
                  <Button type="button" variant="outline" size="icon-xs" disabled={idx === selectedSlugs.length - 1} onClick={() => move(idx, 1)}>
                    ↓
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    className="text-destructive"
                    onClick={() => onChange(selectedSlugs.filter((s) => s !== slug))}
                  >
                    ×
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      }

      <div className="relative">
        <Input
          value={query}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          placeholder="Search catalogue…"
          className="border-border bg-background h-10 rounded-lg border px-3 text-sm"
        />
        {open && (
          <>
            <button type="button" className="fixed inset-0 z-10 cursor-default bg-transparent" aria-label="Close picker" onClick={() => setOpen(false)} />
            <div className="border-border absolute z-20 mt-1 max-h-52 w-full overflow-auto rounded-xl border bg-zinc-950 py-1 shadow-xl">
              {filtered.slice(0, 40).map((row) => (
                <button
                  key={row.slug}
                  type="button"
                  className="hover:bg-white/10 flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-zinc-200"
                  onClick={() => {
                    onChange([...selectedSlugs, row.slug]);
                    setQuery("");
                    setOpen(false);
                  }}
                >
                  {row.image ?
                    <Image src={row.image} alt="" width={32} height={32} className="size-8 rounded object-cover" />
                  : <span className="bg-muted size-8 rounded" />}
                  <span className="truncate">{row.name}</span>
                </button>
              ))}
              {!filtered.length ?
                <p className="text-muted-foreground px-3 py-4 text-xs">Nothing matches — try another search.</p>
              : null}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
