import type { HomepageSectionConfig } from "@/types/homepage";

/** Homepage block saved for publishing — visibility & ordering layers wrap storefront shapes */
export type HomepageSectionEnvelope = HomepageSectionConfig & {
  disabled?: boolean;
  sortOrder?: number;
};
