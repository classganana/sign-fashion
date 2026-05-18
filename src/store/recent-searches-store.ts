import { create } from "zustand";
import { persist } from "zustand/middleware";

const MAX_ITEMS = 8;

type RecentSearchState = {
  queries: string[];
  push: (raw: string) => void;
  clear: () => void;
};

export const useRecentSearchesStore = create(
  persist<RecentSearchState>(
    (set) => ({
      queries: [],
      push: (raw) => {
        const q = raw.trim();
        if (q.length < 2) return;
        const lower = q.toLowerCase();
        set((prev) => {
          const filtered = prev.queries.filter((x) => x.toLowerCase() !== lower);
          return {
            queries: [q, ...filtered].slice(0, MAX_ITEMS),
          };
        });
      },
      clear: () => set({ queries: [] }),
    }),
    { name: "sign-fashion-search-recent" },
  ),
);
