import dynamic from "next/dynamic";
import type { CSSProperties } from "react";
import Link from "next/link";

import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ProductCard } from "@/components/ui/product-card";
import { RecentlyViewedRail } from "@/features/product-discovery/recently-viewed-rail";
import { RecentlyViewedSync } from "@/features/products/recently-viewed-sync";
import { PdpCommerceIsland } from "@/features/products/pdp-commerce-island";
import { DeliveryAvailabilityChecker } from "@/features/delivery";
import { formatInrFromMinorUnits } from "@/lib/money";
import { productTagLabel } from "@/lib/product-display";
import { cn } from "@/lib/utils";
import type { ResolvedGallerySlide } from "@/lib/product-gallery";

import type { MockSizeAvailability } from "@/services/pdp-merchandising";
import type { MockProduct } from "@/types/product";

const PdpGallery = dynamic(
  () =>
    import("@/features/products/pdp-gallery").then((m) => ({ default: m.PdpGallery })),
  {
    loading: () => (
      <div
        aria-hidden
        className='aspect-[3/4] w-full animate-[pulse_1.6s_ease-in-out_infinite] rounded-[var(--radius-card)] bg-muted/40'
      />
    ),
  },
);

type RelatedCapsule = { slug: string; title: string; sharedCount: number };

export type ProductPdpViewProps = {
  product: MockProduct;
  catalogue: readonly MockProduct[];
  resolvedGallery: ResolvedGallerySlide[];
  sizeAvailability: Record<string, MockSizeAvailability>;
  relatedStyles: MockProduct[];
  completeTheLook: MockProduct[];
  youMayAlsoLike: MockProduct[];
  relatedCollections: RelatedCapsule[];
  dropsEyebrow?: string | null;
};

export function ProductPdpView(props: ProductPdpViewProps) {
  const {
    product,
    catalogue,
    resolvedGallery,
    sizeAvailability,
    relatedStyles,
    completeTheLook,
    youMayAlsoLike,
    relatedCollections,
    dropsEyebrow,
  } = props;

  const tag = productTagLabel(product.tag);

  const trustBits = (
    [
      product.details.fabricSignal,
      product.details.returnsComfort,
      product.details.secureCheckoutHint,
      product.details.packagingStory?.slice(0, 158),
      product.details.deliveryNotes.slice(0, 148),
    ] as (string | undefined)[]
  ).filter(Boolean);

  const specRows = [
    { term: "Fit", desc: product.details.fit },
    { term: "Fabric", desc: product.details.fabric },
    { term: "Wash & care", desc: product.details.washCare },
    { term: "Styling cues", desc: product.details.styleNotes },
    { term: "Delivery footprint", desc: product.details.deliveryNotes },
    ...(
      product.details.packagingStory ?
        [{ term: "Packaging", desc: product.details.packagingStory } as const]
      : []
    ),
  ];

  const containerPb = {
    "--pdp-safe-pad": "max(7rem,calc(env(safe-area-inset-bottom, 0px) + 108px))",
  } as CSSProperties;

  return (
    <div className="flex flex-1 flex-col">
      <RecentlyViewedSync slug={product.slug} />
      <Container
        className="flex flex-col gap-14 pb-[var(--pdp-safe-pad)] pt-10 lg:gap-[5.25rem]"
        style={containerPb}
      >
        <div className="mb-2">
          <Link
            href="/products"
            className='text-muted-foreground text-[0.65rem] tracking-[0.24em] uppercase transition-luxury hover:text-foreground'
          >
            ← Shop curated
          </Link>
        </div>

        {dropsEyebrow ?
          <p className="text-muted-foreground text-[0.65rem] tracking-[0.3em] uppercase">
            Drops · {dropsEyebrow}
          </p>
        : null}

        <div className="grid gap-14 lg:grid-cols-[minmax(0,3fr)_minmax(296px,minmax(0,2fr))] lg:items-start lg:gap-20">
          <PdpGallery productName={product.name} slides={resolvedGallery} />

          <aside className="flex flex-col gap-11 lg:sticky lg:top-28 lg:h-fit lg:max-h-none lg:self-start lg:gap-12">
            <header className="space-y-4">
              {tag ?
                <p className='text-muted-foreground text-[0.6875rem] tracking-[0.28em] uppercase'>{tag}</p>
              : null}

              <Heading as="h1" level='display' className='font-display text-[clamp(2.05rem,3.05vw,3.125rem)] leading-[1.04]'>
                {product.name}
              </Heading>
              <p className="text-muted-foreground text-[0.6875rem] tracking-[0.22em] uppercase">
                {product.slug}
              </p>
              <p className='font-medium text-xl tracking-tight'>{formatInrFromMinorUnits(product.priceCents)}</p>
            </header>

            {product.details.editorialLead ?
              <p className='font-display text-[clamp(1.15rem,1.52vw,1.4rem)] text-foreground/95 leading-snug lg:max-w-prose'>
                {product.details.editorialLead}
              </p>
            : null}

            <p className='text-muted-foreground text-[0.9625rem] leading-[1.85] lg:max-w-prose'>
              {product.description}
            </p>

            {trustBits.length ?
              <div className="border-border divide-border divide-y rounded-xl border bg-muted/[0.08]">
                <ul className="divide-border divide-y">
                  {trustBits.slice(0, 4).map((line, i) => (
                    <li key={i} className='px-6 py-[0.9375rem] text-[0.81rem] text-muted-foreground leading-relaxed'>
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            : null}

            <DeliveryAvailabilityChecker />

            <div className="space-y-4">
              <p className='text-muted-foreground text-[0.62rem] font-medium tracking-[0.32em] uppercase'>
                Commerce lane
              </p>
              <Separator className="bg-border opacity-65" aria-hidden />
              <PdpCommerceIsland product={product} sizeAvailability={sizeAvailability} />
            </div>
          </aside>
        </div>

        <details className="group border-border/60 lg:max-w-[min(880px,calc(100%-2rem))] open:border-transparent">
          <summary className="marker:text-muted-foreground flex cursor-pointer list-none flex-wrap gap-4 py-10 text-[0.65rem] tracking-[0.3em] text-muted-foreground uppercase transition-colors [&::-webkit-details-marker]:hidden">
            <span>Specifications & tactile notes</span>
            <span className="-mt-px text-[0.55rem] text-muted-foreground/80 opacity-95 transition-[transform,color] duration-200 group-open:rotate-180 group-open:text-foreground">
              ▾
            </span>
          </summary>

          <div className="border-border divide-border divide-y border border-t-0">
            {specRows.map(({ term, desc }) => (
              <dl key={term} className="grid gap-y-6 px-5 py-[1.8rem] sm:grid-cols-[minmax(0,220px)_1fr] sm:gap-12">
                <dt className="text-muted-foreground text-[0.68rem] tracking-[0.2em] uppercase">{term}</dt>
                <dd className='text-[0.95rem] text-foreground tracking-tight'>{desc}</dd>
              </dl>
            ))}
          </div>
        </details>

        {relatedStyles.length ?
          <section className="border-border border-t pt-16">
            <Heading level='subtitle'>Related silhouettes · same aisle</Heading>
            <p className="mb-14 mt-4 max-w-2xl text-[0.9rem] leading-relaxed text-muted-foreground">
              Shift colour stories without rewinding into the identical palette — differentiated editorial spacing from
              other rails below.
            </p>
            <ul className="grid gap-x-12 gap-y-16 md:grid-cols-3">
              {relatedStyles.map((p, idx) => (
                <li key={p.slug}>
                  <ProductCard product={p} priority={idx < 3} />
                </li>
              ))}
            </ul>
          </section>
        : null}

        {completeTheLook.length ?
          <section className="border-border border-t pt-16">
            <Heading level='subtitle'>Complete the tension</Heading>
            <p className="mb-14 mt-4 max-w-2xl text-[0.9rem] leading-relaxed text-muted-foreground">
              Layer neighbouring categories tethered via shared capsules until trending pairs arrive from IMS.
            </p>
            <ul className="grid gap-x-12 gap-y-16 md:grid-cols-3">
              {completeTheLook.map((p, idx) => (
                <li key={p.slug}>
                  <ProductCard product={p} priority={idx < 2} />
                </li>
              ))}
            </ul>
          </section>
        : null}

        {youMayAlsoLike.length ?
          <section className="border-border border-t pt-16">
            <Heading level='subtitle'>Momentum picks</Heading>
            <p className="mb-14 mt-4 max-w-2xl text-[0.9rem] leading-relaxed text-muted-foreground">
              Trend-ranked assortment that intentionally skips earlier PDP exposures.
            </p>
            <ul className="grid gap-x-12 gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
              {youMayAlsoLike.map((p, idx) => (
                <li key={p.slug}>
                  <ProductCard product={p} priority={idx < 4} />
                </li>
              ))}
            </ul>
          </section>
        : null}

        {relatedCollections.length ?
          <section className='border-border/55 mt-8 border-t pt-16 lg:mt-[4rem]'>
            <Heading level='subtitle'>Related capsules</Heading>
            <p className='text-muted-foreground mt-5 max-w-2xl text-[0.92rem] leading-relaxed'>
              Jaccard overlap on SKU rosters mirrors stylist braids across mood boards.
            </p>
            <ul className="mt-12 flex flex-wrap gap-4">
              {relatedCollections.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/collections/${c.slug}`}
                    className={cn(
                      "border-border hover:border-muted-foreground/70 inline-flex rounded-full border px-6 py-2 text-[0.75rem]",
                      "tracking-[0.26em] uppercase transition-colors duration-150",
                    )}
                  >
                    {c.title}{" "}
                    <span className="text-muted-foreground ml-3 text-[0.65rem] normal-case tracking-normal">
                      overlap {c.sharedCount}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        : null}

        <RecentlyViewedRail catalogue={catalogue} currentSlug={product.slug} />
      </Container>
    </div>
  );
}
