import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";
import { FadeIn } from "@/components/motion/fade-in";
import { optimizeRemoteImageUrl } from "@/lib/images";
import { cn } from "@/lib/utils";
import type { SocialGallerySectionConfig } from "@/types/homepage";

const tilePatterns = [
  "col-span-2 aspect-square md:col-span-4 md:aspect-auto md:min-h-[15rem]",
  "aspect-square md:col-span-1 md:min-h-[11rem]",
  "aspect-square md:col-span-1 md:min-h-[11rem]",
  "aspect-[3/4] md:col-span-2 md:min-h-[12rem]",
  "aspect-square md:col-span-2 md:min-h-[8rem]",
  "aspect-square md:col-span-2 md:min-h-[10rem]",
] as const;

type SocialGallerySectionProps = {
  section: SocialGallerySectionConfig;
};

export function SocialGallerySection({ section }: SocialGallerySectionProps) {
  const tiles = section.posts.slice(0, tilePatterns.length);

  return (
    <Section spacing="lg" tone="muted" className="border-border border-y">
      <Container>
        <FadeIn className="mb-12 flex flex-col gap-10 md:mb-20 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl space-y-4">
            {section.headline ?
              <Heading level="title">{section.headline}</Heading>
            : null}
            {section.subline ?
              <p className="text-muted-foreground text-[0.9375rem] leading-relaxed">{section.subline}</p>
            : null}
          </div>

          {section.profileHref ?
            <Link
              href={section.profileHref}
              target="_blank"
              rel="noreferrer noopener"
              className={cn(
                "text-muted-foreground inline-flex items-center gap-2 text-[0.7rem] tracking-[0.22em] uppercase transition-luxury",
                "hover:text-foreground",
              )}
            >
              @{section.username}
              <ExternalLink className="size-4 opacity-65" aria-hidden />
            </Link>
          : (
            <p className="text-muted-foreground text-[0.7rem] tracking-[0.22em] uppercase">
              @{section.username}
            </p>
          )}
        </FadeIn>

        <div className="grid grid-cols-2 gap-2 md:grid-cols-6 md:auto-rows-fr md:gap-3">
          {tiles.map((post, index) => (
            <FadeIn key={`${post.image}-${index}`} delay={index * 0.04} className={cn("relative overflow-hidden rounded-lg bg-muted/20 shadow-minimal", tilePatterns[index])}>
              {post.href ?
                <Link
                  href={post.href}
                  className={cn(
                    "relative block size-full overflow-hidden rounded-[inherit]",
                    "transition-transform duration-[520ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.02]",
                  )}
                >
                  <Image
                    src={optimizeRemoteImageUrl(post.image, 900)}
                    alt={post.imageAlt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 20vw"
                  />
                </Link>
              : (
                <div className="relative size-full overflow-hidden rounded-[inherit]">
                  <Image
                    src={optimizeRemoteImageUrl(post.image, 900)}
                    alt={post.imageAlt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 20vw"
                  />
                </div>
              )}
            </FadeIn>
          ))}
        </div>
      </Container>
    </Section>
  );
}
