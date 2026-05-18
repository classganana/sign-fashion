import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";
import { FadeIn } from "@/components/motion/fade-in";
import { optimizeRemoteImageUrl } from "@/lib/images";
import { cn } from "@/lib/utils";
import type { CollectionsFeaturedSectionConfig } from "@/types/homepage";

type CollectionsFeaturedSectionProps = {
  section: CollectionsFeaturedSectionConfig;
};

export function CollectionsFeaturedSection({
  section,
}: CollectionsFeaturedSectionProps) {
  return (
    <Section spacing="lg" tone="muted" className="border-border border-y">
      <Container>
        <FadeIn className="mb-16 max-w-xl space-y-4 md:mb-24 md:space-y-5">
          {section.eyebrow ?
            <p className="text-eyebrow text-muted-foreground">{section.eyebrow}</p>
          : null}
          <Heading level="title">{section.headline}</Heading>
          {section.subline ?
            <p className="text-muted-foreground max-w-lg text-[0.9375rem] leading-relaxed">
              {section.subline}
            </p>
          : null}
        </FadeIn>

        <div className="grid gap-8 md:grid-cols-3 md:gap-7 lg:gap-10">
          {section.items.map((item, index) => (
            <FadeIn key={item.href} delay={index * 0.07}>
              <Link
                href={item.href}
                className={cn(
                  "group shadow-minimal hover:shadow-soft block overflow-hidden rounded-[var(--radius-card)] bg-card outline-none ring-offset-background transition-luxury",
                  "border-border hover:border-border hover:-translate-y-0.5 border focus-visible:ring-2 focus-visible:ring-ring",
                )}
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={optimizeRemoteImageUrl(item.image, 1400)}
                    alt={item.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover duration-[620ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]"
                  />
                </div>
                <div className="space-y-2 px-1 py-8 md:px-2 md:py-10">
                  <h3 className="font-heading text-[1.05rem] font-medium tracking-tight md:text-[1.2rem]">
                    {item.title}
                  </h3>
                  {item.description ?
                    <p className="text-muted-foreground line-clamp-3 text-[0.8125rem] leading-relaxed">
                      {item.description}
                    </p>
                  : null}
                  <span className="text-muted-foreground inline-flex pt-2 text-[0.65rem] tracking-[0.3em] uppercase transition-luxury group-hover:text-foreground">
                    Explore
                  </span>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </Container>
    </Section>
  );
}
