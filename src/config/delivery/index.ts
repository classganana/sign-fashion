import type { DeliveryCoverageEntry } from "@/features/delivery/types/delivery";

import { KANPUR_EXPRESS_COVERAGE } from "./kanpur-express";

/** Default estimate when no premium mode matches the PIN. */
export const STANDARD_DELIVERY_ESTIMATE = "3–5 business days";

/**
 * Aggregated coverage registry — append city-specific arrays (Hyderabad, Lucknow, etc.)
 * without changing service or UI layers.
 */
export const DELIVERY_COVERAGE_REGISTRY: readonly DeliveryCoverageEntry[] = [
  ...KANPUR_EXPRESS_COVERAGE,
];

export { KANPUR_EXPRESS_COVERAGE };
