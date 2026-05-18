import { create } from "zustand";
import { persist } from "zustand/middleware";

type WishlistState = {
  ids: string[];
  toggle: (productId: string) => void;
};

export const useWishlistStore = create(
  persist<WishlistState>(
    (set, get) => ({
      ids: [],
      toggle: (productId) => {
        const ids = get().ids;
        if (ids.includes(productId)) {
          set({ ids: ids.filter((id) => id !== productId) });
        } else {
          set({ ids: [...ids, productId] });
        }
      },
    }),
    { name: "sign-fashion-wishlist" },
  ),
);
