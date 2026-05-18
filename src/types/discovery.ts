import type { MockProduct } from "@/types/product";

export const DISCOVERY_SORTS = [
  "featured",
  "newest",
  "trending",
  "price-asc",
  "price-desc",
] as const;

export type DiscoverySortOption = (typeof DISCOVERY_SORTS)[number];

export type MockProductCampaign = NonNullable<MockProduct["tag"]>;

export type ParsedDiscoveryParams = {
  categories: string[];
  sizes: string[];
  colors: string[];
  fits: string[];
  collections: string[];
  discoveryTags: string[];
  campaigns: MockProductCampaign[];
  minPriceRupee: number | null;
  maxPriceRupee: number | null;
  sort: DiscoverySortOption;
  q: string;
};
