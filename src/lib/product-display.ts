import type { MockProduct } from "@/types/product";

/** Retail-style label for product badges (cards, PDP). */
export function productTagLabel(tag?: MockProduct["tag"]): string | null {
  switch (tag) {
    case "new":
      return "New";
    case "limited":
      return "Limited";
    case "bestseller":
      return "Best seller";
    default:
      return null;
  }
}
