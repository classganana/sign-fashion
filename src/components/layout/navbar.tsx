"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, ShoppingBag } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { mainNav, site } from "@/config/site";
import { cn } from "@/lib/utils";
import { selectCartCount, useCartStore } from "@/store/cart-store";
import { CatalogSearchLauncher } from "@/features/product-discovery/catalog-search-sheet";

export function Navbar() {
  const cartCount = useCartStore(selectCartCount);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-border/60 border-b bg-background/85 backdrop-blur-md transition-colors",
        scrolled && "shadow-minimal",
      )}
    >
      <Container className="flex h-14 items-center justify-between sm:h-[3.625rem]">
        <div className="flex items-center gap-3 md:gap-8">
          <Sheet>
            <SheetTrigger render={<Button variant="ghost" size="icon-sm" />}>
              <Menu className="size-5" />
              <span className="sr-only">Open menu</span>
            </SheetTrigger>
            <SheetContent side="left" className="w-[min(100%,20rem)] p-0 sm:max-w-sm">
              <SheetHeader className="border-border border-b p-5 pb-4">
                <SheetTitle>{site.name}</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 p-4">
                {mainNav.map((item) => (
                  <SheetClose
                    key={item.href}
                    nativeButton={false}
                    render={
                      <Link
                        href={item.href}
                        className="rounded-md px-3 py-2.5 text-[0.9375rem] tracking-wide transition-luxury hover:bg-muted"
                      />
                    }
                  >
                    {item.label}
                  </SheetClose>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          <Link
            href="/"
            className="font-semibold text-[0.7rem] uppercase tracking-[0.16em] sm:text-[0.75rem]"
          >
            {site.name}
          </Link>
          <nav className="text-muted-foreground hidden items-center gap-7 text-sm md:flex">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="tracking-wide transition-luxury hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className='flex shrink-0 items-center gap-1 sm:gap-2'>
          <CatalogSearchLauncher />
          <Link
            href="/auth/login"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "hidden sm:inline-flex",
            )}
          >
            Account
          </Link>
          <Link
            href="/cart"
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "relative shrink-0",
            )}
            aria-label={`Shopping bag (${cartCount} items)`}
          >
            <ShoppingBag className="size-5" aria-hidden />
            {cartCount > 0 ?
              <span className="bg-primary text-primary-foreground absolute -top-1 -right-1 flex size-[1.125rem] items-center justify-center rounded-full text-[0.5625rem] font-medium ring-2 ring-background">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            : null}
          </Link>
        </div>
      </Container>
    </header>
  );
}
