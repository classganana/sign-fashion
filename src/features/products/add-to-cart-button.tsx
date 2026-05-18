"use client";

import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { productImageSrc } from "@/lib/images";
import type { MockProduct } from "@/types/product";
import { useCartStore } from "@/store/cart-store";

type Props = {
  product: Pick<
    MockProduct,
    | "id"
    | "slug"
    | "name"
    | "priceCents"
    | "currency"
    | "image"
    | "imageAlt"
    | "cloudinaryPublicId"
    | "discovery"
  >;
  /** Omit on PLP/quick-add — PDP uses explicit size selection */
  selectedSize?: string;
};

export function AddToCartButton({
  product,
  selectedSize: selectedSizeProp,
}: Props) {
  const addLine = useCartStore((s) => s.addLine);

  const thumbSrc = productImageSrc(product, 720);

  const selectedSize =
    selectedSizeProp ??
    (product.discovery.sizes.length === 1 ? product.discovery.sizes[0] : undefined);

  const missingMultiSizePick =
    product.discovery.sizes.length > 1 &&
    !(selectedSize && selectedSize.trim().length > 0);

  return (
    <Button
      type="button"
      size="lg"
      className="gap-2"
      disabled={missingMultiSizePick}
      aria-disabled={missingMultiSizePick}
      title={missingMultiSizePick ? "Pick a size to add from here" : undefined}
      onClick={() => {
        if (missingMultiSizePick) return;
        addLine({
          productId: product.id,
          slug: product.slug,
          name: product.name,
          priceCents: product.priceCents,
          currency: product.currency,
          image: thumbSrc,
          imageAlt: product.imageAlt,
          quantity: 1,
          selectedSize,
        });
      }}
    >
      <ShoppingBag className="size-4" />
      Add to bag
    </Button>
  );
}
