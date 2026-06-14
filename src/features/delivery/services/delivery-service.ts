import {
  DELIVERY_COVERAGE_REGISTRY,
  STANDARD_DELIVERY_ESTIMATE,
} from "@/config/delivery";

import type {
  DeliveryAvailabilityResult,
  DeliveryCoverageEntry,
  PinValidationResult,
} from "../types/delivery";

const PIN_PATTERN = /^\d{6}$/;

const coverageByPin = buildCoverageIndex(DELIVERY_COVERAGE_REGISTRY);

function buildCoverageIndex(
  entries: readonly DeliveryCoverageEntry[],
): Map<string, DeliveryCoverageEntry> {
  const map = new Map<string, DeliveryCoverageEntry>();
  for (const entry of entries) {
    map.set(entry.pincode, entry);
  }
  return map;
}

/** Normalizes and validates Indian 6-digit PIN codes. */
export function validatePinCode(raw: string): PinValidationResult {
  const trimmed = raw.trim();
  if (!trimmed.length) {
    return { valid: false, reason: "empty" };
  }

  const digitsOnly = trimmed.replace(/\D/g, "");
  if (!PIN_PATTERN.test(digitsOnly)) {
    return { valid: false, reason: "invalid-format" };
  }

  return { valid: true, normalized: digitsOnly };
}

function resolveStandardDelivery(pincode: string): DeliveryAvailabilityResult {
  return {
    available: false,
    mode: "standard",
    estimate: STANDARD_DELIVERY_ESTIMATE,
    pincode,
  };
}

/**
 * Determines delivery mode and estimate for a validated PIN.
 * Call `validatePinCode` first — invalid PINs should not reach this function.
 */
export function getDeliveryAvailability(normalizedPincode: string): DeliveryAvailabilityResult {
  const match = coverageByPin.get(normalizedPincode);
  if (!match) {
    return resolveStandardDelivery(normalizedPincode);
  }

  const isPremium = match.mode === "express" || match.mode === "same-day";

  return {
    available: isPremium,
    mode: match.mode,
    estimate: match.estimate,
    pincode: normalizedPincode,
    area: match.area,
    city: match.city,
  };
}

/** Convenience: validate then resolve availability in one step. */
export function checkDeliveryAvailability(rawPin: string):
  | { validation: PinValidationResult & { valid: false } }
  | { validation: PinValidationResult & { valid: true }; result: DeliveryAvailabilityResult } {
  const validation = validatePinCode(rawPin);
  if (!validation.valid) {
    return { validation };
  }

  return {
    validation,
    result: getDeliveryAvailability(validation.normalized),
  };
}
