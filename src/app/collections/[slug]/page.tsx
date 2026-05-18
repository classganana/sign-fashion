import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CollectionTone } from "@/config/collections";
import { getUnifiedCollections } from "@/services/collections-catalog";
import { FadeIn } from "@/components/motion/fade-in";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { ProductCard } from "@/components/ui/product-card";
import { Section } from "@/components/ui/section";
import { imageSizes, optimizeRemoteImageUrl } from "@/lib/images";
import { cn } from "@/lib/utils";
import { getRelatedCollections } from "@/services/product-discovery";
import { mergeCatalogNow } from "@/services/products";
import type { MockProduct } from "@/types/product";

type Props = { params: Promise<{ slug: string }> };

const palette: Record<
  CollectionTone,
  {
    veil: string;
    accent: string;
    surface: string;
  }
> = {
  mono: {
    veil: "via-black/60 from-black/92 to-transparent",
    accent: "text-neutral-200",
    surface: "bg-muted/25",
  },
  ember: {
    veil: "from-orange-950/85 via-orange-900/52 to-transparent",
    accent: "text-orange-100",
    surface: "bg-muted/35",
  },
  midnight: {
    veil: "from-indigo-950/92 via-purple-950/55 to-transparent",
    accent: "text-purple-50",
    surface: "bg-muted/35",
  },
};

export async function generateStaticParams() {
  const rows = await getUnifiedCollections();
  return rows.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const capsuleRows = await getUnifiedCollections();
  const capsule = capsuleRows.find((x) => x.slug === slug);
  if (!capsule) return {};
  const statement = capsule.storyBeats?.[0] ?? capsule.description;
  return { title: capsule.title, description: statement };
}

export default async function CollectionDetailPage(props: Props) {
  const { slug } = await props.params;
  const capsuleRows = await getUnifiedCollections();
  const capsule = capsuleRows.find((x) => x.slug === slug);
  if (!capsule) notFound();

  const catalogue = await mergeCatalogNow();
  const products: MockProduct[] = capsule.productSlugs
    .map((s) => catalogue.find((p) => p.slug === s))
    .filter((p): p is MockProduct => Boolean(p));

  const related = getRelatedCollections(capsule.slug, capsuleRows, 2);
  const skin = palette[capsule.tone];

  return (
    <article className="flex flex-1 flex-col overflow-x-hidden">
      <header className="relative isolate min-h-[min(92vh,40rem)] w-full md:min-h-[38rem]">
        <Image
          src={optimizeRemoteImageUrl(capsule.heroImage, 2800)}
          alt={capsule.heroAlt}
          fill
          priority
          className="object-cover"
          sizes={imageSizes.collectionHero}
        />
        <div className={cn("absolute inset-0 bg-gradient-to-br", skin.veil)} aria-hidden />
        <div className='absolute inset-x-0 bottom-10 flex flex-col gap-12 px-[length:var(--spacing-gutter)] sm:bottom-14 sm:px-[length:var(--spacing-gutter-lg)] lg:flex-row lg:items-end lg:justify-between xl:gap-24'>
          <div className="max-w-xl space-y-8 text-neutral-50">
            <span className="text-eyebrow text-neutral-400">Capsule · {capsule.tone}</span>
            <h1 className="text-neutral-50 text-display leading-[1]">{capsule.title}</h1>
            <p className={cn(skin.accent, "text-[1.045rem] leading-relaxed opacity-95")}>{capsule.description}</p>
            <Link
              href="/collections"
              className="inline-flex w-fit pb-px text-[0.65rem] uppercase tracking-[0.32em] text-neutral-200 underline-offset-[8px] transition-luxury hover:text-white hover:underline"
            >
              Atlas of capsules
            </Link>
          </div>

          {capsule.storyImage ?
            <FadeIn delay={0.08} className="relative hidden max-w-[18rem] flex-1 md:block xl:max-w-xs">
              <div className="shadow-soft relative aspect-[3/5] overflow-hidden rounded-[calc(var(--radius-card)+20px)] border border-neutral-900/65">
                <Image
                  src={optimizeRemoteImageUrl(capsule.storyImage, 1200)}
                  alt={capsule.storyImageAlt ?? capsule.title}
                  fill
                  className='object-cover'
                  sizes='(max-width: 768px) 0vw, 28vw'
                />
              </div>
            </FadeIn>
          : null}
        </div>
      </header>

      {capsule.storyBeats ?
        <Section bleed={false} spacing='lg' tone="card" className="border-border/40 border-b">
          <Container>
            <div className="flex flex-col gap-12 lg:grid lg:grid-cols-2 lg:gap-28 lg:divide-x lg:divide-border/40 lg:divide-dashed lg:divide-border">
              {capsule.storyBeats.map((paragraph, index) => (
                <FadeIn key={`${capsule.slug}-beat-${index}`} delay={index * 0.08}>
                  <p className="text-muted-foreground text-[clamp(1.035rem,1.9vw,1.165rem)] leading-[1.85] lg:pr-10">
                    {paragraph}
                  </p>
                </FadeIn>
              ))}
            </div>
          </Container>
        </Section>
      : null}

      <Section spacing="lg" bleed={false} className={cn(skin.surface, "backdrop-blur-sm")}>
        <Container className="space-y-16">
          <div className="flex flex-wrap items-start justify-between gap-8 border-border/55 border-t pt-14">
            <div className="flex max-w-xl flex-col gap-3">
              <Heading level="subtitle">In this capsule</Heading>
              <p className="text-muted-foreground text-[0.9rem]">
                Limited roster — anchored on silhouette tension, not SKU volume.
              </p>
              <span className='text-muted-foreground text-[2rem] leading-none tabular-nums md:text-[2.35rem]'>{String(products.length).padStart(2, "0")}</span>
            </div>
            <Link
              href="/products"
              className='text-muted-foreground text-[0.7rem] uppercase tracking-[0.32em] transition-luxury hover:text-foreground'
            >
              Pivot to broader shop →
            </Link>
          </div>

          <ul className="grid grid-cols-2 gap-x-8 gap-y-16 md:grid-cols-3 md:gap-x-12 xl:gap-y-20">
            {products.map((p, i) => (
              <li key={p.id}>
                <ProductCard product={p} priority={i < 2} />
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {related.length ?
        <Section bleed={false} spacing="lg" tone="muted" className='border-border border-t'>
          <Container className="space-y-12">
            <Heading level='subtitle'>Conversant capsules</Heading>
            <p className="text-muted-foreground max-w-2xl text-[0.9375rem]">
              Shared silhouettes surfaced via merchandising overlaps — personalization chips splice in seamlessly later.
            </p>
            <ul className="flex flex-wrap gap-4">
              {related.map((row) => (
                <li key={row.slug}>
                  <Link
                    href={`/collections/${row.slug}`}
                    className="border-border hover:border-muted-foreground/70 inline-flex rounded-full border px-8 py-[0.6rem] text-[0.7rem] uppercase tracking-[0.32em]"
                  >
                    {row.title}
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      : null}
    </article>
  );
}
