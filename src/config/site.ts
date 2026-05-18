function readPublicEnv(key: string): string | undefined {
  const v = process.env[key];
  return typeof v === "string" && v.trim().length ? v.trim() : undefined;
}

export const site = {
  name: "Sign Fashion",
  description:
    "Premium Indian D2C fashion — minimal silhouettes, confident details, made to move with you.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://signfashion.com",
  social: {
    /** External profile URL; footer + social rails hide the link when unset. */
    instagram: readPublicEnv("NEXT_PUBLIC_INSTAGRAM_URL"),
  },
} as const;

/** Top-of-page strip — set `enabled: false` to hide */
export const announcement = {
  enabled: true,
  message: "Complimentary shipping on orders over ₹5,000",
  href: "/products",
} as const;

export const mainNav = [
  { label: "New In", href: "/products?tag=new" },
  { label: "Shop", href: "/products" },
  { label: "Collections", href: "/collections" },
] as const;

export const footerColumns = [
  {
    title: "Shop",
    links: [
      { label: "All products", href: "/products" },
      { label: "Collections", href: "/collections" },
      { label: "Cart", href: "/cart" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Shipping", href: "/support/shipping" },
      { label: "Returns", href: "/support/returns" },
      { label: "Contact", href: "/support/contact" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Our story", href: "/about" },
      { label: "Careers", href: "/careers" },
    ],
  },
] as const;
