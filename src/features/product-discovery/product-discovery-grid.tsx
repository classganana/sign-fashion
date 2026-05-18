"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { luxurySurface } from "@/lib/class-variants";
import { imageSizes, productImageSrc } from "@/lib/images";
import { formatInrFromMinorUnits } from "@/lib/money";
import { cn } from "@/lib/utils";
import type { MockProduct } from "@/types/product";

const LazyAddToCart = dynamic(() =>
  import("@/features/products/add-to-cart-button").then((m) => ({
    default: m.AddToCartButton,
  })),
);

const LazyWishlist = dynamic(() =>
  import("@/features/products/wishlist-toggle-button").then((m) => ({
    default: m.WishlistToggleButton,
  })),
);

type ShelfProps = {
  products: MockProduct[];
};

export function DiscoveryProductShelf({ products }: ShelfProps) {
  const [focused, setFocused] = useState<MockProduct | null>(null);

  return (
    <>
      <QuickPeekSheet product={focused} onClose={() => setFocused(null)} />
      <div className="grid grid-cols-2 gap-x-6 gap-y-16 md:grid-cols-3 md:gap-x-12 md:gap-y-24 xl:grid-cols-4">
        {products.map((product, i) => (
          <DiscoveryInteractiveCard
            key={product.slug}
            product={product}
            priority={i < 4}
            onQuickView={() => setFocused(product)}
          />
        ))}
      </div>
    </>
  );
}

export function DiscoveryEmptyState({
  headline = "Quiet rack",
  copy = "This combination is waiting for fresher arrivals — widen a facet or return to featured drops.",
}: {
  headline?: string;
  copy?: string;
}) {
  return (
    <div className="border-border/60 rounded-[calc(var(--radius-card)+12px)] border border-dashed bg-muted/15 px-6 py-28 text-center">
      <p className="text-muted-foreground text-[0.7rem] uppercase tracking-[0.32em]">Editorial whitespace</p>
      <Heading level="subtitle" align="center" className="mt-4">
        {headline}
      </Heading>
      <p className="text-muted-foreground mx-auto mt-4 max-w-md text-[0.9rem] leading-relaxed">{copy}</p>
      <Link
        href="/products"
        className="text-muted-foreground mt-8 inline-flex text-[0.7rem] underline-offset-[6px] uppercase tracking-[0.26em] transition-luxury hover:text-foreground hover:underline"
      >
        View full assortment
      </Link>
    </div>
  );
}

function DiscoveryInteractiveCard({
  product,
  priority,
  onQuickView,
}: {
  product: MockProduct;
  priority: boolean;
  onQuickView: () => void;
}) {
  const src = productImageSrc(product, 840);
  return (
    <article className="group/card relative flex flex-col gap-5">
      <div
        className={cn(
          "relative isolate aspect-[3/4] overflow-hidden rounded-[var(--radius-card)] bg-muted/25",
          luxurySurface({ interactive: false }),
        )}
      >
        <Link
          href={`/products/${product.slug}`}
          aria-labelledby={`discovery-card-${product.slug}`}
          className='relative block size-full rounded-[inherit] outline-none ring-offset-background transition-transform duration-[520ms] ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:ring-2 focus-visible:ring-ring group-hover/card:brightness-[1.02]'
        >
          <span id={`discovery-card-${product.slug}`} className="sr-only">
            {product.name}, {formatInrFromMinorUnits(product.priceCents)}
          </span>
          <Image
            src={src}
            alt=""
            aria-hidden
            fill
            priority={priority}
            sizes={imageSizes.cardGrid}
            className='object-cover transition-transform duration-[520ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/card:scale-[1.04]'
          />
        </Link>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onQuickView();
          }}
          className={cn(
            "pointer-events-auto absolute inset-x-4 bottom-4 hidden rounded-full px-8 py-[0.6rem] text-[0.65rem] tracking-[0.3em] uppercase sm:inline-flex",
            "justify-center bg-background/90 text-foreground opacity-0 shadow-soft backdrop-blur-md transition-all duration-[460ms]",
            "translate-y-2 md:opacity-100 md:group-hover/card:translate-y-0 md:group-hover/card:opacity-100",
          )}
        >
          Peek
        </button>
      </div>
      <div className="flex flex-col gap-1 pb-2">
        <Link href={`/products/${product.slug}`} className="line-clamp-2 text-[0.9375rem] leading-snug tracking-tight">
          {product.name}
        </Link>
        <span className="text-muted-foreground text-sm">{formatInrFromMinorUnits(product.priceCents)}</span>
      </div>
      <div className="sm:hidden">
        <Button variant="outline" type="button" className='h-11 w-full touch-manipulation rounded-2xl' onClick={onQuickView}>
          Quick glance
        </Button>
      </div>
    </article>
  );
}

function QuickPeekSheet({
  product,
  onClose,
}: {
  product: MockProduct | null;
  onClose: () => void;
}) {
  const hero = useMemo(() => (product ? productImageSrc(product, 980) : ""), [product]);
  const multiSize =
    !!product?.discovery?.sizes?.length && product.discovery.sizes.length > 1;

  const [peekSize, setPeekSize] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!product) return;
    if (product.discovery.sizes.length > 1) setPeekSize(undefined);
    else setPeekSize(product.discovery.sizes[0]);
  }, [product]);

  const addDisableReason =
    multiSize && !peekSize ? "Pick a size to add from quick glance" : undefined;

  return (
    <Sheet open={Boolean(product)} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side='bottom'
        showCloseButton
        className="rounded-t-[1.95rem]"
        style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))", maxHeight: "96vh", overflowY: "auto" }}
      >
        {product ?
          <div className="flex flex-col gap-10 pt-8">
            <SheetHeader className="space-y-3 p-0">
              <p className='text-muted-foreground text-[0.65rem] tracking-[0.3em] uppercase'>Quick view architecture</p>
              <SheetTitle className="text-display text-[1.8125rem] leading-tight tracking-tight">{product.name}</SheetTitle>
              <p className="text-lg">{formatInrFromMinorUnits(product.priceCents)}</p>
            </SheetHeader>
            <div className="relative aspect-[5/7] overflow-hidden rounded-[calc(var(--radius-card)+14px)] border border-border/40 bg-muted/30">
              <Image src={hero} alt={product.imageAlt} fill className='object-cover' sizes="100vw" />
            </div>
            <p className="text-muted-foreground max-w-xl text-[0.95rem] leading-relaxed">{product.description}</p>
            {multiSize ?
              <div className="space-y-2">
                <p className='text-muted-foreground text-[0.65rem] tracking-[0.28em] uppercase'>
                  Pick your size
                </p>
                <div className="flex flex-wrap gap-2" role="group" aria-label="Quick glance sizes">
                  {product.discovery.sizes.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      aria-pressed={peekSize === sz}
                      className={cn(
                        "min-h-[40px] min-w-[42px] rounded-full border px-3 text-[0.8rem] transition-colors duration-150",
                        peekSize === sz ?
                          "border-foreground bg-foreground/[0.04]"
                        : "border-border/75 hover:border-foreground/40",
                      )}
                      onClick={() => setPeekSize(sz)}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            : null}
            <div className="sticky bottom-[max(env(safe-area-inset-bottom),16px)] z-30 grid gap-3 bg-background pb-12 pt-2">
              <span className={addDisableReason ? "inline-flex flex-col gap-1" : "contents"}>
                <LazyAddToCart product={product} selectedSize={peekSize} />
                {addDisableReason ?
                  <p className="text-muted-foreground text-xs">{addDisableReason}</p>
                : null}
              </span>
              <LazyWishlist productId={product.id} className="w-full" />
              <Link href={`/products/${product.slug}`}>
                <Button variant="outline" type="button" className='w-full touch-manipulation rounded-2xl'>
                  Explore full dossier
                </Button>
              </Link>
              <SheetClose nativeButton render={<Button variant="ghost">Close panel</Button>} />
            </div>
          </div>
        : null}
      </SheetContent>
    </Sheet>
  );
}
