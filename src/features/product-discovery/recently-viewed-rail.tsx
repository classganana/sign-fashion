"use client";

import Link from "next/link";
import Image from "next/image";

import { Heading } from "@/components/ui/heading";
import { imageSizes, productImageSrc } from "@/lib/images";
import { formatInrFromMinorUnits } from "@/lib/money";
import { cn } from "@/lib/utils";
import type { MockProduct } from "@/types/product";
import { useRecentlyViewedStore } from "@/store/recently-viewed-store";

export function RecentlyViewedRail({
  catalogue,
  currentSlug,
}: {
  catalogue: readonly MockProduct[];
  currentSlug?: string;
}) {
  const order = useRecentlyViewedStore((s) => s.slugOrder);

  const bySlug = Object.fromEntries(catalogue.map((p) => [p.slug, p])) as Record<string, MockProduct | undefined>;

  const rows = order
    .filter((slug) => slug !== currentSlug && bySlug[slug])
    .map((slug) => bySlug[slug]!)
    .slice(0, 6);

  if (!rows.length) return null;

  return (
    <section data-slot="recently-viewed-rail" className="border-border/40 mt-16 border-t pt-16">
      <Heading level='subtitle'>Recently viewed</Heading>
      <p className="text-muted-foreground mt-4 max-w-2xl text-[0.9rem] leading-relaxed">
        Session-based memory — aligns with personalization once accounts land.
      </p>
      <div className="mt-12 flex gap-6 overflow-x-auto pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory">
        {rows.map((product, index) => {
          const src = productImageSrc(product, 640);
          return (
            <Link
              key={product.slug}
              href={`/products/${product.slug}`}
              className={cn(
                "border-border hover:border-muted-foreground/70 group/rail shrink-0 snap-start overflow-hidden rounded-[var(--radius-card)] border shadow-minimal transition-colors",
                "w-[clamp(182px,min(238px,(100vw-3rem)*0.48),238px)] min-w-[180px]",
              )}
            >
              <div className="relative isolate aspect-[3/4] w-full overflow-hidden">
                <Image
                  src={src}
                  alt={product.imageAlt}
                  fill
                  loading={index > 2 ? "lazy" : undefined}
                  className='object-cover transition-transform duration-[520ms] group-hover/rail:scale-[1.04]'
                  sizes={imageSizes.cardRail}
                />
              </div>
              <div className='space-y-1 px-4 py-5'>
                <p className='line-clamp-2 text-[0.85rem]'>{product.name}</p>
                <p className='text-muted-foreground text-[0.8rem]'>{formatInrFromMinorUnits(product.priceCents)}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
