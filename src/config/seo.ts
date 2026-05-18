import type { Metadata, Viewport } from "next";
import { site } from "@/config/site";

const metadataBaseUrl =
  typeof process.env.NEXT_PUBLIC_SITE_URL === "string"
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
    : new URL(site.url);

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#141414" },
    { media: "(prefers-color-scheme: light)", color: "#faf9f7" },
  ],
};

/** Merge or spread into route-level `metadata` exports */
export const rootMetadata = {
  metadataBase: metadataBaseUrl,
  title: {
    default: `${site.name} · Premium Minimal Fashion`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  keywords: ["fashion", "D2C", "minimalism", "luxury", site.name],
  authors: [{ name: site.name }],
  creator: site.name,
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: site.name,
    title: `${site.name} · Premium Minimal Fashion`,
    description: site.description,
    url: site.url,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} · Premium Minimal Fashion`,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
  },
  category: "fashion",
} satisfies Metadata;
