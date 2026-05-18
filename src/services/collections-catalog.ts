import { cache } from "react";

import { collections as fallbackCollections } from "@/config/collections";
import type { CollectionConfig } from "@/config/collections";

import { collectionsBundleSchema } from "@/lib/schemas/cms-layout";
import { CMS_KEYS } from "@/models/cms-kv-model";
import { cmsKvRead } from "@/services/cms-kv-repository";

async function fetchUnifiedCollectionsInner(): Promise<readonly CollectionConfig[]> {
  const raw = await cmsKvRead(CMS_KEYS.collectionsBundle);
  const parsed = collectionsBundleSchema.safeParse(raw);
  if (parsed.success && parsed.data.length) return parsed.data;
  return fallbackCollections;
}

/** CMS / config snapshot for editor — KV when valid non-empty else file fallback */
export async function getCollectionsDraftForAdmin(): Promise<CollectionConfig[]> {
  const raw = await cmsKvRead(CMS_KEYS.collectionsBundle);
  const parsed = collectionsBundleSchema.safeParse(raw);
  if (parsed.success && parsed.data.length) return [...parsed.data];
  return [...fallbackCollections];
}

/** Storefront capsules — CMS KV replaces bundle when validated non-empty */
export async function mergeCollectionsCatalogNow(): Promise<readonly CollectionConfig[]> {
  return fetchUnifiedCollectionsInner();
}

export const getUnifiedCollections = cache(fetchUnifiedCollectionsInner);
