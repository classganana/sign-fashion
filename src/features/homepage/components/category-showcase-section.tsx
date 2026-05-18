import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { ProductCard } from "@/components/ui/product-card";
import { Section } from "@/components/ui/section";
import { FadeIn } from "@/components/motion/fade-in";
import { cn } from "@/lib/utils";
import type { CategoryShowcaseSectionResolved } from "@/types/homepage";

type CategoryShowcaseSectionProps = {
  section: CategoryShowcaseSectionResolved;
};

export function CategoryShowcaseSection({ section }: CategoryShowcaseSectionProps) {
  return (
    <Section spacing="md" bleed={false} className="bg-muted/20 border-border/30 border-t">
      <Container>
        <div className="flex flex-col gap-14 lg:grid lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-start lg:gap-20 xl:gap-28">
          <FadeIn className="max-w-xl space-y-6 lg:sticky lg:top-32 lg:space-y-8">
            {section.eyebrow ?
              <p className="text-eyebrow text-muted-foreground">{section.eyebrow}</p>
            : null}
            <Heading level="display" className="text-[clamp(2rem,4.25vw,3.125rem)]">
              {section.headline}
            </Heading>
            {section.subline ?
              <p className="text-muted-foreground text-[0.9375rem] leading-relaxed lg:text-[1rem] lg:leading-7">
                {section.subline}
              </p>
            : null}
            {section.cta ?
              <Link
                href={section.cta.href}
                className={cn(buttonVariants({ size: "lg" }), "mt-4 inline-flex w-fit")}
              >
                {section.cta.label}
              </Link>
            : null}
          </FadeIn>

          <FadeIn delay={0.08} className="min-w-0">
            <div className="-mx-[length:var(--spacing-gutter)] flex snap-x snap-mandatory gap-5 overflow-x-auto pb-3 pl-[length:var(--spacing-gutter)] pr-[length:var(--spacing-gutter)] sm:-mx-[length:var(--spacing-gutter-lg)] sm:gap-8 sm:pl-[length:var(--spacing-gutter-lg)] sm:pr-[length:var(--spacing-gutter-lg)] md:gap-10">
              {section.products.map((product, index) => (
                <div
                  key={product.id}
                  className="w-[72vw] max-w-[272px] shrink-0 snap-start sm:w-[min(42vw,280px)]"
                >
                  <ProductCard product={product} sizes="272px" priority={index === 0} />
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </Container>
    </Section>
  );
}
