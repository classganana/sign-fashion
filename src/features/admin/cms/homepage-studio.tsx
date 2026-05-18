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

import { Button } from "@/components/ui/button";
import { homepageSectionsFileSchema } from "@/lib/schemas/cms-layout";

import type { HomepageSectionEnvelope } from "@/features/admin/cms/admin-cms-types";
import { HOMEPAGE_SECTION_TYPE_OPTIONS, createBlankHomepageSection } from "@/features/admin/cms/homepage-blanks";
import type { CapsuleLite } from "@/features/admin/cms/homepage-section-fields";
import { HomepageSectionFields } from "@/features/admin/cms/homepage-section-fields";
import type { CatalogLiteItem } from "@/features/admin/cms/product-slug-picker";

const SECTION_LABEL: Record<string, string> = Object.fromEntries(HOMEPAGE_SECTION_TYPE_OPTIONS.map((o) => [o.value, o.label]));

function previewSrc(section: HomepageSectionEnvelope): string | null {
  switch (section.type) {
    case "hero":
    case "brand-story":
      return section.image ?? null;
    case "collections-featured":
      return section.items[0]?.image ?? null;
    case "social-gallery":
      return section.posts[0]?.image ?? null;
    case "editorial-grid":
      return section.items[0]?.image ?? null;
    default:
      return null;
  }
}

function headline(section: HomepageSectionEnvelope): string {
  switch (section.type) {
    case "hero":
      return section.title;
    case "statement":
      return section.quote.trim() ? section.quote.slice(0, 80) : "Statement";
    default:
      if ("headline" in section) {
        const h = section.headline;
        if (typeof h === "string" && h.trim()) return h;
      }
      return SECTION_LABEL[section.type] ?? section.type;
  }
}

function SortableSectionCard({
  section,
  expanded,
  onToggleExpand,
  onToggleVisibility,
  onRemove,
  children,
}: {
  section: HomepageSectionEnvelope;
  expanded: boolean;
  onToggleExpand: () => void;
  onToggleVisibility: () => void;
  onRemove: () => void;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.85 : 1,
  };

  const thumb = previewSrc(section);
  const visible = !section.disabled;

  return (
    <article ref={setNodeRef} style={style} className="border-border overflow-hidden rounded-2xl border bg-white/[0.03] shadow-sm">
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
        <button
          type="button"
          className="text-muted-foreground cursor-grab touch-none rounded-md border border-white/10 px-2 py-3 text-xs active:cursor-grabbing"
          {...attributes}
          {...listeners}
          aria-label="Drag to reorder"
        >
          ⋮⋮
        </button>
        <div className="border-border relative h-16 w-full shrink-0 overflow-hidden rounded-xl border bg-black/40 sm:h-20 sm:w-28">
          {thumb ?
            // eslint-disable-next-line @next/next/no-img-element
            <img src={thumb} alt="" className="size-full object-cover" />
          : <div className="text-muted-foreground flex size-full items-center justify-center text-[0.65rem] uppercase">Preview</div>}
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          <p className="text-[0.65rem] uppercase tracking-wide text-blue-300/90">{SECTION_LABEL[section.type] ?? section.type}</p>
          <h3 className="truncate text-lg font-medium text-zinc-50">{headline(section)}</h3>
          <p className="text-muted-foreground truncate text-xs">Block id · {section.id}</p>
        </div>
        <div className="flex flex-wrap gap-2 sm:flex-col sm:items-end">
          <label className="flex cursor-pointer items-center gap-2 text-xs text-zinc-300">
            <input type="checkbox" checked={visible} onChange={onToggleVisibility} className="accent-emerald-400" />
            Visible on storefront
          </label>
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onToggleExpand}>
              {expanded ? "Collapse" : "Edit"}
            </Button>
            <Button type="button" variant="ghost" size="sm" className="text-destructive" onClick={onRemove}>
              Remove
            </Button>
          </div>
        </div>
      </div>
      {expanded && <div className="border-border border-t bg-black/20 p-5">{children}</div>}
    </article>
  );
}

export function HomepageStudio({
  initialSections,
  catalog,
  capsules,
}: {
  initialSections: HomepageSectionEnvelope[];
  catalog: CatalogLiteItem[];
  capsules: CapsuleLite[];
}) {
  const [sections, setSections] = React.useState<HomepageSectionEnvelope[]>(() =>
    initialSections.map((s, i) => ({ ...s, sortOrder: typeof s.sortOrder === "number" ? s.sortOrder : i })),
  );
  const [openId, setOpenId] = React.useState<string | null>(sections[0]?.id ?? null);
  const [banner, setBanner] = React.useState<{ tone: "ok" | "err"; text: string } | null>(null);
  const [newType, setNewType] = React.useState<(typeof HOMEPAGE_SECTION_TYPE_OPTIONS)[number]["value"]>("hero");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = sections.findIndex((s) => s.id === active.id);
    const newIndex = sections.findIndex((s) => s.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    setSections(arrayMove(sections, oldIndex, newIndex).map((s, i) => ({ ...s, sortOrder: i })));
  }

  async function save() {
    setBanner(null);
    const normalized = sections.map((s, i) => ({
      ...s,
      sortOrder: i,
    }));
    const parsed = homepageSectionsFileSchema.safeParse(normalized);
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      setBanner({
        tone: "err",
        text: first ? `Check “${first.path.join(".")}”: ${first.message}` : "Something still needs attention before publish.",
      });
      return;
    }
    const res = await fetch("/api/admin/homepage", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sections: parsed.data }),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      setBanner({ tone: "err", text: typeof body?.error === "string" ? body.error : "Could not save right now." });
      return;
    }
    setBanner({ tone: "ok", text: "Homepage updated — shoppers will see it on the next refresh." });
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <p className="text-muted-foreground max-w-xl text-sm leading-relaxed">
          Drag blocks to change order, switch off visibility to stage work, then publish when it feels right.
        </p>
        <Button type="button" size="sm" className="shrink-0" onClick={() => void save()}>
          Publish homepage
        </Button>
      </div>

      {banner && (
        <p className={banner.tone === "ok" ? "rounded-lg bg-emerald-500/15 px-4 py-3 text-sm text-emerald-200" : "rounded-lg bg-destructive/15 px-4 py-3 text-sm text-red-200"}>
          {banner.text}
        </p>
      )}

      <div className="border-border flex flex-col gap-3 rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-4 sm:flex-row sm:items-center">
        <select
          value={newType}
          onChange={(e) => setNewType(e.target.value as (typeof newType))}
          className="border-border bg-background h-10 flex-1 rounded-lg border px-3 text-sm"
        >
          {HOMEPAGE_SECTION_TYPE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            const created = createBlankHomepageSection(newType, `${Date.now()}`);
            setSections((prev) => [...prev, { ...created, sortOrder: prev.length }]);
            setOpenId(created.id);
          }}
        >
          Add block
        </Button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-4">
            {sections.map((section, idx) => (
              <SortableSectionCard
                key={section.id}
                section={section}
                expanded={openId === section.id}
                onToggleExpand={() => setOpenId((id) => (id === section.id ? null : section.id))}
                onToggleVisibility={() =>
                  setSections((prev) => prev.map((s, i) => (i === idx ? { ...s, disabled: !s.disabled } : s)))
                }
                onRemove={() => setSections((prev) => prev.filter((s) => s.id !== section.id))}
              >
                <HomepageSectionFields section={section} catalog={catalog} capsules={capsules} onChange={(next) => setSections((prev) => prev.map((s, i) => (i === idx ? next : s)))} />
              </SortableSectionCard>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {sections.length === 0 ?
        <div className="border-border rounded-2xl border border-dashed px-8 py-16 text-center">
          <p className="text-muted-foreground text-sm">Your storefront homepage is empty — add a hero banner to begin.</p>
        </div>
      : null}
    </div>
  );
}
