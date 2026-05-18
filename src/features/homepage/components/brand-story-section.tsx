import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";
import { FadeIn } from "@/components/motion/fade-in";
import { optimizeRemoteImageUrl } from "@/lib/images";
import { cn } from "@/lib/utils";
import type { BrandStorySectionConfig } from "@/types/homepage";

type BrandStorySectionProps = {
  section: BrandStorySectionConfig;
};

export function BrandStorySection({ section }: BrandStorySectionProps) {
  return (
    <Section spacing="lg" tone="card" bleed={false} className="border-border/40 border-y">
      <Container>
        <div className="flex flex-col gap-16 lg:grid lg:grid-cols-2 lg:items-center lg:gap-24 xl:gap-32">
          <FadeIn className="relative order-2 lg:order-1">
            <div className="relative aspect-[3/4] overflow-hidden rounded-[var(--radius-card)] bg-muted/30 shadow-soft">
              <Image
                src={optimizeRemoteImageUrl(section.image, 2000)}
                alt={section.imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
            </div>
          </FadeIn>

          <div className="order-1 flex flex-col gap-8 lg:order-2 lg:gap-10">
            {section.eyebrow ?
              <FadeIn>
                <p className="text-eyebrow text-muted-foreground">{section.eyebrow}</p>
              </FadeIn>
            : null}
            <FadeIn delay={0.05}>
              <Heading level="title">{section.headline}</Heading>
            </FadeIn>
            <div className="space-y-5">
              {section.body.map((paragraph, index) => (
                <FadeIn key={`paragraph-${index}`} delay={index * 0.07 + 0.1}>
                  <p className="text-muted-foreground text-[0.9375rem] leading-[1.75] md:text-[1rem]">
                    {paragraph}
                  </p>
                </FadeIn>
              ))}
            </div>
            {section.cta ?
              <FadeIn delay={0.32}>
                <Link
                  href={section.cta.href}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "inline-flex w-fit",
                  )}
                >
                  {section.cta.label}
                </Link>
              </FadeIn>
            : null}
          </div>
        </div>
      </Container>
    </Section>
  );
}
