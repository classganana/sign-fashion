import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { ProductCard } from "@/components/ui/product-card";
import { Section } from "@/components/ui/section";
import { FadeIn } from "@/components/motion/fade-in";
import { cn } from "@/lib/utils";
import type { ProductGridSectionResolved } from "@/types/homepage";

type ProductGridSectionProps = {
  section: ProductGridSectionResolved;
};

export function ProductGridSection({ section }: ProductGridSectionProps) {
  return (
    <Section spacing="lg" bleed={false} className="bg-background border-border/40 border-b">
      <Container>
        <FadeIn className="mb-16 flex max-w-2xl flex-col gap-4 md:mb-24">
          {section.eyebrow ?
            <p className="text-eyebrow text-muted-foreground">{section.eyebrow}</p>
          : null}
          <Heading level="title">{section.headline}</Heading>
          {section.subline ?
            <p className="text-muted-foreground max-w-xl text-[0.9375rem] leading-relaxed md:text-[1rem] md:leading-7">
              {section.subline}
            </p>
          : null}
        </FadeIn>

        <ul className="grid grid-cols-2 gap-x-6 gap-y-16 md:grid-cols-3 md:gap-x-10 md:gap-y-24">
          {section.products.map((product, index) => (
            <FadeIn key={product.id} delay={index * 0.04}>
              <li>
                <ProductCard product={product} priority={index < 2} />
              </li>
            </FadeIn>
          ))}
        </ul>

        {section.cta ?
          <FadeIn className="mt-20 flex justify-center md:mt-28">
            <Link
              href={section.cta.href}
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "min-w-[12rem]",
              )}
            >
              {section.cta.label}
            </Link>
          </FadeIn>
        : null}
      </Container>
    </Section>
  );
}
