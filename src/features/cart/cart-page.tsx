"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatInrFromMinorUnits } from "@/lib/money";
import {
  lineMergeKey,
  selectCartSubtotalCents,
  useCartStore,
} from "@/store/cart-store";

export function CartPage() {
  const lines = useCartStore((s) => s.lines);
  const removeLine = useCartStore((s) => s.removeLine);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const subtotal = useCartStore(selectCartSubtotalCents);
  const itemCount = useCartStore((s) =>
    s.lines.reduce((n, l) => n + l.quantity, 0),
  );

  if (!lines.length) {
    return (
      <div className="flex flex-col items-start gap-4 py-24">
        <p className="max-w-md text-muted-foreground text-[0.9375rem] leading-relaxed">
          Your bag is empty — explore new arrivals curated for understated style.
        </p>
        <Link href="/products" className="inline-flex items-center underline-offset-4 hover:underline">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
      <ul className="flex min-w-0 flex-1 flex-col gap-8">
        {lines.map((line) => {
          const key = lineMergeKey(line);

          const sizeCopy =
            line.selectedSize && line.selectedSize.length ? line.selectedSize : "One size";

          return (
            <li key={key} className='border-border flex gap-5 border-b pb-8'>
              <Link
                href={`/products/${line.slug}`}
                className="relative size-28 shrink-0 overflow-hidden rounded-xl border bg-muted/40 md:size-36"
              >
                {line.image ?
                  <Image
                    src={line.image}
                    alt={line.imageAlt ?? line.name}
                    fill
                    className="object-cover"
                    sizes="144px"
                  />
                : null}
              </Link>
              <div className="flex min-w-0 flex-1 flex-col gap-4 sm:flex-row sm:justify-between">
                <div className="space-y-1">
                  <Link href={`/products/${line.slug}`} className="line-clamp-2 font-medium tracking-tight">
                    {line.name}
                  </Link>
                  <p className="text-muted-foreground text-sm">{sizeCopy}</p>
                  <div className="flex flex-wrap items-center gap-5 pt-1">
                    <div className="border-border bg-background inline-flex rounded-full border">
                      <Button
                        type="button"
                        size="icon-sm"
                        variant="ghost"
                        className="size-9 rounded-none rounded-l-full"
                        aria-label="Remove one piece"
                        onClick={() =>
                          line.quantity <= 1 ? removeLine(key) : setQuantity(key, line.quantity - 1)
                        }
                      >
                        <Minus className="size-4" />
                      </Button>
                      <span className='flex min-w-9 items-center justify-center px-3 text-[0.9rem]'>
                        {line.quantity}
                      </span>
                      <Button
                        type="button"
                        size="icon-sm"
                        variant="ghost"
                        className='size-9 rounded-none rounded-r-full'
                        aria-label="Add one piece"
                        onClick={() =>
                          line.quantity >= 99 ? undefined : setQuantity(key, line.quantity + 1)
                        }
                      >
                        <Plus className="size-4" />
                      </Button>
                    </div>
                    <span className="text-muted-foreground text-sm">{formatInrFromMinorUnits(line.priceCents)}</span>
                  </div>
                  <div className="text-secondary-foreground text-sm font-medium">{formatInrFromMinorUnits(line.priceCents * line.quantity)}</div>
                </div>
                <div className="flex shrink-0 items-start gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="-mt-1 text-muted-foreground"
                    aria-label={`Remove ${line.name}`}
                    onClick={() => removeLine(key)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <aside className="bg-muted/30 w-full shrink-0 space-y-6 rounded-2xl border p-6 md:max-w-sm">
        <p className="text-muted-foreground text-xs uppercase tracking-widest">Summary</p>
        <div className="flex justify-between text-sm">
          <span>{itemCount === 1 ? "1 piece" : `${itemCount} pieces`}</span>
        </div>
        <div className="flex items-baseline justify-between border-border border-t pt-4 font-medium">
          <span className="text-secondary-foreground text-sm">Subtotal</span>
          <span>{formatInrFromMinorUnits(subtotal)}</span>
        </div>
        <p className="text-muted-foreground text-xs leading-relaxed">
          Checkout and tax lines ship with the commerce phase. Lines split by SKU + size preview how packing slips
          will read.
        </p>
        <Button size="lg" className="w-full" type="button" variant="outline" disabled>
          Checkout unavailable (preview)
        </Button>
      </aside>
    </div>
  );
}
