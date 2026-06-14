/** Supported delivery modes — extend as new programs launch (same-day, next-day, etc.). */
export type DeliveryMode = "express" | "same-day" | "standard";

/** Human-readable delivery window shown to customers. */
export type DeliveryEstimate = string;

/** One PIN-level coverage row — admin-ready shape for future CMS panels. */
export type DeliveryCoverageEntry = {
  pincode: string;
  area: string;
  city: string;
  regionId?: string;
  mode: DeliveryMode;
  estimate: DeliveryEstimate;
};

export type PinValidationResult =
  | { valid: true; normalized: string }
  | { valid: false; reason: "empty" | "invalid-format" };

/** Resolved availability for a validated PIN code. */
export type DeliveryAvailabilityResult = {
  /** `true` when a premium mode (e.g. express) applies for this PIN. */
  available: boolean;
  mode: DeliveryMode;
  estimate: DeliveryEstimate;
  pincode: string;
  area?: string;
  city?: string;
};

export type DeliveryCheckPhase = "idle" | "checked";
