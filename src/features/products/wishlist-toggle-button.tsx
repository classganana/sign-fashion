"use client";

import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useWishlistStore } from "@/store/wishlist-store";

type Props = {
  productId: string;
  className?: string;
};

export function WishlistToggleButton({ productId, className }: Props) {
  const toggle = useWishlistStore((s) => s.toggle);
  const saved = useWishlistStore((s) => s.ids.includes(productId));

  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      aria-pressed={saved}
      aria-label={saved ? "Remove from saved list" : "Save for later"}
      className={cn(
        "gap-2 transition-luxury",
        saved && "border-secondary-foreground bg-muted/35",
        className,
      )}
      onClick={() => toggle(productId)}
    >
      <Heart
        className={cn("size-4 transition-luxury", saved && "fill-current")}
        aria-hidden
      />
      {saved ? "Saved" : "Save for later"}
    </Button>
  );
}
