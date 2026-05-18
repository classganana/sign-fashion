import type { Metadata } from "next";

export const metadata: Metadata = { title: "Shipping" };

export default function ShippingPage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-1 flex-col gap-4 px-6 py-20">
      <h1 className="text-[2rem] font-medium tracking-tight">Shipping</h1>
      <p className="text-muted-foreground leading-relaxed">
        Standard timelines: dispatched in 48 hours PAN-India, express metro lanes coming soon — adjust when ops are
        final.
      </p>
    </div>
  );
}
