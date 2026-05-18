/**
 * Future size-recommendation surface — wire to fit quiz + body scan + inventory rules.
 * Keep UI calling this module so PDP stays decoupled from ML providers.
 */
export type BodyProfileStub = {
  heightCm?: number;
  chestCm?: number;
  shoulderCm?: number;
  preferredFit?: "closer" | "true" | "roomy";
};

export type SizeRecommendationResult = {
  size: string;
  confidence: "low" | "medium" | "high";
  rationale: string;
};

/** Returns null until real rules + data exist */
export function recommendSizeFromProfile(
  _profile: BodyProfileStub,
  _availableSizes: readonly string[],
): SizeRecommendationResult | null {
  void _profile;
  void _availableSizes;
  return null;
}
