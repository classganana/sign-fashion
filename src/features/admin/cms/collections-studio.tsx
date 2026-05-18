"use client";

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  type DragEndEvent,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import * as React from "react";

import type { CollectionConfig } from "@/config/collections";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { collectionsBundleSchema } from "@/lib/schemas/cms-layout";

import { MediaPickerField, type MediaFieldValue } from "@/features/admin/media/media-picker-field";

import type { CatalogLiteItem } from "./product-slug-picker";
import { ProductSlugPicker } from "./product-slug-picker";

const inp =
  "border-border bg-background focus-visible:ring-ring h-10 w-full rounded-lg border px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-2";

const TONES: { value: CollectionConfig["tone"]; label: string }[] = [
  { value: "mono", label: "Mono (cool contrast)" },
  { value: "ember", label: "Ember (warm light)" },
  { value: "midnight", label: "Midnight (deep mood)" },
];

function SortableCapsuleCard({
  collection,
  expanded,
  onToggle,
  onRemove,
  children,
}: {
  collection: CollectionConfig;
  expanded: boolean;
  onToggle: () => void;
  onRemove: () => void;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: collection.slug });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.88 : 1,
  };

  return (
    <article ref={setNodeRef} style={style} className="border-border overflow-hidden rounded-2xl border bg-white/[0.03]">
      <div className="flex flex-col gap-4 p-4 md:flex-row md:items-center">
        <button
          type="button"
          className="text-muted-foreground cursor-grab rounded-md border border-white/10 px-2 py-3 text-xs touch-none active:cursor-grabbing"
          {...attributes}
          {...listeners}
          aria-label="Drag to reorder capsules"
        >
          ⋮⋮
        </button>
        <div className="border-border relative h-20 w-full shrink-0 overflow-hidden rounded-xl border md:h-24 md:w-36">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={collection.heroImage} alt="" className="size-full object-cover" />
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          <p className="text-[0.65rem] uppercase tracking-wide text-rose-200/90">Capsule</p>
          <h3 className="truncate text-xl font-medium text-white">{collection.title}</h3>
          <p className="text-muted-foreground truncate font-mono text-xs">{collection.slug}</p>
        </div>
        <div className="flex gap-2 md:flex-col md:items-end">
          <Button type="button" variant="outline" size="sm" onClick={onToggle}>
            {expanded ? "Close" : "Edit campaign"}
          </Button>
          <Button type="button" variant="ghost" size="sm" className="text-destructive" onClick={onRemove}>
            Archive capsule
          </Button>
        </div>
      </div>
      {expanded && <div className="border-border border-t bg-black/25 p-6">{children}</div>}
    </article>
  );
}

export function CollectionsStudio({
  initialCollections,
  catalog,
}: {
  initialCollections: CollectionConfig[];
  catalog: CatalogLiteItem[];
}) {
  const [rows, setRows] = React.useState<CollectionConfig[]>(() => [...initialCollections]);
  const [openSlug, setOpenSlug] = React.useState<string | null>(initialCollections[0]?.slug ?? null);
  const [banner, setBanner] = React.useState<{ tone: "ok" | "err"; text: string } | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const a = rows.findIndex((r) => r.slug === active.id);
    const b = rows.findIndex((r) => r.slug === over.id);
    if (a < 0 || b < 0) return;
    setRows(arrayMove(rows, a, b));
  }

  function updateAt(idx: number, next: CollectionConfig) {
    setRows((prev) => prev.map((row, i) => (i === idx ? next : row)));
  }

  async function save() {
    setBanner(null);
    const sanitized = rows.map((r) => {
      const copy = { ...r };
      if (!copy.storyImage?.trim()) {
        delete copy.storyImage;
        delete copy.storyImageAlt;
      }
      const b = copy.storyBeats;
      if (!b?.[0]?.trim() || !b?.[1]?.trim()) delete copy.storyBeats;
      else copy.storyBeats = [b[0].trim(), b[1].trim()];
      return copy;
    });
    const parsed = collectionsBundleSchema.safeParse(sanitized);
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      setBanner({
        tone: "err",
        text: first ? `Check “${first.path.join(".")}”: ${first.message}` : "Still a few fields to polish.",
      });
      return;
    }
    const res = await fetch("/api/admin/collections", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ collections: parsed.data }),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      setBanner({ tone: "err", text: typeof body?.error === "string" ? body.error : "Could not save." });
      return;
    }
    setBanner({ tone: "ok", text: "Capsules updated — storefront reflects changes on refresh." });
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <p className="text-muted-foreground max-w-xl text-sm leading-relaxed">
          Reorder drops, refresh art direction, and curate the pieces that belong in each capsule — all in one flow.
        </p>
        <Button type="button" size="sm" onClick={() => void save()}>
          Publish capsules
        </Button>
      </div>
      {banner && (
        <p className={banner.tone === "ok" ? "rounded-lg bg-emerald-500/15 px-4 py-3 text-sm text-emerald-200" : "rounded-lg bg-destructive/15 px-4 py-3 text-sm text-red-200"}>
          {banner.text}
        </p>
      )}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={rows.map((r) => r.slug)} strategy={verticalListSortingStrategy}>
          <div className="space-y-4">
            {rows.map((row, idx) => {
              const hero: MediaFieldValue = { url: row.heroImage, alt: row.heroAlt, cloudinaryPublicId: "" };
              const story: MediaFieldValue = { url: row.storyImage ?? "", alt: row.storyImageAlt ?? "", cloudinaryPublicId: "" };
              const beat0 = row.storyBeats?.[0] ?? "";
              const beat1 = row.storyBeats?.[1] ?? "";

              return (
                <SortableCapsuleCard
                  key={row.slug}
                  collection={row}
                  expanded={openSlug === row.slug}
                  onToggle={() => setOpenSlug((s) => (s === row.slug ? null : row.slug))}
                  onRemove={() => {
                    if (!confirm(`Remove “${row.title}” from this workspace? It will disappear from navigation until restored.`)) return;
                    setRows((prev) => prev.filter((r) => r.slug !== row.slug));
                  }}
                >
                  <div className="mx-auto max-w-3xl space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="md:col-span-2">
                        <p className="text-muted-foreground mb-1 text-[0.65rem] uppercase">Public URL slug</p>
                        <Input className={`${inp} bg-white/5`} value={row.slug} disabled />
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-muted-foreground mb-1 text-[0.65rem] uppercase">Campaign title</p>
                        <Input className={inp} value={row.title} onChange={(e) => updateAt(idx, { ...row, title: e.target.value })} />
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-muted-foreground mb-1 text-[0.65rem] uppercase">Opening story</p>
                        <textarea className={`${inp} min-h-[120px] resize-y py-2`} value={row.description} onChange={(e) => updateAt(idx, { ...row, description: e.target.value })} />
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1 text-[0.65rem] uppercase">Visual mood</p>
                        <select className={inp} value={row.tone} onChange={(e) => updateAt(idx, { ...row, tone: e.target.value as CollectionConfig["tone"] })}>
                          {TONES.map((t) => (
                            <option key={t.value} value={t.value}>
                              {t.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <MediaPickerField
                      label="Cover image"
                      hint="Hero treatment shoppers feel first."
                      value={hero}
                      onChange={(m) => updateAt(idx, { ...row, heroImage: m.url, heroAlt: m.alt })}
                    />

                    <MediaPickerField
                      label="Secondary frame (optional)"
                      hint="Adds depth on capsule storytelling layouts."
                      value={story}
                      onChange={(m) =>
                        updateAt(idx, {
                          ...row,
                          storyImage: m.url || undefined,
                          storyImageAlt: m.alt || undefined,
                        })
                      }
                    />

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <p className="text-muted-foreground mb-1 text-[0.65rem] uppercase">Story beat one</p>
                        <textarea className={`${inp} min-h-[72px]`} value={beat0} onChange={(e) => updateAt(idx, { ...row, storyBeats: [e.target.value, beat1] })} />
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1 text-[0.65rem] uppercase">Story beat two</p>
                        <textarea className={`${inp} min-h-[72px]`} value={beat1} onChange={(e) => updateAt(idx, { ...row, storyBeats: [beat0, e.target.value] })} />
                      </div>
                    </div>

                    <ProductSlugPicker
                      catalog={catalog}
                      selectedSlugs={row.productSlugs}
                      onChange={(slugs) => updateAt(idx, { ...row, productSlugs: slugs })}
                      label="Pieces inside this capsule"
                      hint="Drag order with arrows — matches merchandising priorities."
                    />
                  </div>
                </SortableCapsuleCard>
              );
            })}
          </div>
        </SortableContext>
      </DndContext>

      {rows.length === 0 ?
        <div className="border-border rounded-2xl border border-dashed px-8 py-16 text-center text-sm text-zinc-400">No capsules yet — restore defaults from engineering if this was unintended.</div>
      : null}
    </div>
  );
}
