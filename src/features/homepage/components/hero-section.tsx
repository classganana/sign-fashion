import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { optimizeRemoteImageUrl } from "@/lib/images";
import { cn } from "@/lib/utils";
import { HeroIntro } from "./hero-intro";
import type { HeroSectionConfig } from "@/types/homepage";

type HeroSectionProps = {
  section: HeroSectionConfig;
};

export function HeroSection({ section }: HeroSectionProps) {
  return (
    <section className="relative min-h-[min(88vh,52rem)] w-full overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <Image
          src={optimizeRemoteImageUrl(section.image, 2600)}
          alt={section.imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Neutral scrim — no multi-stop gradients */}
        <div
          aria-hidden
          className={cn(
            "absolute inset-0 bg-black/42",
          )}
        />
      </div>

      <Container className="flex min-h-[min(88vh,52rem)] flex-col justify-end gap-8 pb-20 pt-48 md:min-h-[44rem] md:justify-center md:pb-24 md:pt-28 lg:gap-12">
        <HeroIntro
          eyebrow={section.eyebrow}
          title={section.title}
          subtitle={section.subtitle}
        />
        {(section.primaryCta ?? section.secondaryCta) ?
          <div className="flex flex-wrap gap-3">
            {section.primaryCta ?
              <Link
                href={section.primaryCta.href}
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "border-transparent bg-neutral-50 text-neutral-950",
                  "justify-center hover:bg-neutral-50/92 min-w-[10rem]",
                )}
              >
                {section.primaryCta.label}
              </Link>
            : null}
            {section.secondaryCta ?
              <Link
                href={section.secondaryCta.href}
                className={cn(
                  buttonVariants({
                    variant: "outline",
                    size: "lg",
                  }),
                  "justify-center border-neutral-500/65 bg-transparent text-neutral-50",
                  "transition-luxury hover:border-neutral-400 hover:bg-white/6",
                )}
              >
                {section.secondaryCta.label}
              </Link>
            : null}
          </div>
        : null}
      </Container>
    </section>
  );
}
