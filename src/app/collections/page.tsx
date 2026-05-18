import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getUnifiedCollections } from "@/services/collections-catalog";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";
import { optimizeRemoteImageUrl } from "@/lib/images";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Collections",
};

export default async function CollectionsIndexPage() {
  const capsuleRows = await getUnifiedCollections();
  return (
    <Section spacing="lg" bleed={false} className="flex-1">
      <Container>
        <header className="mb-14 max-w-xl space-y-4">
          <p className="text-eyebrow text-muted-foreground">Capsules</p>
          <Heading as="h1" level="title">
            Collections
          </Heading>
          <p className="text-muted-foreground leading-relaxed">
            Rotating narratives — staged like editorials, stocked as essentials.
          </p>
        </header>
        <ul className="grid gap-10 md:grid-cols-2 md:gap-12 lg:gap-14">
          {capsuleRows.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/collections/${c.slug}`}
                className="group shadow-minimal hover:shadow-soft block overflow-hidden rounded-[var(--radius-card)] border border-border bg-card transition-luxury hover:-translate-y-px"
              >
                <div className="relative aspect-[16/10]">
                  <Image
                    src={optimizeRemoteImageUrl(c.heroImage, 2000)}
                    alt={c.heroAlt}
                    fill
                    className={cn(
                      "object-cover transition-transform duration-[520ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                      "group-hover:scale-[1.015]",
                    )}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="bg-background/80 absolute inset-0" />
                  <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-10">
                    <h2 className="text-title mt-10 font-medium tracking-[var(--text-title--letter-spacing)] md:mt-auto">
                      {c.title}
                    </h2>
                    <p className="text-muted-foreground mt-3 max-w-md text-[0.9rem] leading-relaxed md:text-[0.9375rem]">
                      {c.description}
                    </p>
                    <span className="border-border mt-6 inline-flex w-fit border-b border-transparent pb-px text-[0.65rem] tracking-[0.32em] uppercase transition-luxury group-hover:border-foreground">
                      View capsule
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
