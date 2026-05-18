import type { Metadata } from "next";
import { ConditionalSiteChrome } from "@/components/layout/conditional-site-chrome";
import { rootMetadata, viewport } from "@/config/seo";
import { fontBody, fontDisplay, fontMono } from "@/lib/fonts";
import { cn } from "@/lib/utils";

import "./globals.css";

export const metadata: Metadata = rootMetadata;

export { viewport };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        fontBody.variable,
        fontDisplay.variable,
        fontMono.variable,
        "dark min-h-full",
      )}
    >
      <body className="bg-background text-foreground flex min-h-screen flex-col antialiased">
        <ConditionalSiteChrome>{children}</ConditionalSiteChrome>
      </body>
    </html>
  );
}
