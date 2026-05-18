"use client";

import { useEffect, useRef, useState } from "react";

import { Minus, Plus, ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PdpFindFitSheet } from "@/features/products/pdp-find-fit-sheet";
import { WishlistToggleButton } from "@/features/products/wishlist-toggle-button";
import { cn } from "@/lib/utils";
import { formatInrFromMinorUnits } from "@/lib/money";
import { productImageSrc } from "@/lib/images";
import { useCartStore } from "@/store/cart-store";
import { usePdpSelectionStore } from "@/store/pdp-selection-store";

import type { MockSizeAvailability } from "@/services/pdp-merchandising";
import type { MockProduct } from "@/types/product";

type Props = {
  product: MockProduct;
  sizeAvailability: Record<string, MockSizeAvailability>;
};

export function PdpCommerceIsland({ product, sizeAvailability }: Props) {
  const addLine = useCartStore((s) => s.addLine);
  const pick = usePdpSelectionStore((s) => s.bySlug[product.slug]);
  const setSizePick = usePdpSelectionStore((s) => s.setSize);
  const setQtyPick = usePdpSelectionStore((s) => s.setQuantity);

  const firstSize = product.discovery.sizes[0];
  const hasMultiSizes = product.discovery.sizes.length > 1;

  const resolvedSize =
    hasMultiSizes ? pick?.size?.trim()
    : typeof firstSize === "string" ? firstSize
    : undefined;

  const quantity =
    typeof pick?.quantity === "number" ? pick.quantity : 1;

  const [sizePrompt, setSizePrompt] = useState(false);

  useEffect(() => {
    if (!hasMultiSizes || !product.discovery.sizes.length) return;
    const current = usePdpSelectionStore.getState().bySlug[product.slug]?.size?.trim?.();
    if (current?.length) return;
    const stocked = product.discovery.sizes.find(
      (sz) => sizeAvailability[sz] !== "sold_out",
    );
    if (stocked) usePdpSelectionStore.getState().setSize(product.slug, stocked);
  }, [product.slug, hasMultiSizes, product.discovery.sizes, sizeAvailability]);

  const buyRowRef = useRef<HTMLDivElement>(null);
  const [showDocked, setShowDocked] = useState(false);

  useEffect(() => {
    const el = buyRowRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setShowDocked(!e?.isIntersecting), {
      rootMargin: "0px 0px -8px 0px",
      threshold: 0.05,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const thumbSrc = productImageSrc(product, 720);

  function handleAddBag() {
    if (
      !resolvedSize ||
      !resolvedSize.length ||
      sizeAvailability[resolvedSize] === "sold_out"
    ) {
      setSizePrompt(hasMultiSizes);
      return;
    }
    setSizePrompt(false);
    addLine({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      priceCents: product.priceCents,
      currency: product.currency,
      image: thumbSrc,
      imageAlt: product.imageAlt,
      quantity,
      selectedSize: resolvedSize,
    });
  }

  function adjustQty(next: number) {
    setQtyPick(product.slug, next);
  }

  const dockSummary =
    hasMultiSizes ? (
      resolvedSize && sizeAvailability[resolvedSize] !== "sold_out" ?
        `${formatInrFromMinorUnits(product.priceCents)} · ${resolvedSize} · qty ${quantity}`
      : `${formatInrFromMinorUnits(product.priceCents)} · pick size · qty ${quantity}`
    )
  : `${formatInrFromMinorUnits(product.priceCents)} · qty ${quantity}`;

  return (
    <>
      <section className="space-y-7">
        <div className="flex items-start justify-between gap-4 border-border/70 border-b pb-6">
          <div className='space-y-2'>
            <p className="text-muted-foreground text-[0.65rem] tracking-[0.32em] uppercase">
              Size · fit
            </p>
            <p className="text-[0.9rem] text-muted-foreground leading-relaxed">
              Select a silhouette size — inventories sync later without changing this UX shell.
            </p>
          </div>
          <PdpFindFitSheet productSlug={product.slug} availableSizes={product.discovery.sizes} />
        </div>

        {hasMultiSizes ?
          <fieldset className="space-y-4 pb-6">
            <legend className='text-muted-foreground text-[0.65rem] tracking-[0.32em] uppercase'>
              Select size
            </legend>
            <div
              className="flex flex-wrap gap-2 pb-8 sm:pb-12"
              role="radiogroup"
              aria-label={`${product.name} sizes`}
            >
              {product.discovery.sizes.map((sz) => {
                const avail = sizeAvailability[sz] ?? "in_stock";
                const soldOut = avail === "sold_out";
                const sel = resolvedSize === sz;

                const labelCls = cn(
                  "relative inline-flex min-h-[44px] min-w-[3rem] items-center justify-center rounded-full border px-4 text-[0.85rem]",
                  "transition-colors duration-200 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
                  soldOut ?
                    "text-muted-foreground/45 border-border/40 bg-muted/15 cursor-not-allowed line-through decoration-border"
                  : sel ?
                    "border-foreground bg-foreground/[0.04]"
                  : "border-border/80 hover:border-foreground/40",
                );

                return (
                  <label key={sz} htmlFor={`sz-${product.slug}-${sz}`} className={labelCls}>
                    <input
                      id={`sz-${product.slug}-${sz}`}
                      type="radio"
                      name={`sizes-${product.slug}`}
                      className="sr-only"
                      disabled={soldOut}
                      checked={Boolean(sel)}
                      onChange={() => {
                        setSizePick(product.slug, sz);
                        setSizePrompt(false);
                      }}
                      value={sz}
                    />
                    <span>{sz}</span>
                    {!soldOut && avail === "low" ?
                      <span className="text-muted-foreground absolute left-1/2 top-[calc(100%+0.375rem)] -translate-x-1/2 whitespace-nowrap text-[0.55rem] tracking-[0.22em] uppercase">
                        Few left
                      </span>
                    : null}
                  </label>
                );
              })}
            </div>
            {sizePrompt ?
              <p className="-mt-10 text-xs text-destructive sm:-mt-6" role="status">
                Select an available size before adding to your bag.
              </p>
            : null}
          </fieldset>
        : null}

        <div className="flex flex-wrap items-center gap-6 pb-10">
          <p className="text-muted-foreground text-[0.65rem] tracking-[0.32em] uppercase">
            Quantity
          </p>
          <div className='border-border inline-flex rounded-full border bg-background'>
            <Button
              size="icon-sm"
              variant="ghost"
              className='size-12 rounded-none rounded-l-full'
              type="button"
              aria-label="Decrease quantity"
              onClick={() => adjustQty(quantity - 1)}
            >
              <Minus className="size-4" />
            </Button>
            <span className="flex min-w-11 items-center justify-center px-4 text-[0.93rem]" aria-live="polite">
              {quantity}
            </span>
            <Button
              size="icon-sm"
              variant="ghost"
              className='size-12 rounded-none rounded-r-full'
              type="button"
              aria-label="Increase quantity"
              onClick={() => adjustQty(quantity + 1)}
            >
              <Plus className="size-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-4 border-border pt-8 lg:border-t lg:bg-transparent lg:pb-10">
          <div ref={buyRowRef} className="flex flex-col gap-4 sm:flex-row sm:items-stretch">
            <Button
              type="button"
              size="lg"
              className="min-h-[3.125rem] w-full shrink-0 touch-manipulation gap-2 sm:flex-1"
              onClick={handleAddBag}
            >
              <ShoppingBag className="size-4 shrink-0" />
              Add to bag
            </Button>
            <WishlistToggleButton productId={product.id} className="w-full sm:w-auto md:flex-1" />
          </div>
          <div className="border-border mt-2 hidden border-t pt-8 text-[0.78rem] text-muted-foreground leading-relaxed md:block">
            <p>
              Taxes and shipping calculators surface in commerce phase · bag persists in-browser only until accounts
              ship.
            </p>
          </div>
        </div>
      </section>

      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-40 border-border/60 border-t bg-background/95 pb-[max(env(safe-area-inset-bottom),0.75rem)] pt-3 shadow-[0_-24px_60px_-30px_rgb(22_26_41_/_18%)] backdrop-blur-md transition-[transform,opacity] duration-[420ms] ease-out lg:pointer-events-none lg:hidden lg:translate-y-full lg:opacity-0",
          showDocked ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0",
        )}
        aria-hidden={!showDocked}
      >
        <div className="flex items-center justify-between gap-4 px-4">
          <p className="text-muted-foreground min-w-0 flex-1 text-[0.78rem] leading-snug">{dockSummary}</p>
          <Button
            type="button"
            size="lg"
            className='min-h-[2.875rem] min-w-[7.5rem] touch-manipulation'
            onClick={handleAddBag}
          >
            Add
          </Button>
        </div>
      </div>
    </>
  );
}
