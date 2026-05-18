import type { Metadata } from "next";
import { CheckoutPage } from "@/features/checkout/checkout-page";

export const metadata: Metadata = {
  title: "Checkout",
};

export default function CheckoutRoutePage() {
  return (
    <div className="mx-auto w-full max-w-7xl flex-1 px-5 pb-28 pt-12 sm:px-8 lg:pb-40">
      <CheckoutPage />
    </div>
  );
}
