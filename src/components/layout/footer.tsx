import Link from "next/link";

import { Container } from "@/components/ui/container";
import { footerColumns, site } from "@/config/site";
import { cn } from "@/lib/utils";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-border mt-[length:var(--spacing-section-sm)] border-t pt-[length:var(--spacing-section-sm)] lg:mt-[length:var(--spacing-section-md)]">
      <Container className="flex flex-col gap-14 pb-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4 lg:max-w-sm">
            <p className="text-eyebrow text-foreground font-semibold">{site.name}</p>
            <p className="text-muted-foreground mt-5 text-[0.9rem] leading-relaxed">
              {site.description}
            </p>
          </div>
          <div className="contents lg:col-span-8 lg:grid lg:grid-cols-3 lg:gap-8">
            {footerColumns.map((col) => (
              <div key={col.title} className="flex flex-col gap-4">
                <p className="text-muted-foreground text-eyebrow">{col.title}</p>
                <ul className="flex flex-col gap-2">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={cn(
                          "text-[0.9rem] decoration-border decoration-1 underline-offset-[6px]",
                          "text-foreground transition-luxury",
                          "hover:text-muted-foreground hover:underline hover:decoration-foreground",
                        )}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="border-border text-muted-foreground flex flex-wrap items-center justify-between gap-3 border-t pt-8 text-[0.7rem]">
          <p>© {year} {site.name}</p>
          <div className="flex flex-wrap gap-5">
            <Link href="/privacy" className="transition-luxury hover:text-foreground">
              Privacy
            </Link>
            <Link href="/terms" className="transition-luxury hover:text-foreground">
              Terms
            </Link>
            {site.social.instagram ?
              <Link
                href={site.social.instagram}
                className="transition-luxury hover:text-foreground"
                target="_blank"
                rel="noreferrer noopener"
              >
                Instagram
              </Link>
            : null}
          </div>
        </div>
      </Container>
    </footer>
  );
}
