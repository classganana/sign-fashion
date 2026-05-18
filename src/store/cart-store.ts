import { create } from "zustand";
import { persist } from "zustand/middleware";

import { cartLineMergeKey } from "@/lib/cart-line-key";

export type CartLine = {
  /** Merge key for variant + size — stable across sessions when persisted */
  mergeKey: string;
  productId: string;
  slug: string;
  name: string;
  priceCents: number;
  currency: "INR";
  quantity: number;
  image?: string;
  imageAlt?: string;
  selectedSize?: string;
};

export function lineMergeKey(line: Pick<CartLine, "mergeKey" | "slug" | "selectedSize">): string {
  return line.mergeKey || cartLineMergeKey(line.slug, line.selectedSize);
}

type CartState = {
  lines: CartLine[];
  addLine: (
    line: Omit<CartLine, "quantity" | "mergeKey"> & {
      quantity?: number;
      mergeKey?: string;
    },
  ) => void;
  removeLine: (mergeKey: string) => void;
  setQuantity: (mergeKey: string, quantity: number) => void;
  clear: () => void;
};

export const useCartStore = create(
  persist<
    CartState,
    [],
    [],
    { lines: CartLine[] }
  >(
    (set, get) => ({
      lines: [],
      addLine: (incoming) => {
        const qty = incoming.quantity ?? 1;
        const mergeKey = incoming.mergeKey ?? cartLineMergeKey(incoming.slug, incoming.selectedSize);
        const existing = get().lines.find((l) => lineMergeKey(l) === mergeKey);
        if (existing) {
          set({
            lines: get().lines.map((l) =>
              lineMergeKey(l) === mergeKey ? { ...l, quantity: l.quantity + qty } : l,
            ),
          });
          return;
        }
        set({
          lines: [
            ...get().lines,
            {
              mergeKey,
              productId: incoming.productId,
              slug: incoming.slug,
              name: incoming.name,
              priceCents: incoming.priceCents,
              currency: incoming.currency,
              quantity: qty,
              image: incoming.image,
              imageAlt: incoming.imageAlt,
              selectedSize: incoming.selectedSize,
            },
          ],
        });
      },
      removeLine: (mergeKey) =>
        set({ lines: get().lines.filter((l) => lineMergeKey(l) !== mergeKey) }),
      setQuantity: (mergeKey, quantity) => {
        if (quantity <= 0) {
          set({ lines: get().lines.filter((l) => lineMergeKey(l) !== mergeKey) });
          return;
        }
        set({
          lines: get().lines.map((l) =>
            lineMergeKey(l) === mergeKey ? { ...l, quantity } : l,
          ),
        });
      },
      clear: () => set({ lines: [] }),
    }),
    {
      name: "sign-fashion-cart",
      version: 2,
      partialize: (state) => ({ lines: state.lines }),
      migrate: (_persisted) => {
        type Row = Partial<CartLine> & { productId: string; slug: string };
        const blob = _persisted as { lines?: Row[] } | null | undefined;
        const raw = blob?.lines ?? [];
        return {
          lines: raw.map((l): CartLine => {
            const sel = l.selectedSize;
            return {
              mergeKey: l.mergeKey ?? cartLineMergeKey(l.slug, sel),
              productId: l.productId,
              slug: l.slug,
              name: l.name ?? "",
              priceCents: l.priceCents ?? 0,
              currency: (l.currency ?? "INR") as "INR",
              quantity: l.quantity ?? 1,
              image: l.image,
              imageAlt: l.imageAlt,
              selectedSize: sel,
            };
          }),
        };
      },
    },
  ),
);

export function selectCartCount(state: CartState): number {
  return state.lines.reduce((sum, l) => sum + l.quantity, 0);
}

export function selectCartSubtotalCents(state: CartState): number {
  return state.lines.reduce(
    (sum, l) => sum + l.priceCents * l.quantity,
    0,
  );
}
