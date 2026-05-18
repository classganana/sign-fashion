"use client";

import { useRouter } from "next/navigation";
import * as React from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cmsProductPayloadSchema } from "@/lib/schemas/cms-product";
import type { AdminProductEditorModel } from "@/services/cms-product-admin";

import { MediaPickerField, type MediaFieldValue } from "@/features/admin/media/media-picker-field";
import { ChipTokenField } from "@/features/admin/ui/chip-token-field";

type GallerySlide = {
  url: string;
  alt: string;
  cloudinaryPublicId: string;
};

export type GuidedProductFormValues = {
  id: string;
  slug: string;
  name: string;
  description: string;
  priceCents: number;
  currency: "INR";
  tagEmpty: string;
  cloudinaryPublicId: string;
  lowStockThresholdUnits: string;

  categorySlug: string;
  discoverySizes: string[];
  discoveryColors: string[];
  discoveryFits: string[];
  discoveryCollections: string[];
  discoveryTags: string[];
  featuredRank: number;
  trendingRank: number;
  releasedAtMs: number;

  fit: string;
  fabric: string;
  washCare: string;
  styleNotes: string;
  deliveryNotes: string;
  editorialLead: string;
  packagingStory: string;
  returnsComfort: string;
  secureCheckoutHint: string;
  fabricSignal: string;

  hero: MediaFieldValue;
  gallerySlides: GallerySlide[];
  isPublished: boolean;
};

export type AdminProductPayload = import("zod").infer<typeof cmsProductPayloadSchema>;

export function guidedDefaults(payload: AdminProductEditorModel, isPublished: boolean): GuidedProductFormValues {
  const lowSrc =
    typeof payload.lowStockThresholdUnits === "number" && Number.isFinite(payload.lowStockThresholdUnits) ?
      String(payload.lowStockThresholdUnits)
    : "";

  return {
    id: payload.id,
    slug: payload.slug,
    name: payload.name,
    description: payload.description,
    priceCents: payload.priceCents,
    currency: "INR",
    tagEmpty: payload.tag ?? "",
    cloudinaryPublicId: payload.cloudinaryPublicId ?? "",
    lowStockThresholdUnits: lowSrc,

    categorySlug: payload.discovery.categorySlug,
    discoverySizes: [...payload.discovery.sizes],
    discoveryColors: [...payload.discovery.colors],
    discoveryFits: [...payload.discovery.fits],
    discoveryCollections: [...payload.discovery.collections],
    discoveryTags: [...payload.discovery.tags],
    featuredRank: payload.discovery.featuredRank,
    trendingRank: payload.discovery.trendingRank,
    releasedAtMs: payload.discovery.releasedAtMs,

    fit: payload.details.fit,
    fabric: payload.details.fabric,
    washCare: payload.details.washCare,
    styleNotes: payload.details.styleNotes,
    deliveryNotes: payload.details.deliveryNotes,
    editorialLead: payload.details.editorialLead ?? "",
    packagingStory: payload.details.packagingStory ?? "",
    returnsComfort: payload.details.returnsComfort ?? "",
    secureCheckoutHint: payload.details.secureCheckoutHint ?? "",
    fabricSignal: payload.details.fabricSignal ?? "",

    hero: {
      url: payload.image,
      alt: payload.imageAlt,
      cloudinaryPublicId: payload.cloudinaryPublicId ?? "",
    },
    gallerySlides:
      payload.gallery && payload.gallery.length > 0 ?
        payload.gallery.map((g) => ({
          url: g.url,
          alt: g.alt,
          cloudinaryPublicId: g.cloudinaryPublicId ?? "",
        }))
      : [{ url: "", alt: "", cloudinaryPublicId: "" }],
    isPublished,
  };
}

export function assembleProductFromGuided(shape: GuidedProductFormValues): AdminProductPayload {
  const tagRaw = shape.tagEmpty.trim();
  const tag =
    tagRaw === "new" || tagRaw === "limited" || tagRaw === "bestseller" ? tagRaw : undefined;

  let low: number | undefined;
  const lowRaw = shape.lowStockThresholdUnits.trim();
  if (lowRaw === "") low = undefined;
  else {
    const parsed = Number.parseInt(lowRaw, 10);
    low = Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
  }

  const galleryClean = shape.gallerySlides
    .map((row) => ({
      url: row.url.trim(),
      alt: row.alt.trim(),
      cloudinaryPublicId: row.cloudinaryPublicId.trim() || undefined,
    }))
    .filter((row) => row.url.length > 4 && row.alt.length > 0);

  const cloudFromHero = shape.hero.cloudinaryPublicId.trim();
  const cloudManual = shape.cloudinaryPublicId.trim();
  const cloudPick = cloudFromHero || cloudManual || undefined;

  const base: AdminProductPayload = {
    id: shape.id.trim(),
    slug: shape.slug.trim(),
    name: shape.name.trim(),
    description: shape.description.trim(),
    priceCents: Number(shape.priceCents),
    currency: "INR",
    image: shape.hero.url.trim(),
    imageAlt: shape.hero.alt.trim(),
    ...(cloudPick ? { cloudinaryPublicId: cloudPick } : {}),
    ...(low !== undefined ? { lowStockThresholdUnits: low } : {}),
    ...(tag ? { tag } : {}),
    discovery: {
      categorySlug: shape.categorySlug.trim(),
      sizes: shape.discoverySizes,
      colors: shape.discoveryColors,
      fits: shape.discoveryFits.length ? shape.discoveryFits : ["standard"],
      collections: shape.discoveryCollections,
      tags: shape.discoveryTags,
      featuredRank: Number(shape.featuredRank),
      trendingRank: Number(shape.trendingRank),
      releasedAtMs: Number(shape.releasedAtMs),
    },
    details: {
      fit: shape.fit.trim(),
      fabric: shape.fabric.trim(),
      washCare: shape.washCare.trim(),
      styleNotes: shape.styleNotes.trim(),
      deliveryNotes: shape.deliveryNotes.trim(),
      ...(shape.editorialLead.trim() ? { editorialLead: shape.editorialLead.trim() } : {}),
      ...(shape.packagingStory.trim() ? { packagingStory: shape.packagingStory.trim() } : {}),
      ...(shape.returnsComfort.trim() ? { returnsComfort: shape.returnsComfort.trim() } : {}),
      ...(shape.secureCheckoutHint.trim() ? { secureCheckoutHint: shape.secureCheckoutHint.trim() } : {}),
      ...(shape.fabricSignal.trim() ? { fabricSignal: shape.fabricSignal.trim() } : {}),
    },
    ...(galleryClean.length ? { gallery: galleryClean.map((s) => (s.cloudinaryPublicId ? s : { url: s.url, alt: s.alt })) } : {}),
  };

  return base;
}

const fieldClass =
  "border-border bg-background placeholder:text-muted-foreground focus-visible:ring-ring rounded-lg border px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 md:text-[0.9rem]";

const SIZE_PRESETS = ["XS", "S", "M", "L", "XL", "XXL"];
const FIT_PRESETS = ["Relaxed", "Slim", "Oversized", "Tailored"];

export function AdminProductEditor(props: {
  routeSlug: string;
  initialPayload: AdminProductEditorModel;
  initialPublished: boolean;
  warning?: string;
  capsules: { slug: string; title: string }[];
}) {
  const router = useRouter();
  const [banner, setBanner] = React.useState<{ tone: "ok" | "err"; text: string } | null>(null);

  const form = useForm<GuidedProductFormValues>({
    defaultValues: guidedDefaults(props.initialPayload, props.initialPublished),
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "gallerySlides",
  });

  React.useEffect(() => {
    form.reset(guidedDefaults(props.initialPayload, props.initialPublished));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional slug navigation reset
  }, [props.routeSlug]);

  async function persistPayload(payload: AdminProductPayload, published: boolean) {
    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ payload, isPublished: published }),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      setBanner({ tone: "err", text: typeof body?.error === "string" ? body.error : "Could not save yet." });
      return;
    }
    const nextSlug = typeof body.slug === "string" ? body.slug : payload.slug;
    setBanner({ tone: "ok", text: "Saved — shoppers will see updates after refresh." });
    router.replace(`/admin/products/${encodeURIComponent(nextSlug)}`);
    router.refresh();
  }

  async function onSave() {
    setBanner(null);
    const values = form.getValues();
    if (!values.discoverySizes.length) {
      setBanner({ tone: "err", text: "Add at least one size chip." });
      return;
    }
    if (!values.discoveryCollections.length) {
      setBanner({ tone: "err", text: "Assign this piece to at least one capsule." });
      return;
    }

    try {
      const assembled = assembleProductFromGuided(values);
      const parsed = cmsProductPayloadSchema.safeParse(assembled);
      if (!parsed.success) {
        const first = parsed.error.issues[0];
        setBanner({
          tone: "err",
          text: first ? `${first.path.join(".") || "Field"}: ${first.message}` : "Please review highlighted fields.",
        });
        return;
      }
      await persistPayload(parsed.data, values.isPublished);
    } catch (err) {
      setBanner({ tone: "err", text: err instanceof Error ? err.message : "Something went wrong." });
    }
  }

  async function removeOverlay() {
    if (!confirm("Undo capsule overrides for this piece and restore catalogue defaults?")) return;
    const target = form.getValues("slug").trim() || props.routeSlug;
    const res = await fetch(`/api/admin/products/${encodeURIComponent(target)}`, { method: "DELETE" });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      setBanner({ tone: "err", text: typeof body?.error === "string" ? body.error : "Could not reset." });
      return;
    }
    router.refresh();
    setBanner({ tone: "ok", text: "Restored catalogue defaults." });
  }

  const discoveryCollections = form.watch("discoveryCollections");

  return (
    <div className="space-y-8">
      {props.warning && <p className="rounded-lg bg-destructive/15 px-4 py-3 text-sm text-red-100">{props.warning}</p>}

      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-transparent p-6 text-sm leading-relaxed text-zinc-200">
        <p className="font-medium text-white">Editing playbook</p>
        <ul className="text-muted-foreground mt-3 list-inside list-disc space-y-2">
          <li>Lead with imagery — uploads stream straight into your studio library.</li>
          <li>Tap capsule shortcuts to attach drops instantly.</li>
          <li>Higher spotlight scores lift pieces inside curated rails.</li>
          <li>Toggle visibility only when this SKU should appear live.</li>
        </ul>
      </div>

      <div className="flex flex-wrap items-center gap-4 border-b border-white/10 pb-6">
        <label className="flex cursor-pointer items-center gap-2 text-sm text-white">
          <input type="checkbox" className="accent-emerald-400" {...form.register("isPublished")} />
          Visible on storefront
        </label>
      </div>

      <form
        className="space-y-12"
        onSubmit={(e) => {
          e.preventDefault();
          void onSave();
        }}
      >
        <section className="space-y-6">
          <header>
            <p className="text-[0.65rem] uppercase tracking-[0.3em] text-zinc-500">Essentials</p>
            <h2 className="font-display text-2xl text-white">Identity & commerce</h2>
          </header>
          <div className="grid gap-6 md:grid-cols-2">
            <Field label="Internal SKU code" hint="Matches receipts & fulfilment tooling">
              <Input className={fieldClass} {...form.register("id")} />
            </Field>
            <Field label="Storefront URL ending" hint="Lowercase · hyphens · no spaces">
              <Input className={fieldClass} {...form.register("slug")} />
            </Field>
          </div>
          <Field label="Piece name">
            <Input className={fieldClass} {...form.register("name")} />
          </Field>
          <Field label="Elevator pitch" hint="Shown beside imagery above the fold">
            <textarea rows={4} className={`${fieldClass} w-full resize-y font-sans`} {...form.register("description")} />
          </Field>
          <div className="grid gap-6 md:grid-cols-3">
            <Field label={`Investment (paise · ${"\u20B9"})`} hint="Example · ₹4499 → 449900">
              <Input type="number" className={fieldClass} {...form.register("priceCents", { valueAsNumber: true })} />
            </Field>
            <Field label="Merchandising badge">
              <select className={fieldClass} {...form.register("tagEmpty")}>
                <option value="">None</option>
                <option value="new">New</option>
                <option value="limited">Limited</option>
                <option value="bestseller">Bestseller</option>
              </select>
            </Field>
            <Field label="Stock reminder (optional)" hint="Internal flag · shoppers never see this yet">
              <Input className={fieldClass} {...form.register("lowStockThresholdUnits")} placeholder="Units before alert" />
            </Field>
          </div>
        </section>

        <section className="space-y-6">
          <header>
            <p className="text-[0.65rem] uppercase tracking-[0.3em] text-zinc-500">Imagery</p>
            <h2 className="font-display text-2xl text-white">Gallery hero</h2>
          </header>
          <Controller
            control={form.control}
            name="hero"
            render={({ field }) => (
              <MediaPickerField
                label="Primary visual"
                hint="Defines PDP hero & shopping cards."
                value={field.value}
                onChange={(next) => {
                  field.onChange(next);
                  form.setValue("cloudinaryPublicId", next.cloudinaryPublicId ?? "");
                }}
              />
            )}
          />
          <input type="hidden" {...form.register("cloudinaryPublicId")} />

          <div className="space-y-4">
            <header className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[0.65rem] uppercase tracking-[0.3em] text-zinc-500">Carousel stills</p>
                <h3 className="text-lg text-white">Alternate angles</h3>
              </div>
              <Button type="button" variant="secondary" size="sm" onClick={() => append({ url: "", alt: "", cloudinaryPublicId: "" })}>
                Add slide
              </Button>
            </header>
            {fields.map((row, idx) => (
              <Controller
                key={row.id}
                control={form.control}
                name={`gallerySlides.${idx}`}
                render={({ field }) => (
                  <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                    <MediaPickerField label={`Slide ${idx + 1}`} value={field.value} onChange={field.onChange} />
                    <Button type="button" variant="ghost" size="sm" className="mt-3 text-destructive" disabled={fields.length <= 1} onClick={() => remove(idx)}>
                      Remove slide
                    </Button>
                  </div>
                )}
              />
            ))}
          </div>
        </section>

        <section className="space-y-8">
          <header>
            <p className="text-[0.65rem] uppercase tracking-[0.3em] text-zinc-500">Merchandising signals</p>
            <h2 className="font-display text-2xl text-white">Discovery & spotlight</h2>
          </header>
          <Field label="Browse category tag">
            <Input className={fieldClass} placeholder="Knitwear · tees · outerwear" {...form.register("categorySlug")} />
          </Field>

          <Controller
            control={form.control}
            name="discoverySizes"
            render={({ field }) => (
              <ChipTokenField label="Run sizes" hint="Tap presets or type bespoke grades." values={field.value} onChange={field.onChange} presets={SIZE_PRESETS} />
            )}
          />
          <Controller
            control={form.control}
            name="discoveryColors"
            render={({ field }) => <ChipTokenField label="Colour stories" values={field.value} onChange={field.onChange} />}
          />
          <Controller
            control={form.control}
            name="discoveryFits"
            render={({ field }) => (
              <ChipTokenField label="Fit posture" hint="Communicates silhouette expectations." values={field.value} onChange={field.onChange} presets={FIT_PRESETS} />
            )}
          />
          <Controller
            control={form.control}
            name="discoveryTags"
            render={({ field }) => (
              <ChipTokenField label="Story filters" hint="Keywords powering curated rails." values={field.value} onChange={field.onChange} />
            )}
          />

          <div>
          <Controller
            control={form.control}
            name="discoveryCollections"
            render={({ field }) => (
              <ChipTokenField label="Capsules" hint="Defines which drops claim this SKU." values={field.value} onChange={field.onChange} />
            )}
          />
            <div className="mt-3 flex flex-wrap gap-2">
              {props.capsules.map((cap) => (
                <Button
                  key={cap.slug}
                  type="button"
                  variant="outline"
                  size="xs"
                  disabled={discoveryCollections.includes(cap.slug)}
                  onClick={() => {
                    const cur = form.getValues("discoveryCollections");
                    if (!cur.includes(cap.slug)) form.setValue("discoveryCollections", [...cur, cap.slug]);
                  }}
                >
                  + {cap.title}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Field label="Spotlight priority" hint="Higher surfaces sooner in hero rails">
              <Input type="number" className={fieldClass} {...form.register("featuredRank", { valueAsNumber: true })} />
            </Field>
            <Field label="Momentum score" hint="Signals velocity placements">
              <Input type="number" className={fieldClass} {...form.register("trendingRank", { valueAsNumber: true })} />
            </Field>
            <Field label="Freshness marker" hint="Unix milliseconds · newer sorts ahead">
              <Input type="number" className={fieldClass} {...form.register("releasedAtMs", { valueAsNumber: true })} />
            </Field>
          </div>
        </section>

        <section className="space-y-6">
          <header>
            <p className="text-[0.65rem] uppercase tracking-[0.3em] text-zinc-500">Editorial PDP</p>
            <h2 className="font-display text-2xl text-white">Craft storytelling</h2>
          </header>
          <div className="grid gap-6 md:grid-cols-2">
            <Field label="Fit reassurance">
              <textarea rows={4} className={`${fieldClass} w-full`} {...form.register("fit")} />
            </Field>
            <Field label="Fabric composition">
              <textarea rows={4} className={`${fieldClass} w-full`} {...form.register("fabric")} />
            </Field>
          </div>
          <Field label="Wash rituals">
            <textarea rows={3} className={`${fieldClass} w-full`} {...form.register("washCare")} />
          </Field>
          <Field label="Styling cues">
            <textarea rows={3} className={`${fieldClass} w-full`} {...form.register("styleNotes")} />
          </Field>
          <Field label="Delivery narrative">
            <textarea rows={3} className={`${fieldClass} w-full`} {...form.register("deliveryNotes")} />
          </Field>
          <div className="grid gap-6 md:grid-cols-2">
            <Field label="Opening essay">
              <textarea rows={3} className={`${fieldClass} w-full`} {...form.register("editorialLead")} />
            </Field>
            <Field label="Unboxing romance">
              <textarea rows={3} className={`${fieldClass} w-full`} {...form.register("packagingStory")} />
            </Field>
            <Field label="Trust promise">
              <textarea rows={3} className={`${fieldClass} w-full`} {...form.register("returnsComfort")} />
            </Field>
            <Field label="Checkout reassurance">
              <textarea rows={3} className={`${fieldClass} w-full`} {...form.register("secureCheckoutHint")} />
            </Field>
          </div>
          <Field label="Fabric callout badge">
            <Input className={fieldClass} {...form.register("fabricSignal")} />
          </Field>
        </section>

        {banner && (
          <p className={banner.tone === "ok" ? "text-sm text-emerald-300" : "text-sm text-red-300"}>{banner.text}</p>
        )}

        <div className="flex flex-wrap gap-3 pt-4">
          <Button type="submit" size="lg">
            Publish piece
          </Button>
          <Button type="button" variant="outline" size="lg" onClick={() => void removeOverlay()}>
            Reset catalogue defaults
          </Button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <div>
        <p className="text-muted-foreground text-[0.7rem] font-semibold uppercase tracking-wide">{label}</p>
        {hint && <p className="text-muted-foreground/90 mt-1 text-xs">{hint}</p>}
      </div>
      {children}
    </div>
  );
}
