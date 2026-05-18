"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import type { HomepageSectionEnvelope } from "@/features/admin/cms/admin-cms-types";
import { MediaPickerField, type MediaFieldValue } from "@/features/admin/media/media-picker-field";

import type { CatalogLiteItem } from "./product-slug-picker";
import { ProductSlugPicker } from "./product-slug-picker";

const inp =
  "border-border bg-background placeholder:text-muted-foreground focus-visible:ring-ring h-10 w-full rounded-lg border px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-2";

function MiniLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-muted-foreground mb-1 text-[0.65rem] uppercase tracking-wide">{children}</p>;
}

export type CapsuleLite = { slug: string; title: string; heroImage: string; heroAlt?: string };

export function HomepageSectionFields({
  section,
  onChange,
  catalog,
  capsules,
}: {
  section: HomepageSectionEnvelope;
  onChange: (next: HomepageSectionEnvelope) => void;
  catalog: CatalogLiteItem[];
  capsules: CapsuleLite[];
}) {
  switch (section.type) {
    case "hero": {
      const s = section;
      const media: MediaFieldValue = {
        url: s.image,
        alt: s.imageAlt,
        cloudinaryPublicId: "",
      };
      return (
        <div className="space-y-4">
          <MediaPickerField
            label="Banner image"
            hint="Shown full-width at the top of your storefront."
            value={media}
            onChange={(m) =>
              onChange({
                ...s,
                image: m.url,
                imageAlt: m.alt,
              })
            }
          />
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <MiniLabel>Eyebrow line</MiniLabel>
              <Input className={inp} value={s.eyebrow ?? ""} onChange={(e) => onChange({ ...s, eyebrow: e.target.value })} />
            </div>
            <div />
            <div className="md:col-span-2">
              <MiniLabel>Headline</MiniLabel>
              <Input className={inp} value={s.title} onChange={(e) => onChange({ ...s, title: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <MiniLabel>Supporting copy</MiniLabel>
              <textarea className={`${inp} min-h-[88px] resize-y py-2`} value={s.subtitle ?? ""} onChange={(e) => onChange({ ...s, subtitle: e.target.value })} />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <MiniLabel>Primary button label</MiniLabel>
              <Input
                className={inp}
                value={s.primaryCta?.label ?? ""}
                onChange={(e) =>
                  onChange({
                    ...s,
                    primaryCta: {
                      label: e.target.value,
                      href: s.primaryCta?.href ?? "/products",
                    },
                  })
                }
              />
            </div>
            <div>
              <MiniLabel>Primary button link</MiniLabel>
              <Input
                className={inp}
                value={s.primaryCta?.href ?? ""}
                onChange={(e) =>
                  onChange({
                    ...s,
                    primaryCta: {
                      label: s.primaryCta?.label ?? "Shop now",
                      href: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div>
              <MiniLabel>Secondary button label</MiniLabel>
              <Input
                className={inp}
                value={s.secondaryCta?.label ?? ""}
                onChange={(e) =>
                  onChange({
                    ...s,
                    secondaryCta: {
                      label: e.target.value,
                      href: s.secondaryCta?.href ?? "/collections",
                    },
                  })
                }
              />
            </div>
            <div>
              <MiniLabel>Secondary button link</MiniLabel>
              <Input
                className={inp}
                value={s.secondaryCta?.href ?? ""}
                onChange={(e) =>
                  onChange({
                    ...s,
                    secondaryCta: {
                      label: s.secondaryCta?.label ?? "",
                      href: e.target.value,
                    },
                  })
                }
              />
            </div>
          </div>
        </div>
      );
    }
    case "product-grid":
    case "product-slider":
    case "category-showcase": {
      const s = section;
      const sectionCta =
        s.type === "product-grid" || s.type === "category-showcase" ? s.cta : undefined;
      const slugs = s.productSlugs ?? [];
      return (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <MiniLabel>Eyebrow</MiniLabel>
              <Input className={inp} value={s.eyebrow ?? ""} onChange={(e) => onChange({ ...s, eyebrow: e.target.value })} />
            </div>
            <div />
            <div className="md:col-span-2">
              <MiniLabel>Heading</MiniLabel>
              <Input className={inp} value={s.headline} onChange={(e) => onChange({ ...s, headline: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <MiniLabel>Supporting line</MiniLabel>
              <textarea className={`${inp} min-h-[72px] resize-y py-2`} value={s.subline ?? ""} onChange={(e) => onChange({ ...s, subline: e.target.value })} />
            </div>
          </div>
          {sectionCta ?
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <MiniLabel>Button label</MiniLabel>
                <Input
                  className={inp}
                  value={sectionCta.label}
                  onChange={(e) => {
                    const next = { ...sectionCta, label: e.target.value, href: sectionCta.href };
                    if (s.type === "product-grid") onChange({ ...s, cta: next });
                    else if (s.type === "category-showcase") onChange({ ...s, cta: next });
                  }}
                />
              </div>
              <div>
                <MiniLabel>Button link</MiniLabel>
                <Input
                  className={inp}
                  value={sectionCta.href}
                  onChange={(e) => {
                    const next = { ...sectionCta, label: sectionCta.label, href: e.target.value };
                    if (s.type === "product-grid") onChange({ ...s, cta: next });
                    else if (s.type === "category-showcase") onChange({ ...s, cta: next });
                  }}
                />
              </div>
            </div>
          : null}
          <ProductSlugPicker
            catalog={catalog}
            selectedSlugs={slugs}
            onChange={(next) => onChange({ ...s, productSlugs: next })}
            label="Pieces in this block"
            hint="Search your catalogue — order controls how they appear left-to-right."
          />
        </div>
      );
    }
    case "product-rail": {
      const s = section;
      const slugs = s.productSlugs ?? [];
      return (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <MiniLabel>Heading</MiniLabel>
              <Input className={inp} value={s.headline} onChange={(e) => onChange({ ...s, headline: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <MiniLabel>Supporting line</MiniLabel>
              <textarea className={`${inp} min-h-[72px] resize-y py-2`} value={s.subline ?? ""} onChange={(e) => onChange({ ...s, subline: e.target.value })} />
            </div>
          </div>
          <ProductSlugPicker
            catalog={catalog}
            selectedSlugs={slugs}
            onChange={(next) => onChange({ ...s, productSlugs: next })}
            label="Pieces in this rail"
            hint="Search your catalogue — order controls left-to-right."
          />
        </div>
      );
    }
    case "collections-featured": {
      const s = section;
      return (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <MiniLabel>Eyebrow</MiniLabel>
              <Input className={inp} value={s.eyebrow ?? ""} onChange={(e) => onChange({ ...s, eyebrow: e.target.value })} />
            </div>
            <div />
            <div className="md:col-span-2">
              <MiniLabel>Heading</MiniLabel>
              <Input className={inp} value={s.headline} onChange={(e) => onChange({ ...s, headline: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <MiniLabel>Supporting line</MiniLabel>
              <textarea className={`${inp} min-h-[72px] resize-y py-2`} value={s.subline ?? ""} onChange={(e) => onChange({ ...s, subline: e.target.value })} />
            </div>
          </div>
          <CapsuleRows capsules={capsules} items={s.items} onChange={(items) => onChange({ ...s, items })} />
        </div>
      );
    }
    case "brand-story": {
      const s = section;
      const media: MediaFieldValue = { url: s.image, alt: s.imageAlt, cloudinaryPublicId: "" };
      return (
        <div className="space-y-4">
          <MediaPickerField label="Supporting visual" value={media} onChange={(m) => onChange({ ...s, image: m.url, imageAlt: m.alt })} />
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <MiniLabel>Eyebrow</MiniLabel>
              <Input className={inp} value={s.eyebrow ?? ""} onChange={(e) => onChange({ ...s, eyebrow: e.target.value })} />
            </div>
            <div />
            <div className="md:col-span-2">
              <MiniLabel>Headline</MiniLabel>
              <Input className={inp} value={s.headline} onChange={(e) => onChange({ ...s, headline: e.target.value })} />
            </div>
          </div>
          <div>
            <MiniLabel>Story paragraphs (one per line)</MiniLabel>
            <textarea
              className={`${inp} min-h-[140px] resize-y py-2 font-sans`}
              value={s.body.join("\n")}
              onChange={(e) => onChange({ ...s, body: e.target.value.split("\n").map((x) => x.trim()).filter(Boolean) })}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <MiniLabel>Button label</MiniLabel>
              <Input className={inp} value={s.cta?.label ?? ""} onChange={(e) => onChange({ ...s, cta: { label: e.target.value, href: s.cta?.href ?? "/about" } })} />
            </div>
            <div>
              <MiniLabel>Button link</MiniLabel>
              <Input className={inp} value={s.cta?.href ?? ""} onChange={(e) => onChange({ ...s, cta: { label: s.cta?.label ?? "Read more", href: e.target.value } })} />
            </div>
          </div>
        </div>
      );
    }
    case "social-gallery": {
      const s = section;
      return (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <MiniLabel>Heading</MiniLabel>
              <Input className={inp} value={s.headline ?? ""} onChange={(e) => onChange({ ...s, headline: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <MiniLabel>Supporting line</MiniLabel>
              <Input className={inp} value={s.subline ?? ""} onChange={(e) => onChange({ ...s, subline: e.target.value })} />
            </div>
            <div>
              <MiniLabel>Social handle</MiniLabel>
              <Input className={inp} value={s.username} onChange={(e) => onChange({ ...s, username: e.target.value })} />
            </div>
            <div>
              <MiniLabel>Profile link (optional)</MiniLabel>
              <Input className={inp} value={s.profileHref ?? ""} onChange={(e) => onChange({ ...s, profileHref: e.target.value || undefined })} />
            </div>
          </div>
          <SocialPostsEditor posts={s.posts} onChange={(posts) => onChange({ ...s, posts })} />
        </div>
      );
    }
    case "statement": {
      const s = section;
      return (
        <div className="space-y-4">
          <div>
            <MiniLabel>Quote</MiniLabel>
            <textarea className={`${inp} min-h-[100px] resize-y py-2`} value={s.quote} onChange={(e) => onChange({ ...s, quote: e.target.value })} />
          </div>
          <div>
            <MiniLabel>Attribution</MiniLabel>
            <Input className={inp} value={s.attribution ?? ""} onChange={(e) => onChange({ ...s, attribution: e.target.value })} />
          </div>
        </div>
      );
    }
    case "newsletter": {
      const s = section;
      return (
        <div className="space-y-4">
          <div>
            <MiniLabel>Heading</MiniLabel>
            <Input className={inp} value={s.headline} onChange={(e) => onChange({ ...s, headline: e.target.value })} />
          </div>
          <div>
            <MiniLabel>Supporting line</MiniLabel>
            <textarea className={`${inp} min-h-[72px] resize-y py-2`} value={s.subline ?? ""} onChange={(e) => onChange({ ...s, subline: e.target.value })} />
          </div>
        </div>
      );
    }
    case "editorial-grid": {
      const s = section;
      return (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <MiniLabel>Heading</MiniLabel>
              <Input className={inp} value={s.headline} onChange={(e) => onChange({ ...s, headline: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <MiniLabel>Supporting line</MiniLabel>
              <Input className={inp} value={s.subline ?? ""} onChange={(e) => onChange({ ...s, subline: e.target.value })} />
            </div>
          </div>
          <EditorialItemsEditor items={s.items} onChange={(items) => onChange({ ...s, items })} />
        </div>
      );
    }
    default:
      return (
        <p className="text-muted-foreground text-sm">
          Visual editing for this block type is rolling out — reach out to your studio partner if you need changes today.
        </p>
      );
  }
}

function CapsuleRows({
  capsules,
  items,
  onChange,
}: {
  capsules: CapsuleLite[];
  items: { title: string; description?: string; href: string; image: string; imageAlt: string }[];
  onChange: (items: { title: string; description?: string; href: string; image: string; imageAlt: string }[]) => void;
}) {
  function move(i: number, d: number) {
    const j = i + d;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    const tmp = next[i];
    next[i] = next[j]!;
    next[j] = tmp!;
    onChange(next);
  }

  return (
    <div className="space-y-3">
      <MiniLabel>Featured capsules</MiniLabel>
      {items.map((row, idx) => (
        <div key={`${row.href}-${idx}`} className="border-border space-y-2 rounded-xl border bg-white/[0.02] p-4">
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="xs" disabled={idx === 0} onClick={() => move(idx, -1)}>
              ↑
            </Button>
            <Button type="button" variant="outline" size="xs" disabled={idx === items.length - 1} onClick={() => move(idx, 1)}>
              ↓
            </Button>
            <Button type="button" variant="ghost" size="xs" className="text-destructive" onClick={() => onChange(items.filter((_, k) => k !== idx))}>
              Remove
            </Button>
          </div>
          <MediaPickerField
            label="Tile image"
            value={{ url: row.image, alt: row.imageAlt, cloudinaryPublicId: "" }}
            onChange={(m) => {
              const next = [...items];
              next[idx] = { ...row, image: m.url, imageAlt: m.alt };
              onChange(next);
            }}
          />
          <Input
            className={inp}
            placeholder="Title"
            value={row.title}
            onChange={(e) => {
              const next = [...items];
              next[idx] = { ...row, title: e.target.value };
              onChange(next);
            }}
          />
          <textarea
            className={`${inp} min-h-[60px]`}
            placeholder="Description"
            value={row.description ?? ""}
            onChange={(e) => {
              const next = [...items];
              next[idx] = { ...row, description: e.target.value };
              onChange(next);
            }}
          />
        </div>
      ))}
      <div className="flex flex-wrap gap-2">
        {capsules.map((c) => (
          <Button
            key={c.slug}
            type="button"
            variant="secondary"
            size="xs"
            disabled={items.some((it) => it.href === `/collections/${c.slug}`)}
            onClick={() =>
              onChange([
                ...items,
                {
                  title: c.title,
                  description: "",
                  href: `/collections/${c.slug}`,
                  image: c.heroImage,
                  imageAlt: c.heroAlt ?? c.title,
                },
              ])
            }
          >
            + {c.title}
          </Button>
        ))}
      </div>
    </div>
  );
}

function SocialPostsEditor({
  posts,
  onChange,
}: {
  posts: { image: string; imageAlt: string; href?: string }[];
  onChange: (posts: { image: string; imageAlt: string; href?: string }[]) => void;
}) {
  return (
    <div className="space-y-3">
      <MiniLabel>Gallery tiles</MiniLabel>
      {posts.map((post, idx) => (
        <div key={idx} className="border-border rounded-xl border bg-white/[0.02] p-4">
          <MediaPickerField
            label={`Tile ${idx + 1}`}
            value={{ url: post.image, alt: post.imageAlt, cloudinaryPublicId: "" }}
            onChange={(m) => {
              const next = [...posts];
              next[idx] = { ...post, image: m.url, imageAlt: m.alt };
              onChange(next);
            }}
          />
          <div className="mt-2">
            <MiniLabel>Optional link</MiniLabel>
            <Input
              className={inp}
              value={post.href ?? ""}
              onChange={(e) => {
                const next = [...posts];
                next[idx] = { ...post, href: e.target.value || undefined };
                onChange(next);
              }}
            />
          </div>
          <Button type="button" variant="ghost" size="xs" className="mt-2 text-destructive" onClick={() => onChange(posts.filter((_, i) => i !== idx))}>
            Remove tile
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={() => onChange([...posts, { image: "", imageAlt: "", href: "" }])}>
        + Add tile
      </Button>
    </div>
  );
}

function EditorialItemsEditor({
  items,
  onChange,
}: {
  items: { title: string; caption?: string; href: string; image: string; imageAlt: string }[];
  onChange: (items: { title: string; caption?: string; href: string; image: string; imageAlt: string }[]) => void;
}) {
  return (
    <div className="space-y-3">
      <MiniLabel>Tiles</MiniLabel>
      {items.map((row, idx) => (
        <div key={idx} className="border-border space-y-2 rounded-xl border bg-white/[0.02] p-4">
          <MediaPickerField
            label={`Editorial tile ${idx + 1}`}
            value={{ url: row.image, alt: row.imageAlt, cloudinaryPublicId: "" }}
            onChange={(m) => {
              const next = [...items];
              next[idx] = { ...row, image: m.url, imageAlt: m.alt };
              onChange(next);
            }}
          />
          <Input
            className={inp}
            placeholder="Title"
            value={row.title}
            onChange={(e) => {
              const next = [...items];
              next[idx] = { ...row, title: e.target.value };
              onChange(next);
            }}
          />
          <Input
            className={inp}
            placeholder="Caption"
            value={row.caption ?? ""}
            onChange={(e) => {
              const next = [...items];
              next[idx] = { ...row, caption: e.target.value };
              onChange(next);
            }}
          />
          <Input
            className={inp}
            placeholder="Link"
            value={row.href}
            onChange={(e) => {
              const next = [...items];
              next[idx] = { ...row, href: e.target.value };
              onChange(next);
            }}
          />
          <Button type="button" variant="ghost" size="xs" className="text-destructive" onClick={() => onChange(items.filter((_, i) => i !== idx))}>
            Remove
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={() => onChange([...items, { title: "", href: "/", image: "", imageAlt: "" }])}>
        + Add editorial tile
      </Button>
    </div>
  );
}
