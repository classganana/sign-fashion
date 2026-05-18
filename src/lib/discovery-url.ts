import {
  DISCOVERY_SORTS,
  type DiscoverySortOption,
  type MockProductCampaign,
  type ParsedDiscoveryParams,
} from "@/types/discovery";

export const DISCOVERY_QUERY_KEYS = {
  category: "category",
  size: "size",
  color: "color",
  fit: "fit",
  collection: "collection",
  merch: "merch",
  campaign: "campaign",
  min: "min",
  max: "max",
  sort: "sort",
  q: "q",
  /** Legacy marketing deep links mapped into `campaigns` */
  legacyTag: "tag",
} as const;

export const DEFAULT_SORT: DiscoverySortOption = "featured";

function canonicalToken(value: string): string {
  return value.trim().toLowerCase();
}

function csvList(raw: string | null): string[] {
  if (!raw) return [];
  return raw.split(",").map(canonicalToken).filter(Boolean);
}

function readFirst(sp: URLSearchParams, key: string): string | null {
  return sp.get(key);
}

export function parseDiscoveryParams(
  input: URLSearchParams | Record<string, string | string[] | undefined>,
): ParsedDiscoveryParams {
  const sp =
    input instanceof URLSearchParams ? new URLSearchParams(input) : new URLSearchParams();

  if (!(input instanceof URLSearchParams)) {
    for (const [key, raw] of Object.entries(input)) {
      if (raw === undefined) continue;
      if (Array.isArray(raw)) {
        for (const v of raw) {
          if (v !== undefined && v !== "") sp.append(key, v);
        }
      } else if (raw !== "") {
        sp.append(key, raw);
      }
    }
  }

  const campaigns: MockProductCampaign[] = [];
  for (const c of [...csvList(readFirst(sp, DISCOVERY_QUERY_KEYS.campaign)), ...csvList(readFirst(sp, DISCOVERY_QUERY_KEYS.legacyTag))]) {
    if (c === "new" || c === "limited" || c === "bestseller") {
      if (!campaigns.includes(c)) campaigns.push(c);
    }
  }

  const rawSort = readFirst(sp, DISCOVERY_QUERY_KEYS.sort);
  const sort: DiscoverySortOption =
    rawSort && (DISCOVERY_SORTS as readonly string[]).includes(rawSort) ?
      (rawSort as DiscoverySortOption)
    : DEFAULT_SORT;

  const minRupeeRaw = readFirst(sp, DISCOVERY_QUERY_KEYS.min);
  const maxRupeeRaw = readFirst(sp, DISCOVERY_QUERY_KEYS.max);
  const minParsed = minRupeeRaw !== null ? Number.parseInt(minRupeeRaw, 10) : Number.NaN;
  const maxParsed = maxRupeeRaw !== null ? Number.parseInt(maxRupeeRaw, 10) : Number.NaN;

  return {
    categories: csvList(readFirst(sp, DISCOVERY_QUERY_KEYS.category)),
    sizes: csvList(readFirst(sp, DISCOVERY_QUERY_KEYS.size)),
    colors: csvList(readFirst(sp, DISCOVERY_QUERY_KEYS.color)),
    fits: csvList(readFirst(sp, DISCOVERY_QUERY_KEYS.fit)),
    collections: csvList(readFirst(sp, DISCOVERY_QUERY_KEYS.collection)),
    discoveryTags: csvList(readFirst(sp, DISCOVERY_QUERY_KEYS.merch)),
    campaigns,
    minPriceRupee: Number.isFinite(minParsed) ? minParsed : null,
    maxPriceRupee: Number.isFinite(maxParsed) ? maxParsed : null,
    sort,
    q: readFirst(sp, DISCOVERY_QUERY_KEYS.q)?.trim() ?? "",
  };
}

/** Serialises only active filters — stable SEO-friendly URLs */
export function serialiseDiscoveryParams(params: ParsedDiscoveryParams): URLSearchParams {
  const sp = new URLSearchParams();

  const setCsv = (key: string, values: readonly string[]) => {
    const norm = [...new Set(values.map(canonicalToken))].filter(Boolean);
    if (norm.length) sp.set(key, norm.join(","));
  };

  setCsv(DISCOVERY_QUERY_KEYS.category, params.categories);
  setCsv(DISCOVERY_QUERY_KEYS.size, params.sizes);
  setCsv(DISCOVERY_QUERY_KEYS.color, params.colors);
  setCsv(DISCOVERY_QUERY_KEYS.fit, params.fits);
  setCsv(DISCOVERY_QUERY_KEYS.collection, params.collections);
  setCsv(DISCOVERY_QUERY_KEYS.merch, params.discoveryTags);
  setCsv(DISCOVERY_QUERY_KEYS.campaign, params.campaigns);

  if (params.minPriceRupee !== null) sp.set(DISCOVERY_QUERY_KEYS.min, String(params.minPriceRupee));
  if (params.maxPriceRupee !== null) sp.set(DISCOVERY_QUERY_KEYS.max, String(params.maxPriceRupee));

  if (params.sort !== DEFAULT_SORT) sp.set(DISCOVERY_QUERY_KEYS.sort, params.sort);

  if (params.q.trim()) sp.set(DISCOVERY_QUERY_KEYS.q, params.q.trim());

  return sp;
}

export function discoveryHref(pathname: string, params: ParsedDiscoveryParams): string {
  const sp = serialiseDiscoveryParams(params);
  const qs = sp.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}
