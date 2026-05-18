"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatInrFromMinorUnits } from "@/lib/money";
import {
  selectCartSubtotalCents,
  selectCartCount,
  useCartStore,
} from "@/store/cart-store";

const schema = z.object({
  fullName: z.string().min(2, "Add your full name"),
  email: z.string().email({ message: "Enter a valid email" }),
  phone: z.string().min(10, "Add a reachable phone"),
  pincode: z.string().regex(/^[0-9]{6}$/, "Use a 6-digit PIN"),
  city: z.string().min(2, "City required"),
});

type FormValues = z.infer<typeof schema>;

export function CheckoutPage() {
  const lines = useCartStore((s) => s.lines);
  const subtotal = useCartStore(selectCartSubtotalCents);
  const count = useCartStore(selectCartCount);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      pincode: "",
      city: "",
    },
  });

  const onSubmit = form.handleSubmit(() => {
    // Placeholder until orders API + Razorpay/Stripe wired
    form.reset(undefined, { keepValues: false });
  });

  if (!lines.length) {
    return (
      <Card className="border-dashed shadow-none md:col-span-full">
        <CardHeader className="space-y-2">
          <p className="text-muted-foreground text-xs uppercase">Checkout</p>
          <p className="text-lg tracking-tight">Your bag is empty</p>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Pick a silhouette you love — your checkout details will ship when we connect payments.
          </p>
        </CardContent>
        <CardFooter>
          <Button render={<Link href="/products" />}>Browse catalogue</Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1.65fr)_minmax(280px,0.95fr)]">
      <Card className="border-border/70 shadow-none">
        <CardHeader className="space-y-2">
          <p className="text-muted-foreground text-xs tracking-[0.25em] uppercase">
            Checkout
          </p>
          <p className="text-lg tracking-tight">Shipping details</p>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 sm:grid-cols-2" onSubmit={onSubmit} noValidate>
            <div className="sm:col-span-2">
              <label className="text-muted-foreground mb-2 block text-xs uppercase">
                Full name
              </label>
              <Input {...form.register("fullName")} />
              <FieldError>{form.formState.errors.fullName?.message}</FieldError>
            </div>
            <div>
              <label className="text-muted-foreground mb-2 block text-xs uppercase">
                Email
              </label>
              <Input type="email" autoComplete="email" {...form.register("email")} />
              <FieldError>{form.formState.errors.email?.message}</FieldError>
            </div>
            <div>
              <label className="text-muted-foreground mb-2 block text-xs uppercase">
                Phone
              </label>
              <Input type="tel" autoComplete="tel" {...form.register("phone")} />
              <FieldError>{form.formState.errors.phone?.message}</FieldError>
            </div>
            <div>
              <label className="text-muted-foreground mb-2 block text-xs uppercase">
                PIN code
              </label>
              <Input inputMode="numeric" {...form.register("pincode")} />
              <FieldError>{form.formState.errors.pincode?.message}</FieldError>
            </div>
            <div className="sm:col-span-2">
              <label className="text-muted-foreground mb-2 block text-xs uppercase">
                City
              </label>
              <Input {...form.register("city")} />
              <FieldError>{form.formState.errors.city?.message}</FieldError>
            </div>
            <div className="sm:col-span-2 mt-4">
              <Button type="submit" className="w-full sm:w-auto" disabled={form.formState.isSubmitting}>
                Place order · {formatInrFromMinorUnits(subtotal)}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="h-fit shadow-none lg:sticky lg:top-24">
        <CardHeader className="space-y-1">
          <p className="text-muted-foreground text-xs uppercase">Order overview</p>
          <p className="font-medium">{count} pieces</p>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatInrFromMinorUnits(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Shipping</span>
            <span>Calculated next</span>
          </div>
        </CardContent>
        <CardFooter className="text-muted-foreground text-xs leading-relaxed">
          Payment gateway intentionally omitted — swap this block for Razorpay/Stripe intents when ready.
        </CardFooter>
      </Card>
    </div>
  );
}

function FieldError({ children }: { children?: string }) {
  if (!children) return null;
  return <p className="mt-1 text-xs text-destructive">{children}</p>;
}
