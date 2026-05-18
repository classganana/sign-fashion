import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";
import { FadeIn } from "@/components/motion/fade-in";
import { optimizeRemoteImageUrl } from "@/lib/images";
import type { EditorialGridSectionConfig } from "@/types/homepage";

type EditorialGridSectionProps = {
  section: EditorialGridSectionConfig;
};

export function EditorialGridSection({ section }: EditorialGridSectionProps) {
  return (
    <Section spacing="md" bleed={false}>
      <Container>
        <FadeIn className="mb-12 max-w-2xl space-y-3 md:mb-16">
          <Heading level="title">{section.headline}</Heading>
          {section.subline ?
            <p className="text-muted-foreground max-w-xl text-[0.9rem] leading-relaxed md:text-[0.9375rem]">
              {section.subline}
            </p>
          : null}
        </FadeIn>
        <div className="grid gap-5 md:grid-cols-3 md:gap-6">
          {section.items.map((item, index) => (
            <FadeIn key={item.href} delay={index * 0.05}>
              <Link
                href={item.href}
                className="group border-border shadow-minimal hover:shadow-soft block overflow-hidden rounded-[var(--radius-card)] border bg-card transition-luxury hover:-translate-y-0.5"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-muted/20">
                  <Image
                    src={optimizeRemoteImageUrl(item.image, 1200)}
                    alt={item.imageAlt}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition-transform duration-[480ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]"
                  />
                  <div
                    className="border-border bg-background/75 absolute inset-x-0 bottom-0 border-t backdrop-blur-sm"
                  >
                    <div className="space-y-1 px-5 py-4">
                      <p className="text-lg tracking-tight">{item.title}</p>
                      {item.caption ?
                        <p className="text-muted-foreground text-sm">{item.caption}</p>
                      : null}
                    </div>
                  </div>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </Container>
    </Section>
  );
}
