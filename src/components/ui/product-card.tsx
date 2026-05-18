import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { imageSizes, productImageSrc } from "@/lib/images";
import { formatInrFromMinorUnits } from "@/lib/money";
import { productTagLabel } from "@/lib/product-display";
import { luxurySurface } from "@/lib/class-variants";
import { cn } from "@/lib/utils";
import type { MockProduct } from "@/types/product";

export type ProductCardProduct = Pick<
  MockProduct,
  "slug" | "name" | "priceCents" | "image" | "imageAlt" | "tag" | "cloudinaryPublicId"
>;

type ProductCardProps = {
  product: ProductCardProduct;
  sizes?: string;
  /** Next/Image priority — first row */
  priority?: boolean;
  className?: string;
};

export function ProductCard({
  product,
  sizes = imageSizes.cardGrid,
  priority = false,
  className,
}: ProductCardProps) {
  const label = productTagLabel(product.tag);
  const src = productImageSrc(product, 920);

  return (
    <Link
      href={`/products/${product.slug}`}
      className={cn(
        "group flex flex-col gap-4 overflow-hidden rounded-[var(--radius-card)] outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring",
        luxurySurface({ interactive: true }),
        className,
      )}
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-[var(--radius-card)] bg-muted/25">
        <Image
          src={src}
          alt={product.imageAlt}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover transition-transform duration-[480ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]"
        />
        {label ?
          <Badge
            variant="secondary"
            className="absolute left-3 top-3 rounded-full py-px font-normal tracking-wide uppercase opacity-95"
          >
            {label}
          </Badge>
        : null}
      </div>
      <div className="flex flex-col gap-1 pb-2">
        <p className="line-clamp-2 text-sm leading-snug tracking-tight">{product.name}</p>
        <p className="text-muted-foreground text-sm">{formatInrFromMinorUnits(product.priceCents)}</p>
      </div>
    </Link>
  );
}
