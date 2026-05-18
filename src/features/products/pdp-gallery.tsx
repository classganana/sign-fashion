"use client";

import Image from "next/image";
import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Maximize2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { imageSizes } from "@/lib/images";

import type { ResolvedGallerySlide } from "@/lib/product-gallery";

type Props = {
  productName: string;
  slides: readonly ResolvedGallerySlide[];
};

/** Premium PDP gallery — snap mobile track, thumbnails desktop, light zoom, fullscreen sheet. */
export const PdpGallery = forwardRef<HTMLDivElement, Props>(function PdpGalleryInner(
  { productName, slides },
  forwardedRef,
) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [loaded, setLoaded] = useState<Record<number, boolean>>({});

  const trackRef = useRef<HTMLDivElement>(null);
  const labelledBy = useId();

  const focusSlide = useCallback((idx: number) => {
    const root = trackRef.current;
    if (!root) return;
    const target = root.querySelector(
      `[data-slide-index="${idx}"]`,
    ) as HTMLElement | null;
    target?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
    setActiveIndex(idx);
  }, []);

  useEffect(() => {
    const root = trackRef.current;
    if (!root || slides.length <= 1) return;
    const io = new IntersectionObserver(
      (entries) => {
        let bestRatio = 0;
        let bestIdx = -1;
        for (const e of entries) {
          if (!(e.target instanceof HTMLElement)) continue;
          if (!e.isIntersecting || e.intersectionRatio < bestRatio) continue;
          bestRatio = e.intersectionRatio;
          const idx = Number(e.target.dataset.slideIndex);
          if (!Number.isNaN(idx)) bestIdx = idx;
        }
        if (bestIdx >= 0)
          setActiveIndex((prev) => (prev === bestIdx ? prev : bestIdx));
      },
      { root, rootMargin: "0px", threshold: [0.52, 0.65, 0.8] },
    );
    for (const el of root.querySelectorAll("[data-slide-index]"))
      io.observe(el);
    return () => io.disconnect();
  }, [slides.length]); // avoids fighting desktop thumb swaps

  const onGalleryKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (slides.length <= 1) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        focusSlide(Math.max(0, activeIndex - 1));
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        focusSlide(Math.min(slides.length - 1, activeIndex + 1));
      }
    },
    [activeIndex, focusSlide, slides.length],
  );

  if (!slides.length) return null;

  return (
    <div ref={forwardedRef} className="space-y-5">
      {/* Mobile carousel */}
      <div className="lg:hidden">
        <div
          id={labelledBy}
          aria-label={`${productName} gallery`}
          aria-roledescription="carousel"
          role="region"
          className="-mx-4 sm:mx-0"
        >
          <div
            ref={trackRef}
            role="presentation"
            tabIndex={0}
            onKeyDown={onGalleryKeyDown}
            className={cn(
              "flex snap-x snap-mandatory overflow-x-auto scroll-smooth focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none",
              "gap-3 px-1 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
            )}
          >
            {slides.map((slide, i) => (
              <figure
                key={`${slide.srcFull}-${i}`}
                data-slide-index={i}
                className="relative min-w-[min(92vw,420px)] snap-center"
              >
                <button
                  type="button"
                  aria-label={`Open fullscreen view ${i + 1} of ${slides.length}`}
                  className="group relative block aspect-[3/4] w-full overflow-hidden rounded-[var(--radius-card)] border border-border/60 bg-muted/30 shadow-soft transition-shadow duration-300 hover:shadow-md"
                  onClick={() => {
                    setActiveIndex(i);
                    setLightboxOpen(true);
                  }}
                >
                  <div className="pointer-events-none absolute inset-0 bg-muted/25 transition-opacity duration-[600ms]" />
                  <div className="relative h-full w-full overflow-hidden">
                    <Image
                      src={slide.srcCard}
                      alt={slide.alt}
                      fill
                      priority={i === 0}
                      loading={i === 0 ? "eager" : "lazy"}
                      sizes={imageSizes.pdpGallerySwipe}
                      className={cn(
                        "object-cover transition-transform duration-500 ease-out md:group-hover:scale-[1.04]",
                        loaded[i] ? "opacity-100" : "opacity-0",
                      )}
                      onLoad={() =>
                        setLoaded((prev) => ({ ...prev, [i]: true }))
                      }
                    />
                  </div>
                </button>
                <figcaption className="sr-only">{slide.alt}</figcaption>
              </figure>
            ))}
          </div>
        </div>
        <div className="mt-4 flex items-center justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Show image ${i + 1}`}
              aria-current={i === activeIndex}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === activeIndex ? "w-7 bg-foreground" : "w-1.5 bg-border",
              )}
              onClick={() => focusSlide(i)}
            />
          ))}
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden gap-5 lg:flex">
        <div
          className="flex w-20 shrink-0 flex-col gap-2"
          role="tablist"
          aria-label="Gallery thumbnails"
        >
          {slides.map((slide, i) => (
            <button
              key={`thumb-${slide.srcFull}-${i}`}
              type="button"
              role="tab"
              id={`${labelledBy}-tab-${i}`}
              aria-selected={i === activeIndex}
              aria-controls={`pdp-main-slide-${i}`}
              className={cn(
                "relative aspect-[3/4] w-full overflow-hidden rounded-lg border transition-shadow duration-200",
                i === activeIndex ?
                  "border-foreground/40 ring-1 ring-foreground/20"
                : "border-border/70 hover:border-foreground/30",
              )}
              onClick={() => setActiveIndex(i)}
            >
              <Image
                src={slide.srcFull}
                alt=""
                fill
                loading="lazy"
                sizes={imageSizes.pdpGalleryThumb}
                className="object-cover"
              />
              <span className="sr-only">
                Slide {i + 1}: {slide.alt}
              </span>
            </button>
          ))}
        </div>

        <div className="relative min-h-0 min-w-0 flex-1">
          <figure
            id={`pdp-main-slide-${activeIndex}`}
            role="tabpanel"
            aria-labelledby={`${labelledBy}-tab-${activeIndex}`}
            className="relative aspect-[3/4] overflow-hidden rounded-[var(--radius-card)] border border-border/60 bg-muted/30 shadow-soft"
          >
            <button
              type="button"
              aria-label={`${productName} — expand image ${activeIndex + 1} of ${slides.length}`}
              className="group relative block size-full outline-none transition-transform duration-300"
              onClick={() => setLightboxOpen(true)}
            >
              <div className="absolute inset-0 bg-muted/30 opacity-100 transition-opacity duration-500 group-hover:opacity-0 data-[loaded=true]:opacity-0" />
              <div className="relative size-full overflow-hidden">
                <Image
                  src={slides[activeIndex]!.srcFull}
                  alt={slides[activeIndex]!.alt}
                  fill
                  priority
                  sizes={imageSizes.pdpHero}
                  className={cn(
                    "object-cover transition-transform duration-[480ms] ease-out group-hover:scale-[1.045]",
                    loaded[activeIndex] ? "opacity-100" : "opacity-0",
                  )}
                  onLoad={() =>
                    setLoaded((prev) => ({ ...prev, [activeIndex]: true }))
                  }
                />
              </div>
              <span className="text-muted-foreground pointer-events-none absolute right-5 bottom-5 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-3 py-1.5 text-[0.65rem] tracking-[0.18em] uppercase backdrop-blur-sm">
                <Maximize2 className="size-3.5" aria-hidden />
                View
              </span>
            </button>
          </figure>

          {slides.length > 1 ?
            <>
              <div className="pointer-events-none absolute inset-x-6 top-1/2 flex -translate-y-1/2 justify-between">
                <Button
                  type="button"
                  size="icon-sm"
                  variant="secondary"
                  className="pointer-events-auto shadow-md"
                  aria-label="Previous image"
                  disabled={activeIndex === 0}
                  onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
                >
                  <ChevronLeft className="size-4" />
                </Button>
                <Button
                  type="button"
                  size="icon-sm"
                  variant="secondary"
                  className="pointer-events-auto shadow-md"
                  aria-label="Next image"
                  disabled={activeIndex === slides.length - 1}
                  onClick={() =>
                    setActiveIndex((i) => Math.min(slides.length - 1, i + 1))
                  }
                >
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </>
          : null}
        </div>
      </div>

      <Sheet open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <SheetContent
          side="bottom"
          showCloseButton
          className="h-[100dvh] max-h-[100dvh] rounded-none border-0 p-0 [&>button]:text-background [&>button]:hover:bg-white/10"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>{productName} — fullscreen</SheetTitle>
          </SheetHeader>
          <div className="relative flex h-full flex-col bg-black">
            <div className="relative flex-1 overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <div className="relative h-full max-h-[min(88vh,920px)] w-full max-w-lg">
                  <Image
                    src={slides[activeIndex]!.srcFull}
                    alt={slides[activeIndex]!.alt}
                    fill
                    priority
                    sizes="100vw"
                    className="object-contain opacity-95"
                  />
                </div>
              </div>
            </div>

            <div className="border-border flex flex-wrap items-center justify-center gap-x-10 gap-y-3 border-white/10 border-t px-6 py-4 pb-[max(env(safe-area-inset-bottom),1rem)] text-white">
              <Button
                type="button"
                variant="outline"
                className="border-white/40 text-white hover:bg-white/10"
                disabled={activeIndex === 0}
                onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
              >
                Prev
              </Button>
              <p className="text-[0.7rem] tracking-[0.28em] text-white/75 uppercase">
                {activeIndex + 1}/{slides.length}
              </p>
              <Button
                type="button"
                variant="outline"
                className="border-white/40 text-white hover:bg-white/10"
                disabled={activeIndex === slides.length - 1}
                onClick={() =>
                  setActiveIndex((i) =>
                    Math.min(slides.length - 1, i + 1),
                  )
                }
              >
                Next
              </Button>
            </div>

            <p className="text-center text-xs leading-relaxed text-white/60">
              {slides[activeIndex]!.alt}
            </p>
            <div className="flex justify-center pb-6">
              <ChevronDown className="size-4 text-white/40" aria-hidden />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
});
