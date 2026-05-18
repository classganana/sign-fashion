import { defaultHomepageSections } from "@/config/homepage-sections";
import { homepageSectionsFileSchema } from "@/lib/schemas/cms-layout";
import { CMS_KEYS } from "@/models/cms-kv-model";
import { cmsKvRead } from "@/services/cms-kv-repository";

import type { HomepageSectionConfig } from "@/types/homepage";

type HomepageSectionDraft = HomepageSectionConfig & {
  disabled?: boolean;
  sortOrder?: number;
};

function stripCmsEnvelope(entry: HomepageSectionDraft): HomepageSectionConfig {
  const { disabled: _d, sortOrder: _so, ...rest } = entry;
  void _d;
  void _so;
  return rest as HomepageSectionConfig;
}

function normalizeStack(entries: HomepageSectionDraft[]): HomepageSectionConfig[] {
  return entries
    .filter((section) => !section.disabled)
    .map((section, fallbackIndex) => ({
      raw: stripCmsEnvelope(section),
      order:
        typeof section.sortOrder === "number" && Number.isFinite(section.sortOrder)
          ? section.sortOrder
          : fallbackIndex,
    }))
    .sort((a, b) => a.order - b.order)
    .map((row) => row.raw);
}

/** Raw stack for admin JSON editor — includes `disabled` / `sortOrder` envelopes */
export async function getHomepageSectionsDraftForAdmin(): Promise<HomepageSectionDraft[]> {
  const raw = await cmsKvRead(CMS_KEYS.homepageSections);
  let draft: HomepageSectionDraft[] = [...defaultHomepageSections] as HomepageSectionDraft[];

  if (raw !== null) {
    const parsed = homepageSectionsFileSchema.safeParse(raw);
    if (parsed.success && parsed.data.length) draft = parsed.data as HomepageSectionDraft[];
  }

  return draft;
}

export async function mergeHomepageSectionStackNow(): Promise<HomepageSectionConfig[]> {
  const raw = await cmsKvRead(CMS_KEYS.homepageSections);
  let draft: HomepageSectionDraft[] =
    [...defaultHomepageSections] as HomepageSectionDraft[];

  if (raw !== null) {
    const parsed = homepageSectionsFileSchema.safeParse(raw);
    if (parsed.success && parsed.data.length) draft = parsed.data as HomepageSectionDraft[];
  }

  return normalizeStack(draft);
}
