import type { Metadata } from "next";
import { CartPage } from "@/features/cart/cart-page";

export const metadata: Metadata = {
  title: "Bag",
};

export default function CartRoutePage() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 px-5 py-14 sm:px-8 lg:py-16">
      <CartPage />
    </div>
  );
}
