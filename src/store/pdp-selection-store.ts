import { create } from "zustand";
import { persist } from "zustand/middleware";

type PDPick = {
  size?: string;
  quantity: number;
};

type PdpSelectionState = {
  bySlug: Record<string, PDPick>;
  setSize: (slug: string, size: string | undefined) => void;
  setQuantity: (slug: string, quantity: number) => void;
  getForSlug: (slug: string) => PDPick;
};

export const usePdpSelectionStore = create(
  persist<PdpSelectionState>(
    (set, get) => ({
      bySlug: {},
      setSize: (slug, size) =>
        set((prev) => ({
          bySlug: {
            ...prev.bySlug,
            [slug]: {
              ...(prev.bySlug[slug] ?? { quantity: 1 }),
              size,
            },
          },
        })),
      setQuantity: (slug, quantity) =>
        set((prev) => ({
          bySlug: {
            ...prev.bySlug,
            [slug]: {
              ...(prev.bySlug[slug] ?? {}),
              quantity: Math.min(99, Math.max(1, quantity)),
            },
          },
        })),
      getForSlug: (slug) => {
        const v = get().bySlug[slug];
        return { size: v?.size, quantity: v?.quantity ?? 1 };
      },
    }),
    { name: "sign-fashion-pdp-picks" },
  ),
);
