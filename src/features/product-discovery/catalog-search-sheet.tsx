"use client";

import React, { Fragment, useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { optimizeRemoteImageUrl } from "@/lib/images";
import { formatInrFromMinorUnits } from "@/lib/money";
import { cn } from "@/lib/utils";
import { discoveryHref } from "@/lib/discovery-url";
import { patchQuery, resetDiscoveryListing } from "@/lib/discovery-merge";
import type { CatalogueSearchHit } from "@/services/product-discovery";
import { useRecentSearchesStore } from "@/store/recent-searches-store";

async function fetchSearchHits(q: string): Promise<CatalogueSearchHit[]> {
  const trimmed = q.trim();
  if (!trimmed) return [];
  const res = await fetch(`/api/catalog/search?q=${encodeURIComponent(trimmed)}`, {
    priority: "high",
    cache: "no-store",
  });
  if (!res.ok) return [];
  const data = (await res.json()) as { results: CatalogueSearchHit[] };
  return data.results ?? [];
}

export function CatalogSearchLauncher() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={<Button variant="outline" size="sm" type="button" className='touch-manipulation gap-2' />}
        type="button"
      >
        <Search className="size-4" aria-hidden />
        <span className="hidden sm:inline">Search</span>
      </SheetTrigger>

      <SheetContent side="top" showCloseButton className="max-h-[min(92vh,52rem)] w-full px-7 py-11">
        <SheetHeader className="mb-8 space-y-3 p-0">
          <p className="text-muted-foreground text-[0.65rem] tracking-[0.3em] uppercase">
            Guided search · mock indexer
          </p>
          <SheetTitle className="font-heading text-title font-medium">Find your drop</SheetTitle>
          <p className="text-muted-foreground max-w-2xl text-[0.9rem] leading-relaxed">
            Predictive results stay local for now — Atlas Search can slot into the handler without UI churn.
          </p>
        </SheetHeader>

        <SearchPalette onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}

function SearchPalette({ onNavigate }: { onNavigate: () => void }) {
  const router = useRouter();
  const inputId = useId();
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState(false);
  const [results, setResults] = useState<CatalogueSearchHit[]>([]);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const recent = useRecentSearchesStore((s) => s.queries);
  const pushRecent = useRecentSearchesStore((s) => s.push);

  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(() => {
      void (async () => {
        const trimmed = query.trim();
        if (trimmed.length < 2) {
          setResults([]);
          setBusy(false);
          return;
        }
        setBusy(true);
        const hits = await fetchSearchHits(query);
        setResults(hits);
        setBusy(false);
      })();
    }, 220);
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [query]);

  function submitSearch(trimmed: string) {
    if (!trimmed) return;
    pushRecent(trimmed);
    router.push(discoveryHref("/products", patchQuery(resetDiscoveryListing(), trimmed)));
    onNavigate();
    setQuery("");
  }

  return (
    <div className="flex flex-col gap-10 pb-28">
      <label className="sr-only" htmlFor={`${inputId}-search`}>
        Catalogue search query
      </label>
      <Input
        id={`${inputId}-search`}
        autoFocus
        aria-autocomplete="list"
        aria-controls={`${inputId}-listbox`}
        autoComplete="off"
        placeholder="Eg. merino · charcoal trouser · box tee..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className='h-[3rem] rounded-2xl text-base'
        onKeyDown={(e) => {
          if (e.key === "Enter") submitSearch(query.trim());
        }}
      />

      {!query.trim().length ?
        <div className="space-y-4">
          <p className="text-muted-foreground text-[0.65rem] tracking-[0.28em] uppercase">Recent hunts</p>
          {recent.length ?
            <ul className="flex flex-wrap gap-2">
              {recent.map((item) => (
                <li key={item}>
                  <button
                    type="button"
                    className="border-border hover:border-muted-foreground/70 rounded-full border px-5 py-1 text-[0.75rem]"
                    onClick={() => submitSearch(item.trim())}
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          : (
            <p className="text-muted-foreground text-sm">
              Saves stay on-device until auth syncs behavioural signals.
            </p>
          )}
        </div>
      : null}

      <section className="space-y-4">
        <p className="text-muted-foreground text-[0.65rem] tracking-[0.28em] uppercase">Matches</p>

        {busy && query.trim().length >= 2 ?
          <p className="text-muted-foreground text-sm italic">Threading needles…</p>
        : null}

        {!busy && query.trim().length >= 2 && results.length === 0 ?
          <Fragment>
            <p className="text-muted-foreground text-[0.9rem]">
              Nothing surfaced — widen terms or revisit the editorial filters inside /products.
            </p>
            <Link
              href="/products"
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "rounded-full")}
              onClick={onNavigate}
            >
              Browse full grid
            </Link>
          </Fragment>
        : null}

        <ul role="listbox" id={`${inputId}-listbox`} className="flex flex-col gap-5 pb-28">
          {results.map((hit) => (
            <li key={hit.slug}>
              <Link
                href={`/products/${hit.slug}`}
                className='border-border hover:border-muted-foreground/70 flex gap-5 rounded-2xl border p-5 transition-colors'
                onClick={() => {
                  pushRecent(hit.name);
                  onNavigate();
                }}
              >
                <span className="relative size-[4.375rem] overflow-hidden rounded-xl bg-muted">
                  <Image
                    src={optimizeRemoteImageUrl(hit.image, 360)}
                    alt={hit.imageAlt}
                    fill
                    className='object-cover'
                    sizes='90px'
                  />
                </span>
                <span className="flex flex-1 flex-col gap-1">
                  <span className="text-base tracking-tight">{hit.name}</span>
                  <span className='text-muted-foreground text-xs uppercase tracking-[0.2em]'>{hit.categorySlug}</span>
                  <span className="text-sm">{formatInrFromMinorUnits(hit.priceCents)}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <div className="border-border fixed inset-x-0 bottom-0 z-[70] flex gap-4 border-t bg-background/95 px-6 py-[max(env(safe-area-inset-bottom),12px)] pb-[max(env(safe-area-inset-bottom),16px)] pt-5 backdrop-blur-md">
        <SheetClose nativeButton render={<Button variant="ghost">Close</Button>} />
        <Button type="button" className='flex-1 touch-manipulation' onClick={() => submitSearch(query.trim())}>
          Open filtered shop view
        </Button>
      </div>
    </div>
  );
}
