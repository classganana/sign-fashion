import { create } from "zustand";
import { persist } from "zustand/middleware";

const MAX_ITEMS = 12;

type RecentlyViewedState = {
  slugOrder: string[];
  recordSlug: (slug: string) => void;
};

export const useRecentlyViewedStore = create(
  persist<RecentlyViewedState>(
    (set, get) => ({
      slugOrder: [],
      recordSlug: (slug) => {
        if (!slug) return;
        set(() => {
          const prev = get().slugOrder.filter((s) => s !== slug);
          return { slugOrder: [slug, ...prev].slice(0, MAX_ITEMS) };
        });
      },
    }),
    {
      name: "sign-fashion-recently-viewed",
    },
  ),
);
