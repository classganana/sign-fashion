import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { ProductCard } from "@/components/ui/product-card";
import { Section } from "@/components/ui/section";
import { FadeIn } from "@/components/motion/fade-in";
import type { ProductRailSectionResolved } from "@/types/homepage";

type ProductRailSectionProps = {
  section: ProductRailSectionResolved;
};

export function ProductRailSection({ section }: ProductRailSectionProps) {
  return (
    <Section spacing="md" tone="muted" className="border-border/70 border-t">
      <Container>
        <FadeIn className="mb-10 flex max-w-2xl flex-col gap-3 md:mb-14">
          <Heading level="title">{section.headline}</Heading>
          {section.subline ?
            <p className="text-muted-foreground max-w-xl text-[0.9rem] leading-relaxed md:text-[0.9375rem]">
              {section.subline}
            </p>
          : null}
        </FadeIn>
        <div className="grid auto-cols-[minmax(220px,272px)] grid-flow-col gap-4 overflow-x-auto pb-1 md:gap-6">
          {section.products.map((product, index) => (
            <FadeIn key={product.id} delay={index * 0.04} className="min-w-[220px]">
              <ProductCard
                product={product}
                sizes="272px"
                priority={index === 0}
              />
            </FadeIn>
          ))}
        </div>
      </Container>
    </Section>
  );
}
