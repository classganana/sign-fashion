import type { MockProductCampaign, ParsedDiscoveryParams } from "@/types/discovery";

import { DEFAULT_SORT } from "@/lib/discovery-url";

function norm(value: string): string {
  return value.trim().toLowerCase();
}

export type ListFacetField =
  | "categories"
  | "sizes"
  | "colors"
  | "fits"
  | "collections"
  | "discoveryTags";

export function toggleListFacet(
  params: ParsedDiscoveryParams,
  field: ListFacetField,
  rawValue: string,
): ParsedDiscoveryParams {
  const value = norm(rawValue);
  if (!value) return params;
  const current = params[field];
  const has = current.includes(value);
  const next = has ? current.filter((v) => v !== value) : [...current, value];
  return { ...params, [field]: next };
}

export function toggleCampaign(
  params: ParsedDiscoveryParams,
  rawValue: MockProductCampaign,
): ParsedDiscoveryParams {
  const value = rawValue;
  const has = params.campaigns.includes(value);
  const next = has ?
      params.campaigns.filter((c) => c !== value)
    : [...params.campaigns, value];
  return { ...params, campaigns: next };
}

export function patchSort(
  params: ParsedDiscoveryParams,
  sort: ParsedDiscoveryParams["sort"],
): ParsedDiscoveryParams {
  return { ...params, sort };
}

export function patchQuery(params: ParsedDiscoveryParams, q: string): ParsedDiscoveryParams {
  return { ...params, q };
}

export function patchPriceBand(
  params: ParsedDiscoveryParams,
  patch: {
    minPriceRupee: number | null;
    maxPriceRupee: number | null;
  },
): ParsedDiscoveryParams {
  return { ...params, ...patch };
}

/** Clears dimensional filters while preserving search phrase + sort preference */
export function clearFacetFilters(params: ParsedDiscoveryParams): ParsedDiscoveryParams {
  return {
    ...params,
    categories: [],
    sizes: [],
    colors: [],
    fits: [],
    collections: [],
    discoveryTags: [],
    campaigns: [],
    minPriceRupee: null,
    maxPriceRupee: null,
  };
}

export function resetDiscoveryListing(): ParsedDiscoveryParams {
  return {
    categories: [],
    sizes: [],
    colors: [],
    fits: [],
    collections: [],
    discoveryTags: [],
    campaigns: [],
    minPriceRupee: null,
    maxPriceRupee: null,
    sort: DEFAULT_SORT,
    q: "",
  };
}
