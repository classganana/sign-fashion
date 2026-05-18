"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type {
  DiscoverySortOption,
  MockProductCampaign,
  ParsedDiscoveryParams,
} from "@/types/discovery";
import type { DiscoveryFacetBuckets } from "@/services/product-discovery";
import type { ListFacetField } from "@/lib/discovery-merge";
import { discoveryHref, parseDiscoveryParams } from "@/lib/discovery-url";
import {
  toggleCampaign,
  toggleListFacet,
  clearFacetFilters,
  patchSort,
} from "@/lib/discovery-merge";

const SORT_LABELS: Record<DiscoverySortOption, string> = {
  featured: "Featured",
  newest: "Newest",
  trending: "Trending",
  "price-asc": "Price · low to high",
  "price-desc": "Price · high to low",
};

const CAMPAIGN_LABELS: Record<MockProductCampaign, string> = {
  new: "New",
  limited: "Limited",
  bestseller: "Best seller",
};

function CampaignChips({
  params,
  navigate,
}: {
  params: ParsedDiscoveryParams;
  navigate: (next: ParsedDiscoveryParams) => void;
}) {
  return (
    <div className="space-y-3">
      <p className="text-muted-foreground text-[0.65rem] tracking-[0.26em] uppercase">Momentum</p>
      <div className="flex flex-wrap gap-2">
        {(Object.keys(CAMPAIGN_LABELS) as MockProductCampaign[]).map((slug) => {
          const active = params.campaigns.includes(slug);
          return (
            <button
              key={slug}
              type="button"
              aria-pressed={active}
              onClick={() => navigate(toggleCampaign(params, slug))}
              className={cn(
                "rounded-full px-5 py-1 text-[0.75rem] transition-luxury",
                active ?
                  "bg-foreground text-background"
                : "border-border hover:border-muted-foreground/60 border bg-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {CAMPAIGN_LABELS[slug]}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function FacetGroup({
  label,
  rows,
  field,
  params,
  navigate,
}: {
  label: string;
  rows: { value: string; label: string; count: number }[];
  field: ListFacetField;
  params: ParsedDiscoveryParams;
  navigate: (next: ParsedDiscoveryParams) => void;
}) {
  if (!rows.length) return null;

  return (
    <fieldset className="space-y-3">
      <legend className="text-muted-foreground text-[0.65rem] tracking-[0.26em] uppercase">{label}</legend>
      <ul className="flex flex-col gap-2">
        {rows.map((row) => {
          const checked = params[field].includes(row.value.toLowerCase());
          const id = `${field}-${row.value}`;
          return (
            <li key={row.value}>
              <label
                htmlFor={id}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2 text-[0.85rem]",
                  checked ?
                    "border-foreground bg-muted/15"
                  : "border-border hover:border-muted-foreground/40",
                  "transition-luxury",
                )}
              >
                <input
                  id={id}
                  type="checkbox"
                  className="border-input accent-foreground mt-px size-[0.9375rem] rounded-sm border"
                  checked={checked}
                  onChange={() => navigate(toggleListFacet(params, field, row.value))}
                />
                <span className="flex flex-1 items-baseline gap-3">
                  <span className="tracking-tight">{row.label}</span>
                  <span className="text-muted-foreground text-[0.7rem] tabular-nums">
                    ({row.count})
                  </span>
                </span>
              </label>
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
}

function facetNodes(
  facets: DiscoveryFacetBuckets,
  params: ParsedDiscoveryParams,
  navigate: (next: ParsedDiscoveryParams) => void,
  collectionRows: DiscoveryFacetBuckets["collections"],
) {
  return (
    <div className="flex flex-col gap-10">
      <CampaignChips navigate={navigate} params={params} />
      <FacetGroup
        label="Category"
        field="categories"
        rows={facets.categories}
        params={params}
        navigate={navigate}
      />
      <FacetGroup
        label="Collection"
        field="collections"
        rows={collectionRows}
        params={params}
        navigate={navigate}
      />
      <FacetGroup label="Size" field="sizes" rows={facets.sizes} params={params} navigate={navigate} />
      <FacetGroup label="Colour" field="colors" rows={facets.colors} params={params} navigate={navigate} />
      <FacetGroup label="Fit" field="fits" rows={facets.fits} params={params} navigate={navigate} />
      <FacetGroup
        label="Merch tags"
        field="discoveryTags"
        rows={facets.merchTags}
        params={params}
        navigate={navigate}
      />
    </div>
  );
}

export function ProductDiscoveryFacetSidebar({
  facets,
}: {
  facets: DiscoveryFacetBuckets;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const snapshot = useSearchParams().toString();
  const params = useMemo(() => parseDiscoveryParams(new URLSearchParams(snapshot)), [snapshot]);
  const navigate = (next: ParsedDiscoveryParams) => router.push(discoveryHref(pathname, next), { scroll: false });
  const collectionRows = facets.collections.filter((c) => c.count > 0);

  return (
    <aside
      aria-label="Product filters"
      className="sticky top-[6.75rem] hidden max-h-[calc(100vh-7rem)] w-full max-w-[15.5rem] shrink-0 flex-col gap-8 overflow-y-auto border-r border-border/50 pr-6 lg:flex"
    >
      <p className="text-muted-foreground text-[0.65rem] tracking-[0.3em] uppercase">Facet library</p>
      {facetNodes(facets, params, navigate, collectionRows)}
    </aside>
  );
}

type ToolbarProps = {
  facets: DiscoveryFacetBuckets;
  resultCount: number;
};

export function ProductDiscoveryToolbar({ facets, resultCount }: ToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const snapshot = useSearchParams().toString();
  const params = useMemo(() => parseDiscoveryParams(new URLSearchParams(snapshot)), [snapshot]);
  const navigate = (next: ParsedDiscoveryParams) => router.push(discoveryHref(pathname, next), { scroll: false });
  const collectionRows = facets.collections.filter((c) => c.count > 0);

  const facetMobile = facetNodes(facets, params, navigate, collectionRows);

  const anyFacetFilters =
    params.categories.length > 0 ||
    params.sizes.length > 0 ||
    params.colors.length > 0 ||
    params.fits.length > 0 ||
    params.collections.length > 0 ||
    params.discoveryTags.length > 0 ||
    params.campaigns.length > 0 ||
    !!params.q.trim();

  return (
    <header className="mb-10 flex flex-col gap-10 md:gap-12">
      <div className="flex flex-wrap items-start justify-between gap-6 lg:gap-10">
        <div className="space-y-3">
          <p className="text-eyebrow text-muted-foreground tracking-[0.3em]">Shop curated</p>
          <p className="text-muted-foreground text-[0.85rem] leading-relaxed md:text-[0.9375rem]">
            Considered staples — monochrome bases sculpted for layering in Indian cities.
          </p>
          <p className="text-title max-w-xl text-[clamp(1.35rem,2.5vw,1.875rem)] font-medium tracking-tight">
            {resultCount === 1 ? "One piece in view" : `${resultCount} pieces in rotation`}
          </p>
          {anyFacetFilters ?
            <div className="flex flex-wrap gap-3 pt-1">
              <Link
                href={discoveryHref(pathname, clearFacetFilters(params))}
                className={cn(buttonVariants({ variant: "outline", size: "sm" }), "rounded-full text-[0.7rem]")}
              >
                Clear facets
              </Link>
              <Link
                href="/products"
                className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "rounded-full text-[0.7rem]")}
              >
                Reset shop
              </Link>
            </div>
          : null}
        </div>
        <label className="text-muted-foreground flex w-full min-w-[12rem] max-w-[20rem] flex-col gap-2 text-[0.65rem] tracking-[0.26em] uppercase sm:self-end lg:w-auto lg:items-end xl:items-end">
          Sort
          <select
            value={params.sort}
            aria-label="Sort products"
            onChange={(e) =>
              navigate(patchSort(params, e.target.value as DiscoverySortOption))
            }
            className={cn(
              "border-input bg-background text-foreground h-12 w-full rounded-2xl border px-4 text-[0.8rem]",
              "font-normal tracking-normal normal-case outline-none ring-offset-background transition-luxury",
              "focus-visible:border-foreground focus-visible:ring-ring focus-visible:ring-2 lg:max-w-none",
              "touch-manipulation",
            )}
          >
            {(Object.keys(SORT_LABELS) as DiscoverySortOption[]).map((key) => (
              <option key={key} value={key}>
                {SORT_LABELS[key]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <Sheet>
        <div className="flex justify-center lg:hidden">
          <SheetTrigger render={<Button variant="outline" className="group h-[3.125rem] w-full max-w-xl gap-2" />}>
            <SlidersHorizontal className="size-4 shrink-0" aria-hidden />
            Discovery filters · premium edit
          </SheetTrigger>
        </div>
        <SheetContent
          side="bottom"
          showCloseButton
          className="rounded-t-[1.75rem]"
          style={{ maxHeight: "92vh", paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
        >
          <SheetHeader className='p-6 pb-0'>
            <SheetTitle>Filters</SheetTitle>
            <p className="text-muted-foreground text-[0.8rem] leading-relaxed">
              Build a tight rotation — overlays stay calm while you sculpt the grid.
            </p>
          </SheetHeader>
          <div className="flex flex-1 flex-col overflow-hidden px-6 pb-32">
            <div className="flex flex-1 flex-col gap-4 overflow-y-auto pr-1">{facetMobile}</div>
          </div>
          <div className="border-border sticky bottom-0 border-t bg-background/95 px-6 py-4 backdrop-blur-md">
            <SheetClose nativeButton render={<Button className="touch-manipulation w-full px-10">Continue</Button>} />
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
