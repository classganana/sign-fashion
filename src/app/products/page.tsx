import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";
import {
  ProductDiscoveryFacetSidebar,
  ProductDiscoveryToolbar,
} from "@/features/product-discovery/product-discovery-filters";
import {
  DiscoveryEmptyState,
  DiscoveryProductShelf,
} from "@/features/product-discovery/product-discovery-grid";
import { ProductsTrendingRail } from "@/features/product-discovery/products-trending-rail";
import { parseDiscoveryParams } from "@/lib/discovery-url";
import { buildDiscoveryListing } from "@/services/product-discovery";
import { getUnifiedCollections } from "@/services/collections-catalog";
import { mergeCatalogNow } from "@/services/products";

export const metadata: Metadata = {
  title: "Shop",
};

function SidebarFallback() {
  return <div aria-hidden className="hidden lg:block lg:w-[15rem]" />;
}

function ToolbarFallback() {
  return (
    <div className='mb-10 space-y-4'>
      <div className='bg-muted/30 h-[1.3125rem] w-52 max-w-[90%] animate-pulse rounded-md' />
      <div className="bg-muted/30 max-w-xl space-y-3">
        <div className="h-4 animate-pulse rounded-md" />
        <div className="h-[2.875rem] w-3/5 max-w-xl animate-pulse rounded-md" />
      </div>
    </div>
  );
}

export default async function ProductsPage(props: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolved = await props.searchParams;
  const params = parseDiscoveryParams(resolved ?? {});
  const [catalog, capsuleDefinitions] = await Promise.all([mergeCatalogNow(), getUnifiedCollections()]);
  const { filtered, facets, hasActiveFilters } = buildDiscoveryListing(catalog, params, {
    capsuleDefinitions,
  });

  const introTitle = params.q.trim() ? `Results for “${params.q.trim()}”` : "Considered staples";

  return (
    <Section
      spacing="md"
      tone="muted"
      className='border-border/70 flex-1 border-t pb-[length:var(--spacing-section-md)] lg:pb-[length:var(--spacing-section-lg)]'
    >
      <Container>
        <header className="mb-14 max-w-3xl space-y-6">
          <p className="text-eyebrow text-muted-foreground">Discover</p>
          <Heading as="h1" level="title">
            {introTitle}
          </Heading>
        </header>

        <div className="flex flex-col gap-14 lg:flex-row lg:gap-[4.75rem] xl:gap-[5.75rem]">
          <Suspense fallback={<SidebarFallback />}>
            <ProductDiscoveryFacetSidebar facets={facets} />
          </Suspense>

          <div className='min-w-0 flex-1'>
            <Suspense fallback={<ToolbarFallback />}>
              <ProductDiscoveryToolbar facets={facets} resultCount={filtered.length} />
            </Suspense>

            {filtered.length ?
              <DiscoveryProductShelf products={filtered} />
            : <DiscoveryEmptyState />}

            {hasActiveFilters && filtered.length < catalog.length ?
              <p className='text-muted-foreground mt-[length:var(--spacing-section-sm)] max-w-xl text-[0.8rem] leading-relaxed lg:mt-24'>
                Merchandisers can pin hero SKUs atop this grid later — facets already respect URL primitives for ISR + SEO.
              </p>
            : null}

            <ProductsTrendingRail />
          </div>
        </div>
      </Container>
    </Section>
  );
}
