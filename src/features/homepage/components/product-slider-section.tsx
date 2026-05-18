"use client";

import type { MutableRefObject } from "react";
import { useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { ProductCard } from "@/components/ui/product-card";
import { Section } from "@/components/ui/section";
import { transitions } from "@/lib/motion";
import type { ProductSliderSectionResolved } from "@/types/homepage";

type ProductSliderSectionProps = {
  section: ProductSliderSectionResolved;
};

export function ProductSliderSection({ section }: ProductSliderSectionProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const scrollBy = useCallback((dir: "prev" | "next") => {
    const el = scrollerRef.current;
    if (!el) return;
    const w = Math.min(window.innerWidth * 0.75, 296);
    el.scrollBy({ left: dir === "next" ? w : -w, behavior: "smooth" });
  }, []);

  const introProps = reduce ? null : transitions.luxury;

  const headerClassName =
    "mb-14 flex flex-col gap-10 md:mb-20 md:flex-row md:items-end md:justify-between";

  const introInner = (
    <>
      <div className="max-w-xl space-y-4">
        {section.eyebrow ?
          <p className="text-eyebrow text-muted-foreground">{section.eyebrow}</p>
        : null}
        <Heading level="title">{section.headline}</Heading>
        {section.subline ?
          <p className="text-muted-foreground max-w-lg text-[0.9375rem] leading-relaxed">
            {section.subline}
          </p>
        : null}
      </div>

      <div className="hidden shrink-0 gap-2 md:flex">
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Scroll products left"
          onClick={() => scrollBy("prev")}
        >
          <ChevronLeft className="size-5" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Scroll products right"
          onClick={() => scrollBy("next")}
        >
          <ChevronRight className="size-5" />
        </Button>
      </div>
    </>
  );

  return (
    <Section spacing="lg" bleed={false} className="border-border/35 border-t bg-background">
      <Container>
        {introProps ?
          <motion.div
            className={headerClassName}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-12% 0px" }}
            transition={introProps}
          >
            {introInner}
          </motion.div>
        : <div className={headerClassName}>{introInner}</div>}

        <ProductSliderScroller
          refProp={scrollerRef}
          products={section.products}
          reduceMotion={reduce}
        />
      </Container>
    </Section>
  );
}

function ProductSliderScroller({
  refProp,
  products,
  reduceMotion,
}: {
  refProp: MutableRefObject<HTMLDivElement | null>;
  products: ProductSliderSectionResolved["products"];
  reduceMotion: boolean | null;
}) {
  return (
    <div
      ref={refProp}
      className={[
        "-mx-[length:var(--spacing-gutter)] flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 pl-[length:var(--spacing-gutter)]",
        "sm:-mx-[length:var(--spacing-gutter-lg)] sm:gap-8 sm:pl-[length:var(--spacing-gutter-lg)] lg:gap-10",
        "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
        "pr-[calc(var(--spacing-gutter)+1.25rem)] sm:pr-[calc(var(--spacing-gutter-lg)+1.25rem)]",
      ].join(" ")}
      tabIndex={0}
      aria-label={`Trending carousel with ${products.length} products`}
    >
      {products.map((product, index) =>
        reduceMotion ?
          <div
            key={product.id}
            className="w-[74vw] max-w-[296px] shrink-0 snap-start sm:w-[min(38vw,304px)]"
          >
            <ProductCard product={product} sizes="304px" priority={index === 0} />
          </div>
        : (
          <motion.div
            key={product.id}
            className="w-[74vw] max-w-[296px] shrink-0 snap-start sm:w-[min(38vw,304px)]"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-6% 0px" }}
            transition={{ ...transitions.luxury, delay: index * 0.05 }}
          >
            <ProductCard product={product} sizes="304px" priority={index === 0} />
          </motion.div>
        ),
      )}
    </div>
  );
}
