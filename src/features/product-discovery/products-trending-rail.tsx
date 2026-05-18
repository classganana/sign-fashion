import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { ProductCard } from "@/components/ui/product-card";
import { getTrendingProducts } from "@/services/product-discovery";
import { mergeCatalogNow } from "@/services/products";
import { cn } from "@/lib/utils";

export async function ProductsTrendingRail() {
  const catalog = await mergeCatalogNow();
  const picks = getTrendingProducts(catalog, 4);
  return (
    <section className="border-border/40 mt-[length:var(--spacing-section-lg)] border-t pt-[length:var(--spacing-section-md)] lg:mt-[length:var(--spacing-section-xl)] lg:pt-[length:var(--spacing-section-lg)]">
      <div className='mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between'>
        <div className='max-w-xl space-y-4'>
          <p className="text-eyebrow text-muted-foreground">Velocity rail</p>
          <Heading level="title">Trending rotations</Heading>
          <p className="text-muted-foreground text-[0.9rem] leading-relaxed md:text-[0.9375rem]">
            Merchandising weight + social velocity hints — placeholders until analytics hydrate the scorer.
          </p>
        </div>
        <Link
          href="/products?sort=trending"
          className={cn(buttonVariants({ variant: "outline", size: "lg" }), "rounded-full px-10")}
        >
          View leaderboard
        </Link>
      </div>
      <ul className="grid grid-cols-2 gap-x-8 gap-y-14 md:grid-cols-4">
        {picks.map((product, idx) => (
          <li key={product.slug}>
            <ProductCard product={product} priority={idx < 2} />
          </li>
        ))}
      </ul>
    </section>
  );
}
